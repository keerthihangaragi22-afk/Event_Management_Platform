import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { generateRegistrationId, generateTicketNumber, generateSecureToken } from "@/lib/utils";
import { generateQRCodeDataUrl } from "@/lib/qr/generate";
import { sendEmail, personalizeTemplate } from "@/lib/email/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, organization, designation, city, country, invitationCode } = body;

    if (!fullName || !email) {
      return NextResponse.json({ error: "Full name and email are required" }, { status: 400 });
    }

    const event = await prisma.event.findFirst({ where: { isPublished: true } });
    if (!event) {
      return NextResponse.json({ error: "No active event found" }, { status: 404 });
    }

    let invitation = null;
    if (event.registrationMode === "INVITATION") {
      if (!invitationCode) {
        return NextResponse.json({ error: "Invitation code is required" }, { status: 400 });
      }
      invitation = await prisma.invitation.findUnique({ where: { code: invitationCode } });
      if (!invitation || invitation.status !== "ACTIVE" || invitation.eventId !== event.id) {
        return NextResponse.json({ error: "Invalid or expired invitation code" }, { status: 400 });
      }
      if (invitation.usedCount >= invitation.maxUses) {
        return NextResponse.json({ error: "Invitation code has reached maximum uses" }, { status: 400 });
      }
      if (invitation.expiresAt && invitation.expiresAt < new Date()) {
        return NextResponse.json({ error: "Invitation code has expired" }, { status: 400 });
      }
    }

    const existing = await prisma.registration.findFirst({
      where: { eventId: event.id, email: email.toLowerCase() },
    });
    if (existing) {
      return NextResponse.json({ error: "You have already registered for this event" }, { status: 409 });
    }

    let ticketType = await prisma.ticketType.findFirst({
      where: { eventId: event.id, isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    if (!ticketType) {
      ticketType = await prisma.ticketType.create({
        data: {
          eventId: event.id,
          name: "General Guest",
          requiresInvite: true,
          isActive: true,
        },
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const registrationId = generateRegistrationId("TLC", 2027);
      const ticketNumber = generateTicketNumber("TKT");
      const qrToken = generateSecureToken(40);

      const registration = await tx.registration.create({
        data: {
          eventId: event.id,
          ticketTypeId: ticketType!.id,
          registrationId,
          status: "CONFIRMED",
          fullName,
          email: email.toLowerCase(),
          phone,
          organization,
          designation,
          city,
          country,
          invitationId: invitation?.id,
        },
      });

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const qrCodeDataUrl = await generateQRCodeDataUrl(qrToken, appUrl);

      const ticket = await tx.ticket.create({
        data: {
          registrationId: registration.id,
          ticketNumber,
          qrToken,
          qrCodeDataUrl,
          status: "VALID",
        },
      });

      if (invitation) {
        await tx.invitation.update({
          where: { id: invitation.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      return { registration, ticket };
    });

    const spocAssignment = await prisma.spocAssignment.findFirst({
      where: { ticketTypeId: ticketType.id },
      include: { spoc: true },
    });

    const template = await prisma.emailTemplate.findFirst({
      where: { eventId: event.id, type: "confirmation", isActive: true },
    });

    if (template) {
      const html = personalizeTemplate(template.bodyHtml, {
        participant_name: fullName,
        event_name: event.name,
        event_date: "17–19 February 2027",
        event_venue: event.venueName || "",
        registration_id: result.registration.registrationId,
        ticket_number: result.ticket.ticketNumber,
        ticket_type: ticketType.name,
        spoc_name: spocAssignment?.spoc.name || "",
        spoc_email: spocAssignment?.spoc.email || "",
        spoc_phone: spocAssignment?.spoc.phone || "",
      });

      await sendEmail({
        to: email,
        subject: personalizeTemplate(template.subject, {
          event_name: event.name,
          participant_name: fullName,
        }),
        html,
      });
    }

    return NextResponse.json({
      success: true,
      registrationId: result.registration.registrationId,
      ticketNumber: result.ticket.ticketNumber,
      qrCodeDataUrl: result.ticket.qrCodeDataUrl,
      spoc: spocAssignment?.spoc
        ? {
            name: spocAssignment.spoc.name,
            email: spocAssignment.spoc.email,
            phone: spocAssignment.spoc.phone,
          }
        : null,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};
    if (status) where.status = status;

    const [registrations, total] = await Promise.all([
      prisma.registration.findMany({
        where,
        include: { ticketType: true, ticket: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.registration.count({ where }),
    ]);

    return NextResponse.json({
      data: registrations,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

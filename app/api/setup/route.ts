import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";

/**
 * One-time browser-accessible setup endpoint.
 * Students can visit /api/setup after deployment to initialize the database.
 * Protected by a simple setup token (or runs only if no users exist).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { adminEmail, adminPassword, adminName, setupSecret } = body;

    const userCount = await prisma.user.count();
    const expectedSecret = process.env.SETUP_SECRET;

    if (userCount > 0 && (!expectedSecret || setupSecret !== expectedSecret)) {
      return NextResponse.json(
        { error: "Setup already completed. Provide SETUP_SECRET to re-run." },
        { status: 403 }
      );
    }

    const roleNames = [
      { name: "SUPER_ADMIN", description: "Full system access" },
      { name: "EVENT_MANAGER", description: "Manage event content and registrations" },
      { name: "SPEAKER_MANAGER", description: "Manage speakers" },
      { name: "SPONSOR_MANAGER", description: "Manage sponsors" },
      { name: "REGISTRATION_MANAGER", description: "Manage registrations and tickets" },
      { name: "CHECKIN_STAFF", description: "QR check-in only" },
    ];

    for (const r of roleNames) {
      await prisma.role.upsert({
        where: { name: r.name },
        update: {},
        create: r,
      });
    }

    const email = adminEmail || "admin@thelegacycircle.org";
    const password = adminPassword || "Admin@Legacy2027";
    const name = adminName || "Super Admin";
    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await prisma.user.upsert({
      where: { email },
      update: { passwordHash, name },
      create: {
        email,
        name,
        passwordHash,
        isActive: true,
      },
    });

    const superRole = await prisma.role.findUnique({ where: { name: "SUPER_ADMIN" } });
    if (superRole) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: admin.id, roleId: superRole.id } },
        update: {},
        create: { userId: admin.id, roleId: superRole.id },
      });
    }

    let event = await prisma.event.findFirst();
    if (!event) {
      event = await prisma.event.create({
        data: {
          name: "THE LEGACY CIRCLE 2027",
          tagline: "Where Giving Creates a Lasting Legacy.",
          description: `The Legacy Circle 2027 is an exclusive Social Impact and Fundraising Gala bringing together renowned philanthropists, corporate leaders, influential personalities and changemakers to inspire generosity, build meaningful partnerships and create lasting social impact.

Join us for three days of inspiring conversations, premium networking, fundraising initiatives and celebrations of positive change.

17–19 February 2027 | The Leela Palace, New Delhi`,
          category: "Charity & Philanthropy Gala",
          theme: "The Power of Giving – Creating a Legacy of Change",
          startDate: new Date("2027-02-17T09:00:00+05:30"),
          endDate: new Date("2027-02-19T22:00:00+05:30"),
          startTime: "9:00 AM",
          endTime: "10:00 PM",
          venueName: "The Leela Palace, New Delhi",
          venueAddress:
            "The Leela Palace, Africa Avenue, Diplomatic Enclave, Chanakyapuri, New Delhi, Delhi – 110023, India",
          googleMapsUrl: "https://maps.app.goo.gl/QB7seZvzGT55wN8NA",
          contactEmail: "connect@thelegacycircle.com",
          contactPhone: "7676496280",
          websiteUrl: "www.thelegacycircle.org",
          isPublished: true,
          registrationMode: "INVITATION",
        },
      });

      const pages = [
        "home", "about", "agenda", "speakers", "sponsors",
        "artists", "venue", "register", "contact", "privacy", "terms",
      ];
      for (let i = 0; i < pages.length; i++) {
        await prisma.eventPage.create({
          data: {
            eventId: event.id,
            slug: pages[i],
            title: pages[i].charAt(0).toUpperCase() + pages[i].slice(1),
            isEnabled: true,
            sortOrder: i,
          },
        });
      }

      await prisma.ticketType.create({
        data: {
          eventId: event.id,
          name: "General Guest",
          description: "Invitation-based attendance",
          requiresInvite: true,
          isActive: true,
          sortOrder: 0,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Setup completed successfully",
      adminEmail: email,
      note: "Please change the default password after first login.",
      eventId: event.id,
    });
  } catch (error: any) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: error.message || "Setup failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const eventCount = await prisma.event.count();
    return NextResponse.json({
      initialized: userCount > 0,
      userCount,
      eventCount,
      message: userCount > 0
        ? "Database already initialized"
        : "Database not initialized. POST to this endpoint to set up.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Database connection failed", details: error.message },
      { status: 500 }
    );
  }
}

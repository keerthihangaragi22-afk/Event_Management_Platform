import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  const roles = [
    { name: "SUPER_ADMIN", description: "Full system access" },
    { name: "EVENT_MANAGER", description: "Manage event content and registrations" },
    { name: "SPEAKER_MANAGER", description: "Manage speakers" },
    { name: "SPONSOR_MANAGER", description: "Manage sponsors" },
    { name: "REGISTRATION_MANAGER", description: "Manage registrations and tickets" },
    { name: "CHECKIN_STAFF", description: "QR check-in only" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }
  console.log("Roles created");

  const passwordHash = await bcrypt.hash("Admin@Legacy2027", 12);
  const superAdminRole = await prisma.role.findUnique({ where: { name: "SUPER_ADMIN" } });

  const admin = await prisma.user.upsert({
    where: { email: "admin@thelegacycircle.org" },
    update: {},
    create: {
      email: "admin@thelegacycircle.org",
      name: "Super Admin",
      passwordHash,
      isActive: true,
    },
  });

  if (superAdminRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: admin.id,
          roleId: superAdminRole.id,
        },
      },
      update: {},
      create: {
        userId: admin.id,
        roleId: superAdminRole.id,
      },
    });
  }
  console.log("Super Admin created");

  const event = await prisma.event.upsert({
    where: { id: "legacy-circle-2027" },
    update: {},
    create: {
      id: "legacy-circle-2027",
      name: "THE LEGACY CIRCLE 2027",
      tagline: "Where Giving Creates a Lasting Legacy.",
      description: `The Legacy Circle 2027 is an exclusive Social Impact and Fundraising Gala bringing together renowned philanthropists, corporate leaders, influential personalities and changemakers to inspire generosity, build meaningful partnerships and create lasting social impact.

Join us for three days of inspiring conversations, premium networking, fundraising initiatives and celebrations of positive change.

17–19 February 2027 | The Leela Palace, New Delhi

Where Giving Creates a Lasting Legacy.`,
      category: "Charity & Philanthropy Gala",
      theme: "The Power of Giving – Creating a Legacy of Change",
      startDate: new Date("2027-02-17T09:00:00+05:30"),
      endDate: new Date("2027-02-19T22:00:00+05:30"),
      startTime: "9:00 AM",
      endTime: "10:00 PM",
      venueName: "The Leela Palace, New Delhi",
      venueAddress: "The Leela Palace, Africa Avenue, Diplomatic Enclave, Chanakyapuri, New Delhi, Delhi – 110023, India",
      googleMapsUrl: "https://maps.app.goo.gl/QB7seZvzGT55wN8NA",
      contactEmail: "connect@thelegacycircle.com",
      contactPhone: "7676496280",
      websiteUrl: "www.thelegacycircle.org",
      isPublished: true,
      registrationMode: "INVITATION",
    },
  });
  console.log("Event created");

  const settings = [
    { key: "primary_color", value: "#c4923a" },
    { key: "secondary_color", value: "#102a43" },
    { key: "background_color", value: "#0a1929" },
    { key: "text_color", value: "#f5edd9" },
    { key: "font_family", value: "Playfair Display, Inter" },
  ];

  for (const s of settings) {
    await prisma.eventSetting.upsert({
      where: { eventId_key: { eventId: event.id, key: s.key } },
      update: { value: s.value },
      create: { eventId: event.id, key: s.key, value: s.value },
    });
  }

  const pages = [
    { slug: "home", title: "Home", sortOrder: 0 },
    { slug: "about", title: "About the Event", sortOrder: 1 },
    { slug: "agenda", title: "Event Agenda", sortOrder: 2 },
    { slug: "speakers", title: "Speakers", sortOrder: 3 },
    { slug: "sponsors", title: "Sponsors", sortOrder: 4 },
    { slug: "artists", title: "Artists & Performers", sortOrder: 5 },
    { slug: "venue", title: "Venue & Location", sortOrder: 6 },
    { slug: "register", title: "Registration", sortOrder: 7 },
    { slug: "contact", title: "Contact", sortOrder: 8 },
    { slug: "privacy", title: "Privacy Policy", sortOrder: 9 },
    { slug: "terms", title: "Terms & Conditions", sortOrder: 10 },
  ];

  for (const p of pages) {
    await prisma.eventPage.upsert({
      where: { eventId_slug: { eventId: event.id, slug: p.slug } },
      update: {},
      create: {
        eventId: event.id,
        slug: p.slug,
        title: p.title,
        isEnabled: true,
        sortOrder: p.sortOrder,
      },
    });
  }

  const ticketTypes = [
    { name: "General Guest", description: "Invitation-based general attendance", requiresInvite: true, sortOrder: 0 },
    { name: "VIP / HNI", description: "High Net Worth Individuals and Philanthropists", requiresInvite: true, sortOrder: 1 },
    { name: "Speaker", description: "Confirmed speakers and panelists", requiresInvite: true, sortOrder: 2 },
    { name: "Sponsor Representative", description: "Representatives from sponsoring organizations", requiresInvite: true, sortOrder: 3 },
  ];

  const createdTicketTypes = [];
  for (const tt of ticketTypes) {
    const created = await prisma.ticketType.create({
      data: {
        eventId: event.id,
        name: tt.name,
        description: tt.description,
        requiresInvite: tt.requiresInvite,
        isActive: true,
        sortOrder: tt.sortOrder,
        price: 0,
      },
    });
    createdTicketTypes.push(created);
  }

  const speakers = [
    { name: "Chamique Holdsclaw", title: "Former WNBA Star & Advocate", bio: "Renowned basketball legend and mental health advocate.", isFeatured: true, sortOrder: 0 },
    { name: "Solomon Thomas", title: "NFL Player & Mental Health Advocate", bio: "Professional athlete dedicated to mental health awareness and social impact.", isFeatured: true, sortOrder: 1 },
    { name: "Aly Raisman", title: "Olympic Gold Medalist", bio: "Olympic champion and advocate for athlete safety and empowerment.", isFeatured: true, sortOrder: 2 },
    { name: "Dr. Tracy Dennis-Tiwary", title: "Professor & Author", bio: "Leading expert on anxiety, technology, and mental well-being.", isFeatured: true, sortOrder: 3 },
  ];

  for (const s of speakers) {
    await prisma.speaker.create({
      data: { eventId: event.id, ...s, isVisible: true },
    });
  }

  const spoc = await prisma.spoc.create({
    data: {
      eventId: event.id,
      name: "Ananya Sharma",
      designation: "Event Coordination Manager",
      department: "Event Management",
      email: "ananya@thelegacycircle.org",
      phone: "+91 98765 43210",
      whatsapp: "+91 98765 43210",
      responsibility: "Guest coordination, invitation management, RSVP tracking and VIP communication",
      isActive: true,
    },
  });

  const vipTicket = createdTicketTypes.find((t) => t.name.includes("VIP"));
  if (vipTicket) {
    await prisma.spocAssignment.create({
      data: { spocId: spoc.id, ticketTypeId: vipTicket.id },
    });
  }

  await prisma.invitation.createMany({
    data: [
      { eventId: event.id, code: "LEGACY2027-VIP", maxUses: 50, status: "ACTIVE" },
      { eventId: event.id, code: "LEGACY2027-GUEST", maxUses: 200, status: "ACTIVE" },
    ],
  });

  await prisma.emailTemplate.create({
    data: {
      eventId: event.id,
      name: "Registration Confirmation",
      subject: "Your Registration Confirmation – {{event_name}}",
      type: "confirmation",
      bodyHtml: `<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a1929; color: #f5edd9; padding: 40px;"><h1 style="color: #c4923a; text-align: center;">{{event_name}}</h1><p>Dear {{participant_name}},</p><p>Thank you for registering. Your registration has been confirmed.</p><p><strong>Registration ID:</strong> {{registration_id}}</p><p><strong>Ticket Number:</strong> {{ticket_number}}</p><p><strong>Event:</strong> {{event_name}}</p><p><strong>Dates:</strong> {{event_date}}</p><p><strong>Venue:</strong> {{event_venue}}</p><p>Your dedicated contact: {{spoc_name}} ({{spoc_email}} / {{spoc_phone}})</p><p style="margin-top: 30px; color: #c4923a;">Where Giving Creates a Lasting Legacy.</p></div>`,
      isActive: true,
    },
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

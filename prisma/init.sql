-- Run this entire file in Neon Console SQL Editor
-- Creates all tables for Event Management Platform

CREATE TABLE IF NOT EXISTS "users" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT,
  "avatarUrl" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "emailVerified" TIMESTAMP(3),
  "lastLoginAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "roles" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "permissions" (
  "id" TEXT PRIMARY KEY,
  "code" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "role_permissions" (
  "id" TEXT PRIMARY KEY,
  "roleId" TEXT NOT NULL REFERENCES "roles"("id") ON DELETE CASCADE,
  "permissionId" TEXT NOT NULL REFERENCES "permissions"("id") ON DELETE CASCADE,
  UNIQUE ("roleId", "permissionId")
);

CREATE TABLE IF NOT EXISTS "user_roles" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "roleId" TEXT NOT NULL REFERENCES "roles"("id") ON DELETE CASCADE,
  "scope" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("userId", "roleId")
);

CREATE TABLE IF NOT EXISTS "accounts" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  UNIQUE ("provider", "providerAccountId")
);

CREATE TABLE IF NOT EXISTS "sessions" (
  "id" TEXT PRIMARY KEY,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "expires" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "verification_tokens" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "expires" TIMESTAMP(3) NOT NULL,
  UNIQUE ("identifier", "token")
);

CREATE TABLE IF NOT EXISTS "events" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "tagline" TEXT,
  "description" TEXT,
  "category" TEXT,
  "theme" TEXT,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3) NOT NULL,
  "startTime" TEXT,
  "endTime" TEXT,
  "venueName" TEXT,
  "venueAddress" TEXT,
  "googleMapsUrl" TEXT,
  "contactEmail" TEXT,
  "contactPhone" TEXT,
  "websiteUrl" TEXT,
  "logoUrl" TEXT,
  "bannerUrl" TEXT,
  "faviconUrl" TEXT,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "registrationMode" TEXT NOT NULL DEFAULT 'INVITATION',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "event_settings" (
  "id" TEXT PRIMARY KEY,
  "eventId" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("eventId", "key")
);

CREATE TABLE IF NOT EXISTS "event_pages" (
  "id" TEXT PRIMARY KEY,
  "eventId" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "metaTitle" TEXT,
  "metaDesc" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("eventId", "slug")
);

CREATE TABLE IF NOT EXISTS "event_sections" (
  "id" TEXT PRIMARY KEY,
  "pageId" TEXT NOT NULL REFERENCES "event_pages"("id") ON DELETE CASCADE,
  "type" TEXT NOT NULL,
  "title" TEXT,
  "content" TEXT,
  "config" JSONB,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ticket_types" (
  "id" TEXT PRIMARY KEY,
  "eventId" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "currency" TEXT NOT NULL DEFAULT 'INR',
  "capacity" INTEGER,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "requiresInvite" BOOLEAN NOT NULL DEFAULT false,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "registration_form_fields" (
  "id" TEXT PRIMARY KEY,
  "ticketTypeId" TEXT NOT NULL REFERENCES "ticket_types"("id") ON DELETE CASCADE,
  "label" TEXT NOT NULL,
  "fieldKey" TEXT NOT NULL,
  "fieldType" TEXT NOT NULL,
  "options" JSONB,
  "isRequired" BOOLEAN NOT NULL DEFAULT false,
  "placeholder" TEXT,
  "helpText" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "validation" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "invitations" (
  "id" TEXT PRIMARY KEY,
  "eventId" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
  "ticketTypeId" TEXT REFERENCES "ticket_types"("id"),
  "code" TEXT NOT NULL UNIQUE,
  "email" TEXT,
  "fullName" TEXT,
  "maxUses" INTEGER NOT NULL DEFAULT 1,
  "usedCount" INTEGER NOT NULL DEFAULT 0,
  "expiresAt" TIMESTAMP(3),
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "invitations_code_idx" ON "invitations"("code");

CREATE TABLE IF NOT EXISTS "registrations" (
  "id" TEXT PRIMARY KEY,
  "eventId" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
  "ticketTypeId" TEXT NOT NULL REFERENCES "ticket_types"("id"),
  "registrationId" TEXT NOT NULL UNIQUE,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "organization" TEXT,
  "designation" TEXT,
  "city" TEXT,
  "country" TEXT,
  "rsvpStatus" TEXT,
  "invitationId" TEXT REFERENCES "invitations"("id"),
  "answers" JSONB,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("eventId", "email", "ticketTypeId")
);

CREATE INDEX IF NOT EXISTS "registrations_email_idx" ON "registrations"("email");
CREATE INDEX IF NOT EXISTS "registrations_status_idx" ON "registrations"("status");

CREATE TABLE IF NOT EXISTS "tickets" (
  "id" TEXT PRIMARY KEY,
  "registrationId" TEXT NOT NULL UNIQUE REFERENCES "registrations"("id") ON DELETE CASCADE,
  "ticketNumber" TEXT NOT NULL UNIQUE,
  "qrToken" TEXT NOT NULL UNIQUE,
  "qrCodeDataUrl" TEXT,
  "status" TEXT NOT NULL DEFAULT 'VALID',
  "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ticket_verifications" (
  "id" TEXT PRIMARY KEY,
  "ticketId" TEXT NOT NULL REFERENCES "tickets"("id") ON DELETE CASCADE,
  "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "verifiedBy" TEXT,
  "result" TEXT NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "notes" TEXT
);

CREATE TABLE IF NOT EXISTS "check_ins" (
  "id" TEXT PRIMARY KEY,
  "ticketId" TEXT NOT NULL REFERENCES "tickets"("id") ON DELETE CASCADE,
  "checkedInBy" TEXT REFERENCES "users"("id"),
  "checkedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "location" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "speakers" (
  "id" TEXT PRIMARY KEY,
  "eventId" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "title" TEXT,
  "bio" TEXT,
  "photoUrl" TEXT,
  "company" TEXT,
  "linkedinUrl" TEXT,
  "twitterUrl" TEXT,
  "sessionTitle" TEXT,
  "sessionTime" TEXT,
  "sessionDay" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "sponsors" (
  "id" TEXT PRIMARY KEY,
  "eventId" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "logoUrl" TEXT,
  "websiteUrl" TEXT,
  "tier" TEXT,
  "category" TEXT,
  "description" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "artists" (
  "id" TEXT PRIMARY KEY,
  "eventId" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "bio" TEXT,
  "photoUrl" TEXT,
  "performance" TEXT,
  "day" TEXT,
  "time" TEXT,
  "stage" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "performers" (
  "id" TEXT PRIMARY KEY,
  "eventId" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "bio" TEXT,
  "photoUrl" TEXT,
  "performance" TEXT,
  "day" TEXT,
  "time" TEXT,
  "stage" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "volunteers" (
  "id" TEXT PRIMARY KEY,
  "eventId" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "role" TEXT,
  "department" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "spocs" (
  "id" TEXT PRIMARY KEY,
  "eventId" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "designation" TEXT,
  "department" TEXT,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "whatsapp" TEXT,
  "photoUrl" TEXT,
  "responsibility" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "spoc_assignments" (
  "id" TEXT PRIMARY KEY,
  "spocId" TEXT NOT NULL REFERENCES "spocs"("id") ON DELETE CASCADE,
  "ticketTypeId" TEXT NOT NULL REFERENCES "ticket_types"("id") ON DELETE CASCADE,
  "notes" TEXT,
  UNIQUE ("spocId", "ticketTypeId")
);

CREATE TABLE IF NOT EXISTS "email_templates" (
  "id" TEXT PRIMARY KEY,
  "eventId" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "bodyHtml" TEXT NOT NULL,
  "bodyText" TEXT,
  "type" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "email_campaigns" (
  "id" TEXT PRIMARY KEY,
  "eventId" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "bodyHtml" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "scheduledAt" TIMESTAMP(3),
  "sentAt" TIMESTAMP(3),
  "recipientType" TEXT,
  "recipientFilter" JSONB,
  "totalRecipients" INTEGER NOT NULL DEFAULT 0,
  "sentCount" INTEGER NOT NULL DEFAULT 0,
  "failedCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "email_recipients" (
  "id" TEXT PRIMARY KEY,
  "campaignId" TEXT NOT NULL REFERENCES "email_campaigns"("id") ON DELETE CASCADE,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "sentAt" TIMESTAMP(3),
  "error" TEXT,
  "metadata" JSONB
);

CREATE TABLE IF NOT EXISTS "email_logs" (
  "id" TEXT PRIMARY KEY,
  "campaignId" TEXT REFERENCES "email_campaigns"("id"),
  "toEmail" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "resendId" TEXT,
  "error" TEXT,
  "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "metadata" JSONB
);

CREATE TABLE IF NOT EXISTS "reminders" (
  "id" TEXT PRIMARY KEY,
  "eventId" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "bodyHtml" TEXT NOT NULL,
  "scheduledAt" TIMESTAMP(3) NOT NULL,
  "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
  "recipientType" TEXT,
  "recipientFilter" JSONB,
  "sentAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "reminder_recipients" (
  "id" TEXT PRIMARY KEY,
  "reminderId" TEXT NOT NULL REFERENCES "reminders"("id") ON DELETE CASCADE,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "sentAt" TIMESTAMP(3),
  "error" TEXT
);

CREATE TABLE IF NOT EXISTS "media_assets" (
  "id" TEXT PRIMARY KEY,
  "eventId" TEXT REFERENCES "events"("id"),
  "filename" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "mimeType" TEXT,
  "size" INTEGER,
  "altText" TEXT,
  "folder" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "audit_logs" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT REFERENCES "users"("id"),
  "action" TEXT NOT NULL,
  "entityType" TEXT,
  "entityId" TEXT,
  "details" JSONB,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "audit_logs_entity_idx" ON "audit_logs"("entityType", "entityId");
CREATE INDEX IF NOT EXISTS "audit_logs_created_idx" ON "audit_logs"("createdAt");

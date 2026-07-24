# Byroo Email Infrastructure Developer Guide

This document details the production-ready email infrastructure designed and implemented for Byroo. It handles transactional dispatches, lifecycle onboarding automations, admin marketing campaigns, secure unsubscribe flows, analytics, and queue management.

---

## Architecture Overview

The system uses a decoupled, event-driven architecture to ensure fast API responses and high reliability:

```mermaid
graph TD
    App[Next.js App & Actions] -->|Enqueue Job| Queue[Inngest Event Queue]
    Queue -->|Process Event| Worker[Background Worker]
    Worker -->|Render HTML/Text| ReactEmail[React Email Rendering Engine]
    Worker -->|Send Payload| ResendSDK[Resend Client API]
    ResendSDK -->|Webhook Events| Webhook[Webhook Handler API]
    Webhook -->|Log Metrics| DB[(PostgreSQL Database)]
    DB -->|Read Logs & Campaigns| Dashboard[Admin Dashboard]
```

1. **Email Service Layer (`src/services/email.ts`)**: Exposes highly typed methods (e.g., `sendWelcomeEmail()`) to the rest of the application. The rest of the code never calls Resend or renders templates directly.
2. **Queue Broker (`src/lib/email/queue.ts`)**: Uses **Inngest** to offload email rendering and delivery from the main HTTP thread. If Inngest is not active, it automatically falls back to safe asynchronous direct sending (using dynamic imports) to keep local development friction-free.
3. **Template Registry (`emails/templates/`)**: Built using **React Email** with an custom design system (`emails/components/Primitives.tsx`) to enforce cohesive Byroo branding, mobile responsiveness, and dark/light color contrast.
4. **Database Logging & Preferences (`prisma/schema.prisma`)**: Tracks delivery states (delivered, opened, clicked, bounced) and checks opt-in flags. Critical security notifications bypass preference checks.

---

## Directory Structure

```text
/
├── prisma/
│   ├── schema.prisma           # Prisma 7 Database schema containing email & preference tables
│   └── prisma.config.ts        # Prisma 7 CLI configuration mapping Database URLs
├── supabase/
│   └── migrations/
│       └── 20260723000000_email_infrastructure.sql # SQL migration mapping the schema for Supabase
├── emails/
│   ├── components/
│   │   └── Primitives.tsx      # Core typography, CTA, footer, logo & business card design components
│   ├── layouts/
│   │   └── BrandedLayout.tsx   # Master layout setting responsive tables, reset styles & Tailwind theme
│   └── templates/
│       ├── auth.tsx            # Welcome, verification, reset-password, and email change alerts
│       ├── business.tsx        # Verification badges, approved, rejected, or suspended vendor notices
│       ├── activity.tsx        # Inquiries, reviews, messages, bookings, and storefront orders
│       ├── billing.tsx         # Payment receipts, renewal notices, payment failure, and trial endings
│       ├── security.tsx        # New logins, suspicious activity blocking, and password changes
│       ├── lifecycle.tsx       # Onboarding flow (Day 0, Day 2, Day 5, Day 7, Day 14, Day 30)
│       └── digests.tsx         # Weekly performance updates and monthly growth reports
└── src/
    ├── app/
    │   ├── admin/
    │   │   └── email/          # Admin Email Dashboard, recent logs, template tests, and Campaign builder
    │   ├── api/
    │   │   ├── email/
    │   │   │   └── unsubscribe/# API processing opt-outs
    │   │   └── inngest/        # Inngest API worker route for crons, lifecycles, and queue events
    │   └── unsubscribe/        # Secure front-end user preference dashboard
    ├── lib/
    │   ├── email/
    │   │   ├── client.ts       # Resend SDK instance, exponential backoff, and mock fallbacks
    │   │   ├── config.ts       # Centralized brand, reply-to, and sender configurations
    │   │   └── token.ts        # Constant-time timing-safe HMAC token verification
    │   └── prisma.ts           # Prisma 7 client initialization using pg driver adapters
    └── services/
        ├── email.ts            # Public API exposing send methods
        ├── email-preference.ts # Preferences checks for opt-out bypasses
        └── email-analytics.ts  # Database audit trail log updates
```

---

## How to Add New Templates

Adding a new template to Byroo is a three-step process:

### 1. Write the React Email Component
Create your template using the brand primitives. You can add it to an existing file in `emails/templates/` or create a new file:

```tsx
// emails/templates/custom.tsx
import * as React from "react";
import { BrandedLayout } from "../layouts/BrandedLayout";
import { EmailH1, EmailBody, EmailCTA } from "../components/Primitives";

export const CustomNoticeEmail: React.FC<{ name: string; unsubscribeToken?: string }> = ({
  name = "User",
  unsubscribeToken,
}) => (
  <BrandedLayout previewText="Crucial update about your account" unsubscribeToken={unsubscribeToken}>
    <EmailH1>Update, {name}!</EmailH1>
    <EmailBody>We have updated our platform parameters.</EmailBody>
    <EmailCTA title="Read changes" description="Read full legal terms." buttonText="View Changes" href="https://byroo.digital/terms" />
  </BrandedLayout>
);
```

### 2. Export the Template in the Registry
Ensure the template is exported in `emails/templates/index.ts`:
```typescript
export * from "./custom";
```

### 3. Add a Service Method
Create a corresponding method in `src/services/email.ts`:
```typescript
async sendCustomNotice(userId: string, email: string, name: string) {
  const unsubToken = generateUnsubscribeToken(userId, email);
  return this.send({
    userId,
    recipientEmail: email,
    subject: "Important Platform Notice",
    templateName: "custom-notice",
    category: "systemNotifications", // Categories: marketing, weeklyReports, monthlyReports, systemNotifications, etc.
    variables: { name },
    templateComponent: React.createElement(CustomNoticeEmail, { name, unsubscribeToken: unsubToken }),
  });
}
```

---

## Triggering Queue Events & Onboarding

To dispatch emails asynchronously, import the queue wrapper and pass the parameters:

```typescript
import { enqueueEmail } from "@/lib/email/queue";

await enqueueEmail("client@example.com", "welcome", { name: "John Doe" }, { userId: "user-uuid" });
```

### Onboarding Lifecycles
When a user signs up, trigger the onboarding lifecycle flow:

```typescript
import { inngest } from "@/lib/email/queue";

await inngest.send({
  name: "user/signup",
  data: {
    userId: user.id,
    email: user.email,
    name: user.display_name,
  },
});
```
This automatically initiates the Day 0 -> Day 30 sleep/check worker sequence, polling database fields before dispatching emails.

---

## Environment Variables

Configure the following variables in your `.env.local` or hosting provider dashboard:

```env
# Database Connection (Prisma 7 Postgres)
DATABASE_URL="postgresql://postgres:[password]@db.tjsuogrundsuuvqxydfe.supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[password]@db.tjsuogrundsuuvqxydfe.supabase.co:5432/postgres"

# Resend API Configuration
RESEND_API_KEY="re_123456789"
RESEND_SENDER_EMAIL="noreply@byroo.digital"
RESEND_SENDER_NAME="Byroo"
RESEND_REPLY_TO="support@byroo.digital"

# Security Token Secret (For signing unsubscribe tokens)
EMAIL_TOKEN_SECRET="generate-a-secure-long-random-string"

# Inngest Cloud Configurations (Optional in development, required in production)
INNGEST_EVENT_KEY="your-inngest-key"
INNGEST_SIGNING_KEY="your-inngest-signing-key"

# Configurable lifecycle delays (Optional, defaults to standard days: '2d', '3d', '7d')
ONBOARDING_DAY2_DELAY="2d"
ONBOARDING_DAY5_DELAY="3d"
ONBOARDING_DAY7_DELAY="2d"
ONBOARDING_DAY14_DELAY="7d"
ONBOARDING_DAY30_DELAY="16d"
```

---

## Common Pitfalls & Solutions

1. **Prisma 7 Database URL error**: Prisma 7 does not support datasource connection URLs inside the `schema.prisma` file directly. Always specify them in `prisma.config.ts` and set up the `pg` client wrapper adapter in your runtime codebase (`src/lib/prisma.ts`).
2. **Next.js Suspense warnings on Unsubscribe Page**: Next.js App Router requires pages using `useSearchParams` to be enclosed in a `<Suspense>` boundary during client side rendering. The unsubscribe page is fully wrapped in Suspense to prevent build failures.
3. **Resend API Rate Limits**: Resend limits free accounts to 10 dispatches per second. The client wrapper (`src/lib/email/client.ts`) handles this by implementing exponential backoff retries with jitter to prevent rate limit dropouts.
4. **Offline Local Queue**: If running local development, you can start the Inngest Dev Server by running `npx inngest-cli@latest dev`. If you choose not to run it, the code catches the failure and falls back to safe immediate sending so that login/signup flows do not freeze.

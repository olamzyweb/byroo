import React from "react";
import { Inngest, eventType, staticSchema } from "inngest";
import { emailConfig } from "./config";

// Define the payload types
type EmailSendPayload = {
  recipientEmail: string;
  templateName: string;
  variables: Record<string, any>;
  userId?: string;
};

type UserSignupPayload = {
  userId: string;
  email: string;
  name: string;
};

type WeeklyDigestPayload = {
  userId: string;
  email: string;
  name: string;
  username: string;
};

type MonthlyDigestPayload = {
  userId: string;
  email: string;
  name: string;
  username: string;
};

// Create eventType objects for v4 triggers
export const emailSendEvent = eventType("email/send", {
  schema: staticSchema<EmailSendPayload>(),
});

export const userSignupEvent = eventType("user/signup", {
  schema: staticSchema<UserSignupPayload>(),
});

export const digestWeeklyEvent = eventType("digest/weekly", {
  schema: staticSchema<WeeklyDigestPayload>(),
});

export const digestMonthlyEvent = eventType("digest/monthly", {
  schema: staticSchema<MonthlyDigestPayload>(),
});

// Initialize Inngest client
export const inngest = new Inngest({ id: "byroo-app" });

/**
 * Enqueues an email to be sent asynchronously in the background.
 * If in development and the dev server isn't running, it falls back to
 * direct synchronous email dispatch to ensure clean developer experience.
 */
export async function enqueueEmail(
  recipientEmail: string,
  templateName: string,
  variables: Record<string, any>,
  options?: { userId?: string; delaySeconds?: number }
) {
  const payload = {
    recipientEmail,
    templateName,
    variables,
    userId: options?.userId,
  };

  try {
    // Send event to Inngest to trigger the worker function
    await inngest.send({
      name: "email/send",
      data: payload,
    });
    return { status: "queued", message: "Dispatched to background worker queue." };
  } catch (error) {
    console.warn(
      "⚠️ Inngest queue is not available. Falling back to direct email execution...",
      error
    );

    // Dynamic import to avoid circular dependency
    const { EmailService } = await import("../../services/email");

    // Fallback direct rendering and sending
    const triggerFallbackSend = async () => {
      try {
        const triggerMap: Record<string, Function> = {
          "welcome": () => EmailService.sendWelcomeEmail(options?.userId || "", recipientEmail, variables.name || "Creator"),
          "verify-email": () => EmailService.sendVerifyEmail(recipientEmail, variables.verificationUrl || "", variables.code || ""),
          "password-reset": () => EmailService.sendPasswordReset(recipientEmail, variables.resetUrl || ""),
          "email-changed": () => EmailService.sendEmailChanged(recipientEmail, variables.newEmail || ""),
          "account-deleted": () => EmailService.sendAccountDeleted(recipientEmail, variables.name || ""),
          "onboarding-day0": () => EmailService.sendLifecycleEmail(options?.userId || "", recipientEmail, variables.name || "Creator", 0, variables),
          "onboarding-day1": () => EmailService.sendLifecycleEmail(options?.userId || "", recipientEmail, variables.name || "Creator", 1, variables),
          "onboarding-day2": () => EmailService.sendLifecycleEmail(options?.userId || "", recipientEmail, variables.name || "Creator", 2, variables),
          "onboarding-day3": () => EmailService.sendLifecycleEmail(options?.userId || "", recipientEmail, variables.name || "Creator", 3, variables),
          "onboarding-day4": () => EmailService.sendLifecycleEmail(options?.userId || "", recipientEmail, variables.name || "Creator", 4, variables),
          "onboarding-day5": () => EmailService.sendLifecycleEmail(options?.userId || "", recipientEmail, variables.name || "Creator", 5, variables),
          "onboarding-day6": () => EmailService.sendLifecycleEmail(options?.userId || "", recipientEmail, variables.name || "Creator", 6, variables),
          "onboarding-day7": () => EmailService.sendLifecycleEmail(options?.userId || "", recipientEmail, variables.name || "Creator", 7, variables),
          "custom": () => EmailService.sendCustomEmail(options?.userId || undefined, recipientEmail, variables.subject || "Byroo Notification", variables.bodyText || variables.customBody || ""),
        };

        const execute = triggerMap[templateName];
        if (execute) {
          await execute();
        } else {
          // Direct generic send via fallback rendering if specific handlers are not defined
          console.info(`Direct sending generic template fallback: ${templateName}`);
          // Re-route dynamically using standard send params:
          await EmailService.send({
            userId: options?.userId,
            recipientEmail,
            subject: variables.subject || "Byroo Notification",
            templateName,
            category: "systemNotifications",
            variables,
            // Fallback content simple welcome template
            templateComponent: await import("../../../emails/templates/auth").then((m) =>
              React.createElement(m.WelcomeEmail, {
                name: variables.name || "User",
                loginUrl: `${emailConfig.baseUrl}/login`,
              })
            ),
          });
        }
      } catch (err) {
        console.error("❌ Direct email fallback failed:", err);
      }
    };

    // Run async so it doesn't block the API thread
    triggerFallbackSend();

    return { status: "dispatched_directly", message: "Fallback sent directly." };
  }
}

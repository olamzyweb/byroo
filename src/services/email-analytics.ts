import { prisma } from "../lib/prisma";

export type EmailDeliveryStatus =
  | "queued"
  | "sent"
  | "delivered"
  | "opened"
  | "clicked"
  | "bounced"
  | "failed";

export const EmailAnalyticsService = {
  /**
   * Logs a new email dispatch attempt.
   */
  async logEmailAttempt({
    userId,
    recipientEmail,
    subject,
    templateName,
    variables,
    status = "queued",
  }: {
    userId?: string;
    recipientEmail: string;
    subject: string;
    templateName: string;
    variables: Record<string, any>;
    status?: EmailDeliveryStatus;
  }) {
    return prisma.emailLog.create({
      data: {
        userId,
        recipientEmail,
        subject,
        templateName,
        variables: variables as any,
        status,
      },
    });
  },

  /**
   * Updates the status of an existing email log using the Resend message ID.
   */
  async updateLogMessageId(logId: string, resendMessageId: string, status: EmailDeliveryStatus = "sent") {
    return prisma.emailLog.update({
      where: { id: logId },
      data: {
        resendMessageId,
        status,
      },
    });
  },

  /**
   * Logs a send error for an email log.
   */
  async logEmailFailure(logId: string, errorDetails: string) {
    return prisma.emailLog.update({
      where: { id: logId },
      data: {
        status: "failed",
        errorDetails,
      },
    });
  },

  /**
   * Records a tracking event (delivered, open, click, bounce, complaint, unsubscribe).
   */
  async recordEvent({
    resendMessageId,
    eventType,
    urlClicked,
    ipAddress,
    userAgent,
  }: {
    resendMessageId: string;
    eventType: "delivered" | "open" | "click" | "bounce" | "complaint" | "unsubscribe";
    urlClicked?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    // 1. Find the corresponding email log
    const log = await prisma.emailLog.findUnique({
      where: { resendMessageId },
    });

    if (!log) {
      console.warn(`⚠️ Received tracking event '${eventType}' for unknown Resend message ID: ${resendMessageId}`);
      return null;
    }

    // 2. Map tracking event to EmailLog delivery status
    let statusUpdate: EmailDeliveryStatus | null = null;
    let openedAt: Date | null = null;
    let clickedAt: Date | null = null;
    let bouncedAt: Date | null = null;

    if (eventType === "delivered") {
      statusUpdate = "delivered";
    } else if (eventType === "open") {
      statusUpdate = "opened";
      openedAt = new Date();
    } else if (eventType === "click") {
      statusUpdate = "clicked";
      clickedAt = new Date();
    } else if (eventType === "bounce" || eventType === "complaint") {
      statusUpdate = "bounced";
      bouncedAt = new Date();
    }

    // 3. Update the log status
    await prisma.emailLog.update({
      where: { id: log.id },
      data: {
        ...(statusUpdate ? { status: statusUpdate } : {}),
        ...(openedAt ? { openedAt } : {}),
        ...(clickedAt ? { clickedAt } : {}),
        ...(bouncedAt ? { bouncedAt } : {}),
      },
    });

    // 4. Create the analytics log
    const analyticsEntry = await prisma.emailAnalytics.create({
      data: {
        emailLogId: log.id,
        eventType,
        urlClicked,
        ipAddress,
        userAgent,
      },
    });

    // 5. If this email log is part of an admin campaign, update the campaign stats
    const campaignRecipient = await prisma.campaignRecipient.findFirst({
      where: { resendMessageId },
    });

    if (campaignRecipient) {
      const updateData: Record<string, any> = {};

      if (eventType === "delivered") {
        updateData.deliveredCount = { increment: 1 };
      } else if (eventType === "open" && log.status !== "opened" && log.status !== "clicked") {
        // Prevent double counting if already opened/clicked
        updateData.openedCount = { increment: 1 };
      } else if (eventType === "click" && log.status !== "clicked") {
        updateData.clickedCount = { increment: 1 };
        // If it was opened for the first time on click:
        if (log.status !== "opened") {
          updateData.openedCount = { increment: 1 };
        }
      } else if (eventType === "bounce") {
        updateData.bouncedCount = { increment: 1 };
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.emailCampaign.update({
          where: { id: campaignRecipient.campaignId },
          data: updateData,
        });
      }

      // Update individual recipient status
      await prisma.campaignRecipient.update({
        where: { id: campaignRecipient.id },
        data: {
          status: eventType === "bounce" ? "failed" : "sent",
          error: eventType === "bounce" ? "Bounced" : null,
        },
      });
    }

    return analyticsEntry;
  },

  /**
   * Retrieves summary analytics.
   */
  async getSummaryStats() {
    const totalCount = await prisma.emailLog.count();
    const sentCount = await prisma.emailLog.count({ where: { status: "sent" } });
    const deliveredCount = await prisma.emailLog.count({ where: { status: "delivered" } });
    const openedCount = await prisma.emailLog.count({ where: { status: "opened" } });
    const clickedCount = await prisma.emailLog.count({ where: { status: "clicked" } });
    const failedCount = await prisma.emailLog.count({ where: { status: "failed" } });
    const bouncedCount = await prisma.emailLog.count({ where: { status: "bounced" } });

    return {
      totalCount,
      sentCount,
      deliveredCount,
      openedCount,
      clickedCount,
      failedCount,
      bouncedCount,
      openRate: totalCount > 0 ? ((openedCount + clickedCount) / totalCount) * 100 : 0,
      clickRate: totalCount > 0 ? (clickedCount / totalCount) * 100 : 0,
    };
  }
};
export default EmailAnalyticsService;

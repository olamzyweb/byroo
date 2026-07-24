"use server";

import { prisma } from "../../../lib/prisma";
import { EmailService } from "../../../services/email";
import { EmailAnalyticsService } from "../../../services/email-analytics";
import { enqueueEmail } from "../../../lib/email/queue";

/**
 * Fetches dashboard stats.
 */
export async function getEmailStats() {
  try {
    return await EmailAnalyticsService.getSummaryStats();
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      totalCount: 0,
      sentCount: 0,
      deliveredCount: 0,
      openedCount: 0,
      clickedCount: 0,
      failedCount: 0,
      bouncedCount: 0,
      openRate: 0,
      clickRate: 0,
    };
  }
}

/**
 * Fetches recent logs with template details.
 */
export async function getRecentLogs(limit = 20) {
  try {
    return await prisma.emailLog.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        profile: {
          select: { displayName: true },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return [];
  }
}

/**
 * Retries sending a failed log.
 */
export async function retryFailedEmail(logId: string) {
  try {
    const log = await prisma.emailLog.findUnique({
      where: { id: logId },
    });

    if (!log) {
      return { success: false, error: "Email log not found" };
    }

    if (log.status !== "failed" && log.status !== "queued") {
      return { success: false, error: "Only failed or queued emails can be retried" };
    }

    // Re-trigger dispatch using queue service
    await enqueueEmail(log.recipientEmail, log.templateName, log.variables as any, {
      userId: log.userId || undefined,
    });

    // Reset status to queued
    await prisma.emailLog.update({
      where: { id: logId },
      data: { status: "queued", errorDetails: null },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error retrying email:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Sends a single test email.
 */
export async function sendTestEmail(recipientEmail: string, templateName: string, variables: any) {
  try {
    const result = await enqueueEmail(recipientEmail, templateName, variables);
    return { success: true, result };
  } catch (error: any) {
    console.error("Error sending test email:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetches campaigns history.
 */
export async function getCampaigns() {
  try {
    return await prisma.emailCampaign.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return [];
  }
}

/**
 * Creates a new email campaign.
 */
export async function createCampaign(
  title: string,
  subject: string,
  templateName: string,
  customBody: string | null,
  audienceFilter: { plan?: string; onboarded?: boolean },
  scheduledAt: string | null
) {
  try {
    const campaign = await prisma.emailCampaign.create({
      data: {
        title,
        subject,
        templateName,
        customBody,
        audienceFilter: audienceFilter as any,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: scheduledAt ? "scheduled" : "draft",
      },
    });

    return { success: true, campaign };
  } catch (error: any) {
    console.error("Error creating campaign:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Triggers/launches a campaign immediately to all matching users in the filter.
 */
export async function launchCampaign(campaignId: string) {
  try {
    const campaign = await prisma.emailCampaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return { success: false, error: "Campaign not found" };
    }

    if (campaign.status === "sending" || campaign.status === "completed") {
      return { success: false, error: "Campaign already executed or active" };
    }

    // 1. Mark campaign status as sending
    await prisma.emailCampaign.update({
      where: { id: campaignId },
      data: { status: "sending" },
    });

    // 2. Query target audience profiles based on filters
    const filter = (campaign.audienceFilter || {}) as { plan?: string; onboarded?: boolean };
    const queryConditions: Record<string, any> = {};
    if (filter.plan) {
      queryConditions.plan = filter.plan;
    }
    if (typeof filter.onboarded === "boolean") {
      queryConditions.onboarded = filter.onboarded;
    }

    const recipients = await prisma.profile.findMany({
      where: queryConditions,
      select: { id: true, email: true, displayName: true },
    });

    // 3. Queue emails in background
    let queuedCount = 0;
    for (const user of recipients) {
      // Create recipient mapping
      const recRecord = await prisma.campaignRecipient.create({
        data: {
          campaignId,
          recipientEmail: user.email,
          userId: user.id,
          status: "pending",
        },
      });

      // Enqueue custom email
      // We pass campaign variables like custom body text to the templates
      const dispatchResult = await enqueueEmail(
        user.email,
        campaign.templateName,
        {
          name: user.displayName,
          subject: campaign.subject,
          customBody: campaign.customBody,
          campaignId: campaignId,
        },
        { userId: user.id }
      );

      if (dispatchResult.status === "queued") {
        queuedCount++;
      }
    }

    // 4. Update campaign execution count
    await prisma.emailCampaign.update({
      where: { id: campaignId },
      data: {
        status: "completed",
        sentCount: queuedCount,
      },
    });

    return { success: true, recipientsCount: recipients.length, queuedCount };
  } catch (error: any) {
    console.error("Error launching campaign:", error);
    // Revert status to failed
    await prisma.emailCampaign.update({
      where: { id: campaignId },
      data: { status: "failed" },
    });
    return { success: false, error: error.message };
  }
}

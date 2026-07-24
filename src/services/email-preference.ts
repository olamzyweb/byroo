import { prisma } from "../lib/prisma";

export type EmailPreferenceCategory =
  | "marketing"
  | "weeklyReports"
  | "monthlyReports"
  | "productAnnouncements"
  | "securityNotifications"
  | "billingNotifications"
  | "systemNotifications";

export type UserNotificationCategory =
  | "contactInquiry"
  | "newReview"
  | "newFavorite"
  | "businessApproval"
  | "subscriptionChange"
  | "trialEnd";

/**
 * Service to manage email preference opt-ins and opt-outs.
 */
export const EmailPreferenceService = {
  /**
   * Retrieves or creates default email preferences for a user.
   */
  async getPreferences(userId: string) {
    let prefs = await prisma.emailPreference.findUnique({
      where: { userId },
    });

    if (!prefs) {
      prefs = await prisma.emailPreference.create({
        data: {
          userId,
          marketing: true,
          weeklyReports: true,
          monthlyReports: true,
          productAnnouncements: true,
          securityNotifications: true,
          billingNotifications: true,
          systemNotifications: true,
        },
      });
    }

    return prefs;
  },

  /**
   * Retrieves or creates default user notification preferences.
   */
  async getNotificationPreferences(userId: string) {
    let prefs = await prisma.userNotificationPreference.findUnique({
      where: { userId },
    });

    if (!prefs) {
      prefs = await prisma.userNotificationPreference.create({
        data: {
          userId,
          contactInquiry: true,
          newReview: true,
          newFavorite: true,
          businessApproval: true,
          subscriptionChange: true,
          trialEnd: true,
        },
      });
    }

    return prefs;
  },

  /**
   * Updates general email preferences.
   */
  async updatePreferences(userId: string, data: Partial<Record<EmailPreferenceCategory, boolean>>) {
    // Security notifications cannot be disabled (forced true)
    const sanitizedData = { ...data };
    if (sanitizedData.hasOwnProperty("securityNotifications")) {
      sanitizedData.securityNotifications = true;
    }

    return prisma.emailPreference.upsert({
      where: { userId },
      update: sanitizedData,
      create: {
        userId,
        marketing: sanitizedData.marketing ?? true,
        weeklyReports: sanitizedData.weeklyReports ?? true,
        monthlyReports: sanitizedData.monthlyReports ?? true,
        productAnnouncements: sanitizedData.productAnnouncements ?? true,
        securityNotifications: true,
        billingNotifications: sanitizedData.billingNotifications ?? true,
        systemNotifications: sanitizedData.systemNotifications ?? true,
      },
    });
  },

  /**
   * Updates user notification triggers.
   */
  async updateNotificationPreferences(userId: string, data: Partial<Record<UserNotificationCategory, boolean>>) {
    return prisma.userNotificationPreference.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        contactInquiry: data.contactInquiry ?? true,
        newReview: data.newReview ?? true,
        newFavorite: data.newFavorite ?? true,
        businessApproval: data.businessApproval ?? true,
        subscriptionChange: data.subscriptionChange ?? true,
        trialEnd: data.trialEnd ?? true,
      },
    });
  },

  /**
   * Check if user is allowed to receive a category of email.
   * Mandated security and billing notifications are always allowed.
   */
  async isOptedIn(userId: string, category: EmailPreferenceCategory): Promise<boolean> {
    // Critical security alerts are mandatory
    if (category === "securityNotifications") {
      return true;
    }

    try {
      const prefs = await this.getPreferences(userId);
      return prefs[category] !== false;
    } catch (error) {
      console.error(`Error checking email preferences for user ${userId}:`, error);
      return true; // Default to opted-in if check fails to prevent blocking system messages
    }
  },

  /**
   * Check if user is allowed to receive a specific trigger notification.
   */
  async isNotificationEnabled(userId: string, trigger: UserNotificationCategory): Promise<boolean> {
    try {
      const prefs = await this.getNotificationPreferences(userId);
      return prefs[trigger] !== false;
    } catch (error) {
      console.error(`Error checking notification preferences for user ${userId}:`, error);
      return true; // Default to enabled
    }
  }
};
export default EmailPreferenceService;

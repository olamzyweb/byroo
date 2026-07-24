import * as React from "react";
import { render } from "@react-email/render";
import { sendEmail } from "../lib/email/client";
import { generateUnsubscribeToken } from "../lib/email/token";
import { EmailPreferenceService, EmailPreferenceCategory, UserNotificationCategory } from "./email-preference";
import { EmailAnalyticsService } from "./email-analytics";
import { emailConfig } from "../lib/email/config";

// Import all templates
import {
  WelcomeEmail,
  VerifyEmail,
  PasswordReset,
  EmailChanged,
  AccountDeleted,
  BusinessPublished,
  BusinessApproved,
  BusinessSuspended,
  BusinessRejected,
  BusinessVerified,
  BusinessProfileCompleted,
  NewInquiry,
  NewReview,
  NewContactMessage,
  NewBooking,
  NewOrder,
  SubscriptionStarted,
  SubscriptionRenewed,
  SubscriptionFailed,
  TrialEnding,
  PaymentReceipt,
  InvoiceAvailable,
  LoginAlert,
  PasswordChanged,
  SuspiciousLogin,
  OnboardingDay0,
  OnboardingDay1,
  OnboardingDay2,
  OnboardingDay3,
  OnboardingDay4,
  OnboardingDay5,
  OnboardingDay6,
  OnboardingDay7,
  WeeklyDigest,
  MonthlyReport,
  CustomEmail,
} from "../../emails/templates";

export const EmailService = {
  /**
   * Helper to compile a template, execute preferences checks, log the attempt, and dispatch the email.
   */
  async send({
    userId,
    recipientEmail,
    subject,
    templateName,
    templateComponent,
    category,
    notificationTrigger,
    variables = {},
  }: {
    userId?: string;
    recipientEmail: string;
    subject: string;
    templateName: string;
    templateComponent: React.ReactElement;
    category: EmailPreferenceCategory;
    notificationTrigger?: UserNotificationCategory;
    variables?: Record<string, any>;
  }) {
    const activeUserId = userId && userId.trim() !== "" ? userId : undefined;

    // 1. Perform preferences checks if activeUserId is provided
    if (activeUserId) {
      // General preferences check
      const optIn = await EmailPreferenceService.isOptedIn(activeUserId, category);
      if (!optIn) {
        console.info(`🔕 [OPT-OUT] User ${activeUserId} has opted out of category '${category}'. Skipping '${templateName}'.`);
        await EmailAnalyticsService.logEmailAttempt({
          userId: activeUserId,
          recipientEmail,
          subject,
          templateName,
          variables,
          status: "failed",
        }).then((log) =>
          EmailAnalyticsService.logEmailFailure(log.id, `User opted out of ${category} category`)
        );
        return { success: false, reason: "User opted out of general category" };
      }

      // Specific notification trigger check
      if (notificationTrigger) {
        const triggerEnabled = await EmailPreferenceService.isNotificationEnabled(activeUserId, notificationTrigger);
        if (!triggerEnabled) {
          console.info(`🔕 [OPT-OUT] User ${activeUserId} has disabled trigger '${notificationTrigger}'. Skipping '${templateName}'.`);
          await EmailAnalyticsService.logEmailAttempt({
            userId: activeUserId,
            recipientEmail,
            subject,
            templateName,
            variables,
            status: "failed",
          }).then((log) =>
            EmailAnalyticsService.logEmailFailure(log.id, `User disabled ${notificationTrigger} trigger notification`)
          );
          return { success: false, reason: "User disabled trigger notification" };
        }
      }
    }

    // 2. Log initial attempt to database
    const logRecord = await EmailAnalyticsService.logEmailAttempt({
      userId: activeUserId,
      recipientEmail,
      subject,
      templateName,
      variables,
      status: "queued",
    });

    try {
      // 3. Render template to HTML & Plain Text
      const html = await render(templateComponent);
      const text = await render(templateComponent, { plainText: true });

      // 4. Send email via Resend
      const { data, error } = await sendEmail({
        to: recipientEmail,
        subject,
        html,
        text,
      });

      if (error) {
        throw error;
      }

      // 5. Update log with message ID on success
      if (data?.id) {
        await EmailAnalyticsService.updateLogMessageId(logRecord.id, data.id, "sent");
        return { success: true, messageId: data.id };
      }

      throw new Error("No message ID returned from email provider");
    } catch (err: any) {
      console.error(`❌ Failed to render/dispatch email [${templateName}]:`, err);
      // Log failure detail
      await EmailAnalyticsService.logEmailFailure(logRecord.id, err.message || String(err));
      return { success: false, error: err };
    }
  },

  /* ========================================================================
     AUTHENTICATION EMAILS
     ======================================================================== */

  async sendWelcomeEmail(userId: string, email: string, name: string) {
    const unsubToken = generateUnsubscribeToken(userId, email);
    return this.send({
      userId,
      recipientEmail: email,
      subject: "Welcome to Byroo! 🎉 Let's build your space",
      templateName: "welcome",
      category: "marketing",
      variables: { name },
      templateComponent: React.createElement(WelcomeEmail, {
        name,
        loginUrl: `${emailConfig.baseUrl}/login`,
        unsubscribeToken: unsubToken,
      }),
    });
  },

  async sendVerifyEmail(email: string, verificationUrl: string, code: string) {
    return this.send({
      recipientEmail: email,
      subject: "Verify your Byroo email address",
      templateName: "verify-email",
      category: "systemNotifications", // System notifications are bypassed/mandatory
      variables: { code, verificationUrl },
      templateComponent: React.createElement(VerifyEmail, {
        verificationUrl,
        code,
      }),
    });
  },

  async sendPasswordReset(email: string, resetUrl: string) {
    return this.send({
      recipientEmail: email,
      subject: "Reset your Byroo password",
      templateName: "password-reset",
      category: "securityNotifications", // Mandatory
      variables: { resetUrl },
      templateComponent: React.createElement(PasswordReset, { resetUrl }),
    });
  },

  async sendEmailChanged(oldEmail: string, newEmail: string) {
    return this.send({
      recipientEmail: oldEmail,
      subject: "Security Alert: Byroo email address changed",
      templateName: "email-changed",
      category: "securityNotifications",
      variables: { oldEmail, newEmail },
      templateComponent: React.createElement(EmailChanged, { oldEmail, newEmail }),
    });
  },

  async sendAccountDeleted(email: string, name: string) {
    return this.send({
      recipientEmail: email,
      subject: "Confirming your Byroo account deletion",
      templateName: "account-deleted",
      category: "systemNotifications",
      variables: { name },
      templateComponent: React.createElement(AccountDeleted, { name }),
    });
  },

  /* ========================================================================
     BUSINESS LIFECYCLE EMAILS
     ======================================================================== */

  async sendBusinessPublished(userId: string, email: string, businessName: string, businessUrl: string) {
    const unsubToken = generateUnsubscribeToken(userId, email);
    return this.send({
      userId,
      recipientEmail: email,
      subject: `Your business space ${businessName} is live! 🚀`,
      templateName: "business-published",
      category: "systemNotifications",
      variables: { businessName, businessUrl },
      templateComponent: React.createElement(BusinessPublished, {
        businessName,
        businessUrl,
        unsubscribeToken: unsubToken,
      }),
    });
  },

  async sendBusinessApproved(userId: string, email: string, businessName: string, businessUrl: string) {
    const unsubToken = generateUnsubscribeToken(userId, email);
    return this.send({
      userId,
      recipientEmail: email,
      subject: "Good news: Your business space has been approved! 🎉",
      templateName: "business-approved",
      category: "systemNotifications",
      notificationTrigger: "businessApproval",
      variables: { businessName, businessUrl },
      templateComponent: React.createElement(BusinessApproved, {
        businessName,
        businessUrl,
        unsubscribeToken: unsubToken,
      }),
    });
  },

  async sendBusinessSuspended(userId: string, email: string, businessName: string, reason: string) {
    return this.send({
      userId,
      recipientEmail: email,
      subject: "URGENT: Your Byroo business space has been suspended",
      templateName: "business-suspended",
      category: "securityNotifications", // Mark as security/policy warning
      variables: { businessName, reason },
      templateComponent: React.createElement(BusinessSuspended, { businessName, reason }),
    });
  },

  async sendBusinessRejected(userId: string, email: string, businessName: string, reason: string) {
    return this.send({
      userId,
      recipientEmail: email,
      subject: "Moderation review update: Action required for your space",
      templateName: "business-rejected",
      category: "systemNotifications",
      variables: { businessName, reason },
      templateComponent: React.createElement(BusinessRejected, { businessName, reason }),
    });
  },

  async sendBusinessVerified(userId: string, email: string, businessName: string, businessUrl: string) {
    const unsubToken = generateUnsubscribeToken(userId, email);
    return this.send({
      userId,
      recipientEmail: email,
      subject: `Congratulations! ${businessName} is now verified on Byroo 🛡️`,
      templateName: "business-verified",
      category: "systemNotifications",
      variables: { businessName, businessUrl },
      templateComponent: React.createElement(BusinessVerified, {
        businessName,
        businessUrl,
        unsubscribeToken: unsubToken,
      }),
    });
  },

  async sendProfileCompleted(userId: string, email: string, businessName: string) {
    const unsubToken = generateUnsubscribeToken(userId, email);
    return this.send({
      userId,
      recipientEmail: email,
      subject: "Your Byroo business profile is 100% complete! 🌟",
      templateName: "profile-completed",
      category: "systemNotifications",
      variables: { businessName },
      templateComponent: React.createElement(BusinessProfileCompleted, {
        businessName,
        dashboardUrl: `${emailConfig.baseUrl}/dashboard`,
        unsubscribeToken: unsubToken,
      }),
    });
  },

  /* ========================================================================
     CUSTOMER INTERACTION EMAILS
     ======================================================================== */

  async sendInquiryNotification(
    userId: string,
    email: string,
    businessName: string,
    customerName: string,
    customerEmail: string,
    itemName: string,
    message: string
  ) {
    const unsubToken = generateUnsubscribeToken(userId, email);
    return this.send({
      userId,
      recipientEmail: email,
      subject: `New Inquiry from ${customerName} for ${itemName} 📩`,
      templateName: "new-inquiry",
      category: "systemNotifications",
      notificationTrigger: "contactInquiry",
      variables: { businessName, customerName, customerEmail, itemName, message },
      templateComponent: React.createElement(NewInquiry, {
        businessName,
        customerName,
        customerEmail,
        itemName,
        message,
        actionUrl: `${emailConfig.baseUrl}/dashboard/inquiries`,
        unsubscribeToken: unsubToken,
      }),
    });
  },

  async sendReviewNotification(
    userId: string,
    email: string,
    businessName: string,
    customerName: string,
    rating: number,
    reviewText: string
  ) {
    const unsubToken = generateUnsubscribeToken(userId, email);
    return this.send({
      userId,
      recipientEmail: email,
      subject: `New ${rating}-Star Customer Review! ⭐`,
      templateName: "new-review",
      category: "systemNotifications",
      notificationTrigger: "newReview",
      variables: { businessName, customerName, rating, reviewText },
      templateComponent: React.createElement(NewReview, {
        businessName,
        customerName,
        rating,
        reviewText,
        actionUrl: `${emailConfig.baseUrl}/dashboard/testimonials`,
        unsubscribeToken: unsubToken,
      }),
    });
  },

  async sendContactMessageNotification(
    userId: string,
    email: string,
    businessName: string,
    senderName: string,
    senderEmail: string,
    message: string
  ) {
    const unsubToken = generateUnsubscribeToken(userId, email);
    return this.send({
      userId,
      recipientEmail: email,
      subject: `New general contact message from ${senderName} 💬`,
      templateName: "new-contact-message",
      category: "systemNotifications",
      notificationTrigger: "contactInquiry",
      variables: { businessName, senderName, senderEmail, message },
      templateComponent: React.createElement(NewContactMessage, {
        businessName,
        senderName,
        senderEmail,
        message,
        actionUrl: `${emailConfig.baseUrl}/dashboard/inquiries`,
        unsubscribeToken: unsubToken,
      }),
    });
  },

  async sendBookingNotification(
    userId: string,
    email: string,
    businessName: string,
    customerName: string,
    serviceName: string,
    bookingDate: string,
    bookingTime: string,
    notes?: string
  ) {
    const unsubToken = generateUnsubscribeToken(userId, email);
    return this.send({
      userId,
      recipientEmail: email,
      subject: `New booking request: ${serviceName} on ${bookingDate} 📅`,
      templateName: "new-booking",
      category: "systemNotifications",
      notificationTrigger: "contactInquiry",
      variables: { businessName, customerName, serviceName, bookingDate, bookingTime, notes },
      templateComponent: React.createElement(NewBooking, {
        businessName,
        customerName,
        serviceName,
        bookingDate,
        bookingTime,
        notes,
        actionUrl: `${emailConfig.baseUrl}/dashboard/bookings`,
        unsubscribeToken: unsubToken,
      }),
    });
  },

  async sendOrderNotification(
    userId: string,
    email: string,
    businessName: string,
    orderId: string,
    customerName: string,
    itemsSummary: string,
    totalPrice: string
  ) {
    const unsubToken = generateUnsubscribeToken(userId, email);
    return this.send({
      userId,
      recipientEmail: email,
      subject: `New order ${orderId} received! 🛍️`,
      templateName: "new-order",
      category: "systemNotifications",
      notificationTrigger: "contactInquiry",
      variables: { businessName, orderId, customerName, itemsSummary, totalPrice },
      templateComponent: React.createElement(NewOrder, {
        businessName,
        orderId,
        customerName,
        itemsSummary,
        totalPrice,
        actionUrl: `${emailConfig.baseUrl}/dashboard/orders`,
        unsubscribeToken: unsubToken,
      }),
    });
  },

  /* ========================================================================
     BILLING EMAILS
     ======================================================================== */

  async sendSubscriptionReceipt(
    userId: string,
    email: string,
    name: string,
    receiptNumber: string,
    amount: string,
    date: string,
    planName: string
  ) {
    const unsubToken = generateUnsubscribeToken(userId, email);
    return this.send({
      userId,
      recipientEmail: email,
      subject: `Payment Receipt: Byroo subscription ${receiptNumber} 🧾`,
      templateName: "subscription-receipt",
      category: "billingNotifications",
      variables: { name, receiptNumber, amount, date, planName },
      templateComponent: React.createElement(PaymentReceipt, {
        name,
        receiptNumber,
        amount,
        date,
        planName,
        unsubscribeToken: unsubToken,
      }),
    });
  },

  async sendSubscriptionRenewed(
    userId: string,
    email: string,
    name: string,
    planName: string,
    priceAmount: string,
    renewalDate: string
  ) {
    const unsubToken = generateUnsubscribeToken(userId, email);
    return this.send({
      userId,
      recipientEmail: email,
      subject: "Your Byroo subscription has been renewed successfully",
      templateName: "subscription-renewed",
      category: "billingNotifications",
      notificationTrigger: "subscriptionChange",
      variables: { name, planName, priceAmount, renewalDate },
      templateComponent: React.createElement(SubscriptionRenewed, {
        name,
        planName,
        priceAmount,
        renewalDate,
        unsubscribeToken: unsubToken,
      }),
    });
  },

  async sendSubscriptionFailed(
    userId: string,
    email: string,
    name: string,
    planName: string,
    priceAmount: string,
    retryDate: string
  ) {
    return this.send({
      userId,
      recipientEmail: email,
      subject: "⚠️ Payment Failed: Action required for Byroo Pro",
      templateName: "subscription-failed",
      category: "billingNotifications",
      notificationTrigger: "subscriptionChange",
      variables: { name, planName, priceAmount, retryDate },
      templateComponent: React.createElement(SubscriptionFailed, {
        name,
        planName,
        priceAmount,
        retryDate,
      }),
    });
  },

  async sendTrialEnding(
    userId: string,
    email: string,
    name: string,
    daysRemaining: number,
    planName: string,
    priceAmount: string
  ) {
    return this.send({
      userId,
      recipientEmail: email,
      subject: `Your free trial is ending in ${daysRemaining} days! ⏳`,
      templateName: "trial-ending",
      category: "billingNotifications",
      notificationTrigger: "trialEnd",
      variables: { name, daysRemaining, planName, priceAmount },
      templateComponent: React.createElement(TrialEnding, {
        name,
        daysRemaining,
        planName,
        priceAmount,
        actionUrl: `${emailConfig.baseUrl}/dashboard/billing`,
      }),
    });
  },

  async sendInvoiceAvailable(
    userId: string,
    email: string,
    name: string,
    invoiceId: string,
    amount: string,
    dueDate: string
  ) {
    const unsubToken = generateUnsubscribeToken(userId, email);
    return this.send({
      userId,
      recipientEmail: email,
      subject: `New invoice ${invoiceId} is available for payment`,
      templateName: "invoice-available",
      category: "billingNotifications",
      variables: { name, invoiceId, amount, dueDate },
      templateComponent: React.createElement(InvoiceAvailable, {
        name,
        invoiceId,
        amount,
        dueDate,
        unsubscribeToken: unsubToken,
      }),
    });
  },

  /* ========================================================================
     SECURITY EMAILS
     ======================================================================== */

  async sendLoginAlert(
    userId: string,
    email: string,
    name: string,
    deviceInfo: string,
    ipAddress: string,
    loginTime: string,
    location: string
  ) {
    return this.send({
      userId,
      recipientEmail: email,
      subject: "Security Notification: New sign-in detected for your account",
      templateName: "login-alert",
      category: "securityNotifications",
      variables: { name, deviceInfo, ipAddress, loginTime, location },
      templateComponent: React.createElement(LoginAlert, {
        name,
        deviceInfo,
        ipAddress,
        loginTime,
        location,
      }),
    });
  },

  async sendPasswordChanged(userId: string, email: string, name: string, changeTime: string) {
    return this.send({
      userId,
      recipientEmail: email,
      subject: "Security Notification: Your password was changed",
      templateName: "password-changed",
      category: "securityNotifications",
      variables: { name, changeTime },
      templateComponent: React.createElement(PasswordChanged, { name, changeTime }),
    });
  },

  async sendSuspiciousLogin(
    userId: string,
    email: string,
    name: string,
    deviceInfo: string,
    ipAddress: string,
    location: string,
    verificationLink: string
  ) {
    return this.send({
      userId,
      recipientEmail: email,
      subject: "🚨 SECURITY ALERT: Suspicious login attempt blocked",
      templateName: "suspicious-login",
      category: "securityNotifications",
      variables: { name, deviceInfo, ipAddress, location, verificationLink },
      templateComponent: React.createElement(SuspiciousLogin, {
        name,
        deviceInfo,
        ipAddress,
        location,
        verificationLink,
      }),
    });
  },

  /* ========================================================================
     LIFECYCLE & DIGEST AUTOMATIONS
     ======================================================================== */

  async sendLifecycleEmail(userId: string, email: string, name: string, day: number, extra: any = {}) {
    const unsubToken = generateUnsubscribeToken(userId, email);
    let component: React.ReactElement;
    let subject = "Setting up your digital space with Byroo";
    let templateName = `onboarding-day${day}`;

    switch (day) {
      case 0:
        subject = "Welcome to Byroo! Let's set up your space 🏠";
        component = React.createElement(OnboardingDay0, { name, unsubscribeToken: unsubToken });
        break;
      case 1:
        subject = "Tip: Where to pin your Byroo link for maximum traffic 📌";
        component = React.createElement(OnboardingDay1, { name, unsubscribeToken: unsubToken });
        break;
      case 2:
        subject = "Why WhatsApp checkout is your best sales tool 💬";
        component = React.createElement(OnboardingDay2, { name, unsubscribeToken: unsubToken });
        break;
      case 3:
        subject = "3 tips to optimize your product catalog 🛍️";
        component = React.createElement(OnboardingDay3, { name, unsubscribeToken: unsubToken });
        break;
      case 4:
        subject = "How to collect 5-star reviews on auto-pilot ⭐";
        component = React.createElement(OnboardingDay4, { name, unsubscribeToken: unsubToken });
        break;
      case 5:
        subject = "Is your digital space mobile-ready? 📱";
        component = React.createElement(OnboardingDay5, { name, unsubscribeToken: unsubToken });
        break;
      case 6:
        subject = "Your 5-minute business sharing checklist 🚀";
        component = React.createElement(OnboardingDay6, { name, unsubscribeToken: unsubToken });
        break;
      case 7:
        subject = "Let's check your week 1 stats! 📊";
        component = React.createElement(OnboardingDay7, { name, unsubscribeToken: unsubToken });
        break;
      default:
        throw new Error(`Unsupported lifecycle onboarding day: ${day}`);
    }

    return this.send({
      userId,
      recipientEmail: email,
      subject,
      templateName,
      category: "marketing",
      variables: { name, ...extra },
      templateComponent: component,
    });
  },

  async sendWeeklyDigest(userId: string, email: string, stats: Record<string, any>) {
    const unsubToken = generateUnsubscribeToken(userId, email);
    return this.send({
      userId,
      recipientEmail: email,
      subject: `Your weekly performance update for ${stats.businessName || "your business"} 📊`,
      templateName: "weekly-digest",
      category: "weeklyReports",
      variables: stats,
      templateComponent: React.createElement(WeeklyDigest, {
        businessName: stats.businessName,
        startDate: stats.startDate,
        endDate: stats.endDate,
        profileViews: stats.profileViews,
        newInquiries: stats.newInquiries,
        newReviews: stats.newReviews,
        inquiriesGrowth: stats.inquiriesGrowth,
        popularItemName: stats.popularItemName,
        tipTitle: stats.tipTitle,
        tipContent: stats.tipContent,
        unsubscribeToken: unsubToken,
      }),
    });
  },

  async sendMonthlyDigest(userId: string, email: string, stats: Record<string, any>) {
    const unsubToken = generateUnsubscribeToken(userId, email);
    return this.send({
      userId,
      recipientEmail: email,
      subject: `Monthly Performance Report: ${stats.monthName || "your business"} 📈`,
      templateName: "monthly-report",
      category: "monthlyReports",
      variables: stats,
      templateComponent: React.createElement(MonthlyReport, {
        businessName: stats.businessName,
        monthName: stats.monthName,
        totalViews: stats.totalViews,
        totalInquiries: stats.totalInquiries,
        viewsGrowth: stats.viewsGrowth,
        conversionRate: stats.conversionRate,
        healthStatus: stats.healthStatus,
        unsubscribeToken: unsubToken,
      }),
    });
  },

  async sendCustomEmail(userId: string | undefined, email: string, subject: string, bodyText: string) {
    const unsubToken = userId ? generateUnsubscribeToken(userId, email) : undefined;
    return this.send({
      userId,
      recipientEmail: email,
      subject,
      templateName: "custom",
      category: "marketing",
      variables: { bodyText },
      templateComponent: React.createElement(CustomEmail, {
        bodyText,
        unsubscribeToken: unsubToken,
      }),
    });
  }
};
export default EmailService;

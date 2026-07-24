import * as React from "react";
import { BrandedLayout } from "../layouts/BrandedLayout";
import {
  EmailH1,
  EmailBody,
  EmailCTA,
  EmailDivider,
  EmailCard,
  EmailCallout,
} from "../components/Primitives";

// 1. Business Published
interface BusinessPublishedProps {
  businessName: string;
  businessUrl: string;
  unsubscribeToken?: string;
}
export const BusinessPublished: React.FC<BusinessPublishedProps> = ({
  businessName = "My Shop",
  businessUrl = "https://byroo.digital/myshop",
  unsubscribeToken,
}) => (
  <BrandedLayout
    previewText={`Your business space ${businessName} is published!`}
    unsubscribeToken={unsubscribeToken}
  >
    <EmailH1>Your Byroo Space is Live! 🚀</EmailH1>
    <EmailBody>
      Congratulations! Your digital business space, <strong>{businessName}</strong>, is officially published. Customers can now browse your catalog, inquire about your services, and contact you directly.
    </EmailBody>
    <EmailCallout type="success">
      Your public link: <a href={businessUrl} className="text-indigo-600 font-bold underline break-all">{businessUrl}</a>
    </EmailCallout>
    <EmailBody>
      Now it's time to start sharing! Put this link in your Instagram Bio, TikTok profile, WhatsApp business status, or business cards to let everyone know you are online.
    </EmailBody>
    <EmailCTA
      title="Promote Your Space"
      description="View your digital profile and share it with your audience."
      buttonText="View Space"
      href={businessUrl}
    />
  </BrandedLayout>
);

// 2. Business Approved
interface BusinessApprovedProps {
  businessName: string;
  businessUrl: string;
  unsubscribeToken?: string;
}
export const BusinessApproved: React.FC<BusinessApprovedProps> = ({
  businessName = "My Business",
  businessUrl = "https://byroo.digital/mybusiness",
  unsubscribeToken,
}) => (
  <BrandedLayout
    previewText="Good news! Your business space has been approved."
    unsubscribeToken={unsubscribeToken}
  >
    <EmailH1>Business Space Approved! 🎉</EmailH1>
    <EmailBody>
      Great news! Our moderation team has reviewed and approved your digital space, <strong>{businessName}</strong>.
    </EmailBody>
    <EmailBody>
      Your space is compliant with our terms and guidelines, and it is fully search-indexed and viewable by the public.
    </EmailBody>
    <EmailCTA
      title="Check Out Your Page"
      description="Your profile is public and active."
      buttonText="Go to My Space"
      href={businessUrl}
    />
  </BrandedLayout>
);

// 3. Business Suspended
interface BusinessSuspendedProps {
  businessName: string;
  reason?: string;
}
export const BusinessSuspended: React.FC<BusinessSuspendedProps> = ({
  businessName = "My Business",
  reason = "policy violation",
}) => (
  <BrandedLayout previewText="Urgent: Your Byroo space has been suspended" showUnsubscribe={false}>
    <EmailH1>Your business space has been suspended ⚠️</EmailH1>
    <EmailBody>
      We are writing to inform you that your digital space, <strong>{businessName}</strong>, has been temporarily suspended due to the following reason:
    </EmailBody>
    <EmailCallout type="danger">
      {reason}
    </EmailCallout>
    <EmailBody>
      While suspended, your public space is hidden from customers, and any direct inquiry buttons are disabled.
    </EmailBody>
    <EmailBody>
      If you believe this was an error or would like to submit modifications for review, please reply directly to this email or contact our support team at support@byroo.digital.
    </EmailBody>
  </BrandedLayout>
);

// 4. Business Rejected
interface BusinessRejectedProps {
  businessName: string;
  reason?: string;
}
export const BusinessRejected: React.FC<BusinessRejectedProps> = ({
  businessName = "My Business",
  reason = "incomplete details or invalid contact channels",
}) => (
  <BrandedLayout previewText="Action Required: Your business space status" showUnsubscribe={false}>
    <EmailH1>Review status: Business space rejected ❌</EmailH1>
    <EmailBody>
      Thank you for submitting your business space, <strong>{businessName}</strong>, for approval.
    </EmailBody>
    <EmailBody>
      Unfortunately, our moderation team could not approve your profile in its current state.
    </EmailBody>
    <EmailCallout type="warning">
      <strong>Feedback:</strong> {reason}
    </EmailCallout>
    <EmailBody>
      Don't worry! You can easily update your details, add products, or fix contact information and submit it for approval again.
    </EmailBody>
    <EmailCTA
      title="Update Your Space"
      description="Log in to edit your profile and resubmit."
      buttonText="Edit Profile"
      href="https://byroo.digital/login"
    />
  </BrandedLayout>
);

// 5. Business Verified
interface BusinessVerifiedProps {
  businessName: string;
  businessUrl: string;
  unsubscribeToken?: string;
}
export const BusinessVerified: React.FC<BusinessVerifiedProps> = ({
  businessName = "My Business",
  businessUrl = "https://byroo.digital/mybusiness",
  unsubscribeToken,
}) => (
  <BrandedLayout
    previewText={`Congratulations! ${businessName} is now verified on Byroo.`}
    unsubscribeToken={unsubscribeToken}
  >
    <EmailH1>You've Received the Trusted Badge! 🛡️</EmailH1>
    <EmailBody>
      Excellent news! Your digital business space, <strong>{businessName}</strong>, has been verified by the Byroo trust team.
    </EmailBody>
    <EmailBody>
      Your profile now displays a verification badge, which helps build trust with visitors, increases search visibility, and confirms your identity as a certified seller.
    </EmailBody>
    <EmailCTA
      title="View Verified Space"
      description="See how your badge looks to customers."
      buttonText="View My Space"
      href={businessUrl}
    />
  </BrandedLayout>
);

// 6. Business Profile Completed
interface BusinessProfileCompletedProps {
  businessName: string;
  dashboardUrl: string;
  unsubscribeToken?: string;
}
export const BusinessProfileCompleted: React.FC<BusinessProfileCompletedProps> = ({
  businessName = "My Business",
  dashboardUrl = "https://byroo.digital/dashboard",
  unsubscribeToken,
}) => (
  <BrandedLayout
    previewText="Great start! Your Byroo profile is created"
    unsubscribeToken={unsubscribeToken}
  >
    <EmailH1>Your Byroo profile is live! 🚀</EmailH1>
    <EmailBody>
      Great job! Your profile, <strong>{businessName}</strong>, has been successfully created. You have claimed your unique username link and set up your base profile info.
    </EmailBody>
    <EmailBody>
      To start receiving client bookings and orders, let's complete your launch setup: add a WhatsApp contact number, upload an avatar, and list your first service or catalog item.
    </EmailBody>
    <EmailCTA
      title="Complete Your Setup"
      description="Add products and configure WhatsApp checkout in your dashboard."
      buttonText="Finish Setup"
      href={dashboardUrl}
    />
  </BrandedLayout>
);

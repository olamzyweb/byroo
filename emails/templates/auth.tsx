import * as React from "react";
import { Text } from "@react-email/components";
import { BrandedLayout } from "../layouts/BrandedLayout";
import {
  EmailH1,
  EmailBody,
  EmailCTA,
  EmailDivider,
  EmailButton,
  EmailCard,
  EmailMuted,
} from "../components/Primitives";

// 1. Welcome Email (Day 0)
interface WelcomeEmailProps {
  name: string;
  loginUrl: string;
  unsubscribeToken?: string;
}
export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  name = "there",
  loginUrl = "https://byroo.digital/login",
  unsubscribeToken,
}) => (
  <BrandedLayout
    previewText="Welcome to Byroo - Create your custom digital business space today!"
    unsubscribeToken={unsubscribeToken}
  >
    <EmailH1>Welcome to Byroo, {name}! 👋</EmailH1>
    <EmailBody>
      We are super excited to help you launch your personal digital business space. Byroo lets you showcase products, list services, accept bookings, receive customer reviews, and share contact details in one beautiful link.
    </EmailBody>
    <EmailBody>
      Our goal is to help freelancers, creators, and local businesses grow their online presence without any coding. Let's set up your profile and get you ready for customers!
    </EmailBody>
    <EmailCTA
      title="Create Your Digital Space"
      description="It takes less than 5 minutes to create a stunning profile."
      buttonText="Complete Your Profile"
      href={loginUrl}
    />
    <EmailDivider />
    <EmailBody className="text-sm text-gray-500">
      If you need any guidance or have feature requests, simply reply to this email. We're here to help you succeed!
    </EmailBody>
  </BrandedLayout>
);

// 2. Verify Email Address
interface VerifyEmailProps {
  verificationUrl: string;
  code?: string;
}
export const VerifyEmail: React.FC<VerifyEmailProps> = ({
  verificationUrl = "https://byroo.digital/verify",
  code = "123456",
}) => (
  <BrandedLayout previewText="Verify your Byroo email address" showUnsubscribe={false}>
    <EmailH1>Verify your email address ✉️</EmailH1>
    <EmailBody>
      Thanks for signing up for Byroo! To complete your registration and activate your account, please verify your email address.
    </EmailBody>
    {code && (
      <EmailCard className="text-center bg-gray-50 border-gray-200">
        <Text className="text-xs font-semibold text-gray-500 tracking-wider uppercase m-0 mb-1">Verification Code</Text>
        <Text className="text-3xl font-extrabold tracking-widest text-indigo-600 m-0">{code}</Text>
      </EmailCard>
    )}
    <EmailBody>
      Click the button below to verify your email automatically. This link is valid for 24 hours.
    </EmailBody>
    <div className="text-center my-6">
      <EmailButton href={verificationUrl}>Verify Email Address</EmailButton>
    </div>
    <EmailMuted className="text-xs text-center">
      Or copy and paste this URL into your browser: <br />
      <a href={verificationUrl} className="text-indigo-600 break-all">{verificationUrl}</a>
    </EmailMuted>
  </BrandedLayout>
);

// 3. Password Reset
interface PasswordResetProps {
  resetUrl: string;
}
export const PasswordReset: React.FC<PasswordResetProps> = ({
  resetUrl = "https://byroo.digital/reset-password",
}) => (
  <BrandedLayout previewText="Reset your Byroo password" showUnsubscribe={false}>
    <EmailH1>Reset your password 🔒</EmailH1>
    <EmailBody>
      We received a request to reset the password associated with your Byroo account. If you didn't make this request, you can safely ignore this email.
    </EmailBody>
    <EmailBody>
      Click the button below to choose a new password. This link will expire in 1 hour for security.
    </EmailBody>
    <div className="text-center my-6">
      <EmailButton href={resetUrl} variant="primary">Reset Password</EmailButton>
    </div>
    <EmailMuted className="text-xs text-center">
      Or copy and paste this URL into your browser: <br />
      <a href={resetUrl} className="text-indigo-600 break-all">{resetUrl}</a>
    </EmailMuted>
  </BrandedLayout>
);

// 4. Email Changed
interface EmailChangedProps {
  oldEmail: string;
  newEmail: string;
}
export const EmailChanged: React.FC<EmailChangedProps> = ({
  oldEmail = "old@byroo.digital",
  newEmail = "new@byroo.digital",
}) => (
  <BrandedLayout previewText="Your Byroo account email was changed" showUnsubscribe={false}>
    <EmailH1>Your account email has changed 🔄</EmailH1>
    <EmailBody>
      This is a quick security notification to let you know that the email address associated with your Byroo account was updated:
    </EmailBody>
    <EmailCard className="bg-gray-50 border-gray-200">
      <table className="w-full text-sm">
        <tr>
          <td className="font-semibold text-gray-500 pb-2">Previous Email:</td>
          <td className="text-gray-800 pb-2">{oldEmail}</td>
        </tr>
        <tr>
          <td className="font-semibold text-gray-500">New Email:</td>
          <td className="text-gray-800">{newEmail}</td>
        </tr>
      </table>
    </EmailCard>
    <EmailBody className="text-red-600 font-semibold mt-4">
      If you did not make this change, please contact support immediately at support@byroo.digital to secure your account.
    </EmailBody>
  </BrandedLayout>
);

// 5. Account Deleted
interface AccountDeletedProps {
  name: string;
}
export const AccountDeleted: React.FC<AccountDeletedProps> = ({
  name = "User",
}) => (
  <BrandedLayout previewText="Your Byroo account has been deleted" showUnsubscribe={false}>
    <EmailH1>Account Deleted 🗑️</EmailH1>
    <EmailBody>
      Hello {name},
    </EmailBody>
    <EmailBody>
      This email confirms that your Byroo account and all associated business space files, products, and contact data have been permanently deleted from our servers as requested.
    </EmailBody>
    <EmailBody>
      We are sad to see you go! If you ever decide to return, you are always welcome to sign up again at byroo.digital. Thank you for being a part of our journey.
    </EmailBody>
    <EmailDivider />
    <EmailBody className="text-sm text-gray-500">
      Did we miss something? If there is any feedback you would like to share with our founding team to help us improve, please feel free to reply to this email.
    </EmailBody>
  </BrandedLayout>
);

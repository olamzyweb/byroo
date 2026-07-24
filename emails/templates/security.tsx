import * as React from "react";
import { BrandedLayout } from "../layouts/BrandedLayout";
import {
  EmailH1,
  EmailBody,
  EmailCTA,
  EmailCard,
  EmailCallout,
  EmailDivider,
} from "../components/Primitives";

// 1. New Login Alert
interface LoginAlertProps {
  name: string;
  deviceInfo: string;
  ipAddress: string;
  loginTime: string;
  location: string;
}
export const LoginAlert: React.FC<LoginAlertProps> = ({
  name = "User",
  deviceInfo = "Chrome on macOS",
  ipAddress = "192.168.1.10",
  loginTime = "2026-07-23 04:15 UTC",
  location = "Lagos, Nigeria",
}) => (
  <BrandedLayout previewText="New sign-in alert for Byroo" showUnsubscribe={false}>
    <EmailH1>New login detected 🛡️</EmailH1>
    <EmailBody>
      Hello {name},
    </EmailBody>
    <EmailBody>
      We detected a new sign-in to your Byroo account. Here are the session details:
    </EmailBody>
    <EmailCard className="bg-gray-50 border-gray-200 text-sm">
      <EmailBody className="m-0 mb-1"><strong>Device/Browser:</strong> {deviceInfo}</EmailBody>
      <EmailBody className="m-0 mb-1"><strong>IP Address:</strong> {ipAddress}</EmailBody>
      <EmailBody className="m-0 mb-1"><strong>Location:</strong> {location}</EmailBody>
      <EmailBody className="m-0"><strong>Time:</strong> {loginTime}</EmailBody>
    </EmailCard>
    <EmailBody>
      If this was you, no action is required.
    </EmailBody>
    <EmailCallout type="warning">
      If you did not authorize this login, please reset your password immediately and secure your account.
    </EmailCallout>
    <div className="text-center my-6">
      <EmailCTA
        title="Secure Your Account"
        description="If this login was suspicious, change your credentials immediately."
        buttonText="Reset Password"
        href="https://byroo.digital/reset-password"
      />
    </div>
  </BrandedLayout>
);

// 2. Password Changed
interface PasswordChangedProps {
  name: string;
  changeTime: string;
}
export const PasswordChanged: React.FC<PasswordChangedProps> = ({
  name = "User",
  changeTime = "2026-07-23 04:15 UTC",
}) => (
  <BrandedLayout previewText="Your Byroo password has been changed" showUnsubscribe={false}>
    <EmailH1>Your password was changed 🔒</EmailH1>
    <EmailBody>
      Hello {name},
    </EmailBody>
    <EmailBody>
      This email confirms that the password for your Byroo account was successfully updated at <strong>{changeTime}</strong>.
    </EmailBody>
    <EmailBody>
      If you made this change, you are good to go!
    </EmailBody>
    <EmailCallout type="danger">
      If you did NOT request this change, your account may be compromised. Please contact support immediately at support@byroo.digital so we can freeze your credentials and protect your business data.
    </EmailCallout>
  </BrandedLayout>
);

// 3. Suspicious Login
interface SuspiciousLoginProps {
  name: string;
  deviceInfo: string;
  ipAddress: string;
  location: string;
  verificationLink: string;
}
export const SuspiciousLogin: React.FC<SuspiciousLoginProps> = ({
  name = "User",
  deviceInfo = "Firefox on Linux",
  ipAddress = "103.45.67.89",
  location = "Kiev, Ukraine",
  verificationLink = "https://byroo.digital/verify-login",
}) => (
  <BrandedLayout previewText="Urgent: Suspicious activity blocked" showUnsubscribe={false}>
    <EmailH1>Suspicious login attempt blocked 🛑</EmailH1>
    <EmailBody>
      Hello {name},
    </EmailBody>
    <EmailBody>
      We detected a sign-in attempt from a location or device you don't normally use. For your protection, we have temporarily locked access to your account until you verify your identity.
    </EmailBody>
    <EmailCard className="bg-red-50/10 border-red-200">
      <EmailBody className="m-0 mb-1 text-sm"><strong>Attempted Device:</strong> {deviceInfo}</EmailBody>
      <EmailBody className="m-0 mb-1 text-sm"><strong>IP Address:</strong> {ipAddress}</EmailBody>
      <EmailBody className="m-0 text-sm"><strong>Approx. Location:</strong> {location}</EmailBody>
    </EmailCard>
    <EmailBody className="mt-4">
      If this was indeed you, click the button below to verify your login and restore account access.
    </EmailBody>
    <EmailCTA
      title="Verify Identity"
      description="Authorize access from this device."
      buttonText="Verify Session"
      href={verificationLink}
    />
  </BrandedLayout>
);

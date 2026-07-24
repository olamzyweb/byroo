import * as React from "react";
import { BrandedLayout } from "../layouts/BrandedLayout";
import {
  EmailH1,
  EmailBody,
  EmailCTA,
  EmailDivider,
  EmailCard,
  EmailCallout,
  EmailMuted,
} from "../components/Primitives";

// 1. Subscription Started
interface SubscriptionStartedProps {
  name: string;
  planName: string;
  priceAmount: string;
  billingPeriod: string;
  renewalDate: string;
  unsubscribeToken?: string;
}
export const SubscriptionStarted: React.FC<SubscriptionStartedProps> = ({
  name = "Creator",
  planName = "Pro Monthly",
  priceAmount = "₦10,000 / month",
  billingPeriod = "Monthly",
  renewalDate = "2026-08-23",
  unsubscribeToken,
}) => (
  <BrandedLayout
    previewText={`Welcome to Byroo Pro! Plan started`}
    unsubscribeToken={unsubscribeToken}
  >
    <EmailH1>Welcome to Byroo Pro! 💎</EmailH1>
    <EmailBody>
      Hello {name}, thank you for upgrading! Your subscription to <strong>Byroo Pro ({billingPeriod})</strong> is now active.
    </EmailBody>
    <EmailBody>
      You now have access to all premium features, including a custom domain mapping, unlimited catalog items, premium theme designs, and removing the Byroo footer branding.
    </EmailBody>
    <EmailCard className="bg-indigo-50/20 border-indigo-100">
      <EmailBody className="m-0 mb-1"><strong>Active Plan:</strong> {planName}</EmailBody>
      <EmailBody className="m-0 mb-1"><strong>Amount:</strong> {priceAmount}</EmailBody>
      <EmailBody className="m-0 mb-1"><strong>Billing Cycle:</strong> {billingPeriod}</EmailBody>
      <EmailBody className="m-0"><strong>Next Renewal Date:</strong> {renewalDate}</EmailBody>
    </EmailCard>
    <EmailCTA
      title="Customize Your Branding"
      description="Head over to your layout manager to remove the Byroo footer."
      buttonText="Go to Dashboard"
      href="https://byroo.digital/dashboard"
    />
  </BrandedLayout>
);

// 2. Subscription Renewed
interface SubscriptionRenewedProps {
  name: string;
  planName: string;
  priceAmount: string;
  renewalDate: string;
  unsubscribeToken?: string;
}
export const SubscriptionRenewed: React.FC<SubscriptionRenewedProps> = ({
  name = "Creator",
  planName = "Pro Monthly",
  priceAmount = "₦10,000",
  renewalDate = "2026-09-23",
  unsubscribeToken,
}) => (
  <BrandedLayout
    previewText="Your Byroo subscription has been renewed"
    unsubscribeToken={unsubscribeToken}
  >
    <EmailH1>Subscription Renewed 🔄</EmailH1>
    <EmailBody>
      Hello {name}, your subscription to <strong>{planName}</strong> was successfully renewed. Thank you for your continued support!
    </EmailBody>
    <EmailCard className="bg-gray-50 border-gray-200">
      <EmailBody className="m-0 mb-1"><strong>Paid Amount:</strong> {priceAmount}</EmailBody>
      <EmailBody className="m-0"><strong>Next Billing Date:</strong> {renewalDate}</EmailBody>
    </EmailCard>
    <EmailBody className="text-sm mt-4">
      If you need to make changes to your billing settings, update your payment card, or download your invoices, you can do so in the Billing tab of your dashboard.
    </EmailBody>
    <EmailCTA
      title="Manage Subscription"
      description="Update card details or change billing cycles."
      buttonText="Billing Settings"
      href="https://byroo.digital/dashboard/billing"
    />
  </BrandedLayout>
);

// 3. Subscription Failed
interface SubscriptionFailedProps {
  name: string;
  planName: string;
  priceAmount: string;
  retryDate: string;
}
export const SubscriptionFailed: React.FC<SubscriptionFailedProps> = ({
  name = "Creator",
  planName = "Pro Monthly",
  priceAmount = "₦10,000",
  retryDate = "in 2 days",
}) => (
  <BrandedLayout previewText="Action Required: Byroo payment failed" showUnsubscribe={false}>
    <EmailH1>Payment Failed ❌</EmailH1>
    <EmailBody>
      Hello {name},
    </EmailBody>
    <EmailBody>
      We were unable to process your renewal payment of <strong>{priceAmount}</strong> for your <strong>{planName}</strong> plan. This is often due to an expired card, insufficient funds, or bank restrictions.
    </EmailBody>
    <EmailCallout type="danger">
      We will attempt to process the payment again <strong>{retryDate}</strong>. If payment fails again, your account will be downgraded to the free tier and premium features will be suspended.
    </EmailCallout>
    <EmailCTA
      title="Update Payment Details"
      description="Provide a new credit/debit card to prevent interruptions."
      buttonText="Update Payment Card"
      href="https://byroo.digital/dashboard/billing"
    />
  </BrandedLayout>
);

// 4. Trial Ending
interface TrialEndingProps {
  name: string;
  daysRemaining: number;
  planName: string;
  priceAmount: string;
  actionUrl: string;
}
export const TrialEnding: React.FC<TrialEndingProps> = ({
  name = "Creator",
  daysRemaining = 3,
  planName = "Pro Monthly",
  priceAmount = "₦500 / month",
  actionUrl = "https://byroo.digital/dashboard/billing",
}) => (
  <BrandedLayout previewText={`Your Byroo trial is ending in ${daysRemaining} days!`} showUnsubscribe={false}>
    <EmailH1>Your free trial is ending soon ⏳</EmailH1>
    <EmailBody>
      Hello {name},
    </EmailBody>
    <EmailBody>
      We hope you've enjoyed testing out <strong>Byroo Pro</strong>! Your free trial period is ending in <strong>{daysRemaining} days</strong>.
    </EmailBody>
    <EmailBody>
      To keep enjoying custom domain mapping, premium themes, advanced analytics, and unlimited business space layouts, add a payment method before your trial expires.
    </EmailBody>
    <EmailCard className="bg-amber-50/10 border-amber-200">
      <EmailBody className="m-0 mb-1"><strong>Selected Upgrade Plan:</strong> {planName}</EmailBody>
      <EmailBody className="m-0"><strong>Price:</strong> {priceAmount}</EmailBody>
    </EmailCard>
    <EmailCTA
      title="Complete Subscription"
      description="Add payment info to ensure zero disruption."
      buttonText="Keep Premium Features"
      href={actionUrl}
    />
  </BrandedLayout>
);

// 5. Payment Receipt
interface PaymentReceiptProps {
  name: string;
  receiptNumber: string;
  amount: string;
  date: string;
  planName: string;
  unsubscribeToken?: string;
}
export const PaymentReceipt: React.FC<PaymentReceiptProps> = ({
  name = "User",
  receiptNumber = "REC-42234-92",
  amount = "₦10,000",
  date = "2026-07-23",
  planName = "Pro Monthly",
  unsubscribeToken,
}) => (
  <BrandedLayout
    previewText={`Payment Receipt: ${receiptNumber}`}
    unsubscribeToken={unsubscribeToken}
  >
    <EmailH1>Payment Receipt 🧾</EmailH1>
    <EmailBody>
      Hello {name}, this email is a receipt confirming your payment of <strong>{amount}</strong> on {date} for <strong>{planName}</strong>.
    </EmailBody>
    <EmailCard className="bg-gray-50 border-gray-200">
      <table className="w-full text-sm">
        <tr className="border-b border-solid border-gray-200">
          <td className="font-semibold text-gray-500 py-2">Receipt Number:</td>
          <td className="text-gray-800 text-right py-2">{receiptNumber}</td>
        </tr>
        <tr className="border-b border-solid border-gray-200">
          <td className="font-semibold text-gray-500 py-2">Date:</td>
          <td className="text-gray-800 text-right py-2">{date}</td>
        </tr>
        <tr className="border-b border-solid border-gray-200">
          <td className="font-semibold text-gray-500 py-2">Description:</td>
          <td className="text-gray-800 text-right py-2">{planName} Subscription</td>
        </tr>
        <tr>
          <td className="font-bold text-indigo-600 py-2">Total Paid:</td>
          <td className="font-bold text-indigo-600 text-right py-2">{amount}</td>
        </tr>
      </table>
    </EmailCard>
    <EmailBody className="text-sm mt-4 text-center text-gray-500">
      A PDF version of this invoice is saved in your dashboard billing tab for compliance and tax purposes.
    </EmailBody>
  </BrandedLayout>
);

// 6. Invoice Available
interface InvoiceAvailableProps {
  name: string;
  invoiceId: string;
  amount: string;
  dueDate: string;
  unsubscribeToken?: string;
}
export const InvoiceAvailable: React.FC<InvoiceAvailableProps> = ({
  name = "User",
  invoiceId = "INV-788392",
  amount = "₦10,000",
  dueDate = "2026-07-30",
  unsubscribeToken,
}) => (
  <BrandedLayout
    previewText={`Invoice ${invoiceId} is available for payment`}
    unsubscribeToken={unsubscribeToken}
  >
    <EmailH1>New Invoice Available 🧾</EmailH1>
    <EmailBody>
      Hello {name}, your invoice <strong>{invoiceId}</strong> for your Byroo subscription has been issued and is ready for payment.
    </EmailBody>
    <EmailCard className="bg-gray-50 border-gray-200">
      <EmailBody className="m-0 mb-1"><strong>Invoice Number:</strong> #{invoiceId}</EmailBody>
      <EmailBody className="m-0 mb-1"><strong>Amount Due:</strong> {amount}</EmailBody>
      <EmailBody className="m-0"><strong>Due Date:</strong> {dueDate}</EmailBody>
    </EmailCard>
    <EmailCTA
      title="View and Pay Invoice"
      description="Pay securely online via credit card or transfer."
      buttonText="Pay Invoice"
      href="https://byroo.digital/dashboard/billing"
    />
  </BrandedLayout>
);

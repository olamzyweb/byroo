import * as React from "react";
import { BrandedLayout } from "../layouts/BrandedLayout";
import {
  EmailH1,
  EmailBody,
  EmailCTA,
  EmailDivider,
  EmailCard,
} from "../components/Primitives";
import { Row, Column, Text } from "@react-email/components";

// 1. Weekly Digest
interface WeeklyDigestProps {
  businessName: string;
  startDate: string;
  endDate: string;
  profileViews: number;
  newInquiries: number;
  newReviews: number;
  inquiriesGrowth: number; // e.g. 15 for +15%
  popularItemName?: string;
  tipTitle?: string;
  tipContent?: string;
  unsubscribeToken?: string;
}
export const WeeklyDigest: React.FC<WeeklyDigestProps> = ({
  businessName = "My Space",
  startDate = "July 16",
  endDate = "July 22",
  profileViews = 150,
  newInquiries = 12,
  newReviews = 4,
  inquiriesGrowth = 20,
  popularItemName = "Premium Consulting Service",
  tipTitle = "Ask for testimonials after delivery",
  tipContent = "Asking for customer feedback directly on WhatsApp right after a successful delivery and adding it to your testimonials dashboard increases reviews by 80%.",
  unsubscribeToken,
}) => (
  <BrandedLayout
    previewText={`Your weekly performance update for ${businessName}`}
    unsubscribeToken={unsubscribeToken}
  >
    <EmailH1>Your Weekly Update 📊</EmailH1>
    <EmailBody>
      Here is your performance summary for <strong>{businessName}</strong> from {startDate} to {endDate}.
    </EmailBody>

    <Row className="mb-4 text-center">
      <Column className="w-1/3 bg-gray-50 border border-solid border-gray-200 rounded-lg p-3">
        <Text className="text-2xl font-extrabold text-indigo-600 m-0">{profileViews}</Text>
        <Text className="text-xs text-gray-500 m-0">Profile Views</Text>
      </Column>
      <Column className="w-4"></Column>
      <Column className="w-1/3 bg-gray-50 border border-solid border-gray-200 rounded-lg p-3">
        <Text className="text-2xl font-extrabold text-indigo-600 m-0">{newInquiries}</Text>
        <Text className="text-xs text-gray-500 m-0">New Inquiries</Text>
      </Column>
      <Column className="w-4"></Column>
      <Column className="w-1/3 bg-gray-50 border border-solid border-gray-200 rounded-lg p-3">
        <Text className="text-2xl font-extrabold text-indigo-600 m-0">{newReviews}</Text>
        <Text className="text-xs text-gray-500 m-0">New Reviews</Text>
      </Column>
    </Row>

    <EmailCard className="bg-indigo-50/20 border-indigo-100">
      <EmailBody className="m-0 mb-1">
        📈 Your weekly inquiries grew by <strong>{inquiriesGrowth}%</strong> compared to last week!
      </EmailBody>
      {popularItemName && (
        <EmailBody className="m-0">
          🔥 Your most viewed item was: <strong>{popularItemName}</strong>.
        </EmailBody>
      )}
    </EmailCard>

    {tipTitle && (
      <EmailCard className="bg-amber-50/10 border-amber-200">
        <EmailBody className="m-0 font-bold text-amber-900 mb-1">💡 Seller Tip: {tipTitle}</EmailBody>
        <EmailBody className="m-0 text-sm text-gray-700">{tipContent}</EmailBody>
      </EmailCard>
    )}

    <EmailCTA
      title="View Detailed Analytics"
      description="See device breakdowns and click data in your dashboard."
      buttonText="Go to Analytics"
      href="https://byroo.digital/login"
    />
  </BrandedLayout>
);

// 2. Monthly Digest / Report
interface MonthlyReportProps {
  businessName: string;
  monthName: string;
  totalViews: number;
  totalInquiries: number;
  viewsGrowth: number;
  conversionRate: string;
  healthStatus: "excellent" | "good" | "needs_work";
  unsubscribeToken?: string;
}
export const MonthlyReport: React.FC<MonthlyReportProps> = ({
  businessName = "My Business",
  monthName = "July 2026",
  totalViews = 840,
  totalInquiries = 62,
  viewsGrowth = 15,
  conversionRate = "7.3%",
  healthStatus = "good",
  unsubscribeToken,
}) => {
  let healthText = "Needs Work ⚠️";
  let healthDesc = "Your traffic or catalog updates are low. Try sharing your link more often.";
  if (healthStatus === "excellent") {
    healthText = "Excellent! 🏆";
    healthDesc = "Your space is highly active and conversion rates are strong. Keep it up!";
  } else if (healthStatus === "good") {
    healthText = "Healthy & Growing 👍";
    healthDesc = "Your space is getting stable traffic and inquiries. Fresh updates will help you scale.";
  }

  return (
    <BrandedLayout
      previewText={`Your business health report for ${monthName}`}
      unsubscribeToken={unsubscribeToken}
    >
      <EmailH1>Monthly Performance Report 📈</EmailH1>
      <EmailBody>
        Hello, here is your comprehensive monthly growth report for <strong>{businessName}</strong> covering {monthName}.
      </EmailBody>

      <EmailCard className="bg-gray-50 border-gray-200">
        <table className="w-full text-sm">
          <tr className="border-b border-solid border-gray-200">
            <td className="font-semibold text-gray-500 py-3">Month:</td>
            <td className="text-gray-800 text-right font-bold py-3">{monthName}</td>
          </tr>
          <tr className="border-b border-solid border-gray-200">
            <td className="font-semibold text-gray-500 py-3">Total Page Views:</td>
            <td className="text-gray-800 text-right py-3">{totalViews} ({viewsGrowth}% vs. last month)</td>
          </tr>
          <tr className="border-b border-solid border-gray-200">
            <td className="font-semibold text-gray-500 py-3">Total Inquiries:</td>
            <td className="text-gray-800 text-right py-3">{totalInquiries}</td>
          </tr>
          <tr className="border-b border-solid border-gray-200">
            <td className="font-semibold text-gray-500 py-3">Visitor Conversion Rate:</td>
            <td className="text-gray-800 text-right py-3">{conversionRate}</td>
          </tr>
          <tr>
            <td className="font-semibold text-gray-500 py-3">Profile Health:</td>
            <td className="text-gray-800 text-right font-semibold py-3">{healthText}</td>
          </tr>
        </table>
      </EmailCard>

      <EmailCard className="bg-indigo-50/20 border-indigo-100">
        <EmailBody className="m-0 font-bold text-indigo-900 mb-1">Health Summary</EmailBody>
        <EmailBody className="m-0 text-sm text-indigo-700">{healthDesc}</EmailBody>
      </EmailCard>

      <EmailCTA
        title="Check Vendor Insights"
        description="View your full monthly analytics report and recommendations."
        buttonText="View Insights"
        href="https://byroo.digital/login"
      />
    </BrandedLayout>
  );
};

"use client";

import React, { useState } from "react";
import { retryFailedEmail, sendTestEmail } from "./actions";
import { RefreshCw, Send, Loader2 } from "lucide-react";

interface ClientDashboardActionsProps {
  logId?: string;
  status?: string;
  onlyTestForm?: boolean;
}

export default function ClientDashboardActions({
  logId,
  status,
  onlyTestForm = false,
}: ClientDashboardActionsProps) {
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("welcome");
  const [activeTab, setActiveTab] = useState<"template" | "custom">("template");
  const [customSubject, setCustomSubject] = useState("");
  const [customBody, setCustomBody] = useState("");
  const [testStatus, setTestStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleRetry = async () => {
    if (!logId) return;
    setLoading(true);
    try {
      const res = await retryFailedEmail(logId);
      if (res.success) {
        alert("Email queue reset successfully!");
        window.location.reload();
      } else {
        alert(`Failed to retry: ${res.error}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return;

    setLoading(true);
    setTestStatus(null);
    try {
      let res;
      if (activeTab === "template") {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const variables = {
          name: "Test User",
          verificationUrl: `${baseUrl}/verify?token=test`,
          resetUrl: `${baseUrl}/reset-password?token=test`,
          code: "888999",
          businessName: "Sleek Boutique",
          businessUrl: `${baseUrl}/sleek`,
          reason: "Test review check.",
          customerName: "Alice Cooper",
          customerEmail: "alice@example.com",
          itemName: "Premium Consulting Session",
          message: "This is a verification test message body.",
          rating: 5,
          reviewText: "Incredible client experience!",
          receiptNumber: "REC-TEST-1",
          amount: "₦15,000",
          date: new Date().toLocaleDateString(),
          planName: "Pro Monthly",
        };

        res = await sendTestEmail(testEmail, selectedTemplate, variables);
      } else {
        res = await sendTestEmail(testEmail, "custom", {
          subject: customSubject || "Byroo Notification",
          bodyText: customBody,
        });
      }

      if (res.success) {
        setTestStatus({
          type: "success",
          msg: `Success: ${res.result?.message || "Email enqueued"}`,
        });
        if (activeTab === "custom") {
          setCustomSubject("");
          setCustomBody("");
        }
        setTestEmail("");
      } else {
        setTestStatus({ type: "error", msg: `Failed: ${res.error}` });
      }
    } catch (err: any) {
      setTestStatus({ type: "error", msg: `Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  if (onlyTestForm) {
    return (
      <form onSubmit={handleTestSend} className="space-y-4 text-sm">
        {/* Tab Toggle */}
        <div className="flex border-b border-solid border-gray-250 pb-2 mb-4">
          <button
            type="button"
            onClick={() => { setActiveTab("template"); setTestStatus(null); }}
            className={`flex-1 pb-1 text-xs font-bold text-center border-b-2 transition ${
              activeTab === "template"
                ? "border-indigo-650 text-indigo-600 border-indigo-600 font-extrabold"
                : "border-transparent text-gray-400 hover:text-gray-650"
            }`}
          >
            Template Test
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("custom"); setTestStatus(null); }}
            className={`flex-1 pb-1 text-xs font-bold text-center border-b-2 transition ${
              activeTab === "custom"
                ? "border-indigo-655 text-indigo-600 border-indigo-600 font-extrabold"
                : "border-transparent text-gray-400 hover:text-gray-650"
            }`}
          >
            Direct Custom
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Target Email Address</label>
          <input
            type="email"
            required
            placeholder="developer@example.com"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="w-full bg-gray-50 border border-solid border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-800"
          />
        </div>

        {activeTab === "template" ? (
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Choose Email Template</label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full bg-gray-50 border border-solid border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-800"
            >
              {/* Auth */}
              <option value="welcome">Welcome Email</option>
              <option value="verify-email">Verify Email</option>
              <option value="password-reset">Password Reset</option>
              <option value="email-changed">Email Changed Alert</option>
              <option value="account-deleted">Account Deleted Confirmation</option>
              {/* Onboarding Lifecycle */}
              <option value="onboarding-day0">Onboarding Day 0: Welcome & Setup</option>
              <option value="onboarding-day1">Onboarding Day 1: Link in Bio tips</option>
              <option value="onboarding-day2">Onboarding Day 2: WhatsApp checkout tips</option>
              <option value="onboarding-day3">Onboarding Day 3: Catalog optimization checklist</option>
              <option value="onboarding-day4">Onboarding Day 4: Reviews & Testimonials guide</option>
              <option value="onboarding-day5">Onboarding Day 5: Mobile storefront check</option>
              <option value="onboarding-day6">Onboarding Day 6: Sharing blueprint checklist</option>
              <option value="onboarding-day7">Onboarding Day 7: Analytics performance check</option>
              {/* Business */}
              <option value="business-published">Business Published</option>
              <option value="business-approved">Business Approved</option>
              <option value="business-suspended">Business Suspended</option>
              <option value="business-rejected">Business Rejected</option>
              <option value="business-verified">Business Verified Badge</option>
              <option value="profile-completed">Profile Completed Incentive</option>
              {/* Customer activity */}
              <option value="new-inquiry">New Customer Inquiry</option>
              <option value="new-review">New Customer Review</option>
              <option value="new-contact-message">New General Message</option>
              <option value="new-booking">New Service Booking</option>
              <option value="new-order">New Storefront Order</option>
              {/* Billing */}
              <option value="subscription-receipt">Payment Invoice Receipt</option>
              <option value="subscription-renewed">Subscription Renewed</option>
              <option value="subscription-failed">Subscription Payment Failed</option>
              <option value="trial-ending">Trial Period Expiring Warning</option>
              <option value="invoice-available">Invoice Available Issued</option>
              {/* Security */}
              <option value="login-alert">New Login Alert</option>
              <option value="password-changed">Password Changed Notification</option>
              <option value="suspicious-login">Suspicious Login Blocked</option>
            </select>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Email Subject Line</label>
              <input
                type="text"
                required
                placeholder="e.g. Action required: Update your listing"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="w-full bg-gray-50 border border-solid border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Message Body (Paragraphs)</label>
              <textarea
                required
                placeholder="Type your custom email message here. Use double newlines to create separate paragraphs..."
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                rows={5}
                className="w-full bg-gray-50 border border-solid border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-800 resize-none font-sans"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          {activeTab === "template" ? "Send Test Template" : "Send Custom Email"}
        </button>

        {testStatus && (
          <div
            className={`p-3 rounded-lg text-xs font-semibold ${
              testStatus.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-solid border-emerald-100"
                : "bg-red-50 text-red-700 border border-solid border-red-100"
            }`}
          >
            {testStatus.msg}
          </div>
        )}
      </form>
    );
  }

  // Row retry action
  if (status === "failed") {
    return (
      <button
        onClick={handleRetry}
        disabled={loading}
        className="inline-flex items-center gap-1.5 bg-gray-50 border border-solid border-gray-200 text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50"
      >
        <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
        Retry
      </button>
    );
  }

  return <span className="text-xs text-gray-400 font-semibold select-none">-</span>;
}

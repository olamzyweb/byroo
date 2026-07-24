"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Check, Loader2, Shield, Settings, Bell, XCircle } from "lucide-react";

interface PreferencesState {
  marketing: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  productAnnouncements: boolean;
  billingNotifications: boolean;
  systemNotifications: boolean;
}

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const [preferences, setPreferences] = useState<PreferencesState>({
    marketing: true,
    weeklyReports: true,
    monthlyReports: true,
    productAnnouncements: true,
    billingNotifications: true,
    systemNotifications: true,
  });

  useEffect(() => {
    if (!token) {
      setError("Missing unsubscribe token. Please use the link provided in your email.");
      setLoading(false);
      return;
    }

    // Verify token and fetch preferences
    fetch(`/api/email/unsubscribe?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setEmail(data.email);
          setPreferences({
            marketing: data.preferences.marketing,
            weeklyReports: data.preferences.weeklyReports,
            monthlyReports: data.preferences.monthlyReports,
            productAnnouncements: data.preferences.productAnnouncements,
            billingNotifications: data.preferences.billingNotifications,
            systemNotifications: data.preferences.systemNotifications,
          });
        }
      })
      .catch((err) => {
        setError("Failed to load preferences. Please check your connection.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handleToggle = (key: keyof PreferencesState) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    try {
      const res = await fetch("/api/email/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, preferences }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  const handleUnsubscribeAll = async () => {
    if (!token) return;

    const optOutAll = {
      marketing: false,
      weeklyReports: false,
      monthlyReports: false,
      productAnnouncements: false,
      billingNotifications: true, // keep critical ones
      systemNotifications: true,
    };

    setSaving(true);
    try {
      const res = await fetch("/api/email/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, preferences: optOutAll }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setPreferences(optOutAll);
        setSuccess(true);
      }
    } catch {
      setError("Failed to unsubscribe.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="mt-4 text-gray-500 text-sm">Loading your email settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <XCircle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-lg font-bold text-gray-900">Unable to load preferences</h2>
        <p className="mt-2 text-sm text-gray-600">{error}</p>
        <a
          href={process.env.NEXT_PUBLIC_APP_URL || "/"}
          className="mt-6 inline-block bg-indigo-600 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Go to Homepage
        </a>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <Check className="h-6 w-6 text-emerald-600" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-gray-900">Preferences Updated!</h2>
        <p className="mt-2 text-sm text-gray-600">
          Your changes have been saved for <strong className="text-gray-900">{email}</strong>.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          It may take a few minutes for these settings to take effect globally.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
        >
          Modify settings again
        </button>
      </div>
    );
  }

  const preferenceItems: Array<{
    key: keyof PreferencesState;
    title: string;
    description: string;
  }> = [
    {
      key: "marketing",
      title: "Marketing & Campaigns",
      description: "Receive tips, updates, special offers, and general newsletters.",
    },
    {
      key: "weeklyReports",
      title: "Weekly Performance Digests",
      description: "Weekly summary of views, clicks, inquiries, and custom reviews.",
    },
    {
      key: "monthlyReports",
      title: "Monthly Reports",
      description: "Detailed monthly analytics on traffic growth and space health.",
    },
    {
      key: "productAnnouncements",
      title: "Product Announcements",
      description: "Get notified when we launch new dashboard blocks, themes, or integrations.",
    },
    {
      key: "billingNotifications",
      title: "Billing Notifications",
      description: "Receipts, invoice notifications, and billing status alerts.",
    },
    {
      key: "systemNotifications",
      title: "System & Vendor Notifications",
      description: "Get alerts when visitors reviews you, sends an inquiry, or maps booking slots.",
    },
  ];

  return (
    <div>
      <div className="text-center mb-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
          <Mail className="h-6 w-6 text-indigo-600" />
        </div>
        <h1 className="mt-4 text-xl font-bold tracking-tight text-gray-900">Email Preferences</h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage notifications for <strong className="text-gray-700">{email}</strong>
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
          {preferenceItems.map(({ key, title, description }) => (
            <div key={key} className="flex items-start justify-between py-4">
              <div className="pr-4">
                <label className="text-sm font-semibold text-gray-900 select-none block cursor-pointer">
                  {title}
                </label>
                <span className="text-xs text-gray-500 block leading-normal mt-0.5">{description}</span>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => handleToggle(key)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    preferences[key] ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      preferences[key] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}

          {/* Readonly Security Setting */}
          <div className="flex items-start justify-between py-4">
            <div className="pr-4">
              <label className="text-sm font-semibold text-gray-900 flex items-center gap-1.5 select-none">
                Security Notifications <Shield className="h-3.5 w-3.5 text-gray-400" />
              </label>
              <span className="text-xs text-gray-500 block leading-normal mt-0.5">
                Required login alerts, password changes, and account recovery verification.
              </span>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                disabled
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-not-allowed rounded-full border-2 border-transparent bg-indigo-600/50"
              >
                <span className="inline-block h-5 w-5 transform rounded-full bg-white translate-x-5 shadow" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center bg-indigo-600 text-white font-semibold text-sm py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition shadow-sm disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save Preference Settings
          </button>

          <button
            type="button"
            onClick={handleUnsubscribeAll}
            disabled={saving}
            className="w-full bg-gray-50 text-gray-700 font-semibold text-sm py-2.5 px-4 rounded-lg border border-solid border-gray-200 hover:bg-gray-100 transition"
          >
            Unsubscribe from all Marketing & Digests
          </button>
        </div>
      </form>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white border border-solid border-gray-200 p-8 rounded-2xl shadow-sm">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
              <p className="mt-4 text-gray-500 text-sm">Loading page...</p>
            </div>
          }
        >
          <UnsubscribeContent />
        </Suspense>
      </div>
    </div>
  );
}

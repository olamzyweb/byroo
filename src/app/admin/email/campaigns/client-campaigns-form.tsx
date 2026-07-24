"use client";

import React, { useState } from "react";
import { createCampaign, launchCampaign } from "../actions";
import { Play, Loader2, Plus, Users, Sparkles } from "lucide-react";

interface ClientCampaignsFormProps {
  campaignId?: string;
  status?: string;
  isActionButton?: boolean;
}

export default function ClientCampaignsForm({
  campaignId,
  status,
  isActionButton = false,
}: ClientCampaignsFormProps) {
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [templateName, setTemplateName] = useState("welcome");
  const [customBody, setCustomBody] = useState("");
  const [segment, setSegment] = useState("all");
  const [scheduledAt, setScheduledAt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const audienceFilter: { plan?: string; onboarded?: boolean } = {};
    if (segment === "pro") audienceFilter.plan = "pro";
    if (segment === "free") audienceFilter.plan = "free";
    if (segment === "incomplete") audienceFilter.onboarded = false;

    try {
      const res = await createCampaign(
        title,
        subject,
        templateName,
        customBody || null,
        audienceFilter,
        scheduledAt || null
      );

      if (res.success) {
        alert("Campaign created successfully!");
        // Clear fields
        setTitle("");
        setSubject("");
        setCustomBody("");
        setScheduledAt("");
        window.location.reload();
      } else {
        alert(`Error: ${res.error}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunch = async () => {
    if (!campaignId) return;
    if (!confirm("Are you sure you want to broadcast this campaign now? This will dispatch emails to all matching target profiles.")) {
      return;
    }

    setLoading(true);
    try {
      const res = await launchCampaign(campaignId);
      if (res.success) {
        alert(`Success! Launched campaign to ${res.recipientsCount} users (${res.queuedCount} successfully queued).`);
        window.location.reload();
      } else {
        alert(`Launch failed: ${res.error}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 1. Render action button in the list row
  if (isActionButton) {
    if (status === "draft") {
      return (
        <button
          onClick={handleLaunch}
          disabled={loading}
          className="inline-flex items-center gap-1 bg-indigo-50 border border-solid border-indigo-200 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Play className="h-3 w-3 fill-indigo-700" />
          )}
          Broadcast Now
        </button>
      );
    }
    return <span className="text-xs text-gray-400 font-semibold select-none">No actions</span>;
  }

  // 2. Render configuration builder form
  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm text-gray-800">
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Campaign Label</label>
        <input
          type="text"
          required
          placeholder="e.g. Weekly Seller Digest July Week 3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-50 border border-solid border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-800"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Email Subject Line</label>
        <input
          type="text"
          required
          placeholder="e.g. Grow your storefront sales on Byroo!"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full bg-gray-50 border border-solid border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-800"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Audience Segment</label>
          <select
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
            className="w-full bg-gray-50 border border-solid border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-800"
          >
            <option value="all">All Vendors</option>
            <option value="pro">Pro Plan Only</option>
            <option value="free">Free Plan Only</option>
            <option value="incomplete">Incomplete Profiles Only</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Base Template</label>
          <select
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="w-full bg-gray-50 border border-solid border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-800"
          >
            <option value="welcome">Welcome Onboarding</option>
            <option value="profile-completed">Profile Completed</option>
            <option value="business-verified">Verified Trusted Badge</option>
            <option value="custom">Custom Broadcast (Use Message Body)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Custom Message Body (Optional)</label>
        <textarea
          placeholder="Add customized campaign announcement text..."
          value={customBody}
          onChange={(e) => setCustomBody(e.target.value)}
          rows={5}
          className="w-full bg-gray-50 border border-solid border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-800 resize-none font-sans"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Schedule Dispatch (Optional)</label>
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="w-full bg-gray-50 border border-solid border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-800 text-xs"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 shadow-sm"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Plus className="h-4 w-4 mr-2" />
        )}
        Save Campaign
      </button>
    </form>
  );
}

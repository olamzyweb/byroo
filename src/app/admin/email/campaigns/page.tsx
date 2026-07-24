import React from "react";
import Link from "next/link";
import { getCampaigns } from "../actions";
import { Mail, Calendar, Users, Eye, Play, ArrowLeft, Loader2, Sparkles, AlertCircle } from "lucide-react";
import ClientCampaignsForm from "./client-campaigns-form";

export const dynamic = "force-dynamic";

export default async function CampaignBuilderPage() {
  const dbConfigured = !!process.env.DATABASE_URL;
  const campaigns = dbConfigured ? await getCampaigns() : [];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Warning callout if DATABASE_URL is missing */}
      {!dbConfigured && (
        <div className="bg-amber-50 border border-solid border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-amber-800">Database Connection Required</h3>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              The database connection URL is currently missing. Please add a valid connection string to the 
              <code className="bg-amber-100/50 px-1 py-0.5 rounded mx-1 font-semibold">DATABASE_URL</code> variable 
              inside your <code className="bg-amber-100/50 px-1 py-0.5 rounded font-semibold">.env.local</code> file 
              to enable querying campaign data or saving drafts via Prisma.
            </p>
          </div>
        </div>
      )}

      {/* Navigation & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-solid border-gray-200 pb-6">
        <div>
          <Link
            href="/admin/email"
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-indigo-600 mb-2 transition"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Campaign Builder</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, schedule, and broadcast email newsletters or promotions to targeted customer segments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaign Builder Form */}
        <div className="lg:col-span-1 bg-white border border-solid border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-solid border-gray-150 pb-3">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-gray-900">New Campaign Setup</h2>
          </div>
          <ClientCampaignsForm />
        </div>

        {/* Campaign Execution History */}
        <div className="lg:col-span-2 bg-white border border-solid border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-solid border-gray-200">
            <h2 className="text-base font-bold text-gray-900">Campaign History & Reports</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Campaign Details</th>
                  <th className="px-6 py-3">Target / Segment</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Stats</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                      No campaigns created yet. Set up a campaign on the left to get started.
                    </td>
                  </tr>
                ) : (
                  campaigns.map((camp) => {
                    const filter = (camp.audienceFilter || {}) as { plan?: string; onboarded?: boolean };
                    let audienceLabel = "All Users";
                    if (filter.plan === "pro") audienceLabel = "Pro Plan Only";
                    if (filter.plan === "free") audienceLabel = "Free Plan Only";
                    if (filter.onboarded === false) audienceLabel = "Incomplete Profiles Only";

                    return (
                      <tr key={camp.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 truncate max-w-[200px]" title={camp.title}>
                            {camp.title}
                          </div>
                          <div className="text-xs text-gray-500 font-semibold mt-0.5 truncate max-w-[200px]">
                            Subj: {camp.subject}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex items-center gap-1 text-xs">
                            <Users className="h-3 w-3 text-gray-400" />
                            {audienceLabel}
                          </div>
                          {camp.scheduledAt && (
                            <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                              <Calendar className="h-2.5 w-2.5" />
                              {new Date(camp.scheduledAt).toLocaleString()}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                              camp.status === "completed"
                                ? "bg-emerald-50 text-emerald-700 border border-solid border-emerald-100"
                                : camp.status === "sending"
                                ? "bg-blue-50 text-blue-700 border border-solid border-blue-100"
                                : camp.status === "scheduled"
                                ? "bg-purple-50 text-purple-700 border border-solid border-purple-100"
                                : "bg-gray-550 text-gray-500 bg-gray-100"
                            }`}
                          >
                            {camp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500 space-y-1">
                          <div>Sent: <strong className="text-gray-700">{camp.sentCount}</strong></div>
                          <div>Opened: <strong className="text-gray-700">{camp.openedCount}</strong></div>
                          <div>Clicked: <strong className="text-gray-700">{camp.clickedCount}</strong></div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <ClientCampaignsForm campaignId={camp.id} status={camp.status} isActionButton={true} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

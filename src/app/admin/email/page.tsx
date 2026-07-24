import React from "react";
import Link from "next/link";
import { getEmailStats, getRecentLogs } from "./actions";
import { Mail, Check, AlertCircle, RefreshCw, Eye, Send, ArrowRight, TrendingUp } from "lucide-react";
import ClientDashboardActions from "./client-actions";

export const dynamic = "force-dynamic";

export default async function AdminEmailDashboard() {
  const dbConfigured = !!process.env.DATABASE_URL;
  const stats = dbConfigured ? await getEmailStats() : {
    totalCount: 0,
    sentCount: 0,
    deliveredCount: 0,
    openedCount: 0,
    clickedCount: 0,
    failedCount: 0,
    bouncedCount: 0,
    openRate: 0,
    clickRate: 0,
  };
  const recentLogs = dbConfigured ? await getRecentLogs(30) : [];

  const statCards = [
    {
      title: "Total Emails",
      value: stats.totalCount,
      icon: Mail,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      title: "Sent",
      value: stats.sentCount,
      icon: Send,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Delivered",
      value: stats.deliveredCount,
      icon: Check,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Open Rate",
      value: `${stats.openRate.toFixed(1)}%`,
      icon: Eye,
      color: "text-amber-600 bg-amber-50",
    },
    {
      title: "Click Rate",
      value: `${stats.clickRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-50",
    },
    {
      title: "Failed / Bounced",
      value: stats.failedCount + stats.bouncedCount,
      icon: AlertCircle,
      color: "text-red-600 bg-red-50",
    },
  ];

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
              to enable reading email logs and campaign metrics via Prisma.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-solid border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Email System Infrastructure</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor transactional dispatches, analyze client interactions, and manage messaging campaigns.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/email/campaigns"
            className="inline-flex items-center justify-center bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition shadow-sm"
          >
            Campaign Builder <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white border border-solid border-gray-200 p-4 rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{card.title}</span>
              <div className={`p-1.5 rounded-lg ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </div>
            <span className="text-xl font-bold text-gray-900">{card.value}</span>
          </div>
        ))}
      </div>

      {/* Primary Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent logs */}
        <div className="lg:col-span-2 bg-white border border-solid border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-solid border-gray-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Recent Dispatched Emails</h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">Last 30 deliveries</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Recipient</th>
                  <th className="px-6 py-3">Template</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                      No emails sent yet.
                    </td>
                  </tr>
                ) : (
                  recentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 truncate max-w-[180px]" title={log.recipientEmail}>
                          {log.recipientEmail}
                        </div>
                        <div className="text-xs text-gray-400">
                          {log.profile?.displayName || "System / Guest"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{log.templateName}</code>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                            log.status === "delivered" || log.status === "opened" || log.status === "clicked"
                              ? "bg-emerald-50 text-emerald-700 border border-solid border-emerald-100"
                              : log.status === "failed" || log.status === "bounced"
                              ? "bg-red-50 text-red-700 border border-solid border-red-100"
                              : "bg-amber-50 text-amber-700 border border-solid border-amber-100"
                          }`}
                        >
                          {log.status}
                        </span>
                        {log.errorDetails && (
                          <p className="text-[10px] text-red-500 mt-1 max-w-[150px] truncate" title={log.errorDetails}>
                            {log.errorDetails}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        <br />
                        {new Date(log.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ClientDashboardActions logId={log.id} status={log.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Templates list & quick send test */}
        <div className="bg-white border border-solid border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-4">Templates Quick Test</h2>
            <p className="text-xs text-gray-500 mb-6">
              Select a system template and enter a recipient email address to send a fast test message.
            </p>
            <ClientDashboardActions onlyTestForm={true} />
          </div>
          <div className="mt-8 pt-6 border-t border-solid border-gray-200">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Email Tech Specs</h3>
            <ul className="text-xs text-gray-500 space-y-2">
              <li className="flex justify-between">
                <span>Provider:</span>
                <strong className="text-gray-700 font-semibold">Resend API</strong>
              </li>
              <li className="flex justify-between">
                <span>Rendering Engine:</span>
                <strong className="text-gray-700 font-semibold">React Email</strong>
              </li>
              <li className="flex justify-between">
                <span>Queue Broker:</span>
                <strong className="text-gray-700 font-semibold">Inngest Cloud / Dev</strong>
              </li>
              <li className="flex justify-between">
                <span>Analytics tracking:</span>
                <strong className="text-gray-700 font-semibold">Webhook triggers</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { QrCode, Printer, Download, Sparkles } from "lucide-react";


interface QrShareCardProps {
  username: string;
  displayName: string;
  avatarUrl: string | null;
  plan: string;
  hasCatalogItems: boolean;
  hasServices: boolean;
  accentColor?: string;
}

export function QrShareCard({
  username,
  displayName,
  avatarUrl,
  plan,
  hasCatalogItems,
  hasServices,
  accentColor = "#3451d1", // default Byroo accent
}: QrShareCardProps) {
  const [storefrontUrl, setStorefrontUrl] = useState("");
  const [ctaText, setCtaText] = useState("");

  // Determine default GTM text based on business profile
  useEffect(() => {
    setStorefrontUrl(`${window.location.origin}/${username}`);
    
    if (hasCatalogItems && hasServices) {
      setCtaText("Scan to view catalog, book & order");
    } else if (hasCatalogItems) {
      setCtaText("Scan to browse catalog & order");
    } else if (hasServices) {
      setCtaText("Scan to view services & book");
    } else {
      setCtaText("Scan to visit our digital page");
    }
  }, [username, hasCatalogItems, hasServices]);

  const qrCodeUrl = storefrontUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(storefrontUrl)}`
    : "";

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !storefrontUrl) return;

    const displayUrl = storefrontUrl.replace(/^https?:\/\//, "");

    const html = `
      <html>
        <head>
          <title>Byroo QR Flyer - ${displayName}</title>
          <style>
            @page {
              size: A5 portrait;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 40px;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              box-sizing: border-box;
              background-color: #ffffff;
              color: #0f172a;
              text-align: center;
            }
            .flyer {
              border: 2px solid #e2e8f0;
              border-radius: 28px;
              padding: 40px 30px;
              width: 100%;
              max-width: 360px;
              display: flex;
              flex-direction: column;
              align-items: center;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
            }
            .avatar {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              object-fit: cover;
              margin-bottom: 16px;
              border: 3px solid ${accentColor}22;
            }
            .avatar-placeholder {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              background-color: ${accentColor}0f;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 32px;
              font-weight: bold;
              color: ${accentColor};
              margin-bottom: 16px;
              border: 3px solid ${accentColor}22;
            }
            .title {
              font-size: 24px;
              font-weight: 700;
              margin: 0 0 6px 0;
              color: #0f172a;
            }
            .subtitle {
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.15em;
              color: ${accentColor};
              background-color: ${accentColor}0d;
              padding: 4px 12px;
              border-radius: 9999px;
              margin: 0 0 28px 0;
            }
            .qr-container {
              padding: 16px;
              background-color: #f8fafc;
              border-radius: 20px;
              border: 1.5px dashed ${accentColor}33;
              margin-bottom: 28px;
            }
            .qr-img {
              display: block;
              width: 200px;
              height: 200px;
            }
            .cta {
              font-size: 15px;
              font-weight: 600;
              margin: 0 0 8px 0;
              color: #334155;
            }
            .url {
              font-size: 16px;
              font-weight: 700;
              color: ${accentColor};
              margin: 0 0 8px 0;
            }
            .footer {
              font-size: 10px;
              color: #94a3b8;
              margin-top: 16px;
            }
            @media print {
              body {
                padding: 0;
                height: 100%;
              }
              .flyer {
                border: none;
                box-shadow: none;
                padding: 20px;
                max-width: 100%;
              }
            }
          </style>
        </head>
        <body>
          <div class="flyer">
            ${
              avatarUrl
                ? `<img class="avatar" src="${avatarUrl}" alt="${displayName}" />`
                : `<div class="avatar-placeholder">${displayName.slice(0, 1).toUpperCase()}</div>`
            }
            <h1 class="title">${displayName}</h1>
            ${
              plan === "pro"
                ? `<div class="subtitle">✓ Verified Partner</div>`
                : `<div class="subtitle" style="visibility: hidden;">Spacer</div>`
            }
            <div class="qr-container">
              <img class="qr-img" src="${qrCodeUrl}" alt="QR Code" />
            </div>
            <p class="cta">${ctaText}</p>
            <div class="url">${displayUrl}</div>
            <div class="footer">Created with Byroo • byroo.com</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] grid gap-6 md:grid-cols-5 items-center">
      {/* Flyer Card Live Preview */}
      <div className="md:col-span-2 flex justify-center">
        <div
          className="border rounded-2xl p-6 w-full max-w-[240px] flex flex-col items-center text-center shadow-sm select-none"
          style={{ borderColor: `${accentColor}22`, backgroundColor: "var(--surface)" }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-12 h-12 rounded-full object-cover border" style={{ borderColor: `${accentColor}22` }} />
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border"
              style={{ backgroundColor: `${accentColor}0f`, color: accentColor, borderColor: `${accentColor}22` }}
            >
              {displayName.slice(0, 1).toUpperCase()}
            </div>
          )}
          
          <h4 className="mt-2 text-sm font-bold text-[var(--text-strong)] line-clamp-1">{displayName}</h4>
          
          {plan === "pro" ? (
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 mt-1 rounded-full" style={{ backgroundColor: `${accentColor}0d`, color: accentColor }}>
              ✓ Verified
            </span>
          ) : (
            <span className="text-[9px] text-transparent mt-1 select-none">Spacer</span>
          )}

          {/* QR Code Container */}
          <div className="mt-4 p-2 bg-[var(--surface-muted)] rounded-xl border border-dashed" style={{ borderColor: `${accentColor}22` }}>
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="Storefront QR Code" className="w-28 h-28 block object-contain" />
            ) : (
              <div className="w-28 h-28 flex items-center justify-center bg-gray-50 text-[var(--text-soft)]">
                <QrCode className="w-8 h-8 animate-pulse" />
              </div>
            )}
          </div>

          <p className="mt-4 text-[10px] font-semibold text-[var(--text-soft)] leading-tight max-w-[160px]">
            {ctaText || "Scan to view storefront"}
          </p>

          <span className="mt-1 text-[11px] font-bold" style={{ color: accentColor }}>
            {storefrontUrl ? storefrontUrl.replace(/^https?:\/\//, "") : "byroo.com/..."}
          </span>
        </div>
      </div>

      {/* Inputs & Actions */}
      <div className="md:col-span-3 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-[var(--text-strong)]">Your QR Storefront Flyer</h3>
          <p className="mt-1 text-xs text-[var(--text-soft)] leading-normal">
            Generate and print a brand flyer for your packaging, delivery slips, or store counter. Customers can scan to instantly browse your catalog, links, or book your services.
          </p>
        </div>

        {/* CTA text customization */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-soft)]">
            Flyer Call-To-Action (CTA)
          </label>
          <div className="relative">
            <input
              type="text"
              value={ctaText}
              maxLength={45}
              onChange={(e) => setCtaText(e.target.value)}
              className="h-10 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] pl-3 pr-10 text-xs text-[var(--text-strong)] outline-none ring-[var(--brand-400)] transition focus:ring-2"
              placeholder="e.g. Scan to shop our menu"
            />
            <Sparkles className="absolute right-3.5 top-3 h-4 w-4 pointer-events-none text-amber-500 opacity-80" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--brand-600)] text-white hover:bg-[var(--brand-500)] shadow-[var(--shadow-soft)] px-3 text-xs font-semibold h-9 cursor-pointer transition"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Flyer
          </button>

          {storefrontUrl && (
            <a
              href={`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(storefrontUrl)}&format=png`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-3 text-xs font-semibold text-[var(--text-strong)] hover:bg-[var(--border-subtle)] transition h-9"
            >
              <Download className="h-3.5 w-3.5 text-[var(--text-soft)]" />
              Download QR Image
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

import * as React from "react";
import { BrandedLayout } from "../layouts/BrandedLayout";
import { EmailBody, EmailButton, EmailCard } from "../components/Primitives";
import { Section, Text } from "@react-email/components";

interface CustomEmailProps {
  bodyText: string;
  subject?: string;
  variables?: Record<string, any>;
  unsubscribeToken?: string;
}

/**
 * Parses markdown bold and italic formatting into React elements.
 */
function formatInlineText(text: string): React.ReactNode[] {
  // Regex to match **bold** or *italic*
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index} className="italic text-gray-800">{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export const CustomEmail: React.FC<CustomEmailProps> = ({
  bodyText = "",
  subject = "",
  variables = {},
  unsubscribeToken,
}) => {
  // Resolve standard variable placeholders
  const username = variables.username || "";
  const name = variables.name || variables.displayName || (username ? `@${username}` : "Creator");
  const firstName = variables.firstName || variables.first_name || (name.startsWith("@") ? name : name.split(" ")[0]) || "Creator";
  const dashboardUrl = variables.dashboardUrl || variables.dashboard_link || "https://byroo.digital/dashboard";
  const businessUrl = variables.businessUrl || variables.business_url || (username ? `https://byroo.digital/${username}` : "https://byroo.digital");
  const businessName = variables.businessName || variables.business_name || variables.displayName || variables.name || (username ? `@${username}` : "Creator");

  // Replace placeholders in text
  let processedText = bodyText
    .replace(/\{\{\s*username\s*\}\}/gi, username || "creator")
    .replace(/\{\{\s*first_name\s*\}\}/gi, firstName)
    .replace(/\{\{\s*firstName\s*\}\}/gi, firstName)
    .replace(/\{\{\s*name\s*\}\}/gi, name)
    .replace(/\{\{\s*business_name\s*\}\}/gi, businessName)
    .replace(/\{\{\s*businessName\s*\}\}/gi, businessName)
    .replace(/\{\{\s*business_url\s*\}\}/gi, businessUrl)
    .replace(/\{\{\s*business_link\s*\}\}/gi, businessUrl)
    .replace(/\{\{\s*dashboard_link\s*\}\}/gi, dashboardUrl)
    .replace(/\{\{\s*dashboard_url\s*\}\}/gi, dashboardUrl)
    .replace(/\{\{\s*dashboardUrl\s*\}\}/gi, dashboardUrl);

  // Check if this is an Independence Day or festive Nigerian communication
  const isIndependenceDay =
    /independence day|nigeria|🇳🇬/i.test(subject) ||
    /independence day|nigeria|🇳🇬/i.test(bodyText);

  // Preview snippet without markdown asterisks or special characters
  const cleanPreview = processedText
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/👉/g, "")
    .slice(0, 140)
    .trim();

  // Split body text into paragraph blocks
  const rawParagraphs = processedText.split(/\n\s*\n/);

  return (
    <BrandedLayout previewText={cleanPreview || subject || "Update from the Byroo Team"} unsubscribeToken={unsubscribeToken}>
      {/* Optional Celebratory Pill */}
      {isIndependenceDay && (
        <Section className="mb-6 text-center">
          <div className="inline-block bg-emerald-50 border border-solid border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-800 tracking-wide shadow-sm">
            🇳🇬 Happy Independence Day & New Month!
          </div>
        </Section>
      )}

      {rawParagraphs.map((para, pIndex) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        // Check if this paragraph is a CTA button line (e.g. 👉 {{dashboard_link}} or starts with 👉)
        if (trimmed.startsWith("👉") || trimmed.includes(dashboardUrl)) {
          // Extract any custom label before the link if provided
          let buttonLabel = "Update & Share Your Business Space →";
          if (trimmed.includes("Update Your Byroo Space") || trimmed.includes("look at your Byroo space")) {
            buttonLabel = "Update Your Byroo Space →";
          } else if (trimmed.includes("Dashboard") || trimmed.includes("dashboard")) {
            buttonLabel = "Open Your Dashboard →";
          }

          return (
            <Section key={pIndex} className="my-6 text-center">
              <EmailButton href={dashboardUrl} variant="primary" className="text-sm font-bold py-3.5 px-7">
                {buttonLabel}
              </EmailButton>
            </Section>
          );
        }

        // Check if paragraph contains bullet lines
        const lines = trimmed.split("\n");
        const hasBullets = lines.some((l) => /^\s*([•\-\*]|\d+\.)\s+/.test(l));

        if (hasBullets) {
          return (
            <Section key={pIndex} className="mb-4 pl-2">
              {lines.map((line, lIndex) => {
                const isBullet = /^\s*([•\-\*]|\d+\.)\s+/.test(line);
                const content = line.replace(/^\s*([•\-\*]|\d+\.)\s+/, "");
                return (
                  <Text key={lIndex} className="text-base leading-relaxed text-gray-800 m-0 mb-2">
                    {isBullet ? <span className="text-emerald-600 font-bold mr-2">•</span> : null}
                    {formatInlineText(isBullet ? content : line)}
                  </Text>
                );
              })}
            </Section>
          );
        }

        // Regular paragraph with potential linebreaks
        return (
          <EmailBody key={pIndex} className="mb-4">
            {lines.map((line, lIndex) => (
              <React.Fragment key={lIndex}>
                {formatInlineText(line)}
                {lIndex < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </EmailBody>
        );
      })}
    </BrandedLayout>
  );
};


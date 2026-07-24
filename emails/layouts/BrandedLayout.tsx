import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Tailwind,
} from "@react-email/components";
import { EmailHeader, EmailFooter } from "../components/Primitives";

interface BrandedLayoutProps {
  previewText: string;
  children: React.ReactNode;
  unsubscribeToken?: string;
  showUnsubscribe?: boolean;
}

export const BrandedLayout: React.FC<BrandedLayoutProps> = ({
  previewText,
  children,
  unsubscribeToken,
  showUnsubscribe = true,
}) => {
  return (
    <Html lang="en">
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                indigo: {
                  50: "#f5f3ff",
                  100: "#ede9fe",
                  500: "#6366f1",
                  600: "#4f46e5",
                  700: "#4338ca",
                  900: "#312e81",
                },
                emerald: {
                  50: "#ecfdf5",
                  100: "#d1fae5",
                  500: "#10b981",
                  600: "#059669",
                  700: "#047857",
                },
                gray: {
                  50: "#f9fafb",
                  100: "#f3f4f6",
                  200: "#e5e7eb",
                  500: "#6b7280",
                  700: "#374151",
                  800: "#1f2937",
                  900: "#111827",
                },
              },
            },
          },
        }}
      >
        <Head />
        <Preview>{previewText}</Preview>
        <Body className="bg-gray-50 font-sans py-8 px-4">
          <Container className="max-w-xl mx-auto bg-white border border-solid border-gray-200 rounded-2xl p-8 shadow-sm">
            <EmailHeader />
            {children}
            <EmailFooter unsubscribeToken={unsubscribeToken} showUnsubscribe={showUnsubscribe} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
export default BrandedLayout;

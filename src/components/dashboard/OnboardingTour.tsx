"use client";

import React, { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { markTourCompletedAction } from "@/app/dashboard/actions";
import { HelpCircle } from "lucide-react";

// Standard tour steps definition without emojis
const tourSteps = [
  {
    popover: {
      title: "Welcome to Byroo",
      description: "Let's take a quick 2-minute tour to help you set up your storefront and start collecting orders.",
      position: "center" as const,
    },
  },
  {
    element: "#step-completion-card",
    popover: {
      title: "Setup Checklist",
      description: "Follow these tasks to complete your profile. The closer you are to 100%, the more professional your page looks!",
      position: "bottom" as const,
    },
  },
  {
    element: "#nav-profile",
    popover: {
      title: "Brand Profile",
      description: "Claim your unique username, upload a header and avatar image, and write a bio describing what you sell.",
      position: "right" as const,
    },
  },
  {
    element: "#nav-whatsapp",
    popover: {
      title: "WhatsApp Checkout",
      description: "This is crucial. Link your active WhatsApp business line. Any product orders and inquiry forms route directly to your WhatsApp chat.",
      position: "right" as const,
    },
  },
  {
    element: "#nav-links",
    popover: {
      title: "Social Links",
      description: "Add links to your other active channels (like custom websites, booking channels, or email addresses).",
      position: "right" as const,
    },
  },
  {
    element: "#nav-catalog",
    popover: {
      title: "Catalog Products",
      description: "List your physical items, digital products, and items for sale with prices and checkout call-to-actions.",
      position: "right" as const,
    },
  },
  {
    element: "#nav-appearance",
    popover: {
      title: "Themes and Layouts",
      description: "Switch colors and templates! Choose between 7 layouts (Default, Grid, Minimal, Compact, Corporate, Gallery, or Social) to match your brand style.",
      position: "right" as const,
    },
  },
  {
    element: "#step-qr-card",
    popover: {
      title: "Storefront QR Flyer",
      description: "Customize and print a beautiful marketing flyer for your packaging or store counter, or download your raw QR code to share.",
      position: "top" as const,
    },
  },
  {
    element: "#step-quick-actions",
    popover: {
      title: "Quick Access and Sharing",
      description: "You're all set! Use these quick actions to update details. Copy your live link, paste it in your Instagram bio, and start taking orders.",
      position: "top" as const,
    },
  },
  {
    element: "#step-storefront-preview",
    popover: {
      title: "Storefront Live Preview",
      description: "Tap this preview button at any time to see a live mockup of your page. You can refresh it to instantly see updates as you edit your profile!",
      position: "top" as const,
    },
  },
];

// Helper to build the driver configuration with mobile sidebar integration
function createOnboardingDriver(options?: { onDestroyed?: () => void }) {
  return driver({
    showProgress: true,
    steps: tourSteps,
    allowClose: true,
    popoverClass: "byroo-tour-popover",
    onHighlightStarted: (element, step, { driver }) => {
      const isSidebarElement = element?.id && element.id.startsWith("nav-");
      if (isSidebarElement) {
        // Open the mobile sidebar programmatically
        window.dispatchEvent(new CustomEvent("byroo:open-sidebar"));
        
        // Delay to allow slide animation to complete, then scroll and refresh popover position
        setTimeout(() => {
          element.scrollIntoView({ block: "center", behavior: "auto" });
          
          // Wait a brief moment for the browser to finish the scroll before refreshing coordinates
          setTimeout(() => {
            driver.refresh();
          }, 50);
        }, 320);
      } else {
        // Close the mobile sidebar for steps outside of the sidebar
        window.dispatchEvent(new CustomEvent("byroo:close-sidebar"));
      }
    },
    onDestroyed: () => {
      // Ensure the sidebar closes when the tour ends
      window.dispatchEvent(new CustomEvent("byroo:close-sidebar"));
      options?.onDestroyed?.();
    },
  });
}

// Helper to launch the tour manually
export function startOnboardingTour() {
  const driverObj = createOnboardingDriver();
  driverObj.drive();
}

interface OnboardingTourProps {
  tourCompleted: boolean;
}

export function OnboardingTour({ tourCompleted }: OnboardingTourProps) {
  useEffect(() => {
    // If the tour is not completed, auto-start it on first load
    if (!tourCompleted) {
      const driverObj = createOnboardingDriver({
        onDestroyed: async () => {
          try {
            await markTourCompletedAction();
          } catch (error) {
            console.error("Failed to mark onboarding tour as completed in database:", error);
          }
        },
      });

      // Small delay to let page mount animations complete
      const timer = setTimeout(() => {
        driverObj.drive();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [tourCompleted]);

  return null;
}

export function RestartTourButton() {
  return (
    <button
      type="button"
      onClick={startOnboardingTour}
      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/80 text-indigo-700 font-semibold px-4 py-2 text-xs transition duration-200 shadow-sm active:scale-[0.98]"
    >
      <HelpCircle className="h-3.5 w-3.5" />
      Take Tour
    </button>
  );
}

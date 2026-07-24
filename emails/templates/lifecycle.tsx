import * as React from "react";
import { BrandedLayout } from "../layouts/BrandedLayout";
import {
  EmailH1,
  EmailBody,
  EmailCTA,
  EmailCard,
} from "../components/Primitives";
import { emailConfig } from "../../src/lib/email/config";

// Helper to build dashboard/login URLs dynamically
const loginUrl = `${emailConfig.baseUrl}/login`;

// Day 0: Platform intro & Setup profile
export const OnboardingDay0: React.FC<{ name: string; unsubscribeToken?: string }> = ({
  name = "Creator",
  unsubscribeToken,
}) => (
  <BrandedLayout previewText="Day 0: Welcome to Byroo! Setting up your space" unsubscribeToken={unsubscribeToken}>
    <EmailH1>Ready to build your digital home? 🏠</EmailH1>
    <EmailBody>
      Hi {name},
    </EmailBody>
    <EmailBody>
      Welcome to Byroo! I'm Olamide from the founding team. We created Byroo to give every freelancer, vendor, and local creator a simple, elegant, and professional way to showcase their work online without any code.
    </EmailBody>
    <EmailBody>
      Your first step is to customize your space and let your buyers know who you are.
    </EmailBody>
    <EmailCTA
      title="Step 1: Set up your Profile"
      description="Add a profile description, upload a clean logo/avatar, and configure your basic storefront settings."
      buttonText="Start Editing Profile"
      href={loginUrl}
    />
    <EmailBody className="text-sm text-gray-500 mt-6 italic">
      Have questions along the way? Just reply to this email, we're here to help!
    </EmailBody>
  </BrandedLayout>
);

// Day 1: Pinned link in bio
export const OnboardingDay1: React.FC<{ name: string; unsubscribeToken?: string }> = ({
  name = "Creator",
  unsubscribeToken,
}) => (
  <BrandedLayout previewText="Day 1: Where to share your Byroo URL for traffic" unsubscribeToken={unsubscribeToken}>
    <EmailH1>The Link in Bio secret 📌</EmailH1>
    <EmailBody>
      Hi {name},
    </EmailBody>
    <EmailBody>
      Now that your account is registered, let's ensure people can find you! The easiest way to drive page views to your storefront is by using the "Link in Bio" space on social media.
    </EmailBody>
    <EmailBody>
      We highly recommend pinning your custom Byroo link on:
    </EmailBody>
    <ul className="text-sm text-gray-700 leading-relaxed pl-5 mb-4">
      <li>Your Instagram profile bio</li>
      <li>Your TikTok channel bio</li>
      <li>Your Twitter/X profile and pin-board</li>
    </ul>
    <EmailCTA
      title="Get Your Storefront Link"
      description="Login to your dashboard to copy your custom storefront URL and pin it online."
      buttonText="Go to Dashboard"
      href={loginUrl}
    />
  </BrandedLayout>
);

// Day 2: WhatsApp checkout
export const OnboardingDay2: React.FC<{ name: string; unsubscribeToken?: string }> = ({
  name = "Creator",
  unsubscribeToken,
}) => (
  <BrandedLayout previewText="Day 2: Turn storefront visitors into direct leads" unsubscribeToken={unsubscribeToken}>
    <EmailH1>The WhatsApp Checkout advantage 💬</EmailH1>
    <EmailBody>
      Hi {name},
    </EmailBody>
    <EmailBody>
      Traditional storefront checkouts can feel cold and conversion rates are low. That's why Byroo relies on direct WhatsApp integrations.
    </EmailBody>
    <EmailBody>
      When a customer browses your Byroo space and hits "order", it immediately fires a WhatsApp chat with you, pre-filled with the item's name and price. This keeps your customers close, lets you build trust, and closes deals faster.
    </EmailBody>
    <EmailCTA
      title="Link your WhatsApp"
      description="Ensure your WhatsApp contact number is correctly formatted to receive buyer leads."
      buttonText="Update Contact Info"
      href={loginUrl}
    />
  </BrandedLayout>
);

// Day 3: Catalog optimization
export const OnboardingDay3: React.FC<{ name: string; unsubscribeToken?: string }> = ({
  name = "Creator",
  unsubscribeToken,
}) => (
  <BrandedLayout previewText="Day 3: List your best-sellers for buyers" unsubscribeToken={unsubscribeToken}>
    <EmailH1>3 tips to optimize your catalog 🛍️</EmailH1>
    <EmailBody>
      Hi {name},
    </EmailBody>
    <EmailBody>
      When visitors land on your storefront, clarity is key. Let's make sure they see your best-sellers or main service packages.
    </EmailBody>
    <EmailBody>
      Here is a quick catalog optimization checklist:
    </EmailBody>
    <EmailCard className="bg-indigo-50/20 border-indigo-100 text-sm">
      <EmailBody className="m-0 mb-2"><strong>1. Clear Images:</strong> Upload bright, high-resolution photos that show your work.</EmailBody>
      <EmailBody className="m-0 mb-2"><strong>2. Detailed Descriptions:</strong> State details like dimensions, delivery timeframe, or package scopes.</EmailBody>
      <EmailBody className="m-0"><strong>3. Set Starting Prices:</strong> Setting price clarity builds buyer confidence immediately.</EmailBody>
    </EmailCard>
    <EmailCTA
      title="Upload Catalog Items"
      description="Add products or services to your storefront catalog now."
      buttonText="Add Catalog Item"
      href={loginUrl}
    />
  </BrandedLayout>
);

// Day 4: Gathering customer trust
export const OnboardingDay4: React.FC<{ name: string; unsubscribeToken?: string }> = ({
  name = "Creator",
  unsubscribeToken,
}) => (
  <BrandedLayout previewText="Day 4: Collect customer reviews on auto-pilot" unsubscribeToken={unsubscribeToken}>
    <EmailH1>Showcase customer trust proof ⭐</EmailH1>
    <EmailBody>
      Hi {name},
    </EmailBody>
    <EmailBody>
      Trust is the ultimate currency online. When prospective clients land on your page and see 5-star ratings from previous clients, their buying confidence increases.
    </EmailBody>
    <EmailBody>
      We recommend asking your happy clients for testimonials (e.g. directly on WhatsApp or over email after a successful delivery) and manually adding them to your reviews page to show trust proof.
    </EmailBody>
    <EmailCTA
      title="Add Storefront Reviews"
      description="Add previous customer testimonials to show trust proof on your storefront page."
      buttonText="Manage Reviews"
      href={`${emailConfig.baseUrl}/dashboard/reviews`}
    />
  </BrandedLayout>
);

// Day 5: Mobile storefront check
export const OnboardingDay5: React.FC<{ name: string; unsubscribeToken?: string }> = ({
  name = "Creator",
  unsubscribeToken,
}) => (
  <BrandedLayout previewText="Day 5: Ensure your layout looks perfect on mobile" unsubscribeToken={unsubscribeToken}>
    <EmailH1>Is your storefront mobile-ready? 📱</EmailH1>
    <EmailBody>
      Hi {name},
    </EmailBody>
    <EmailBody>
      Over 80% of web browsing and storefront traffic happens on mobile devices. Byroo spaces are designed from the ground up to be ultra-fast and look beautiful on mobile phones.
    </EmailBody>
    <EmailBody>
      Take a second today to load your custom storefront URL on your phone to review your layout and test your order links.
    </EmailBody>
    <EmailCTA
      title="Check Your Mobile Storefront"
      description="View how your catalog, reviews, and links look to mobile buyers."
      buttonText="Check Storefront"
      href={loginUrl}
    />
  </BrandedLayout>
);

// Day 6: Sharing blueprint
export const OnboardingDay6: React.FC<{ name: string; unsubscribeToken?: string }> = ({
  name = "Creator",
  unsubscribeToken,
}) => (
  <BrandedLayout previewText="Day 6: A 5-minute blueprint to share your business" unsubscribeToken={unsubscribeToken}>
    <EmailH1>Your 5-minute sharing blueprint 🚀</EmailH1>
    <EmailBody>
      Hi {name},
    </EmailBody>
    <EmailBody>
      Now that your storefront catalog is set up, let's share it! Here is a simple blueprint you can execute in less than 5 minutes to get your first 100 views:
    </EmailBody>
    <EmailCard className="bg-gray-50 border-gray-200 text-sm">
      <EmailBody className="m-0 mb-2"><strong>1. WhatsApp Status:</strong> Post your Byroo link with a screenshot of your catalog.</EmailBody>
      <EmailBody className="m-0 mb-2"><strong>2. Email Signature:</strong> Add your Byroo URL to the footer of your personal emails.</EmailBody>
      <EmailBody className="m-0"><strong>3. Instagram Stories:</strong> Use the link sticker to share your storefront URL.</EmailBody>
    </EmailCard>
    <EmailCTA
      title="View Sharing Tools"
      description="Review your storefront status and analytics tools inside your admin board."
      buttonText="Go to Dashboard"
      href={loginUrl}
    />
  </BrandedLayout>
);

// Day 7: Performance metrics check
export const OnboardingDay7: React.FC<{ name: string; unsubscribeToken?: string }> = ({
  name = "Creator",
  unsubscribeToken,
}) => (
  <BrandedLayout previewText="Day 7: Look at your week 1 traffic statistics" unsubscribeToken={unsubscribeToken}>
    <EmailH1>Let's check your week 1 stats! 📊</EmailH1>
    <EmailBody>
      Hi {name},
    </EmailBody>
    <EmailBody>
      Congratulations! You've been with the Byroo community for a full week.
    </EmailBody>
    <EmailBody>
      Have you checked your dashboard traffic analytics yet? We track page impressions, WhatsApp button clicks, and review interactions so you can see exactly which sharing channels perform best for your business.
    </EmailBody>
    <EmailCTA
      title="View Traffic Analytics"
      description="Monitor buyer clicks and storefront interactions in real-time."
      buttonText="Check Analytics"
      href={loginUrl}
    />
  </BrandedLayout>
);

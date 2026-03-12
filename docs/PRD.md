# Byroo PRD

## Product Positioning
Byroo is a WhatsApp-first storefront and digital business page for Nigerian small businesses and vendors.

Byroo is not a WhatsApp replacement.
- Byroo = storefront/public page
- WhatsApp = chat/order channel

## Target Users
- WhatsApp vendors
- Online small businesses
- Service businesses (makeup artists, nail techs, photographers, barbers, tutors, freelancers)

## Core Value Proposition
Give your business one smart page where customers can browse products/services and message you on WhatsApp with prefilled order inquiries.

## Product Goals
- Help vendors present catalog + pricing + trust in one link.
- Increase quality inbound WhatsApp conversations.
- Provide simple free plan with monetizable pro upgrades.

## Feature Scope

### Must-have
- Auth + dashboard
- Public page by username
- Links, portfolio, services
- WhatsApp global settings
- Product catalog with WhatsApp CTA
- Business info blocks (maps, hours, delivery)
- Reviews/testimonials
- Social Proof Block (Instagram/TikTok cached profile cards)
- Plan gating across all core blocks

### Plan Model
Free:
- 5 links
- 3 portfolio items
- 5 catalog items
- 6 services
- 2 featured reviews
- 1 social proof card
- 1 theme
- Byroo branding visible
- no analytics

Pro:
- unlimited key content limits
- premium themes
- hide branding
- analytics access
- up to 2 social proof cards

## Key Flows
1. User signs up and configures profile + WhatsApp number.
2. User adds catalog items/services/reviews.
3. Customer lands on `byroo.space/username`.
4. Customer taps item/service CTA -> WhatsApp opens with prefilled message.

## Social Proof Flow
1. User adds Instagram and/or TikTok username in `/dashboard/socials`.
2. Backend validates username and triggers sync via provider abstraction.
3. Normalized profile data is cached in DB.
4. Public page renders trust cards from cached data.
5. Scheduled backend refresh keeps profile stats reasonably up to date.

## Public Page Section Order
1. Business header
2. Quick action buttons
3. Catalog
4. Services / price list
5. Portfolio
6. Reviews
7. Business info
8. Footer branding

## Success Metrics
- Profile publish rate
- WhatsApp CTA click-through rate
- Catalog item interaction rate
- Free to Pro conversion rate

## Non-goals
- Full cart/checkout
- In-app messaging
- Marketplace/discovery
- Team accounts

## Internal Operations (MVP)
- Protected admin console for platform monitoring and support operations.
- Monitor user growth, subscriptions, storage, and traffic at platform level.
- Manual interventions:
  - set user plan
  - grant/revoke admin access
  - trigger billing sync repair
- Audit log for all high-impact admin actions.

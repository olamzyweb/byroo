# Byroo PRD

## Product Summary
Byroo is a link-in-bio + digital business card SaaS that gives each user a public page at `/username` to present identity, links, services, and portfolio.

Core promise: one smart link for work, services, and contact.

## Target Users
- Freelancers
- Creators
- Small businesses
- Service professionals

## MVP Goals
- User signup/login/reset
- Guided onboarding
- Public profile page at `/[username]`
- CRUD for links, portfolio, services
- Avatar upload
- Theme selection (1 free, 2 pro)
- Free vs Pro feature gating
- Billing upgrade entrypoint
- Lightweight first-party analytics

## Free Plan
- Up to 5 links
- Up to 3 portfolio items
- 1 free theme
- Byroo branding visible
- No analytics dashboard

## Pro Plan
- Unlimited links
- Unlimited portfolio items
- All themes
- Hide branding
- Analytics dashboard

## Key User Flows
1. Visit landing page and signup.
2. Complete onboarding: username, profile, first link, first portfolio item.
3. Share public page.
4. Upgrade to Pro from billing page when limits are reached.

## Success Metrics (MVP)
- New signup completion rate
- % users publishing a public page
- Link click events per active profile
- Free-to-pro conversion rate

## Non-goals
- Teams/workspaces
- Marketplace/discovery
- Custom domains
- Native mobile apps

## Acceptance Criteria
- Public page loads from username and respects theme/plan restrictions.
- Limits are enforced server-side for free users.
- Link clicks and page views are tracked.
- Billing integration surface exists with provider abstraction.
- Setup/deploy docs are sufficient for local and production use.

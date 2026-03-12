# Byroo UI Guide

## Philosophy
Byroo UI is designed to feel credible and premium for independent professionals who need a public business page they can share confidently.

Core principles:
- Clean over decorative
- Clear hierarchy over dense layouts
- Mobile-first interactions
- Consistent tokens and spacing

## Page Layouts Implemented

### Marketing
- `/`: Hero, value props, product preview, steps, pricing preview, final CTA.
- `/pricing`: Two-tier card pricing with strong upgrade path.

### Auth
- `/login`, `/signup`, `/reset-password`: centered minimal cards, clear CTA, low distraction.

### Dashboard Shell
- Sidebar + content panel layout.
- Profile block and plan badge in sidebar.
- Reusable section headers and cards.

### Dashboard Screens
- `/dashboard`: overview stats + quick actions.
- `/dashboard/profile`: form + avatar + live preview panel.
- `/dashboard/links`: add form + sortable-like card list + visibility actions.
- `/dashboard/portfolio`: create + card gallery.
- `/dashboard/services`: create + service cards.
- `/dashboard/appearance`: theme + branding controls.
- `/dashboard/analytics`: stat cards + simple bar visualization.
- `/dashboard/billing`: subscription state + upgrade/portal actions.

### Public Profile
- `/[username]`: polished mobile-first public page with profile header, CTA links, portfolio, services, and branding footer.
- Theme-aware rendering from saved theme tokens.

## Token Summary
- Background: `--bg`
- Surface: `--surface`
- Border: `--border-subtle`
- Text: `--text-strong`, `--text-soft`
- Primary: `--brand-*`
- Radius: `--radius-*`
- Shadow: `--shadow-soft`

## Responsive Behavior
- Mobile-first single-column sections.
- Dashboard transforms to two-column shell on desktop.
- Public profile keeps tap-friendly controls and readable spacing.

## UX Polish Included
- Empty states for links/portfolio/services.
- Loading skeleton on dashboard.
- Inline success/error helper messages.
- Subtle hover and entrance motion.

## V2 UI Recommendations
- Add true drag-and-drop link ordering.
- Introduce chart mini-components for analytics trends.
- Add richer theme preview cards in appearance page.
- Improve media rendering using `next/image` and image transforms.
- Add command palette and keyboard shortcuts in dashboard.

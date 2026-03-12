# Byroo Design System

## Design Direction
- Tone: modern, trustworthy, premium-neutral SaaS.
- Audience: creators, freelancers, and small businesses.
- Principle: high readability, strong hierarchy, low visual noise.

## Tokens
Defined in `src/app/globals.css` using CSS variables.

### Colors
- `--bg`: app canvas background
- `--surface`: card/background surface
- `--surface-muted`: soft section background
- `--text-strong`: primary text
- `--text-soft`: secondary text
- `--border-subtle`: neutral border
- `--brand-50/200/400/500/600`: primary blue scale
- `--danger`: error/destructive

### Radius
- `--radius-sm` (10px)
- `--radius-md` (14px)
- `--radius-lg` (18px)

### Shadow
- `--shadow-soft`: soft elevated card shadow

## Typography
- Base font stack: `Segoe UI`, `Avenir Next`, `Helvetica Neue`, sans-serif.
- Heading style: tighter letter spacing (`-0.02em`) and semibold weight.

Text scale guidance:
- H1: `text-4xl`/`text-5xl`
- H2: `text-2xl`/`text-3xl`
- Section title: `text-xl`/`text-2xl`
- Body: `text-sm`/`text-base`
- Micro labels: `text-xs uppercase tracking-[0.14em+]`

## Spacing System
Tailwind spacing scale used consistently:
- Tight: `gap-2`, `p-2`, `p-3`
- Standard: `gap-3`, `gap-4`, `p-4`, `p-5`
- Section: `py-8`, `py-10`, `py-12`

## Components
Core primitives:
- Button (primary, secondary, ghost, danger)
- Input
- TextArea
- Card
- Badge
- Avatar
- Divider
- SectionHeader
- StatCard
- EmptyState
- HelperText

Interactive helpers:
- ToggleSwitch
- Tabs
- Dropdown
- Modal

## UI Patterns
- Cards as primary information containers.
- Rounded corners across controls and surfaces.
- Subtle gradients on page backgrounds; avoid heavy effects.
- State feedback:
  - Success: green soft background
  - Error: rose soft background
  - Neutral hints: muted surface

## Motion
- Subtle entry animation on public profile header (`fadeIn`, 450ms).
- Hover transitions on buttons and link cards.

## Accessibility Baseline
- Sufficient contrast between text and surfaces.
- Large tap targets for mobile controls (`h-10+`).
- Explicit labels for form fields.

# Byroo Components

All shared components are in `src/components`.

## Base Components (`src/components/ui.tsx`)
- `Button`
- `ButtonLink`
- `Input`
- `TextArea`
- `Card`
- `SectionHeader`
- `Badge`
- `Divider`
- `Avatar`
- `StatCard`
- `EmptyState`
- `HelperText`

## Interactive Components (`src/components/ui/*`)
- `ToggleSwitch` (`ui/toggle-switch.tsx`)
- `Tabs` (`ui/tabs.tsx`)
- `Dropdown` (`ui/dropdown.tsx`)
- `Modal` (`ui/modal.tsx`)

## Navigation Components
- `DashboardNav` (`src/components/dashboard/nav.tsx`)

## Public Components
- `ProfileViewTracker` (`src/components/public/profile-view-tracker.tsx`)

## Usage Guidelines
- Use `SectionHeader` for every dashboard/public section heading.
- Use `Card` for groupings and content blocks.
- Use `HelperText` for success/error/neutral notices.
- Use `EmptyState` when list data is empty.
- Prefer `ButtonLink` for navigation CTAs and `Button` for form actions.

## Visual Rules
- Default spacing inside cards: `p-5`.
- Form fields use rounded-xl borders and ring focus states.
- Buttons keep consistent heights by size variant.
- Badges communicate plan/status quickly.

## Extension Notes
- Add new component variants by extending tokenized classes only.
- Keep logic-light primitives in `ui.tsx`; place hook-heavy components in `ui/*.tsx`.

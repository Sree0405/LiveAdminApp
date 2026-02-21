# LifeAdmin Pro — Style Guide

## Design tokens (`tokens.ts`)

- **Grid:** 8pt base unit. Spacing: `xxs` (4) → `xxxl` (64).
- **Border radius:** `xs` 6, `sm` 10, `md` 16, `lg` 20, `xl` 24, `full` 9999.
- **Typography:** `largeTitle` (34) down to `caption2` (11). Use `title1`–`title3` for headings, `body`/`callout` for content, `footnote`/`caption1` for secondary.
- **Elevation:** `none`, `sm`, `md`, `lg`, `xl` — shadow + elevation for Android.
- **Animation:** `durationFast` 150ms, `durationNormal` 250ms, `durationSlow` 400ms.

## Theme (`theme.ts`)

- **Light:** Neutral grays, accent `#6366F1`, surfaces `#F4F4F5` / `#FFFFFF`.
- **Dark:** Background `#09090B`, surface `#18181B`, same accent.
- **Semantic:** `error`, `success`, `warning`, `urgencyHigh` / `urgencyMedium` / `urgencyLow`.
- **Surfaces:** `surface`, `surfaceSecondary`, `surfaceGlass`, `surfaceOverlay`.

## Components

- **GlassCard:** `variant`: `elevated` | `glass` | `outlined` | `gradient`. Optional `accentLeft`, `delay` for entrance.
- **PrimaryButton:** `variant`: `primary` | `secondary` | `outline` | `ghost` | `destructive`. `size`: `sm` | `md` | `lg`.
- **PremiumInput:** Floating label, `error` / `success`, optional `leftIcon` / `rightIcon`.
- **SectionHeader:** `title`, optional `subtitle`, optional `action` { label, onPress }.
- **DatePickerModal:** `visible`, `value`, `onConfirm`, `onDismiss`, `minimumDate` / `maximumDate`.
- **SmartDropdown:** `visible`, `options` { value, label, icon? }, `selectedValue`, `onSelect`, `onDismiss`.
- **EmptyState:** `title`, `message`, optional `icon`, optional `action` { label, onPress }.

## Usage

- Prefer `useApp().theme` for colors and tokens.
- Use `theme.borderRadius.sm` (not `theme.sm`) for radius; `theme.elevation.md` for shadows.
- Spacing: `theme.sm`, `theme.md`, `theme.lg` etc. from 8pt grid.

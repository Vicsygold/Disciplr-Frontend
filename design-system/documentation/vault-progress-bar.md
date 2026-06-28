# VaultProgressBar

`VaultProgressBar` is the shared vault progress primitive for card and detail
surfaces.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | Required | Progress percentage. Values are clamped to `0`-`100`. |
| `label` | `string` | `Vault progress` | Accessible progressbar label and optional visible label. |
| `showValue` | `boolean` | `true` | Shows or hides the visible label and percentage text. |
| `className` | `string` | `undefined` | Optional class hook for layout composition. |

## Behavior

- Invalid, negative, and overflow values are normalized by
  `clampProgressValue`.
- The progress track uses `role="progressbar"` with `aria-valuemin`,
  `aria-valuemax`, `aria-valuenow`, `aria-valuetext`, and `aria-label`.
- Completion at `100` uses `--success`; in-progress values use `--accent`.
- The component uses design tokens for sizing, radius, text, track, and fill
  colors. No hardcoded hex colors are used.

## Usage

```tsx
<VaultProgressBar value={progressPct} label="Vault progress" />
```

For compact timeline layouts, keep the ARIA label while hiding visible helper
text:

```tsx
<VaultProgressBar value={timelineProgress} label="Timeline progress" showValue={false} />
```

## Tests

Coverage lives in `src/components/__tests__/VaultProgressBar.test.tsx` and
checks clamping, ARIA attributes, label rendering, hidden-value mode, and edge
values.

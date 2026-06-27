# Notification Settings Theming

NotificationSettings uses semantic app tokens instead of fixed light-mode Tailwind colors:

- Panels use `--surface`, `--text`, and `--border`.
- Form controls use `--surface-raised`, `--text`, `--border`, and `--accent` focus outlines.
- Toggle tracks use neutral surface tokens when off and `--accent` when checked.
- Toggle thumbs use `--bg`, `--surface`, and `--border` so they remain visible in light and dark themes.
- Peer focus rings keep the existing Tailwind focus affordance and theme the ring with `--accent-transparent`.

These tokens are backed by `design-system/tokens/colors.json` neutral and secondary/accent values and mirrored in `src/index.css` for runtime theme switching.

## State Management and Persistence

Notification preferences are stored globally and persisted across page reloads using the `useNotificationPreferences` Zustand store (defined in `src/Zustand/notificationPreferences.ts` and exported from `src/Zustand/Store.ts`).

### Fields
- `email`: boolean (default: `true`)
- `push`: boolean (default: `false`)
- `frequency`: string (default: `""`)
- `quietHours`: string (default: `"12:00"`)

### Actions
- `setEmail(value: boolean)`: Update email preference.
- `setPush(value: boolean)`: Update push notification preference.
- `setFrequency(value: string)`: Update notification frequency.
- `setQuietHours(value: string)`: Update quiet hours timing.
- `reset()`: Reset preferences back to their default values.

### Persistence Details
Preferences are stored in `localStorage` under the key `"notification-preferences"`. Any component in the app can read from or write to this store to coordinate user notification preferences across surfaces (e.g., the notification settings page, header notification bell, etc.).


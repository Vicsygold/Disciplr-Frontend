# Mobile Drawer Accessibility

The mobile navigation drawer is treated as a modal navigation surface.

- The drawer uses `focus-trap-react` while open so keyboard focus stays inside the drawer.
- `Escape`, the close button, backdrop clicks, and drawer navigation links close the drawer.
- When the drawer closes, focus returns to the menu trigger that opened it.
- The drawer exposes `role="dialog"`, `aria-modal="true"`, and `aria-labelledby="mobile-drawer-title"` for assistive technology.
- Layout background regions are marked `inert` and `aria-hidden` while the drawer is open.
- Drawer controls and navigation links keep at least the shared `--touch-target` size of 44 px.

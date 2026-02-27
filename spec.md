# Specification

## Summary
**Goal:** Optimize the INC.ai frontend for mobile devices by improving layout, sidebar behavior, touch targets, and input visibility on small screens.

**Planned changes:**
- Collapse the sidebar by default on mobile (below `md` breakpoint); add a hamburger/toggle button to open it as an overlay/drawer
- On desktop (`md`+), preserve existing sidebar behavior
- Increase all interactive elements (buttons, session items, send button, icons) to a minimum 44×44px tap target on mobile
- Anchor the message input bar to the bottom of the visible viewport so it stays accessible when the mobile keyboard is open
- Apply mobile-first responsive layout: single-column stacking of header, chat area, and sidebar overlay on small screens
- Ensure no horizontal scroll, appropriate font sizes and padding at 375px width
- Make LoginScreen and ProfileSetupModal readable on mobile

**User-visible outcome:** Users on mobile devices can comfortably use INC.ai — the sidebar opens as a drawer, touch targets are easy to tap, the chat input stays visible above the keyboard, and the overall layout fits small screens without horizontal scrolling.

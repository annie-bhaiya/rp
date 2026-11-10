# Design System & Visual Authority — ResolvePay Rescue

<!-- impeccable:design-schema 1 -->

## Visual Thesis
**The Ledger of Trust**: ResolvePay communicates the absolute mathematical certainty of an audited financial ledger combined with the calm empathy of a customer advocate. It avoids playful tech gimmicks, decorative floating blur halos, and gradient text in favor of razor-sharp hierarchy, tabular numerals for money, distinct state-based status indicators, and clear policy citation cards.

## Palette & Color Tokens

### Light Theme (Default Consumer & Merchant Workspace)
- **Canvas / Ground**: `#F8FAFC` (Slate 50)
- **Surface / Card**: `#FFFFFF` (Pure White)
- **Surface Elevated / Hover**: `#F1F5F9` (Slate 100)
- **Border Subtle**: `#E2E8F0` (Slate 200)
- **Border Strong**: `#CBD5E1` (Slate 300)
- **Border Focus**: `#2563EB` (Blue 600, 2px ring with 2px offset)

### Contrast & Text
- **Foreground Primary**: `#0F172A` (Slate 900 — 14.8:1 contrast on white)
- **Foreground Secondary**: `#475569` (Slate 600 — 5.8:1 contrast on white)
- **Foreground Muted**: `#64748B` (Slate 500 — 4.6:1 contrast on white)

### Semantic Accents (Tested for WCAG 2.2 AA Contrast)
- **Primary / Brand Action**: `#1E40AF` (Blue 800) / Hover `#1D4ED8` (Blue 700)
- **Success / Settled / Inspection Passed**: `#065F46` (Emerald 800) / Badge Ground `#ECFDF5`
- **Warning / Action Required / Awaiting Approval**: `#92400E` (Amber 800) / Badge Ground `#FFFBEB`
- **Error / Rejected / Unknown Reconciling**: `#991B1B` (Red 800) / Badge Ground `#FEF2F2`
- **Info / In Flight / AI Advisory**: `#075985` (Sky 800) / Badge Ground `#F0F9FF`
- **Neutral Status / Planned / Reserved**: `#374151` (Gray 700) / Badge Ground `#F3F4F6`

## Typography

### Font Families
- **Interface & Prose**: `Inter`, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif
- **Data, Money, Hashes, & Identifiers**: `ui-monospace`, `SFMono-Regular`, `Menlo`, `Monaco`, `Consolas`, monospace with `font-feature-settings: "tnum"` (tabular figures enabled)

### Hierarchy & Scale
- **Display / Hero**: `1.875rem` (`30px`), line-height `1.2`, weight `700`, letter-spacing `-0.025em`
- **Page Heading (H1)**: `1.5rem` (`24px`), line-height `1.3`, weight `600`, letter-spacing `-0.02em`
- **Section Heading (H2)**: `1.25rem` (`20px`), line-height `1.4`, weight `600`, letter-spacing `-0.015em`
- **Card Title (H3)**: `1rem` (`16px`), line-height `1.5`, weight `600`
- **Body Regular**: `0.875rem` (`14px`), line-height `1.5`, weight `400`, max-width `72ch`
- **Caption / Meta**: `0.75rem` (`12px`), line-height `1.4`, weight `500`, letter-spacing `0.01em`

## Elevation & Depth
- **Level 0 (Flat)**: `box-shadow: none`
- **Level 1 (Card/Container)**: `box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)`
- **Level 2 (Popovers/Dropdowns)**: `box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)`
- **Level 3 (Modal Dialogs)**: `box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.05)`
- *Strict Rule*: No zero-blur block shadows; no colored glow halos.

## Components & Form Language

### Action Buttons
- **Primary**: Solid `#1E40AF`, white text, 6px radius (`rounded-md`), subtle active scale (0.99), clear visible focus ring `#2563EB`.
- **Secondary**: Surface white with 1px border `#CBD5E1`, text `#0F172A`, hover ground `#F8FAFC`.
- **Destructive**: Solid `#DC2626`, white text, hover `#B91C1C`.
- **Ghost**: Transparent ground, text `#475569`, hover ground `#F1F5F9`.

### Badges & Status Indicators
- Always combine distinct icon + background tint + dark foreground text. Never rely on color alone.
- Examples:
  - `[✓] Settled` (Emerald badge)
  - `[⏳] Pending Provider` (Sky badge)
  - `[⚠] Inspection Required` (Amber badge)
  - `[✕] Rejected` (Red badge)

### Financial Tables & Journal Displays
- All numbers right-aligned with monospace tabular figures (`font-mono font-medium`).
- Currency symbol attached without spacing: `$120.00`.
- Debits and credits displayed in distinct balanced columns.

### Policy Citations
- Embedded citation cards showing Policy Clause ID, exact legal excerpt, and applicability score.
- Clear link to view full immutable policy version.

# Design System — Eco Quest

Design guidelines for the Eco Quest UI. Read this before writing any styles.

## Direction

**Fresh & playful.** Eco Quest is a gamified ecology app — challenges, points,
badges. The look should feel light, energetic and encouraging: leafy greens,
generous rounding, soft shadows, warm reward accents. Never heavy, corporate, or
harsh.

- **Light theme only** for now. Tokens are split into primitive + semantic layers
  so a dark theme can be added later by remapping only the semantic layer under
  `[data-theme='dark']` — do not hardcode colors that would block this.

## Styling approach: CSS Modules + tokens

- **A component that owns a 1:1 style module lives in its own folder** named after
  it, with a barrel `index.ts`:

  ```
  Button/
    Button.tsx
    Button.module.css
    index.ts        # export * from './Button'  (default: export { default } …)
  ```

  Import from the folder, never the inner file: `import { Button } from '@/shared/ui'`.
  Components without a module (e.g. `Loader.tsx`) stay as flat files.
- **Shared stylesheets** used by several components (e.g. `features/auth/ui/auth.module.css`,
  shared by `AuthCard` + both auth forms) are *not* 1:1, so they stay as a named
  module file next to the components that share them — they don't get folded into a
  component folder.
- **No global class names.** The only global CSS lives in `src/app/styles/`
  (tokens, reset, base element defaults). Everything else is scoped via modules.
- **Never hardcode a raw value** (color, spacing, radius, shadow, font size) in a
  module. Always reference a token: `color: var(--text-body)` — not `#334155`.
- Reference **semantic** tokens (`--color-primary`, `--text-muted`,
  `--color-surface`), never primitives (`--green-600`, `--gray-100`) directly.
  Primitives are an implementation detail of the semantic layer.

### Layout of the style files

```
src/app/styles/
  tokens.css   # design tokens (primitive + semantic). Source of truth.
  reset.css    # structural reset, no colors
  index.css    # imports the above + thin base element layer. Loaded once in index.tsx
```

## Tokens reference

All tokens live in [tokens.css](src/app/styles/tokens.css). Highlights:

### Color (semantic)

| Token | Use |
| --- | --- |
| `--color-primary` / `-hover` / `-active` | brand green — primary buttons, active nav, key actions |
| `--color-primary-soft` | tinted green backgrounds, chips, selected states |
| `--color-accent` / `-strong` | amber — points, badges, rewards, "game" highlights |
| `--color-secondary` | sky blue — informational secondary accent |
| `--color-bg` | app canvas (faint green wash) |
| `--color-surface` | cards, panels, header |
| `--color-surface-muted` | nested / secondary panels |
| `--color-border` / `-strong` | dividers, input borders |
| `--text-heading` / `--text-body` / `--text-muted` | text hierarchy |
| `--color-success/warning/danger/info` (+ `-soft`) | status states |

### Type scale

`--text-xs` (12) → `--text-5xl` (48). Weights `--font-normal|medium|semibold|bold`.
Body font `--font-sans` (Inter → system-ui fallback). Optional `--font-display`
(Baloo 2) for hero / gamified headings.

> Inter and Baloo 2 are **not yet loaded**. Until they are, the system-ui fallback
> renders. Add them via `<link>` in [index.html](index.html) or self-host when we
> commit to them — the tokens already point at them.

### Spacing, radius, shadow

- Spacing: 4px base — `--space-1` (4) … `--space-20` (80). Use for padding, gap, margin.
- Radius: `--radius-sm` 6 · `--radius-md` 10 · `--radius-lg` 16 · `--radius-xl` 24 ·
  `--radius-full`. Default cards → `--radius-lg`; buttons/inputs → `--radius-md`;
  pills/avatars → `--radius-full`.
- Shadow: `--shadow-sm|md|lg` (soft) and `--shadow-focus` for focus rings.

### Layout / motion

`--container-max` (1120px), `--header-height`. Transitions `--transition-fast|base`
(auto-disabled under `prefers-reduced-motion`). Z-index `--z-header`, `--z-notifications`.

## Conventions

- **Class naming inside a module:** camelCase, semantic (`.card`, `.cardTitle`,
  `.isActive`) — not visual (`.greenBox`).
- **Composing classes:** use `clsx` (`import clsx from 'clsx'`). Prefer the object
  form for conditional classes — `clsx(styles.link, { [styles.active]: isActive })` —
  it stays readable as conditions grow.
- **Spacing between elements:** prefer `gap` on a flex/grid parent over margins on
  children.
- **Interactive states are required:** every button/link/input needs `:hover`,
  `:focus-visible`, and `:disabled` styling. Focus uses `--shadow-focus` or the
  reset's outline — never remove focus outlines without a replacement.
- **Accessibility:** maintain readable contrast (body text on surfaces ≥ 4.5:1),
  keep hit targets ≥ 40px, and honor `prefers-reduced-motion` (tokens already do).
- **Responsive:** mobile-first. Container caps at `--container-max` and centers.

## Component styling checklist

When styling a component:

1. Create `Component.module.css` next to it.
2. Use only semantic tokens — no raw hex, px for color/space/radius.
3. Cover hover / focus-visible / disabled / active where interactive.
4. Verify it reads correctly on `--color-bg` and on `--color-surface`.
5. Check it at narrow width (≈360px) and at `--container-max`.

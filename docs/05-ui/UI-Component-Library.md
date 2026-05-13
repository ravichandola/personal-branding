# UI Component Library
Relevant source files

- [package-lock.json](https://github.com/ravichandola/personal-branding/blob/3a440ccd/package-lock.json)
- [src/components/icons/github-mark.tsx](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/icons/github-mark.tsx)
- [src/components/layout/site-footer.tsx](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/layout/site-footer.tsx)
- [src/components/layout/site-navbar.tsx](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/layout/site-navbar.tsx)
- [src/components/marketing/page-intro.tsx](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/marketing/page-intro.tsx)
- [src/components/seo/json-ld.tsx](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/seo/json-ld.tsx)
- [src/components/ui/badge.tsx](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/badge.tsx)
- [src/components/ui/button.tsx](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/button.tsx)
- [src/components/ui/card.tsx](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/card.tsx)
- [src/components/ui/input.tsx](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/input.tsx)
- [src/components/ui/label.tsx](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/label.tsx)
- [src/components/ui/separator.tsx](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/separator.tsx)
- [src/components/ui/skeleton.tsx](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/skeleton.tsx)
- [src/components/ui/textarea.tsx](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/textarea.tsx)
- [src/components/ui/tooltip.tsx](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/tooltip.tsx)

The UI system for the personal-branding platform is built on a foundation of Radix UI primitives for accessibility, Tailwind CSS for utility-first styling, and Framer Motion for interactive transitions. The library is structured into atomic UI primitives, marketing-specific patterns, and global layout components.

## Architecture Overview

The component library is categorized into four distinct layers:

1. UI Primitives: Located in `src/components/ui/`, these are low-level, reusable components (Buttons, Inputs, Badges) often wrapping Radix UI primitives [package-lock.json#16-28](https://github.com/ravichandola/personal-branding/blob/3a440ccd/package-lock.json#L16-L28)
2. Marketing Components: High-level visual patterns like `PageIntro`[src/components/marketing/page-intro.tsx#12-34](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/marketing/page-intro.tsx#L12-L34) used to maintain consistent branding across public routes.
3. Layout Components: Structural elements including `SiteNavbar`[src/components/layout/site-navbar.tsx#38-171](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/layout/site-navbar.tsx#L38-L171)`SiteFooter`[src/components/layout/site-footer.tsx#18-176](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/layout/site-footer.tsx#L18-L176) and `ThemeToggle`.
4. SEO & Utilities: Technical components like `JsonLd`[src/components/seo/json-ld.tsx#5-13](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/seo/json-ld.tsx#L5-L13) for structured data and the `cn` utility for class merging.

### Component Relationship Map

This diagram illustrates how code entities from different namespaces interact to form the UI.

"Component Interaction Map"

Sources: [src/components/layout/site-navbar.tsx#10-15](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/layout/site-navbar.tsx#L10-L15)[src/components/marketing/page-intro.tsx#3-12](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/marketing/page-intro.tsx#L3-L12)[src/components/ui/badge.tsx#1-4](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/badge.tsx#L1-L4)[src/components/ui/button.tsx#1-5](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/button.tsx#L1-L5)

## UI Primitives (`src/components/ui/`)

The primitives use the `cn` utility (combining `clsx` and `tailwind-merge`) and `class-variance-authority` (CVA) to manage conditional styles and variants [src/components/ui/button.tsx#7-41](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/button.tsx#L7-L41)

| Component | Base Technology | Purpose |
| --- | --- | --- |
| `Button` | `radix-ui/react-slot` | Primary/Secondary/Ghost actions with consistent focus states [src/components/ui/button.tsx#12-28](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/button.tsx#L12-L28) |
| `Badge` | `CVA` | Status indicators and tech-stack tags with color "tones" (violet, orange, etc.) [src/components/ui/badge.tsx#6-27](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/badge.tsx#L6-L27) |
| `Card` | Standard HTML | Content containers with optional `glow` and `glass` effects [src/components/ui/card.tsx#9-21](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/card.tsx#L9-L21) |
| `Separator` | `radix-ui/react-separator` | Visual dividers with gradient masks [src/components/ui/separator.tsx#7-22](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/separator.tsx#L7-L22) |
| `Input` / `Textarea` | Standard HTML | Glass-morphism styled form fields [src/components/ui/input.tsx#7-21](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/input.tsx#L7-L21) |

Sources: [src/components/ui/button.tsx#49-60](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/button.tsx#L49-L60)[src/components/ui/badge.tsx#32-36](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/badge.tsx#L32-L36)[src/components/ui/card.tsx#10-21](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/card.tsx#L10-L21)[src/components/ui/separator.tsx#11-22](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/separator.tsx#L11-L22)[src/components/ui/input.tsx#13-16](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/input.tsx#L13-L16)

## Layout and Marketing

The layout system ensures a responsive, high-performance shell for the application.

- `SiteNavbar`: Features a sticky header with backdrop-blur [src/components/layout/site-navbar.tsx#47](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/layout/site-navbar.tsx#L47-L47) mobile overlay managed by `AnimatePresence`[src/components/layout/site-navbar.tsx#135-168](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/layout/site-navbar.tsx#L135-L168) and active-state detection via `usePathname`[src/components/layout/site-navbar.tsx#34-36](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/layout/site-navbar.tsx#L34-L36)
- `PageIntro`: Standardizes the "Eyebrow > Title > Description" pattern used at the top of all main sections [src/components/marketing/page-intro.tsx#19-32](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/marketing/page-intro.tsx#L19-L32)
- `SiteFooter`: Provides quick navigation links and social icons, using a multi-column grid that shifts from 12-column on desktop to stacked on mobile [src/components/layout/site-footer.tsx#50-153](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/layout/site-footer.tsx#L50-L153)

For a deep dive into navigation logic and mobile transitions, see [Layout and Navigation Components](#5.2).

## Styling and Composition

The styling system is driven by Tailwind CSS and a custom configuration that defines the brand's palette (Zinc and Orange) and typography (Space Grotesk).

### Composition Pattern

Components use a standard pattern for prop merging:

1. Define variants with `cva()`.
2. Export `VariantProps` for TypeScript support.
3. Merge incoming `className` props using `cn()`.

"Styling Pipeline"

Sources: [src/components/ui/button.tsx#7-41](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/button.tsx#L7-L41)[src/components/ui/badge.tsx#6-27](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/ui/badge.tsx#L6-L27)[src/lib/utils.ts#1-10](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/lib/utils.ts#L1-L10) (referenced via import in ui components).

For details on CSS variables and font setup, see [Styling System](#5.1).

## SEO and Icons

- `JsonLd`: A utility for injecting structured data (Schema.org) into the `<head>` using `dangerouslySetInnerHTML` for Person and Article schemas [src/components/seo/json-ld.tsx#5-13](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/seo/json-ld.tsx#L5-L13)
- Custom Icons: Specialized SVG components like `GithubMark`[src/components/icons/github-mark.tsx#1-12](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/icons/github-mark.tsx#L1-L12) are used alongside the `lucide-react` library for consistent iconography.

Sources: [src/components/seo/json-ld.tsx#1-13](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/seo/json-ld.tsx#L1-L13)[src/components/icons/github-mark.tsx#1-12](https://github.com/ravichandola/personal-branding/blob/3a440ccd/src/components/icons/github-mark.tsx#L1-L12)[package-lock.json#43](https://github.com/ravichandola/personal-branding/blob/3a440ccd/package-lock.json#L43-L43)
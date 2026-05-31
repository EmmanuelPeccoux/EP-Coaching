# UI/UX Pro Max - Design Intelligence

This is a comprehensive design system reference that provides guidance across 10 priority categories for creating professional, accessible user interfaces.

## Core Purpose

The system helps you design better UIs by offering "50+ styles, 161 color palettes, 57 font pairings" and structured rules covering accessibility, interaction, performance, layout, and more.

## When to Use This Skill

Apply it when tasks involve:
- Creating or refactoring UI components
- Choosing design systems (colors, typography, spacing)
- Reviewing code for user experience quality
- Implementing navigation, animations, or responsive behavior
- Making product-level design decisions

Skip it for pure backend logic, API design, or infrastructure work.

## The 10 Priority Categories

1. **Accessibility (CRITICAL)** - Contrast ratios, focus states, keyboard navigation
2. **Touch & Interaction (CRITICAL)** - 44×44px minimum targets, feedback, gestures
3. **Performance (HIGH)** - Image optimization, lazy loading, layout stability
4. **Style Selection (HIGH)** - Matching style to product type, consistency
5. **Layout & Responsive (HIGH)** - Mobile-first design, viewport setup, spacing
6. **Typography & Color (MEDIUM)** - Line height, readability, semantic tokens
7. **Animation (MEDIUM)** - Duration (150–300ms), meaningful transitions, reduced-motion
8. **Forms & Feedback (MEDIUM)** - Clear labels, error placement, validation timing
9. **Navigation Patterns (HIGH)** - Predictable back behavior, deep linking, 5-item limit
10. **Charts & Data (LOW)** - Accessible color schemes, legends, tooltips

## Key Workflow

Start with `--design-system` to generate comprehensive recommendations, then use `--domain` searches for deeper dives into specific areas (style, color, typography, ux, etc.).

## Critical Professional Standards

- Use SVG icons, never emojis, for UI controls
- Maintain consistent stroke widths and icon sizing
- Respect safe areas on mobile devices
- Implement 4/8dp spacing rhythm
- Test both light and dark modes independently
- Verify touch targets meet platform minimums
- Support reduced-motion and dynamic text scaling

## Design System for EP Coaching Site

**Stack:** Vanilla HTML/CSS/JS, GitHub Pages

**Brand:**
- Primary red: #E60000
- Deep black: #050505
- Grays: #111 / #1a1a1a / #222 / #303030
- White: #f5f5f5
- Font headings: Bebas Neue
- Font body: Inter / Montserrat

**Design philosophy:** Ultra-dark premium bodybuilding aesthetic. Heavy animations, custom cursor, parallax. Conversion-first (tunnel Instagram → site → Typeform → Calendly → Stripe).

**Pages:**
- index.html — Landing (hero + about + physique + coaching teaser + CTA final)
- coaching.html — Offre, tarif, process, FAQ
- parcours.html — Timeline 2023-2027, vision
- contact.html — Formulaire / WhatsApp

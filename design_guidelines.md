# Cricket Tournament Manager - Design Guidelines

## Design Approach

**Selected Approach**: Design System - Material Design with Linear-inspired refinements
**Rationale**: Information-dense admin dashboard requiring clarity, efficiency, and reliability for live match operations. The clean, functional aesthetic supports rapid data entry during live scoring while maintaining visual hierarchy across complex tournament structures.

**Key Design Principles**:
1. **Clarity Over Decoration** - Every element serves a functional purpose
2. **Efficient Data Entry** - Minimize clicks and cognitive load during live matches  
3. **Hierarchy Through Contrast** - Use size, weight, and spacing to guide attention
4. **Responsive Tables** - Data must remain readable across all viewport sizes

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**:
- Background Base: `222 10% 10%`
- Surface Elevated: `222 10% 14%`
- Surface Interactive: `222 10% 18%`
- Border Subtle: `222 10% 25%`
- Text Primary: `0 0% 95%`
- Text Secondary: `0 0% 70%`

**Brand Colors**:
- Primary (Cricket Green): `142 76% 36%` - action buttons, active states, win indicators
- Accent (Match Red): `0 84% 60%` - wickets, critical alerts, loss indicators
- Info (Sky Blue): `199 89% 48%` - informational elements, tie indicators
- Warning (Amber): `38 92% 50%` - alerts, Super Over indicators

**Light Mode**:
- Background: `0 0% 98%`
- Surface: `0 0% 100%`
- Border: `220 13% 91%`
- Text Primary: `222 47% 11%`
- Text Secondary: `215 16% 47%`

### B. Typography

**Font Families**:
- Primary: Inter (via Google Fonts CDN) - UI, body text, tables
- Mono: JetBrains Mono - scores, statistics, live match data

**Type Scale**:
- Display (Dashboard Titles): `text-3xl md:text-4xl font-bold tracking-tight`
- Heading 1 (Section Headers): `text-2xl font-semibold`
- Heading 2 (Card Titles): `text-xl font-semibold`
- Body Large (Match Scores): `text-lg font-medium font-mono`
- Body (Default): `text-base font-normal`
- Caption (Metadata): `text-sm text-secondary`
- Label (Form Labels): `text-sm font-medium`

### C. Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16** consistently
- Component padding: `p-4` or `p-6`
- Section spacing: `mb-8` or `mb-12`
- Card gaps: `gap-4` or `gap-6`
- Dashboard margins: `space-y-6` or `space-y-8`

**Grid System**:
- Dashboard: Sidebar (256px fixed) + Main content (flex-1)
- Stats Cards: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`
- Match Grid: `grid grid-cols-1 lg:grid-cols-2 gap-6`
- Responsive breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px)

### D. Component Library

**Dashboard Structure**:
- Fixed sidebar navigation (w-64, dark elevated surface)
- Top bar with tournament selector, user profile (h-16, border-b)
- Main content area with max-w-7xl container, px-6 py-8

**Data Tables**:
- Elevated surface background with subtle border
- Header row with semibold text, border-b-2 border-primary/20
- Striped rows for readability (odd:bg-surface/50)
- Sticky header on scroll for long tables
- Compact padding: px-4 py-3

**Live Scoring Interface**:
- Large score display (text-4xl font-mono) prominently centered
- Button grid for runs: 3x2 grid (1,2,3 / 4,6,W) with min-h-16 touch targets
- Extras panel below with pill-shaped buttons
- Current over display (e.g., "2.4") and striker indicator
- Undo button (destructive variant) separated from scoring actions

**Cards**:
- Tournament/Match Cards: Elevated surface, rounded-lg, p-6, border subtle
- Stat Cards: Gradient backgrounds (subtle), icon + metric + label layout
- Team Cards: Avatar + team name + record, hover:scale-102 transition

**Forms**:
- Label above input pattern with gap-2
- Input fields: bg-surface, border-subtle, focus:border-primary, px-4 py-2.5
- Select dropdowns: Chevron icon, same styling as inputs
- Button groups for stage selection (League/Semi/Final): segmented control style
- Error states: border-destructive, text-destructive-foreground below field

**Navigation**:
- Sidebar menu items: px-4 py-2.5, rounded-md, hover:bg-primary/10, active:bg-primary/20
- Icons from Heroicons (CDN) - 20px size, inline with text
- Breadcrumb trail in top bar for deep navigation

**Modals/Dialogs**:
- Overlay: bg-black/50 backdrop-blur-sm
- Content: max-w-2xl, bg-surface, rounded-lg, p-6, shadow-2xl
- Footer actions: Cancel (ghost) + Confirm (primary), justify-end gap-3

**Buttons**:
- Primary: bg-primary, text-white, px-6 py-2.5, rounded-md, font-medium
- Secondary: bg-surface-interactive, text-primary, border-subtle
- Destructive: bg-destructive, text-destructive-foreground (for wickets, delete)
- Ghost: hover:bg-surface-interactive only
- Icon buttons: p-2, rounded-md (for compact actions)

**Status Indicators**:
- Win: green-500, checkmark icon
- Loss: red-500, X icon  
- Tie: blue-500, equals icon
- Super Over: amber-500 badge with "SO" text

### E. Animations

**Minimal, Purposeful Motion**:
- Button hover: `transition-colors duration-150`
- Card hover: `transition-transform duration-200 hover:scale-[1.02]`
- Sidebar expand: `transition-all duration-300 ease-in-out`
- Live score update: Brief pulse animation (scale-105 to scale-100, 300ms) on run scored
- NO scroll-triggered animations or complex page transitions

## Images

**Dashboard Header Image**: 
- Subtle cricket stadium background (blurred, low opacity ~15%) behind dashboard title
- Dimensions: Full width x 200px height
- Placement: Top of main content area, text overlaid with gradient mask for readability

**Empty States**:
- Illustrated cricket graphics (bat/ball/stumps) for empty tournament/match lists
- Use CSS-drawn SVG icons or simple image placeholders
- Centered with explanatory text below

**Team Avatars**:
- Circular placeholders (48px) with team initials or uploaded logos
- Default: Gradient background with white text initials

**Hero Image**: Not applicable - this is a dashboard application, not a marketing site

## Distinctive Cricket-Specific Patterns

- **Match Score Display**: Monospace font, large size, team flag/avatar alongside score (e.g., "India 165/4" with flag icon)
- **Over Tracker**: Visual ball-by-ball representation using dots (• for legal delivery, W for wicket, 4/6 for boundaries)
- **Run Rate Meter**: Linear progress bar showing current vs required run rate with color coding (green=achievable, amber=tough, red=very difficult)
- **Super Over Badge**: Prominent orange/amber pill badge on tied matches with "SUPER OVER" text
- **Venue Tags**: Small chips with location pin icon + venue name
- **Qualifier Indicators**: Crown icon for teams qualified to next stage, grayed out for eliminated teams
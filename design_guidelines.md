# Design Guidelines: AI Nutrition & Diet Planning Application

## Design Approach
**Hybrid Approach:** Combining Material Design principles with inspiration from modern health apps (MyFitnessPal, Noom, Cronometer). Focus on trustworthy, data-driven design with approachable aesthetics that encourage user engagement with their health journey.

---

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary: 142 71% 45% (health green - trust and vitality)
- Secondary: 217 91% 60% (informative blue)
- Background: 0 0% 98% (soft white)
- Surface: 0 0% 100% (pure white cards)
- Text Primary: 222 47% 11% (near black)
- Text Secondary: 215 16% 47% (muted gray)
- Success: 142 76% 36% (darker green for confirmations)
- Warning: 38 92% 50% (amber for alerts)
- Error: 0 84% 60% (red for errors)

**Dark Mode:**
- Primary: 142 71% 55% (brightened green)
- Secondary: 217 91% 70% (brightened blue)
- Background: 222 47% 11% (deep navy)
- Surface: 217 33% 17% (elevated dark)
- Text Primary: 210 40% 98% (near white)
- Text Secondary: 217 20% 70% (muted light gray)

### B. Typography
- **Primary Font:** Inter (Google Fonts) - clean, modern sans-serif for UI
- **Data/Numbers Font:** JetBrains Mono (Google Fonts) - monospace for nutritional data, macros
- **Headings:** Inter 700 (Bold) - sizes: text-4xl, text-3xl, text-2xl, text-xl
- **Body:** Inter 400 (Regular) - text-base (16px)
- **Data Labels:** JetBrains Mono 500 (Medium) - text-sm for nutrition facts
- **Captions:** Inter 400 - text-sm, text-xs

### C. Layout System
**Spacing Units:** Consistent use of Tailwind units: 2, 4, 6, 8, 12, 16, 20, 24
- Micro spacing (form inputs, buttons): p-2, p-4, gap-2
- Component spacing: p-6, p-8, gap-4, gap-6
- Section spacing: py-12, py-16, py-20 (responsive)
- Container max-widths: max-w-7xl (dashboard), max-w-2xl (forms), max-w-4xl (meal plans)

### D. Component Library

**Navigation:**
- Top navbar with logo, main navigation, user profile dropdown
- Fixed on scroll with subtle shadow (shadow-sm)
- Mobile: Hamburger menu with slide-in drawer

**Forms & Data Input:**
- Multi-step wizard for onboarding (progress indicator at top)
- Card-based sections with clear headings
- Input fields: h-12, rounded-lg, border-2, focus states with primary color
- Select dropdowns with search functionality for food items
- Slider inputs for weight/activity level with live value display
- Radio cards for dietary preferences (vegan, keto, etc.)

**Dashboard Components:**
- Summary cards: Grid layout (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- Stat cards: Icon + Number + Label + Trend indicator
- Progress rings for macro tracking (carbs, protein, fats)
- Weekly/Monthly toggle for calorie charts
- Meal plan calendar view with drag-drop capability

**Meal Plan Display:**
- Daily meal cards in vertical timeline format
- Each meal: Image placeholder + Title + Macros breakdown + Time
- Expandable recipe details with ingredient list and instructions
- Nutritional facts table (styled with JetBrains Mono)
- Shopping list with checkbox items, grouped by category

**Data Visualization:**
- Donut charts for macro distribution (use chart.js or recharts)
- Line graphs for weight/progress tracking over time
- Bar charts comparing daily calorie intake vs. targets
- Color coding: Protein (blue), Carbs (orange), Fats (green)

**CTAs & Actions:**
- Primary buttons: bg-primary, rounded-lg, px-6, py-3, font-semibold
- Secondary buttons: variant="outline", border-2
- "Generate New Plan" - prominent CTA with icon (sparkles/magic wand from Heroicons)
- Floating action button (FAB) for quick meal logging on mobile

**Overlays:**
- Recipe detail modal: Full-screen on mobile, centered card on desktop
- AI generation loading state: Skeleton loaders + progress indicator
- Success/Error toasts: Top-right corner, auto-dismiss

### E. Animations
**Minimal & Purposeful:**
- Page transitions: Subtle fade-in (duration-200)
- Skeleton loading for AI generation (pulse animation)
- Progress rings: Animated fill on load
- Form validation: Gentle shake on error
- No scroll-triggered animations

---

## Page-Specific Guidelines

### Landing Page (Marketing)
- **Hero Section (80vh):** Full-width image of healthy, colorful meal prep. Overlay: Gradient from transparent to bg-primary/20. Centered headline + subheadline + primary CTA. Floating UI preview showing AI-generated meal plan.
- **How It Works:** 3-column grid (mobile stacks). Icons from Heroicons (document-text, sparkles, calendar). Step number badges.
- **Features Grid:** 2x3 layout. Each card: Icon + Heading + Description. Subtle hover elevation (hover:shadow-lg).
- **Social Proof:** Testimonial carousel with user avatars, star ratings, before/after stats.
- **Pricing (if applicable):** Comparison table with highlighted recommended plan.
- **Final CTA:** Full-width section with contrasting bg-secondary, white text, large button.

### Onboarding Flow
- **Multi-step progress bar:** Top of page, 5-6 steps total
- **Step screens:** Centered card (max-w-2xl), generous padding (p-8 md:p-12)
- **Visual feedback:** Success checkmarks on completed steps
- **Navigation:** "Back" and "Continue" buttons, keyboard navigation (Enter to proceed)

### User Dashboard
- **Header:** Welcome message with user name, current weight, goal progress
- **Layout:** Sidebar navigation (desktop) / Bottom nav (mobile)
- **Main content:** Grid-based cards for today's meals, macro summary, upcoming plans
- **Quick actions:** "Log meal", "Adjust goals", "Generate new plan" shortcuts

### Meal Plan View
- **Weekly calendar:** Cards for each day with summary calories
- **Daily breakdown:** Expanded view shows all meals (breakfast, lunch, dinner, snacks)
- **Recipe cards:** Image (if available) or gradient placeholder + meal details
- **Shopping list generator:** Collapsible section at bottom

---

## Images

**Hero Image:** Large, vibrant photograph of diverse, healthy meal prep bowls with fresh vegetables, proteins, and grains. Professional food photography style. Bright, appetizing colors. Positioned as full-width background with overlay.

**Meal Placeholders:** For recipe cards without images, use gradient backgrounds with food category icons (breakfast: sunny-side egg, lunch: bowl, dinner: plate).

**Dashboard Illustrations:** Optional decorative illustrations for empty states ("No meals planned yet" - friendly veggie characters).

**Large hero image:** Yes, full-width on landing page (80vh height, parallax optional).

---

## Accessibility & Quality Standards
- WCAG AA compliant color contrast (4.5:1 for text)
- Dark mode toggle prominent in navigation
- All form inputs with clear labels and error states
- Keyboard navigation fully supported
- Screen reader friendly (aria-labels on icons, semantic HTML)
- Loading states for all AI interactions (prevent user confusion)
- Offline indicators if connection lost during generation
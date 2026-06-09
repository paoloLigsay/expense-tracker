# Design System & UI Guidelines

## Design Philosophy

Modern fintech aesthetic: **very dark background + bright lime green accents**. High contrast, minimal, premium feel. Reference: dashboard-ref-1 and dashboard-ref-2.

## Mobile-First Approach

**PRIORITY: All features must work on mobile devices first.**

- Design for mobile screens (375px - 430px width) before desktop
- Test every feature on mobile (iOS Safari, Android Chrome)
- Use Tailwind's responsive prefixes: `sm:`, `md:`, `lg:` (mobile → desktop)
- Touch-friendly: min button size 44x44px, adequate spacing between interactive elements
- Avoid horizontal scrolling
- Forms should be single column on mobile, can expand on desktop
- Navigation/menus should be mobile-friendly (no hover states only)

## Color Palette

### Primary Colors
- **Background**: Black/Near-black (`bg-black` or `bg-slate-950`) — Deep dark background for main surfaces
- **Secondary Background**: Very dark gray (`bg-slate-900`) — For cards and sections
- **Accent**: Lime Green (`bg-lime-400` or `text-lime-400`) — **PRIMARY ACCENT COLOR** for buttons, highlights, positive values
  - Use sparingly for maximum impact
  - For bright lime: `bg-lime-400` / `text-lime-400`
  - For darker lime: `lime-500` or `lime-600`
- **Text Primary**: White (`text-white`) — Main headings and important text
- **Text Secondary**: Gray (`text-gray-400` or `text-slate-400`) — Body text and descriptions
- **Text Tertiary**: Gray (`text-gray-500` or `text-slate-500`) — Subtle text, placeholders
- **Border**: Dark gray (`border-slate-800`) — Input borders and dividers
- **Success**: Lime-green (`text-lime-400`) — Positive amounts, gains
- **Danger**: Red (`text-red-400`) — Expenses, losses
- **Transfer**: Blue (`text-blue-400`) — Transfers between accounts

## Typography

- **Headings**: Bold weight (font-bold)
  - Page titles: `text-3xl` or `text-2xl`
  - Section titles: `text-lg` or `text-xl`
  - Card titles: `text-base font-semibold`
- **Body text**: Regular weight
  - Default: `text-gray-400` (secondary text)
  - Labels: `text-sm font-medium text-white`
  - Metadata: `text-xs text-slate-500`

## Components

### Buttons
- **Primary Action**: `bg-lime-400 hover:bg-lime-500 text-black font-semibold` (lime green with dark text)
- **Secondary**: `bg-slate-800 hover:bg-slate-700 text-white`
- **Danger**: `bg-red-900 hover:bg-red-800 text-white`
- **Links**: `text-lime-400 hover:text-lime-300` (lime underline optional)
- **Padding**: `py-2.5 px-4` for standard buttons
- **Border Radius**: `rounded-lg` (default) or `rounded-full` (pills)

### Input Fields
- **Container**: `bg-slate-900 border border-slate-800 rounded-lg`
- **Text**: `text-white placeholder-slate-600`
- **Focus**: `focus:border-lime-400 focus:ring-1 focus:ring-lime-400 focus:outline-none`
- **Padding**: `px-4 py-2.5`

### Cards
- **Container**: `bg-slate-900 border border-slate-800 rounded-lg p-4 md:p-6` or `rounded-2xl` for larger cards
- **Shadow**: Minimal or none (dark mode doesn't need shadows)
- **Use for**: Content sections, transaction items, allocation cards

### Transaction Items
- **Format**: Horizontal layout with icon/avatar on left, details in middle, amount on right
- **Icon Circle**: `w-12 h-12 rounded-full` with colored background (lime for income, red for expense, blue for transfer)
- **Name**: Bold white text
- **Metadata**: Secondary gray text below name (card, date/time, allocation)
- **Amount**: Bold, right-aligned, color-coded (lime green for +, red for -)
- **Spacing**: Adequate padding (3-4) for mobile touch targets

### Info/Alert Boxes
- **Success**: `border border-lime-900 bg-lime-900 bg-opacity-20 p-4 rounded-lg text-lime-400`
- **Error**: `bg-red-900 bg-opacity-30 p-3 rounded-lg text-red-400`
- **Info**: `border border-blue-900 bg-blue-900 bg-opacity-20 p-4 rounded-lg text-blue-400`

## Layout

- **Screen Padding**: `px-4` on mobile, `px-6` on tablet, `px-8` on desktop
- **Max Width**: `max-w-2xl` for main content (fits mobile well)
- **Spacing**: Use Tailwind spacing scale (mt-4, mb-8, gap-3, etc.)
- **Border Radius**: `rounded-lg` for inputs/buttons, `rounded-2xl` for cards
- **Sections**: Separate sections with space between them, not lines

## Principles

1. **Dark First**: All backgrounds are black or very dark (`bg-slate-950`)
2. **High Contrast**: Text must be readable on dark backgrounds
3. **Lime Green Accent**: Bright lime green is the ONLY bright color, used sparingly for maximum impact
4. **Minimal Design**: Flat design, no gradients, no drop shadows (dark mode doesn't need them)
5. **Rounded Corners**: `rounded-lg` default, `rounded-2xl` for emphasis
6. **Readable Focus States**: Always include focus indicators (lime green ring)
7. **Color Coding**: Use semantic colors (green = good/income, red = bad/expense, blue = neutral/transfer)

## Example: Form Input

```jsx
<input
  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-white placeholder-slate-600 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
/>
```

## Example: Primary Button

```jsx
<button className="rounded-lg bg-lime-400 px-4 py-2.5 font-semibold text-black hover:bg-lime-500">
  Add Transaction
</button>
```

## Example: Transaction Item

```jsx
<div className="flex gap-4 rounded-lg border border-slate-800 bg-slate-900 p-4">
  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-lime-400 flex items-center justify-center">
    <svg className="w-6 h-6 text-black"><!-- icon --></svg>
  </div>
  <div className="flex-1 min-w-0">
    <h4 className="font-semibold text-white">Spotify Premium</h4>
    <p className="text-xs text-slate-500">Mastercard ••••9918</p>
    <p className="text-xs text-slate-500">4 September • 03:30 pm</p>
  </div>
  <div className="flex-shrink-0 text-right">
    <div className="font-semibold text-red-400">- $12.99</div>
  </div>
</div>
```

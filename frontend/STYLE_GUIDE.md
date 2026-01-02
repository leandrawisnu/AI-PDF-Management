# AI PDF Management - Frontend Style Guide

## Design Philosophy

This style guide is inspired by Perplexity's clean, modern, and user-focused design approach with a refined stroke-based design language. The goal is to create an intuitive interface that prioritizes content readability and user experience while maintaining a professional, AI-forward aesthetic using thin strokes, minimal fills, and elegant typography instead of heavy, filled elements.

## Color Palette

### Primary Colors
- **Background**: `#0A0A0A` (Near-black, soft dark background)
- **Surface**: `transparent` (No filled surfaces - stroke-based design)
- **Surface Elevated**: `transparent` (No fills - use stroke emphasis instead)

### Accent Colors
- **Primary**: `#3B82F6` (Cool blue - primary actions, highlights)
- **Primary Hover**: `#2563EB` (Deeper blue for hover states)
- **Primary Glow**: `rgba(59, 130, 246, 0.4)` (Blue glow effect)
- **Success**: `#10B981` (Green - success states)
- **Warning**: `#F59E0B` (Amber - warning states)
- **Error**: `#EF4444` (Red - error states)

### Text Colors
- **Primary Text**: `#FFFFFF` (Pure white - headings, important text)
- **Secondary Text**: `#D1D5DB` (Light gray - body text, descriptions)
- **Muted Text**: `#9CA3AF` (Medium gray - metadata, timestamps)
- **Placeholder**: `#6B7280` (Dark gray - form placeholders)

### Stroke Colors
- **Default Stroke**: `#1F2937` (Subtle strokes for containers)
- **Active Stroke**: `#3B82F6` (Active/focus strokes)
- **Hover Stroke**: `#374151` (Hover state strokes)
- **Emphasis Stroke**: `#FFFFFF` (White strokes for emphasis)
- **Muted Stroke**: `#4B5563` (Subtle dividers and borders)

## Typography

### Font Family
- **Primary**: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Monospace**: `'JetBrains Mono', 'Fira Code', Consolas, monospace` (for code, file names)

### Font Sizes & Weights (Light & Medium Focus)
```css
/* Headings - Using lighter weights for elegance */
.text-4xl { font-size: 2.25rem; font-weight: 500; } /* Page titles - medium weight */
.text-3xl { font-size: 1.875rem; font-weight: 500; } /* Section headers - medium weight */
.text-2xl { font-size: 1.5rem; font-weight: 500; } /* Card titles - medium weight */
.text-xl { font-size: 1.25rem; font-weight: 400; } /* Subheadings - regular weight */

/* Body Text - Prioritizing readability over boldness */
.text-lg { font-size: 1.125rem; font-weight: 400; } /* Large body text */
.text-base { font-size: 1rem; font-weight: 400; } /* Default body text */
.text-sm { font-size: 0.875rem; font-weight: 400; } /* Small text, metadata */
.text-xs { font-size: 0.75rem; font-weight: 400; } /* Tiny text, labels */

/* Emphasis - Sparingly used */
.text-semibold { font-weight: 600; } /* Only for critical emphasis */
.text-medium { font-weight: 500; } /* Subtle emphasis */
```

## Layout & Spacing

### Container Widths
- **Max Width**: `1200px` (main content container)
- **Sidebar Width**: `280px` (navigation sidebar)
- **Content Padding**: `24px` (main content areas)

### Spacing Scale (Tailwind-based)
- `4px` (1) - Tight spacing
- `8px` (2) - Small spacing
- `12px` (3) - Default spacing
- `16px` (4) - Medium spacing
- `24px` (6) - Large spacing
- `32px` (8) - Extra large spacing
- `48px` (12) - Section spacing

### Border Radius (Minimal & Clean)
- **Small**: `4px` (buttons, small elements - reduced for cleaner look)
- **Medium**: `8px` (containers, inputs - subtle rounding)
- **Large**: `12px` (major containers - minimal rounding)
- **Full**: `9999px` (pills, avatars only when necessary)

### Stroke Width Standards
- **Thin**: `1px` (Default stroke width for most elements)
- **Medium**: `1.5px` (Emphasis strokes, active states)
- **Thick**: `2px` (Strong emphasis, focus states)
- **Extra Thick**: `3px` (Maximum emphasis, error states)

## Components (Stroke-Based Design)

### Buttons

#### Primary Button (Stroke-Based with Glow)
```css
.btn-primary {
  background: transparent;
  color: #3B82F6;
  border: 1px solid #3B82F6;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 400;
  transition: all 0.2s ease;
  box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
}
.btn-primary:hover {
  border-color: #2563EB;
  color: #2563EB;
  transform: translateY(-1px);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
}
.btn-primary:active {
  background: rgba(59, 130, 246, 0.05);
}
```

#### Secondary Button (Minimal Stroke)
```css
.btn-secondary {
  background: transparent;
  color: #D1D5DB;
  border: 1px solid #1F2937;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 400;
  transition: all 0.2s ease;
}
.btn-secondary:hover {
  border-color: #374151;
  color: #FFFFFF;
}
```

#### Ghost Button (Text Only)
```css
.btn-ghost {
  background: transparent;
  color: #D1D5DB;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 400;
  transition: all 0.2s ease;
}
.btn-ghost:hover {
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.02);
}
```

### Cards (Stroke Containers)
```css
.card {
  background: transparent;
  border: 1px solid #1F2937;
  border-radius: 8px;
  padding: 24px;
  transition: all 0.2s ease;
}
.card:hover {
  border-color: #374151;
  transform: translateY(-1px);
}
.card.active {
  border-color: #3B82F6;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
}
.card.emphasis {
  border-color: #FFFFFF;
}
```

### Input Fields (Clean Strokes with Glow)
```css
.input {
  background: transparent;
  border: 1px solid #1F2937;
  border-radius: 4px;
  padding: 12px 16px;
  color: #FFFFFF;
  font-size: 1rem;
  font-weight: 400;
  transition: all 0.2s ease;
}
.input:focus {
  border-color: #3B82F6;
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.3);
}
.input::placeholder {
  color: #6B7280;
  font-weight: 400;
}
```

### Dividers & Separators
```css
.divider {
  border: none;
  height: 1px;
  background: #1F2937;
  margin: 24px 0;
}
.divider.emphasis {
  background: #374151;
}
.divider.muted {
  background: #4B5563;
}
```

## Layout Structure

### Main Layout
```
┌─────────────────────────────────────────┐
│ Header (Navigation)                     │
├─────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────────────────────┐ │
│ │         │ │                         │ │
│ │ Sidebar │ │    Main Content Area    │ │
│ │         │ │                         │ │
│ │         │ │                         │ │
│ └─────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Header
- Height: `64px`
- Background: `transparent` with bottom stroke
- Border: `1px solid #1F2937` (bottom only)
- Contains: Logo, search bar, user menu
- Sticky positioning

### Sidebar
- Width: `280px`
- Background: `transparent`
- Border: `1px solid #1F2937` (right side only)
- Contains: Navigation menu, recent files, quick actions
- Collapsible on mobile

### Main Content
- Max width: `1200px`
- Centered with auto margins
- Responsive padding: `24px` desktop, `16px` mobile
- No background fills - content floats on main background

## Interactive States (Stroke-Based)

### Hover Effects
- Subtle `translateY(-1px)` for buttons and cards
- Stroke color transitions: `0.2s ease`
- Border color changes (never background fills)
- Subtle opacity changes for text elements

### Focus States
- Blue stroke: `1px solid #3B82F6`
- Subtle glow: `0 0 20px rgba(59, 130, 246, 0.3)`
- No default browser outline
- Maintain stroke-based approach

### Active States
- Minimal background tint: `rgba(59, 130, 246, 0.05)` (very subtle)
- Stronger stroke: `2px solid #3B82F6`
- Slight scale: `transform: scale(0.98)` for buttons

### Loading States
- Skeleton loaders with stroke animation (no fills)
- Spinner: Blue stroke (`#3B82F6`) with rotating border
- Disabled state: 50% opacity on strokes and text

## Icons

### Icon Library
- **Lucide React** (primary choice for consistency)
- Size: `20px` for most icons, `16px` for small contexts
- Color: Inherit from parent text color
- Stroke width: `1.5px`

### Common Icons (Stroke-Based)
- Upload: `Upload` (stroke only)
- Download: `Download` (stroke only)
- Search: `Search` (stroke only)
- Menu: `Menu` (stroke only)
- Close: `X` (stroke only)
- PDF: `FileText` (stroke only)
- Summary: `FileCheck` (stroke only)
- Settings: `Settings` (stroke only)

### Icon Usage Guidelines
- Always use stroke/outline versions, never filled
- Consistent stroke width: `1.5px`
- Color inherits from parent text
- Avoid icon backgrounds or containers
- Use sparingly for clean aesthetic

## Animation Guidelines (Subtle & Refined)

### Micro-interactions
- Button hover: `transform: translateY(-1px)` (reduced movement)
- Card hover: `transform: translateY(-1px)` (consistent with buttons)
- Transition duration: `0.2s ease`
- Focus on stroke color transitions over movement

### Page Transitions
- Fade in: `opacity 0.3s ease`
- Subtle slide up: `transform: translateY(10px)` to `translateY(0)` (reduced distance)

### Loading Animations
- Skeleton: Stroke-based shimmer effect (no filled backgrounds)
- Spinner: Rotating stroke border
- Progress bars: Stroke-based progress indication

## Responsive Design

### Breakpoints
- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`

### Mobile Adaptations
- Sidebar becomes overlay/drawer
- Reduced padding: `16px`
- Stacked layouts
- Touch-friendly button sizes (min `44px`)

## Accessibility

### Color Contrast
- All text meets WCAG AA standards
- Focus indicators are clearly visible
- Error states use both color and text

### Keyboard Navigation
- Tab order follows logical flow
- All interactive elements are keyboard accessible
- Skip links for main content

### Screen Readers
- Semantic HTML structure
- ARIA labels for complex interactions
- Alt text for all images

## File Organization

### CSS Structure
```
styles/
├── globals.css          # Global styles, CSS reset
├── components/          # Component-specific styles
├── utilities/           # Utility classes
└── themes/             # Theme variations
```

### Component Structure
```
components/
├── ui/                 # Reusable UI components
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Input.jsx
│   └── Modal.jsx
├── layout/             # Layout components
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   └── Layout.jsx
└── features/           # Feature-specific components
    ├── PDFUpload.jsx
    ├── SummaryCard.jsx
    └── PDFList.jsx
```

## Usage Examples (Stroke-Based Components)

### PDF Card Component (Clean Strokes)
```jsx
<div className="border border-gray-800 rounded-lg p-6 hover:border-gray-600 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
  <div className="flex items-start gap-4">
    <FileText className="w-6 h-6 text-blue-500 flex-shrink-0 stroke-1.5" />
    <div className="flex-1 min-w-0">
      <h3 className="text-lg font-medium text-white truncate">
        Document Title
      </h3>
      <p className="text-sm text-gray-300 mt-1 font-normal">
        {fileSize} • {pageCount} pages
      </p>
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
        <span>{createdAt}</span>
        <span>{summaryCount} summaries</span>
      </div>
    </div>
  </div>
</div>
```

### Summary Display (Minimal Stroke Container)
```jsx
<div className="border border-gray-800 rounded-lg p-6 hover:border-gray-600 transition-all duration-200">
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <FileCheck className="w-5 h-5 text-green-400 stroke-1.5" />
      <span className="text-sm font-normal text-white">
        {style} Summary
      </span>
    </div>
    <span className="text-xs text-gray-400">{language}</span>
  </div>
  <div className="prose prose-invert max-w-none font-normal">
    {content}
  </div>
</div>
```

### Button Examples (Stroke-Based with Glow)
```jsx
{/* Primary Button - Blue Stroke with Glow */}
<button className="border border-blue-500 text-blue-500 px-6 py-3 rounded hover:border-blue-600 hover:text-blue-600 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-200 font-normal">
  Upload PDF
</button>

{/* Secondary Button - Gray Stroke */}
<button className="border border-gray-700 text-gray-300 px-6 py-3 rounded hover:border-gray-600 hover:text-white transition-all duration-200 font-normal">
  Cancel
</button>

{/* Ghost Button - No Stroke */}
<button className="text-gray-300 px-6 py-3 rounded hover:text-white hover:bg-white/5 transition-all duration-200 font-normal">
  Learn More
</button>
```

### Input Field (Clean Stroke with Glow)
```jsx
<input 
  className="w-full bg-transparent border border-gray-700 rounded px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:shadow-[0_0_0_2px_rgba(59,130,246,0.1),0_0_20px_rgba(59,130,246,0.3)] transition-all duration-200 font-normal"
  placeholder="Search documents..."
/>
```

This stroke-based design language creates a more refined, elegant interface that feels modern and uncluttered while maintaining excellent usability and visual hierarchy.
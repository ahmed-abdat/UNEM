# TASK-03: Consolidate Design Tokens

**Status**: ⏳ Pending  
**Priority**: High  
**Estimated Time**: 45-60 minutes  
**Dependencies**: TASK-01 and TASK-02 must be completed

## Objective

Consolidate and clean up the design token system in `tailwind.config.js` to align custom brand colors with shadcn/ui design system while maintaining brand identity and improving consistency.

## Prerequisites

- TASK-01 (shadcn/ui components) completed
- TASK-02 (package updates) completed  
- Working directory: `/home/ahmed/projects/UNEM`

## Current State Analysis

### Current Custom Colors (from tailwind.config.js):
```javascript
colors: {
  'disabeld-btn': '#58cc10',    // Disabled button color
  'news-border': '#13c867',     // News border color
  'whtssap-label': '#077038',   // WhatsApp label color
  'btn': '#58cc02',             // Button color
  'btn-hover': '#2fb30c',       // Button hover color
  'primary-color': '#26a306',   // Primary brand color
  'main': '#f8f8f8',            // Main background
  'green-1': '#186a02',         // Dark green
  'green-2': '#26a306',         // Medium green (same as primary-color)
  
  // shadcn/ui design tokens (already good)
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  // ... rest of shadcn/ui tokens
}
```

### Issues to Fix:
1. **Inconsistent naming**: Mix of kebab-case and camelCase
2. **Duplicate values**: `primary-color` and `green-2` are identical
3. **Typo**: `disabeld-btn` should be `disabled-btn`
4. **No semantic meaning**: Color names don't indicate purpose
5. **Not aligned with shadcn/ui**: Custom colors don't follow design system

## Implementation Steps

### Step 1: Backup Current Configuration (2 minutes)

```bash
cd /home/ahmed/projects/UNEM

# Backup current tailwind config
cp tailwind.config.js tailwind.config.js.backup

# Also backup any CSS files that might use these colors
find src -name "*.css" -exec cp {} {}.backup \;
```

### Step 2: Analyze Color Usage (10 minutes)

Find where custom colors are currently used:

```bash
# Search for color usage in all files
grep -r "disabeld-btn\|news-border\|whtssap-label\|btn\|primary-color\|green-1\|green-2" src/ --include="*.jsx" --include="*.js" --include="*.css"

# Save results for reference
grep -r "disabeld-btn\|news-border\|whtssap-label\|btn\|primary-color\|green-1\|green-2" src/ --include="*.jsx" --include="*.js" --include="*.css" > /tmp/color-usage.txt
```

### Step 3: Create New Design Token System (15 minutes)

Update `tailwind.config.js` with consolidated design tokens:

```javascript
// New consolidated color system
const colors = {
  // Brand Colors (semantic naming)
  brand: {
    primary: '#26a306',        // Main brand color (was primary-color, green-2)
    'primary-hover': '#2fb30c', // Primary hover state (was btn-hover)
    'primary-dark': '#186a02',  // Dark brand color (was green-1)
    success: '#58cc02',         // Success color (was btn)
    'success-disabled': '#58cc10', // Disabled success (was disabeld-btn)
    accent: '#13c867',          // Accent color (was news-border)
    whatsapp: '#077038',        // WhatsApp brand color (was whtssap-label)
  },
  
  // Layout Colors
  layout: {
    main: '#f8f8f8',           // Main background (was main)
  },
  
  // shadcn/ui design tokens (keep existing)
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  // ... rest of existing shadcn/ui tokens
};
```

### Step 4: Update tailwind.config.js (10 minutes)

Replace the colors section in `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        tajawal: ['Tajawal', 'sans-serif'],
        vazirmatn: ['Vazirmatn', 'sans-serif'],
        arabic: ['Tajawal', 'Vazirmatn', 'sans-serif'],
      },
      colors: {
        // Brand Colors (consolidated and semantic)
        brand: {
          primary: '#26a306',
          'primary-hover': '#2fb30c',
          'primary-dark': '#186a02',
          success: '#58cc02',
          'success-disabled': '#58cc10',
          accent: '#13c867',
          whatsapp: '#077038',
        },
        
        // Layout Colors
        layout: {
          main: '#f8f8f8',
        },
        
        // shadcn/ui Design System (keep existing)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(272deg, var(--tw-gradient-stops))',
        'gradient-footer': 'linear-gradient(350deg, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'option': '0 8px 17px #0000000f',
        'btne': '0 4px #4dac05'
      },
      keyframes: {
        spinner: {
          '100%': { transform: 'rotate(1turn)' },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        'spin': 'spinner 1s infinite linear',
        'spin-slow': 'spinner 2s infinite linear',
        'spin-slowest': 'spinner 3s infinite linear',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### Step 5: Create Migration Map Document (5 minutes)

Create a reference document for color migration:

```bash
cat > /tmp/color-migration-map.md << 'EOF'
# Color Migration Map

## Old → New Color Mappings

| Old Class | New Class | Hex Value | Usage |
|-----------|-----------|-----------|-------|
| `text-primary-color` | `text-brand-primary` | #26a306 | Primary brand text |
| `bg-btn` | `bg-brand-success` | #58cc02 | Success buttons |
| `bg-btn-hover` | `bg-brand-primary-hover` | #2fb30c | Button hover states |
| `bg-disabeld-btn` | `bg-brand-success-disabled` | #58cc10 | Disabled buttons |
| `border-news-border` | `border-brand-accent` | #13c867 | News borders |
| `text-whtssap-label` | `text-brand-whatsapp` | #077038 | WhatsApp elements |
| `bg-main` | `bg-layout-main` | #f8f8f8 | Main backgrounds |
| `text-green-1` | `text-brand-primary-dark` | #186a02 | Dark green text |
| `text-green-2` | `text-brand-primary` | #26a306 | Primary green text |

## CSS Custom Properties (unchanged)
- `bg-primary` → `bg-primary` (shadcn/ui)
- `text-foreground` → `text-foreground` (shadcn/ui)
- etc.
EOF

# Copy to project for reference
cp /tmp/color-migration-map.md ./
```

### Step 6: Update CSS Files (10 minutes)

Find and update any CSS files that use the old color names:

```bash
# Create script to update CSS files
cat > /tmp/update-colors.sh << 'EOF'
#!/bin/bash

# Function to update color references in a file
update_file() {
    local file="$1"
    echo "Updating $file..."
    
    # Create sed commands for color replacements
    sed -i 's/text-primary-color/text-brand-primary/g' "$file"
    sed -i 's/bg-primary-color/bg-brand-primary/g' "$file"
    sed -i 's/border-primary-color/border-brand-primary/g' "$file"
    
    sed -i 's/text-btn/text-brand-success/g' "$file"
    sed -i 's/bg-btn/bg-brand-success/g' "$file"
    sed -i 's/border-btn/border-brand-success/g' "$file"
    
    sed -i 's/hover:bg-btn-hover/hover:bg-brand-primary-hover/g' "$file"
    sed -i 's/bg-btn-hover/bg-brand-primary-hover/g' "$file"
    
    sed -i 's/bg-disabeld-btn/bg-brand-success-disabled/g' "$file"
    sed -i 's/text-disabeld-btn/text-brand-success-disabled/g' "$file"
    
    sed -i 's/border-news-border/border-brand-accent/g' "$file"
    sed -i 's/bg-news-border/bg-brand-accent/g' "$file"
    
    sed -i 's/text-whtssap-label/text-brand-whatsapp/g' "$file"
    sed -i 's/bg-whtssap-label/bg-brand-whatsapp/g' "$file"
    
    sed -i 's/bg-main/bg-layout-main/g' "$file"
    
    sed -i 's/text-green-1/text-brand-primary-dark/g' "$file"
    sed -i 's/bg-green-1/bg-brand-primary-dark/g' "$file"
    
    sed -i 's/text-green-2/text-brand-primary/g' "$file"
    sed -i 's/bg-green-2/bg-brand-primary/g' "$file"
}

# Update all relevant files
find src -name "*.jsx" -o -name "*.js" -o -name "*.css" | while read file; do
    if grep -q "primary-color\|btn\|green-1\|green-2\|disabeld-btn\|news-border\|whtssap-label\|main" "$file"; then
        update_file "$file"
    fi
done

echo "Color migration completed!"
EOF

chmod +x /tmp/update-colors.sh
/tmp/update-colors.sh
```

### Step 7: Verify Changes (5 minutes)

```bash
# Test that the new configuration is valid
npm run build

# Check for any remaining old color references
grep -r "disabeld-btn\|news-border\|whtssap-label\|primary-color\|green-1\|green-2" src/ --include="*.jsx" --include="*.js" --include="*.css" || echo "No old color references found ✓"
```

## Files That Will Be Modified

### Configuration Files:
- `tailwind.config.js` - Updated color system

### Source Files (potentially):
- Any `.jsx`, `.js`, or `.css` files using the old color classes
- May include components, pages, and style files

### Documentation Files:
- `color-migration-map.md` - Created for reference

## Testing Instructions

### Step 1: Build Test
```bash
npm run build
```
**Expected**: Build completes without errors

### Step 2: Development Server Test
```bash
npm run dev
```
**Expected**: 
- Server starts without errors
- All colors render correctly
- No missing color warnings in console

### Step 3: Visual Testing Checklist
Open the application and verify:
- [ ] Primary buttons have correct green color
- [ ] Button hover states work correctly
- [ ] Disabled buttons have correct appearance
- [ ] News/post borders display correctly
- [ ] WhatsApp elements maintain brand colors
- [ ] Background colors are consistent
- [ ] Text colors have proper contrast

### Step 4: Color System Test
Create a test component to verify all new colors work:

```jsx
// Create test file: src/components/ColorTest.jsx
import React from 'react';

export default function ColorTest() {
  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold">Color System Test</h2>
      
      {/* Brand Colors */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Brand Colors</h3>
        <div className="flex gap-2 flex-wrap">
          <div className="w-20 h-20 bg-brand-primary rounded flex items-end justify-center text-xs text-white p-1">primary</div>
          <div className="w-20 h-20 bg-brand-primary-hover rounded flex items-end justify-center text-xs text-white p-1">hover</div>
          <div className="w-20 h-20 bg-brand-primary-dark rounded flex items-end justify-center text-xs text-white p-1">dark</div>
          <div className="w-20 h-20 bg-brand-success rounded flex items-end justify-center text-xs text-white p-1">success</div>
          <div className="w-20 h-20 bg-brand-success-disabled rounded flex items-end justify-center text-xs text-black p-1">disabled</div>
          <div className="w-20 h-20 bg-brand-accent rounded flex items-end justify-center text-xs text-white p-1">accent</div>
          <div className="w-20 h-20 bg-brand-whatsapp rounded flex items-end justify-center text-xs text-white p-1">whatsapp</div>
        </div>
      </div>
      
      {/* Layout Colors */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Layout Colors</h3>
        <div className="w-40 h-20 bg-layout-main rounded border flex items-center justify-center">Main Background</div>
      </div>
    </div>
  );
}
```

### Step 5: Accessibility Test
```bash
# Verify color contrast ratios are maintained
# Use browser dev tools or online contrast checker
# Ensure all text remains readable
```

## Acceptance Criteria

- [ ] All custom colors are reorganized into semantic brand categories
- [ ] No old color references remain in codebase
- [ ] Build completes without errors
- [ ] All existing visual elements maintain their appearance
- [ ] New color system follows consistent naming convention
- [ ] Color contrast ratios meet accessibility standards
- [ ] Documentation updated with migration map

## Benefits of New System

### Improved Maintainability:
- **Semantic naming**: `brand-primary` vs `green-2`
- **Consistent structure**: All brand colors grouped together
- **No duplicates**: Single source of truth for each color

### Better Developer Experience:
- **Autocomplete friendly**: IDE can suggest `brand-*` colors
- **Clear purpose**: Color names indicate usage intent
- **Easy to extend**: Simple to add new brand variants

### Design System Alignment:
- **Follows shadcn/ui patterns**: Consistent with design system
- **CSS custom properties**: Compatible with theme switching
- **Scalable**: Easy to add dark mode variants

## Troubleshooting

### Issue: Colors not updating in browser
**Solution**:
```bash
# Clear Tailwind CSS cache
rm -rf node_modules/.cache
npm run dev
```

### Issue: Build fails with color errors
**Solution**:
```bash
# Check for typos in color names
grep -r "brand-" src/ | grep -v "brand-primary\|brand-success\|brand-accent\|brand-whatsapp\|brand-primary-hover\|brand-primary-dark\|brand-success-disabled"
```

### Issue: Some elements lost styling
**Solution**:
```bash
# Find elements that might still use old colors
grep -r "primary-color\|btn[^-]\|green-[12]" src/
# Update any missed references manually
```

## Rollback Plan

If issues occur:

```bash
# Restore backup
cp tailwind.config.js.backup tailwind.config.js

# Restore CSS files
find src -name "*.css.backup" | while read backup; do
    original="${backup%.backup}"
    cp "$backup" "$original"
done

# Restore JS/JSX files (if needed)
git checkout src/

# Rebuild
npm run build
```

## Next Steps

After completing this task:
1. Test the application thoroughly to ensure all colors render correctly
2. Proceed to **TASK-04-component-audit.md**
3. Consider adding dark mode support using the new color system
4. Update any documentation that references color usage
# TASK-01: Add Essential shadcn/ui Components

**Status**: ⏳ Pending  
**Priority**: High  
**Estimated Time**: 30-45 minutes  
**Dependencies**: None

## Objective

Add the most essential missing shadcn/ui components to enhance the UI consistency and capabilities of the UNEM project.

## Prerequisites

- Node.js and npm installed
- Project dependencies already installed (`npm install` completed)
- Working directory: `/home/ahmed/projects/UNEM`

## Current State Analysis

**Existing shadcn/ui components** (already implemented):
- ✅ `button.jsx` - Button with variants (default, outline, destructive, etc.)
- ✅ `card.jsx` - Card with compound pattern (Header, Title, Description, Content, Footer)
- ✅ `input.jsx` - Form input field
- ✅ `label.jsx` - Form label
- ✅ `alert.jsx` - Alert/notification component
- ✅ `badge.jsx` - Badge/status indicator
- ✅ `progress.jsx` - Progress bar component
- ✅ `tabs.jsx` - Tab navigation component

**Missing components** (to be added):
- ❌ `dialog` - Modal/dialog system
- ❌ `select` - Dropdown select component
- ❌ `toast` - Toast notification system
- ❌ `dropdown-menu` - Dropdown menu component
- ❌ `textarea` - Multi-line text input
- ❌ `checkbox` - Checkbox input
- ❌ `switch` - Toggle switch component

## Implementation Steps

### Step 1: Add Dialog Component (10 minutes)

```bash
# Navigate to project root
cd /home/ahmed/projects/UNEM

# Add dialog component
npx shadcn@latest add dialog
```

**Expected Output**: 
- Creates `src/components/ui/dialog.jsx`
- May update dependencies in `package.json`

**Verification**:
```bash
# Check if file was created
ls -la src/components/ui/dialog.jsx

# Verify import works
echo "import { Dialog } from '@/components/ui/dialog'" > /tmp/test-import.js
```

### Step 2: Add Select Component (5 minutes)

```bash
npx shadcn@latest add select
```

**Expected Output**: 
- Creates `src/components/ui/select.jsx`
- May add additional Radix UI dependencies

**Verification**:
```bash
ls -la src/components/ui/select.jsx
```

### Step 3: Add Toast Component (5 minutes)

```bash
npx shadcn@latest add toast
```

**Expected Output**: 
- Creates `src/components/ui/toast.jsx`
- Creates `src/components/ui/toaster.jsx` 
- Creates `src/hooks/use-toast.js`

**Verification**:
```bash
ls -la src/components/ui/toast.jsx
ls -la src/components/ui/toaster.jsx  
ls -la src/hooks/use-toast.js
```

### Step 4: Add Dropdown Menu Component (5 minutes)

```bash
npx shadcn@latest add dropdown-menu
```

**Expected Output**: 
- Creates `src/components/ui/dropdown-menu.jsx`

**Verification**:
```bash
ls -la src/components/ui/dropdown-menu.jsx
```

### Step 5: Add Textarea Component (5 minutes)

```bash
npx shadcn@latest add textarea
```

**Expected Output**: 
- Creates `src/components/ui/textarea.jsx`

**Verification**:
```bash
ls -la src/components/ui/textarea.jsx
```

### Step 6: Add Checkbox Component (5 minutes)

```bash
npx shadcn@latest add checkbox
```

**Expected Output**: 
- Creates `src/components/ui/checkbox.jsx`

**Verification**:
```bash
ls -la src/components/ui/checkbox.jsx
```

### Step 7: Add Switch Component (5 minutes)

```bash
npx shadcn@latest add switch
```

**Expected Output**: 
- Creates `src/components/ui/switch.jsx`

**Verification**:
```bash
ls -la src/components/ui/switch.jsx
```

## Files That Will Be Created/Modified

### New Files Created:
- `src/components/ui/dialog.jsx`
- `src/components/ui/select.jsx`
- `src/components/ui/toast.jsx`
- `src/components/ui/toaster.jsx`
- `src/components/ui/dropdown-menu.jsx`
- `src/components/ui/textarea.jsx`
- `src/components/ui/checkbox.jsx`
- `src/components/ui/switch.jsx`
- `src/hooks/use-toast.js`

### Files That May Be Modified:
- `package.json` (if new dependencies are added)
- `src/lib/utils.js` (may get additional utilities)

## Testing Instructions

### Step 1: Build Test
```bash
npm run build
```
**Expected**: Build should complete without errors

### Step 2: Development Server Test
```bash
npm run dev
```
**Expected**: Development server should start without errors

### Step 3: Component Import Test
Create a test file to verify all components can be imported:

```bash
# Create test file
cat > /tmp/component-test.jsx << 'EOF'
// Test imports for all new components
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

console.log('All components imported successfully');
EOF

# Test with Node.js (this will check syntax)
node -c /tmp/component-test.jsx
```

### Step 4: Lint Test
```bash
npm run lint
```
**Expected**: No new linting errors introduced

## Acceptance Criteria

- [ ] All 7 new shadcn/ui components are successfully added
- [ ] No build errors after installation
- [ ] No lint errors introduced
- [ ] All component files exist in `src/components/ui/`
- [ ] Components can be imported without errors
- [ ] Development server starts successfully
- [ ] Project builds successfully

## Usage Examples

After completion, you can use the new components like this:

### Dialog Example:
```jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <p>Dialog content goes here...</p>
  </DialogContent>
</Dialog>
```

### Select Example:
```jsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select option..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Toast Example:
```jsx
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

function MyComponent() {
  const { toast } = useToast();

  return (
    <Button onClick={() => toast({ title: "Success!", description: "Action completed successfully." })}>
      Show Toast
    </Button>
  );
}
```

## Troubleshooting

### Issue: "Command not found: shadcn"
**Solution**: 
```bash
npm install -g @shadcn/ui@latest
# or use npx (recommended)
npx shadcn@latest --help
```

### Issue: "Failed to add component"
**Solution**: 
1. Check if `components.json` exists in project root
2. If not, initialize shadcn/ui:
```bash
npx shadcn@latest init
```

### Issue: Import errors after installation
**Solution**: 
1. Check if `src/lib/utils.js` exists and has the `cn` function
2. Verify `@` alias is configured in `vite.config.js` or `tsconfig.json`

### Issue: Build errors after adding components
**Solution**: 
1. Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Rollback Plan

If issues occur, you can remove the added components:

```bash
# Remove component files
rm -f src/components/ui/dialog.jsx
rm -f src/components/ui/select.jsx
rm -f src/components/ui/toast.jsx
rm -f src/components/ui/toaster.jsx
rm -f src/components/ui/dropdown-menu.jsx
rm -f src/components/ui/textarea.jsx
rm -f src/components/ui/checkbox.jsx
rm -f src/components/ui/switch.jsx
rm -f src/hooks/use-toast.js

# Restore package.json from git (if dependencies were added)
git checkout package.json

# Reinstall dependencies
npm install
```

## Next Steps

After completing this task:
1. Proceed to **TASK-02-package-updates.md**
2. Test the new components in your application
3. Consider updating existing UI elements to use these new components
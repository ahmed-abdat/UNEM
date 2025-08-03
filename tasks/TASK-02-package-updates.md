# TASK-02: Update Dependencies Safely

**Status**: ⏳ Pending  
**Priority**: Medium  
**Estimated Time**: 15-20 minutes  
**Dependencies**: TASK-01 must be completed

## Objective

Update safe, non-breaking package dependencies to their latest versions to improve security, performance, and access to new features while maintaining stability.

## Prerequisites

- TASK-01 (shadcn/ui components) completed successfully
- No build errors from previous task
- Working directory: `/home/ahmed/projects/UNEM`

## Current State Analysis

Based on `npm outdated` analysis, these are the **safe updates** that won't introduce breaking changes:

### Safe Minor/Patch Updates:
- `@radix-ui/react-label`: `2.1.0` → `2.1.7` (patch)
- `class-variance-authority`: `0.7.0` → `0.7.1` (patch)
- `react-hook-form`: `7.52.1` → `7.62.0` (minor)
- `lucide-react`: `0.417.0` → `0.536.0` (minor)
- `autoprefixer`: `10.4.19` → `10.4.21` (patch)
- `react-lazy-load-image-component`: `1.6.0` → `1.6.3` (patch)
- `react-loading-skeleton`: `3.3.1` → `3.5.0` (minor)
- `react-select`: `5.7.3` → `5.10.2` (minor)
- `react-share`: `5.0.3` → `5.2.2` (minor)
- `tailwind-merge`: `2.4.0` → `2.6.0` (minor)

### Updates to Avoid (Potential Breaking Changes):
- `@tiptap/*` packages: `2.4.0` → `3.0.9` (major version bump)
- `react`/`react-dom`: `18.3.1` → `19.1.1` (major version bump)
- `tailwindcss`: `3.4.7` → `4.1.11` (major version bump)
- `vite`: Already on latest major version `6.3.5`

## Implementation Steps

### Step 1: Backup Current State (2 minutes)

```bash
cd /home/ahmed/projects/UNEM

# Create backup of package.json and package-lock.json
cp package.json package.json.backup
cp package-lock.json package-lock.json.backup

# Commit current state (if using git)
git add -A
git commit -m "backup: before dependency updates"
```

### Step 2: Update Safe Dependencies (10 minutes)

Update packages one by one to catch any issues early:

```bash
# Update Radix UI components
npm update @radix-ui/react-label

# Update utility libraries
npm update class-variance-authority
npm update tailwind-merge

# Update React libraries
npm update react-hook-form
npm update react-lazy-load-image-component
npm update react-loading-skeleton
npm update react-select
npm update react-share

# Update icon library
npm update lucide-react

# Update build tools
npm update autoprefixer
```

### Step 3: Verify Updates (3 minutes)

```bash
# Check which packages were actually updated
npm list --depth=0 | grep -E "(radix-ui|class-variance|react-hook-form|lucide-react|tailwind-merge)"

# Verify no vulnerabilities were introduced
npm audit
```

## Files That Will Be Modified

### Files Modified:
- `package.json` - Updated dependency versions
- `package-lock.json` - Updated dependency resolution tree

### Files Not Modified:
- All source code files remain unchanged
- Configuration files remain unchanged

## Testing Instructions

### Step 1: Clean Install Test
```bash
# Remove node_modules and reinstall to verify lock file integrity
rm -rf node_modules
npm install
```
**Expected**: Installation completes without errors

### Step 2: Build Test
```bash
npm run build
```
**Expected**: Build completes successfully without errors

### Step 3: Development Server Test
```bash
npm run dev
```
**Expected**: 
- Server starts without errors
- Hot reload works
- No console errors in browser

### Step 4: Lint Test
```bash
npm run lint
```
**Expected**: No new linting errors

### Step 5: Component Functionality Test
```bash
# Test that existing components still work
# Navigate to homepage and verify:
# 1. Buttons render correctly
# 2. Cards display properly
# 3. Forms work as expected
# 4. Icons display correctly
```

### Step 6: Performance Test
```bash
# Check bundle size hasn't increased dramatically
npm run build
ls -lh dist/assets/

# Bundle should be roughly the same size or smaller
```

## Acceptance Criteria

- [ ] All safe dependencies are updated to latest minor/patch versions
- [ ] No build errors after updates
- [ ] No new security vulnerabilities introduced (`npm audit` clean)
- [ ] Development server starts successfully
- [ ] All existing functionality works as before
- [ ] Bundle size hasn't increased significantly
- [ ] No new lint errors

## Expected Benefits

### Performance Improvements:
- **react-hook-form**: Better performance and smaller bundle size
- **lucide-react**: More icons and better tree-shaking
- **tailwind-merge**: Improved class merging performance

### Bug Fixes:
- **@radix-ui/react-label**: Accessibility improvements
- **react-select**: Better keyboard navigation and accessibility
- **react-loading-skeleton**: Improved animation performance

### Security:
- Latest patch versions include security fixes
- Reduced number of outdated dependencies

## Verification Commands

Run these commands to verify the updates:

```bash
# Check updated versions
npm list @radix-ui/react-label class-variance-authority react-hook-form lucide-react tailwind-merge

# Verify no breaking changes
npm run build && npm run lint

# Check for security issues
npm audit

# Verify file sizes
du -sh node_modules/
```

## Troubleshooting

### Issue: Build fails after updates
**Solution**:
```bash
# Rollback to backup
cp package.json.backup package.json
cp package-lock.json.backup package-lock.json
rm -rf node_modules
npm install
```

### Issue: New TypeScript errors
**Solution**:
```bash
# Update @types packages if they exist
npm update @types/react @types/react-dom
```

### Issue: Component imports break
**Solution**:
```bash
# Check if component exports changed
npm list [package-name]
# Refer to package changelog for breaking changes
```

### Issue: Performance regression
**Solution**:
```bash
# Analyze bundle size
npx webpack-bundle-analyzer dist

# Check specific package impact
npm ls [package-name]
```

## Rollback Plan

If any issues occur:

```bash
# Complete rollback
cp package.json.backup package.json
cp package-lock.json.backup package-lock.json
rm -rf node_modules
npm install

# Verify rollback worked
npm run build
npm run dev
```

## Package-Specific Notes

### react-hook-form (7.52.1 → 7.62.0)
- **Benefits**: Better TypeScript support, performance improvements
- **Risk**: Low - minor version with backward compatibility
- **Test**: Verify all forms still work correctly

### lucide-react (0.417.0 → 0.536.0)
- **Benefits**: New icons, better tree-shaking
- **Risk**: Low - additive changes only
- **Test**: Verify all existing icons still render

### tailwind-merge (2.4.0 → 2.6.0)
- **Benefits**: Better class merging logic, performance improvements
- **Risk**: Very low - utility library with stable API
- **Test**: Verify `cn()` function still works correctly

### @radix-ui/react-label (2.1.0 → 2.1.7)
- **Benefits**: Accessibility improvements, bug fixes
- **Risk**: Very low - patch version
- **Test**: Verify form labels work correctly

## Next Steps

After completing this task:
1. Test the application thoroughly to ensure all functionality works
2. Proceed to **TASK-03-design-tokens.md**
3. Consider setting up automated dependency updates for future security patches
4. Document any performance improvements observed
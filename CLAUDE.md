# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Project Architecture

This is a React-based educational platform using Vite as the build tool and Firebase for backend services. The project is undergoing design system modernization while maintaining the React+Vite architecture.

### Key Technologies
- **React 18** with React Router v6 for SPA routing
- **Vite** for fast development and optimized builds
- **Firebase** (Firestore for database, Storage for files)
- **TipTap** for rich text editing
- **React Icons** & **Lucide React** for iconography
- **Tailwind CSS** with custom CSS modules for styling
- **shadcn/ui** components for modern UI patterns
- **Stagewise Toolbar** for development workflow

### Design System Evolution

The project is transitioning from custom CSS to a modern design system approach:

#### Current State
- Custom CSS with CSS variables
- Basic component patterns
- Manual responsive design
- Limited accessibility features

#### Target State (See DESIGN_IMPROVEMENTS.md)
- Tailwind-first utility approach
- shadcn/ui component system
- Consistent design tokens
- Enhanced accessibility (WCAG AA)
- Mobile-first responsive design
- Micro-interactions and animations

### Directory Structure

- `src/` - Main application source
  - `pages/` - Page components with lazy loading pattern
    - Each page has its own folder with index.jsx export pattern
    - CSS files co-located with components
  - `components/` - Reusable UI components
    - `styles/` - Component-specific CSS files (transitioning to Tailwind)
    - `ui/` - Modern shadcn/ui components (when added)
  - `config/` - Configuration files (Firebase setup)
  - `data/` - Static data and JSON files
  - `utils/` - Utility functions
  - `assets/` - Fonts and icons
  - `lib/` - Utility libraries and design system helpers

### Routing Pattern

The app uses React Router with lazy loading for all routes except Home. Routes are defined in `App.jsx` with a consistent pattern:
- Dynamic route parameters for content pages (e.g., `/News/poste/:id`)
- Catch-all route for 404 handling
- Suspense boundaries with loading states

### Firebase Integration

Firebase credentials are stored in environment variables (Vite format):
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

### Component Patterns

#### Current Patterns
- Pages use index.jsx export pattern for cleaner imports
- Lazy loading implemented for performance optimization
- CSS files are imported directly into components
- Consistent naming convention: PascalCase for components, camelCase for files

#### Modern Patterns (In Development)
- Component composition with shadcn/ui
- Tailwind utility classes for styling
- TypeScript-ready component interfaces
- Accessibility-first component design
- Consistent loading and error states

### Styling Architecture

#### Current Approach
```css
/* Custom CSS with variables */
.hero {
    --primary-color: #0CB509;
    /* Component-specific styles */
}
```

#### Target Approach
```jsx
// Tailwind + shadcn/ui components
<Button 
  variant="outline" 
  size="lg"
  className="bg-primary-500 hover:bg-primary-600"
>
```

### Development Tools

- **Stagewise Toolbar**: Development workflow assistance (dev mode only)
- **React Plugin**: Enhanced React development experience
- **ESLint**: Code quality and consistency
- **Tailwind CSS**: Utility-first styling framework

### Performance Considerations

- Lazy loading for route-based code splitting
- Image optimization strategies
- Bundle size monitoring
- Loading state management
- Error boundary implementation

### Accessibility Goals

- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation support
- Focus management
- Color contrast validation
- RTL language support optimization

### Deployment

The project is configured for Vercel deployment with SPA routing support (see `vercel.json`).

---

## Design System Migration Guide

For detailed information about the design system improvements and migration strategy, see:
- `docs/DESIGN_IMPROVEMENTS.md` - Comprehensive design analysis
- `docs/DEVELOPMENT_GUIDE.md` - Updated development patterns
- Component migration guides in `docs/components/`
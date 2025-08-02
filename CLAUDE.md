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

This is a React-based educational platform using Vite as the build tool and Firebase for backend services.

### Key Technologies
- **React 18** with React Router v6 for SPA routing
- **Vite** for fast development and optimized builds
- **Firebase** (Firestore for database, Storage for files)
- **TipTap** for rich text editing
- **React Icons** for iconography
- **CSS modules** for component styling

### Directory Structure

- `src/` - Main application source
  - `pages/` - Page components with lazy loading pattern
    - Each page has its own folder with index.jsx export pattern
    - CSS files co-located with components
  - `components/` - Reusable UI components
    - `styles/` - Component-specific CSS files
  - `config/` - Configuration files (Firebase setup)
  - `data/` - Static data and JSON files
  - `utils/` - Utility functions
  - `assets/` - Fonts and icons

### Routing Pattern

The app uses React Router with lazy loading for all routes except Home. Routes are defined in `App.jsx` with a consistent pattern:
- Dynamic route parameters for content pages (e.g., `/News/poste/:id`)
- Catch-all route for 404 handling

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

- Pages use index.jsx export pattern for cleaner imports
- Lazy loading implemented for performance optimization
- CSS files are imported directly into components
- Consistent naming convention: PascalCase for components, camelCase for files

### Deployment

The project is configured for Vercel deployment with SPA routing support (see `vercel.json`).
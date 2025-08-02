# UNEM Platform Architecture Documentation

## 🏗️ System Overview

The UNEM platform is a React-based educational platform designed to serve Moroccan students with Baccalaureate results, institutional information, and educational resources.

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    UNEM Platform                            │
├─────────────────────────────────────────────────────────────┤
│                   Frontend Layer                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   React     │  │    Vite     │  │  Tailwind   │        │
│  │   18.2.0    │  │   4.4.0     │  │    CSS      │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────┤
│                  Component Layer                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐      │
│  │   UI    │ │ Layout  │ │Business │ │   Pages     │      │
│  │ Radix   │ │ Custom  │ │ Logic   │ │  Lazy       │      │
│  │Lucide   │ │Components│ │Components│ │ Loaded    │      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────────┘      │
├─────────────────────────────────────────────────────────────┤
│                   Routing Layer                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │          React Router v6 + Lazy Loading               ││
│  │   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    ││
│  │   │  Home   │ │ Results │ │  News   │ │ About   │    ││
│  │   └─────────┘ └─────────┘ └─────────┘ └─────────┘    ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                   State Layer                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │           Component State (useState/useEffect)         ││
│  │     [Future: Context API for Global State]            ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                   Backend Layer                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   Firebase                              ││
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   ││
│  │   │  Firestore  │  │   Storage   │  │    Auth     │   ││
│  │   │ Database    │  │    Files    │  │   Future    │   ││
│  │   └─────────────┘  └─────────────┘  └─────────────┘   ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                   Deployment                                │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Vercel                               ││
│  │   ✅ SPA Routing Support                               ││
│  │   ✅ Automatic HTTPS                                   ││
│  │   ✅ Global CDN                                        ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Technology Stack

### Frontend Technologies
| Technology | Version | Purpose | Status |
|------------|---------|---------|---------|
| React | 18.2.0 | UI Framework | ✅ Current |
| Vite | 4.4.0 | Build Tool | ⚠️ Upgrade to 6.0 |
| React Router | 6.14.1 | Client Routing | ✅ Current |
| Tailwind CSS | 3.4.7 | Styling | ✅ Current |
| Lucide React | 0.417.0 | Icons | ✅ Current |
| Radix UI | Various | Accessible Components | ✅ Current |

### Backend & Services
| Service | Purpose | Status |
|---------|---------|---------|
| Firebase Firestore | Database | ✅ Active |
| Firebase Storage | File Storage | ✅ Active |
| Firebase Auth | Authentication | 📝 Future |
| Vercel | Hosting & CDN | ✅ Active |

### Development Tools
| Tool | Version | Purpose |
|------|---------|---------|
| ESLint | 8.44.0 | Code Linting |
| PostCSS | 8.4.40 | CSS Processing |
| Autoprefixer | 10.4.19 | CSS Prefixes |

## 📁 Directory Structure

```
src/
├── components/           # Reusable components
│   ├── ui/              # Base UI components (Button, Input, etc.)
│   ├── styles/          # Component-specific CSS
│   └── magicui/         # Third-party UI components
├── pages/               # Route components (lazy loaded)
│   ├── Home/
│   ├── Bac2025/
│   ├── institutions/
│   └── ...
├── config/              # Configuration files
│   └── firebase.js      # Firebase configuration
├── constants/           # Application constants
├── data/                # Static data files
├── lib/                 # Utility libraries
├── utils/               # Helper functions
└── assets/              # Static assets (fonts, icons)
```

## 🔄 Data Flow

### Current Data Flow Pattern
```
User Interaction → Component State → Firebase API → Component Update → UI Render
```

### Recommended Future Pattern
```
User Interaction → Context/Hook → API Service → State Update → UI Render
                                     ↓
                             Error Boundary Handling
```

## 🎯 Component Architecture

### Current Component Patterns

#### 1. Page Components (Lazy Loaded)
```javascript
// Pattern: pages/Feature/index.jsx
const FeaturePage = lazy(() => import('./Feature'))

// Usage in App.jsx
<Route path="/feature" element={<FeaturePage />} />
```

#### 2. UI Components
```javascript
// Pattern: components/ui/ComponentName.jsx
export default function Button({ variant, children, ...props }) {
  return (
    <button className={`btn btn--${variant}`} {...props}>
      {children}
    </button>
  )
}
```

#### 3. Business Logic Components
```javascript
// Pattern: components/FeatureComponent.jsx
export default function ResultsCard({ result }) {
  const [loading, setLoading] = useState(false)
  
  // Component logic here
  
  return <div>{/* JSX */}</div>
}
```

### Recommended Enhanced Patterns

#### 1. Feature-Based Organization
```
features/
├── bac-results/
│   ├── components/      # Feature components
│   ├── hooks/           # Feature hooks
│   ├── services/        # API services
│   └── types/           # TypeScript types
```

#### 2. Compound Components
```javascript
// Enhanced pattern for complex components
const Card = ({ children }) => <div className="card">{children}</div>
Card.Header = ({ children }) => <header className="card-header">{children}</header>
Card.Body = ({ children }) => <main className="card-body">{children}</main>
Card.Footer = ({ children }) => <footer className="card-footer">{children}</footer>

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

## 🚀 Performance Architecture

### Current Optimizations
- ✅ Lazy loading for routes
- ✅ Image lazy loading
- ✅ CSS code splitting
- ✅ Bundle optimization

### Recommended Enhancements
- 📝 Service Worker for caching
- 📝 Image optimization pipeline
- 📝 Bundle analysis automation
- 📝 Performance monitoring

## 🔐 Security Architecture

### Current Security Measures
- ✅ Firebase security rules
- ✅ HTTPS deployment
- ✅ Environment variable protection

### Recommended Enhancements
- 📝 Content Security Policy
- 📝 Input validation layer
- 📝 Security headers configuration
- 📝 Regular security audits

## 📊 Monitoring & Analytics

### Current Monitoring
- ✅ Basic Vercel analytics
- ✅ Browser dev tools

### Recommended Monitoring Stack
- 📝 Error tracking (Sentry)
- 📝 Performance monitoring (Web Vitals)
- 📝 User analytics (GA4)
- 📝 Real User Monitoring (RUM)

## 🔄 Future Architecture Evolution

### Phase 1: Modernization
- Upgrade to React 18.3.1 + Vite 6.0
- TypeScript migration
- Enhanced state management

### Phase 2: Scalability  
- Feature-based architecture
- Micro-frontend evaluation
- Advanced performance optimization

### Phase 3: Enterprise
- Multi-environment deployment
- Advanced monitoring
- A/B testing framework

## 📋 Architecture Decision Records (ADRs)

### ADR-001: React + Vite Stack
**Decision**: Use React 18 with Vite as build tool
**Status**: ✅ Adopted
**Rationale**: Fast development, excellent performance, modern ecosystem

### ADR-002: Firebase Backend
**Decision**: Use Firebase for backend services
**Status**: ✅ Adopted  
**Rationale**: Rapid development, managed infrastructure, real-time features

### ADR-003: Vercel Deployment
**Decision**: Deploy on Vercel platform
**Status**: ✅ Adopted
**Rationale**: Seamless integration with frontend stack, global CDN

### ADR-004: CSS-in-JS vs Tailwind
**Decision**: Use Tailwind CSS for styling
**Status**: ✅ Adopted
**Rationale**: Rapid development, consistent design system, smaller bundle

---

*This architecture documentation should be updated as the system evolves and new architectural decisions are made.*
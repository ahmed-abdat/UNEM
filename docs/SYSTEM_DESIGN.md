# UNEM Platform System Design

## 🏗️ System Architecture Overview

The UNEM educational platform is a React-based SPA with Firebase backend, designed for high performance and accessibility in educational environments.

### Core Architecture Patterns

```
┌─────────────────────────────────────────────────────────────┐
│                    UNEM Platform Architecture               │
├─────────────────────────────────────────────────────────────┤
│ Presentation Layer (React 18 + Vite)                       │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│ │ Pages/Routes    │ │ UI Components   │ │ Business Logic  │ │
│ │ - Lazy Loading  │ │ - shadcn/ui     │ │ - Hooks         │ │
│ │ - Suspense      │ │ - Custom Forms  │ │ - State Mgmt    │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Data Layer (Firebase)                                       │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│ │ Firestore DB    │ │ Cloud Storage   │ │ Authentication  │ │
│ │ - Documents     │ │ - Images/Files  │ │ - Future impl.  │ │
│ │ - Collections   │ │ - Media Assets  │ │ - User mgmt     │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Infrastructure & Deployment                                 │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│ │ Vercel Hosting  │ │ CDN Distribution│ │ Performance     │ │
│ │ - SPA Routing   │ │ - Edge Caching  │ │ - Bundle Split  │ │
│ │ - Auto Deploy   │ │ - Global Edge   │ │ - Lazy Loading  │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack Specification

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend** | React | 18.3.1 | UI Framework |
| **Build Tool** | Vite | 6.3.5 | Dev Server & Bundler |
| **Routing** | React Router | 6.14.1 | SPA Navigation |
| **Styling** | Tailwind CSS | 3.4.7 | Utility-First CSS |
| **UI Library** | shadcn/ui | Latest | Component System |
| **Icons** | Lucide React | 0.417.0 | Icon Library |
| **Database** | Firestore | 10.0.0 | NoSQL Document DB |
| **Storage** | Firebase Storage | 10.0.0 | File Storage |
| **Deployment** | Vercel | N/A | Hosting Platform |

---

## 🎨 Component Architecture Design

### Component Hierarchy Strategy

```
Component Architecture Pattern
├── 📁 src/components/
│   ├── 📁 ui/                    # Base Design System
│   │   ├── button.jsx           # ✅ Exists
│   │   ├── input.jsx            # ✅ Exists
│   │   ├── label.jsx            # ✅ Exists
│   │   ├── card.jsx             # 🔄 To Add
│   │   ├── modal.jsx            # 🔄 To Add
│   │   └── tooltip.jsx          # 🔄 To Add
│   ├── 📁 forms/                # Form Components
│   │   ├── bac-results-form.jsx # ✅ Exists
│   │   ├── whatsapp-form.jsx    # ✅ Exists
│   │   └── validation.jsx       # ✅ Exists
│   ├── 📁 layout/               # Layout Components
│   │   ├── header.jsx           # ✅ Exists
│   │   ├── footer.jsx           # ✅ Exists
│   │   ├── navigation.jsx       # 🔄 Header Menu
│   │   └── page-wrapper.jsx     # 🔄 To Add
│   ├── 📁 content/              # Content Components
│   │   ├── cards.jsx            # ✅ Exists
│   │   ├── post.jsx             # ✅ Exists
│   │   ├── institutions.jsx     # ✅ Exists
│   │   └── video.jsx            # ✅ Exists
│   └── 📁 feedback/             # User Feedback
│       ├── loading.jsx          # ✅ Exists
│       ├── skeleton.jsx         # ✅ Exists
│       ├── confetti.jsx         # ✅ Exists
│       └── toast.jsx            # 🔄 React Toastify
```

### Modern Component Design Patterns

#### 1. Compound Component Pattern
```jsx
// Example: Card Component with Composition
<Card>
  <Card.Header>
    <Card.Title>News Article</Card.Title>
    <Card.Description>Latest updates</Card.Description>
  </Card.Header>
  <Card.Content>
    <Card.Image src="..." alt="..." />
    <Card.Text>Article content...</Card.Text>
  </Card.Content>
  <Card.Footer>
    <Card.Actions>
      <Button variant="outline">Read More</Button>
      <Button>Share</Button>
    </Card.Actions>
  </Card.Footer>
</Card>
```

#### 2. Render Props Pattern for Data
```jsx
// Example: Data Fetching Component
<DataProvider resource="posts">
  {({ data, loading, error }) => (
    <div>
      {loading && <Skeleton />}
      {error && <ErrorMessage />}
      {data && <PostList posts={data} />}
    </div>
  )}
</DataProvider>
```

#### 3. Custom Hooks for Business Logic
```jsx
// Example: Custom Hook for Posts
function usePostsData() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Firebase integration logic
  
  return { posts, loading, fetchMore, refresh };
}
```

---

## 🔗 API Layer Design

### Firebase Integration Architecture

```
Firebase API Layer Structure
├── 📁 src/api/
│   ├── 📁 collections/         # Firestore Collections
│   │   ├── posts.js           # Posts CRUD operations
│   │   ├── institutions.js    # Institution data
│   │   ├── students.js        # Student records
│   │   └── announcements.js   # News & announcements
│   ├── 📁 storage/            # Firebase Storage
│   │   ├── images.js          # Image upload/download
│   │   ├── documents.js       # Document management
│   │   └── media.js           # Media file handling
│   ├── 📁 auth/               # Authentication (Future)
│   │   ├── login.js           # User authentication
│   │   └── permissions.js     # Role-based access
│   └── 📁 utils/              # API Utilities
│       ├── firebase-config.js # Firebase setup
│       ├── error-handling.js  # Error management
│       └── validation.js      # Data validation
```

### API Design Patterns

#### 1. Repository Pattern Implementation
```javascript
// Example: Posts Repository
class PostsRepository {
  constructor(db) {
    this.db = db;
    this.collection = 'posts';
  }
  
  async getAll(options = {}) {
    const { limit = 10, orderBy = 'createdAt', sort = 'desc' } = options;
    
    try {
      const q = query(
        collection(this.db, this.collection),
        orderBy(orderBy, sort),
        limit(limit)
      );
      
      const snapshot = await getDocs(q);
      return this.transformSnapshot(snapshot);
    } catch (error) {
      throw new ApiError('Failed to fetch posts', error);
    }
  }
  
  async getById(id) {
    try {
      const docRef = doc(this.db, this.collection, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new NotFoundError('Post not found');
      }
      
      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      throw new ApiError('Failed to fetch post', error);
    }
  }
  
  transformSnapshot(snapshot) {
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    }));
  }
}
```

#### 2. Service Layer Pattern
```javascript
// Example: Posts Service
class PostsService {
  constructor() {
    this.repository = new PostsRepository(db);
    this.cache = new Map();
  }
  
  async getFeaturedPosts() {
    const cacheKey = 'featured-posts';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const posts = await this.repository.getAll({
      limit: 5,
      where: [['featured', '==', true]]
    });
    
    this.cache.set(cacheKey, posts);
    setTimeout(() => this.cache.delete(cacheKey), 5 * 60 * 1000); // 5 min cache
    
    return posts;
  }
}
```

#### 3. Error Handling Strategy
```javascript
// Custom Error Classes
class ApiError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = 'ApiError';
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

class NotFoundError extends ApiError {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends ApiError {
  constructor(message, fields = {}) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.fields = fields;
  }
}
```

---

## 🗄️ Database Schema Design

### Firestore Collections Structure

```
UNEM Platform Database Schema
├── 📁 Collections
│   ├── 📄 posts/                    # News & Announcements
│   │   ├── id: string              # Auto-generated ID
│   │   ├── title: string           # Post title
│   │   ├── content: string         # Rich text content
│   │   ├── excerpt: string         # Short description
│   │   ├── author: object          # Author information
│   │   ├── category: string        # news|announcement|event
│   │   ├── tags: array             # Searchable tags
│   │   ├── featured: boolean       # Featured on homepage
│   │   ├── images: array           # Image URLs & metadata
│   │   ├── status: string          # draft|published|archived
│   │   ├── viewCount: number       # Page views
│   │   ├── likes: number           # User engagement
│   │   ├── createdAt: timestamp    # Creation date
│   │   └── updatedAt: timestamp    # Last modified
│   │
│   ├── 📄 institutions/             # Educational Institutions
│   │   ├── id: string              # Institution code
│   │   ├── name: object            # {ar: string, fr: string}
│   │   ├── description: object     # Multilingual description
│   │   ├── type: string            # university|school|institute
│   │   ├── location: object        # City, region, coordinates
│   │   ├── contact: object         # Phone, email, website
│   │   ├── logo: string            # Logo image URL
│   │   ├── images: array           # Gallery images
│   │   ├── programs: array         # Available programs
│   │   ├── requirements: object    # Admission requirements
│   │   ├── ranking: number         # Institution ranking
│   │   ├── featured: boolean       # Featured institution
│   │   ├── status: string          # active|inactive
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   │
│   ├── 📄 students/                 # Student Records (BAC Results)
│   │   ├── id: string              # Auto-generated
│   │   ├── nationalId: string      # Student national ID
│   │   ├── massar: string          # MASSAR code
│   │   ├── firstName: object       # {ar: string, fr: string}
│   │   ├── lastName: object        # Multilingual names
│   │   ├── birthDate: timestamp    # Date of birth
│   │   ├── gender: string          # male|female
│   │   ├── institution: string     # School reference
│   │   ├── branch: string          # Study branch
│   │   ├── examSession: string     # 2024|2025|etc
│   │   ├── results: object         # Grade details
│   │   │   ├── overall: number     # Overall grade
│   │   │   ├── subjects: array     # Subject-wise grades
│   │   │   ├── mention: string     # Grade mention
│   │   │   └── rank: number        # Class rank
│   │   ├── status: string          # passed|failed|pending
│   │   ├── privacy: object         # Privacy settings
│   │   ├── searchable: boolean     # Allow in search
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   │
│   ├── 📄 programs/                 # Academic Programs
│   │   ├── id: string              # Program code
│   │   ├── name: object            # Multilingual name
│   │   ├── description: object     # Detailed description
│   │   ├── institution: string     # Institution reference
│   │   ├── faculty: string         # Faculty/department
│   │   ├── level: string           # bachelor|master|phd
│   │   ├── duration: number        # Years of study
│   │   ├── language: string        # ar|fr|en
│   │   ├── requirements: object    # Admission criteria
│   │   ├── curriculum: array       # Course structure
│   │   ├── career: array           # Career opportunities
│   │   ├── tuition: object         # Fee structure
│   │   ├── capacity: number        # Student capacity
│   │   ├── enrollment: number      # Current enrollment
│   │   ├── rating: number          # Program rating
│   │   ├── featured: boolean       # Featured program
│   │   ├── status: string          # active|inactive
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   │
│   └── 📄 analytics/                # Usage Analytics (Future)
│       ├── id: string              # Session/event ID
│       ├── eventType: string       # page_view|search|click
│       ├── page: string            # Page identifier
│       ├── userId: string          # Anonymous user ID
│       ├── sessionId: string       # Session identifier
│       ├── metadata: object        # Event-specific data
│       ├── userAgent: string       # Browser information
│       ├── location: object        # Geographic data
│       ├── referrer: string        # Traffic source
│       └── timestamp: timestamp    # Event time
```

### Database Optimization Strategies

#### 1. Indexing Strategy
```javascript
// Firestore Composite Indexes (firebase.json)
{
  "firestore": {
    "indexes": [
      {
        "collectionGroup": "posts",
        "queryScope": "COLLECTION",
        "fields": [
          {"fieldPath": "status", "order": "ASCENDING"},
          {"fieldPath": "featured", "order": "DESCENDING"},
          {"fieldPath": "createdAt", "order": "DESCENDING"}
        ]
      },
      {
        "collectionGroup": "students",
        "queryScope": "COLLECTION", 
        "fields": [
          {"fieldPath": "examSession", "order": "ASCENDING"},
          {"fieldPath": "searchable", "order": "ASCENDING"},
          {"fieldPath": "lastName.ar", "order": "ASCENDING"}
        ]
      }
    ]
  }
}
```

#### 2. Data Denormalization
```javascript
// Optimized document structure for read performance
const PostDocument = {
  id: "post_123",
  title: "Important Announcement",
  content: "...",
  
  // Denormalized author data for faster reads
  author: {
    id: "author_456",
    name: "Admin User",
    avatar: "https://...",
    role: "administrator"
  },
  
  // Denormalized institution data
  institution: {
    id: "inst_789",
    name: "Université Hassan II",
    logo: "https://..."
  },
  
  // Aggregated metrics
  metrics: {
    views: 1250,
    likes: 89,
    shares: 23,
    comments: 15
  }
};
```

---

## 🔒 Security & Performance Design

### Security Architecture

#### 1. Firebase Security Rules
```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for posts
    match /posts/{postId} {
      allow read: if resource.data.status == 'published';
      allow write: if request.auth != null && 
                      request.auth.token.role == 'admin';
    }
    
    // Protected student data
    match /students/{studentId} {
      allow read: if resource.data.searchable == true &&
                     resource.data.privacy.public == true;
      allow write: if request.auth != null && 
                      request.auth.token.role in ['admin', 'moderator'];
    }
    
    // Public read for institutions
    match /institutions/{institutionId} {
      allow read: if resource.data.status == 'active';
      allow write: if request.auth != null && 
                      request.auth.token.role == 'admin';
    }
  }
}
```

#### 2. Client-Side Security
```javascript
// Input validation and sanitization
import { z } from 'zod';

const StudentSearchSchema = z.object({
  massar: z.string().regex(/^\d{10}$/, 'Invalid MASSAR format'),
  nationalId: z.string().regex(/^[A-Z]{2}\d{6}$/, 'Invalid ID format'),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50)
});

// XSS Protection
function sanitizeInput(input) {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
```

### Performance Optimization

#### 1. Bundle Optimization
```javascript
// Vite configuration for optimal bundling
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/firestore'],
          ui: ['@radix-ui/react-slot', 'lucide-react'],
          utils: ['moment', 'react-router-dom']
        }
      }
    },
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
```

#### 2. Image Optimization
```javascript
// Image loading strategy
const OptimizedImage = ({ src, alt, ...props }) => {
  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      loading="lazy"
      placeholder={<Skeleton className="w-full h-48" />}
      effect="blur"
      {...props}
    />
  );
};
```

#### 3. Data Caching Strategy
```javascript
// Service Worker caching (future implementation)
const cacheStrategy = {
  static: 'cache-first',    // CSS, JS, images
  api: 'network-first',     // Firebase data
  images: 'cache-first',    // User-uploaded content
  ttl: {
    static: '1y',
    api: '5m',
    images: '30d'
  }
};
```

---

## 📱 Responsive Design Architecture

### Breakpoint Strategy
```css
/* Tailwind CSS Breakpoints */
/* Mobile First Approach */
.container {
  @apply px-4;           /* Default: Mobile (320px+) */
  
  @screen sm {           /* Small: 640px+ */
    @apply px-6;
  }
  
  @screen md {           /* Medium: 768px+ */
    @apply px-8;
  }
  
  @screen lg {           /* Large: 1024px+ */
    @apply px-12;
  }
  
  @screen xl {           /* Extra Large: 1280px+ */
    @apply px-16;
  }
  
  @screen 2xl {          /* 2X Large: 1536px+ */
    @apply px-20;
  }
}
```

### Component Responsiveness
```jsx
// Responsive component example
const ResponsiveCard = ({ post }) => {
  return (
    <Card className="
      w-full 
      sm:w-1/2 
      lg:w-1/3 
      xl:w-1/4
      p-4 
      sm:p-6 
      lg:p-8
    ">
      <Card.Image 
        className="
          h-48 
          sm:h-56 
          lg:h-64
          object-cover
          rounded-lg
        "
        src={post.image}
        alt={post.title}
      />
      <Card.Content className="
        space-y-2 
        sm:space-y-3 
        lg:space-y-4
      ">
        <Card.Title className="
          text-lg 
          sm:text-xl 
          lg:text-2xl
          font-bold
        ">
          {post.title}
        </Card.Title>
        <Card.Description className="
          text-sm 
          sm:text-base
          text-gray-600
          line-clamp-3
        ">
          {post.excerpt}
        </Card.Description>
      </Card.Content>
    </Card>
  );
};
```

---

## 🌐 Internationalization Design

### Multi-language Architecture
```javascript
// Language detection and management
const useLanguage = () => {
  const [language, setLanguage] = useState('ar'); // Default Arabic
  
  useEffect(() => {
    const savedLang = localStorage.getItem('preferred-language');
    const browserLang = navigator.language.split('-')[0];
    
    if (savedLang && ['ar', 'fr', 'en'].includes(savedLang)) {
      setLanguage(savedLang);
    } else if (['ar', 'fr', 'en'].includes(browserLang)) {
      setLanguage(browserLang);
    }
  }, []);
  
  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('preferred-language', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };
  
  return { language, changeLanguage };
};
```

### RTL/LTR Support
```css
/* RTL-aware styling */
.navigation {
  @apply flex items-center space-x-4;
  
  [dir="rtl"] & {
    @apply space-x-reverse;
  }
}

.card-content {
  @apply text-left;
  
  [dir="rtl"] & {
    @apply text-right;
  }
}
```

---

This comprehensive system design provides a solid foundation for the UNEM platform's continued development and scaling. Each section includes practical implementation details and follows modern web development best practices.
# UNEM Platform Database Design

## 🗄️ Database Architecture Overview

The UNEM platform uses Firebase Firestore as its primary database, providing a NoSQL document-based architecture optimized for real-time web applications and educational data management.

### Database Design Principles

- **📄 Document-Oriented**: Flexible schema for educational content
- **🔥 Real-time Sync**: Live updates for posts and announcements  
- **📱 Offline-First**: Local caching and sync capabilities
- **🔍 Queryable**: Efficient indexing for search and filtering
- **🌐 Scalable**: Auto-scaling serverless architecture
- **🔒 Secure**: Rule-based access control and data privacy

---

## 🏗️ Collection Architecture

```
UNEM Firestore Database Structure
├── 📁 posts/                     # News & Announcements
├── 📁 institutions/              # Educational Institutions  
├── 📁 students/                  # Student Records (BAC Results)
├── 📁 programs/                  # Academic Programs
├── 📁 branches/                  # Study Branches
├── 📁 schedules/                 # Class Schedules
├── 📁 analytics/                 # Usage Analytics
├── 📁 media/                     # Media Metadata
├── 📁 notifications/             # Push Notifications
└── 📁 config/                    # System Configuration
```

---

## 📋 Collection Schemas

### Posts Collection

```javascript
// Collection: posts
{
  id: string,                     // Auto-generated document ID
  
  // Content
  title: string,                  // Post title (required)
  content: string,                // Rich text content (HTML)
  excerpt: string,                // Short description (max 300 chars)
  slug: string,                   // URL-friendly identifier
  
  // Metadata
  category: string,               // "news" | "announcement" | "event" | "academic"
  tags: string[],                 // Searchable tags
  language: string,               // "ar" | "fr" | "en"
  
  // Media
  images: {
    featured?: {
      url: string,
      alt: string,
      caption?: string,
      width?: number,
      height?: number
    },
    gallery?: Array<{
      url: string,
      alt: string,
      caption?: string,
      width?: number,
      height?: number
    }>
  },
  
  // Author
  author: {
    id: string,                   // Author ID
    name: string,                 // Display name
    role: string,                 // "admin" | "editor" | "contributor"
    avatar?: string               // Profile image URL
  },
  
  // Status & Visibility
  status: string,                 // "draft" | "published" | "archived" | "scheduled"
  featured: boolean,              // Show on homepage
  pinned: boolean,                // Pin to top of category
  visibility: string,             // "public" | "private" | "members"
  
  // Publishing
  publishedAt?: Timestamp,        // Publication date
  scheduledFor?: Timestamp,       // Scheduled publication
  expiresAt?: Timestamp,          // Auto-archive date
  
  // Engagement
  metrics: {
    views: number,                // Page views
    likes: number,                // User likes
    shares: number,               // Social shares
    comments: number,             // Comment count
    downloads?: number            // File downloads
  },
  
  // SEO
  seo?: {
    metaTitle?: string,           // Meta title (max 60 chars)
    metaDescription?: string,     // Meta description (max 160 chars)
    keywords?: string[],          // SEO keywords
    ogImage?: string              // Open Graph image
  },
  
  // Related Content
  relatedPosts?: string[],        // Related post IDs
  institutionId?: string,         // Related institution
  programId?: string,             // Related program
  
  // Timestamps
  createdAt: Timestamp,           // Creation date
  updatedAt: Timestamp,           // Last modification
  createdBy: string,              // Creator user ID
  updatedBy: string               // Last editor user ID
}
```

### Institutions Collection

```javascript
// Collection: institutions  
{
  id: string,                     // Institution code (e.g., "uh2c", "fst")
  
  // Basic Information
  name: {
    ar: string,                   // Arabic name
    fr: string,                   // French name
    en?: string                   // English name (optional)
  },
  
  description: {
    ar: string,                   // Arabic description
    fr: string,                   // French description  
    en?: string                   // English description (optional)
  },
  
  // Institution Details
  type: string,                   // "university" | "school" | "institute" | "academy"
  category: string,               // "public" | "private" | "semi-public"
  level: string[],                // ["bachelor", "master", "phd", "diploma"]
  
  // Location
  location: {
    city: {
      ar: string,
      fr: string
    },
    region: {
      ar: string, 
      fr: string
    },
    address?: {
      ar?: string,
      fr?: string
    },
    coordinates?: {
      latitude: number,
      longitude: number
    },
    campus?: string[]             // Multiple campus locations
  },
  
  // Contact Information
  contact: {
    phone?: string[],             // Phone numbers
    email?: string[],             // Email addresses
    website?: string,             // Official website
    socialMedia?: {
      facebook?: string,
      twitter?: string,
      linkedin?: string,
      instagram?: string,
      youtube?: string
    }
  },
  
  // Media
  media: {
    logo: string,                 // Institution logo URL
    images?: string[],            // Gallery images
    videos?: Array<{
      url: string,
      title: string,
      type: "intro" | "campus" | "programs"
    }>
  },
  
  // Academic Information
  programs: string[],             // Program IDs offered
  faculties: Array<{
    id: string,
    name: {
      ar: string,
      fr: string
    },
    programs: string[]            // Program IDs in this faculty
  }>,
  
  // Admission
  admission: {
    requirements: {
      ar: string,
      fr: string
    },
    deadlines?: {
      bachelor?: string,          // ISO date string
      master?: string,
      phd?: string
    },
    fees?: {
      bachelor?: {
        min: number,
        max: number,
        currency: "MAD"
      },
      master?: {
        min: number,
        max: number, 
        currency: "MAD"
      }
    }
  },
  
  // Statistics
  stats: {
    ranking?: number,             // National ranking
    students?: number,            // Total student count
    faculty?: number,             // Faculty member count
    establishedYear?: number,     // Year established
    accreditation?: string[]      // Accreditation bodies
  },
  
  // Features & Facilities
  facilities?: string[],          // Available facilities
  services?: string[],            // Student services
  
  // Status & Visibility
  status: string,                 // "active" | "inactive" | "pending"
  featured: boolean,              // Show prominently
  verified: boolean,              // Official verification status
  
  // Timestamps
  createdAt: Timestamp,
  updatedAt: Timestamp,
  createdBy: string,
  updatedBy: string
}
```

### Students Collection

```javascript
// Collection: students
{
  id: string,                     // Auto-generated document ID
  
  // Student Identity
  nationalId: string,             // National ID (unique, indexed)
  massar: string,                 // MASSAR code (unique, indexed)
  
  // Personal Information
  firstName: {
    ar: string,                   // Arabic first name
    fr: string                    // French/Latin first name
  },
  lastName: {
    ar: string,                   // Arabic last name  
    fr: string                    // French/Latin last name
  },
  
  // Demographics
  birthDate: Timestamp,           // Date of birth
  gender: string,                 // "male" | "female"
  birthPlace?: {
    city: string,
    region: string
  },
  
  // Academic Information
  institution: {
    id: string,                   // Institution ID
    name: string,                 // Institution name (cached)
    type: string                  // Institution type (cached)
  },
  
  branch: {
    id: string,                   // Branch ID
    name: {
      ar: string,
      fr: string
    },
    category: string              // "sciences" | "literature" | "economics" | etc.
  },
  
  // Exam Session
  examSession: string,            // "2024" | "2025" | etc.
  examType: string,               // "regular" | "catch-up" | "improvement"
  
  // Results
  results: {
    overall: number,              // Overall grade (0-20)
    mention: string,              // "excellent" | "very_good" | "good" | "fair" | "poor"
    rank?: number,                // Class rank (if available)
    
    // Subject Details
    subjects: Array<{
      code: string,               // Subject code
      name: {
        ar: string,
        fr: string
      },
      grade: number,              // Subject grade (0-20)
      coefficient: number,        // Subject coefficient
      category: string            // "core" | "optional" | "specialty"
    }>,
    
    // Additional Metrics
    average: number,              // Weighted average
    total: number,                // Total points
    maxTotal: number,             // Maximum possible points
    percentage: number            // Success percentage
  },
  
  // Status
  status: string,                 // "passed" | "failed" | "pending" | "absent"
  certificateIssued: boolean,     // Certificate delivery status
  
  // Privacy Settings
  privacy: {
    public: boolean,              // Show in public searches
    showGrades: boolean,          // Display detailed grades
    showRank: boolean,            // Display class ranking
    showInstitution: boolean,     // Display school information
    contactAllowed: boolean       // Allow contact from institutions
  },
  
  // Search & Discovery
  searchable: boolean,            // Include in search results
  searchTerms?: string[],         // Pre-computed search terms
  
  // Contact (if privacy allows)
  contact?: {
    email?: string,
    phone?: string,
    parentPhone?: string
  },
  
  // Verification
  verified: boolean,              // Data verification status
  verificationSource?: string,    // Verification method
  
  // Timestamps
  createdAt: Timestamp,
  updatedAt: Timestamp,
  lastSearched?: Timestamp,       // Last time searched
  lastViewed?: Timestamp          // Last time profile viewed
}
```

### Programs Collection

```javascript
// Collection: programs
{
  id: string,                     // Program code (e.g., "info-uh2c", "med-fmp")
  
  // Program Identity
  name: {
    ar: string,                   // Arabic program name
    fr: string,                   // French program name
    en?: string                   // English program name (optional)
  },
  
  description: {
    ar: string,                   // Detailed description in Arabic
    fr: string,                   // Detailed description in French
    en?: string                   // Detailed description in English
  },
  
  // Academic Structure
  level: string,                  // "bachelor" | "master" | "phd" | "diploma" | "certificate"
  duration: {
    years: number,                // Duration in years
    semesters: number,            // Total semesters
    credits?: number              // Total ECTS credits
  },
  
  // Institution & Faculty
  institution: {
    id: string,                   // Institution ID
    name: {
      ar: string,
      fr: string
    }
  },
  
  faculty: {
    id: string,                   // Faculty/Department ID
    name: {
      ar: string,
      fr: string
    }
  },
  
  // Program Details
  category: string,               // "engineering" | "medicine" | "business" | "arts" | etc.
  specialty?: string,             // Program specialty/major
  language: string[],             // ["ar", "fr", "en"] - Languages of instruction
  
  // Admission Requirements
  admission: {
    requirements: {
      ar: string,                 // Admission requirements in Arabic
      fr: string                  // Admission requirements in French
    },
    
    // BAC Requirements
    bacRequirements: {
      branches: string[],         // Required BAC branches
      minGrade?: number,          // Minimum BAC grade
      subjects?: Array<{
        name: string,
        minGrade?: number
      }>
    },
    
    // Additional Requirements
    additionalTests?: Array<{
      type: string,               // "entrance_exam" | "interview" | "portfolio"
      description: {
        ar: string,
        fr: string
      }
    }>,
    
    // Capacity
    capacity?: number,            // Maximum student capacity
    currentEnrollment?: number    // Current enrollment
  },
  
  // Curriculum
  curriculum: {
    overview: {
      ar: string,
      fr: string
    },
    
    semesters?: Array<{
      number: number,
      courses: Array<{
        code: string,
        name: {
          ar: string,
          fr: string
        },
        credits: number,
        type: "core" | "elective" | "project"
      }>
    }>,
    
    // Skills & Competencies
    skills?: {
      ar: string[],
      fr: string[]
    }
  },
  
  // Career Prospects
  career: {
    overview: {
      ar: string,
      fr: string
    },
    
    opportunities: Array<{
      title: {
        ar: string,
        fr: string
      },
      description?: {
        ar: string,
        fr: string
      },
      sector: string              // "public" | "private" | "freelance"
    }>,
    
    // Employment Statistics
    employmentStats?: {
      rate?: number,              // Employment rate percentage
      averageSalary?: {
        min: number,
        max: number,
        currency: "MAD"
      },
      topEmployers?: string[]     // Major employer names
    }
  },
  
  // Fees & Costs
  fees?: {
    tuition?: {
      annual: number,
      total: number,
      currency: "MAD"
    },
    registration?: number,
    other?: Array<{
      name: string,
      amount: number,
      required: boolean
    }>
  },
  
  // Program Quality
  accreditation?: string[],       // Accreditation bodies
  ranking?: number,               // Program ranking
  rating?: number,                // User rating (1-5)
  
  // Media & Resources
  media?: {
    images?: string[],            // Program-related images
    brochure?: string,            // PDF brochure URL
    video?: string                // Introduction video URL
  },
  
  // Status & Visibility
  status: string,                 // "active" | "inactive" | "suspended"
  featured: boolean,              // Featured program
  popular: boolean,               // Popular/in-demand program
  
  // Timestamps
  createdAt: Timestamp,
  updatedAt: Timestamp,
  createdBy: string,
  updatedBy: string
}
```

### Analytics Collection

```javascript
// Collection: analytics
{
  id: string,                     // Auto-generated event ID
  
  // Event Information
  eventType: string,              // "page_view" | "search" | "click" | "download" | "share"
  page: string,                   // Page identifier or URL
  action?: string,                // Specific action taken
  
  // User Context
  sessionId: string,              // Anonymous session ID
  userId?: string,                // User ID (if authenticated)
  userAgent: string,              // Browser user agent
  
  // Location & Device
  location?: {
    country?: string,
    city?: string,
    ip?: string                   // Hashed IP for privacy
  },
  
  device?: {
    type: string,                 // "mobile" | "tablet" | "desktop"
    os?: string,                  // Operating system
    browser?: string              // Browser name
  },
  
  // Event Data
  metadata?: {
    searchQuery?: string,         // For search events
    resultCount?: number,         // Search result count
    clickedResult?: string,       // Clicked result ID
    downloadFile?: string,        // Downloaded file name
    shareType?: string,           // Social share type
    referrer?: string,            // Referring page
    duration?: number             // Time spent (seconds)
  },
  
  // Performance
  performance?: {
    loadTime?: number,            // Page load time (ms)
    renderTime?: number,          // Content render time (ms)
    apiResponseTime?: number      // API response time (ms)
  },
  
  // Timestamp
  timestamp: Timestamp,           // Event occurrence time
  
  // Privacy
  anonymized: boolean             // Data anonymization flag
}
```

---

## 🔍 Database Indexing Strategy

### Composite Indexes

```javascript
// Firestore Index Configuration (firebase.json)
{
  "firestore": {
    "indexes": [
      // Posts - Most Common Queries
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
        "collectionGroup": "posts",
        "queryScope": "COLLECTION",
        "fields": [
          {"fieldPath": "status", "order": "ASCENDING"},
          {"fieldPath": "category", "order": "ASCENDING"},
          {"fieldPath": "publishedAt", "order": "DESCENDING"}
        ]
      },
      {
        "collectionGroup": "posts",
        "queryScope": "COLLECTION", 
        "fields": [
          {"fieldPath": "tags", "arrayConfig": "CONTAINS"},
          {"fieldPath": "status", "order": "ASCENDING"},
          {"fieldPath": "createdAt", "order": "DESCENDING"}
        ]
      },
      
      // Students - Search Optimizations
      {
        "collectionGroup": "students",
        "queryScope": "COLLECTION",
        "fields": [
          {"fieldPath": "examSession", "order": "ASCENDING"},
          {"fieldPath": "searchable", "order": "ASCENDING"},
          {"fieldPath": "lastName.ar", "order": "ASCENDING"}
        ]
      },
      {
        "collectionGroup": "students", 
        "queryScope": "COLLECTION",
        "fields": [
          {"fieldPath": "examSession", "order": "ASCENDING"},
          {"fieldPath": "status", "order": "ASCENDING"},
          {"fieldPath": "results.overall", "order": "DESCENDING"}
        ]
      },
      {
        "collectionGroup": "students",
        "queryScope": "COLLECTION",
        "fields": [
          {"fieldPath": "institution.id", "order": "ASCENDING"},
          {"fieldPath": "examSession", "order": "ASCENDING"},
          {"fieldPath": "results.overall", "order": "DESCENDING"}
        ]
      },
      
      // Institutions - Discovery & Filtering
      {
        "collectionGroup": "institutions",
        "queryScope": "COLLECTION",
        "fields": [
          {"fieldPath": "status", "order": "ASCENDING"},
          {"fieldPath": "type", "order": "ASCENDING"},
          {"fieldPath": "featured", "order": "DESCENDING"}
        ]
      },
      {
        "collectionGroup": "institutions",
        "queryScope": "COLLECTION", 
        "fields": [
          {"fieldPath": "location.region.ar", "order": "ASCENDING"},
          {"fieldPath": "type", "order": "ASCENDING"},
          {"fieldPath": "stats.ranking", "order": "ASCENDING"}
        ]
      },
      
      // Programs - Academic Search
      {
        "collectionGroup": "programs",
        "queryScope": "COLLECTION",
        "fields": [
          {"fieldPath": "status", "order": "ASCENDING"},
          {"fieldPath": "level", "order": "ASCENDING"},
          {"fieldPath": "category", "order": "ASCENDING"}
        ]
      },
      {
        "collectionGroup": "programs",
        "queryScope": "COLLECTION",
        "fields": [
          {"fieldPath": "institution.id", "order": "ASCENDING"},
          {"fieldPath": "level", "order": "ASCENDING"},
          {"fieldPath": "featured", "order": "DESCENDING"}
        ]
      },
      
      // Analytics - Reporting
      {
        "collectionGroup": "analytics",
        "queryScope": "COLLECTION",
        "fields": [
          {"fieldPath": "eventType", "order": "ASCENDING"},
          {"fieldPath": "timestamp", "order": "DESCENDING"}
        ]
      },
      {
        "collectionGroup": "analytics",
        "queryScope": "COLLECTION",
        "fields": [
          {"fieldPath": "page", "order": "ASCENDING"},
          {"fieldPath": "timestamp", "order": "DESCENDING"}
        ]
      }
    ]
  }
}
```

### Single Field Indexes

```javascript
// Automatic single-field indexes for common queries
const singleFieldIndexes = [
  // Posts
  "posts.status",
  "posts.featured", 
  "posts.category",
  "posts.tags",
  "posts.author.id",
  "posts.createdAt",
  "posts.publishedAt",
  
  // Students
  "students.massar",              // Unique search
  "students.nationalId",          // Unique search
  "students.examSession",
  "students.status",
  "students.searchable",
  "students.privacy.public",
  
  // Institutions
  "institutions.status",
  "institutions.type",
  "institutions.featured",
  "institutions.location.city.ar",
  
  // Programs
  "programs.status", 
  "programs.level",
  "programs.category",
  "programs.institution.id",
  "programs.featured",
  
  // Analytics
  "analytics.eventType",
  "analytics.page",
  "analytics.sessionId",
  "analytics.timestamp"
];
```

---

## 🔒 Security Rules

### Firestore Security Rules

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Posts - Public read, authenticated write
    match /posts/{postId} {
      allow read: if resource.data.status == 'published' && 
                     resource.data.visibility == 'public';
      
      allow write: if request.auth != null && 
                      request.auth.token.role in ['admin', 'editor'];
      
      allow create: if request.auth != null && 
                       request.auth.token.role in ['admin', 'editor'] &&
                       request.resource.data.author.id == request.auth.uid;
    }
    
    // Students - Privacy-controlled read
    match /students/{studentId} {
      allow read: if resource.data.searchable == true &&
                     resource.data.privacy.public == true;
      
      // Students can read their own data
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
      
      allow write: if request.auth != null && 
                      request.auth.token.role in ['admin', 'moderator'];
    }
    
    // Institutions - Public read, admin write
    match /institutions/{institutionId} {
      allow read: if resource.data.status == 'active';
      
      allow write: if request.auth != null && 
                      request.auth.token.role == 'admin';
    }
    
    // Programs - Public read, admin write
    match /programs/{programId} {
      allow read: if resource.data.status == 'active';
      
      allow write: if request.auth != null && 
                      request.auth.token.role in ['admin', 'editor'];
    }
    
    // Analytics - Write only for tracking
    match /analytics/{eventId} {
      allow create: if true; // Allow anonymous analytics
      allow read: if request.auth != null && 
                     request.auth.token.role == 'admin';
    }
    
    // Helper functions
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.role == 'admin';
    }
    
    function isEditor() {
      return request.auth != null && 
             request.auth.token.role in ['admin', 'editor'];
    }
    
    function isPublicContent(data) {
      return data.status == 'published' && 
             data.visibility == 'public';
    }
  }
}
```

---

## 📊 Data Relationships & References

### Relationship Patterns

```javascript
// 1. Embedded Relationships (for frequently accessed data)
const postWithEmbeddedAuthor = {
  id: "post_123",
  title: "Important Announcement",
  
  // Embedded author data for performance
  author: {
    id: "author_456",
    name: "Admin User", 
    role: "admin",
    avatar: "https://..."
  },
  
  // Embedded institution data
  institution: {
    id: "uh2c",
    name: "Université Hassan II Casablanca"
  }
};

// 2. Reference Relationships (for normalization)
const programWithReferences = {
  id: "info-uh2c",
  name: { ar: "الإعلاميات", fr: "Informatique" },
  
  // References to other collections
  institutionId: "uh2c",           // Reference to institutions collection
  facultyId: "fst-uh2c",           // Reference to faculties subcollection
  relatedPrograms: ["math-uh2c", "physics-uh2c"] // Array of program IDs
};

// 3. Subcollections (for hierarchical data)
const institutionWithSubcollections = {
  // Main institution document
  "institutions/uh2c": {
    name: { ar: "جامعة الحسن الثاني", fr: "Université Hassan II" },
    type: "university"
  },
  
  // Subcollections
  "institutions/uh2c/faculties/fst": {
    name: { ar: "كلية العلوم والتقنيات", fr: "Faculté des Sciences et Techniques" }
  },
  
  "institutions/uh2c/programs/informatique": {
    name: { ar: "الإعلاميات", fr: "Informatique" },
    faculty: "fst"
  }
};
```

### Data Consistency Patterns

```javascript
// Batch write operations for consistency
import { writeBatch, doc } from 'firebase/firestore';

async function updateInstitutionName(institutionId, newName) {
  const batch = writeBatch(db);
  
  // Update main institution document
  const institutionRef = doc(db, 'institutions', institutionId);
  batch.update(institutionRef, { name: newName });
  
  // Update all programs that reference this institution
  const programsQuery = query(
    collection(db, 'programs'),
    where('institution.id', '==', institutionId)
  );
  
  const programsSnapshot = await getDocs(programsQuery);
  programsSnapshot.forEach((programDoc) => {
    batch.update(programDoc.ref, {
      'institution.name': newName
    });
  });
  
  // Update all posts that reference this institution
  const postsQuery = query(
    collection(db, 'posts'),
    where('institutionId', '==', institutionId)
  );
  
  const postsSnapshot = await getDocs(postsQuery);
  postsSnapshot.forEach((postDoc) => {
    batch.update(postDoc.ref, {
      'institution.name': newName
    });
  });
  
  // Commit all updates atomically
  await batch.commit();
}
```

---

## 🔄 Data Migration & Versioning

### Schema Evolution Strategy

```javascript
// Schema versioning for graceful migrations
const documentSchemaVersions = {
  posts: {
    v1: {
      // Original schema
      title: "string",
      content: "string",
      createdAt: "timestamp"
    },
    
    v2: {
      // Added SEO fields
      title: "string",
      content: "string", 
      seo: {
        metaTitle: "string",
        metaDescription: "string"
      },
      createdAt: "timestamp",
      schemaVersion: 2
    },
    
    v3: {
      // Added multilingual support
      title: "string",
      content: "string",
      language: "string",
      seo: {
        metaTitle: "string",
        metaDescription: "string"
      },
      createdAt: "timestamp",
      schemaVersion: 3
    }
  }
};

// Migration functions
async function migratePostsToV3() {
  const postsRef = collection(db, 'posts');
  const query = query(postsRef, where('schemaVersion', '<', 3));
  const snapshot = await getDocs(query);
  
  const batch = writeBatch(db);
  
  snapshot.forEach((doc) => {
    const data = doc.data();
    
    // Apply migrations based on current version
    if (!data.schemaVersion || data.schemaVersion < 2) {
      // Migrate to v2 - add SEO fields
      data.seo = {
        metaTitle: data.title.substring(0, 60),
        metaDescription: data.excerpt || data.content.substring(0, 160)
      };
    }
    
    if (data.schemaVersion < 3) {
      // Migrate to v3 - add language detection
      data.language = detectLanguage(data.content) || 'ar';
    }
    
    data.schemaVersion = 3;
    data.migratedAt = serverTimestamp();
    
    batch.update(doc.ref, data);
  });
  
  await batch.commit();
}
```

---

## 📈 Performance Optimization

### Query Optimization Patterns

```javascript
// 1. Pagination with cursors (better than offset)
async function getPaginatedPosts(lastDocument = null, limitCount = 10) {
  let q = query(
    collection(db, 'posts'),
    where('status', '==', 'published'),
    orderBy('publishedAt', 'desc'),
    limit(limitCount)
  );
  
  if (lastDocument) {
    q = query(q, startAfter(lastDocument));
  }
  
  const snapshot = await getDocs(q);
  
  return {
    posts: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    lastDocument: snapshot.docs[snapshot.docs.length - 1],
    hasMore: snapshot.docs.length === limitCount
  };
}

// 2. Denormalization for read performance
const optimizedPostDocument = {
  id: "post_123",
  title: "Important Announcement",
  content: "...",
  
  // Denormalized author data (avoid joins)
  author: {
    id: "author_456",
    name: "Admin User",
    avatar: "https://...",
    role: "admin"
  },
  
  // Denormalized institution data
  institution: {
    id: "uh2c", 
    name: "Université Hassan II",
    logo: "https://..."
  },
  
  // Pre-computed metrics
  metrics: {
    views: 1250,
    likes: 89,
    estimatedReadTime: 5 // minutes
  },
  
  // Search-optimized fields
  searchTerms: ["announcement", "important", "university"],
  searchText: "important announcement université hassan"
};

// 3. Aggregated collections for analytics
const dailyAnalytics = {
  date: "2024-03-15",
  
  // Pre-aggregated metrics
  pageViews: 5420,
  uniqueVisitors: 2150,
  searchQueries: 890,
  
  // Top content
  topPosts: [
    { id: "post_123", views: 450, title: "..." },
    { id: "post_456", views: 320, title: "..." }
  ],
  
  // Popular searches
  topSearches: [
    { query: "نتائج البكالوريا", count: 156 },
    { query: "université hassan ii", count: 89 }
  ]
};
```

### Caching Strategy

```javascript
// Multi-level caching implementation
class DatabaseCache {
  constructor() {
    this.memoryCache = new Map();
    this.indexedDBCache = new Map(); // For persistent caching
  }
  
  async get(collection, id) {
    // 1. Check memory cache
    const memoryKey = `${collection}:${id}`;
    if (this.memoryCache.has(memoryKey)) {
      return this.memoryCache.get(memoryKey);
    }
    
    // 2. Check IndexedDB cache
    const cachedData = await this.getFromIndexedDB(memoryKey);
    if (cachedData && !this.isExpired(cachedData)) {
      this.memoryCache.set(memoryKey, cachedData.data);
      return cachedData.data;
    }
    
    // 3. Fetch from Firestore
    const doc = await getDoc(doc(db, collection, id));
    if (doc.exists()) {
      const data = { id: doc.id, ...doc.data() };
      
      // Cache in both levels
      this.memoryCache.set(memoryKey, data);
      await this.saveToIndexedDB(memoryKey, data, Date.now() + (5 * 60 * 1000)); // 5 min TTL
      
      return data;
    }
    
    return null;
  }
  
  invalidate(collection, id = null) {
    if (id) {
      const key = `${collection}:${id}`;
      this.memoryCache.delete(key);
      this.removeFromIndexedDB(key);
    } else {
      // Invalidate entire collection
      for (const key of this.memoryCache.keys()) {
        if (key.startsWith(`${collection}:`)) {
          this.memoryCache.delete(key);
          this.removeFromIndexedDB(key);
        }
      }
    }
  }
}
```

---

This comprehensive database design provides a solid foundation for the UNEM platform's data architecture, ensuring scalability, performance, and data integrity while supporting the platform's educational mission.
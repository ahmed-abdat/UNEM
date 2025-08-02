# UNEM Platform API Design Specification

## 🚀 API Architecture Overview

The UNEM platform uses a modern Firebase-based API architecture with client-side SDKs, providing real-time data synchronization and offline capabilities.

### API Design Principles

- **🔥 Firebase-First**: Leverage Firestore's real-time capabilities
- **📱 Mobile-Optimized**: Efficient data transfer for mobile users
- **🌐 Offline-Ready**: Local caching and sync capabilities
- **🔒 Security-First**: Rule-based access control
- **⚡ Performance**: Optimized queries and pagination
- **🌍 Scalable**: Auto-scaling serverless architecture

---

## 🏗️ API Layer Architecture

```
API Layer Structure
├── 📁 src/api/
│   ├── 📁 repositories/          # Data Access Layer
│   │   ├── base-repository.js    # Abstract base class
│   │   ├── posts-repository.js   # Posts CRUD operations
│   │   ├── students-repository.js # Student data access
│   │   ├── institutions-repository.js # Institution data
│   │   └── programs-repository.js # Academic programs
│   ├── 📁 services/              # Business Logic Layer
│   │   ├── posts-service.js      # Posts business logic
│   │   ├── search-service.js     # Search functionality
│   │   ├── analytics-service.js  # Usage tracking
│   │   └── notification-service.js # Push notifications
│   ├── 📁 utils/                 # API Utilities
│   │   ├── firebase-config.js    # Firebase setup
│   │   ├── error-handler.js      # Error management
│   │   ├── validator.js          # Data validation
│   │   └── cache-manager.js      # Caching strategies
│   └── 📁 hooks/                 # React Integration
│       ├── use-posts.js          # Posts data hook
│       ├── use-search.js         # Search functionality
│       ├── use-pagination.js     # Pagination logic
│       └── use-real-time.js      # Real-time updates
```

---

## 🔧 Repository Pattern Implementation

### Base Repository Class

```javascript
// src/api/repositories/base-repository.js
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { ApiError, NotFoundError, ValidationError } from '../utils/error-handler';

export class BaseRepository {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.collection = collection(db, collectionName);
  }

  /**
   * Get all documents with optional filtering and pagination
   */
  async getAll(options = {}) {
    try {
      const {
        filters = [],
        orderByField = 'createdAt',
        orderDirection = 'desc',
        limitCount = 10,
        startAfterDoc = null
      } = options;

      let q = query(this.collection);

      // Apply filters
      filters.forEach(filter => {
        q = query(q, where(filter.field, filter.operator, filter.value));
      });

      // Apply ordering
      q = query(q, orderBy(orderByField, orderDirection));

      // Apply pagination
      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }

      const snapshot = await getDocs(q);
      
      return {
        data: this.transformSnapshot(snapshot),
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
        hasMore: snapshot.docs.length === limitCount
      };
    } catch (error) {
      throw new ApiError(`Failed to fetch ${this.collectionName}`, error);
    }
  }

  /**
   * Get document by ID
   */
  async getById(id) {
    try {
      const docRef = doc(this.collection, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new NotFoundError(`${this.collectionName} not found`);
      }

      return this.transformDocument(docSnap);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new ApiError(`Failed to fetch ${this.collectionName}`, error);
    }
  }

  /**
   * Create new document
   */
  async create(data) {
    try {
      const validatedData = await this.validateData(data);
      const docRef = await addDoc(this.collection, {
        ...validatedData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return await this.getById(docRef.id);
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      throw new ApiError(`Failed to create ${this.collectionName}`, error);
    }
  }

  /**
   * Update document
   */
  async update(id, data) {
    try {
      const validatedData = await this.validateData(data, true);
      const docRef = doc(this.collection, id);
      
      await updateDoc(docRef, {
        ...validatedData,
        updatedAt: new Date()
      });

      return await this.getById(id);
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      throw new ApiError(`Failed to update ${this.collectionName}`, error);
    }
  }

  /**
   * Delete document
   */
  async delete(id) {
    try {
      const docRef = doc(this.collection, id);
      await deleteDoc(docRef);
      return { id, deleted: true };
    } catch (error) {
      throw new ApiError(`Failed to delete ${this.collectionName}`, error);
    }
  }

  /**
   * Real-time subscription
   */
  subscribe(callback, options = {}) {
    const { filters = [], orderByField = 'createdAt', orderDirection = 'desc' } = options;
    
    let q = query(this.collection);
    
    filters.forEach(filter => {
      q = query(q, where(filter.field, filter.operator, filter.value));
    });
    
    q = query(q, orderBy(orderByField, orderDirection));

    return onSnapshot(q, (snapshot) => {
      const data = this.transformSnapshot(snapshot);
      callback(data);
    }, (error) => {
      throw new ApiError(`Real-time subscription failed for ${this.collectionName}`, error);
    });
  }

  /**
   * Search with text matching
   */
  async search(searchTerm, fields = [], options = {}) {
    try {
      const { limitCount = 10 } = options;
      
      // Firestore doesn't support full-text search natively
      // This is a simple implementation for prefix matching
      const searchResults = [];
      
      for (const field of fields) {
        const q = query(
          this.collection,
          where(field, '>=', searchTerm),
          where(field, '<=', searchTerm + '\uf8ff'),
          limit(limitCount)
        );
        
        const snapshot = await getDocs(q);
        searchResults.push(...this.transformSnapshot(snapshot));
      }
      
      // Remove duplicates and limit results
      const uniqueResults = searchResults
        .filter((item, index, self) => 
          index === self.findIndex(t => t.id === item.id)
        )
        .slice(0, limitCount);
      
      return uniqueResults;
    } catch (error) {
      throw new ApiError(`Search failed for ${this.collectionName}`, error);
    }
  }

  /**
   * Transform Firestore snapshot to plain objects
   */
  transformSnapshot(snapshot) {
    return snapshot.docs.map(doc => this.transformDocument(doc));
  }

  /**
   * Transform single Firestore document
   */
  transformDocument(doc) {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    };
  }

  /**
   * Validate data before create/update
   * Override in child classes
   */
  async validateData(data, isUpdate = false) {
    return data;
  }
}
```

### Posts Repository Implementation

```javascript
// src/api/repositories/posts-repository.js
import { BaseRepository } from './base-repository';
import { z } from 'zod';
import { ValidationError } from '../utils/error-handler';

const PostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().max(300),
  category: z.enum(['news', 'announcement', 'event', 'academic']),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  author: z.object({
    id: z.string(),
    name: z.string(),
    role: z.string()
  }),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string(),
    caption: z.string().optional()
  })).optional(),
  seo: z.object({
    metaTitle: z.string().max(60).optional(),
    metaDescription: z.string().max(160).optional(),
    keywords: z.array(z.string()).optional()
  }).optional()
});

export class PostsRepository extends BaseRepository {
  constructor() {
    super('posts');
  }

  /**
   * Get published posts only
   */
  async getPublished(options = {}) {
    return await this.getAll({
      ...options,
      filters: [
        { field: 'status', operator: '==', value: 'published' }
      ]
    });
  }

  /**
   * Get featured posts
   */
  async getFeatured(limitCount = 5) {
    return await this.getAll({
      filters: [
        { field: 'status', operator: '==', value: 'published' },
        { field: 'featured', operator: '==', value: true }
      ],
      limitCount,
      orderByField: 'createdAt',
      orderDirection: 'desc'
    });
  }

  /**
   * Get posts by category
   */
  async getByCategory(category, options = {}) {
    return await this.getAll({
      ...options,
      filters: [
        { field: 'status', operator: '==', value: 'published' },
        { field: 'category', operator: '==', value: category }
      ]
    });
  }

  /**
   * Search posts by title and content
   */
  async searchPosts(searchTerm, options = {}) {
    // Enhanced search implementation
    const { limitCount = 10, category = null } = options;
    
    const filters = [
      { field: 'status', operator: '==', value: 'published' }
    ];
    
    if (category) {
      filters.push({ field: 'category', operator: '==', value: category });
    }
    
    // Search in title field (prefix matching)
    const titleResults = await this.getAll({
      filters: [
        ...filters,
        { field: 'title', operator: '>=', value: searchTerm },
        { field: 'title', operator: '<=', value: searchTerm + '\uf8ff' }
      ],
      limitCount
    });
    
    // Search in tags array
    const tagResults = await this.getAll({
      filters: [
        ...filters,
        { field: 'tags', operator: 'array-contains', value: searchTerm }
      ],
      limitCount
    });
    
    // Combine and deduplicate results
    const allResults = [...titleResults.data, ...tagResults.data];
    const uniqueResults = allResults.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id)
    );
    
    return {
      data: uniqueResults.slice(0, limitCount),
      hasMore: uniqueResults.length === limitCount
    };
  }

  /**
   * Increment view count
   */
  async incrementViewCount(postId) {
    try {
      const post = await this.getById(postId);
      const newViewCount = (post.viewCount || 0) + 1;
      
      await this.update(postId, { viewCount: newViewCount });
      return newViewCount;
    } catch (error) {
      // Don't throw error for view count failures
      console.warn(`Failed to increment view count for post ${postId}:`, error);
      return 0;
    }
  }

  /**
   * Get post statistics
   */
  async getStats() {
    try {
      const allPosts = await this.getAll({ limitCount: null });
      const publishedPosts = allPosts.data.filter(post => post.status === 'published');
      
      return {
        total: allPosts.data.length,
        published: publishedPosts.length,
        draft: allPosts.data.filter(post => post.status === 'draft').length,
        archived: allPosts.data.filter(post => post.status === 'archived').length,
        totalViews: publishedPosts.reduce((sum, post) => sum + (post.viewCount || 0), 0),
        averageViews: publishedPosts.length > 0 
          ? Math.round(publishedPosts.reduce((sum, post) => sum + (post.viewCount || 0), 0) / publishedPosts.length)
          : 0
      };
    } catch (error) {
      throw new ApiError('Failed to get post statistics', error);
    }
  }

  /**
   * Validate post data
   */
  async validateData(data, isUpdate = false) {
    try {
      const schema = isUpdate ? PostSchema.partial() : PostSchema;
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce((acc, err) => {
          acc[err.path.join('.')] = err.message;
          return acc;
        }, {});
        
        throw new ValidationError('Post validation failed', fieldErrors);
      }
      throw error;
    }
  }
}
```

### Students Repository Implementation

```javascript
// src/api/repositories/students-repository.js
import { BaseRepository } from './base-repository';
import { z } from 'zod';
import { ValidationError } from '../utils/error-handler';

const StudentSchema = z.object({
  nationalId: z.string().regex(/^[A-Z]{2}\d{6}$/, 'Invalid national ID format'),
  massar: z.string().regex(/^\d{10}$/, 'Invalid MASSAR code format'),
  firstName: z.object({
    ar: z.string().min(2),
    fr: z.string().min(2)
  }),
  lastName: z.object({
    ar: z.string().min(2),
    fr: z.string().min(2)
  }),
  birthDate: z.date(),
  gender: z.enum(['male', 'female']),
  institution: z.string(),
  branch: z.string(),
  examSession: z.string().regex(/^\d{4}$/, 'Invalid exam session format'),
  results: z.object({
    overall: z.number().min(0).max(20),
    subjects: z.array(z.object({
      name: z.string(),
      grade: z.number().min(0).max(20),
      coefficient: z.number().min(1)
    })),
    mention: z.enum(['excellent', 'very_good', 'good', 'fair', 'poor']),
    rank: z.number().int().positive().optional()
  }),
  status: z.enum(['passed', 'failed', 'pending']),
  privacy: z.object({
    public: z.boolean().default(true),
    showRank: z.boolean().default(false),
    showGrades: z.boolean().default(true)
  }),
  searchable: z.boolean().default(true)
});

export class StudentsRepository extends BaseRepository {
  constructor() {
    super('students');
  }

  /**
   * Search students by multiple criteria
   */
  async searchStudents(criteria) {
    try {
      const { massar, nationalId, firstName, lastName, examSession } = criteria;
      
      const filters = [
        { field: 'searchable', operator: '==', value: true },
        { field: 'privacy.public', operator: '==', value: true }
      ];

      if (examSession) {
        filters.push({ field: 'examSession', operator: '==', value: examSession });
      }

      // Search by MASSAR code (exact match)
      if (massar) {
        return await this.getAll({
          filters: [
            ...filters,
            { field: 'massar', operator: '==', value: massar }
          ],
          limitCount: 1
        });
      }

      // Search by national ID (exact match)
      if (nationalId) {
        return await this.getAll({
          filters: [
            ...filters,
            { field: 'nationalId', operator: '==', value: nationalId }
          ],
          limitCount: 1
        });
      }

      // Search by name (prefix matching)
      if (firstName || lastName) {
        const nameFilters = [...filters];
        
        if (firstName) {
          nameFilters.push({
            field: 'firstName.ar',
            operator: '>=',
            value: firstName
          });
          nameFilters.push({
            field: 'firstName.ar',
            operator: '<=',
            value: firstName + '\uf8ff'
          });
        }

        if (lastName) {
          nameFilters.push({
            field: 'lastName.ar',
            operator: '>=',
            value: lastName
          });
          nameFilters.push({
            field: 'lastName.ar',
            operator: '<=',
            value: lastName + '\uf8ff'
          });
        }

        return await this.getAll({
          filters: nameFilters,
          limitCount: 10,
          orderByField: 'lastName.ar',
          orderDirection: 'asc'
        });
      }

      throw new ValidationError('At least one search criteria is required');
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      throw new ApiError('Student search failed', error);
    }
  }

  /**
   * Get student statistics by session
   */
  async getSessionStats(examSession) {
    try {
      const allStudents = await this.getAll({
        filters: [{ field: 'examSession', operator: '==', value: examSession }],
        limitCount: null
      });

      const students = allStudents.data;
      
      return {
        total: students.length,
        passed: students.filter(s => s.status === 'passed').length,
        failed: students.filter(s => s.status === 'failed').length,
        pending: students.filter(s => s.status === 'pending').length,
        averageGrade: students.length > 0 
          ? students.reduce((sum, s) => sum + s.results.overall, 0) / students.length
          : 0,
        byMention: {
          excellent: students.filter(s => s.results.mention === 'excellent').length,
          very_good: students.filter(s => s.results.mention === 'very_good').length,
          good: students.filter(s => s.results.mention === 'good').length,
          fair: students.filter(s => s.results.mention === 'fair').length,
          poor: students.filter(s => s.results.mention === 'poor').length
        }
      };
    } catch (error) {
      throw new ApiError('Failed to get session statistics', error);
    }
  }

  /**
   * Get top performers
   */
  async getTopPerformers(examSession, limitCount = 10) {
    return await this.getAll({
      filters: [
        { field: 'examSession', operator: '==', value: examSession },
        { field: 'status', operator: '==', value: 'passed' },
        { field: 'privacy.public', operator: '==', value: true },
        { field: 'privacy.showGrades', operator: '==', value: true }
      ],
      orderByField: 'results.overall',
      orderDirection: 'desc',
      limitCount
    });
  }

  /**
   * Validate student data
   */
  async validateData(data, isUpdate = false) {
    try {
      const schema = isUpdate ? StudentSchema.partial() : StudentSchema;
      
      // Convert date strings to Date objects
      if (data.birthDate && typeof data.birthDate === 'string') {
        data.birthDate = new Date(data.birthDate);
      }
      
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce((acc, err) => {
          acc[err.path.join('.')] = err.message;
          return acc;
        }, {});
        
        throw new ValidationError('Student validation failed', fieldErrors);
      }
      throw error;
    }
  }
}
```

---

## 🔧 Service Layer Implementation

### Posts Service

```javascript
// src/api/services/posts-service.js
import { PostsRepository } from '../repositories/posts-repository';
import { CacheManager } from '../utils/cache-manager';

export class PostsService {
  constructor() {
    this.repository = new PostsRepository();
    this.cache = new CacheManager('posts');
  }

  /**
   * Get featured posts with caching
   */
  async getFeaturedPosts() {
    const cacheKey = 'featured-posts';
    
    let cachedPosts = this.cache.get(cacheKey);
    if (cachedPosts) {
      return cachedPosts;
    }

    const posts = await this.repository.getFeatured(5);
    this.cache.set(cacheKey, posts, 5 * 60 * 1000); // 5 minutes cache
    
    return posts;
  }

  /**
   * Get paginated posts with caching
   */
  async getPaginatedPosts(page = 1, limitCount = 10, category = null) {
    const cacheKey = `posts-${category || 'all'}-${page}-${limitCount}`;
    
    let cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const options = {
      limitCount,
      orderByField: 'createdAt',
      orderDirection: 'desc'
    };

    if (category) {
      options.filters = [
        { field: 'status', operator: '==', value: 'published' },
        { field: 'category', operator: '==', value: category }
      ];
    }

    const result = await this.repository.getPublished(options);
    this.cache.set(cacheKey, result, 2 * 60 * 1000); // 2 minutes cache
    
    return result;
  }

  /**
   * Get single post with view tracking
   */
  async getPostById(id, trackView = true) {
    const post = await this.repository.getById(id);
    
    if (trackView && post.status === 'published') {
      // Increment view count asynchronously
      this.repository.incrementViewCount(id).catch(console.warn);
    }
    
    return post;
  }

  /**
   * Search posts with intelligent caching
   */
  async searchPosts(searchTerm, options = {}) {
    if (!searchTerm || searchTerm.length < 2) {
      throw new ValidationError('Search term must be at least 2 characters');
    }

    const cacheKey = `search-${searchTerm}-${JSON.stringify(options)}`;
    
    let cachedResults = this.cache.get(cacheKey);
    if (cachedResults) {
      return cachedResults;
    }

    const results = await this.repository.searchPosts(searchTerm, options);
    this.cache.set(cacheKey, results, 1 * 60 * 1000); // 1 minute cache for searches
    
    return results;
  }

  /**
   * Subscribe to real-time post updates
   */
  subscribeToLatestPosts(callback, limitCount = 5) {
    return this.repository.subscribe(callback, {
      filters: [
        { field: 'status', operator: '==', value: 'published' }
      ],
      orderByField: 'createdAt',
      orderDirection: 'desc'
    });
  }

  /**
   * Clear related caches
   */
  clearCache(pattern = null) {
    if (pattern) {
      this.cache.clearPattern(pattern);
    } else {
      this.cache.clear();
    }
  }
}
```

### Search Service

```javascript
// src/api/services/search-service.js
import { PostsRepository } from '../repositories/posts-repository';
import { StudentsRepository } from '../repositories/students-repository';
import { InstitutionsRepository } from '../repositories/institutions-repository';
import { characterDetection } from '../../utils/characterDetection';

export class SearchService {
  constructor() {
    this.postsRepo = new PostsRepository();
    this.studentsRepo = new StudentsRepository();
    this.institutionsRepo = new InstitutionsRepository();
  }

  /**
   * Universal search across all content types
   */
  async universalSearch(query, options = {}) {
    const { type = 'all', limit = 10 } = options;
    
    // Detect query language for better search results
    const language = characterDetection(query);
    const results = {};

    try {
      // Search posts
      if (type === 'all' || type === 'posts') {
        results.posts = await this.postsRepo.searchPosts(query, { limitCount: limit });
      }

      // Search institutions
      if (type === 'all' || type === 'institutions') {
        results.institutions = await this.institutionsRepo.search(query, 
          [`name.${language}`, 'description'], { limitCount: limit }
        );
      }

      // Search students (if criteria provided)
      if (type === 'students' && this.isValidStudentQuery(query)) {
        results.students = await this.searchStudents(query);
      }

      return {
        query,
        language,
        results,
        totalResults: Object.values(results).reduce((sum, r) => sum + (r.data?.length || r.length || 0), 0)
      };
    } catch (error) {
      throw new ApiError('Universal search failed', error);
    }
  }

  /**
   * Smart student search with multiple criteria support
   */
  async searchStudents(criteria) {
    // Parse search criteria intelligently
    const parsedCriteria = this.parseStudentCriteria(criteria);
    
    if (Object.keys(parsedCriteria).length === 0) {
      throw new ValidationError('Invalid student search criteria');
    }

    return await this.studentsRepo.searchStudents(parsedCriteria);
  }

  /**
   * Parse student search criteria from string or object
   */
  parseStudentCriteria(input) {
    if (typeof input === 'object') {
      return input;
    }

    const criteria = {};
    const query = input.toString().trim();

    // Check for MASSAR code (10 digits)
    if (/^\d{10}$/.test(query)) {
      criteria.massar = query;
      return criteria;
    }

    // Check for national ID (2 letters + 6 digits)
    if (/^[A-Z]{2}\d{6}$/i.test(query)) {
      criteria.nationalId = query.toUpperCase();
      return criteria;
    }

    // Treat as name search
    const nameParts = query.split(' ').filter(part => part.length > 0);
    if (nameParts.length >= 1) {
      criteria.firstName = nameParts[0];
      if (nameParts.length >= 2) {
        criteria.lastName = nameParts.slice(1).join(' ');
      }
    }

    return criteria;
  }

  /**
   * Check if query is valid for student search
   */
  isValidStudentQuery(query) {
    if (typeof query === 'object') return true;
    
    const queryStr = query.toString().trim();
    
    // Valid if it's a MASSAR code, national ID, or name (at least 2 chars)
    return /^\d{10}$/.test(queryStr) || 
           /^[A-Z]{2}\d{6}$/i.test(queryStr) || 
           queryStr.length >= 2;
  }

  /**
   * Get search suggestions
   */
  async getSearchSuggestions(query, type = 'all') {
    const suggestions = [];
    
    try {
      if (type === 'all' || type === 'posts') {
        // Get recent popular posts for suggestions
        const recentPosts = await this.postsRepo.getFeatured(3);
        suggestions.push(...recentPosts.data.map(post => ({
          type: 'post',
          title: post.title,
          id: post.id,
          category: post.category
        })));
      }

      if (type === 'all' || type === 'institutions') {
        // Get popular institutions
        const institutions = await this.institutionsRepo.getAll({ limitCount: 3 });
        suggestions.push(...institutions.data.map(inst => ({
          type: 'institution',
          title: inst.name.ar || inst.name.fr,
          id: inst.id,
          category: inst.type
        })));
      }

      return suggestions;
    } catch (error) {
      console.warn('Failed to get search suggestions:', error);
      return [];
    }
  }
}
```

---

## 🎣 React Hooks Integration

### Posts Data Hook

```javascript
// src/api/hooks/use-posts.js
import { useState, useEffect, useCallback } from 'react';
import { PostsService } from '../services/posts-service';

const postsService = new PostsService();

export function usePosts(options = {}) {
  const { 
    category = null, 
    limitCount = 10, 
    featured = false,
    realTime = false 
  } = options;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);

  const fetchPosts = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);

      let result;
      
      if (featured) {
        result = await postsService.getFeaturedPosts();
      } else {
        result = await postsService.getPaginatedPosts(1, limitCount, category);
      }

      if (reset || !posts.length) {
        setPosts(result.data);
      } else {
        setPosts(prev => [...prev, ...result.data]);
      }
      
      setHasMore(result.hasMore || false);
      setLastDoc(result.lastDoc || null);
    } catch (err) {
      setError(err);
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  }, [category, limitCount, featured, posts.length]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    
    try {
      setLoading(true);
      const result = await postsService.repository.getAll({
        category,
        limitCount,
        startAfterDoc: lastDoc
      });
      
      setPosts(prev => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setLastDoc(result.lastDoc);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, lastDoc, category, limitCount]);

  const refresh = useCallback(() => {
    postsService.clearCache();
    fetchPosts(true);
  }, [fetchPosts]);

  useEffect(() => {
    fetchPosts(true);
  }, [category, limitCount, featured]);

  useEffect(() => {
    if (!realTime) return;

    const unsubscribe = postsService.subscribeToLatestPosts((newPosts) => {
      setPosts(newPosts);
    }, limitCount);

    return unsubscribe;
  }, [realTime, limitCount]);

  return {
    posts,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    refetch: fetchPosts
  };
}

export function usePost(id) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const postData = await postsService.getPostById(id, true);
        setPost(postData);
      } catch (err) {
        setError(err);
        console.error('Failed to fetch post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return { post, loading, error };
}
```

### Search Hook

```javascript
// src/api/hooks/use-search.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { SearchService } from '../services/search-service';
import { useDebounce } from './use-debounce';

const searchService = new SearchService();

export function useSearch(initialQuery = '', options = {}) {
  const { 
    type = 'all', 
    debounceMs = 300, 
    minLength = 2,
    autoSearch = true 
  } = options;

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  
  const debouncedQuery = useDebounce(query, debounceMs);

  const search = useCallback(async (searchQuery = debouncedQuery) => {
    if (!searchQuery || searchQuery.length < minLength) {
      setResults({});
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const searchResults = await searchService.universalSearch(searchQuery, { type });
      setResults(searchResults);
    } catch (err) {
      setError(err);
      console.error('Search failed:', err);
      setResults({});
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, type, minLength]);

  const searchStudents = useCallback(async (criteria) => {
    try {
      setLoading(true);
      setError(null);
      
      const studentResults = await searchService.searchStudents(criteria);
      return studentResults;
    } catch (err) {
      setError(err);
      console.error('Student search failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSuggestions = useCallback(async (suggestionQuery = query) => {
    if (!suggestionQuery || suggestionQuery.length < 1) {
      setSuggestions([]);
      return;
    }

    try {
      const suggestionResults = await searchService.getSearchSuggestions(suggestionQuery, type);
      setSuggestions(suggestionResults);
    } catch (err) {
      console.warn('Failed to get suggestions:', err);
      setSuggestions([]);
    }
  }, [query, type]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults({});
    setError(null);
    setSuggestions([]);
  }, []);

  // Auto-search when debounced query changes
  useEffect(() => {
    if (autoSearch && debouncedQuery && debouncedQuery.length >= minLength) {
      search();
    }
  }, [debouncedQuery, autoSearch, minLength, search]);

  // Get suggestions when query changes (but before debounce)
  useEffect(() => {
    if (query && query.length >= 1) {
      getSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [query, getSuggestions]);

  const totalResults = useMemo(() => {
    return Object.values(results.results || {}).reduce(
      (sum, categoryResults) => sum + (categoryResults.data?.length || categoryResults.length || 0), 
      0
    );
  }, [results]);

  const hasResults = totalResults > 0;
  const isEmpty = !loading && debouncedQuery.length >= minLength && !hasResults && !error;

  return {
    query,
    setQuery,
    results: results.results || {},
    loading,
    error,
    suggestions,
    totalResults,
    hasResults,
    isEmpty,
    search,
    searchStudents,
    clearSearch,
    getSuggestions
  };
}

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

---

## 🛡️ Error Handling & Validation

### Error Handler Utility

```javascript
// src/api/utils/error-handler.js

export class ApiError extends Error {
  constructor(message, originalError = null, statusCode = 500) {
    super(message);
    this.name = 'ApiError';
    this.originalError = originalError;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    
    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, null, 404);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Validation failed', fields = {}) {
    super(message, null, 400);
    this.name = 'ValidationError';
    this.fields = fields;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      fields: this.fields
    };
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Network error occurred') {
    super(message, null, 0);
    this.name = 'NetworkError';
  }
}

export class AuthError extends ApiError {
  constructor(message = 'Authentication required') {
    super(message, null, 401);
    this.name = 'AuthError';
  }
}

export class PermissionError extends ApiError {
  constructor(message = 'Insufficient permissions') {
    super(message, null, 403);
    this.name = 'PermissionError';
  }
}

/**
 * Global error handler for API operations
 */
export function handleApiError(error) {
  console.error('API Error:', error);

  // Firebase-specific error handling
  if (error.code) {
    switch (error.code) {
      case 'permission-denied':
        return new PermissionError('Access denied. Please check your permissions.');
      
      case 'not-found':
        return new NotFoundError('The requested resource was not found.');
      
      case 'unavailable':
        return new NetworkError('Service is temporarily unavailable. Please try again.');
      
      case 'deadline-exceeded':
        return new NetworkError('Request timeout. Please check your connection.');
      
      case 'resource-exhausted':
        return new ApiError('Service is temporarily overloaded. Please try again later.', error, 429);
      
      default:
        return new ApiError(`Firebase error: ${error.message}`, error);
    }
  }

  // Network errors
  if (!navigator.onLine) {
    return new NetworkError('No internet connection. Please check your network.');
  }

  // Re-throw known error types
  if (error instanceof ApiError) {
    return error;
  }

  // Unknown errors
  return new ApiError('An unexpected error occurred.', error);
}

/**
 * Retry mechanism for failed API calls
 */
export async function withRetry(apiCall, maxRetries = 3, delay = 1000) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = handleApiError(error);
      
      // Don't retry for certain error types
      if (lastError instanceof ValidationError || 
          lastError instanceof NotFoundError ||
          lastError instanceof PermissionError) {
        throw lastError;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
    }
  }

  throw lastError;
}
```

### Cache Manager

```javascript
// src/api/utils/cache-manager.js

export class CacheManager {
  constructor(namespace = 'default') {
    this.namespace = namespace;
    this.cache = new Map();
    this.timers = new Map();
  }

  /**
   * Set cache entry with optional TTL
   */
  set(key, value, ttl = null) {
    const cacheKey = this.getCacheKey(key);
    
    // Clear existing timer
    if (this.timers.has(cacheKey)) {
      clearTimeout(this.timers.get(cacheKey));
    }

    // Set cache entry
    this.cache.set(cacheKey, {
      value,
      timestamp: Date.now(),
      ttl
    });

    // Set expiration timer
    if (ttl) {
      const timer = setTimeout(() => {
        this.delete(key);
      }, ttl);
      
      this.timers.set(cacheKey, timer);
    }
  }

  /**
   * Get cache entry
   */
  get(key) {
    const cacheKey = this.getCacheKey(key);
    const entry = this.cache.get(cacheKey);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (entry.ttl && (Date.now() - entry.timestamp) > entry.ttl) {
      this.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Delete cache entry
   */
  delete(key) {
    const cacheKey = this.getCacheKey(key);
    
    // Clear timer
    if (this.timers.has(cacheKey)) {
      clearTimeout(this.timers.get(cacheKey));
      this.timers.delete(cacheKey);
    }

    return this.cache.delete(cacheKey);
  }

  /**
   * Clear all cache entries
   */
  clear() {
    // Clear all timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    
    // Clear cache
    this.cache.clear();
  }

  /**
   * Clear cache entries matching pattern
   */
  clearPattern(pattern) {
    const regex = new RegExp(pattern);
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        const originalKey = key.replace(`${this.namespace}:`, '');
        this.delete(originalKey);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      namespace: this.namespace,
      entries: Array.from(this.cache.keys()).map(key => ({
        key: key.replace(`${this.namespace}:`, ''),
        timestamp: this.cache.get(key).timestamp,
        ttl: this.cache.get(key).ttl,
        hasTimer: this.timers.has(key)
      }))
    };
  }

  /**
   * Generate namespaced cache key
   */
  getCacheKey(key) {
    return `${this.namespace}:${key}`;
  }
}

// Global cache instance
export const globalCache = new CacheManager('global');
```

---

This comprehensive API design provides a robust, scalable foundation for the UNEM platform with modern patterns, error handling, caching, and React integration. The architecture supports real-time updates, efficient querying, and excellent developer experience.
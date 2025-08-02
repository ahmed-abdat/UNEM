/**
 * Structured Data (JSON-LD) generators for SEO
 * Generates schema.org compliant structured data
 */

/**
 * Generate Organization structured data
 */
export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "الاتحاد الوطني لطلبة موريتانيا",
  "alternateName": "UNEM",
  "url": "https://www.unem2000.com",
  "logo": "https://www.unem2000.com/unem.png",
  "description": "الاتحاد الوطني لطلبة موريتانيا - منصة تعليمية شاملة تضم نتائج البكالوريا، المراجعة، والمؤسسات التعليمية في موريتانيا",
  "foundingDate": "2000",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["Arabic", "French"]
  },
  "sameAs": [
    "https://facebook.com/UNEM",
    "https://twitter.com/UNEM_MR"
  ],
  "areaServed": {
    "@type": "Country",
    "name": "Mauritania"
  }
});

/**
 * Generate WebSite structured data with search functionality
 */
export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "الاتحاد الوطني لطلبة موريتانيا",
  "url": "https://www.unem2000.com",
  "description": "منصة تعليمية شاملة للطلاب في موريتانيا",
  "publisher": {
    "@type": "Organization",
    "name": "الاتحاد الوطني لطلبة موريتانيا"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.unem2000.com/bac2025?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "inLanguage": "ar"
});

/**
 * Generate Article structured data for news posts
 */
export const generateArticleSchema = (article) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.summary || article.description,
  "image": article.image || "https://www.unem2000.com/og_image.png",
  "author": {
    "@type": "Organization",
    "name": article.author || "الاتحاد الوطني لطلبة موريتانيا"
  },
  "publisher": {
    "@type": "Organization",
    "name": "الاتحاد الوطني لطلبة موريتانيا",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.unem2000.com/unem.png"
    }
  },
  "datePublished": article.createdAt,
  "dateModified": article.updatedAt || article.createdAt,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://www.unem2000.com/News/poste/${article.id}`
  },
  "articleSection": "أخبار",
  "keywords": article.tags || ["تعليم", "طلبة", "موريتانيا"],
  "inLanguage": "ar"
});

/**
 * Generate EducationalOrganization schema for institutions
 */
export const generateEducationalOrganizationSchema = (institution) => ({
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": institution.name,
  "description": institution.description,
  "url": institution.website,
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "Mauritania",
    "addressLocality": institution.city,
    "addressRegion": institution.region
  },
  "areaServed": {
    "@type": "Country",
    "name": "Mauritania"
  },
  "educationalCredentialAwarded": institution.degrees || [],
  "hasCredential": institution.accreditation || [],
  "inLanguage": ["ar", "fr"]
});

/**
 * Generate Course structured data for revision materials
 */
export const generateCourseSchema = (course) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  "name": course.title,
  "description": course.description,
  "provider": {
    "@type": "Organization",
    "name": "الاتحاد الوطني لطلبة موريتانيا"
  },
  "educationalLevel": course.level || "High School",
  "about": course.subject,
  "inLanguage": "ar",
  "isAccessibleForFree": true,
  "learningResourceType": "Educational Material",
  "educationalUse": "Study Guide"
});

/**
 * Generate FAQPage structured data
 */
export const generateFAQSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

/**
 * Generate BreadcrumbList structured data
 */
export const generateBreadcrumbSchema = (breadcrumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
});

/**
 * Generate SearchResultsPage structured data
 */
export const generateSearchResultsSchema = (searchTerm, totalResults) => ({
  "@context": "https://schema.org",
  "@type": "SearchResultsPage",
  "name": `نتائج البحث عن: ${searchTerm}`,
  "description": `تم العثور على ${totalResults} نتيجة للبحث عن "${searchTerm}"`,
  "url": `https://www.unem2000.com/bac2025?search=${encodeURIComponent(searchTerm)}`,
  "mainEntity": {
    "@type": "ItemList",
    "numberOfItems": totalResults
  }
});

/**
 * Combine multiple schemas for complex pages
 */
export const combineSchemas = (...schemas) => ({
  "@context": "https://schema.org",
  "@graph": schemas
});
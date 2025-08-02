import { useEffect } from 'react';

/**
 * SEO hook for managing meta tags and OpenGraph data
 * @param {Object} seoData - SEO configuration object
 * @param {string} seoData.title - Page title
 * @param {string} seoData.description - Page description
 * @param {string} seoData.keywords - Page keywords
 * @param {string} seoData.image - OpenGraph image URL
 * @param {string} seoData.url - Canonical URL
 * @param {string} seoData.type - OpenGraph type (website, article, etc.)
 * @param {Object} seoData.article - Article-specific data (author, publishedTime, etc.)
 */
export const useSEO = (seoData) => {
  useEffect(() => {
    // Update document title
    if (seoData.title) {
      document.title = seoData.title;
    }
  }, [seoData.title]);

  return seoData;
};

/**
 * Generate default SEO data for the site
 */
export const getDefaultSEO = () => ({
  title: 'الاتحاد الوطني لطلبة موريتانيا - UNEM',
  description: 'الاتحاد الوطني لطلبة موريتانيا - منصة تعليمية شاملة تضم نتائج البكالوريا، المراجعة، والمؤسسات التعليمية في موريتانيا',
  keywords: 'موريتانيا، طلبة، تعليم، البكالوريا، نتائج، مراجعة، جامعة، مؤسسات تعليمية، UNEM',
  image: '/og_image.png',
  url: 'https://www.unem2000.com',
  type: 'website',
  siteName: 'الاتحاد الوطني لطلبة موريتانيا',
  locale: 'ar_MR',
  twitterCard: 'summary_large_image',
  twitterSite: '@UNEM_MR'
});

/**
 * Generate SEO data for news articles
 */
export const getArticleSEO = (article) => ({
  ...getDefaultSEO(),
  title: `${article.title} - الاتحاد الوطني لطلبة موريتانيا`,
  description: article.summary || article.description,
  image: article.image || '/og_image.png',
  type: 'article',
  url: `https://www.unem2000.com/News/poste/${article.id}`,
  article: {
    author: article.author || 'الاتحاد الوطني لطلبة موريتانيا',
    publishedTime: article.createdAt,
    modifiedTime: article.updatedAt,
    section: 'أخبار',
    tags: article.tags || ['تعليم', 'طلبة', 'موريتانيا']
  }
});

/**
 * Generate SEO data for student results pages
 */
export const getResultsSEO = () => ({
  ...getDefaultSEO(),
  title: 'نتائج البكالوريا 2025 - الاتحاد الوطني لطلبة موريتانيا',
  description: 'ابحث عن نتائج البكالوريا 2025 في موريتانيا. استعلام سريع وموثوق عن النتائج بالاسم أو رقم التسجيل',
  keywords: 'نتائج البكالوريا 2025، موريتانيا، استعلام النتائج، البكالوريا، نتائج الثانوية العامة',
  url: 'https://www.unem2000.com/bac2025'
});

/**
 * Generate SEO data for institutions page
 */
export const getInstitutionsSEO = () => ({
  ...getDefaultSEO(),
  title: 'المؤسسات التعليمية في موريتانيا - الاتحاد الوطني لطلبة موريتانيا',
  description: 'دليل شامل للمؤسسات التعليمية في موريتانيا - الجامعات، المعاهد، والكليات',
  keywords: 'جامعات موريتانيا، مؤسسات تعليمية، كليات، معاهد، تعليم عالي',
  url: 'https://www.unem2000.com/institutions'
});

/**
 * Generate SEO data for revision materials
 */
export const getRevisionSEO = () => ({
  ...getDefaultSEO(),
  title: 'مواد المراجعة والدروس - الاتحاد الوطني لطلبة موريتانيا',
  description: 'مواد مراجعة شاملة للطلاب في موريتانيا - دروس، تمارين، وملخصات لجميع المواد',
  keywords: 'مراجعة، دروس، تمارين، ملخصات، طلاب موريتانيا، تعليم',
  url: 'https://www.unem2000.com/revision'
});
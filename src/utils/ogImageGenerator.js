/**
 * OpenGraph Image Generator
 * Generates dynamic OG images for different page types
 */

/**
 * Generate OpenGraph image URL for dynamic content
 * @param {Object} options - Image generation options
 * @param {string} options.title - Main title
 * @param {string} options.subtitle - Subtitle or description
 * @param {string} options.type - Page type (article, results, institution, etc.)
 * @param {string} options.theme - Color theme (default, education, news, etc.)
 * @returns {string} Generated image URL
 */
export const generateOGImageUrl = ({
  title,
  subtitle = '',
  type = 'website',
  theme = 'default'
}) => {
  // Use a service like Vercel OG Image Generation or create custom endpoint
  const baseUrl = 'https://www.unem2000.com/api/og';
  
  const params = new URLSearchParams({
    title: encodeURIComponent(title),
    subtitle: encodeURIComponent(subtitle),
    type,
    theme
  });

  return `${baseUrl}?${params.toString()}`;
};

/**
 * Generate OG image for news articles
 */
export const generateArticleOGImage = (article) => {
  return generateOGImageUrl({
    title: article.title,
    subtitle: 'الاتحاد الوطني لطلبة موريتانيا',
    type: 'article',
    theme: 'news'
  });
};

/**
 * Generate OG image for student results
 */
export const generateResultsOGImage = () => {
  return generateOGImageUrl({
    title: 'نتائج البكالوريا 2025',
    subtitle: 'استعلام النتائج - موريتانيا',
    type: 'results',
    theme: 'education'
  });
};

/**
 * Generate OG image for institutions
 */
export const generateInstitutionOGImage = (institution) => {
  return generateOGImageUrl({
    title: institution?.name || 'المؤسسات التعليمية',
    subtitle: 'جامعات ومعاهد موريتانيا',
    type: 'institution',
    theme: 'education'
  });
};

/**
 * Fallback OG image URLs
 */
export const OG_IMAGES = {
  default: '/og_image.png',
  news: '/og_image.png',
  education: '/og_image.png',
  results: '/og_image.png',
  institutions: '/og_image.png',
  revision: '/og_image.png'
};

/**
 * Get appropriate OG image based on page type
 */
export const getOGImage = (pageType, data = null) => {
  switch (pageType) {
    case 'article':
      return data?.image || generateArticleOGImage(data) || OG_IMAGES.news;
    case 'results':
      return generateResultsOGImage() || OG_IMAGES.results;
    case 'institution':
      return generateInstitutionOGImage(data) || OG_IMAGES.institutions;
    case 'revision':
      return OG_IMAGES.revision;
    default:
      return OG_IMAGES.default;
  }
};
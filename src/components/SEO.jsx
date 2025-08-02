import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { getDefaultSEO } from '../hooks/useSEO';

/**
 * SEO Component for managing meta tags, OpenGraph, and Twitter Cards
 * @param {Object} props - SEO configuration
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description  
 * @param {string} props.keywords - Meta keywords
 * @param {string} props.image - OpenGraph image URL
 * @param {string} props.url - Canonical URL
 * @param {string} props.type - OpenGraph type (website, article, etc.)
 * @param {Object} props.article - Article-specific data
 * @param {string} props.siteName - Site name
 * @param {string} props.locale - Page locale
 * @param {string} props.twitterCard - Twitter card type
 * @param {string} props.twitterSite - Twitter site handle
 * @param {Object} props.structuredData - JSON-LD structured data
 * @param {boolean} props.noIndex - Add noindex meta tag
 * @param {boolean} props.noFollow - Add nofollow meta tag
 */
const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  article,
  siteName,
  locale = 'ar_MR',
  twitterCard = 'summary_large_image',
  twitterSite = '@UNEM_MR',
  structuredData,
  noIndex = false,
  noFollow = false,
  ...props
}) => {
  const defaultSEO = getDefaultSEO();
  
  // Merge with defaults
  const seoData = {
    title: title || defaultSEO.title,
    description: description || defaultSEO.description,
    keywords: keywords || defaultSEO.keywords,
    image: image || defaultSEO.image,
    url: url || defaultSEO.url,
    siteName: siteName || defaultSEO.siteName,
    locale: locale || defaultSEO.locale,
    twitterCard: twitterCard || defaultSEO.twitterCard,
    twitterSite: twitterSite || defaultSEO.twitterSite,
    type,
    article,
    structuredData,
    noIndex,
    noFollow
  };

  // Ensure absolute URLs for images and canonical URLs
  const absoluteImage = seoData.image.startsWith('http') 
    ? seoData.image 
    : `https://www.unem2000.com${seoData.image}`;
    
  const absoluteUrl = seoData.url.startsWith('http')
    ? seoData.url
    : `https://www.unem2000.com${seoData.url}`;

  return (
    <Helmet prioritizeSeoTags>
      {/* Basic Meta Tags */}
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords} />
      
      {/* Language and Direction */}
      <html lang="ar" dir="rtl" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={absoluteUrl} />
      
      {/* Robots Meta Tags */}
      {(noIndex || noFollow) && (
        <meta 
          name="robots" 
          content={`${noIndex ? 'noindex' : 'index'},${noFollow ? 'nofollow' : 'follow'}`} 
        />
      )}
      
      {/* OpenGraph Meta Tags */}
      <meta property="og:type" content={seoData.type} />
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:site_name" content={seoData.siteName} />
      <meta property="og:locale" content={seoData.locale} />
      
      {/* Article-specific OpenGraph Tags */}
      {seoData.article && (
        <>
          <meta property="article:author" content={seoData.article.author} />
          <meta property="article:published_time" content={seoData.article.publishedTime} />
          {seoData.article.modifiedTime && (
            <meta property="article:modified_time" content={seoData.article.modifiedTime} />
          )}
          <meta property="article:section" content={seoData.article.section} />
          {seoData.article.tags && seoData.article.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={seoData.twitterCard} />
      <meta name="twitter:site" content={seoData.twitterSite} />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      <meta name="twitter:image" content={absoluteImage} />
      
      {/* Structured Data (JSON-LD) */}
      {seoData.structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(seoData.structuredData)}
        </script>
      )}
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#0CB509" />
      <meta name="msapplication-TileColor" content="#0CB509" />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/png" href="/unem.png" />
      <link rel="apple-touch-icon" href="/unem.png" />
      
      {/* Additional props */}
      {Object.entries(props).map(([key, value]) => (
        <meta key={key} name={key} content={value} />
      ))}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
  article: PropTypes.shape({
    author: PropTypes.string,
    publishedTime: PropTypes.string,
    modifiedTime: PropTypes.string,
    section: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string)
  }),
  siteName: PropTypes.string,
  locale: PropTypes.string,
  twitterCard: PropTypes.string,
  twitterSite: PropTypes.string,
  structuredData: PropTypes.object,
  noIndex: PropTypes.bool,
  noFollow: PropTypes.bool
};

export default SEO;
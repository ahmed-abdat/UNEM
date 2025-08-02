/**
 * Enhanced character detection for Arabic vs Latin text optimization
 * Provides fast Unicode-based detection with intelligent caching
 */

// Arabic Unicode ranges for comprehensive detection
const ARABIC_RANGES = [
  [0x0600, 0x06FF], // Arabic
  [0x0750, 0x077F], // Arabic Supplement
  [0x08A0, 0x08FF], // Arabic Extended-A
  [0x0870, 0x089F], // Arabic Extended-B
  [0xFB50, 0xFDFF], // Arabic Presentation Forms-A
  [0xFE70, 0xFEFF]  // Arabic Presentation Forms-B
];

// Latin Unicode ranges
const LATIN_RANGES = [
  [0x0041, 0x005A], // Basic Latin uppercase
  [0x0061, 0x007A], // Basic Latin lowercase
  [0x00C0, 0x017F], // Latin-1 Supplement and Extended-A
  [0x0180, 0x024F], // Latin Extended-B
  [0x1E00, 0x1EFF]  // Latin Extended Additional
];

// Cache for performance optimization
const charDetectionCache = new Map();
const MAX_CACHE_SIZE = 1000;

/**
 * Detect if a character is Arabic
 * @param {number} codePoint - Unicode code point
 * @returns {boolean}
 */
export function isArabicChar(codePoint) {
  return ARABIC_RANGES.some(([start, end]) => codePoint >= start && codePoint <= end);
}

/**
 * Detect if a character is Latin
 * @param {number} codePoint - Unicode code point
 * @returns {boolean}
 */
export function isLatinChar(codePoint) {
  return LATIN_RANGES.some(([start, end]) => codePoint >= start && codePoint <= end);
}

/**
 * Fast character type detection for the first character
 * @param {string} text - Input text
 * @returns {'arabic'|'latin'|'mixed'|'unknown'}
 */
export function detectFirstCharacterType(text) {
  if (!text || text.length === 0) return 'unknown';
  
  // Check cache first
  const firstChar = text[0];
  if (charDetectionCache.has(firstChar)) {
    return charDetectionCache.get(firstChar);
  }
  
  const codePoint = text.codePointAt(0);
  let result = 'unknown';
  
  if (isArabicChar(codePoint)) {
    result = 'arabic';
  } else if (isLatinChar(codePoint)) {
    result = 'latin';
  }
  
  // Cache the result with size management
  if (charDetectionCache.size >= MAX_CACHE_SIZE) {
    const firstKey = charDetectionCache.keys().next().value;
    charDetectionCache.delete(firstKey);
  }
  charDetectionCache.set(firstChar, result);
  
  return result;
}

/**
 * Comprehensive text analysis for mixed content
 * @param {string} text - Input text
 * @returns {object} Analysis result
 */
export function analyzeTextComposition(text) {
  if (!text) return { type: 'unknown', confidence: 0, analysis: {} };
  
  let arabicCount = 0;
  let latinCount = 0;
  let otherCount = 0;
  const totalChars = text.length;
  
  // Analyze each character
  for (let i = 0; i < text.length; i++) {
    const codePoint = text.codePointAt(i);
    
    if (isArabicChar(codePoint)) {
      arabicCount++;
    } else if (isLatinChar(codePoint)) {
      latinCount++;
    } else if (!/\s/.test(text[i])) { // Ignore whitespace
      otherCount++;
    }
  }
  
  // Determine primary type
  let primaryType = 'unknown';
  let confidence = 0;
  
  if (arabicCount > latinCount && arabicCount > otherCount) {
    primaryType = 'arabic';
    confidence = arabicCount / totalChars;
  } else if (latinCount > arabicCount && latinCount > otherCount) {
    primaryType = 'latin';
    confidence = latinCount / totalChars;
  } else if (arabicCount > 0 && latinCount > 0) {
    primaryType = 'mixed';
    confidence = (arabicCount + latinCount) / totalChars;
  }
  
  return {
    type: primaryType,
    confidence: Math.round(confidence * 100) / 100,
    analysis: {
      arabic: arabicCount,
      latin: latinCount,
      other: otherCount,
      total: totalChars,
      percentages: {
        arabic: Math.round((arabicCount / totalChars) * 100),
        latin: Math.round((latinCount / totalChars) * 100),
        other: Math.round((otherCount / totalChars) * 100)
      }
    }
  };
}

/**
 * Enhanced Arabic text normalization
 * @param {string} text - Arabic text to normalize
 * @returns {string} Normalized text
 */
export function normalizeArabicText(text) {
  if (!text) return '';
  
  return text
    // Remove diacritics (Tashkeel)
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    // Normalize Alef variations
    .replace(/[أإآا]/g, 'ا')
    // Normalize Ya variations
    .replace(/[ىي]/g, 'ي')
    // Normalize Heh variations
    .replace(/[هة]/g, 'ه')
    // Normalize Teh variations
    .replace(/[تط]/g, 'ت')
    // Normalize Waw with Hamza
    .replace(/[ؤ]/g, 'و')
    // Normalize Ya with Hamza
    .replace(/[ئ]/g, 'ي')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Enhanced Latin text normalization
 * @param {string} text - Latin text to normalize
 * @returns {string} Normalized text
 */
export function normalizeLatinText(text) {
  if (!text) return '';
  
  return text
    // Convert to lowercase
    .toLowerCase()
    // Remove accents and diacritics
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Smart text normalization based on character type
 * @param {string} text - Input text
 * @returns {string} Normalized text
 */
export function smartNormalizeText(text) {
  const analysis = analyzeTextComposition(text);
  
  switch (analysis.type) {
    case 'arabic':
      return normalizeArabicText(text);
    case 'latin':
      return normalizeLatinText(text);
    case 'mixed': {
      // For mixed text, apply both normalizations
      let normalized = normalizeArabicText(text);
      normalized = normalizeLatinText(normalized);
      return normalized;
    }
    default:
      return text.toLowerCase().trim();
  }
}

/**
 * Performance monitoring for character detection
 */
export const characterDetectionMetrics = {
  cacheHits: 0,
  cacheMisses: 0,
  totalDetections: 0,
  
  getCacheHitRate() {
    return this.totalDetections > 0 
      ? Math.round((this.cacheHits / this.totalDetections) * 100) 
      : 0;
  },
  
  reset() {
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.totalDetections = 0;
  }
};

/**
 * Clear character detection cache
 */
export function clearCharacterDetectionCache() {
  charDetectionCache.clear();
  characterDetectionMetrics.reset();
}

export default {
  detectFirstCharacterType,
  analyzeTextComposition,
  normalizeArabicText,
  normalizeLatinText,
  smartNormalizeText,
  isArabicChar,
  isLatinChar,
  clearCharacterDetectionCache,
  characterDetectionMetrics
};
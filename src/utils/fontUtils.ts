/**
 * Utility functions for font selection based on text content
 */

/**
 * Check if text contains Thai characters
 */
export const hasThaiCharacters = (text: string): boolean => {
  const thaiRegex = /[\u0E00-\u0E7F]/;
  return thaiRegex.test(text);
};

/**
 * Check if text contains Latin Extended characters (accented characters, etc.)
 */
export const hasLatinExtendedCharacters = (text: string): boolean => {
  const latinExtendedRegex = /[\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF]/;
  return latinExtendedRegex.test(text);
};

/**
 * Check if text contains only basic Latin characters
 */
export const hasOnlyBasicLatin = (text: string): boolean => {
  const basicLatinRegex = /^[\u0020-\u007F]*$/;
  return basicLatinRegex.test(text);
};

/**
 * Get the appropriate font family based on text content and weight
 */
export const getFontFamily = (text: string, weight: number = 400): string => {
  if (hasThaiCharacters(text)) {
    return `Anuphan-Thai-${weight}`;
  } else if (hasLatinExtendedCharacters(text)) {
    return `Anuphan-LatinExt-${weight}`;
  } else {
    return `Anuphan-Latin-${weight}`;
  }
};

/**
 * Get font family for different typography styles
 */
export const getTypographyFontFamily = (text: string, style: 'h1' | 'h2' | 'h3' | 'body' | 'caption'): string => {
  const weightMap = {
    h1: 700,
    h2: 600,
    h3: 600,
    body: 400,
    caption: 500,
  };

  return getFontFamily(text, weightMap[style]);
};

/**
 * Font weight mapping for different font families
 */
export const FONT_WEIGHTS = {
  '100': '100',
  '200': '200',
  '300': '300',
  '400': '400',
  '500': '500',
  '600': '600',
  '700': '700',
} as const;

/**
 * Available font families
 */
export const FONT_FAMILIES = {
  THAI: {
    '100': 'Anuphan-Thai-100',
    '200': 'Anuphan-Thai-200',
    '300': 'Anuphan-Thai-300',
    '400': 'Anuphan-Thai-400',
    '500': 'Anuphan-Thai-500',
    '600': 'Anuphan-Thai-600',
    '700': 'Anuphan-Thai-700',
  },
  LATIN: {
    '100': 'Anuphan-Latin-100',
    '200': 'Anuphan-Latin-200',
    '300': 'Anuphan-Latin-300',
    '400': 'Anuphan-Latin-400',
    '500': 'Anuphan-Latin-500',
    '600': 'Anuphan-Latin-600',
    '700': 'Anuphan-Latin-700',
  },
  LATIN_EXTENDED: {
    '100': 'Anuphan-LatinExt-100',
    '200': 'Anuphan-LatinExt-200',
    '300': 'Anuphan-LatinExt-300',
    '400': 'Anuphan-LatinExt-400',
    '500': 'Anuphan-LatinExt-500',
    '600': 'Anuphan-LatinExt-600',
    '700': 'Anuphan-LatinExt-700',
  },
} as const;

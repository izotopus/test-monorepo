/**
 * Oblicza szacowany czas czytania tekstu.
 */
export const calculateReadingTime = (text: string): number => {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

/**
 * Formatuje nazwę pakietu na bezpieczny identyfikator.
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[@/]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
};
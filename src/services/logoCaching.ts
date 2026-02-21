import { Image } from 'react-native';

const LOGO_SOURCE = require('../../assets/image/app-logo.png');

/**
 * Logo caching and prefetching service
 * Improved performance and reduced re-renders
 */

let logoPrefetched = false;

/**
 * Prefetch the app logo for better performance
 * Safe to call multiple times
 */
export async function prefetchLogo(): Promise<void> {
  if (logoPrefetched) {
    return;
  }

  try {
    const uri = Image.resolveAssetSource(LOGO_SOURCE).uri;
    await Image.prefetch(uri);
    logoPrefetched = true;
    console.debug('[LogoCache] Logo prefetched successfully');
  } catch (error) {
    console.warn('[LogoCache] Failed to prefetch logo:', error);
    // Don't throw - this shouldn't block app startup
  }
}

/**
 * Get the logo source
 */
export function getLogoSource() {
  return LOGO_SOURCE;
}

/**
 * Get the logo URI
 */
export function getLogoUri(): string {
  return Image.resolveAssetSource(LOGO_SOURCE).uri;
}

/**
 * Reset prefetch cache (for testing)
 */
export function resetLogoCache(): void {
  logoPrefetched = false;
}

/**
 * Check if logo is prefetched
 */
export function isLogoPrefetched(): boolean {
  return logoPrefetched;
}

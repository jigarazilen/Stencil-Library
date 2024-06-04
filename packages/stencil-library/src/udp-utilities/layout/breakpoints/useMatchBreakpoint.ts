import { breakpoints } from './breakpoints';

export function useMatchBreakpoint(breakpointKey: keyof typeof breakpoints): boolean {
  if (typeof window === 'undefined') return false; // SSR or build-time rendering

  const query = breakpoints[breakpointKey];
  const mediaQueryList = window.matchMedia(query);
  return mediaQueryList.matches;
}

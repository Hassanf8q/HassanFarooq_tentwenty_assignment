import { Dimensions, PixelRatio } from 'react-native';

// Guideline sizes are based on standard ~5.8" device (iPhone X) portrait screen
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const guidelineBaseWidth = 375; // iPhone X width
const guidelineBaseHeight = 812; // iPhone X height

export const scale = (size: number): number => (screenWidth / guidelineBaseWidth) * size;
export const verticalScale = (size: number): number => (screenHeight / guidelineBaseHeight) * size;

// Moderate scale: interpolate between absolute size and full scale by factor (default 0.5)
export const moderateScale = (size: number, factor = 0.5): number => {
  const scaledSize = scale(size);
  return size + (scaledSize - size) * factor;
};

// Pixel perfect rounding for crisper rendering across densities
export const s = (size: number, factor = 0.5): number => PixelRatio.roundToNearestPixel(moderateScale(size, factor));
export const vs = (size: number, factor = 0.5): number => PixelRatio.roundToNearestPixel(moderateScale(verticalScale(size), factor));
export const ms = (size: number, factor = 0.5): number => PixelRatio.roundToNearestPixel(moderateScale(size, factor));

// Convenience helpers for spacing to keep a consistent rhythm
export const spacing = (multiplier = 1): number => s(8 * multiplier);

// Recompute on orientation change without consumers subscribing everywhere
Dimensions.addEventListener('change', () => {
  // Accessors re-read Dimensions on next call; no cached state to reset
});

export default { scale, verticalScale, moderateScale, s, vs, ms, spacing };



import React, { useMemo } from 'react';
import { Image, ImageProps, ImageStyle, ImageResolvedAssetSource } from 'react-native';
import { ms } from '../utils/responsive';

type Fit = 'contain' | 'cover' | 'center' | 'stretch';

export interface AppImageProps extends Omit<ImageProps, 'style' | 'resizeMode'> {
  /** square fallback for icons */
  size?: number;
  /** use for non-square assets (e.g., logos) */
  width?: number;
  height?: number;
  /** derive aspectRatio from the source so width alone is enough */
  aspectFromSource?: boolean;
  /** only applied when provided; logos should usually omit this */
  tintColor?: string;
  /** image fit (default: contain) */
  fit?: Fit;
  style?: ImageStyle;
}

const AppImage: React.FC<AppImageProps> = ({
  size = 24,
  width,
  height,
  aspectFromSource = false,
  tintColor,
  fit = 'contain',
  style,
  source,
  ...props
}) => {
  const resolved: ImageResolvedAssetSource | undefined = useMemo(
    () => (source ? Image.resolveAssetSource(source) : undefined),
    [source]
  );

  const w = width != null ? ms(width) : size != null ? ms(size) : undefined;
  const h =
    height != null
      ? ms(height)
      : width != null && aspectFromSource && resolved?.width && resolved?.height
      ? undefined
      : size != null
      ? ms(size)
      : undefined;

  const base: ImageStyle = {
    width: w,
    height: h,
    ...(aspectFromSource && resolved?.width && resolved?.height
      ? { aspectRatio: resolved.width / resolved.height }
      : null),
    ...(tintColor ? { tintColor } : null),
  };

  return <Image {...props} source={source} style={[base, style]} resizeMode={fit} />;
};

export default AppImage;



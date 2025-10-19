import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface AppTextProps extends TextProps {
  variant?: 'regular' | 'medium' | 'semiBold' | 'bold';
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold' | number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' | 'title';
  color?: 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'textLight';
  children: React.ReactNode;
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'regular',
  weight,
  size = 'md',
  color = 'textPrimary',
  style,
  children,
  ...props
}) => {
  const { state } = useTheme();
  const { theme } = state;

  // Determine font family and weight based on props
  let fontFamily: string;
  let fontWeight: string | undefined;

  // Always use variant for font family (primary method)
  fontFamily = theme.fonts[variant];

  // Handle weight prop for additional fontWeight control
  if (weight) {
    if (typeof weight === 'number') {
      // Use numeric weight directly
      fontWeight = weight.toString();
    } else {
      // Use predefined weight from theme
      fontWeight = theme.fonts.weights?.[weight];
    }
  }

  const textStyle = [
    styles.text,
    {
      fontFamily,
      fontWeight,
      fontSize: theme.fonts.sizes[size],
      color: theme.colors[color],
    },
    style,
  ];

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    // Remove static fontFamily - let the dynamic style handle it
  },
});

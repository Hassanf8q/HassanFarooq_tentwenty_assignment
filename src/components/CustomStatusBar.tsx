import React from 'react';
import { StatusBar, Platform } from 'react-native';

interface CustomStatusBarProps {
  barStyle?: 'light-content' | 'dark-content';
  backgroundColor?: string;
  hidden?: boolean;
  translucent?: boolean;
}

const CustomStatusBar: React.FC<CustomStatusBarProps> = ({
  barStyle = 'dark-content',
  backgroundColor = 'white',
  hidden = false,
  translucent = false,
}) => {
  return (
    <StatusBar
      barStyle={barStyle}
      backgroundColor={backgroundColor}
      hidden={hidden}
      translucent={translucent}
      // iOS specific props
      {...(Platform.OS === 'ios' && {
        animated: true,
      })}
    />
  );
};

export default CustomStatusBar;

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Theme } from '../types';
import { lightTheme, darkTheme } from '../theme';

interface ThemeState {
  theme: Theme;
  isDarkMode: boolean;
}

type ThemeAction = 
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_THEME'; payload: boolean };

const initialState: ThemeState = {
  theme: lightTheme,
  isDarkMode: false,
};

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
        theme: !state.isDarkMode ? darkTheme : lightTheme,
      };
    case 'SET_THEME':
      return {
        ...state,
        isDarkMode: action.payload,
        theme: action.payload ? darkTheme : lightTheme,
      };
    default:
      return state;
  }
};

interface ThemeContextType {
  state: ThemeState;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const setTheme = (isDark: boolean) => {
    dispatch({ type: 'SET_THEME', payload: isDark });
  };

  return (
    <ThemeContext.Provider value={{ state, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

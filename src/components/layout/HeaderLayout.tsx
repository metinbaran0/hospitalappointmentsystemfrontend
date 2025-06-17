import React from 'react';
import { Dispatch, SetStateAction } from 'react';

import { ThemeProvider } from '@mui/material/styles';

import Header from './Header/Header';
import { getTheme } from '../../theme';


interface HeaderLayoutProps {
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
  currentLanguage: string;
  changeLanguage: (lng: string) => void;
  children: React.ReactNode;
}

const HeaderLayout: React.FC<HeaderLayoutProps> = ({
  darkMode,
  setDarkMode,
  currentLanguage,
  changeLanguage,
  children,
}) => {
 
  const theme = getTheme(darkMode);

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Header 
          darkMode={darkMode} 
          setDarkMode={setDarkMode}  
          currentLanguage={currentLanguage} 
          changeLanguage={changeLanguage} 
        />
        {children}
      </div>
    </ThemeProvider>
  );
};

export default HeaderLayout;

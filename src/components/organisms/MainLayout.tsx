import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
  IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Dispatch } from 'react';
import { getTheme } from '../../theme';
import Navbar from './Navbar';
import LeftDrawer from './LeftDrawer';

type Props = {
  children: React.ReactNode;
  darkMode: boolean;
  setDarkMode: Dispatch<boolean>;
  currentLanguage: string;
  changeLanguage: (lng: string) => void;
};

const MainLayout: React.FC<Props> = ({ children, darkMode, setDarkMode, currentLanguage, changeLanguage }) => {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDarkMode, setIsDarkMode] = useState(prefersDark); // use isDarkMode
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Use the passed in darkMode, or the local isDarkMode state
  const actualDarkMode = darkMode !== undefined ? darkMode : isDarkMode;
  const theme = getTheme(actualDarkMode);

  // Function to handle dark mode toggle
    const handleDarkModeToggle = () => {
        if (setDarkMode) {
            setDarkMode(!actualDarkMode);
        }
        setIsDarkMode(!actualDarkMode);
    };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => setDrawerOpen(true)} sx={{ ml: 2, mt: 1 }}>
            <MenuIcon />
          </IconButton>
          <Navbar
            darkMode={actualDarkMode}
            setDarkMode={handleDarkModeToggle}
            theme={theme}
            onLogoClick={() => setDrawerOpen(true)}
          />
        </Box>

        <LeftDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

        <Box component="main" sx={{
          flexGrow: 1,
          backgroundColor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
          pt: 2,
          px: 2
        }}>
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;

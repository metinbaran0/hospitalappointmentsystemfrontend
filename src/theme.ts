import { createTheme } from '@mui/material/styles';

export const getTheme = (darkMode: boolean) => createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: { main: '#1e2a38', dark: '#121c2b', contrastText: '#ffffff' },
    background: {
      default: darkMode ? '#0f172a' : '#f8f5f0',
      paper: darkMode ? '#1e1e1e' : '#ffffff',
    },
    text: {
      primary: darkMode ? '#ffffff' : '#1e2a38',
      secondary: darkMode ? '#ccc' : '#666',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: darkMode ? '#1e2a38' : '#ffffff',
          color: darkMode ? '#ffffff' : '#1e2a38',
          boxShadow: 'none',
          borderBottom: 'none',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

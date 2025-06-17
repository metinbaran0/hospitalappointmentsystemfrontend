import { AppBar, Toolbar, Box, Button, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../layout/LanguageSwitcher';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  currentLanguage: string;
  changeLanguage: (lng: string) => void;
}

const Header = ({  darkMode, setDarkMode, currentLanguage, changeLanguage  }: HeaderProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('common'); // 'common' namespace'ini kullanıyoruz

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar disableGutters sx={{ justifyContent: 'space-between', px: 2 }}>
        {/* Sol taraf: Logo + Menü */}
        <Box display="flex" alignItems="center" gap={2}>
          <Box sx={{ ml: 0 }}>
            <img src="/Babusiness.png" alt="BaBusiness Logo" style={{ height: 90, borderRadius: 50 }} />
          </Box>

          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{
              height: 36,
              minWidth: 90,
              borderRadius: 6,
              textTransform: 'none',
              color: 'inherit',
              borderColor: 'inherit',
            }}
          >
            {t('home')}
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate('/sections')}
            sx={{
              height: 36,
              minWidth: 90,
              borderRadius: 6,
              textTransform: 'none',
              color: 'inherit',
              borderColor: 'inherit',
            }}
          >
            {t('about')}
          </Button>
        </Box>

        {/* Sağ taraf: Tema, Dil, Giriş/Kayıt */}
        <Box display="flex" alignItems="center" gap={2} sx={{ mr: 3 }}>
          <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          <LanguageSwitcher 
        currentLanguage={currentLanguage}
        changeLanguage={changeLanguage}
      />

          <Button
            variant="outlined"
            onClick={() => navigate('/login')}
            sx={{
              height: 36,
              minWidth: 90,
              borderRadius: 6,
              textTransform: 'none',
              color: 'inherit',
              borderColor: 'inherit',
            }}
          >
            {t('login')}
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate('/signup')}
            sx={{
              height: 36,
              minWidth: 90,
              borderRadius: 6,
              textTransform: 'none',
              backgroundColor: '#f4a261',
              '&:hover': { backgroundColor: '#e76f51' },
            }}
          >
            {t('register')}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

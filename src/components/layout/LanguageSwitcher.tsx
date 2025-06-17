import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import Flag from 'react-world-flags';
import i18n from '../../i18n';

interface LanguageSwitcherProps {
  currentLanguage?: string;
  changeLanguage?: (lng: string) => void;
}

const LanguageSwitcher = ({
  currentLanguage = 'tr',
  changeLanguage,
}: LanguageSwitcherProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation('common');

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      localStorage.setItem('i18nextLng', lng);
      changeLanguage?.(lng);
      window.location.reload();
    } catch (error) {
      console.error('Dil değiştirme hatası:', error);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        color="inherit"
        aria-label="change language"
        aria-controls="language-menu"
        aria-haspopup="true"
        size="large"
      >
        <LanguageIcon />
        <Typography variant="caption" sx={{ ml: 0.5 }}>
          {currentLanguage.toUpperCase()}
        </Typography>
      </IconButton>

      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleLanguageChange('tr')}>
          <Flag code="TR" style={{ width: 24, marginRight: 8 }} />
          {t('languages.tr') || 'Türkçe'}
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange('en')}>
          <Flag code="GB" style={{ width: 24, marginRight: 8 }} />
          {t('languages.en') || 'English'}
        </MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSwitcher;

import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Theme,
  Toolbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import MenuIcon from '@mui/icons-material/Menu';

import { FaBell } from 'react-icons/fa';

import './Navbar.css';
import { useAuth } from '../../context/AuthContext';
import notificationService from '../../services/NotificationService';
import { useNotifications } from '../../context/notificationsContext';
import ErrorBoundary from '../common/ErrorBoundary';
import NotificationDropdown from './NotificationDropdown';


type Props = {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  theme: Theme;
  onLogoClick?: () => void;
};

const Navbar: React.FC<Props> = ({ darkMode, setDarkMode, theme, onLogoClick }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const { setUnreadCount } = useNotifications();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const interval = setInterval(async () => {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    }, 3000);

    return () => clearInterval(interval);
  }, [setUnreadCount]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleMenuClose();
  };
  const handleSectionsClick = () => {
    if (!isAuthenticated) navigate('/');
    else navigate('/sections');
  };
 

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'rgba(255, 255, 255, 0)' }}>
      <Toolbar disableGutters sx={{ justifyContent: 'space-between', px: 2 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box sx={{ ml: 0, cursor: 'pointer' }} onClick={onLogoClick}>
            <img src="/Babusiness.png" alt="BaBusiness Logo" style={{ height: 90, borderRadius: 50 }} />
          </Box>

          <Button variant="outlined" onClick={() => navigate('/')} sx={{
            height: 36, minWidth: 90, borderRadius: 6, textTransform: 'none',
            color: theme.palette.text.primary,
            borderColor: theme.palette.text.primary,
          }}>
            ANA SAYFA
          </Button>

          <Button variant="outlined" onClick={handleSectionsClick} sx={{
            height: 36, minWidth: 90, borderRadius: 6, textTransform: 'none',
            color: theme.palette.text.primary,
            borderColor: theme.palette.text.primary,
          }}>
            HAKKIMIZDA
          </Button>
        </Box>

        <Box display="flex" alignItems="center" gap={2} sx={{ mr: 3 }}>
          <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {isAuthenticated ? (
            <>
              <ErrorBoundary>
                <NotificationDropdown />
              </ErrorBoundary>

              <IconButton onClick={handleMenuOpen}>
                <Avatar alt="User Avatar" src="/avatar.jpg" />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1,
                    minWidth: 180,
                    borderRadius: 2,
                    px: 1,
                    py: 0.5,
                    bgcolor: theme.palette.background.paper,
                    boxShadow: theme.shadows[4],
                    '& .MuiMenuItem-root': {
                      borderRadius: 1,
                      fontSize: 14,
                      px: 2,
                      py: 1,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        bgcolor: theme.palette.action.hover,
                      },
                    },
                  },
                }}
              >
                <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
                  Profilim
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
                  Ayarlar
                </MenuItem>
                <MenuItem onClick={handleLogout}>Çıkış Yap</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button variant="outlined" onClick={() => navigate('/login')} sx={{
                height: 36, minWidth: 90, borderRadius: 6, textTransform: 'none',
                color: theme.palette.text.primary,
                borderColor: theme.palette.text.primary,
              }}>
                Giriş Yap
              </Button>

              <Button variant="contained" onClick={() => navigate('/signup')} sx={{
                height: 36, minWidth: 90, borderRadius: 6, textTransform: 'none',
                backgroundColor: '#f4a261',
                transition: '0.3s',
                transform: 'scale(1)',
                '&:hover': {
                  backgroundColor: '#e76f51',
                  boxShadow: '0 0 15px #f4a261',
                  transform: 'scale(1.05)',
                },
              }}>
                Kayıt Ol
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;




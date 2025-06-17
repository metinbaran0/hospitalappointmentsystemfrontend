import React from 'react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

type LeftDrawerProps = {
    open: boolean;
    onClose: () => void;
};

const LeftDrawer: React.FC<LeftDrawerProps> = ({ open, onClose }) => {
    const navigate = useNavigate();

    const drawerItems = [
        { label: 'Yeni Proje', path: '/new-project' },
        { label: 'Proje Listesi', path: '/project-list' },
        { label: 'Müşteriler', path: '/customers' },
    ];

    return (
        <Drawer anchor="left" open={open} onClose={onClose}>
            <Box
                sx={{
                    width: 260,
                    height: '100%',
                    bgcolor: 'background.paper',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    py: 3,
                }}
                role="presentation"
                onClick={onClose}
                onKeyDown={onClose}
            >
                <Box sx={{ px: 3, mb: 2 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            opacity: 0.8,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                        }}
                    >
                        Menü
                    </Typography>
                </Box>

                <List sx={{ px: 1 }}>
                    {drawerItems.map((item, index) => (
                        <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1.2,
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontSize: 15,
                                        fontWeight: 500,
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};

export default LeftDrawer;

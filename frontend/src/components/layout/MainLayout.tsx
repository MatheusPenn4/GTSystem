import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  styled,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  DirectionsCar as VehicleIcon,
  Person as PersonIcon,
  LocalParking as ParkingIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

interface MainLayoutProps {
  children: React.ReactNode;
}

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    background:
      theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
        : 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%)',
    borderRight: 'none',
    boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
  },
}));

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isMobile',
})<{
  open?: boolean;
  isMobile?: boolean;
}>(({ theme, open, isMobile }) => ({
  flexGrow: 1,
  padding: 0,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: isMobile ? 0 : `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: isMobile ? 0 : 0,
  }),
}));

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Empresas', icon: <BusinessIcon />, path: '/companies' },
  { text: 'Veículos', icon: <VehicleIcon />, path: '/vehicles' },
  { text: 'Motoristas', icon: <PersonIcon />, path: '/drivers' },
  { text: 'Estacionamentos', icon: <ParkingIcon />, path: '/estacionamentos' },
  { text: 'Configurações', icon: <SettingsIcon />, path: '/settings' },
];

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.username) return user.username.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(90deg, #1a237e 0%, #1976d2 50%, #42a5f5 100%)'
              : 'linear-gradient(90deg, #3b4cca 0%, #1a237e 50%, #1976d2 100%)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gestão AJH
          </Typography>

          {/* User Menu */}
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            color="inherit"
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: theme.palette.primary.main,
                fontSize: '0.875rem',
                fontWeight: 'bold',
              }}
            >
              {getUserInitial()}
            </Avatar>
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              },
            }}
          >
            <MenuItem disabled>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="subtitle2">
                  {user?.name || user?.username || user?.email || 'Usuário'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate('/profile');
              }}
            >
              <ListItemIcon>
                <AccountIcon fontSize="small" />
              </ListItemIcon>
              Perfil
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Sair
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <StyledDrawer
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <Toolbar />
        <List sx={{ padding: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setOpen(false);
                }}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&.Mui-selected': {
                    background:
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(25,118,210,0.3) 0%, rgba(33,150,243,0.2) 100%)'
                        : 'linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(33,150,243,0.08) 100%)',
                    '&:hover': {
                      background:
                        theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, rgba(25,118,210,0.4) 0%, rgba(33,150,243,0.3) 100%)'
                          : 'linear-gradient(135deg, rgba(25,118,210,0.15) 0%, rgba(33,150,243,0.12) 100%)',
                    },
                  },
                  '&:hover': {
                    background:
                      theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                    minWidth: '40px',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    noWrap: true,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </StyledDrawer>

      <Main open={open} isMobile={isMobile}>
        <Toolbar sx={{ minHeight: { xs: '56px', sm: '64px' } }} />
        <Box
          component="div"
          sx={{
            width: '100%',
            paddingX: { xs: 2, sm: 3, md: 4 },
            paddingBottom: { xs: 2, sm: 3 },
            overflowY: 'auto',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background:
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.2)'
                  : theme.palette.primary.main,
              borderRadius: '4px',
            },
            scrollBehavior: 'smooth',
          }}
        >
          {children}
        </Box>
      </Main>
    </Box>
  );
};

export default MainLayout;

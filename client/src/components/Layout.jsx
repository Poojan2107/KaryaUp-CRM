import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  AppBar, Toolbar, Typography, IconButton, Snackbar, Alert, Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HistoryIcon from '@mui/icons-material/History';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useApp } from '../context/AppContext';

const DRAWER_WIDTH = 260;

const NAV = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Contacts', path: '/contacts', icon: <PeopleIcon /> },
  { label: 'Deals', path: '/deals', icon: <AttachMoneyIcon /> },
  { label: 'Activities', path: '/activities', icon: <HistoryIcon /> },
];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode, snackbar, closeSnackbar } = useApp();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: 1300, bgcolor: '#7C3AED', boxShadow: 'none', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 800, flexGrow: 1, letterSpacing: 1.5, fontSize: '1.1rem' }}>
            KARYAUP <Box component="span" sx={{ fontWeight: 300, opacity: 0.7 }}>CRM</Box>
          </Typography>
          <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
            <IconButton color="inherit" onClick={toggleDarkMode} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{
        width: DRAWER_WIDTH, flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH, boxSizing: 'border-box', borderRight: 'none',
          bgcolor: '#F3F0FF', pt: 1,
        },
      }}>
        <Toolbar />
        <List sx={{ px: 1.5 }}>
          {NAV.map((item) => {
            const selected = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={selected}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 3, py: 1.2, px: 2,
                    '&.Mui-selected': {
                      bgcolor: '#7C3AED', color: '#fff',
                      '&:hover': { bgcolor: '#6B46C1' },
                      '& .MuiListItemIcon-root': { color: '#fff' },
                    },
                    '&:not(.Mui-selected):hover': { bgcolor: 'rgba(124,58,237,0.08)' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 38, color: selected ? '#fff' : '#7C3AED' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: selected ? 700 : 500,
                      fontSize: '0.9rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <Box component="main" sx={{
        flexGrow: 1, p: { xs: 2, md: 4 },
        minHeight: '100vh',
        bgcolor: '#F7F5FF',
      }}>
        <Toolbar />
        {children}
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} onClose={closeSnackbar}
          variant="filled" sx={{ width: '100%', borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

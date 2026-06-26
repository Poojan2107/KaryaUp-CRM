import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import ContactDetail from './pages/ContactDetail';
import Deals from './pages/Deals';
import DealDetail from './pages/DealDetail';
import Activities from './pages/Activities';
import { AppProvider, useApp } from './context/AppContext';

const BRAND = {
  purple: '#7C3AED',
  purpleHover: '#6B46C1',
  purpleLight: '#F3F0FF',
  bg: '#F7F5FF',
  text: '#090F19',
};

function ThemedApp() {
  const { darkMode } = useApp();

  const theme = createTheme({
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
    },
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: BRAND.purple, dark: BRAND.purpleHover, light: BRAND.purpleLight },
      background: darkMode ? undefined : { default: BRAND.bg, paper: '#FFFFFF' },
      text: darkMode ? undefined : { primary: BRAND.text },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 12,
            padding: '8px 20px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': { boxShadow: '0 4px 14px rgba(124,58,237,0.35)' },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
            border: '1px solid #ede9fe',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              fontWeight: 600,
              backgroundColor: BRAND.purpleLight,
              color: BRAND.text,
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: 16 },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 500 },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/contacts/:id" element={<ContactDetail />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/deals/:id" element={<DealDetail />} />
          <Route path="/activities" element={<Activities />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ThemedApp />
    </AppProvider>
  );
}

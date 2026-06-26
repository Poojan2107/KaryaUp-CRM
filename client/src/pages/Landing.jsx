import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Container, Grid, Typography, Card, CardContent, AppBar, Toolbar, IconButton,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HistoryIcon from '@mui/icons-material/History';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import StorageIcon from '@mui/icons-material/Storage';
import CloudIcon from '@mui/icons-material/Cloud';
import { useApp } from '../context/AppContext';

const FEATURES = [
  { icon: <DashboardIcon sx={{ fontSize: 40 }} />, title: 'Dashboard Analytics', desc: 'Real-time KPIs, pipeline charts, win rate tracking, and revenue forecasts at a glance.' },
  { icon: <PeopleIcon sx={{ fontSize: 40 }} />, title: 'Contact Management', desc: 'Full CRM contacts with search, enrichment, deal history, and detailed profiles.' },
  { icon: <AttachMoneyIcon sx={{ fontSize: 40 }} />, title: 'Deals Pipeline', desc: 'Drag-and-drop Kanban board with inline editing, column totals, and stage analytics.' },
  { icon: <HistoryIcon sx={{ fontSize: 40 }} />, title: 'Activity Tracking', desc: 'Log calls, emails, meetings, and tasks with completion tracking and type filters.' },
];

const STATS = [
  { value: '6', label: 'Pipeline Stages' },
  { value: '3', label: 'Export Formats' },
  { value: '2', label: 'Theme Modes' },
  { value: '1hr', label: 'Build Time' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useApp();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box sx={{ bgcolor: '#F7F5FF', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ bgcolor: '#7C3AED', boxShadow: 'none', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 800, flexGrow: 1, letterSpacing: 1.5, fontSize: { xs: '0.95rem', md: '1.1rem' } }}>
            KARYAUP <Box component="span" sx={{ fontWeight: 300, opacity: 0.7 }}>CRM</Box>
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button color="inherit" onClick={() => scrollTo('features')} sx={{ display: { xs: 'none', md: 'inline-flex' }, textTransform: 'none' }}>Features</Button>
            <Button color="inherit" onClick={() => scrollTo('tech')} sx={{ display: { xs: 'none', md: 'inline-flex' }, textTransform: 'none' }}>Tech Stack</Button>
            <IconButton color="inherit" onClick={toggleDarkMode} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ pt: { xs: 10, md: 14 }, pb: { xs: 6, md: 10 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={800} sx={{
            color: '#090F19', fontSize: { xs: '2rem', md: '3.5rem' }, lineHeight: 1.1, mb: 2,
            '@keyframes fadeIn': { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
            animation: 'fadeIn 0.6s ease-out',
          }}>
            Manage Your Pipeline.{' '}
            <Box component="span" sx={{ color: '#7C3AED' }}>Close More Deals.</Box>
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{
            mb: 4, fontWeight: 400, maxWidth: 600, mx: 'auto', lineHeight: 1.6, fontSize: { xs: '1rem', md: '1.2rem' },
            '@keyframes fadeInUp': { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
            animation: 'fadeInUp 0.6s ease-out 0.2s both',
          }}>
            A full-stack CRM built in under an hour. Drag-and-drop Kanban, real-time analytics, and activity tracking — all deployed and ready.
          </Typography>
          <Box sx={{
            display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap',
            '@keyframes fadeInUp': { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
            animation: 'fadeInUp 0.6s ease-out 0.4s both',
          }}>
            <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{ px: 4, py: 1.5, fontSize: '1rem', bgcolor: '#7C3AED', '&:hover': { bgcolor: '#6B46C1', boxShadow: '0 8px 25px rgba(124,58,237,0.4)' } }}>
              Launch Demo
            </Button>
            <Button variant="outlined" size="large"
              onClick={() => navigate('/contacts')}
              sx={{ px: 4, py: 1.5, fontSize: '1rem', borderColor: '#7C3AED', color: '#7C3AED', '&:hover': { borderColor: '#6B46C1', bgcolor: '#F3F0FF' } }}>
              View Contacts
            </Button>
          </Box>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="center">
            {STATS.map((s) => (
              <Grid item xs={6} md={3} key={s.label}>
                <Box sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="h3" fontWeight={800} sx={{ color: '#7C3AED', fontSize: { xs: '2rem', md: '3rem' } }}>{s.value}</Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>{s.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 8 } }} id="features">
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" sx={{ mb: { xs: 4, md: 6 }, fontSize: { xs: '1.5rem', md: '2rem' } }}>
            Everything you need in a <Box component="span" sx={{ color: '#7C3AED' }}>CRM</Box>
          </Typography>
          <Grid container spacing={3}>
            {FEATURES.map((f, i) => (
              <Grid item xs={12} sm={6} md={3} key={f.title}>
                <Card sx={{
                  height: '100%', borderRadius: 3, border: '1px solid #ede9fe',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(124,58,237,0.12)' },
                  '@keyframes slideUp': { '0%': { opacity: 0, transform: 'translateY(30px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
                  animation: `slideUp 0.5s ease-out ${0.1 * i}s both`,
                }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ color: '#7C3AED', mb: 2 }}>{f.icon}</Box>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1, fontSize: '1rem' }}>{f.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{f.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: '#fff' }} id="tech">
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" sx={{ mb: { xs: 4, md: 6 }, fontSize: { xs: '1.5rem', md: '2rem' } }}>
            Built with <Box component="span" sx={{ color: '#7C3AED' }}>Modern Stack</Box>
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ color: '#7C3AED', mb: 1 }}><StorageIcon sx={{ fontSize: 36 }} /></Box>
                <Typography variant="h6" fontWeight={600}>MongoDB Atlas</Typography>
                <Typography variant="body2" color="text.secondary">Cloud document database with Mongoose ODM</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ color: '#7C3AED', mb: 1 }}><DeviceHubIcon sx={{ fontSize: 36 }} /></Box>
                <Typography variant="h6" fontWeight={600}>Express + React</Typography>
                <Typography variant="body2" color="text.secondary">REST API with Material UI frontend</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ color: '#7C3AED', mb: 1 }}><CloudIcon sx={{ fontSize: 36 }} /></Box>
                <Typography variant="h6" fontWeight={600}>Vercel</Typography>
                <Typography variant="body2" color="text.secondary">Serverless deployment with auto-scaling</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={700} sx={{ mb: 2, fontSize: { xs: '1.5rem', md: '2rem' } }}>
            Ready to explore?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, px: 2 }}>
            Pre-loaded with Indian companies and sample data. No setup required — just click and explore.
          </Typography>
          <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ px: 5, py: 1.5, fontSize: '1.1rem', bgcolor: '#7C3AED', '&:hover': { bgcolor: '#6B46C1', boxShadow: '0 8px 25px rgba(124,58,237,0.4)' } }}>
            Launch CRM Demo
          </Button>
        </Container>
      </Box>

      <Box sx={{ py: 3, borderTop: '1px solid #ede9fe', textAlign: 'center', px: 2 }}>
        <Typography variant="caption" color="text.secondary">
          KaryaUP CRM Demo · Built in under 1 hour for interview showcase
        </Typography>
      </Box>
    </Box>
  );
}

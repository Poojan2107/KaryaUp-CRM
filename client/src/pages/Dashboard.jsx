import { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, Skeleton,
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useApp } from '../context/AppContext';

const PIE_COLORS = ['#e0e0e0', '#a78bfa', '#c4b5fd', '#7C3AED', '#6B46C1', '#ef9a9a'];
const STAGE_ORDER = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

function StatCard({ title, value, icon, loading }) {
  return (
    <Card sx={{ height: '100%', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 25px rgba(124,58,237,0.15)' } }}>
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="text.secondary" variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>{title}</Typography>
            {loading ? <Skeleton width={80} height={36} /> : <Typography variant="h4" fontWeight={700} sx={{ color: '#090F19' }}>{value}</Typography>}
          </Box>
          <Box sx={{ bgcolor: '#F3F0FF', borderRadius: 2, p: 1.5, display: 'flex' }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { contacts, deals, fetchContacts, fetchDeals } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchContacts(), fetchDeals()]).finally(() => setLoading(false));
  }, []);

  const activeDeals = deals.filter((d) => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost');
  const totalPipeline = activeDeals.reduce((sum, d) => sum + d.value, 0);
  const wonDeals = deals.filter((d) => d.stage === 'Closed Won');
  const wonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);

  const stageCountData = STAGE_ORDER.map((stage) => ({
    name: stage,
    count: deals.filter((d) => d.stage === stage).length,
  }));

  const stageValueData = STAGE_ORDER.map((stage) => ({
    name: stage,
    value: deals.filter((d) => d.stage === stage).reduce((s, d) => s + d.value, 0),
  }));

  const pieData = STAGE_ORDER.map((stage) => ({
    name: stage,
    value: deals.filter((d) => d.stage === stage).length,
  })).filter((d) => d.value > 0);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        Dashboard <Box component="span" sx={{ color: '#7C3AED' }}>Overview</Box>
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Track your pipeline performance and team metrics
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Contacts" value={contacts.length} loading={loading} icon={<PeopleIcon sx={{ color: '#7C3AED' }} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Deals" value={activeDeals.length} loading={loading} icon={<AttachMoneyIcon sx={{ color: '#7C3AED' }} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pipeline Value" loading={loading} value={`$${totalPipeline.toLocaleString()}`} icon={<TrendingUpIcon sx={{ color: '#7C3AED' }} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Closed Won" loading={loading} value={`$${wonValue.toLocaleString()}`} icon={<CheckCircleIcon sx={{ color: '#7C3AED' }} />} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 8px 25px rgba(124,58,237,0.12)' } }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Deals by <Box component="span" sx={{ color: '#7C3AED' }}>Stage</Box></Typography>
              {loading ? <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} /> : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stageCountData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" angle={-20} textAnchor="end" height={60} fontSize={12} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#7C3AED" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 8px 25px rgba(124,58,237,0.12)' } }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Pipeline <Box component="span" sx={{ color: '#7C3AED' }}>Distribution</Box></Typography>
              {loading ? <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto' }} /> : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 8px 25px rgba(124,58,237,0.12)' } }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Value by <Box component="span" sx={{ color: '#7C3AED' }}>Stage ($)</Box></Typography>
              {loading ? <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} /> : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stageValueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" angle={-20} textAnchor="end" height={60} fontSize={12} />
                    <YAxis />
                    <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                    <Bar dataKey="value" fill="#7C3AED" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

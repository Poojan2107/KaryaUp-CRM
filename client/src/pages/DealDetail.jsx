import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Button, Grid, Chip, List, ListItem,
  ListItemText, ListItemIcon, Skeleton, Avatar, Divider, IconButton, Tooltip,
} from '@mui/material';
import {
  ArrowBack, Edit, Delete, Phone, Email, MeetingRoom, NoteAlt, Task,
  Business, Person, AttachMoney, History, Circle,
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import { formatCurrency, relativeTime, formatDate, stageColor } from '../utils/format';

const ACTIVITY_ICONS = { Call: <Phone fontSize="small" />, Email: <Email fontSize="small" />, Meeting: <MeetingRoom fontSize="small" />, Note: <NoteAlt fontSize="small" />, Task: <Task fontSize="small" /> };

export default function DealDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contacts, deals, fetchDeals, fetchContacts, fetchDealActivities, updateDeal, deleteDeal, showSnackbar } = useApp();
  const [dealActivities, setDealActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const deal = deals.find((d) => d._id === id);
  const contact = deal ? contacts.find((c) => c._id === String(deal.contactId)) : null;

  useEffect(() => {
    Promise.all([fetchDeals(), fetchContacts(), loadActivities()]).finally(() => setLoading(false));
  }, [id]);

  const loadActivities = async () => {
    try {
      const data = await fetchDealActivities(id);
      setDealActivities(data);
    } catch {}
  };

  const handleDelete = async () => {
    if (!deal) return;
    if (window.confirm(`Delete deal "${deal.title}"?`)) {
      try { await deleteDeal(deal._id); showSnackbar('Deal deleted'); navigate('/deals'); }
      catch { showSnackbar('Delete failed', 'error'); }
    }
  };

  if (loading) return <Box><Skeleton height={40} width={200} /><Skeleton height={300} sx={{ mt: 2, borderRadius: 3 }} /></Box>;
  if (!deal) return <Box><Button startIcon={<ArrowBack />} onClick={() => navigate('/deals')} sx={{ mb: 2, color: '#7C3AED' }}>Back to Deals</Button><Typography>Deal not found</Typography></Box>;

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/deals')} sx={{ mb: 2, color: '#7C3AED', fontWeight: 500 }}>
        Back to Pipeline
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, border: '1px solid #ede9fe', height: '100%' }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: '#7C3AED', fontWeight: 700, fontSize: 24 }}>
                  {deal.title.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight={700}>{deal.title}</Typography>
                  <Chip label={deal.stage} size="small" color={stageColor(deal.stage)} sx={{ mt: 0.5 }} />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 3 }}>
                <Typography variant="h3" fontWeight={800} sx={{ color: '#7C3AED' }}>{formatCurrency(deal.value)}</Typography>
                <Typography variant="body2" color="text.secondary">USD</Typography>
              </Box>

              <Divider sx={{ my: 2, borderColor: '#ede9fe' }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {deal.company && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Business fontSize="small" sx={{ color: '#7C3AED' }} />
                    <Typography variant="body2">{deal.company}</Typography>
                  </Box>
                )}
                {contact && (
                  <Box
                    onClick={() => navigate(`/contacts/${contact._id}`)}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { '& .contact-name': { color: '#7C3AED' } } }}
                  >
                    <Person fontSize="small" sx={{ color: '#7C3AED' }} />
                    <Typography variant="body2" className="contact-name" sx={{ transition: 'color 0.2s' }}>{contact.name}</Typography>
                  </Box>
                )}
              </Box>

              {deal.notes && (
                <>
                  <Divider sx={{ my: 2, borderColor: '#ede9fe' }} />
                  <Typography variant="body2" color="text.secondary">{deal.notes}</Typography>
                </>
              )}

              <Divider sx={{ my: 2, borderColor: '#ede9fe' }} />
              <Typography variant="caption" color="text.secondary" display="block">
                Created {relativeTime(deal.createdAt)} · Updated {relativeTime(deal.updatedAt)}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button size="small" variant="contained" startIcon={<Edit />}>Edit Deal</Button>
                <Button size="small" variant="outlined" color="error" startIcon={<Delete />} onClick={handleDelete}>Delete</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3, border: '1px solid #ede9fe' }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <History sx={{ color: '#7C3AED' }} />
                <Typography variant="h6" fontWeight={700}>
                  Activity <Box component="span" sx={{ color: '#7C3AED', fontWeight: 300 }}>({dealActivities.length})</Box>
                </Typography>
              </Box>
              {dealActivities.length === 0 ? (
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <History sx={{ fontSize: 48, color: '#ede9fe', mb: 1 }} />
                  <Typography color="text.secondary">No activities for this deal yet</Typography>
                </Box>
              ) : (
                <List>
                  {dealActivities.map((a) => (
                    <ListItem key={a._id} sx={{ px: 0, borderBottom: '1px solid #ede9fe', '&:last-child': { borderBottom: 'none' } }}>
                      <ListItemIcon sx={{ minWidth: 40, color: '#7C3AED' }}>{ACTIVITY_ICONS[a.type] || <NoteAlt />}</ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Chip label={a.type} size="small" color={stageColor(a.type)} />
                            <Typography variant="body2" fontWeight={500}>{a.subject}</Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.3 }}>
                            {a.description && <Typography variant="body2" color="text.secondary">{a.description}</Typography>}
                            <Typography variant="caption" color="text.secondary">
                              {a.contactId?.name && `By: ${a.contactId.name} · `}
                              {relativeTime(a.createdAt)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Button, Grid, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, List, ListItem, ListItemText,
  ListItemIcon, Divider, Skeleton, Avatar,
} from '@mui/material';
import {
  ArrowBack, Phone, Email, Business, Work, Edit, Delete,
  Call, MeetingRoom, NoteAlt, Task, AttachMoney, History, Circle,
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const STAGE_COLORS = { Lead: 'default', Qualified: 'primary', Proposal: 'warning', Negotiation: 'warning', 'Closed Won': 'success', 'Closed Lost': 'error' };
const ACTIVITY_ICONS = { Call: <Call fontSize="small" />, Email: <Email fontSize="small" />, Meeting: <MeetingRoom fontSize="small" />, Note: <NoteAlt fontSize="small" />, Task: <Task fontSize="small" /> };

export default function ContactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contacts, deals, activities, fetchContacts, fetchDeals, fetchActivities, deleteContact, showSnackbar } = useApp();
  const [loading, setLoading] = useState(true);

  const contact = contacts.find((c) => c._id === id);
  const contactDeals = deals.filter((d) => String(d.contactId) === id);
  const contactActivities = activities.filter((a) => String(a.contactId) === id);

  useEffect(() => {
    Promise.all([fetchContacts(), fetchDeals(), fetchActivities()]).finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (window.confirm(`Delete contact "${contact?.name}"?`)) {
      try { await deleteContact(id); showSnackbar('Contact deleted'); navigate('/contacts'); }
      catch { showSnackbar('Delete failed', 'error'); }
    }
  };

  if (loading) return <Box><Skeleton height={40} width={200} /><Skeleton height={250} sx={{ mt: 2, borderRadius: 3 }} /><Skeleton height={200} sx={{ mt: 2, borderRadius: 3 }} /></Box>;
  if (!contact) return <Typography>Contact not found</Typography>;

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/contacts')} sx={{ mb: 2, color: '#7C3AED', fontWeight: 500 }}>
        Back to Contacts
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, height: '100%', border: '1px solid #ede9fe' }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: '#7C3AED', mb: 1.5, fontSize: 32, fontWeight: 700 }}>
                  {contact.name.charAt(0)}
                </Avatar>
                <Typography variant="h5" fontWeight={700}>{contact.name}</Typography>
                <Typography variant="body2" color="text.secondary">{contact.role || 'No role specified'}</Typography>
              </Box>

              <Divider sx={{ my: 2, borderColor: '#ede9fe' }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {contact.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email fontSize="small" sx={{ color: '#7C3AED' }} />
                    <Typography variant="body2">{contact.email}</Typography>
                  </Box>
                )}
                {contact.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone fontSize="small" sx={{ color: '#7C3AED' }} />
                    <Typography variant="body2">{contact.phone}</Typography>
                  </Box>
                )}
                {contact.company && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Business fontSize="small" sx={{ color: '#7C3AED' }} />
                    <Typography variant="body2">{contact.company}</Typography>
                  </Box>
                )}
                {contact.role && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Work fontSize="small" sx={{ color: '#7C3AED' }} />
                    <Typography variant="body2">{contact.role}</Typography>
                  </Box>
                )}
              </Box>

              {contact.notes && (
                <>
                  <Divider sx={{ my: 2, borderColor: '#ede9fe' }} />
                  <Typography variant="body2" color="text.secondary">{contact.notes}</Typography>
                </>
              )}

              <Divider sx={{ my: 2, borderColor: '#ede9fe' }} />
              <Typography variant="caption" color="text.secondary">
                Created: {new Date(contact.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button size="small" variant="outlined" startIcon={<Edit />}
                  sx={{ borderColor: '#7C3AED', color: '#7C3AED', '&:hover': { borderColor: '#6B46C1', bgcolor: '#F3F0FF' } }}>
                  Edit
                </Button>
                <Button size="small" variant="outlined" color="error" startIcon={<Delete />} onClick={handleDelete}>
                  Delete
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, mb: 3, border: '1px solid #ede9fe' }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AttachMoney sx={{ color: '#7C3AED' }} />
                <Typography variant="h6" fontWeight={700}>
                  Deals <Box component="span" sx={{ color: '#7C3AED', fontWeight: 300 }}>({contactDeals.length})</Box>
                </Typography>
              </Box>
              {contactDeals.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>No deals for this contact</Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Stage</TableCell>
                        <TableCell>Company</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {contactDeals.map((d) => (
                        <TableRow key={d._id} hover>
                          <TableCell><Typography fontWeight={500}>{d.title}</Typography></TableCell>
                          <TableCell sx={{ color: '#7C3AED', fontWeight: 600 }}>${d.value?.toLocaleString()}</TableCell>
                          <TableCell><Chip label={d.stage} size="small" color={STAGE_COLORS[d.stage] || 'default'} /></TableCell>
                          <TableCell>{d.company || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, border: '1px solid #ede9fe' }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <History sx={{ color: '#7C3AED' }} />
                <Typography variant="h6" fontWeight={700}>
                  Activity <Box component="span" sx={{ color: '#7C3AED', fontWeight: 300 }}>({contactActivities.length})</Box>
                </Typography>
              </Box>
              {contactActivities.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>No activities logged for this contact</Typography>
              ) : (
                <List>
                  {contactActivities.map((a) => (
                    <ListItem key={a._id} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40, color: '#7C3AED' }}>{ACTIVITY_ICONS[a.type] || <NoteAlt />}</ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip label={a.type} size="small" color={STAGE_COLORS[a.type] || 'default'} />
                            <Typography variant="body2" fontWeight={500}>{a.subject}</Typography>
                          </Box>
                        }
                        secondary={
                          <>
                            {a.description && <Typography variant="body2" color="text.secondary">{a.description}</Typography>}
                            <Typography variant="caption" color="text.secondary">
                              {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          </>
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

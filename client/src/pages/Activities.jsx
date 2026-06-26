import { useEffect, useState } from 'react';
import {
  Box, Button, Card, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel,
  FormControl, IconButton, Chip, List, ListItem, ListItemText, ListItemIcon,
  ToggleButtonGroup, ToggleButton, Tooltip,
} from '@mui/material';
import { Add, Delete, Phone, Email, MeetingRoom, NoteAlt, Task, PictureAsPdf, CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import { exportActivitiesPDF } from '../utils/export';

const TYPE_CONFIG = {
  Call: { icon: <Phone fontSize="small" />, color: 'primary' },
  Email: { icon: <Email fontSize="small" />, color: 'info' },
  Meeting: { icon: <MeetingRoom fontSize="small" />, color: 'warning' },
  Note: { icon: <NoteAlt fontSize="small" />, color: 'default' },
  Task: { icon: <Task fontSize="small" />, color: 'success' },
};

const EMPTY = { type: 'Note', subject: '', description: '', contactId: '', dealId: '' };

export default function Activities() {
  const { activities, contacts, deals, fetchActivities, fetchContacts, fetchDeals, createActivity, deleteActivity, updateActivity, showSnackbar } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => { fetchActivities(); fetchContacts(); fetchDeals(); }, []);

  const filtered = typeFilter === 'All' ? activities : activities.filter((a) => a.type === typeFilter);

  const handleCreate = async () => {
    try {
      await createActivity({ ...form, contactId: form.contactId || undefined, dealId: form.dealId || undefined });
      setForm(EMPTY); setOpen(false);
      showSnackbar('Activity logged');
    } catch { showSnackbar('Failed to log activity', 'error'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this activity?')) {
      try { await deleteActivity(id); showSnackbar('Activity deleted'); }
      catch { showSnackbar('Delete failed', 'error'); }
    }
  };

  const toggleComplete = async (activity) => {
    await updateActivity(activity._id, { completed: !activity.completed });
    await fetchActivities();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h5">
          <Box component="span" sx={{ color: '#7C3AED' }}>Activity</Box> Log
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Track calls, emails, meetings and tasks</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <ToggleButtonGroup value={typeFilter} exclusive onChange={(_, v) => v && setTypeFilter(v)} size="small">
          <ToggleButton key="All" value="All" sx={{ borderRadius: 2, px: 2, fontWeight: 500 }}>
            All
          </ToggleButton>
          {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
            <ToggleButton key={type} value={type} sx={{ borderRadius: 2, px: 2 }}>
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>{cfg.icon} {type}</Box>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Export PDF">
            <IconButton onClick={() => exportActivitiesPDF(activities)} sx={{ border: '1px solid #ede9fe', borderRadius: 2 }}>
              <PictureAsPdf />
            </IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Log Activity</Button>
        </Box>
      </Box>

      <List>
        {filtered.map((a) => {
          const cfg = TYPE_CONFIG[a.type] || { icon: <NoteAlt />, color: 'default' };
          return (
            <Card key={a._id} sx={{ mb: 1.5, borderRadius: 3, opacity: a.completed ? 0.6 : 1, transition: 'opacity 0.3s', '&:hover': { boxShadow: '0 4px 12px rgba(124,58,237,0.1)' } }}>
              <ListItem
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton edge="end" onClick={() => toggleComplete(a)} size="small">
                      {a.completed ? <CheckCircle sx={{ color: '#7C3AED' }} /> : <RadioButtonUnchecked />}
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDelete(a._id)} color="error" size="small">
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemIcon sx={{ minWidth: 40, color: '#7C3AED' }}>{cfg.icon}</ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label={a.type} size="small" color={cfg.color} />
                      <Typography variant="body2" fontWeight={500} sx={{ textDecoration: a.completed ? 'line-through' : 'none' }}>
                        {a.subject}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      {a.description && <Typography variant="body2" color="text.secondary">{a.description}</Typography>}
                      <Typography variant="caption" color="text.secondary">
                        {a.contactId?.name && `With: ${a.contactId.name}`}
                        {a.dealId?.title && ` | Deal: ${a.dealId.title}`}
                        {` | ${new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
            {typeFilter === 'All' ? 'No activities logged yet' : `No ${typeFilter} activities`}
          </Typography>
        )}
      </List>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Log Activity</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Activity Type</InputLabel>
              <Select value={form.type} label="Activity Type" onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {Object.entries(TYPE_CONFIG).map(([t, cfg]) => (
                  <MenuItem key={t} value={t}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>{cfg.icon} {t}</Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <TextField label="Description" multiline rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <FormControl fullWidth>
              <InputLabel>Related Contact</InputLabel>
              <Select value={form.contactId} label="Related Contact" onChange={(e) => setForm({ ...form, contactId: e.target.value })}>
                <MenuItem value="">None</MenuItem>
                {contacts.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Related Deal</InputLabel>
              <Select value={form.dealId} label="Related Deal" onChange={(e) => setForm({ ...form, dealId: e.target.value })}>
                <MenuItem value="">None</MenuItem>
                {deals.map((d) => <MenuItem key={d._id} value={d._id}>{d.title}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!form.subject.trim()}>Log Activity</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

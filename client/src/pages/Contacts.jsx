import { useEffect, useState } from 'react';
import {
  Box, Button, TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Typography, Chip, Menu, MenuItem,
  TablePagination, InputAdornment, Tooltip, Avatar,
} from '@mui/material';
import { Edit, Delete, Add, MoreVert, PictureAsPdf, Download, Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { exportContactsPDF, exportContactsCSV } from '../utils/export';
import { relativeTime } from '../utils/format';

const EMPTY = { name: '', email: '', phone: '', company: '', role: '', notes: '' };

export default function Contacts() {
  const { contacts, deals, fetchContacts, createContact, updateContact, deleteContact, showSnackbar } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => { fetchContacts(); }, []);

  const handleSearch = (val) => { setSearch(val); setPage(0); fetchContacts(val); };
  const openCreate = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (c) => { setEditing(c); setForm({ ...c }); setOpen(true); };

  const handleSave = async () => {
    try {
      if (editing) { await updateContact(editing._id, form); showSnackbar('Contact updated'); }
      else { await createContact(form); showSnackbar('Contact created'); }
      setOpen(false);
    } catch { showSnackbar('Operation failed', 'error'); }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete "${name}"?`)) {
      try { await deleteContact(id); }
      catch { showSnackbar('Delete failed', 'error'); }
    }
  };

  const getDealCount = (contactId) => deals.filter((d) => String(d.contactId) === contactId).length;
  const getDealValue = (contactId) => deals.filter((d) => String(d.contactId) === contactId).reduce((s, d) => s + (d.value || 0), 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h5"><Box component="span" sx={{ color: '#7C3AED' }}>Contact</Box> Management</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{contacts.length} contacts · Manage leads and relationships</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <TextField size="small" placeholder="Search contacts..." value={search}
          onChange={(e) => handleSearch(e.target.value)} sx={{ width: 300 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#7C3AED' }} /></InputAdornment> }} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Export">
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ border: '1px solid #ede9fe', borderRadius: 2 }}><MoreVert /></IconButton>
          </Tooltip>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() => { setAnchorEl(null); exportContactsPDF(contacts); }}><PictureAsPdf sx={{ mr: 1, color: '#7C3AED' }} />PDF</MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); exportContactsCSV(contacts); }}><Download sx={{ mr: 1, color: '#7C3AED' }} />CSV</MenuItem>
          </Menu>
          <Button variant="contained" startIcon={<Add />} onClick={openCreate}>Add Contact</Button>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #ede9fe', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Company</TableCell>
                <TableCell align="center">Deals</TableCell>
                <TableCell>Value</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((c) => {
                const dealCount = getDealCount(c._id);
                const dealValue = getDealValue(c._id);
                return (
                  <TableRow key={c._id} hover sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#F3F0FF' } }}
                    onClick={() => navigate(`/contacts/${c._id}`)}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#7C3AED', fontSize: 14, fontWeight: 700 }}>
                          {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{c.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{c.role || '—'}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {c.email && <Typography variant="caption" display="block">{c.email}</Typography>}
                      {c.phone && <Typography variant="caption" color="text.secondary">{c.phone}</Typography>}
                    </TableCell>
                    <TableCell><Typography variant="body2">{c.company || '—'}</Typography></TableCell>
                    <TableCell align="center">
                      <Chip label={dealCount} size="small" color={dealCount > 0 ? 'primary' : 'default'} variant={dealCount > 0 ? 'filled' : 'outlined'} sx={{ minWidth: 32 }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={dealValue > 0 ? 600 : 400} sx={{ color: dealValue > 0 ? '#7C3AED' : 'text.secondary' }}>
                        {dealValue > 0 ? `$${dealValue.toLocaleString()}` : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <IconButton size="small" onClick={() => openEdit(c)} sx={{ color: '#7C3AED' }}><Edit fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => handleDelete(c._id, c.name)} color="error"><Delete fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {contacts.length === 0 && (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">No contacts yet. Click "Add Contact" to get started.</Typography>
                </TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={contacts.length} page={page}
          onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{editing ? 'Edit Contact' : 'New Contact'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField label="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextField label="Email Address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <TextField label="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <TextField label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            <TextField label="Job Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            <TextField label="Notes" multiline rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.name.trim()}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

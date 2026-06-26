import { useEffect, useState, useCallback } from 'react';
import {
  Box, Button, Card, CardContent, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel,
  FormControl, IconButton, Tooltip, Chip, Grid, InputAdornment,
} from '@mui/material';
import { Add, Edit, PictureAsPdf, Search as SearchIcon, OpenInNew, Close } from '@mui/icons-material';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { exportDealsPDF } from '../utils/export';
import { formatCurrency } from '../utils/format';

const STAGES = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
const STAGE_COLORS = { Lead: '#e0e0e0', Qualified: '#a78bfa', Proposal: '#fbbf24', Negotiation: '#fb923c', 'Closed Won': '#6B46C1', 'Closed Lost': '#fca5a5' };

const EMPTY = { title: '', value: '', stage: 'Lead', company: '', contactId: '', notes: '' };

function DealCard({ deal, onEdit, onValueEdit, onDelete }) {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: deal._id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <Card ref={setNodeRef} style={style} {...attributes} {...listeners} sx={{
      mb: 1.5, cursor: 'grab', borderRadius: 3, transition: 'all 0.2s',
      '&:hover': { boxShadow: '0 4px 12px rgba(124,58,237,0.15)', '& .deal-actions': { opacity: 1 } },
      borderLeft: '4px solid', borderColor: STAGE_COLORS[deal.stage] || 'grey.300',
    }}>
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 }, position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" fontWeight={600} noWrap>{deal.title}</Typography>
            <Box
              component="span"
              onClick={(e) => { e.stopPropagation(); onValueEdit(deal); }}
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: 0.5, cursor: 'pointer',
                color: '#7C3AED', fontWeight: 700, fontSize: '0.875rem', mt: 0.3,
                '&:hover': { textDecoration: 'underline', '& .edit-icon': { opacity: 1 } },
              }}
            >
              {formatCurrency(deal.value)}
              <Edit className="edit-icon" sx={{ fontSize: 12, opacity: 0, transition: 'opacity 0.2s' }} />
            </Box>
            {deal.company && <Typography variant="caption" display="block" color="text.secondary" noWrap>{deal.company}</Typography>}
          </Box>
          <Box className="deal-actions" sx={{ opacity: 0, transition: 'opacity 0.2s', display: 'flex', gap: 0.5, ml: 1 }}>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigate(`/deals/${deal._id}`); }} sx={{ color: '#7C3AED' }}>
              <OpenInNew fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function StageColumn({ stage, deals, totalValue, onEdit, onValueEdit, onDelete }) {
  return (
    <Box sx={{
      flex: 1, minWidth: 250, bgcolor: '#F3F0FF', borderRadius: 3, p: 1.5,
      display: 'flex', flexDirection: 'column', minHeight: 300, maxHeight: 'calc(100vh - 200px)', overflow: 'auto',
      border: '1px solid #ede9fe',
    }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 1.5, px: 0.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" fontWeight={700}>{stage}</Typography>
          <Chip label={deals.length} size="small" sx={{ fontWeight: 600, bgcolor: '#7C3AED', color: '#fff' }} />
        </Box>
        {deals.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.3, fontWeight: 500 }}>
            {formatCurrency(totalValue)}
          </Typography>
        )}
      </Box>
      <SortableContext items={deals.map((d) => d._id)} strategy={verticalListSortingStrategy}>
        {deals.map((deal) => (
          <DealCard key={deal._id} deal={deal} onEdit={onEdit} onValueEdit={onValueEdit} onDelete={onDelete} />
        ))}
      </SortableContext>
      {deals.length === 0 && (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2" color="text.secondary">Drop deals here</Typography>
        </Box>
      )}
    </Box>
  );
}

export default function Deals() {
  const { deals, contacts, fetchDeals, fetchContacts, createDeal, updateDeal, deleteDeal, showSnackbar } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editingDeal, setEditingDeal] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState('');
  const [valueEdit, setValueEdit] = useState(null);
  const [valueInput, setValueInput] = useState('');
  const [valueAnchor, setValueAnchor] = useState(null);

  useEffect(() => { fetchDeals(); fetchContacts(); }, []);

  const filteredDeals = deals.filter((d) =>
    !search || d.title.toLowerCase().includes(search.toLowerCase()) || d.company?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDragStart = (event) => setActiveId(event.active.id);
  const handleDragEnd = async (event) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const activeDeal = filteredDeals.find((d) => d._id === active.id);
    const overContainer = over.data.current?.sortable?.containerId || over.id;
    if (activeDeal && overContainer && activeDeal.stage !== overContainer) {
      await updateDeal(activeDeal._id, { ...activeDeal, stage: overContainer });
      await fetchDeals(search || undefined);
      showSnackbar(`Deal moved to ${overContainer}`);
    }
  };

  const openCreate = () => { setEditingDeal(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (deal) => { setEditingDeal(deal); setForm(deal); setOpen(true); };

  const handleSave = async () => {
    try {
      const payload = { ...form, value: Number(form.value) || 0, contactId: form.contactId || undefined };
      if (editingDeal) { await updateDeal(editingDeal._id, payload); showSnackbar('Deal updated'); }
      else { await createDeal(payload); showSnackbar('Deal created'); }
      setOpen(false);
    } catch { showSnackbar('Operation failed', 'error'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this deal?')) {
      try { await deleteDeal(id); }
      catch { showSnackbar('Delete failed', 'error'); }
    }
  };

  const handleValueEdit = (deal) => {
    setValueEdit(deal);
    setValueInput(String(deal.value || 0));
    setValueAnchor(true);
  };

  const handleValueSave = async () => {
    if (valueEdit) {
      const newVal = Number(valueInput) || 0;
      await updateDeal(valueEdit._id, { ...valueEdit, value: newVal });
      await fetchDeals(search || undefined);
      showSnackbar('Value updated');
      setValueEdit(null);
    }
  };

  const dealsByStage = Object.fromEntries(STAGES.map((s) => [s, filteredDeals.filter((d) => d.stage === s)]));
  const totalsByStage = Object.fromEntries(STAGES.map((s) => [s, (dealsByStage[s] || []).reduce((sum, d) => sum + (d.value || 0), 0)]));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5">
          <Box component="span" sx={{ color: '#7C3AED' }}>Deals</Box> Pipeline
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Drag deals across stages to update pipeline</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <TextField size="small" placeholder="Search deals..." value={search}
          onChange={(e) => { setSearch(e.target.value); fetchDeals(e.target.value || undefined); }}
          sx={{ width: 250 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#7C3AED' }} /></InputAdornment> }} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Export PDF">
            <IconButton onClick={() => exportDealsPDF(deals)} sx={{ border: '1px solid #ede9fe', borderRadius: 2 }}>
              <PictureAsPdf />
            </IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<Add />} onClick={openCreate}>Add Deal</Button>
        </Box>
      </Box>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Box sx={{ display: 'flex', gap: 2, overflow: 'auto', pb: 2, px: 0.5 }}>
          {STAGES.map((stage) => (
            <StageColumn key={stage} stage={stage}
              deals={dealsByStage[stage] || []}
              totalValue={totalsByStage[stage] || 0}
              onEdit={openEdit} onValueEdit={handleValueEdit} onDelete={handleDelete} />
          ))}
        </Box>
        <DragOverlay>
          {activeId ? <Card sx={{ p: 2, opacity: 0.8, boxShadow: 4 }}><Typography>Moving...</Typography></Card> : null}
        </DragOverlay>
      </DndContext>

      <Dialog open={Boolean(valueEdit)} onClose={() => setValueEdit(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Edit Deal Value
          <IconButton size="small" onClick={() => setValueEdit(null)}><Close fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField label="Value ($)" type="number" fullWidth autoFocus value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleValueSave(); if (e.key === 'Escape') setValueEdit(null); }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setValueEdit(null)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={handleValueSave}>Update Value</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingDeal ? 'Edit Deal' : 'New Deal'}
          <IconButton size="small" onClick={() => setOpen(false)}><Close fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField label="Deal Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Value ($)" type="number" fullWidth value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Stage</InputLabel>
                  <Select value={form.stage} label="Stage" onChange={(e) => setForm({ ...form, stage: e.target.value })}>
                    {STAGES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <TextField label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            <FormControl fullWidth>
              <InputLabel>Contact</InputLabel>
              <Select value={form.contactId} label="Contact" onChange={(e) => setForm({ ...form, contactId: e.target.value })}>
                <MenuItem value="">None</MenuItem>
                {contacts.map((c) => <MenuItem key={c._id} value={c._id}>{c.name} {c.company ? `(${c.company})` : ''}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Notes" multiline rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.title.trim()}>
            {editingDeal ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

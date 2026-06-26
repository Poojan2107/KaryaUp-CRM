import { createContext, useContext, useState, useCallback, useRef } from 'react';

const API = '/api';
const AppCtx = createContext(null);

async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export function AppProvider({ children }) {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success', action: null });
  const undoRef = useRef(null);

  const showSnackbar = useCallback((message, severity = 'success', action = null) => {
    setSnackbar({ open: true, message, severity, action });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const toggleDarkMode = useCallback(() => setDarkMode((prev) => !prev), []);

  const fetchContacts = useCallback(async (search) => {
    const q = search ? `?search=${encodeURIComponent(search)}` : '';
    const data = await api(`/contacts${q}`);
    setContacts(data);
    return data;
  }, []);

  const createContact = useCallback(async (data) => {
    const created = await api('/contacts', { method: 'POST', body: JSON.stringify(data) });
    setContacts((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateContact = useCallback(async (id, data) => {
    const updated = await api(`/contacts/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    setContacts((prev) => prev.map((c) => (c._id === id ? updated : c)));
    return updated;
  }, []);

  const deleteContact = useCallback(async (id) => {
    const deleted = contacts.find((c) => c._id === id);
    setContacts((prev) => prev.filter((c) => c._id !== id));
    try {
      await api(`/contacts/${id}`, { method: 'DELETE' });
      showSnackbar('Contact deleted', 'success', {
        label: 'Undo',
        handler: async () => {
          if (deleted) {
            await createContact(deleted);
            showSnackbar('Contact restored');
          }
        },
      });
    } catch {
      setContacts((prev) => [...prev, deleted].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      showSnackbar('Delete failed', 'error');
    }
  }, [contacts, createContact, showSnackbar]);

  const fetchDeals = useCallback(async (search) => {
    const q = search ? `?search=${encodeURIComponent(search)}` : '';
    const data = await api(`/deals${q}`);
    setDeals(data);
    return data;
  }, []);

  const fetchDealActivities = useCallback(async (dealId) => {
    return api(`/deals/${dealId}/activities`);
  }, []);

  const createDeal = useCallback(async (data) => {
    const created = await api('/deals', { method: 'POST', body: JSON.stringify(data) });
    setDeals((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateDeal = useCallback(async (id, data) => {
    const updated = await api(`/deals/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    setDeals((prev) => prev.map((d) => (d._id === id ? updated : d)));
    return updated;
  }, []);

  const deleteDeal = useCallback(async (id) => {
    const deleted = deals.find((d) => d._id === id);
    setDeals((prev) => prev.filter((d) => d._id !== id));
    try {
      await api(`/deals/${id}`, { method: 'DELETE' });
      showSnackbar('Deal deleted', 'success', {
        label: 'Undo',
        handler: async () => {
          if (deleted) {
            const restored = await createDeal(deleted);
            showSnackbar('Deal restored');
          }
        },
      });
    } catch {
      setDeals((prev) => [...prev, deleted].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
      showSnackbar('Delete failed', 'error');
    }
  }, [deals, createDeal, showSnackbar]);

  const fetchActivities = useCallback(async (contactId) => {
    const q = contactId ? `?contactId=${contactId}` : '';
    const data = await api(`/activities${q}`);
    setActivities(data);
    return data;
  }, []);

  const createActivity = useCallback(async (data) => {
    const created = await api('/activities', { method: 'POST', body: JSON.stringify(data) });
    setActivities((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateActivity = useCallback(async (id, data) => {
    const updated = await api(`/activities/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    setActivities((prev) => prev.map((a) => (a._id === id ? updated : a)));
    return updated;
  }, []);

  const deleteActivity = useCallback(async (id) => {
    await api(`/activities/${id}`, { method: 'DELETE' });
    setActivities((prev) => prev.filter((a) => a._id !== id));
  }, []);

  return (
    <AppCtx.Provider value={{
      contacts, deals, activities, loading, setLoading,
      darkMode, toggleDarkMode, snackbar, showSnackbar, closeSnackbar,
      fetchContacts, createContact, updateContact, deleteContact,
      fetchDeals, fetchDealActivities, createDeal, updateDeal, deleteDeal,
      fetchActivities, createActivity, updateActivity, deleteActivity,
    }}>
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

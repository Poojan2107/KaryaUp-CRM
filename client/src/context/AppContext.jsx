import { createContext, useContext, useState, useCallback } from 'react';

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
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
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
    await api(`/contacts/${id}`, { method: 'DELETE' });
    setContacts((prev) => prev.filter((c) => c._id !== id));
  }, []);

  const fetchDeals = useCallback(async () => {
    const data = await api('/deals');
    setDeals(data);
    return data;
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
    await api(`/deals/${id}`, { method: 'DELETE' });
    setDeals((prev) => prev.filter((d) => d._id !== id));
  }, []);

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
      fetchDeals, createDeal, updateDeal, deleteDeal,
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

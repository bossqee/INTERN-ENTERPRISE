import { useState, useEffect } from 'react';
import type { JournalEntry } from '../types';
import { supabase } from '../utils/supabase';

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch entries
  const fetchEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (e) {
      console.error('Error fetching entries:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const addEntry = async (entry: Omit<JournalEntry, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('entries')
        .insert([entry])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setEntries((prev) => [data, ...prev]);
      }
    } catch (e) {
      console.error('Error adding entry:', e);
      alert('Failed to add entry');
    }
  };

  const updateEntry = async (id: string, updated: Partial<JournalEntry>) => {
    try {
      const { error } = await supabase
        .from('entries')
        .update(updated)
        .eq('id', id);

      if (error) throw error;
      
      setEntries((prev) =>
        prev.map((entry) => (entry.id === id ? { ...entry, ...updated } : entry))
      );
    } catch (e) {
      console.error('Error updating entry:', e);
      alert('Failed to update entry');
    }
  };

  const deleteEntry = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    try {
      const { error } = await supabase
        .from('entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (e) {
      console.error('Error deleting entry:', e);
      alert('Failed to delete entry');
    }
  };

  return {
    entries,
    loading,
    addEntry,
    updateEntry,
    deleteEntry,
    refresh: fetchEntries
  };
}

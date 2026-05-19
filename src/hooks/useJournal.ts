import { useState, useEffect } from 'react';
import type { JournalEntry } from '../types';

const STORAGE_KEY = 'internship_journal_entries';

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse journal entries', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: crypto.randomUUID(),
    };
    setEntries((prev) => [newEntry, ...prev]);
  };

  const updateEntry = (id: string, updated: Partial<JournalEntry>) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...updated } : entry))
    );
  };

  const deleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    }
  };

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
  };
}

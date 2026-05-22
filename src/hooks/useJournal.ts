import { useState, useEffect } from 'react';
import type { JournalEntry } from '../types';
import { supabase } from '../utils/supabase';
import { compressImage, uploadImage } from '../utils/imageProcess';

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

  const processImages = async (imageObjects: { url: string; file?: File }[]) => {
    const uploadPromises = imageObjects.map(async (obj) => {
      if (obj.file) {
        const compressed = await compressImage(obj.file);
        return await uploadImage(compressed);
      }
      return obj.url; // Existing URL
    });
    return Promise.all(uploadPromises);
  };

  const addEntry = async (entryData: any) => {
    if (supabase.auth.getSession === undefined) { // Check if supabase is initialized
      alert('Supabase is not properly configured. Check your .env file.');
      return;
    }

    try {
      // images are handled inside imageObjects
      const { imageObjects, ...rest } = entryData;
      const uploadedUrls = await processImages(imageObjects);
      
      const entryToSave = {
        ...rest,
        images: uploadedUrls,
        image: uploadedUrls.length > 0 ? uploadedUrls[0] : null,
      };

      const { data, error } = await supabase
        .from('entries')
        .insert([entryToSave])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setEntries((prev) => [data, ...prev]);
      }
    } catch (e: any) {
      console.error('Error adding entry:', e);
      throw e; // Let the form handle the error
    }
  };

  const updateEntry = async (id: string, updatedData: any) => {
    try {
      const { imageObjects, ...rest } = updatedData;
      const uploadedUrls = await processImages(imageObjects);

      const entryToUpdate = {
        ...rest,
        images: uploadedUrls,
        image: uploadedUrls.length > 0 ? uploadedUrls[0] : null,
      };

      const { error } = await supabase
        .from('entries')
        .update(entryToUpdate)
        .eq('id', id);

      if (error) throw error;
      
      setEntries((prev) =>
        prev.map((entry) => (entry.id === id ? { ...entry, ...entryToUpdate } : entry))
      );
    } catch (e: any) {
      console.error('Error updating entry:', e);
      throw e;
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
    } catch (e: any) {
      console.error('Error deleting entry:', e);
      alert(`Failed to delete entry: ${e.message || 'Unknown error'}`);
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

import { useState, useEffect } from 'react';
import type { JournalEntry } from '../types';
import { supabase } from '../utils/supabase';
import { compressImage, uploadImage } from '../utils/imageProcess';

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      if (data && data.length > 0) {
        console.log('--- DB Schema Check ---');
        console.log('Columns:', Object.keys(data[0]));
      }

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

  const processImages = async (imageObjects: { url: string; file?: File; dbName?: string }[]) => {
    const uploadPromises = imageObjects.map(async (obj) => {
      if (obj.file) {
        const compressed = await compressImage(obj.file);
        return await uploadImage(compressed);
      }
      if (obj.dbName && !obj.dbName.startsWith('data:')) {
        return obj.dbName;
      }
      if (obj.url && obj.url.startsWith('data:')) {
        try {
          const res = await fetch(obj.url);
          const blob = await res.blob();
          const file = new File([blob], "recovered.jpg", { type: "image/jpeg" });
          const compressed = await compressImage(file);
          return await uploadImage(compressed);
        } catch (e) {
          return null;
        }
      }
      if (obj.url && obj.url.startsWith('http')) return obj.url;
      return null;
    });

    const results = await Promise.all(uploadPromises);
    return results.filter((url): url is string => url !== null);
  };

  const sanitizePayload = (payload: any) => {
    const MAX_LENGTH = 100000;
    Object.entries(payload).forEach(([key, value]) => {
      if (typeof value === 'string' && value.length > MAX_LENGTH) {
        throw new Error(`Field "${key}" is too large. Please remove and re-upload images.`);
      }
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (typeof v === 'string' && v.length > MAX_LENGTH) {
            throw new Error(`Array element in "${key}" is too large.`);
          }
        });
      }
    });
    return payload;
  };

  const addEntry = async (entryData: any) => {
    try {
      const { title, date, tools, content, imageObjects } = entryData;
      const uploadedUrls = await processImages(imageObjects);
      const finalImages = Array.isArray(uploadedUrls) ? uploadedUrls : [];

      const entryToSave = sanitizePayload({
        title,
        date,
        tools: Array.from(tools),
        content,
        images: finalImages,
        image: finalImages.length > 0 ? finalImages[0] : null,
      });

      const { data, error } = await supabase
        .from('entries')
        .insert([entryToSave])
        .select()
        .single();

      if (error) throw error;
      if (data) setEntries((prev) => [data, ...prev]);
    } catch (e: any) {
      console.error('Save failed:', e);
      alert(e.message || 'Failed to save');
    }
  };

  const updateEntry = async (id: string, updatedData: any) => {
    try {
      const { title, date, tools, content, imageObjects } = updatedData;
      const uploadedUrls = await processImages(imageObjects);
      const finalImages = Array.isArray(uploadedUrls) ? uploadedUrls : [];

      const entryToUpdate = sanitizePayload({
        title,
        date,
        tools: Array.from(tools),
        content,
        images: finalImages,
        image: finalImages.length > 0 ? finalImages[0] : null,
      });

      const { data, error } = await supabase
        .from('entries')
        .update(entryToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setEntries((prev) => prev.map((e) => (e.id === id ? data : e)));
      }
    } catch (e: any) {
      console.error('Update failed:', e);
      alert(e.message || 'Failed to update');
    }
  };

  const deleteEntry = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      const { error } = await supabase.from('entries').delete().eq('id', id);
      if (error) throw error;
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (e: any) {
      alert(e.message);
    }
  };

  return { entries, loading, addEntry, updateEntry, deleteEntry, refresh: fetchEntries };
}

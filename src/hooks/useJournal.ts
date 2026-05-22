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

  const processImages = async (imageObjects: { url: string; file?: File; dbName?: string }[]) => {
    const uploadPromises = imageObjects.map(async (obj) => {
      // 1. New file -> compress and upload
      if (obj.file) {
        const compressed = await compressImage(obj.file);
        return await uploadImage(compressed);
      }
      
      // 2. Existing filename -> return as is
      if (obj.dbName && !obj.dbName.startsWith('data:')) {
        return obj.dbName;
      }

      // 3. Old Base64 data -> Convert to file and upload to Storage
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

      // 4. External URL
      if (obj.url && obj.url.startsWith('http')) {
        return obj.url;
      }

      return null;
    });

    const results = await Promise.all(uploadPromises);
    return results.filter((url): url is string => url !== null);
  };

  const addEntry = async (entryData: any) => {
    try {
      const { title, date, tools, content, imageObjects } = entryData;
      const uploadedUrls = await processImages(imageObjects);
      
      // ตรวจสอบว่า uploadedUrls เป็น array จริงๆ
      const finalImages = Array.isArray(uploadedUrls) ? uploadedUrls : [];

      const entryToSave = {
        title,
        date: date,
        tools: Array.from(tools), // มั่นใจว่าเป็น Array
        content,
        images: finalImages, // ส่งอาเรย์ตรงๆ
        image: finalImages.length > 0 ? finalImages[0] : null,
      };

      console.log('>>> Sending to Supabase:', entryToSave);

      const { data, error } = await supabase
        .from('entries')
        .insert([entryToSave])
        .select()
        .single();

      if (error) throw error;
      
      console.log('<<< Received from Supabase (After Save):', data);
      
      if (data) {
        setEntries((prev) => [data, ...prev]);
      }
    } catch (e: any) {
      console.error('Save failed:', e);
      alert(`Save failed: ${e.message}`);
    }
  };

  const updateEntry = async (id: string, updatedData: any) => {
    try {
      const { title, date, tools, content, imageObjects } = updatedData;
      const uploadedUrls = await processImages(imageObjects);
      const finalImages = Array.isArray(uploadedUrls) ? uploadedUrls : [];

      const entryToUpdate = {
        title,
        date,
        tools: Array.from(tools),
        content,
        images: finalImages,
        image: finalImages.length > 0 ? finalImages[0] : null,
      };

      console.log('>>> Updating ID:', id, entryToUpdate);

      const { data, error } = await supabase
        .from('entries')
        .update(entryToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      console.log('<<< Received from Supabase (After Update):', data);

      if (data) {
        setEntries((prev) =>
          prev.map((entry) => (entry.id === id ? data : entry))
        );
      }
    } catch (e: any) {
      console.error('Update failed:', e);
      alert(`Update failed: ${e.message}`);
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

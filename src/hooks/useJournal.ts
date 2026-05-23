import { useState, useEffect } from 'react';
import type { JournalEntry } from '../types';
import { supabase } from '../utils/supabase';
import { compressImage, uploadImage } from '../utils/imageProcess';
import { showAlert } from '../utils/swal';

export function useJournal(userId: string | undefined) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('journal_logs')
        .select('*')
        .eq('user_id', userId) // Filter by user_id
        .order('date', { ascending: false });

      if (error) throw error;
      
      const mappedData = (data || []).map(item => ({
        ...item,
        images: item.image_names || [],
        image: item.main_image
      }));

      setEntries(mappedData);
    } catch (e) {
      console.error('Fetch Error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [userId]);

  const processImages = async (imageObjects: { url: string; file?: File; dbName?: string }[]) => {
    const results: string[] = [];
    for (const obj of imageObjects) {
      try {
        if (obj.file) {
          const compressed = await compressImage(obj.file);
          const fileName = await uploadImage(compressed);
          results.push(fileName);
        } else if (obj.dbName) {
          results.push(obj.dbName);
        }
      } catch (err) {
        console.error('Image processing failed:', err);
      }
    }
    return results;
  };

  const addEntry = async (entryData: any) => {
    if (!userId) return;
    try {
      const { title, date, tools, content, imageObjects } = entryData;
      const uploadedFileNames = await processImages(imageObjects);
      
      const payload = {
        user_id: userId, // Associate with user
        title,
        date,
        tools: Array.isArray(tools) ? tools : [],
        content,
        image_names: uploadedFileNames,
        main_image: uploadedFileNames.length > 0 ? uploadedFileNames[0] : null,
      };

      const { data, error } = await supabase
        .from('journal_logs')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        const newEntry = {
          ...data,
          images: data.image_names,
          image: data.main_image
        };
        setEntries((prev) => [newEntry, ...prev]);
        showAlert.success('Entry Saved!', 'Your journal has been recorded successfully.');
      }
    } catch (e: any) {
      showAlert.error('Save Failed', e.message);
      throw e;
    }
  };

  const updateEntry = async (id: string, updatedData: any) => {
    try {
      const { title, date, tools, content, imageObjects } = updatedData;
      const uploadedFileNames = await processImages(imageObjects);

      const payload = {
        title,
        date,
        tools: Array.isArray(tools) ? tools : [],
        content,
        image_names: uploadedFileNames,
        main_image: uploadedFileNames.length > 0 ? uploadedFileNames[0] : null,
      };

      const { data, error } = await supabase
        .from('journal_logs')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        const updatedEntry = {
          ...data,
          images: data.image_names,
          image: data.main_image
        };
        setEntries((prev) => prev.map((e) => (e.id === id ? updatedEntry : e)));
        showAlert.success('Entry Updated!', 'Changes have been saved successfully.');
      }
    } catch (e: any) {
      showAlert.error('Update Failed', e.message);
      throw e;
    }
  };

  const deleteEntry = async (id: string) => {
    const confirmed = await showAlert.confirm('Are you sure?', 'You will not be able to recover this entry!');
    if (!confirmed) return;

    try {
      const { error } = await supabase.from('journal_logs').delete().eq('id', id);
      if (error) throw error;
      setEntries((prev) => prev.filter((e) => e.id !== id));
      showAlert.success('Deleted!', 'Your entry has been deleted.');
    } catch (e: any) {
      showAlert.error('Delete Failed', e.message);
    }
  };

  return { entries, loading, addEntry, updateEntry, deleteEntry, refresh: fetchEntries };
}

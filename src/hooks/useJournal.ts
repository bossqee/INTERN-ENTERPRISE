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
        .from('journal_logs') // ใช้ชื่อตารางใหม่
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      // แปลงข้อมูลจาก journal_logs (DB) กลับมาเป็น JournalEntry (App)
      const mappedData = (data || []).map(item => ({
        ...item,
        images: item.image_names || [], // Map image_names กลับมาเป็น images
        image: item.main_image // Map main_image กลับมาเป็น image
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
  }, []);

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
    try {
      const { title, date, tools, content, imageObjects } = entryData;
      const uploadedFileNames = await processImages(imageObjects);
      
      const payload = {
        title,
        date,
        tools: Array.isArray(tools) ? tools : [],
        content,
        image_names: uploadedFileNames, // ตรงกับชื่อคอลัมน์ใหม่ใน SQL
        main_image: uploadedFileNames.length > 0 ? uploadedFileNames[0] : null,
      };

      console.log('Inserting into journal_logs:', payload);

      const { data, error } = await supabase
        .from('journal_logs')
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error('Supabase DB Error:', error);
        throw new Error(`DB Error: ${error.message}`);
      }
      
      if (data) {
        const newEntry = {
          ...data,
          images: data.image_names,
          image: data.main_image
        };
        setEntries((prev) => [newEntry, ...prev]);
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
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
      }
    } catch (e: any) {
      alert(`Update Error: ${e.message}`);
      throw e;
    }
  };

  const deleteEntry = async (id: string) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      const { error } = await supabase.from('journal_logs').delete().eq('id', id);
      if (error) throw error;
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (e: any) {
      alert(e.message);
    }
  };

  return { entries, loading, addEntry, updateEntry, deleteEntry, refresh: fetchEntries };
}

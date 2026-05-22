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
      setEntries(data || []);
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
        // 1. ถ้าเป็นไฟล์ใหม่ที่พึ่งเลือกมา
        if (obj.file) {
          const compressed = await compressImage(obj.file);
          const fileName = await uploadImage(compressed);
          results.push(fileName);
          continue;
        }
        
        // 2. ถ้าเป็นข้อมูล Base64 (ที่หลุดมา) ให้แปลงเป็นไฟล์แล้วอัพโหลดใหม่
        if (obj.url && obj.url.startsWith('data:')) {
          const res = await fetch(obj.url);
          const blob = await res.blob();
          const file = new File([blob], "recovered.jpg", { type: "image/jpeg" });
          const compressed = await compressImage(file);
          const fileName = await uploadImage(compressed);
          results.push(fileName);
          continue;
        }

        // 3. ถ้าเป็นชื่อไฟล์ปกติจาก DB (dbName)
        if (obj.dbName && !obj.dbName.startsWith('data:')) {
          results.push(obj.dbName);
        }
      } catch (err) {
        console.error('Failed to process image:', err);
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
        images: uploadedFileNames,
        image: uploadedFileNames.length > 0 ? uploadedFileNames[0] : null,
      };

      console.log('Sending to DB:', payload); // ตรวจสอบว่าในนี้ไม่มี Base64 ยาวๆ

      const { data, error } = await supabase
        .from('entries')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      if (data) setEntries((prev) => [data, ...prev]);
    } catch (e: any) {
      console.error('Add Entry Error:', e);
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
        images: uploadedFileNames,
        image: uploadedFileNames.length > 0 ? uploadedFileNames[0] : null,
      };

      const { data, error } = await supabase
        .from('entries')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setEntries((prev) => prev.map((e) => (e.id === id ? data : e)));
      }
    } catch (e: any) {
      console.error('Update Entry Error:', e);
      throw e;
    }
  };

  const deleteEntry = async (id: string) => {
    if (!window.confirm('Delete this entry?')) return;
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

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
        console.log('--- DB Diagnostic ---');
        console.log('Columns found in DB:', Object.keys(data[0]));
        console.log('Is "images" an array?', Array.isArray(data[0].images));
      }

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
    // อัพโหลดทีละรูปเพื่อลดภาระ Network
    const results: string[] = [];
    for (const obj of imageObjects) {
      try {
        if (obj.file) {
          const compressed = await compressImage(obj.file);
          const fileName = await uploadImage(compressed);
          results.push(fileName);
        } else if (obj.dbName && !obj.dbName.startsWith('data:')) {
          results.push(obj.dbName);
        } else if (obj.url && obj.url.startsWith('data:')) {
          const res = await fetch(obj.url);
          const blob = await res.blob();
          const file = new File([blob], "img.jpg", { type: "image/jpeg" });
          const compressed = await compressImage(file);
          const fileName = await uploadImage(compressed);
          results.push(fileName);
        } else if (obj.url && obj.url.startsWith('http')) {
          results.push(obj.url);
        }
      } catch (err) {
        console.error('Failed to process one image, skipping...', err);
      }
    }
    return results;
  };

  const addEntry = async (entryData: any) => {
    try {
      const { title, date, tools, content, imageObjects } = entryData;
      const uploadedUrls = await processImages(imageObjects);
      
      const payload: any = {
        title,
        date,
        tools: Array.isArray(tools) ? tools : [],
        content,
        image: uploadedUrls.length > 0 ? uploadedUrls[0] : null,
      };

      // ส่ง images เฉพาะเมื่อมีข้อมูลและไม่เป็นค่าว่าง
      if (uploadedUrls.length > 0) {
        payload.images = uploadedUrls;
      } else {
        payload.images = []; // หรือลองเอาออกเลยถ้ายัง Error: delete payload.images;
      }

      console.log('Final Payload to Insert:', payload);

      const { data, error } = await supabase
        .from('entries')
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error('Supabase Insert Error:', error);
        throw new Error(`DB Error: ${error.message}`);
      }
      if (data) setEntries((prev) => [data, ...prev]);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const updateEntry = async (id: string, updatedData: any) => {
    try {
      const { title, date, tools, content, imageObjects } = updatedData;
      const uploadedUrls = await processImages(imageObjects);

      const payload: any = {
        title,
        date,
        tools: Array.isArray(tools) ? tools : [],
        content,
        image: uploadedUrls.length > 0 ? uploadedUrls[0] : null,
        images: uploadedUrls
      };

      console.log('Final Payload to Update:', payload);

      const { data, error } = await supabase
        .from('entries')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase Update Error:', error);
        throw new Error(`DB Error: ${error.message}`);
      }
      if (data) {
        setEntries((prev) => prev.map((e) => (e.id === id ? data : e)));
      }
    } catch (e: any) {
      alert(e.message);
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

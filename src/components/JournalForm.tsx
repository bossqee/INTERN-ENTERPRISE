import React, { useState, useEffect } from 'react';
import type { JournalEntry } from '../types';
import { X, Upload, Plus, Trash2, Calendar as CalendarIcon, Type, Wrench as ToolIcon, Loader2 } from 'lucide-react';
import { MarkdownPreview } from './MarkdownPreview';
import { getImageUrl } from '../utils/imageProcess';

interface JournalFormProps {
  initialEntry?: JournalEntry | null;
  onSave: (entry: any) => Promise<void>;
  onUpdate: (id: string, entry: any) => Promise<void>;
  onClose: () => void;
}

export function JournalForm({ initialEntry, onSave, onUpdate, onClose }: JournalFormProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tools, setTools] = useState<string[]>([]);
  const [toolInput, setToolInput] = useState('');
  const [content, setContent] = useState('');
  const [imageObjects, setImageObjects] = useState<{ url: string; file?: File; dbName?: string }[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialEntry) {
      setTitle(initialEntry.title);
      setDate(initialEntry.date);
      setTools(initialEntry.tools || []);
      setContent(initialEntry.content);
      
      const initialImages = initialEntry.images || (initialEntry.image ? [initialEntry.image] : []);
      setImageObjects(initialImages.map(name => ({ 
        url: getImageUrl(name), 
        dbName: name 
      })));
    }
  }, [initialEntry]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const newImageObjects = newFiles.map(file => ({
        url: URL.createObjectURL(file),
        file
      }));
      setImageObjects(prev => [...prev, ...newImageObjects]);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    const removed = imageObjects[index];
    if (removed.file) URL.revokeObjectURL(removed.url);
    setImageObjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTool = () => {
    if (toolInput.trim() && !tools.includes(toolInput.trim())) {
      setTools([...tools, toolInput.trim()]);
      setToolInput('');
    }
  };

  const removeTool = (toolToRemove: string) => {
    setTools(tools.filter((t) => t !== toolToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return;
    
    setIsUploading(true);
    try {
      const entryData = { title, date, tools, content, imageObjects };
      
      if (initialEntry) {
        await onUpdate(initialEntry.id, entryData);
      } else {
        await onSave(entryData);
      }
      onClose();
    } catch (error: any) {
      alert(`Error: ${error.message || 'Something went wrong'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-100">{initialEntry ? 'Edit Entry' : 'New Entry'}</h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-lg"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Task Title</label>
                <input
                  type="text" required value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Date</label>
                  <input
                    type="date" required value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Images</label>
                  <input
                    type="file" accept="image/*" multiple onChange={handleImageChange}
                    className="hidden" id="image-upload"
                  />
                  <label htmlFor="image-upload" className="flex items-center gap-2 w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-400 cursor-pointer">
                    <Upload size={16} /> <span>{imageObjects.length} Images</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Tools</label>
                <div className="flex gap-2">
                  <input
                    type="text" value={toolInput}
                    onChange={(e) => setToolInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTool())}
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100"
                  />
                  <button type="button" onClick={handleAddTool} className="p-2.5 bg-zinc-800 rounded-xl"><Plus size={20} /></button>
                </div>
              </div>

              {imageObjects.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {imageObjects.map((img, i) => (
                    <div key={i} className="relative group rounded-xl overflow-hidden h-24 border border-zinc-800">
                      <img src={img.url} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 bg-red-500 rounded-md opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4 flex flex-col h-full min-h-[400px]">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-zinc-400">Content (Markdown)</label>
                <button type="button" onClick={() => setIsPreview(!isPreview)} className="text-xs bg-zinc-800 px-3 py-1 rounded-md">{isPreview ? 'Edit' : 'Preview'}</button>
              </div>
              <div className="flex-1">
                {isPreview ? (
                  <div className="h-full bg-zinc-950 p-4 rounded-xl overflow-y-auto border border-zinc-800"><MarkdownPreview content={content} /></div>
                ) : (
                  <textarea
                    required value={content} onChange={(e) => setContent(e.target.value)}
                    className="w-full h-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-100 font-mono text-sm resize-none"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-zinc-400">Cancel</button>
            <button
              type="submit" disabled={isUploading}
              className="px-10 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center gap-2"
            >
              {isUploading ? <><Loader2 className="animate-spin" size={20} /> Saving...</> : (initialEntry ? 'Update' : 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import type { JournalEntry } from '../types';
import { X, Upload, Plus, Trash2, Calendar as CalendarIcon, Type, Wrench as ToolIcon, Loader2, Eye, Edit3, Image as ImageIcon, Sparkles } from 'lucide-react';
import { MarkdownPreview } from './MarkdownPreview';
import { getImageUrl } from '../utils/imageProcess';
import { useTranslation } from '../utils/i18n';

interface JournalFormProps {
  initialEntry?: JournalEntry | null;
  onSave: (entry: any) => Promise<void>;
  onUpdate: (id: string, entry: any) => Promise<void>;
  onClose: () => void;
}

export function JournalForm({ initialEntry, onSave, onUpdate, onClose }: JournalFormProps) {
  const { t, language } = useTranslation();
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
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Dynamic Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500" 
        onClick={onClose} 
      />

      {/* Main Professional Modal */}
      <div className="relative w-full max-w-6xl h-[85vh] bg-[#0c0c0c] border border-white/[0.08] rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-slide-up">
        
        {/* Modal Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-10 py-6 border-b border-white/[0.05] bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
              {initialEntry ? <Edit3 size={20} className="text-blue-500" /> : <Plus size={20} className="text-blue-500" />}
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight leading-none mb-1">
                {initialEntry ? (language === 'th' ? 'แก้ไขบันทึก' : 'Update Record') : (language === 'th' ? 'สร้างบันทึกใหม่' : 'Initialize New Log')}
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-zinc-600 rounded-full" />
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Secure Session Protocol</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-3 text-zinc-500 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] rounded-2xl transition-all border border-white/[0.05]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex overflow-hidden">
          
          {/* Left Column: Metadata & Assets */}
          <div className="w-[400px] flex-shrink-0 border-r border-white/[0.05] flex flex-col bg-black/20 overflow-y-auto custom-scrollbar p-8 gap-8">
            
            {/* Title Input */}
            <div className="space-y-3 group">
              <div className="flex items-center gap-2 ml-1 text-zinc-500 group-focus-within:text-blue-500 transition-colors">
                <Type size={14} />
                <label className="text-[10px] font-black uppercase tracking-[0.2em]">{language === 'th' ? 'หัวข้อบันทึก' : 'Entry Subject'}</label>
              </div>
              <input
                type="text" required value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={language === 'th' ? 'ชื่อโครงการหรือภารกิจ...' : 'Project or Task Title...'}
                className="w-full bg-zinc-950 border border-white/[0.05] rounded-2xl px-5 py-3.5 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all font-medium"
              />
            </div>

            {/* Date & Tools Row */}
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-3 group">
                <div className="flex items-center gap-2 ml-1 text-zinc-500 group-focus-within:text-indigo-500 transition-colors">
                  <CalendarIcon size={14} />
                  <label className="text-[10px] font-black uppercase tracking-[0.2em]">{language === 'th' ? 'วันที่ปฏิบัติงาน' : 'Timestamp'}</label>
                </div>
                <input
                  type="date" required value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/[0.05] rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all [color-scheme:dark]"
                />
              </div>

              <div className="space-y-3 group">
                <div className="flex items-center gap-2 ml-1 text-zinc-500 group-focus-within:text-emerald-500 transition-colors">
                  <ToolIcon size={14} />
                  <label className="text-[10px] font-black uppercase tracking-[0.2em]">{language === 'th' ? 'เครื่องมือที่ใช้' : 'Tech Stack'}</label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text" value={toolInput}
                    onChange={(e) => setToolInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTool())}
                    placeholder="e.g. React, Docker"
                    className="flex-1 bg-zinc-950 border border-white/[0.05] rounded-2xl px-5 py-3.5 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all font-medium"
                  />
                  <button type="button" onClick={handleAddTool} className="p-3.5 bg-zinc-900 border border-white/[0.05] hover:bg-zinc-800 rounded-2xl transition-all text-zinc-400 hover:text-white">
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {tools.map(tool => (
                    <span key={tool} className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                      {tool}
                      <X size={10} className="cursor-pointer hover:text-white" onClick={() => removeTool(tool)} />
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Asset Management */}
            <div className="space-y-4">
              <div className="flex items-center justify-between ml-1 text-zinc-500">
                <div className="flex items-center gap-2">
                  <ImageIcon size={14} />
                  <label className="text-[10px] font-black uppercase tracking-[0.2em]">{language === 'th' ? 'รูปภาพประกอบ' : 'Visual Assets'}</label>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 bg-white/5 rounded-md border border-white/5">{imageObjects.length} Max</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="file" accept="image/*" multiple onChange={handleImageChange}
                  className="hidden" id="modal-image-upload"
                />
                <label htmlFor="modal-image-upload" className="col-span-2 group/upload h-24 border border-dashed border-white/[0.08] hover:border-blue-500/40 bg-zinc-950/50 hover:bg-blue-500/[0.02] rounded-[1.5rem] flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
                  <Upload size={20} className="text-zinc-600 group-hover/upload:text-blue-500 transition-colors" />
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest group-hover/upload:text-blue-400 transition-colors">{language === 'th' ? 'อัปโหลดรูปภาพ' : 'Upload Evidence'}</span>
                </label>
                
                {imageObjects.map((img, i) => (
                  <div key={i} className="relative group/img aspect-video rounded-2xl overflow-hidden border border-white/[0.05] bg-zinc-900">
                    <img src={img.url} className="w-full h-full object-cover grayscale-[0.5] group-hover/img:grayscale-0 transition-all duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => removeImage(i)} className="p-2 bg-red-500 rounded-xl text-white hover:scale-110 transition-transform shadow-xl">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Markdown Editor */}
          <div className="flex-1 flex flex-col bg-[#080808] relative overflow-hidden">
            
            {/* Editor Toolbar */}
            <div className="flex-shrink-0 px-8 py-4 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-2 text-zinc-500">
                <Edit3 size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{language === 'th' ? 'รายละเอียดงาน' : 'Work Analysis'}</span>
              </div>
              <div className="flex bg-zinc-950 border border-white/[0.05] rounded-xl p-1 p-1">
                <button 
                  type="button" 
                  onClick={() => setIsPreview(false)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!isPreview ? 'bg-zinc-900 text-white shadow-lg border border-white/5' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  <Edit3 size={12} /> {language === 'th' ? 'แก้ไข' : 'Draft'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsPreview(true)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isPreview ? 'bg-zinc-900 text-white shadow-lg border border-white/5' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  <Eye size={12} /> {language === 'th' ? 'ตัวอย่าง' : 'Preview'}
                </button>
              </div>
            </div>

            {/* Editor Surface */}
            <div className="flex-1 overflow-hidden p-8 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[80px] pointer-events-none" />
              
              {isPreview ? (
                <div className="h-full bg-zinc-950/30 p-8 rounded-[2rem] overflow-y-auto custom-scrollbar border border-white/[0.03]">
                  <MarkdownPreview content={content} />
                </div>
              ) : (
                <textarea
                  required value={content} onChange={(e) => setContent(e.target.value)}
                  placeholder={language === 'th' ? 'เขียนรายละเอียดการทำงานของคุณที่นี่...' : 'Document your professional insights and technical progress...'}
                  className="w-full h-full bg-transparent text-white font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-zinc-800 custom-scrollbar"
                />
              )}
            </div>

            {/* Action Bar */}
            <div className="flex-shrink-0 px-8 py-6 border-t border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-zinc-700 animate-pulse" />
                <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-[0.3em]">Integrity Validation Active</span>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  type="button" onClick={onClose}
                  className="px-6 py-2.5 text-[11px] font-black text-zinc-500 uppercase tracking-widest hover:text-zinc-200 transition-colors"
                >
                  {language === 'th' ? 'ยกเลิก' : 'Discard'}
                </button>
                <button
                  type="submit" disabled={isUploading}
                  className="relative group/submit min-w-[180px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl group-hover/submit:scale-105 transition-transform duration-500" />
                  <div className="relative flex items-center justify-center gap-3 py-3 px-8 text-white font-black uppercase tracking-widest text-[11px] active:scale-95 disabled:opacity-50">
                    {isUploading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <span>{initialEntry ? (language === 'th' ? 'อัปเดตข้อมูล' : 'Synchronize') : (language === 'th' ? 'บันทึกข้อมูล' : 'Commit Entry')}</span>
                        <Sparkles size={14} />
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

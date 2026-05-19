import React, { useState, useEffect } from 'react';
import type { JournalEntry } from '../types';
import { X, Upload, Plus, Trash2, Calendar as CalendarIcon, Type, Wrench as ToolIcon } from 'lucide-react';
import { MarkdownPreview } from './MarkdownPreview';

interface JournalFormProps {
  initialEntry?: JournalEntry | null;
  onSave: (entry: Omit<JournalEntry, 'id'>) => void;
  onUpdate: (id: string, entry: Partial<JournalEntry>) => void;
  onClose: () => void;
}

export function JournalForm({ initialEntry, onSave, onUpdate, onClose }: JournalFormProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tools, setTools] = useState<string[]>([]);
  const [toolInput, setToolInput] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (initialEntry) {
      setTitle(initialEntry.title);
      setDate(initialEntry.date);
      setTools(initialEntry.tools);
      setContent(initialEntry.content);
      setImage(initialEntry.image);
    }
  }, [initialEntry]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entryData = {
      title,
      date,
      tools,
      content,
      image,
    };

    if (initialEntry) {
      onUpdate(initialEntry.id, entryData);
    } else {
      onSave(entryData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            {initialEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Details */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                  <Type size={14} /> Task Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What did you work on today?"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                    <CalendarIcon size={14} /> Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                    <Upload size={14} /> Attachment (Image)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center gap-2 w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-400 cursor-pointer hover:border-zinc-700 transition-all"
                  >
                    <Upload size={16} />
                    <span className="text-sm truncate">{image ? 'Image Selected' : 'Choose Image...'}</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                  <ToolIcon size={14} /> Tools & Technologies
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={toolInput}
                    onChange={(e) => setToolInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTool())}
                    placeholder="e.g. React, Git"
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleAddTool}
                    className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 min-h-[32px]">
                  {tools.map((tool) => (
                    <span
                      key={tool}
                      className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full border border-blue-500/20"
                    >
                      {tool}
                      <button
                        type="button"
                        onClick={() => removeTool(tool)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {image && (
                <div className="relative group rounded-xl overflow-hidden border border-zinc-800 h-40">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImage(undefined)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/80 backdrop-blur-sm text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Markdown Content */}
            <div className="space-y-4 flex flex-col h-full min-h-[400px]">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-400">Working Steps & Details</label>
                <div className="flex bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setIsPreview(false)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${!isPreview ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPreview(true)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${isPreview ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}
                  >
                    Preview
                  </button>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col">
                {isPreview ? (
                  <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-4 overflow-y-auto">
                    {content ? (
                      <MarkdownPreview content={content} />
                    ) : (
                      <div className="text-zinc-600 italic text-sm">Nothing to preview...</div>
                    )}
                  </div>
                ) : (
                  <textarea
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="### Today's Tasks
- [x] Refactored auth flow
- [ ] Implement unit tests

```javascript
console.log('Hello World');
```"
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-zinc-400 hover:text-white transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-10 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              {initialEntry ? 'Update Entry' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

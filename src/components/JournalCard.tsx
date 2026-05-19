import type { JournalEntry } from '../types';
import { Calendar, Tag, FileDown, Edit2, Trash2, Maximize2 } from 'lucide-react';
import { MarkdownPreview } from './MarkdownPreview';
import { format } from 'date-fns';

interface JournalCardProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
  onExport: (entry: JournalEntry) => void;
}

export function JournalCard({ entry, onEdit, onDelete, onExport }: JournalCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors shadow-xl">
      {entry.image && (
        <div className="relative h-48 w-full group overflow-hidden">
          <img
            src={entry.image}
            alt={entry.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20">
              <Maximize2 size={20} />
            </button>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
              <Calendar size={14} />
              {format(new Date(entry.date), 'MMMM dd, yyyy')}
            </div>
            <h3 className="text-xl font-semibold text-zinc-100 leading-tight">
              {entry.title}
            </h3>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => onExport(entry)}
              className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
              title="Export to PDF"
            >
              <FileDown size={18} />
            </button>
            <button
              onClick={() => onEdit(entry)}
              className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors"
              title="Edit Entry"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(entry.id)}
              className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              title="Delete Entry"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {entry.tools.map((tool) => (
            <span
              key={tool}
              className="flex items-center gap-1 px-2.5 py-1 bg-zinc-800 text-zinc-300 text-xs font-medium rounded-full border border-zinc-700"
            >
              <Tag size={10} />
              {tool}
            </span>
          ))}
        </div>

        <div className="mt-4 border-t border-zinc-800 pt-4">
          <MarkdownPreview content={entry.content} />
        </div>
      </div>
    </div>
  );
}

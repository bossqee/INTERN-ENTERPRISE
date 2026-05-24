import type { JournalEntry } from '../types';
import { Calendar, Tag, FileDown, Edit2, Trash2, Maximize2 } from 'lucide-react';
import { MarkdownPreview } from './MarkdownPreview';
import { format } from 'date-fns';
import { getImageUrl } from '../utils/imageProcess';

interface JournalCardProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
  onExport: (entry: JournalEntry) => void;
}

export function JournalCard({ entry, onEdit, onDelete, onExport }: JournalCardProps) {
  // รองรับทั้งโครงสร้างใหม่ (image_names) และโครงสร้างเดิม (images)
  const rawImages = (entry as any).image_names || entry.images || (entry.image ? [entry.image] : []);
  const images = (Array.isArray(rawImages) ? rawImages : [])
    .filter(img => img && typeof img === 'string')
    .map(img => getImageUrl(img));

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden hover:border-blue-500/30 transition-all duration-500 shadow-xl group/card hover:shadow-blue-500/5">
      {images.length > 0 && (
        <div className={`relative grid gap-0.5 ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} h-48 sm:h-56 w-full overflow-hidden border-b border-zinc-800`}>
          {images.slice(0, 3).map((img, index) => (
            <div key={index} className="relative h-full w-full overflow-hidden border-r border-zinc-800 last:border-r-0">
              <img
                src={img}
                alt={`${entry.title} ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
              />
              {index === 2 && images.length > 3 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white font-black text-xl">+{images.length - 3}</span>
                </div>
              )}
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
      )}
      
      <div className="p-6 sm:p-8">
        <div className="flex justify-between items-start mb-4">
          <div className="animate-reveal">
            <div className="flex items-center gap-2.5 text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2">
              <Calendar size={12} className="text-blue-500" />
              {format(new Date(entry.date), 'MMMM dd, yyyy')}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight group-hover/card:text-blue-400 transition-colors">
              {entry.title}
            </h3>
          </div>
          
          <div className="flex gap-1.5">
            <button
              onClick={() => onExport(entry)}
              className="p-2.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10"
              title="Export to PDF"
            >
              <FileDown size={18} />
            </button>
            <button
              onClick={() => onEdit(entry)}
              className="p-2.5 text-zinc-500 hover:text-blue-400 hover:bg-blue-400/5 rounded-xl transition-all border border-transparent hover:border-blue-500/20"
              title="Edit Entry"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(entry.id)}
              className="p-2.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all border border-transparent hover:border-red-500/20"
              title="Delete Entry"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {entry.tools.map((tool) => (
            <span
              key={tool}
              className="flex items-center gap-1.5 px-3 py-1 bg-zinc-950 text-zinc-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-white/5 group-hover/card:border-blue-500/20 transition-colors"
            >
              <Tag size={10} className="text-blue-500/50" />
              {tool}
            </span>
          ))}
        </div>

        <div className="mt-6 border-t border-white/[0.05] pt-6 group-hover/card:border-white/10 transition-colors">
          <div className="prose prose-invert prose-xs max-w-none prose-p:text-zinc-400 prose-p:leading-relaxed prose-headings:text-white prose-strong:text-blue-400 line-clamp-3 group-hover/card:line-clamp-none transition-all duration-500">
            <MarkdownPreview content={entry.content} />
          </div>
        </div>
      </div>
    </div>
  );
}

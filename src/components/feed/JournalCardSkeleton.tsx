export function JournalCardSkeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl animate-pulse">
      {/* Image Skeleton */}
      <div className="h-64 w-full bg-zinc-800/50" />
      
      <div className="p-8 sm:p-10">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-zinc-800 rounded-md" />
              <div className="w-32 h-3 bg-zinc-800 rounded-full" />
            </div>
            <div className="w-3/4 h-8 bg-zinc-800 rounded-xl" />
          </div>
          
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-10 h-10 bg-zinc-800 rounded-xl" />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-20 h-6 bg-zinc-800 rounded-full" />
          ))}
        </div>

        <div className="mt-6 border-t border-zinc-800/50 pt-8 space-y-4">
          <div className="w-full h-4 bg-zinc-800 rounded-full" />
          <div className="w-full h-4 bg-zinc-800 rounded-full" />
          <div className="w-2/3 h-4 bg-zinc-800 rounded-full" />
        </div>
      </div>
    </div>
  );
}

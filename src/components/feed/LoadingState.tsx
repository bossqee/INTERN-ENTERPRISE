import { JournalCardSkeleton } from './JournalCardSkeleton';

export function LoadingState() {
  return (
    <div className="space-y-8 sm:space-y-10 pb-24">
      {[1, 2, 3].map((i) => (
        <JournalCardSkeleton key={i} />
      ))}
    </div>
  );
}

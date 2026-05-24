export function LayoutDecorations() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 grid-mesh animate-mesh" />
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-glow" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-glow" style={{ animationDelay: '3s' }} />
      <div className="absolute top-[20%] left-[10%] w-32 h-32 bg-white/[0.01] border border-white/5 rounded-full backdrop-blur-3xl animate-float opacity-30" />
      <div className="absolute bottom-[30%] right-[15%] w-24 h-24 bg-blue-500/[0.02] border border-blue-500/10 rounded-full backdrop-blur-2xl animate-float opacity-20" style={{ animationDelay: '2s' }} />
    </div>
  );
}

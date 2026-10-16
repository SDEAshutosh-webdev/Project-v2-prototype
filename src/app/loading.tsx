'use client';

export default function Loading() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-zinc-200 rounded-md"></div>
          <div className="h-4 w-96 bg-zinc-200 rounded-md"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-zinc-200 rounded-md"></div>
          <div className="h-9 w-36 bg-zinc-200 rounded-md"></div>
        </div>
      </div>
      <div className="h-10 w-80 bg-zinc-200 rounded-md"></div>
      <div className="h-[480px] w-full bg-zinc-200 rounded-lg"></div>
    </div>
  );
}

'use client';

export default function PropertyTaxLoading() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div className="space-y-2">
          <div className="h-7 w-72 bg-zinc-200 rounded-md"></div>
          <div className="h-4 w-96 bg-zinc-200 rounded-md"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 bg-zinc-200 rounded-md"></div>
          <div className="h-8 w-36 bg-zinc-200 rounded-md"></div>
        </div>
      </div>

      <div className="h-10 w-96 bg-zinc-200 rounded-md"></div>

      {/* Table Skeleton */}
      <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white">
        <div className="h-10 bg-zinc-100 border-b border-zinc-200"></div>
        <div className="divide-y divide-zinc-100">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="h-12 px-4 flex items-center gap-6">
              <div className="h-4 w-24 bg-zinc-200 rounded"></div>
              <div className="h-4 w-16 bg-zinc-200 rounded"></div>
              <div className="h-4 w-48 bg-zinc-200 rounded"></div>
              <div className="h-4 w-32 bg-zinc-200 rounded"></div>
              <div className="h-4 w-20 bg-zinc-200 rounded ml-auto"></div>
              <div className="h-4 w-16 bg-zinc-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

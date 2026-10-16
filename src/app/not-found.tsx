import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-zinc-200 rounded-xl p-8 shadow-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center mx-auto">
          <FileQuestion className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-zinc-900">Module / Page Not Found</h2>
          <p className="text-xs text-zinc-500">
            The requested municipal screen does not exist or may have been relocated.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Safety
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to telemetry / monitoring service
    console.error('[NTIS System Error Caught by App ErrorBoundary]:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-rose-200 rounded-xl p-8 shadow-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-zinc-900">System Error Encountered</h2>
          <p className="text-xs text-zinc-500">
            {error.message || 'An unexpected error occurred while communicating with municipal services.'}
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-zinc-400">Error Digest: {error.digest}</p>
          )}
        </div>

        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/"
            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5"
          >
            <Home className="w-4 h-4" /> Home Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

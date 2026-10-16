'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export default function PropertyTaxError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-rose-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <h3 className="font-semibold text-rose-900">Failed to Load Property Assessment Register</h3>
            <p className="text-xs text-rose-700">
              {error.message || 'Unable to retrieve property records from the assessment valuation database.'}
            </p>
          </div>
        </div>
        <Button variant="danger" size="sm" onClick={() => reset()} className="flex-shrink-0">
          <RefreshCw className="w-4 h-4 mr-1.5" /> Retry Ledger
        </Button>
      </div>
    </div>
  );
}

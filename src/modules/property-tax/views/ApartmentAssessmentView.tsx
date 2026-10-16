'use client';

import React, { useState } from 'react';
import { useAssessmentUnits } from '../hooks/useAssessment';
import { VirtualizedAssessmentTable } from '../components/VirtualizedAssessmentTable';
import { AssessmentUnit } from '../types/assessment.types';
import { Button } from '@/shared/ui/Button';
import { Plus, RefreshCw, Filter, Search } from 'lucide-react';

interface Props {
  initialParams?: { propertyId?: string };
}

export const ApartmentAssessmentView: React.FC<Props> = ({ initialParams }) => {
  const [propertyId] = useState(initialParams && initialParams.propertyId ? initialParams.propertyId : 'PROP-MAH-401');
  const [search, setSearch] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<AssessmentUnit | null>(null);

  const { data, refetch, isFetching } = useAssessmentUnits({ propertyId });

  const filteredUnits = (data && data.items ? data.items : []).filter(
    (u) =>
      u.unitNo.toLowerCase().includes(search.toLowerCase()) ||
      u.occupantName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Apartment Assessment Register</h1>
          <p className="text-sm text-zinc-500">
            Property ID: <span className="font-mono font-semibold text-blue-600">{propertyId}</span> | Ward 12, Shivaji Nagar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={'w-4 h-4 mr-1 ' + (isFetching ? 'animate-spin' : '')} /> Refresh
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1" /> Add Assessment Unit
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by unit number or owner name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-zinc-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button variant="outline" size="md">
          <Filter className="w-4 h-4 mr-1 text-zinc-500" /> Filters
        </Button>
      </div>

      <VirtualizedAssessmentTable units={filteredUnits} onSelectUnit={(unit) => setSelectedUnit(unit)} />

      {selectedUnit && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-blue-900">Selected Unit: {selectedUnit.unitNo}</h4>
            <p className="text-xs text-blue-700">
              Owner: {selectedUnit.occupantName} | Carpet: {selectedUnit.carpetArea} sq.ft | Annual Tax: ₹{selectedUnit.annualTax.toLocaleString()}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setSelectedUnit(null)}>
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

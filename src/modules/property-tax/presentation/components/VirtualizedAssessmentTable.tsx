'use client';

import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { AssessmentUnit } from '../../domain/entities/AssessmentUnit';
import { Badge } from '@/shared/ui/Badge';
import { AlertCircle, Building2 } from 'lucide-react';

interface Props {
  units: AssessmentUnit[];
  onSelectUnit?: (unit: AssessmentUnit) => void;
}

export const VirtualizedAssessmentTable: React.FC<Props> = ({ units, onSelectUnit }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: units.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 10,
  });

  return (
    <div className="border border-zinc-200 rounded-lg shadow-sm bg-white overflow-hidden flex flex-col">
      <div className="bg-zinc-50 border-b border-zinc-200 px-4 py-3 grid grid-cols-12 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
        <div className="col-span-2">Unit / Flat</div>
        <div className="col-span-1">Floor</div>
        <div className="col-span-3">Owner / Occupant</div>
        <div className="col-span-2">Usage Type</div>
        <div className="col-span-2 text-right">Built-Up Area</div>
        <div className="col-span-1 text-right">Capital Value</div>
        <div className="col-span-1 text-center">Status</div>
      </div>

      <div ref={parentRef} className="h-[520px] overflow-auto relative">
        <div
          style={{
            height: rowVirtualizer.getTotalSize() + 'px',
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const unit = units[virtualRow.index];
            if (!unit) return null;

            return (
              <div
                key={unit.id}
                onClick={() => onSelectUnit && onSelectUnit(unit)}
                className="absolute top-0 left-0 w-full grid grid-cols-12 items-center px-4 border-b border-zinc-100 hover:bg-blue-50/50 cursor-pointer transition-colors text-sm"
                style={{
                  height: virtualRow.size + 'px',
                  transform: 'translateY(' + virtualRow.start + 'px)',
                }}
              >
                <div className="col-span-2 flex items-center gap-2 font-mono font-medium text-blue-700">
                  <Building2 className="w-4 h-4 text-zinc-400" />
                  {unit.unitNo}
                </div>
                <div className="col-span-1 text-zinc-600">L-{unit.floorNumber}</div>
                <div className="col-span-3 font-medium text-zinc-800 truncate">{unit.occupantName}</div>
                <div className="col-span-2 text-xs text-zinc-600">{unit.usageType}</div>
                <div className="col-span-2 text-right font-mono text-zinc-700">{unit.builtUpArea} sq.ft</div>
                <div className="col-span-1 text-right font-mono font-semibold text-zinc-900">
                  ₹{(unit.capitalValue / 100000).toFixed(1)}L
                </div>
                <div className="col-span-1 flex justify-center">
                  {unit.status === 'ASSESSED' && <Badge variant="success">Assessed</Badge>}
                  {unit.status === 'PENDING' && <Badge variant="warning">Pending</Badge>}
                  {unit.status === 'DISPUTED' && (
                    <Badge variant="danger" className="gap-1">
                      <AlertCircle className="w-3 h-3" /> Disputed
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-zinc-50 border-t border-zinc-200 px-4 py-2 flex items-center justify-between text-xs text-zinc-500">
        <span>Showing {units.length} units (Virtualized Rendering @ 60 FPS)</span>
        <span>Property Assessment Status: Ready for Review</span>
      </div>
    </div>
  );
};

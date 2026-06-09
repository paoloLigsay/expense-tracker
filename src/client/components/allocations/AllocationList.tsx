'use client';

import { X } from 'lucide-react';
import { Card, List, ListItem } from '@/client/components/ui';

interface Allocation {
  id: string;
  name: string;
  amount: string;
  createdAt: Date;
}

interface AllocationListProps {
  allocations: Allocation[];
  isLoading: boolean;
  onDelete?: (id: string) => Promise<void>;
}

export function AllocationList({ allocations, isLoading, onDelete }: AllocationListProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-700 bg-slate-800">
        <div className="text-slate-400">Loading allocations...</div>
      </Card>
    );
  }

  if (allocations.length === 0) {
    return (
      <Card className="border-slate-700 bg-slate-800 text-center">
        <div className="text-slate-400">
          No allocations yet. Create one to start tracking.
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-white">Allocations</h3>
      <List gap="md">
        {allocations.map((allocation) => (
          <ListItem key={allocation.id} className="border-slate-700 bg-slate-800 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-white truncate">
                {allocation.name}
              </h4>
              <p className="text-xs text-slate-500">
                Created {new Date(allocation.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="ml-2 shrink-0 flex items-center gap-2">
              <div className="text-lime-400 font-semibold text-right">
                ${parseFloat(allocation.amount).toFixed(2)}
              </div>
              {onDelete && (
                <button
                  onClick={() => onDelete(allocation.id)}
                  className="text-slate-500 hover:text-red-400 transition-colors"
                  title="Delete allocation"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

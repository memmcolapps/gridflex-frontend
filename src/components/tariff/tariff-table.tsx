'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import {
  Ban,
  Check,
  CircleAlert,
  CircleX,
  Edit2,
  EllipsisVertical,
} from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { DeactivateTariffDialog } from './deactivate-tarrif-dialog';
import { EditTariffDialog } from './tarrif-edit-dialog';

interface Tariff {
  id: string;
  name: string;
  index: string;
  type: string;
  effectiveDate: Date | null;
  bandCode: string;
  tariffRate: string;
  status: 'active' | 'inactive';
  approvalStatus: 'approved' | 'pending' | 'rejected';
}

interface TariffTableProps {
  tariffs: Tariff[];
  onUpdateTariff: (id: string, updates: Partial<Tariff>) => void;
  selectedTariffs: string[];
  setSelectedTariffs: Dispatch<SetStateAction<string[]>>;
}

export const TariffTable = ({
  tariffs,
  onUpdateTariff,
  selectedTariffs,
  setSelectedTariffs,
}: TariffTableProps) => {
  const [dialogState, setDialogState] = useState<{
    type: 'edit' | 'deactivate' | 'approve' | 'reject' | null;
    tariff: Tariff | null;
  }>({ type: null, tariff: null });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTariffs(tariffs.map((tariff) => tariff.id));
    } else {
      setSelectedTariffs([]);
    }
  };

  const handleSelectTariff = (tariffId: string, checked: boolean) => {
    if (checked) {
      setSelectedTariffs((prev) => [...prev, tariffId]);
    } else {
      setSelectedTariffs((prev) => prev.filter((id) => id !== tariffId));
    }
  };

  const handleAction = (
    type: 'edit' | 'deactivate' | 'approve' | 'reject',
    tariff: Tariff
  ) => {
    if (type === 'approve') {
      onUpdateTariff(tariff.id, {
        approvalStatus: 'approved',
        status: 'active',
      });
    } else if (type === 'reject') {
      onUpdateTariff(tariff.id, {
        approvalStatus: 'rejected',
        status: 'inactive',
      });
    } else {
      setDialogState({ type, tariff });
    }
  };

  const handleCloseDialog = () => {
    setDialogState({ type: null, tariff: null });
  };

  const handleSave = (updatedTariff: Omit<Tariff, 'id' | 'status' | 'approvalStatus'>) => {
    if (dialogState.tariff) {
      onUpdateTariff(dialogState.tariff.id, {
        ...updatedTariff,
        status: dialogState.tariff.status,
        approvalStatus: dialogState.tariff.approvalStatus,
      });
    }
    handleCloseDialog();
  };

  const handleDeactivate = () => {
    if (dialogState.tariff) {
      onUpdateTariff(dialogState.tariff.id, {
        status: 'inactive',
        approvalStatus: 'rejected',
      });
    }
    handleCloseDialog();
  };

  if (tariffs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500 bg-white rounded-lg border border-gray-200">
        <CircleAlert className="h-8 w-8 mb-2" />
        <p className="text-sm font-medium">No tariff records found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedTariffs.length === tariffs.length && tariffs.length > 0}
                onCheckedChange={handleSelectAll}
                className="border-gray-300"
              />
            </TableHead>
            <TableHead className="text-gray-600 font-semibold">S/N</TableHead>
            <TableHead className="text-gray-600 font-semibold">Tariff Name</TableHead>
            <TableHead className="text-gray-600 font-semibold">Tariff Index</TableHead>
            <TableHead className="text-gray-600 font-semibold">Tariff Type</TableHead>
            <TableHead className="text-gray-600 font-semibold">Band Code</TableHead>
            <TableHead className="text-gray-600 font-semibold">Effective Date</TableHead>
            <TableHead className="text-gray-600 font-semibold">Rate</TableHead>
            <TableHead className="text-gray-600 font-semibold">Approval Status</TableHead>
            <TableHead className="text-gray-600 font-semibold">Status</TableHead>
            <TableHead className="text-right text-gray-600 font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tariffs.map((tariff, index) => (
            <TableRow
              key={tariff.id}
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
            >
              <TableCell>
                <Checkbox
                  checked={selectedTariffs.includes(tariff.id)}
                  onCheckedChange={(checked) => handleSelectTariff(tariff.id, checked as boolean)}
                  className="border-gray-300"
                />
              </TableCell>
              <TableCell className="text-gray-600">{String(index + 1).padStart(2, '0')}</TableCell>
              <TableCell className="font-medium text-gray-900">{tariff.name}</TableCell>
              <TableCell className="text-gray-600">{tariff.index}</TableCell>
              <TableCell className="text-gray-600">{tariff.type}</TableCell>
              <TableCell className="text-gray-600">{tariff.bandCode}</TableCell>
              <TableCell className="text-gray-600">
                {tariff.effectiveDate
                  ? format(tariff.effectiveDate, 'MMM dd, yyyy')
                  : 'N/A'}
              </TableCell>
              <TableCell className="text-gray-600">{tariff.tariffRate}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {tariff.approvalStatus === 'approved' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Approved
                    </span>
                  )}
                  {tariff.approvalStatus === 'pending' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  )}
                  {tariff.approvalStatus === 'rejected' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Rejected
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  {tariff.status === 'active' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Inactive
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 border border-gray-200 hover:bg-gray-100 p-2"
                    >
                      <span className="sr-only">Open menu</span>
                      <EllipsisVertical size={14} className="text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border-gray-200">
                    {tariff.approvalStatus !== 'approved' && (
                      <DropdownMenuItem
                        onClick={() => handleAction('approve', tariff)}
                        className="text-gray-800 hover:bg-gray-100 focus:bg-gray-100"
                      >
                        <Check size={14} className="text-green-600 mr-2" />
                        Approve tariff
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => handleAction('edit', tariff)}
                      className="text-gray-800 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      <Edit2 size={14} className="text-blue-600 mr-2" />
                      Edit details
                    </DropdownMenuItem>
                    {tariff.approvalStatus !== 'rejected' && (
                      <DropdownMenuItem
                        onClick={() => handleAction('reject', tariff)}
                        className="text-gray-800 hover:bg-gray-100 focus:bg-gray-100"
                      >
                        <CircleX size={14} className="text-red-600 mr-2" />
                        Reject Tariff
                      </DropdownMenuItem>
                    )}
                    {tariff.status !== 'inactive' && (
                      <DropdownMenuItem
                        onClick={() => handleAction('deactivate', tariff)}
                        className="text-gray-800 hover:bg-gray-100 focus:bg-gray-100"
                      >
                        <Ban size={14} className="text-red-600 mr-2" />
                        Deactivate tariff
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {dialogState.type === 'edit' && dialogState.tariff && (
        <EditTariffDialog
          open={dialogState.type === 'edit'}
          onOpenChange={handleCloseDialog}
          tariff={dialogState.tariff}
          onSave={handleSave}
        />
      )}

      {dialogState.type === 'deactivate' && dialogState.tariff && (
        <DeactivateTariffDialog
          open={dialogState.type === 'deactivate'}
          onOpenChange={handleCloseDialog}
          onConfirm={handleDeactivate}
        />
      )}
    </div>
  );
};
'use client';

import { useState } from 'react';

interface TaskData {
  cancer_name: string;
  OS: string;
  time: number;
  'average A_Auc': number;
  G: number;
  G_tilda0: number;
  G_tilda1: number;
  G_tilda2: number;
  G_ind: number;
  G_mix: number;
  G_NT_ind: number;
  G_Sup_ind: number;
  G_Unsup_ind: number;
  G_NT_mix: number;
  G_Sup_mix: number;
  G_Unsup_mix: number;
  Pattern: string | number;
}

interface TaskTableProps {
  data: TaskData[];
}

type SortColumn = keyof TaskData;
type SortDirection = 'asc' | 'desc';

export default function TaskTable({ data }: TaskTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('cancer_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    }

    return 0;
  });

  const formatValue = (value: any): string => {
    if (typeof value === 'number') {
      return value.toFixed(3);
    }
    return String(value);
  };

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const columns: { key: SortColumn; label: string }[] = [
    { key: 'cancer_name', label: 'Cancer Type' },
    { key: 'OS', label: 'OS' },
    { key: 'time', label: 'Time (Years)' },
    { key: 'average A_Auc', label: 'AUC' },
    // { key: 'G', label: 'G' },
    // { key: 'G_tilda0', label: 'G_tilda0' },
    // { key: 'G_tilda1', label: 'G_tilda1' },
    // { key: 'G_tilda2', label: 'G_tilda2' },
    { key: 'G_ind', label: 'G_ind' },
    { key: 'G_mix', label: 'G_mix' },
    { key: 'G_NT_ind', label: 'G_NT_ind' },
    { key: 'G_Sup_ind', label: 'G_Sup_ind' },
    { key: 'G_Unsup_ind', label: 'G_Unsup_ind' },
    { key: 'G_NT_mix', label: 'G_NT_mix' },
    { key: 'G_Sup_mix', label: 'G_Sup_mix' },
    { key: 'G_Unsup_mix', label: 'G_Unsup_mix' },
    { key: 'Pattern', label: 'Pattern' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => handleSort(column.key)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  <span className="text-gray-400">{getSortIcon(column.key)}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.key === 'Pattern' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {row[column.key]}
                    </span>
                  ) : (
                    formatValue(row[column.key])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-4 text-sm text-gray-500">
        Total records: {data.length}
      </div>
    </div>
  );
}

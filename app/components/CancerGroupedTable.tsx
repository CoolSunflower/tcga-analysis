'use client';

import { useState } from 'react';

interface CancerGroupedData {
  cancer_name: string;
  A_Auc: number;
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
  pattern_111_percentage: number;
}

interface CancerGroupedTableProps {
  data: CancerGroupedData[];
}

type SortColumn = keyof CancerGroupedData;
type SortDirection = 'asc' | 'desc';

export default function CancerGroupedTable({ data }: CancerGroupedTableProps) {
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
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <span className="text-gray-400">↕</span>;
    }
    return sortDirection === 'asc' ? <span className="text-blue-500">↑</span> : <span className="text-blue-500">↓</span>;
  };

  const formatNumber = (value: number) => {
    return value.toFixed(3);
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-green-100 text-green-800';
    if (percentage >= 50) return 'bg-yellow-100 text-yellow-800';
    if (percentage >= 25) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };  return (
    <div className="overflow-x-auto">
      <div className="mb-4 text-sm text-gray-600">
        Total Cancer Types: {data.length}
      </div>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('cancer_name')}
            >
              Cancer Type {getSortIcon('cancer_name')}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('A_Auc')}
            >
              Avg AUC {getSortIcon('A_Auc')}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('G_ind')}
            >
              G_ind {getSortIcon('G_ind')}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('G_mix')}
            >
              G_mix {getSortIcon('G_mix')}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('G_NT_ind')}
            >
              G_NT_ind {getSortIcon('G_NT_ind')}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('G_Sup_ind')}
            >
              G_Sup_ind {getSortIcon('G_Sup_ind')}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('G_Unsup_ind')}
            >
              G_Unsup_ind {getSortIcon('G_Unsup_ind')}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('G_NT_mix')}
            >
              G_NT_mix {getSortIcon('G_NT_mix')}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('G_Sup_mix')}
            >
              G_Sup_mix {getSortIcon('G_Sup_mix')}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('G_Unsup_mix')}
            >
              G_Unsup_mix {getSortIcon('G_Unsup_mix')}
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('pattern_111_percentage')}
            >
              111 Pattern % {getSortIcon('pattern_111_percentage')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((row, index) => (
            <tr key={row.cancer_name} className="hover:bg-gray-50">
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {row.cancer_name}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatNumber(row.A_Auc)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatNumber(row.G_ind)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatNumber(row.G_mix)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatNumber(row.G_NT_ind)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatNumber(row.G_Sup_ind)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatNumber(row.G_Unsup_ind)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatNumber(row.G_NT_mix)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatNumber(row.G_Sup_mix)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatNumber(row.G_Unsup_mix)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPercentageColor(row.pattern_111_percentage)}`}>
                  {formatNumber(row.pattern_111_percentage)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

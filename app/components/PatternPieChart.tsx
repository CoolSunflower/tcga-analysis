'use client';

import { useState, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

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

interface PatternPieChartProps {
  data: TaskData[];
}

export default function PatternPieChart({ data }: PatternPieChartProps) {
  const [selectedCancer, setSelectedCancer] = useState<string>('all');

  // Get unique cancer types
  const cancerTypes = useMemo(() => {
    const unique = Array.from(new Set(data.map(item => item.cancer_name))).sort();
    return ['all', ...unique];
  }, [data]);

  // Filter data based on selected cancer type
  const filteredData = useMemo(() => {
    if (selectedCancer === 'all') {
      return data;
    }
    return data.filter(item => item.cancer_name === selectedCancer);
  }, [data, selectedCancer]);

  // Calculate pattern distribution
  const patternDistribution = useMemo(() => {
    const patterns = ['000', '001', '010', '011', '100', '101', '110', '111'];
    const counts: { [key: string]: number } = {};
    
    // Initialize all patterns with 0
    patterns.forEach(pattern => {
      counts[pattern] = 0;
    });    // Count actual patterns in data
    filteredData.forEach(item => {
      const patternStr = String(item.Pattern);
      if (patternStr && counts.hasOwnProperty(patternStr)) {
        counts[patternStr]++;
      }
    });

    return {
      labels: patterns,
      counts: patterns.map(pattern => counts[pattern]),
      total: filteredData.length
    };
  }, [filteredData]);

  // Chart data configuration
  const chartData = {
    labels: patternDistribution.labels.map(label => `Pattern ${label}`),
    datasets: [
      {
        data: patternDistribution.counts,
        backgroundColor: [
          '#FF6384', // 000 - Red
          '#36A2EB', // 001 - Blue
          '#FFCE56', // 010 - Yellow
          '#4BC0C0', // 011 - Teal
          '#9966FF', // 100 - Purple
          '#FF9F40', // 101 - Orange
          '#FF6384', // 110 - Pink
          '#4BC0C0', // 111 - Green
        ],
        borderColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#4BC0C0',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          '#FF4468',
          '#2E8BC0',
          '#FFB84D',
          '#3FA5A5',
          '#8A4FFF',
          '#FF8C2E',
          '#FF4468',
          '#3FA5A5',
        ],
      },
    ],
  };

  // Chart options
  const chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          padding: 20,
          font: {
            size: 12,
          },          generateLabels: (chart) => {
            const original = ChartJS.overrides.pie.plugins.legend.labels.generateLabels;
            const labels = original(chart);
            
            return labels.map((label, index) => ({
              ...label,
              text: `${label.text}: ${patternDistribution.counts[index]} (${
                patternDistribution.total > 0 
                  ? ((patternDistribution.counts[index] / patternDistribution.total) * 100).toFixed(1)
                  : '0.0'
              }%)`,
            }));
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const percentage = patternDistribution.total > 0 
              ? ((value / patternDistribution.total) * 100).toFixed(1)
              : '0.0';
            return `${label}: ${value} tasks (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Cancer Type Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <label htmlFor="cancer-select" className="text-sm font-medium text-gray-700">
            Cancer Type:
          </label>
          <select
            id="cancer-select"
            value={selectedCancer}
            onChange={(e) => setSelectedCancer(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
          >
            <option value="all">All Cancer Types</option>
            {cancerTypes.slice(1).map(cancer => (
              <option key={cancer} value={cancer}>
                {cancer}
              </option>
            ))}
          </select>
        </div>
        
        <div className="text-sm text-gray-600">
          Total Tasks: {patternDistribution.total}
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-96 w-full">
        {patternDistribution.total > 0 ? (
          <Pie data={chartData} options={chartOptions} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <div>No data available for selected cancer type</div>
            </div>
          </div>
        )}
      </div>

      {/* Pattern Summary Table */}
      <div className="mt-6">
        <h4 className="text-lg font-medium text-gray-800 mb-3">
          Pattern Distribution Summary
          {selectedCancer !== 'all' && (
            <span className="text-sm font-normal text-gray-600 ml-2">
              ({selectedCancer})
            </span>
          )}
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pattern
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Count
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visual
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patternDistribution.labels.map((pattern, index) => {
                const count = patternDistribution.counts[index];
                const percentage = patternDistribution.total > 0 
                  ? (count / patternDistribution.total) * 100
                  : 0;
                
                return (
                  <tr key={pattern} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {pattern}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {count}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {percentage.toFixed(1)}%
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

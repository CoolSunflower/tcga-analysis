'use client';

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import TaskTable from './components/TaskTable';
import CancerGroupedTable from './components/CancerGroupedTable';
import PatternPieChart from './components/PatternPieChart';

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

export default function Home() {
  const [activeTab, setActiveTab] = useState<'bagging' | 'no-bagging'>('bagging');
  const [baggingData, setBaggingData] = useState<TaskData[]>([]);
  const [noBaggingData, setNoBaggingData] = useState<TaskData[]>([]);
  const [baggingGroupedData, setBaggingGroupedData] = useState<CancerGroupedData[]>([]);
  const [noBaggingGroupedData, setNoBaggingGroupedData] = useState<CancerGroupedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to calculate percentage of 111 patterns for each cancer type
  const calculatePattern111Percentage = (data: TaskData[], cancerName: string): number => {
    const cancerTasks = data.filter(task => task.cancer_name === cancerName);
    const pattern111Count = cancerTasks.filter(task => {
      // Convert pattern to string and clean any whitespace
      const patternStr = String(task.Pattern).trim();
      return patternStr === '111';
    }).length;
    
    return cancerTasks.length > 0 ? (pattern111Count / cancerTasks.length) * 100 : 0;
  };

  // Function to group data by cancer type
  const groupByCancerType = (data: TaskData[]): CancerGroupedData[] => {
    const grouped: { [key: string]: TaskData[] } = {};
    
    data.forEach(task => {
      if (!grouped[task.cancer_name]) {
        grouped[task.cancer_name] = [];
      }
      grouped[task.cancer_name].push(task);
    });

    return Object.keys(grouped).map(cancerName => {
      const tasks = grouped[cancerName];
      const avgMetrics = {
        cancer_name: cancerName,
        A_Auc: tasks.reduce((sum, task) => sum + task['average A_Auc'], 0) / tasks.length,
        G: tasks.reduce((sum, task) => sum + task.G, 0) / tasks.length,
        G_tilda0: tasks.reduce((sum, task) => sum + task.G_tilda0, 0) / tasks.length,
        G_tilda1: tasks.reduce((sum, task) => sum + task.G_tilda1, 0) / tasks.length,
        G_tilda2: tasks.reduce((sum, task) => sum + task.G_tilda2, 0) / tasks.length,
        G_ind: tasks.reduce((sum, task) => sum + task.G_ind, 0) / tasks.length,
        G_mix: tasks.reduce((sum, task) => sum + task.G_mix, 0) / tasks.length,
        G_NT_ind: tasks.reduce((sum, task) => sum + task.G_NT_ind, 0) / tasks.length,
        G_Sup_ind: tasks.reduce((sum, task) => sum + task.G_Sup_ind, 0) / tasks.length,
        G_Unsup_ind: tasks.reduce((sum, task) => sum + task.G_Unsup_ind, 0) / tasks.length,
        G_NT_mix: tasks.reduce((sum, task) => sum + task.G_NT_mix, 0) / tasks.length,
        G_Sup_mix: tasks.reduce((sum, task) => sum + task.G_Sup_mix, 0) / tasks.length,
        G_Unsup_mix: tasks.reduce((sum, task) => sum + task.G_Unsup_mix, 0) / tasks.length,
        pattern_111_percentage: calculatePattern111Percentage(data, cancerName)
      };

      // Round all numeric values to 3 decimal places
      Object.keys(avgMetrics).forEach(key => {
        if (typeof avgMetrics[key as keyof CancerGroupedData] === 'number') {
          (avgMetrics as any)[key] = Math.round((avgMetrics as any)[key] * 1000) / 1000;
        }
      });

      return avgMetrics;
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load bagging data
        const baggingResponse = await fetch('/data/bagging_analysis.csv');
        if (!baggingResponse.ok) {
          throw new Error(`Failed to load bagging data: ${baggingResponse.status}`);
        }
        const baggingCsv = await baggingResponse.text();
        
        // Load no-bagging data
        const noBaggingResponse = await fetch('/data/features_analysis.csv');
        if (!noBaggingResponse.ok) {
          throw new Error(`Failed to load features data: ${noBaggingResponse.status}`);
        }
        const noBaggingCsv = await noBaggingResponse.text();

        // Parse CSV data with specific handling for Pattern column
        const baggingParsed = Papa.parse<TaskData>(baggingCsv, {
          header: true,
          dynamicTyping: (field) => {
            // Don't auto-convert Pattern column to number, keep as string
            return field !== 'Pattern';
          },
          skipEmptyLines: true
        });

        const noBaggingParsed = Papa.parse<TaskData>(noBaggingCsv, {
          header: true,
          dynamicTyping: (field) => {
            // Don't auto-convert Pattern column to number, keep as string
            return field !== 'Pattern';
          },
          skipEmptyLines: true
        });

        // Check for parsing errors
        if (baggingParsed.errors.length > 0) {
          console.warn('Bagging CSV parsing warnings:', baggingParsed.errors);
        }
        if (noBaggingParsed.errors.length > 0) {
          console.warn('Features CSV parsing warnings:', noBaggingParsed.errors);
        }

        // Set task-level data
        setBaggingData(baggingParsed.data);
        setNoBaggingData(noBaggingParsed.data);

        // Set grouped data
        setBaggingGroupedData(groupByCancerType(baggingParsed.data));
        setNoBaggingGroupedData(groupByCancerType(noBaggingParsed.data));

        console.log(`Loaded ${baggingParsed.data.length} bagging records and ${noBaggingParsed.data.length} features records`);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading cancer analysis data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-xl text-red-600 mb-4">Error loading data</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentTaskData = activeTab === 'bagging' ? baggingData : noBaggingData;
  const currentGroupedData = activeTab === 'bagging' ? baggingGroupedData : noBaggingGroupedData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Cancer Performance Gap Analysis
        </h1>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-1">
            <button
              onClick={() => setActiveTab('bagging')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'bagging'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              Bagging Analysis
            </button>
            <button
              onClick={() => setActiveTab('no-bagging')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'no-bagging'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-red-500'
              }`}
            >
              No Bagging Analysis
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Task-Level Table */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Task-Level Data ({activeTab === 'bagging' ? 'Bagging' : 'No Bagging'})
            </h2>
            <TaskTable data={currentTaskData} />
          </div>

          {/* Cancer-Grouped Table */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Cancer-Grouped Data ({activeTab === 'bagging' ? 'Bagging' : 'No Bagging'})
            </h2>
            <CancerGroupedTable data={currentGroupedData} />
          </div>

          {/* Pattern Distribution Pie Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Pattern Distribution by Cancer Type
            </h2>
            <PatternPieChart data={currentTaskData} />
          </div>
        </div>
      </div>
    </div>
  );
}

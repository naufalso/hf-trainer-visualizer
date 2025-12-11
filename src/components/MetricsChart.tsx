import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from 'recharts';
import { LogEntry, TrainerStateWithMetadata } from '../types';

interface MetricsChartProps {
  trainerStates: TrainerStateWithMetadata[];
  selectedMetrics: string[];
}

const MetricsChart: React.FC<MetricsChartProps> = ({ trainerStates, selectedMetrics }) => {
  const [smoothingFactor, setSmoothingFactor] = useState<number>(0);

  // Prepare data for comparison
  const chartData = useMemo(() => {
    if (trainerStates.length === 0) return [];

    // For single file, return the log_history directly
    if (trainerStates.length === 1) {
      return trainerStates[0].data.log_history;
    }

    // For multiple files, we need to merge the data
    // Find all unique steps across all files
    const allSteps = new Set<number>();
    trainerStates.forEach(state => {
      state.data.log_history.forEach(entry => {
        if (entry.step !== undefined) {
          allSteps.add(entry.step);
        }
      });
    });

    const sortedSteps = Array.from(allSteps).sort((a, b) => a - b);

    // Create merged data structure
    return sortedSteps.map(step => {
      const dataPoint: any = { step };
      
      trainerStates.forEach(state => {
        const entry = state.data.log_history.find(e => e.step === step);
        if (entry) {
          selectedMetrics.forEach(metric => {
            const key = `${metric}_${state.id}`;
            dataPoint[key] = entry[metric];
          });
        }
      });

      return dataPoint;
    });
  }, [trainerStates, selectedMetrics]);

  const smoothedData = useMemo(() => {
    if (smoothingFactor === 0) return chartData;

    // Apply smoothing only to single file view for simplicity
    if (trainerStates.length === 1) {
      const data = chartData as LogEntry[];
      const smoothed: LogEntry[] = [];
      const windowSize = smoothingFactor;
      const runningSums: Record<string, number[]> = {};

      selectedMetrics.forEach(metric => {
        runningSums[metric] = [];
      });

      for (let i = 0; i < data.length; i++) {
        const entry = { ...data[i] };

        selectedMetrics.forEach(metric => {
          const val = data[i][metric];

          if (typeof val === 'number') {
            runningSums[metric].push(val);

            if (runningSums[metric].length > windowSize + 1) {
              runningSums[metric].shift();
            }

            const sum = runningSums[metric].reduce((acc, v) => acc + v, 0);
            entry[metric] = sum / runningSums[metric].length;
          }
        });

        smoothed.push(entry);
      }

      return smoothed;
    }

    return chartData;
  }, [chartData, smoothingFactor, selectedMetrics, trainerStates.length]);

  // Generate lines for the chart
  const lines = useMemo(() => {
    if (trainerStates.length === 1) {
      // Single file: show each metric with its own color
      return selectedMetrics.map((metric) => (
        <Line
          key={metric}
          type="monotone"
          dataKey={metric}
          stroke={trainerStates[0].color}
          strokeWidth={2.5}
          dot={{ r: 0 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
          connectNulls
          animationDuration={1000}
          name={metric}
        />
      ));
    } else {
      // Multiple files: show each metric from each file
      const lineElements: React.ReactElement[] = [];
      selectedMetrics.forEach((metric) => {
        trainerStates.forEach((state) => {
          const key = `${metric}_${state.id}`;
          lineElements.push(
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={state.color}
              strokeWidth={2.5}
              dot={{ r: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              connectNulls
              animationDuration={1000}
              name={`${metric} (${state.fileName})`}
            />
          );
        });
      });
      return lineElements;
    }
  }, [trainerStates, selectedMetrics]);

  if (selectedMetrics.length === 0) {
    return (
      <div className="no-metrics-message">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', opacity: 0.5 }}>
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
        <p>Select metrics from above to visualize the training progress</p>
      </div>
    );
  }

  return (
    <div className="metrics-chart">
      <div className="chart-header">
        <h3>Performance History</h3>
        <div className="chart-controls">
          <label className="smoothing-control">
            <span>Smoothing: {smoothingFactor}</span>
            <input
              type="range"
              min="0"
              max="50"
              value={smoothingFactor}
              onChange={(e) => setSmoothingFactor(Number(e.target.value))}
              className="smoothing-slider"
            />
          </label>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={450}>
        <LineChart data={smoothedData} margin={{ top: 10, right: 30, left: 10, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis
            dataKey="step"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            dy={10}
            label={{ value: 'Training Steps', position: 'insideBottom', offset: -10, fill: '#6B7280', dy: 40 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            dx={-10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}
            labelStyle={{ color: '#374151', fontWeight: 600, marginBottom: '0.25rem' }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
          />
          <Brush
            dataKey="step"
            height={30}
            stroke="#6366f1"
            fill="#e0e7ff"
          />
          {lines}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsChart;

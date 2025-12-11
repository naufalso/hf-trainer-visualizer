import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { LogEntry } from '../types';

interface MetricsChartProps {
  data: LogEntry[];
  selectedMetrics: string[];
}

const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7c7c',
  '#a28fd0',
  '#ff9f40',
  '#4bc0c0',
  '#ff6384',
];

const MetricsChart: React.FC<MetricsChartProps> = ({ data, selectedMetrics }) => {
  if (selectedMetrics.length === 0) {
    return (
      <div className="no-metrics-message">
        <p>Please select at least one metric to visualize</p>
      </div>
    );
  }

  return (
    <div className="metrics-chart">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="step"
            label={{ value: 'Step', position: 'insideBottom', offset: -5 }}
          />
          <YAxis label={{ value: 'Value', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          {selectedMetrics.map((metric, index) => (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsChart;

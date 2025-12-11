import React from 'react';

interface MetricsSelectorProps {
  availableMetrics: string[];
  selectedMetrics: string[];
  onMetricsChange: (metrics: string[]) => void;
}

const MetricsSelector: React.FC<MetricsSelectorProps> = ({
  availableMetrics,
  selectedMetrics,
  onMetricsChange,
}) => {
  const handleToggle = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      onMetricsChange(selectedMetrics.filter((m) => m !== metric));
    } else {
      onMetricsChange([...selectedMetrics, metric]);
    }
  };

  const handleSelectAll = () => {
    onMetricsChange(availableMetrics);
  };

  const handleDeselectAll = () => {
    onMetricsChange([]);
  };

  return (
    <div className="metrics-selector">
      <div className="selector-header">
        <h3>Select Metrics to Visualize</h3>
        <div className="selector-actions">
          <button onClick={handleSelectAll} className="action-button">
            Select All
          </button>
          <button onClick={handleDeselectAll} className="action-button">
            Deselect All
          </button>
        </div>
      </div>
      <div className="metrics-list">
        {availableMetrics.map((metric) => (
          <label key={metric} className="metric-checkbox">
            <input
              type="checkbox"
              checked={selectedMetrics.includes(metric)}
              onChange={() => handleToggle(metric)}
            />
            <span>{metric}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default MetricsSelector;

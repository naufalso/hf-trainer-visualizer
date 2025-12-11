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
        <div className="header-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          <h3>Select Metrics</h3>
        </div>
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
          <label key={metric} className={`metric-toggle ${selectedMetrics.includes(metric) ? 'active' : ''}`}>
            <input
              type="checkbox"
              checked={selectedMetrics.includes(metric)}
              onChange={() => handleToggle(metric)}
              className="toggle-input"
            />
            <div className="toggle-switch">
              <div className="toggle-thumb"></div>
            </div>
            <span className="toggle-label">{metric}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default MetricsSelector;

import React, { useState, useMemo } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import MetricsChart from './components/MetricsChart';
import MetricsSelector from './components/MetricsSelector';
import TrainingInfo from './components/TrainingInfo';
import { TrainerState } from './types';

function App() {
  const [trainerState, setTrainerState] = useState<TrainerState | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  const availableMetrics = useMemo(() => {
    if (!trainerState) return [];

    const metricsSet = new Set<string>();
    trainerState.log_history.forEach((entry) => {
      Object.keys(entry).forEach((key) => {
        // Exclude 'step' and 'epoch' from metrics, keep them as x-axis
        if (key !== 'step' && key !== 'epoch' && entry[key] !== undefined) {
          metricsSet.add(key);
        }
      });
    });

    return Array.from(metricsSet).sort();
  }, [trainerState]);

  const handleFileLoad = (data: TrainerState) => {
    setTrainerState(data);
    // Auto-select common metrics
    const defaultMetrics = ['loss', 'eval_loss', 'learning_rate', 'eval_accuracy']
      .filter((metric) => data.log_history.some((entry) => entry[metric] !== undefined));
    setSelectedMetrics(defaultMetrics.length > 0 ? defaultMetrics : []);
  };

  const handleReset = () => {
    setTrainerState(null);
    setSelectedMetrics([]);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>
          <span className="emoji">🤗</span>{' '}
          <span className="gradient-text">HuggingFace Trainer Visualizer</span>
        </h1>
        <p>Upload and visualize your trainer_state.json logs</p>
      </header>

      {!trainerState ? (
        <FileUpload onFileLoad={handleFileLoad} />
      ) : (
        <div className="content-container">
          <div className="controls">
            <button onClick={handleReset} className="reset-button">
              Upload New File
            </button>
          </div>

          <TrainingInfo trainerState={trainerState} />

          <MetricsSelector
            availableMetrics={availableMetrics}
            selectedMetrics={selectedMetrics}
            onMetricsChange={setSelectedMetrics}
          />

          <MetricsChart
            data={trainerState.log_history}
            selectedMetrics={selectedMetrics}
          />
        </div>
      )}

      <footer className="app-footer">
        <p>
          Built for visualizing HuggingFace training logs |{' '}
          <a
            href="https://github.com/naufalso/hf-trainer-visualizer"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;

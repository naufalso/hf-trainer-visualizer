import React, { useState, useMemo } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import MetricsChart from './components/MetricsChart';
import MetricsSelector from './components/MetricsSelector';
import TrainingInfo from './components/TrainingInfo';
import { TrainerState, TrainerStateWithMetadata } from './types';

const COLORS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#f43f5e', // Rose
  '#84cc16', // Lime
];

function App() {
  const [trainerStates, setTrainerStates] = useState<TrainerStateWithMetadata[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [showUpload, setShowUpload] = useState(false);

  const availableMetrics = useMemo(() => {
    if (trainerStates.length === 0) return [];

    const metricsSet = new Set<string>();
    trainerStates.forEach((state) => {
      state.data.log_history.forEach((entry) => {
        Object.keys(entry).forEach((key) => {
          // Exclude 'step' and 'epoch' from metrics, keep them as x-axis
          if (key !== 'step' && key !== 'epoch' && entry[key] !== undefined) {
            metricsSet.add(key);
          }
        });
      });
    });

    return Array.from(metricsSet).sort();
  }, [trainerStates]);

  const handleFileLoad = (data: TrainerState, fileName: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    const colorIndex = trainerStates.length % COLORS.length;
    const newState: TrainerStateWithMetadata = {
      id,
      fileName,
      data,
      color: COLORS[colorIndex],
    };

    setTrainerStates((prev) => {
      const updated = [...prev, newState];
      
      // Auto-select common metrics on first file only
      if (prev.length === 0) {
        const defaultMetrics = ['loss', 'eval_loss', 'learning_rate', 'eval_accuracy']
          .filter((metric) => data.log_history.some((entry) => entry[metric] !== undefined));
        setSelectedMetrics(defaultMetrics.length > 0 ? defaultMetrics : []);
      }
      
      return updated;
    });
    setShowUpload(false);
  };

  const handleRemoveFile = (id: string) => {
    setTrainerStates((prev) => {
      const updated = prev.filter((state) => state.id !== id);
      
      // Clear selected metrics if no files remain
      if (updated.length === 0) {
        setSelectedMetrics([]);
      }
      
      return updated;
    });
  };

  const handleReset = () => {
    setTrainerStates([]);
    setSelectedMetrics([]);
    setShowUpload(false);
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

      {trainerStates.length === 0 ? (
        <FileUpload onFileLoad={handleFileLoad} />
      ) : (
        <div className="content-container">
          <div className="controls">
            <button onClick={handleReset} className="reset-button">
              Reset All
            </button>
          </div>

          <FileList 
            files={trainerStates} 
            onRemove={handleRemoveFile}
            onAddMore={() => setShowUpload(true)}
          />

          {showUpload && (
            <div className="inline-upload">
              <FileUpload onFileLoad={handleFileLoad} />
              <button onClick={() => setShowUpload(false)} className="cancel-upload-button">
                Cancel
              </button>
            </div>
          )}

          {trainerStates.length === 1 && (
            <TrainingInfo trainerState={trainerStates[0].data} />
          )}

          <MetricsSelector
            availableMetrics={availableMetrics}
            selectedMetrics={selectedMetrics}
            onMetricsChange={setSelectedMetrics}
          />

          <MetricsChart
            trainerStates={trainerStates}
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

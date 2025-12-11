import React from 'react';
import { TrainerState } from '../types';

interface TrainingInfoProps {
  trainerState: TrainerState;
}

const TrainingInfo: React.FC<TrainingInfoProps> = ({ trainerState }) => {
  const { log_history, epoch, global_step, num_train_epochs, best_metric, best_model_checkpoint } = trainerState;

  const totalSteps = log_history.length;
  const finalEpoch = epoch || log_history[log_history.length - 1]?.epoch;

  return (
    <div className="training-info">
      <h3>Training Summary</h3>
      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">Total Steps:</span>
          <span className="info-value">{totalSteps}</span>
        </div>
        {global_step !== undefined && (
          <div className="info-item">
            <span className="info-label">Global Step:</span>
            <span className="info-value">{global_step}</span>
          </div>
        )}
        {finalEpoch !== undefined && (
          <div className="info-item">
            <span className="info-label">Final Epoch:</span>
            <span className="info-value">{finalEpoch.toFixed(2)}</span>
          </div>
        )}
        {num_train_epochs !== undefined && (
          <div className="info-item">
            <span className="info-label">Total Epochs:</span>
            <span className="info-value">{num_train_epochs}</span>
          </div>
        )}
        {best_metric !== undefined && best_metric !== null && (
          <div className="info-item">
            <span className="info-label">Best Metric:</span>
            <span className="info-value">{best_metric.toFixed(4)}</span>
          </div>
        )}
        {best_model_checkpoint && (
          <div className="info-item full-width">
            <span className="info-label">Best Checkpoint:</span>
            <span className="info-value">{best_model_checkpoint}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingInfo;

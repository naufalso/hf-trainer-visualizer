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
      <div className="info-header">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <path d="M16 13H8"></path>
          <path d="M16 17H8"></path>
          <path d="M10 9H8"></path>
        </svg>
        <h3>Training Summary</h3>
      </div>
      <div className="info-grid">
        <div className="info-card">
          <div className="card-icon blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <div className="card-content">
            <span className="info-label">Total Steps</span>
            <span className="info-value">{totalSteps}</span>
          </div>
        </div>

        {global_step !== undefined && (
          <div className="info-card">
            <div className="card-icon purple">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="card-content">
              <span className="info-label">Global Step</span>
              <span className="info-value">{global_step}</span>
            </div>
          </div>
        )}

        {finalEpoch !== undefined && (
          <div className="info-card">
            <div className="card-icon green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path>
              </svg>
            </div>
            <div className="card-content">
              <span className="info-label">Final Epoch</span>
              <span className="info-value">{typeof finalEpoch === 'number' ? finalEpoch.toFixed(2) : finalEpoch}</span>
            </div>
          </div>
        )}

        {num_train_epochs !== undefined && (
          <div className="info-card">
            <div className="card-icon orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className="card-content">
              <span className="info-label">Total Epochs</span>
              <span className="info-value">{num_train_epochs}</span>
            </div>
          </div>
        )}

        {best_metric !== undefined && best_metric !== null && (
          <div className="info-card">
            <div className="card-icon pink">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <div className="card-content">
              <span className="info-label">Best Metric</span>
              <span className="info-value">{best_metric.toFixed(4)}</span>
            </div>
          </div>
        )}

        {best_model_checkpoint && (
          <div className="info-card full-width">
            <div className="card-icon indigo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div className="card-content">
              <span className="info-label">Best Checkpoint</span>
              <span className="info-value small">{best_model_checkpoint}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingInfo;

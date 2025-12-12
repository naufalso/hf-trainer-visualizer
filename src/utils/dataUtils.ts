// Utility functions for handling training data

import { LogEntry, TrainerState } from '../types';

/**
 * Checks if a value is a valid number (not NaN, not Infinity)
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Sanitizes a log entry by removing NaN and invalid values
 */
export function sanitizeLogEntry(entry: LogEntry): LogEntry {
  const sanitized: LogEntry = {};
  
  for (const key in entry) {
    const value = entry[key];
    if (isValidNumber(value)) {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Sanitizes trainer state data by removing NaN and invalid values from log_history
 * Note: best_metric defaults to null (as per TrainerState type definition) while
 * other optional fields default to undefined when invalid
 */
export function sanitizeTrainerState(data: TrainerState): TrainerState {
  return {
    ...data,
    log_history: data.log_history.map(entry => sanitizeLogEntry(entry)),
    best_metric: isValidNumber(data.best_metric) ? data.best_metric : null,
    epoch: isValidNumber(data.epoch) ? data.epoch : undefined,
    global_step: isValidNumber(data.global_step) ? data.global_step : undefined,
    max_steps: isValidNumber(data.max_steps) ? data.max_steps : undefined,
    num_train_epochs: isValidNumber(data.num_train_epochs) ? data.num_train_epochs : undefined,
    total_flos: isValidNumber(data.total_flos) ? data.total_flos : undefined,
  };
}

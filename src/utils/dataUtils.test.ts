import { isValidNumber, sanitizeLogEntry, sanitizeTrainerState } from './dataUtils';
import { LogEntry, TrainerState } from '../types';

describe('dataUtils', () => {
  describe('isValidNumber', () => {
    test('returns true for valid numbers', () => {
      expect(isValidNumber(0)).toBe(true);
      expect(isValidNumber(1.5)).toBe(true);
      expect(isValidNumber(-10)).toBe(true);
      expect(isValidNumber(100.123)).toBe(true);
    });

    test('returns false for NaN', () => {
      expect(isValidNumber(NaN)).toBe(false);
    });

    test('returns false for Infinity', () => {
      expect(isValidNumber(Infinity)).toBe(false);
      expect(isValidNumber(-Infinity)).toBe(false);
    });

    test('returns false for non-numbers', () => {
      expect(isValidNumber(undefined)).toBe(false);
      expect(isValidNumber(null)).toBe(false);
      expect(isValidNumber('123')).toBe(false);
      expect(isValidNumber({})).toBe(false);
      expect(isValidNumber([])).toBe(false);
    });
  });

  describe('sanitizeLogEntry', () => {
    test('keeps valid numbers', () => {
      const entry: LogEntry = {
        step: 100,
        loss: 0.5,
        learning_rate: 0.001,
        epoch: 1.0,
      };
      const result = sanitizeLogEntry(entry);
      expect(result).toEqual(entry);
    });

    test('removes NaN values', () => {
      const entry: LogEntry = {
        step: 100,
        loss: NaN,
        learning_rate: 0.001,
        epoch: 1.0,
      };
      const result = sanitizeLogEntry(entry);
      expect(result).toEqual({
        step: 100,
        learning_rate: 0.001,
        epoch: 1.0,
      });
      expect(result.loss).toBeUndefined();
    });

    test('removes Infinity values', () => {
      const entry: LogEntry = {
        step: 100,
        loss: Infinity,
        learning_rate: 0.001,
        epoch: 1.0,
      };
      const result = sanitizeLogEntry(entry);
      expect(result).toEqual({
        step: 100,
        learning_rate: 0.001,
        epoch: 1.0,
      });
    });

    test('handles mixed valid and invalid values', () => {
      const entry: LogEntry = {
        step: 100,
        loss: NaN,
        learning_rate: 0.001,
        epoch: Infinity,
        eval_loss: 0.3,
      };
      const result = sanitizeLogEntry(entry);
      expect(result).toEqual({
        step: 100,
        learning_rate: 0.001,
        eval_loss: 0.3,
      });
    });
  });

  describe('sanitizeTrainerState', () => {
    test('sanitizes log_history entries', () => {
      const data: TrainerState = {
        log_history: [
          { step: 1, loss: 0.5, learning_rate: 0.001 },
          { step: 2, loss: NaN, learning_rate: 0.001 },
          { step: 3, loss: 0.3, learning_rate: Infinity },
        ],
      };
      const result = sanitizeTrainerState(data);
      expect(result.log_history[0]).toEqual({ step: 1, loss: 0.5, learning_rate: 0.001 });
      expect(result.log_history[1]).toEqual({ step: 2, learning_rate: 0.001 });
      expect(result.log_history[2]).toEqual({ step: 3, loss: 0.3 });
    });

    test('sanitizes top-level numeric fields', () => {
      const data: TrainerState = {
        log_history: [],
        best_metric: NaN,
        epoch: 3.0,
        global_step: Infinity,
        num_train_epochs: 3,
      };
      const result = sanitizeTrainerState(data);
      expect(result.best_metric).toBeNull();
      expect(result.epoch).toBe(3.0);
      expect(result.global_step).toBeUndefined();
      expect(result.num_train_epochs).toBe(3);
    });

    test('preserves other fields', () => {
      const data: TrainerState = {
        log_history: [],
        best_model_checkpoint: './checkpoint-1000',
        is_hyper_param_search: false,
        trial_name: 'test',
      };
      const result = sanitizeTrainerState(data);
      expect(result.best_model_checkpoint).toBe('./checkpoint-1000');
      expect(result.is_hyper_param_search).toBe(false);
      expect(result.trial_name).toBe('test');
    });
  });
});

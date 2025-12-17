// Types for HuggingFace trainer_state.json

export interface LogEntry {
  loss?: number;
  learning_rate?: number;
  epoch?: number;
  step?: number;
  eval_loss?: number;
  eval_accuracy?: number;
  eval_runtime?: number;
  eval_samples_per_second?: number;
  eval_steps_per_second?: number;
  [key: string]: number | undefined; // Allow any additional metrics
}

export interface TrainerState {
  best_metric?: number | null;
  best_model_checkpoint?: string | null;
  epoch?: number;
  global_step?: number;
  is_hyper_param_search?: boolean;
  is_local_process_zero?: boolean;
  is_world_process_zero?: boolean;
  log_history: LogEntry[];
  max_steps?: number;
  num_train_epochs?: number;
  total_flos?: number;
  trial_name?: string | null;
  trial_params?: Record<string, any> | null;
}

export interface TrainerStateWithMetadata {
  id: string;
  fileName: string;
  data: TrainerState;
  color: string;
}

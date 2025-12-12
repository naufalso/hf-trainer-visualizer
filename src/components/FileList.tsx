import React from 'react';
import { TrainerStateWithMetadata } from '../types';

interface FileListProps {
  files: TrainerStateWithMetadata[];
  onRemove: (id: string) => void;
  onAddMore: () => void;
}

const FileList: React.FC<FileListProps> = ({ files, onRemove, onAddMore }) => {
  return (
    <div className="file-list-container">
      <div className="file-list-header">
        <div className="header-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
          <h3>Loaded Files ({files.length})</h3>
        </div>
        <button onClick={onAddMore} className="add-more-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add More Files
        </button>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div key={file.id} className="file-item">
            <div className="file-color-indicator" style={{ backgroundColor: file.color }}></div>
            <div className="file-info">
              <span className="file-name">{file.fileName}</span>
              <span className="file-details">
                {file.data.log_history.length} steps • {file.data.epoch?.toFixed(1) || 'N/A'} epochs
              </span>
            </div>
            <button
              onClick={() => onRemove(file.id)}
              className="remove-button"
              aria-label={`Remove ${file.fileName}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;

import React, { useRef, useState } from 'react';
import { TrainerState } from '../types';
import Toast from './Toast';
import { sanitizeTrainerState } from '../utils/dataUtils';

interface FileUploadProps {
  onFileLoad: (data: TrainerState, fileName: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileLoad }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content) as TrainerState;
          
          if (!data.log_history || !Array.isArray(data.log_history)) {
            throw new Error('Invalid trainer_state.json format: missing log_history');
          }
          
          // Sanitize data to handle NaN and invalid values
          const sanitizedData = sanitizeTrainerState(data);
          onFileLoad(sanitizedData, file.name);
        } catch (error) {
          setError(`Error parsing ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      };
      reader.readAsText(file);
    });
    
    // Reset the input so the same file can be uploaded again
    event.target.value = '';
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const data = JSON.parse(content) as TrainerState;
            
            if (!data.log_history || !Array.isArray(data.log_history)) {
              throw new Error('Invalid trainer_state.json format: missing log_history');
            }
            
            // Sanitize data to handle NaN and invalid values
            const sanitizedData = sanitizeTrainerState(data);
            onFileLoad(sanitizedData, file.name);
          } catch (error) {
            setError(`Error parsing ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        };
        reader.readAsText(file);
      } else {
        setError(`${file.name} is not a JSON file`);
      }
    });
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div
      className="file-upload-container"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
      <div className="file-upload-box">
        <div className="upload-icon">📁</div>
        <h2>Upload trainer_state.json</h2>
        <p>Drag and drop your files here or click to browse</p>
        <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.5rem' }}>
          You can upload multiple files for comparison
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          multiple
        />
        <button
          className="upload-button"
          onClick={() => fileInputRef.current?.click()}
        >
          Select Files
        </button>
      </div>
    </div>
  );
};

export default FileUpload;

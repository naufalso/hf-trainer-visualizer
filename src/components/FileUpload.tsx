import React, { useRef } from 'react';
import { TrainerState } from '../types';

interface FileUploadProps {
  onFileLoad: (data: TrainerState) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileLoad }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as TrainerState;
        
        if (!data.log_history || !Array.isArray(data.log_history)) {
          throw new Error('Invalid trainer_state.json format: missing log_history');
        }
        
        onFileLoad(data);
      } catch (error) {
        alert(`Error parsing JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content) as TrainerState;
          
          if (!data.log_history || !Array.isArray(data.log_history)) {
            throw new Error('Invalid trainer_state.json format: missing log_history');
          }
          
          onFileLoad(data);
        } catch (error) {
          alert(`Error parsing JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a JSON file');
    }
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
      <div className="file-upload-box">
        <div className="upload-icon">📁</div>
        <h2>Upload trainer_state.json</h2>
        <p>Drag and drop your file here or click to browse</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button
          className="upload-button"
          onClick={() => fileInputRef.current?.click()}
        >
          Select File
        </button>
      </div>
    </div>
  );
};

export default FileUpload;

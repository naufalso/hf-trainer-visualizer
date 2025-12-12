import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FileList from './FileList';
import { TrainerStateWithMetadata } from '../types';

const mockFiles: TrainerStateWithMetadata[] = [
  {
    id: '1',
    fileName: 'test1.json',
    color: '#6366f1',
    data: {
      log_history: [
        { step: 1, loss: 0.5, epoch: 0.1 },
        { step: 2, loss: 0.4, epoch: 0.2 },
      ],
      epoch: 0.2,
      global_step: 2,
      num_train_epochs: 1,
    },
  },
  {
    id: '2',
    fileName: 'test2.json',
    color: '#ec4899',
    data: {
      log_history: [
        { step: 1, loss: 0.6, epoch: 0.1 },
        { step: 2, loss: 0.5, epoch: 0.2 },
      ],
      epoch: 0.2,
      global_step: 2,
      num_train_epochs: 1,
    },
  },
];

describe('FileList', () => {
  test('renders loaded files count', () => {
    const onRemove = jest.fn();
    const onAddMore = jest.fn();
    
    render(<FileList files={mockFiles} onRemove={onRemove} onAddMore={onAddMore} />);
    
    expect(screen.getByText(/Loaded Files \(2\)/i)).toBeInTheDocument();
  });

  test('renders file names and details', () => {
    const onRemove = jest.fn();
    const onAddMore = jest.fn();
    
    render(<FileList files={mockFiles} onRemove={onRemove} onAddMore={onAddMore} />);
    
    expect(screen.getByText('test1.json')).toBeInTheDocument();
    expect(screen.getByText('test2.json')).toBeInTheDocument();
    const fileDetails = screen.getAllByText(/2 steps • 0.2 epochs/i);
    expect(fileDetails).toHaveLength(2);
  });

  test('calls onRemove when remove button is clicked', () => {
    const onRemove = jest.fn();
    const onAddMore = jest.fn();
    
    render(<FileList files={mockFiles} onRemove={onRemove} onAddMore={onAddMore} />);
    
    const removeButtons = screen.getAllByRole('button', { name: /Remove/i });
    fireEvent.click(removeButtons[0]);
    
    expect(onRemove).toHaveBeenCalledWith('1');
  });

  test('calls onAddMore when add more files button is clicked', () => {
    const onRemove = jest.fn();
    const onAddMore = jest.fn();
    
    render(<FileList files={mockFiles} onRemove={onRemove} onAddMore={onAddMore} />);
    
    const addMoreButton = screen.getByRole('button', { name: /Add More Files/i });
    fireEvent.click(addMoreButton);
    
    expect(onAddMore).toHaveBeenCalled();
  });
});

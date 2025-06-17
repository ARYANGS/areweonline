import React from 'react';
import { Note } from '../types';

interface StatusBarProps {
  currentNote: Note | null;
  noteCount: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ currentNote, noteCount }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="bg-gray-900 border-t border-gray-800 px-4 py-1 flex justify-between items-center text-xs font-mono text-gray-500">
      <div className="flex items-center space-x-4">
        <span>notes: {noteCount}</span>
        {currentNote && (
          <>
            <span>•</span>
            <span>current: {currentNote.name}</span>
            <span>•</span>
            <span>modified: {formatDate(currentNote.updatedAt)}</span>
          </>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <span>terminal-notepad v1.0</span>
      </div>
    </div>
  );
};
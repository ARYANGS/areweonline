import React, { useRef, useEffect, useState } from 'react';
import { Note } from '../types';

interface TerminalProps {
  note: Note | null;
  onContentChange: (content: string) => void;
  onFocus: () => void;
  isFocused: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({
  note,
  onContentChange,
  onFocus,
  isFocused
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  useEffect(() => {
    if (textareaRef.current && isFocused) {
      textareaRef.current.focus();
    }
  }, [isFocused, note]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  const handleKeyDown = (e: React.KeyEvent<HTMLTextAreaElement>) => {
    // Handle Tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const value = e.currentTarget.value;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onContentChange(newValue);
      
      // Move cursor after the inserted spaces
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(start + 2, start + 2);
        }
      }, 0);
    }
  };

  const handleSelection = () => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };

  return (
    <div className="flex-1 relative overflow-hidden">
      <div className="absolute top-4 left-4 text-green-400 text-sm font-mono opacity-70">
        {note ? `editing: ${note.name}` : 'no note selected'}
      </div>
      
      <textarea
        ref={textareaRef}
        value={note?.content || ''}
        onChange={handleContentChange}
        onKeyDown={handleKeyDown}
        onSelect={handleSelection}
        onFocus={onFocus}
        className="w-full h-full bg-black text-gray-300 font-mono text-sm leading-relaxed resize-none outline-none p-4 pt-12 placeholder-gray-600"
        placeholder={note ? "Start typing your note..." : "Create a new note with :new [name] or open an existing one with :open <name>"}
        spellCheck={false}
        style={{
          fontFamily: "'IBM Plex Mono', 'Consolas', 'Monaco', 'Courier New', monospace",
          fontSize: '14px',
          lineHeight: '1.5',
          letterSpacing: '0.5px'
        }}
      />
      
      {/* Cursor effect when focused */}
      {isFocused && (
        <div 
          className="absolute w-2 h-5 bg-green-400 opacity-75 animate-pulse pointer-events-none"
          style={{
            top: `${Math.floor(cursorPosition / 80) * 21 + 48}px`,
            left: `${(cursorPosition % 80) * 8.4 + 16}px`
          }}
        />
      )}
    </div>
  );
};
import React, { useState, useRef, useEffect } from 'react';
import { Command, CommandResult } from '../types';
import { parseCommand } from '../utils/commands';

interface CommandLineProps {
  onCommand: (command: Command) => CommandResult;
  isFocused: boolean;
  onFocus: () => void;
}

export const CommandLine: React.FC<CommandLineProps> = ({
  onCommand,
  isFocused,
  onFocus
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [output, setOutput] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const command = parseCommand(input);
    if (!command) {
      setOutput(prev => [...prev, `> ${input}`, 'Invalid command. Type :help for available commands.']);
      setInput('');
      return;
    }

    const result = onCommand(command);
    setOutput(prev => [...prev, `> ${input}`, result.message]);
    
    // Add to history
    setHistory(prev => [...prev, input]);
    setHistoryIndex(-1);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  const clearOutput = () => {
    setOutput([]);
  };

  // Expose clearOutput to parent via ref
  useEffect(() => {
    (window as any).clearTerminalOutput = clearOutput;
  }, []);

  return (
    <div className="border-t border-gray-800 bg-black">
      {/* Command output */}
      {output.length > 0 && (
        <div className="max-h-32 overflow-y-auto p-2 text-xs font-mono text-gray-400 border-b border-gray-800">
          {output.map((line, index) => (
            <div key={index} className={line.startsWith('>') ? 'text-green-400' : 'text-gray-300'}>
              {line}
            </div>
          ))}
        </div>
      )}
      
      {/* Command input */}
      <form onSubmit={handleSubmit} className="flex items-center p-2">
        <span className="text-green-400 font-mono text-sm mr-2">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          className="flex-1 bg-transparent text-gray-300 font-mono text-sm outline-none placeholder-gray-600"
          placeholder="Enter command (try :help)"
          style={{
            fontFamily: "'IBM Plex Mono', 'Consolas', 'Monaco', 'Courier New', monospace"
          }}
        />
      </form>
    </div>
  );
};
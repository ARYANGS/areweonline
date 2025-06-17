import React, { useState, useEffect } from 'react';
import { Terminal } from './components/Terminal';
import { CommandLine } from './components/CommandLine';
import { StatusBar } from './components/StatusBar';
import { useNotes } from './hooks/useNotes';
import { executeCommand, parseCommand } from './utils/commands';
import { Command, CommandResult } from './types';

function App() {
  const { notes, currentNote, setNotes, setCurrentNote, updateCurrentNote } = useNotes();
  const [focusedComponent, setFocusedComponent] = useState<'terminal' | 'command'>('terminal');

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus command line
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setFocusedComponent('command');
      }
      // Escape to focus terminal
      else if (e.key === 'Escape') {
        e.preventDefault();
        setFocusedComponent('terminal');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCommand = (command: Command): CommandResult => {
    const clearTerminal = () => {
      if ((window as any).clearTerminalOutput) {
        (window as any).clearTerminalOutput();
      }
    };

    return executeCommand(
      command,
      notes,
      currentNote,
      setNotes,
      setCurrentNote,
      clearTerminal
    );
  };

  const handleContentChange = (content: string) => {
    updateCurrentNote(content);
  };

  return (
    <div className="h-screen bg-black text-gray-300 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-4 text-sm font-mono text-gray-400">terminal-notepad</span>
        </div>
        <div className="text-xs font-mono text-gray-500">
          Ctrl+K: command | Esc: editor
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Terminal
          note={currentNote}
          onContentChange={handleContentChange}
          onFocus={() => setFocusedComponent('terminal')}
          isFocused={focusedComponent === 'terminal'}
        />
        
        <CommandLine
          onCommand={handleCommand}
          isFocused={focusedComponent === 'command'}
          onFocus={() => setFocusedComponent('command')}
        />
      </div>

      {/* Status bar */}
      <StatusBar currentNote={currentNote} noteCount={notes.length} />
    </div>
  );
}

export default App;
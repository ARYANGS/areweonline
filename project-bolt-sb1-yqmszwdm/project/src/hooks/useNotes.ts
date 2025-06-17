import { useState, useEffect } from 'react';
import { Note } from '../types';
import { loadNotesFromStorage, saveNotesToStorage, generateId } from '../utils/storage';

export const useNotes = () => {
  const [notes, setNotesState] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  useEffect(() => {
    const loadedNotes = loadNotesFromStorage();
    setNotesState(loadedNotes);
    
    if (loadedNotes.length === 0) {
      // Create a welcome note for first-time users
      const welcomeNote: Note = {
        id: generateId(),
        name: 'welcome',
        content: `Welcome to Terminal Notepad

This is a minimalist notepad inspired by old computer terminals.

Basic commands:
:save [name] - Save your note
:open <name> - Open a saved note
:list - Show all notes
:new [name] - Create new note
:delete <name> - Delete a note
:help - Show all commands
:clear - Clear terminal

You can use basic markdown:
**bold text**
*italic text*
\`code text\`

Start typing to begin your note...`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setCurrentNote(welcomeNote);
    }
  }, []);

  const setNotes = (newNotes: Note[]) => {
    setNotesState(newNotes);
    saveNotesToStorage(newNotes);
  };

  const updateCurrentNote = (content: string) => {
    if (!currentNote) return;
    
    const updatedNote = {
      ...currentNote,
      content,
      updatedAt: new Date()
    };
    setCurrentNote(updatedNote);
  };

  return {
    notes,
    currentNote,
    setNotes,
    setCurrentNote,
    updateCurrentNote
  };
};
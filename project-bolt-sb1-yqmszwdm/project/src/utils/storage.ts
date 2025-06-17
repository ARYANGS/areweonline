import { Note } from '../types';

const STORAGE_KEY = 'terminal-notepad-notes';

export const saveNotesToStorage = (notes: Note[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Failed to save notes to storage:', error);
  }
};

export const loadNotesFromStorage = (): Note[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((note: any) => ({
      ...note,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt)
    }));
  } catch (error) {
    console.error('Failed to load notes from storage:', error);
    return [];
  }
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
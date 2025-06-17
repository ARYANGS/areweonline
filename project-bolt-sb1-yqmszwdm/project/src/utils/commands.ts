import { Command, CommandResult, Note } from '../types';

export const parseCommand = (input: string): Command | null => {
  const trimmed = input.trim();
  if (!trimmed.startsWith(':')) return null;
  
  const parts = trimmed.slice(1).split(' ');
  const type = parts[0].toLowerCase();
  const args = parts.slice(1);
  
  const validCommands = ['save', 'open', 'delete', 'list', 'new', 'help', 'clear'];
  if (!validCommands.includes(type)) return null;
  
  return {
    type: type as Command['type'],
    args: args.length > 0 ? args : undefined
  };
};

export const executeCommand = (
  command: Command,
  notes: Note[],
  currentNote: Note | null,
  setNotes: (notes: Note[]) => void,
  setCurrentNote: (note: Note | null) => void,
  clearTerminal: () => void
): CommandResult => {
  switch (command.type) {
    case 'help':
      return {
        success: true,
        message: `Available commands:
:save [name] - Save current note with optional name
:open <name> - Open an existing note
:delete <name> - Delete a note
:list - List all saved notes
:new [name] - Create a new note
:clear - Clear the terminal
:help - Show this help message`
      };
    
    case 'save':
      if (!currentNote) {
        return { success: false, message: 'No note to save' };
      }
      
      const saveName = command.args?.join(' ') || currentNote.name || 'untitled';
      const existingIndex = notes.findIndex(n => n.name === saveName);
      const updatedNote = {
        ...currentNote,
        name: saveName,
        updatedAt: new Date()
      };
      
      let newNotes;
      if (existingIndex >= 0) {
        newNotes = [...notes];
        newNotes[existingIndex] = updatedNote;
      } else {
        newNotes = [...notes, updatedNote];
      }
      
      setNotes(newNotes);
      setCurrentNote(updatedNote);
      return { success: true, message: `Note "${saveName}" saved successfully` };
    
    case 'open':
      if (!command.args?.length) {
        return { success: false, message: 'Usage: :open <note_name>' };
      }
      
      const noteName = command.args.join(' ');
      const noteToOpen = notes.find(n => n.name === noteName);
      
      if (!noteToOpen) {
        return { success: false, message: `Note "${noteName}" not found` };
      }
      
      setCurrentNote(noteToOpen);
      return { success: true, message: `Opened note "${noteName}"` };
    
    case 'delete':
      if (!command.args?.length) {
        return { success: false, message: 'Usage: :delete <note_name>' };
      }
      
      const deleteNoteName = command.args.join(' ');
      const deleteIndex = notes.findIndex(n => n.name === deleteNoteName);
      
      if (deleteIndex === -1) {
        return { success: false, message: `Note "${deleteNoteName}" not found` };
      }
      
      const filteredNotes = notes.filter((_, i) => i !== deleteIndex);
      setNotes(filteredNotes);
      
      if (currentNote?.name === deleteNoteName) {
        setCurrentNote(null);
      }
      
      return { success: true, message: `Note "${deleteNoteName}" deleted` };
    
    case 'list':
      if (notes.length === 0) {
        return { success: true, message: 'No saved notes' };
      }
      
      const notesList = notes
        .map(note => `${note.name} (${note.updatedAt.toLocaleDateString()})`)
        .join('\n');
      
      return { success: true, message: `Saved notes:\n${notesList}` };
    
    case 'new':
      const newNoteName = command.args?.join(' ') || 'untitled';
      const newNote: Note = {
        id: Math.random().toString(36).substr(2, 9),
        name: newNoteName,
        content: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setCurrentNote(newNote);
      return { success: true, message: `Created new note "${newNoteName}"` };
    
    case 'clear':
      clearTerminal();
      return { success: true, message: 'Terminal cleared' };
    
    default:
      return { success: false, message: 'Unknown command' };
  }
};
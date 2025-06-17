export interface Note {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Command {
  type: 'save' | 'open' | 'delete' | 'list' | 'new' | 'help' | 'clear';
  args?: string[];
}

export interface CommandResult {
  success: boolean;
  message: string;
  data?: any;
}
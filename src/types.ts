import { LucideIcon } from 'lucide-react';

export type Screen = 'splash' | 'login' | 'dashboard' | 'folders' | 'shared' | 'settings' | 'search' | 'create' | 'trash' | 'reminders';

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'Personal' | 'Work' | 'Ideas';
  isPinned?: boolean;
  color?: string;
}

export interface Folder {
  id: string;
  name: string;
  count: number;
  icon: string;
  color: string;
}

export interface SharedNote extends Note {
  updatedAt: string;
  collaborators: string[];
  permission: 'View Only' | 'Can Edit';
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
  linkedNote: string;
  isCompleted: boolean;
  isUpcoming: boolean;
}

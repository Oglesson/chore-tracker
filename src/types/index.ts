export interface ChoreDefinition {
  id: string;
  label: string;
  points: number;
}

export interface ChoreEntry {
  id: string;
  choreId: string;
  completedAt: string; // YYYY-MM-DD
  points: number;
}

export interface Child {
  id: string;
  name: string;
  totalPoints: number;
  entries: ChoreEntry[];
}

export interface AppState {
  children: Child[];
}

export type AppAction =
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'ADD_CHILD'; payload: { name: string } }
  | { type: 'REMOVE_CHILD'; payload: { childId: string } }
  | { type: 'LOG_CHORE'; payload: { childId: string; chore: ChoreDefinition; date: string } }
  | { type: 'REMOVE_ENTRY'; payload: { childId: string; entryId: string } };

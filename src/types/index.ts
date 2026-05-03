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
  verified: boolean;
}

export interface Child {
  id: string;
  name: string;
  totalPoints: number;
  rewardTarget: number;
  assignedChores: ChoreDefinition[];
  entries: ChoreEntry[];
}

export interface AppState {
  children: Child[];
  parentPin?: string;
}

export type AppAction =
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'ADD_CHILD'; payload: { name: string; rewardTarget: number } }
  | { type: 'REMOVE_CHILD'; payload: { childId: string } }
  | { type: 'LOG_CHORE'; payload: { childId: string; chore: ChoreDefinition; date: string; verified: boolean } }
  | { type: 'REMOVE_ENTRY'; payload: { childId: string; entryId: string } }
  | { type: 'VERIFY_ENTRY'; payload: { childId: string; entryId: string; points: number } }
  | { type: 'SET_REWARD_TARGET'; payload: { childId: string; rewardTarget: number } }
  | { type: 'ADD_CHORE'; payload: { childId: string; label: string; points: number } }
  | { type: 'EDIT_CHORE'; payload: { childId: string; chore: ChoreDefinition } }
  | { type: 'REMOVE_CHORE'; payload: { childId: string; choreId: string } }
  | { type: 'SET_PARENT_PIN'; payload: { pin: string } };

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
  entries: ChoreEntry[];
}

export interface AppState {
  children: Child[];
}

export type AppAction =
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'ADD_CHILD'; payload: { name: string; rewardTarget: number } }
  | { type: 'REMOVE_CHILD'; payload: { childId: string } }
  | { type: 'LOG_CHORE'; payload: { childId: string; chore: ChoreDefinition; date: string; verified: boolean } }
  | { type: 'REMOVE_ENTRY'; payload: { childId: string; entryId: string } }
  | { type: 'VERIFY_ENTRY'; payload: { childId: string; entryId: string } }
  | { type: 'SET_REWARD_TARGET'; payload: { childId: string; rewardTarget: number } };

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppState, AppAction, Child } from '../types';
import { loadState, saveState } from '../storage/storage';

const initialState: AppState = { children: [] };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return {
        ...action.payload,
        children: action.payload.children.map((c) => ({
          ...c,
          rewardTarget: c.rewardTarget ?? 100,
          entries: c.entries.map((e) => ({
            ...e,
            verified: e.verified ?? true,
          })),
        })),
      };

    case 'ADD_CHILD': {
      const newChild: Child = {
        id: uuidv4(),
        name: action.payload.name.trim(),
        totalPoints: 0,
        rewardTarget: action.payload.rewardTarget,
        entries: [],
      };
      return { ...state, children: [...state.children, newChild] };
    }

    case 'REMOVE_CHILD':
      return {
        ...state,
        children: state.children.filter((c) => c.id !== action.payload.childId),
      };

    case 'LOG_CHORE': {
      const { childId, chore, date, verified } = action.payload;
      return {
        ...state,
        children: state.children.map((child) => {
          if (child.id !== childId) return child;
          const entry: import('../types').ChoreEntry = {
            id: uuidv4(),
            choreId: chore.id,
            completedAt: date,
            points: chore.points,
            verified,
          };
          return {
            ...child,
            totalPoints: verified ? child.totalPoints + chore.points : child.totalPoints,
            entries: [...child.entries, entry],
          };
        }),
      };
    }

    case 'REMOVE_ENTRY': {
      const { childId, entryId } = action.payload;
      return {
        ...state,
        children: state.children.map((child) => {
          if (child.id !== childId) return child;
          const removed = child.entries.find((e) => e.id === entryId);
          const pointsLost = removed?.verified ? removed.points : 0;
          return {
            ...child,
            totalPoints: Math.max(0, child.totalPoints - pointsLost),
            entries: child.entries.filter((e) => e.id !== entryId),
          };
        }),
      };
    }

    case 'VERIFY_ENTRY': {
      const { childId, entryId } = action.payload;
      return {
        ...state,
        children: state.children.map((child) => {
          if (child.id !== childId) return child;
          const entry = child.entries.find((e) => e.id === entryId);
          if (!entry || entry.verified) return child;
          return {
            ...child,
            totalPoints: child.totalPoints + entry.points,
            entries: child.entries.map((e) =>
              e.id === entryId ? { ...e, verified: true } : e
            ),
          };
        }),
      };
    }

    case 'SET_REWARD_TARGET': {
      const { childId, rewardTarget } = action.payload;
      return {
        ...state,
        children: state.children.map((child) =>
          child.id === childId ? { ...child, rewardTarget } : child
        ),
      };
    }

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  ready: boolean;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadState().then((saved) => {
      if (saved) dispatch({ type: 'LOAD_STATE', payload: saved });
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) saveState(state);
  }, [state, ready]);

  return (
    <AppContext.Provider value={{ state, dispatch, ready }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

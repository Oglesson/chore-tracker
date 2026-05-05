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
import { CHORE_CATALOGUE } from '../constants/chores';

const initialState: AppState = {
  children: [],
  choreCatalogue: [...CHORE_CATALOGUE],
  parentPin: '',
};

function appReducerCore(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_STATE': {
      const catalogue =
        action.payload.choreCatalogue && action.payload.choreCatalogue.length > 0
          ? action.payload.choreCatalogue
          : CHORE_CATALOGUE;

      return {
        ...action.payload,
        choreCatalogue: catalogue,
        parentPin: action.payload.parentPin ?? '',
        children: action.payload.children.map((c) => {
          // Migrate old assignedChores array → assignedChoreIds
          const legacy = (c as any).assignedChores as Array<{ id: string }> | undefined;
          const assignedChoreIds: string[] =
            c.assignedChoreIds ??
            (legacy ? legacy.map((ch) => ch.id) : catalogue.map((ch) => ch.id));

          return {
            ...c,
            rewardTarget: c.rewardTarget ?? 100,
            assignedChoreIds,
            entries: c.entries.map((e) => ({
              ...e,
              verified: e.verified ?? true,
            })),
          };
        }),
      };
    }

    case 'ADD_CHILD': {
      const newChild: Child = {
        id: uuidv4(),
        name: action.payload.name.trim(),
        totalPoints: 0,
        rewardTarget: action.payload.rewardTarget,
        assignedChoreIds: state.choreCatalogue.map((c) => c.id),
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
          const entry = {
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
      const { childId, entryId, points } = action.payload;
      return {
        ...state,
        children: state.children.map((child) => {
          if (child.id !== childId) return child;
          const entry = child.entries.find((e) => e.id === entryId);
          if (!entry || entry.verified) return child;
          return {
            ...child,
            totalPoints: child.totalPoints + points,
            entries: child.entries.map((e) =>
              e.id === entryId ? { ...e, verified: true, points } : e
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

    case 'ADD_CATALOGUE_CHORE': {
      const { label, points } = action.payload;
      const newChore = { id: uuidv4(), label: label.trim(), points };
      return {
        ...state,
        choreCatalogue: [...state.choreCatalogue, newChore],
      };
    }

    case 'EDIT_CATALOGUE_CHORE': {
      const { chore } = action.payload;
      return {
        ...state,
        choreCatalogue: state.choreCatalogue.map((c) =>
          c.id === chore.id ? chore : c
        ),
      };
    }

    case 'REMOVE_CATALOGUE_CHORE': {
      const { choreId } = action.payload;
      return {
        ...state,
        choreCatalogue: state.choreCatalogue.filter((c) => c.id !== choreId),
        children: state.children.map((child) => ({
          ...child,
          assignedChoreIds: child.assignedChoreIds.filter((id) => id !== choreId),
        })),
      };
    }

    case 'ASSIGN_CHORE': {
      const { childId, choreId } = action.payload;
      return {
        ...state,
        children: state.children.map((child) =>
          child.id === childId && !child.assignedChoreIds.includes(choreId)
            ? { ...child, assignedChoreIds: [...child.assignedChoreIds, choreId] }
            : child
        ),
      };
    }

    case 'UNASSIGN_CHORE': {
      const { childId, choreId } = action.payload;
      return {
        ...state,
        children: state.children.map((child) =>
          child.id === childId
            ? { ...child, assignedChoreIds: child.assignedChoreIds.filter((id) => id !== choreId) }
            : child
        ),
      };
    }

    case 'SET_PARENT_PIN':
      return { ...state, parentPin: action.payload.pin };

    case 'EDIT_CHILD': {
      const { childId, name, rewardTarget } = action.payload;
      return {
        ...state,
        children: state.children.map((child) =>
          child.id === childId ? { ...child, name: name.trim(), rewardTarget } : child
        ),
      };
    }

    default:
      return state;
  }
}

export function appReducer(state: AppState, action: AppAction): AppState {
  const next = appReducerCore(state, action);
  if (action.type === 'LOAD_STATE') return next;
  return { ...next, lastModifiedAt: Date.now() };
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

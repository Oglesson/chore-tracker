import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { useAppContext } from './AppContext';
import { AppState } from '../types';

const FAMILY_KEY = '@chore_tracker_family';
const WRITE_DEBOUNCE_MS = 2000;

function generateFamilyCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

interface FirestoreDoc {
  state: AppState;
  lastModifiedAt: number;
}

interface SyncContextValue {
  familyCode: string | null;
  isOnline: boolean;
  syncReady: boolean;
  createFamily: () => Promise<void>;
  joinFamily: (code: string) => Promise<{ success: boolean; error?: string }>;
  leaveFamily: () => Promise<void>;
}

const SyncContext = createContext<SyncContextValue | undefined>(undefined);

export function SyncProvider({ children }: { children: ReactNode }) {
  const { state, dispatch } = useAppContext();
  const [familyCode, setFamilyCode] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [syncReady, setSyncReady] = useState(false);

  // Timestamp of the last state we pushed to or pulled from Firestore
  const lastSyncedAt = useRef<number>(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load family code from storage on mount
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setSyncReady(true);
      return;
    }
    AsyncStorage.getItem(FAMILY_KEY).then((code) => {
      setFamilyCode(code);
      setSyncReady(true);
    });
  }, []);

  // Track network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((netState) => {
      setIsOnline(netState.isConnected ?? true);
    });
    return unsubscribe;
  }, []);

  // Real-time Firestore listener — re-subscribes whenever familyCode changes
  useEffect(() => {
    if (!isFirebaseConfigured || !familyCode) return;

    const docRef = doc(db, 'families', familyCode);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (!snapshot.exists()) return;
        const remote = snapshot.data() as FirestoreDoc;
        if (remote.lastModifiedAt > lastSyncedAt.current) {
          lastSyncedAt.current = remote.lastModifiedAt;
          dispatch({
            type: 'LOAD_STATE',
            payload: { ...remote.state, lastModifiedAt: remote.lastModifiedAt },
          });
        }
      },
      (error) => console.warn('[Sync] Firestore listener error:', error),
    );

    return unsubscribe;
  }, [familyCode, dispatch]);

  // Debounced write to Firestore whenever local state changes
  useEffect(() => {
    if (!isFirebaseConfigured || !familyCode || !isOnline) return;
    const localTs = state.lastModifiedAt ?? 0;
    if (localTs === 0 || localTs <= lastSyncedAt.current) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      try {
        const docRef = doc(db, 'families', familyCode);
        await setDoc(docRef, {
          state,
          lastModifiedAt: localTs,
          updatedAt: new Date().toISOString(),
        });
        lastSyncedAt.current = localTs;
      } catch (err) {
        console.warn('[Sync] Firestore write error:', err);
      }
    }, WRITE_DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [state, familyCode, isOnline]);

  async function createFamily(): Promise<void> {
    const code = generateFamilyCode();
    const now = Date.now();
    const newState: AppState = { ...state, lastModifiedAt: now };
    const docRef = doc(db, 'families', code);
    await setDoc(docRef, {
      state: newState,
      lastModifiedAt: now,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await AsyncStorage.setItem(FAMILY_KEY, code);
    lastSyncedAt.current = now;
    dispatch({ type: 'LOAD_STATE', payload: newState });
    setFamilyCode(code);
  }

  async function joinFamily(code: string): Promise<{ success: boolean; error?: string }> {
    try {
      const upperCode = code.trim().toUpperCase();
      if (upperCode.length !== 6) {
        return { success: false, error: 'Family code must be 6 characters.' };
      }
      const docRef = doc(db, 'families', upperCode);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) {
        return { success: false, error: 'Family code not found. Check the code and try again.' };
      }
      const remote = snapshot.data() as FirestoreDoc;
      lastSyncedAt.current = remote.lastModifiedAt;
      dispatch({
        type: 'LOAD_STATE',
        payload: { ...remote.state, lastModifiedAt: remote.lastModifiedAt },
      });
      await AsyncStorage.setItem(FAMILY_KEY, upperCode);
      setFamilyCode(upperCode);
      return { success: true };
    } catch {
      return { success: false, error: 'Could not connect to sync service. Check your internet connection.' };
    }
  }

  async function leaveFamily(): Promise<void> {
    await AsyncStorage.removeItem(FAMILY_KEY);
    setFamilyCode(null);
  }

  return (
    <SyncContext.Provider value={{ familyCode, isOnline, syncReady, createFamily, joinFamily, leaveFamily }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSyncContext(): SyncContextValue {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error('useSyncContext must be used within SyncProvider');
  return ctx;
}

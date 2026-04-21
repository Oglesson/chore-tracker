import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from '../types';

const STATE_KEY = '@chore_tracker_state';

export async function loadState(): Promise<AppState | null> {
  try {
    const json = await AsyncStorage.getItem(STATE_KEY);
    return json ? (JSON.parse(json) as AppState) : null;
  } catch {
    return null;
  }
}

export async function saveState(state: AppState): Promise<void> {
  try {
    await AsyncStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    // storage errors are non-fatal
  }
}

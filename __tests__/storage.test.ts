import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadState, saveState } from '../src/storage/storage';
import { AppState } from '../src/types';

const mockStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

const sampleState: AppState = {
  children: [{ id: 'c1', name: 'Alice', totalPoints: 15, rewardTarget: 100, entries: [] }],
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('saveState', () => {
  it('serialises state to AsyncStorage', async () => {
    await saveState(sampleState);
    expect(mockStorage.setItem).toHaveBeenCalledWith(
      '@chore_tracker_state',
      JSON.stringify(sampleState)
    );
  });

  it('does not throw when AsyncStorage fails', async () => {
    mockStorage.setItem.mockRejectedValueOnce(new Error('disk full'));
    await expect(saveState(sampleState)).resolves.toBeUndefined();
  });
});

describe('loadState', () => {
  it('returns parsed state when key exists', async () => {
    mockStorage.getItem.mockResolvedValueOnce(JSON.stringify(sampleState));
    const result = await loadState();
    expect(result).toEqual(sampleState);
  });

  it('returns null when key does not exist', async () => {
    mockStorage.getItem.mockResolvedValueOnce(null);
    const result = await loadState();
    expect(result).toBeNull();
  });

  it('returns null when AsyncStorage throws', async () => {
    mockStorage.getItem.mockRejectedValueOnce(new Error('storage error'));
    const result = await loadState();
    expect(result).toBeNull();
  });
});

import { appReducer } from '../src/context/AppContext';
import { AppState } from '../src/types';
import { CHORE_CATALOGUE } from '../src/constants/chores';

const makeBed = CHORE_CATALOGUE.find((c) => c.id === 'make_bed')!;
const washDishes = CHORE_CATALOGUE.find((c) => c.id === 'wash_dishes')!;

const emptyState: AppState = { children: [] };

describe('appReducer', () => {
  describe('ADD_CHILD', () => {
    it('adds a child with zero points and empty entries', () => {
      const state = appReducer(emptyState, { type: 'ADD_CHILD', payload: { name: 'Alice' } });
      expect(state.children).toHaveLength(1);
      expect(state.children[0].name).toBe('Alice');
      expect(state.children[0].totalPoints).toBe(0);
      expect(state.children[0].entries).toHaveLength(0);
    });

    it('trims whitespace from name', () => {
      const state = appReducer(emptyState, { type: 'ADD_CHILD', payload: { name: '  Bob  ' } });
      expect(state.children[0].name).toBe('Bob');
    });

    it('adds multiple children independently', () => {
      let state = appReducer(emptyState, { type: 'ADD_CHILD', payload: { name: 'Alice' } });
      state = appReducer(state, { type: 'ADD_CHILD', payload: { name: 'Bob' } });
      expect(state.children).toHaveLength(2);
    });
  });

  describe('REMOVE_CHILD', () => {
    it('removes the correct child', () => {
      let state = appReducer(emptyState, { type: 'ADD_CHILD', payload: { name: 'Alice' } });
      state = appReducer(state, { type: 'ADD_CHILD', payload: { name: 'Bob' } });
      const aliceId = state.children[0].id;
      state = appReducer(state, { type: 'REMOVE_CHILD', payload: { childId: aliceId } });
      expect(state.children).toHaveLength(1);
      expect(state.children[0].name).toBe('Bob');
    });

    it('is a no-op for unknown childId', () => {
      let state = appReducer(emptyState, { type: 'ADD_CHILD', payload: { name: 'Alice' } });
      state = appReducer(state, { type: 'REMOVE_CHILD', payload: { childId: 'nonexistent' } });
      expect(state.children).toHaveLength(1);
    });
  });

  describe('LOG_CHORE', () => {
    it('adds an entry and increments totalPoints', () => {
      let state = appReducer(emptyState, { type: 'ADD_CHILD', payload: { name: 'Alice' } });
      const childId = state.children[0].id;
      state = appReducer(state, { type: 'LOG_CHORE', payload: { childId, chore: makeBed, date: '2026-04-21' } });
      expect(state.children[0].totalPoints).toBe(makeBed.points);
      expect(state.children[0].entries).toHaveLength(1);
      expect(state.children[0].entries[0].choreId).toBe('make_bed');
      expect(state.children[0].entries[0].completedAt).toBe('2026-04-21');
    });

    it('accumulates points from multiple chores', () => {
      let state = appReducer(emptyState, { type: 'ADD_CHILD', payload: { name: 'Alice' } });
      const childId = state.children[0].id;
      state = appReducer(state, { type: 'LOG_CHORE', payload: { childId, chore: makeBed, date: '2026-04-21' } });
      state = appReducer(state, { type: 'LOG_CHORE', payload: { childId, chore: washDishes, date: '2026-04-21' } });
      expect(state.children[0].totalPoints).toBe(makeBed.points + washDishes.points);
      expect(state.children[0].entries).toHaveLength(2);
    });

    it('only updates the targeted child', () => {
      let state = appReducer(emptyState, { type: 'ADD_CHILD', payload: { name: 'Alice' } });
      state = appReducer(state, { type: 'ADD_CHILD', payload: { name: 'Bob' } });
      const aliceId = state.children[0].id;
      state = appReducer(state, { type: 'LOG_CHORE', payload: { childId: aliceId, chore: makeBed, date: '2026-04-21' } });
      expect(state.children[1].totalPoints).toBe(0);
      expect(state.children[1].entries).toHaveLength(0);
    });

    it('is a no-op for unknown childId', () => {
      let state = appReducer(emptyState, { type: 'ADD_CHILD', payload: { name: 'Alice' } });
      state = appReducer(state, { type: 'LOG_CHORE', payload: { childId: 'ghost', chore: makeBed, date: '2026-04-21' } });
      expect(state.children[0].totalPoints).toBe(0);
    });
  });

  describe('REMOVE_ENTRY', () => {
    it('removes the entry and deducts points', () => {
      let state = appReducer(emptyState, { type: 'ADD_CHILD', payload: { name: 'Alice' } });
      const childId = state.children[0].id;
      state = appReducer(state, { type: 'LOG_CHORE', payload: { childId, chore: makeBed, date: '2026-04-21' } });
      const entryId = state.children[0].entries[0].id;
      state = appReducer(state, { type: 'REMOVE_ENTRY', payload: { childId, entryId } });
      expect(state.children[0].entries).toHaveLength(0);
      expect(state.children[0].totalPoints).toBe(0);
    });

    it('does not let totalPoints go below zero', () => {
      let state = appReducer(emptyState, { type: 'ADD_CHILD', payload: { name: 'Alice' } });
      const childId = state.children[0].id;
      state = appReducer(state, { type: 'LOG_CHORE', payload: { childId, chore: makeBed, date: '2026-04-21' } });
      const entryId = state.children[0].entries[0].id;
      // Manually corrupt totalPoints to 0 before removing
      state = {
        ...state,
        children: state.children.map((c) => (c.id === childId ? { ...c, totalPoints: 0 } : c)),
      };
      state = appReducer(state, { type: 'REMOVE_ENTRY', payload: { childId, entryId } });
      expect(state.children[0].totalPoints).toBe(0);
    });

    it('does not affect other children', () => {
      let state = appReducer(emptyState, { type: 'ADD_CHILD', payload: { name: 'Alice' } });
      state = appReducer(state, { type: 'ADD_CHILD', payload: { name: 'Bob' } });
      const aliceId = state.children[0].id;
      const bobId = state.children[1].id;
      state = appReducer(state, { type: 'LOG_CHORE', payload: { childId: aliceId, chore: makeBed, date: '2026-04-21' } });
      state = appReducer(state, { type: 'LOG_CHORE', payload: { childId: bobId, chore: washDishes, date: '2026-04-21' } });
      const aliceEntry = state.children[0].entries[0].id;
      state = appReducer(state, { type: 'REMOVE_ENTRY', payload: { childId: aliceId, entryId: aliceEntry } });
      expect(state.children[1].totalPoints).toBe(washDishes.points);
    });
  });

  describe('LOAD_STATE', () => {
    it('replaces state entirely', () => {
      let state = appReducer(emptyState, { type: 'ADD_CHILD', payload: { name: 'Alice' } });
      const loaded: AppState = { children: [{ id: 'x1', name: 'Charlie', totalPoints: 50, entries: [] }] };
      state = appReducer(state, { type: 'LOAD_STATE', payload: loaded });
      expect(state.children).toHaveLength(1);
      expect(state.children[0].name).toBe('Charlie');
    });
  });
});

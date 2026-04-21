import { CHORE_CATALOGUE } from '../src/constants/chores';

describe('CHORE_CATALOGUE', () => {
  it('has at least one chore', () => {
    expect(CHORE_CATALOGUE.length).toBeGreaterThan(0);
  });

  it('every chore has a non-empty id and label', () => {
    for (const chore of CHORE_CATALOGUE) {
      expect(chore.id.trim()).not.toBe('');
      expect(chore.label.trim()).not.toBe('');
    }
  });

  it('every chore has a positive points value', () => {
    for (const chore of CHORE_CATALOGUE) {
      expect(chore.points).toBeGreaterThan(0);
    }
  });

  it('all chore ids are unique', () => {
    const ids = CHORE_CATALOGUE.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

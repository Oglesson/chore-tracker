import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChildCard from '../src/components/ChildCard';
import { Child } from '../src/types';

const alice: Child = {
  id: 'c1',
  name: 'Alice',
  totalPoints: 35,
  rewardTarget: 100,
  assignedChores: [],
  entries: [],
};

const noop = () => {};

describe('ChildCard', () => {
  it('renders child name and total points', () => {
    const { getByText } = render(
      <ChildCard child={alice} isParentMode={true} onLogChores={noop} onViewHistory={noop} onManageChores={noop} onChildView={noop} />
    );
    expect(getByText('Alice')).toBeTruthy();
    expect(getByText('35 pts')).toBeTruthy();
  });

  it('calls onLogChores when Log Chores is pressed in parent mode', () => {
    const onLog = jest.fn();
    const { getByText } = render(
      <ChildCard child={alice} isParentMode={true} onLogChores={onLog} onViewHistory={noop} onManageChores={noop} onChildView={noop} />
    );
    fireEvent.press(getByText('Log Chores'));
    expect(onLog).toHaveBeenCalledTimes(1);
  });

  it('calls onViewHistory when History is pressed in parent mode', () => {
    const onHistory = jest.fn();
    const { getByText } = render(
      <ChildCard child={alice} isParentMode={true} onLogChores={noop} onViewHistory={onHistory} onManageChores={noop} onChildView={noop} />
    );
    fireEvent.press(getByText('History'));
    expect(onHistory).toHaveBeenCalledTimes(1);
  });

  it('shows only child view button when not in parent mode', () => {
    const { queryByText, getByText } = render(
      <ChildCard child={alice} isParentMode={false} onLogChores={noop} onViewHistory={noop} onManageChores={noop} onChildView={noop} />
    );
    expect(queryByText('Log Chores')).toBeNull();
    expect(queryByText('History')).toBeNull();
    expect(getByText("Alice's View")).toBeTruthy();
  });

  it('displays zero points correctly', () => {
    const child: Child = { ...alice, totalPoints: 0 };
    const { getByText } = render(
      <ChildCard child={child} isParentMode={true} onLogChores={noop} onViewHistory={noop} onManageChores={noop} onChildView={noop} />
    );
    expect(getByText('0 pts')).toBeTruthy();
  });

  it('shows pending badge when there are unverified entries', () => {
    const child: Child = {
      ...alice,
      entries: [{ id: 'e1', choreId: 'make_bed', completedAt: '2026-05-01', points: 5, verified: false }],
    };
    const { getByText } = render(
      <ChildCard child={child} isParentMode={true} onLogChores={noop} onViewHistory={noop} onManageChores={noop} onChildView={noop} />
    );
    expect(getByText('1 pending')).toBeTruthy();
  });
});

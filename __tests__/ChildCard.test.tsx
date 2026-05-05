import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChildCard from '../src/components/ChildCard';
import { Child } from '../src/types';

const alice: Child = {
  id: 'c1',
  name: 'Alice',
  totalPoints: 35,
  rewardTarget: 100,
  assignedChoreIds: [],
  entries: [],
};

const noop = () => {};

describe('ChildCard', () => {
  it('renders child name and total points', () => {
    const { getByText } = render(
      <ChildCard child={alice} onLogChores={noop} onViewHistory={noop} onManageChores={noop} onChildView={noop} onEdit={noop} />
    );
    expect(getByText('Alice')).toBeTruthy();
    expect(getByText('35 pts')).toBeTruthy();
  });

  it('calls onLogChores when Log Chores is pressed', () => {
    const onLog = jest.fn();
    const { getByText } = render(
      <ChildCard child={alice} onLogChores={onLog} onViewHistory={noop} onManageChores={noop} onChildView={noop} />
    );
    fireEvent.press(getByText('Log Chores'));
    expect(onLog).toHaveBeenCalledTimes(1);
  });

  it('calls onViewHistory when History is pressed', () => {
    const onHistory = jest.fn();
    const { getByText } = render(
      <ChildCard child={alice} onLogChores={noop} onViewHistory={onHistory} onManageChores={noop} onChildView={noop} />
    );
    fireEvent.press(getByText('History'));
    expect(onHistory).toHaveBeenCalledTimes(1);
  });

  it('calls onManageChores when Chores is pressed', () => {
    const onManage = jest.fn();
    const { getByText } = render(
      <ChildCard child={alice} onLogChores={noop} onViewHistory={noop} onManageChores={onManage} onChildView={noop} />
    );
    fireEvent.press(getByText('Chores'));
    expect(onManage).toHaveBeenCalledTimes(1);
  });

  it('displays zero points correctly', () => {
    const child: Child = { ...alice, totalPoints: 0 };
    const { getByText } = render(
      <ChildCard child={child} onLogChores={noop} onViewHistory={noop} onManageChores={noop} onChildView={noop} />
    );
    expect(getByText('0 pts')).toBeTruthy();
  });

  it('shows pending badge when there are unverified entries', () => {
    const child: Child = {
      ...alice,
      entries: [{ id: 'e1', choreId: 'make_bed', completedAt: '2026-05-01', points: 5, verified: false }],
    };
    const { getByText } = render(
      <ChildCard child={child} onLogChores={noop} onViewHistory={noop} onManageChores={noop} onChildView={noop} />
    );
    expect(getByText('1 pending')).toBeTruthy();
  });
});

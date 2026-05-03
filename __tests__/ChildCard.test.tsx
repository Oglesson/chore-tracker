import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChildCard from '../src/components/ChildCard';
import { Child } from '../src/types';

const alice: Child = {
  id: 'c1',
  name: 'Alice',
  totalPoints: 35,
  rewardTarget: 100,
  entries: [],
};

describe('ChildCard', () => {
  it('renders child name and total points', () => {
    const { getByText } = render(
      <ChildCard child={alice} onLogChores={jest.fn()} onViewHistory={jest.fn()} onChildView={jest.fn()} />
    );
    expect(getByText('Alice')).toBeTruthy();
    expect(getByText('35 pts')).toBeTruthy();
  });

  it('calls onLogChores when Log Chores is pressed', () => {
    const onLog = jest.fn();
    const { getByText } = render(
      <ChildCard child={alice} onLogChores={onLog} onViewHistory={jest.fn()} onChildView={jest.fn()} />
    );
    fireEvent.press(getByText('Log Chores'));
    expect(onLog).toHaveBeenCalledTimes(1);
  });

  it('calls onViewHistory when History is pressed', () => {
    const onHistory = jest.fn();
    const { getByText } = render(
      <ChildCard child={alice} onLogChores={jest.fn()} onViewHistory={onHistory} onChildView={jest.fn()} />
    );
    fireEvent.press(getByText('History'));
    expect(onHistory).toHaveBeenCalledTimes(1);
  });

  it('displays zero points correctly', () => {
    const child: Child = { ...alice, totalPoints: 0 };
    const { getByText } = render(
      <ChildCard child={child} onLogChores={jest.fn()} onViewHistory={jest.fn()} onChildView={jest.fn()} />
    );
    expect(getByText('0 pts')).toBeTruthy();
  });
});

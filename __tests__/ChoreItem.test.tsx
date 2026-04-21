import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChoreItem from '../src/components/ChoreItem';
import { ChoreDefinition } from '../src/types';

const makeBed: ChoreDefinition = { id: 'make_bed', label: 'Make Bed', points: 5 };

describe('ChoreItem', () => {
  it('renders label and points', () => {
    const { getByText } = render(
      <ChoreItem chore={makeBed} logged={false} onPress={jest.fn()} />
    );
    expect(getByText('Make Bed')).toBeTruthy();
    expect(getByText('+5 pts')).toBeTruthy();
  });

  it('calls onPress when not logged', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ChoreItem chore={makeBed} logged={false} onPress={onPress} />
    );
    fireEvent.press(getByText('Make Bed'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is disabled and shows check when logged', () => {
    const onPress = jest.fn();
    const { getByText, queryByText } = render(
      <ChoreItem chore={makeBed} logged={true} onPress={onPress} />
    );
    expect(getByText('✓')).toBeTruthy();
    // Pressing a disabled button should not fire
    fireEvent.press(getByText('Make Bed'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not show check mark when not logged', () => {
    const { queryByText } = render(
      <ChoreItem chore={makeBed} logged={false} onPress={jest.fn()} />
    );
    expect(queryByText('✓')).toBeNull();
  });
});

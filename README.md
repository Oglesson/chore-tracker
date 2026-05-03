# Chore Tracker

A React Native app built with Expo for tracking chores and points across multiple children.

## Features

- **Manage children** — add and remove child profiles
- **Log chores** — assign chores to children and award points
- **Track history** — view completed chores with dates and points earned
- **Persistent storage** — data is saved locally via AsyncStorage (initial implementation - this will need a central store forsharing with the family)

## Screens

| Screen          | Description                                     |
| --------------- | ----------------------------------------------- |
| Home            | Overview of all children and their total points |
| Chores          | Log a chore completion for a child              |
| History         | View a child's chore history and remove entries |
| Manage Children | Add or remove children                          |

## Getting Started

### Prerequisites

- Node.js
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator, Android Emulator, or the [Expo Go](https://expo.dev/go) app on a physical device

### Install

```bash
npm install
```

### Run

```bash
npm start          # start Expo dev server
npm run ios        # open in iOS simulator
npm run android    # open in Android emulator
npm run web        # open in browser
```

## Testing

```bash
npm test
```

Tests use Jest with `jest-expo` and `@testing-library/react-native`.

## Tech Stack

- [Expo](https://expo.dev) ~54
- React Native 0.81
- React Navigation (stack + bottom tabs)
- AsyncStorage for persistence
- TypeScript

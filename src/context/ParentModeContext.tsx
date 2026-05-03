import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAppContext } from './AppContext';

interface ParentModeContextValue {
  isParentMode: boolean;
  enterParentMode: (pin?: string) => boolean;
  exitParentMode: () => void;
}

const ParentModeContext = createContext<ParentModeContextValue | undefined>(undefined);

export function ParentModeProvider({ children }: { children: ReactNode }) {
  const { state } = useAppContext();
  const [isParentMode, setIsParentMode] = useState(false);

  function enterParentMode(pin?: string): boolean {
    const storedPin = state.parentPin ?? '';
    if (storedPin && pin !== storedPin) return false;
    setIsParentMode(true);
    return true;
  }

  function exitParentMode() {
    setIsParentMode(false);
  }

  return (
    <ParentModeContext.Provider value={{ isParentMode, enterParentMode, exitParentMode }}>
      {children}
    </ParentModeContext.Provider>
  );
}

export function useParentMode(): ParentModeContextValue {
  const ctx = useContext(ParentModeContext);
  if (!ctx) throw new Error('useParentMode must be used within ParentModeProvider');
  return ctx;
}

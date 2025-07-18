import { useContext } from 'react';
import { DosesContext } from './context';

// Custom hook to use the doses context
export function useDoses() {
  const context = useContext(DosesContext);
  if (context === undefined) {
    throw new Error('useDoses must be used within a DosesProvider');
  }
  return context;
}

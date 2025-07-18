import { createContext } from 'react';
import type { Dose } from './database';

export interface DosesContextType {
  doses: Dose[];
  addDose: (amount: number, timestamp?: Date) => Promise<void>;
  removeDose: (id: number) => Promise<void>;
  getDoses: () => Promise<Dose[]>;
  getDosesByDateRange: (startDate: Date, endDate: Date) => Promise<Dose[]>;
  isLoading: boolean;
  error: string | null;
}

// Create context
export const DosesContext = createContext<DosesContextType | undefined>(undefined);

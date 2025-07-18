import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { dosesDB, type Dose } from './database';
import { DosesContext, type DosesContextType } from './context';

// Provider component
interface DosesProviderProps {
  children: ReactNode;
}

export function DosesProvider({ children }: DosesProviderProps) {
  const [doses, setDoses] = useState<Dose[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize database and load doses
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await dosesDB.init();
        const allDoses = await dosesDB.getAllDoses();
        setDoses(allDoses);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize database');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  const addDose = async (amount: number, timestamp: Date = new Date()) => {
    try {
      setError(null);
      await dosesDB.addDose(amount, timestamp);
      
      // Refresh doses list
      const updatedDoses = await dosesDB.getAllDoses();
      setDoses(updatedDoses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add dose');
    }
  };

  const removeDose = async (id: number) => {
    try {
      setError(null);
      await dosesDB.removeDose(id);
      
      // Refresh doses list
      const updatedDoses = await dosesDB.getAllDoses();
      setDoses(updatedDoses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove dose');
    }
  };

  const getDoses = async (): Promise<Dose[]> => {
    try {
      setError(null);
      return await dosesDB.getAllDoses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve doses');
      return [];
    }
  };

  const getDosesByDateRange = async (startDate: Date, endDate: Date): Promise<Dose[]> => {
    try {
      setError(null);
      return await dosesDB.getDosesByDateRange(startDate, endDate);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve doses');
      return [];
    }
  };

  const contextValue: DosesContextType = {
    doses,
    addDose,
    removeDose,
    getDoses,
    getDosesByDateRange,
    isLoading,
    error,
  };

  return (
    <DosesContext.Provider value={contextValue}>
      {children}
    </DosesContext.Provider>
  );
}

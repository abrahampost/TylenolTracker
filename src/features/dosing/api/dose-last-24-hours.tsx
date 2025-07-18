import { useEffect, useState } from "react";
import { useDoses, type Dose } from "../store";

export function useDosesLast24Hours() {
  const { getDosesByDateRange, error: contextError } = useDoses();
  const [doses, setDoses] = useState<Dose[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLast24HoursDoses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Calculate date range for last 24 hours
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
        // Get doses from the last 24 hours
        const last24HoursDoses = await getDosesByDateRange(twentyFourHoursAgo, now);
        
        // Calculate total
        const totalAmount = last24HoursDoses.reduce((sum, dose) => sum + dose.amount, 0);
        
        setDoses(last24HoursDoses);
        setTotal(totalAmount);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch last 24 hours doses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLast24HoursDoses();
  }, [getDosesByDateRange]);

  // Use context error if no local error
  const finalError = error || contextError;

  return {
    doses,
    total,
    isLoading,
    error: finalError,
    refresh: async () => {
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      try {
        setError(null);
        const last24HoursDoses = await getDosesByDateRange(twentyFourHoursAgo, now);
        const totalAmount = last24HoursDoses.reduce((sum, dose) => sum + dose.amount, 0);
        setDoses(last24HoursDoses);
        setTotal(totalAmount);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to refresh last 24 hours doses');
      }
    }
  };
}
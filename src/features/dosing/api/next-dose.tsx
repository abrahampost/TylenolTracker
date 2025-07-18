import { useEffect, useState } from "react";
import { useDosesLast24Hours } from "./dose-last-24-hours"
import { doseSizes, SAFE_DOSE_LIMIT } from "../config/dose-sizes";

type PossibleDose = {
    amount: number; // Amount in mg
    when: string;
    timestamp: Date | null; // Next possible dose time
}

export const useNextDose = () => {
  const { doses, total } = useDosesLast24Hours();

  const [ nextPossibleDoses, setNextPossibleDoses ] = useState<PossibleDose[]>([]);

  useEffect(() => {
    const possibleDoses: PossibleDose[] = [];

    for (const size of doseSizes) {
        if (size + total <= SAFE_DOSE_LIMIT) {
            possibleDoses.push({
                amount: size,
                when: `Next possible dose of ${size} mg`,
                timestamp: null // Will be calculated later
            });
        } else {
            // If the dose exceeds the safe limit, can take later
            let runningTotal = total;
            for(let i = 0; i < doses.length; i++) {
                runningTotal -= doses[i].amount;
                if (runningTotal + size <= SAFE_DOSE_LIMIT) {
                    possibleDoses.push({
                        amount: size,
                        when: `Next possible dose of ${size} mg after ${doses[i].timestamp.toLocaleString()}`,
                        timestamp: new Date(doses[i].timestamp.getTime() + 24 * 60 * 60 * 1000) // Assuming 8 hours gap
                    });
                    break; // Found a valid time, no need to check further
                }
            }
        }
    }
    setNextPossibleDoses(possibleDoses);
  }, [ doses, total]);

  return { nextPossibleDoses };
}
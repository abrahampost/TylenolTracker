import { Stack } from "@mui/material";
import { useNextDose } from "../api/next-dose";

export const NextDose = () => {
  const { nextPossibleDoses } = useNextDose();
  return (
    <Stack spacing={2} sx={{ width: '50%' }}>
      <h2>Next Dose to stay under 24 hour limits</h2>
      <div>
        {nextPossibleDoses.length > 0 ? (
          <ul>
            {nextPossibleDoses.map((dose, index) => (
              <li key={index} style={{ lineHeight: '24.5px', padding: '6px 0'}}>
                {dose.amount} mg
                {dose.timestamp ? ` at ${new Date(dose.timestamp).toLocaleString()}` : " now"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No next doses available.</p>
        )}
      </div>
    </Stack>
  );
}
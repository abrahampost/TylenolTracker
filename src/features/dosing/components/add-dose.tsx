import { Button, Stack } from "@mui/material";
import { doseSizes } from "../config/dose-sizes";
import { useDoses } from "../store";
import { useState } from "react";

export const AddDose = () => {
    const { addDose } = useDoses();
    const [timestamp, setTimestamp] = useState(() => {
      const now = new Date();
      return new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    });

    const onAddDose = (size: number) => {
        // Convert local timestamp back to UTC before storing
        const utcTimestamp = new Date(timestamp.getTime() + timestamp.getTimezoneOffset() * 60000);
        addDose(size, utcTimestamp);
    };

    return (
    <Stack spacing={2}>
      <h2>Add Dose</h2>
      <label htmlFor="dose-timestamp">Dose taken at:</label>
      <input
        id="dose-timestamp"
        type="datetime-local"
        value={timestamp.toISOString().slice(0, 16)}
        onChange={(e) => setTimestamp(new Date(e.target.value))}
        style={{ marginLeft: '10px', marginBottom: '10px' }}
      />
      <div>
        {doseSizes.map((size) => (
          <Button
            key={size}
            variant="contained"
            onClick={() => onAddDose(size)}
            style={{ margin: '5px' }}
          >
            Add {size}mg Dose
          </Button>
        ))}
      </div>
    </Stack>
  );
}
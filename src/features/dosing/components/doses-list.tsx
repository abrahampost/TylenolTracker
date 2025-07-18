import { Button, Stack } from "@mui/material";
import { useDosesLast24Hours } from "../api/dose-last-24-hours";
import { useDoses } from "../store";

export const DosesList = () => {
    const { doses, total, error, isLoading, refresh } = useDosesLast24Hours();
    const { removeDose } = useDoses();

    const handleRemoveDose = (id: number) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        window.confirm("Are you sure you want to remove this dose?") && removeDose(id);
    };

    if (isLoading) {
        return <div>Loading doses from the last 24 hours...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    if (doses.length === 0) {
        return <div>No doses recorded in the last 24 hours.</div>;
    }

    return (
        <Stack spacing={2} sx={{ width: '50%' }}>
            <h2>Doses List</h2>
            <p>Total Doses in Last 24 Hours: {total} mg</p>
            <button onClick={refresh} style={{ marginBottom: '10px' }}>Refresh</button>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {doses.map((dose) => (
                    <li key={dose.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {dose.amount} mg at {new Date(dose.timestamp).toLocaleString()}
                        <Button sx={{ marginLeft: 4}} onClick={() => handleRemoveDose(dose.id!)}>Remove</Button>
                    </li>
                ))}
            </ul>
        </Stack>
    );
}
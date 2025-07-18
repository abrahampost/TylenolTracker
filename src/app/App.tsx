import { Box, Container } from "@mui/material"
import { AddDose } from "../features/dosing/components/add-dose"
import { DosesList } from "../features/dosing/components/doses-list"
import { NextDose } from "../features/dosing/components/next-dose"

function App() {
  return (
    <Container>
      <h1>Tylenol Tracker</h1>
      <Box sx={{ display: "flex", width: "100%", gap: 4, justifyContent: "space-between" }}>
        <DosesList />
        <NextDose />
      </Box>
      <AddDose />
    </Container>
  )
}

export default App

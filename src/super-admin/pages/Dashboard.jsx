import React from "react";
import { Box, Container } from "@mui/material";
import DashboardCards from "../../components/DashboardCards";

function Dashboard() {
  return (
    <Box 
      sx={{ 
        minHeight: "100vh",
        backgroundColor: "#f8fafc", // Modern slate background
        py: { xs: 2, md: 4 }
      }}
    >
      <Container maxWidth="xl">
        <DashboardCards />
      </Container>
    </Box>
  );
}

export default Dashboard;


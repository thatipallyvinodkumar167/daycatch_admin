import React from "react";
import { Box, Container } from "@mui/material";
import DashboardCards from "../../components/DashboardCards";

function Dashboard() {
  return (
    <Box 
      sx={{ 
        minHeight: "100vh",
        backgroundColor: "#f4f7fe", 
        p: { xs: 2.5, md: 5 }
      }}
    >
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        <DashboardCards />
      </Box>
    </Box>
  );
}

export default Dashboard;


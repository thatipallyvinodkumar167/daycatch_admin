import { Box } from "@mui/material";
import DashboardCards from "../components/DashboardCards";

function Dashboard() {
  return (
    <Box p={3}>
      <h1>Super Admin Panel</h1>

      <Box sx={{ marginTop: "15px" }}>
        <DashboardCards />
      </Box>
    </Box>
  );
}

export default Dashboard;
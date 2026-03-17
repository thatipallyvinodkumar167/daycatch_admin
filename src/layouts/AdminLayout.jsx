import React, { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";

const drawerWidth = 240;

function AdminLayout() {
  const [open, setOpen] = useState(true);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      
      {/* TOPBAR */}
      <Topbar toggleSidebar={toggleSidebar} />

      {/* SIDEBAR */}
      <Sidebar open={open} drawerWidth={drawerWidth} />

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "64px",
          ml: open ? `${drawerWidth}px` : "0px",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          transition: "margin 0.3s ease"
        }}
      >
        {/* ROUTE CONTENT */}
        <Outlet />
      </Box>

    </Box>
  );
}

export default AdminLayout;
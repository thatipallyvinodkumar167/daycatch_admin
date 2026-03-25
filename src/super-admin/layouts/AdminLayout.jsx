import React, { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import {
  SHELL_CONTENT_BG,
  SHELL_DRAWER_WIDTH,
  SHELL_TOPBAR_HEIGHT,
} from "../../utils/adminShell";

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
      <Sidebar open={open} />

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: `${SHELL_TOPBAR_HEIGHT}px`,
          ml: open ? `${SHELL_DRAWER_WIDTH}px` : "0px",
          minHeight: "100vh",
          backgroundColor: SHELL_CONTENT_BG,
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

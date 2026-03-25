import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import {
  AccountCircleOutlined as AccountCircleOutlinedIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  LogoutOutlined as LogoutOutlinedIcon,
  Menu as MenuIcon,
  SettingsOutlined as SettingsOutlinedIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { clearAuthSession, getAuthSession } from "../../utils/authSession";
import { shellToolbarSx, shellTopbarSx } from "../../utils/adminShell";

function StoreTopbar({ onToggleSidebar, store }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const [anchorEl, setAnchorEl] = useState(null);
  const session = getAuthSession();

  const fallbackName = localStorage.getItem("user_name") || "Administrator";
  const fallbackEmail = localStorage.getItem("user_email") || "admin@daycatch.in";
  const userName = store?.owner || store?.name || fallbackName;
  const userEmail = store?.email || fallbackEmail;
  const userRole = session.role || "Store / Sub-Admin";
  const initials = userName.substring(0, 2).toUpperCase() || "DC";

  const handleProfileOpen = (event) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);

  const handleLogout = () => {
    clearAuthSession();
    handleProfileClose();
    navigate("/login");
  };

  return (
    <>
      <AppBar position="fixed" sx={shellTopbarSx}>
        <Toolbar sx={shellToolbarSx}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              edge="start"
              onClick={onToggleSidebar}
              sx={{
                mr: 2,
                color: "#707eae",
                "&:hover": { color: primaryColor, bgcolor: alpha(primaryColor, 0.05) },
              }}
            >
              <MenuIcon sx={{ fontSize: 24 }} />
            </IconButton>

            <Box
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              onClick={() => navigate(store?.id ? `/stores/details/${store.id}/dashboard` : "/")}
            >
              <Box sx={{ height: "30px", mr: 1.5, display: "flex", alignItems: "center" }}>
                <img src={logo} alt="Day Catch" style={{ height: "100%", width: "auto" }} />
              </Box>
            </Box>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconButton
              onClick={() => navigate(store?.id ? `/stores/details/${store.id}/settings` : "/settings")}
              sx={{ color: "#707eae", bgcolor: alpha("#f4f7fe", 0.5), "&:hover": { bgcolor: alpha("#e0e5f2", 0.8), color: primaryColor } }}
            >
              <SettingsOutlinedIcon sx={{ fontSize: 22 }} />
            </IconButton>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: "#e0e5f2", height: "24px", my: "auto" }} />

            <Box
              onClick={handleProfileOpen}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 0.5,
                pr: 1.5,
                borderRadius: "12px",
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": { bgcolor: alpha(primaryColor, 0.05) },
              }}
            >
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  bgcolor: primaryColor,
                  fontWeight: 900,
                  fontSize: "14px",
                  boxShadow: `0 4px 12px ${alpha(primaryColor, 0.2)}`,
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ ml: 1.5, display: { xs: "none", md: "block" } }}>
                <Typography variant="caption" fontWeight="900" color="#1b2559" sx={{ display: "block", lineHeight: 1 }}>
                  {userName}
                </Typography>
                <Typography variant="caption" fontWeight="700" color="#707eae" sx={{ fontSize: "10px" }}>
                  {userRole}
                </Typography>
              </Box>
              <KeyboardArrowDownIcon sx={{ ml: 1, fontSize: 18, color: "#707eae" }} />
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileClose}
        disableScrollLock
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: "18px",
            minWidth: "200px",
            p: 1,
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
            border: "1px solid #e0e5f2",
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight="900" color="#1b2559">{userName}</Typography>
          <Typography variant="caption" fontWeight="700" color="#707eae" sx={{ wordBreak: "break-all" }}>{userEmail}</Typography>
        </Box>
        <Divider sx={{ my: 1, borderColor: "#f4f7fe" }} />
        <MenuItem onClick={() => { handleProfileClose(); navigate("/profile"); }} sx={{ borderRadius: "10px", py: 1.2, fontWeight: 700, "&:hover": { bgcolor: alpha(primaryColor, 0.05), color: primaryColor } }}>
          <AccountCircleOutlinedIcon sx={{ mr: 1.5, fontSize: 18 }} /> Profile
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ borderRadius: "10px", py: 1.2, fontWeight: 700, color: "#ff4d49", "&:hover": { bgcolor: alpha("#ff4d49", 0.05) } }}>
          <LogoutOutlinedIcon sx={{ mr: 1.5, fontSize: 18 }} /> Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default StoreTopbar;

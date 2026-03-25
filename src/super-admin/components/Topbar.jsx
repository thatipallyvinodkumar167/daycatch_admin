import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  alpha,
  Divider,
  Stack,
} from "@mui/material";
import {
  Menu as MenuIcon,
  SettingsOutlined as SettingsIcon,
  LogoutOutlined as LogoutIcon,
  AccountCircleOutlined as ProfileIcon,
  KeyboardArrowDown as ExpandIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/logo.png";
import { clearAuthSession, getAuthSession } from "../../utils/authSession";
import { shellToolbarSx, shellTopbarSx } from "../../utils/adminShell";

function Topbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const { token, role, storeName } = getAuthSession();
  const isAuth = Boolean(token);
  const [anchorEl, setAnchorEl] = useState(null);
  const indigoPrimary = "#4318ff";

  const userName = localStorage.getItem("user_name") || "Administrator";
  const userEmail = localStorage.getItem("user_email") || "admin@daycatch.in";
  const userRole = storeName ? `${role} - ${storeName}` : role || "Admin";
  const initials = userName.substring(0, 2).toUpperCase() || "DC";

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  return (
    <AppBar position="fixed" sx={shellTopbarSx}>
      <Toolbar sx={shellToolbarSx}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            edge="start"
            onClick={toggleSidebar}
            sx={{
              mr: 2,
              color: "#707eae",
              "&:hover": { color: indigoPrimary, bgcolor: alpha(indigoPrimary, 0.05) },
            }}
          >
            <MenuIcon sx={{ fontSize: 24 }} />
          </IconButton>

          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          >
            <Box sx={{ height: "30px", mr: 1.5, display: "flex", alignItems: "center" }}>
              <img src={logo} alt="Day Catch" style={{ height: "100%", width: "auto" }} />
            </Box>
          </Box>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconButton
            onClick={() => navigate("/settings")}
            sx={{
              color: "#707eae",
              bgcolor: alpha("#f4f7fe", 0.5),
              "&:hover": { bgcolor: alpha("#e0e5f2", 0.8), color: indigoPrimary },
            }}
          >
            <SettingsIcon sx={{ fontSize: 22 }} />
          </IconButton>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 1, borderColor: "#e0e5f2", height: "24px", my: "auto" }}
          />

          {!isAuth ? (
            <Button
              variant="contained"
              disableElevation
              onClick={() => navigate("/admin/login")}
              sx={{
                bgcolor: indigoPrimary,
                borderRadius: "12px",
                fontWeight: 900,
                px: 3,
                textTransform: "none",
                "&:hover": { bgcolor: "#3311db" },
              }}
            >
              Login
            </Button>
          ) : (
            <Box
              onClick={handleProfileClick}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 0.5,
                pr: 1.5,
                borderRadius: "12px",
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": { bgcolor: alpha(indigoPrimary, 0.05) },
              }}
            >
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  bgcolor: indigoPrimary,
                  fontWeight: 900,
                  fontSize: "14px",
                  boxShadow: `0 4px 12px ${alpha(indigoPrimary, 0.2)}`,
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ ml: 1.5, display: { xs: "none", md: "block" } }}>
                <Typography
                  variant="caption"
                  fontWeight="900"
                  color="#1b2559"
                  sx={{ display: "block", lineHeight: 1 }}
                >
                  {userName}
                </Typography>
                <Typography variant="caption" fontWeight="700" color="#707eae" sx={{ fontSize: "10px" }}>
                  {userRole}
                </Typography>
              </Box>
              <ExpandIcon sx={{ ml: 1, fontSize: 18, color: "#707eae" }} />
            </Box>
          )}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
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
              <Typography variant="subtitle2" fontWeight="900" color="#1b2559">
                {userName}
              </Typography>
              <Typography
                variant="caption"
                fontWeight="700"
                color="#707eae"
                sx={{ wordBreak: "break-all" }}
              >
                {userEmail}
              </Typography>
            </Box>
            <Divider sx={{ my: 1, borderColor: "#f4f7fe" }} />
            <MenuItem
              onClick={() => {
                handleClose();
                navigate("/profile");
              }}
              sx={{
                borderRadius: "10px",
                py: 1.2,
                fontWeight: 700,
                "&:hover": { bgcolor: alpha(indigoPrimary, 0.05), color: indigoPrimary },
              }}
            >
              <ProfileIcon sx={{ mr: 1.5, fontSize: 18 }} /> Profile
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{
                borderRadius: "10px",
                py: 1.2,
                fontWeight: 700,
                color: "#ff4d49",
                "&:hover": { bgcolor: alpha("#ff4d49", 0.05) },
              }}
            >
              <LogoutIcon sx={{ mr: 1.5, fontSize: 18 }} /> Logout
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;

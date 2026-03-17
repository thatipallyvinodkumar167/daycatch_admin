import { AppBar, Toolbar, IconButton, Button, Box, Menu, MenuItem, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

function Topbar({ toggleSidebar }) {

  const navigate = useNavigate();
  const isAuth = localStorage.getItem("token");

  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#f2f2f2",
        color: "#000",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

        {/* LEFT SIDE */}
        <Box sx={{ display: "flex", alignItems: "center" }}>

          <IconButton edge="start" onClick={toggleSidebar} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    p: 0.5,
    borderRadius: "4px",
    height: "auto",
    width: "auto"
  }}
>
  <img
    src={logo}
    alt="logo"
    style={{
      height: "30px",
      width: "auto",
      objectFit: "contain"
    }}
  />
</Box>

        </Box>

        {/* RIGHT SIDE */}

        {!isAuth ? (

          <Button
            variant="outlined"
            onClick={() => navigate("/admin/login")}
          >
            Login
          </Button>

        ) : (

          <>
            <IconButton onClick={handleProfileClick}>
              <Avatar sx={{ width: 32, height: 32 }} />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => navigate("/profile")}>
                Profile
              </MenuItem>

              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </>

        )}

      </Toolbar>
    </AppBar>
  );
}

export default Topbar;
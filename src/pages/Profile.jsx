import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  Stack,
  Chip,
  IconButton,
  InputAdornment,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import LockResetIcon from "@mui/icons-material/LockReset";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import ShieldIcon from "@mui/icons-material/Shield";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api/v1";

const ProfilePage = () => {
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  const [profile, setProfile] = useState({
    name: localStorage.getItem("user_name") || "Admin",
    email: localStorage.getItem("user_email") || "",
    role: localStorage.getItem("user_role") || "Super Admin",
  });

  const [editForm, setEditForm] = useState({ ...profile });

  const [pwForm, setPwForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Avatar initials
  const getInitials = (name) => {
    if (!name) return "A";
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
      : parts[0][0].toUpperCase();
  };

  const getRoleBadgeColor = (role) => {
    if (role === "Super Admin") return { bg: "#fff0f0", color: "#E53935", border: "#ffcdd2" };
    if (role === "Manager") return { bg: "#e8f5e9", color: "#2e7d32", border: "#c8e6c9" };
    return { bg: "#e3f2fd", color: "#1565c0", border: "#bbdefb" };
  };

  const roleBadge = getRoleBadgeColor(profile.role);

  const showSnack = (msg, severity = "success") =>
    setSnack({ open: true, msg, severity });

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) return showSnack("Name cannot be empty.", "error");
    setLoading(true);
    try {
      // Save to localStorage immediately (optimistic update)
      localStorage.setItem("user_name", editForm.name.trim());
      setProfile((prev) => ({ ...prev, name: editForm.name.trim() }));
      setEditing(false);
      showSnack("Profile updated successfully!");
    } catch (err) {
      showSnack("Failed to update profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwForm.oldPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      return showSnack("All password fields are required.", "error");
    }
    if (pwForm.newPassword.length < 8) {
      return showSnack("New password must be at least 8 characters.", "error");
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return showSnack("New passwords do not match.", "error");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_BASE}/auth/change-password`,
        {
          oldPassword: pwForm.oldPassword,
          newPassword: pwForm.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSnack("Password changed successfully!");
      setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setChangingPassword(false);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to change password. Check your old password.";
      showSnack(msg, "error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        p: { xs: 2, md: 4 },
      }}
    >
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} color="#1a1a2e">
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your personal information and account security
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* LEFT COLUMN — Identity Card */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
              position: "sticky",
              top: "80px",
            }}
          >
            {/* Banner */}
            <Box
              sx={{
                height: 120,
                background: "linear-gradient(135deg, #E53935 0%, #b71c1c 100%)",
                position: "relative",
              }}
            />

            {/* Avatar */}
            <Box sx={{ px: 3, pb: 3, mt: -6 }}>
              <Avatar
                sx={{
                  width: 96,
                  height: 96,
                  fontSize: "2rem",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                  border: "4px solid #fff",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                  mb: 2,
                }}
              >
                {getInitials(profile.name)}
              </Avatar>

              <Typography variant="h5" fontWeight={800} color="#1a1a2e">
                {profile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {profile.email}
              </Typography>

              <Chip
                label={profile.role}
                size="small"
                sx={{
                  backgroundColor: roleBadge.bg,
                  color: roleBadge.color,
                  border: `1px solid ${roleBadge.border}`,
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  px: 1,
                }}
              />

              <Divider sx={{ my: 3 }} />

              {/* Info rows */}
              {[
                { icon: <PersonIcon fontSize="small" />, label: "Full Name", value: profile.name },
                { icon: <EmailIcon fontSize="small" />, label: "Email", value: profile.email },
                { icon: <ShieldIcon fontSize="small" />, label: "Role", value: profile.role },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2 }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: "10px",
                      backgroundColor: "#fff0f0",
                      color: "#E53935",
                      display: "flex",
                      mt: 0.25,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="#1a1a2e">
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT COLUMN — Edit Forms */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* === PERSONAL INFO === */}
            <Paper sx={{ borderRadius: "20px", boxShadow: "0 8px 32px rgba(0,0,0,0.06)", overflow: "hidden" }}>
              <Box
                sx={{
                  px: 3,
                  py: 2.5,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #f1f1f1",
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={700} color="#1a1a2e">
                    Personal Information
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Update your name and public details
                  </Typography>
                </Box>
                {!editing ? (
                  <Button
                    startIcon={<EditIcon />}
                    variant="outlined"
                    onClick={() => { setEditForm({ ...profile }); setEditing(true); }}
                    sx={{
                      borderColor: "#E53935",
                      color: "#E53935",
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": { backgroundColor: "#fff0f0", borderColor: "#E53935" },
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <Button
                      startIcon={loading ? <CircularProgress size={14} /> : <SaveIcon />}
                      variant="contained"
                      onClick={handleSaveProfile}
                      disabled={loading}
                      sx={{
                        backgroundColor: "#E53935",
                        "&:hover": { backgroundColor: "#b71c1c" },
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      startIcon={<CancelIcon />}
                      variant="outlined"
                      onClick={() => setEditing(false)}
                      sx={{
                        borderColor: "#ccc",
                        color: "#666",
                        borderRadius: "10px",
                        textTransform: "none",
                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                )}
              </Box>

              <Box sx={{ p: 3 }}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary">
                      FULL NAME
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={editing ? editForm.name : profile.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      disabled={!editing}
                      sx={{
                        mt: 0.5,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          backgroundColor: editing ? "#fff" : "#fafafa",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary">
                      EMAIL ADDRESS
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={profile.email}
                      disabled
                      sx={{
                        mt: 0.5,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          backgroundColor: "#fafafa",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary">
                      ROLE
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={profile.role}
                      disabled
                      sx={{
                        mt: 0.5,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          backgroundColor: "#fafafa",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary">
                      ACCOUNT TYPE
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value="Admin Panel"
                      disabled
                      sx={{
                        mt: 0.5,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          backgroundColor: "#fafafa",
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            {/* === SECURITY — CHANGE PASSWORD === */}
            <Paper sx={{ borderRadius: "20px", boxShadow: "0 8px 32px rgba(0,0,0,0.06)", overflow: "hidden" }}>
              <Box
                sx={{
                  px: 3,
                  py: 2.5,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #f1f1f1",
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={700} color="#1a1a2e">
                    Account Security
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Manage your password and login credentials
                  </Typography>
                </Box>
                {!changingPassword ? (
                  <Button
                    startIcon={<LockResetIcon />}
                    variant="outlined"
                    onClick={() => setChangingPassword(true)}
                    sx={{
                      borderColor: "#7c3aed",
                      color: "#7c3aed",
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": { backgroundColor: "#f3e8ff", borderColor: "#7c3aed" },
                    }}
                  >
                    Change Password
                  </Button>
                ) : (
                  <Button
                    startIcon={<CancelIcon />}
                    variant="outlined"
                    onClick={() => { setChangingPassword(false); setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" }); }}
                    sx={{ borderColor: "#ccc", color: "#666", borderRadius: "10px", textTransform: "none" }}
                  >
                    Cancel
                  </Button>
                )}
              </Box>

              {!changingPassword ? (
                <Box sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2.5,
                      borderRadius: "12px",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #e9ecef",
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "12px",
                        backgroundColor: "#f3e8ff",
                        color: "#7c3aed",
                        display: "flex",
                      }}
                    >
                      <LockResetIcon />
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={700} color="#1a1a2e">
                        Password Protected
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Your password is securely hashed and stored. Last changed recently.
                      </Typography>
                    </Box>
                    <Chip
                      label="Secure"
                      size="small"
                      sx={{ ml: "auto", backgroundColor: "#e8f5e9", color: "#2e7d32", fontWeight: 700 }}
                    />
                  </Box>
                </Box>
              ) : (
                <Box sx={{ p: 3 }}>
                  <Alert severity="info" sx={{ mb: 3, borderRadius: "10px" }}>
                    Use a strong password with at least 8 characters, including numbers and symbols.
                  </Alert>
                  <Grid container spacing={2.5}>
                    {[
                      { label: "CURRENT PASSWORD", key: "oldPassword", show: showOldPw, toggle: () => setShowOldPw((v) => !v) },
                      { label: "NEW PASSWORD", key: "newPassword", show: showNewPw, toggle: () => setShowNewPw((v) => !v) },
                      { label: "CONFIRM NEW PASSWORD", key: "confirmPassword", show: showNewPw, toggle: () => setShowNewPw((v) => !v) },
                    ].map((field) => (
                      <Grid item xs={12} sm={field.key === "oldPassword" ? 12 : 6} key={field.key}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary">
                          {field.label}
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          type={field.show ? "text" : "password"}
                          value={pwForm[field.key]}
                          onChange={(e) => setPwForm({ ...pwForm, [field.key]: e.target.value })}
                          sx={{
                            mt: 0.5,
                            "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton size="small" onClick={field.toggle}>
                                  {field.show ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>

                  <Button
                    variant="contained"
                    onClick={handleChangePassword}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <LockResetIcon />}
                    sx={{
                      mt: 3,
                      backgroundColor: "#7c3aed",
                      "&:hover": { backgroundColor: "#6d28d9" },
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 700,
                      py: 1.25,
                      px: 3,
                    }}
                  >
                    Update Password
                  </Button>
                </Box>
              )}
            </Paper>

            {/* === DANGER ZONE === */}
            <Paper
              sx={{
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
                border: "1px solid #ffcdd2",
                overflow: "hidden",
              }}
            >
              <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid #ffcdd2", backgroundColor: "#fff8f8" }}>
                <Typography variant="h6" fontWeight={700} color="#c62828">
                  Session Management
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Manage your active sessions and logout options
                </Typography>
              </Box>
              <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" fontWeight={600} color="#1a1a2e">
                    Sign out of all devices
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    This will clear your session and log you out immediately.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/login";
                  }}
                  sx={{
                    backgroundColor: "#c62828",
                    "&:hover": { backgroundColor: "#8e0000" },
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    ml: 2,
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          sx={{ borderRadius: "12px", fontWeight: 600 }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;

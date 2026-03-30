import React, { useState } from "react";
import {
  Alert,
  alpha,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  AdminPanelSettings as AdminPanelIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  LocationCity as CityIcon,
  LockReset as LockResetIcon,
  Logout as LogoutIcon,
  Save as SaveIcon,
  Shield as ShieldIcon,
  VerifiedUser as VerifiedUserIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import api from "../../api/api";
import { clearAuthSession, getAuthSession } from "../../utils/authSession";

// Industry-Level E-commerce Palette (Blinkit / BigBasket Inspired)
const BRAND_GREEN = "#1f2937";
const SURFACE_BG = "#f4f6f8";
const TEXT_DARK = "#1f2937";
const TEXT_MUTED = "#6b7280";
const BORDER_COLOR = "#e5e7eb";

const panelSx = {
  borderRadius: "16px",
  border: `1px solid ${BORDER_COLOR}`,
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
};

const SectionHeader = ({ title, description, action }) => (
  <Stack
    direction={{ xs: "column", md: "row" }}
    spacing={2}
    justifyContent="space-between"
    alignItems={{ xs: "flex-start", md: "center" }}
    sx={{ mb: 4 }}
  >
    <Box>
      <Typography variant="h6" sx={{ color: TEXT_DARK, fontWeight: 800, letterSpacing: "-0.01em" }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ mt: 0.5, color: TEXT_MUTED, fontWeight: 500 }}>
          {description}
        </Typography>
      )}
    </Box>
    {action}
  </Stack>
);

const StyledTextField = ({ label, value, onChange, type = "text", placeholder, disabled = false, endAdornment }) => (
  <Box>
    <Typography variant="body2" sx={{ mb: 1, color: TEXT_DARK, fontWeight: 700 }}>
      {label}
    </Typography>
    <TextField
      fullWidth
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      InputProps={{
        endAdornment,
        sx: {
          borderRadius: "12px",
          backgroundColor: disabled ? "#f9fafb" : "#ffffff",
          fontWeight: 600,
          color: TEXT_DARK,
        },
      }}
      sx={{
        "& input::-ms-reveal, & input::-ms-clear": {
          display: "none",
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: BORDER_COLOR },
          "&:hover fieldset": { borderColor: "#d1d5db" },
          "&.Mui-focused fieldset": { borderColor: BRAND_GREEN },
        },
      }}
    />
  </Box>
);

const MetricCard = ({ icon, label, value }) => (
  <Paper sx={{ ...panelSx, p: 3, display: "flex", alignItems: "center", gap: 2.5 }}>
    <Avatar sx={{ bgcolor: alpha(BRAND_GREEN, 0.08), color: BRAND_GREEN, width: 56, height: 56, borderRadius: "14px" }}>
      {icon}
    </Avatar>
    <Box>
      <Typography variant="body2" sx={{ color: TEXT_MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </Typography>
      <Typography variant="h6" sx={{ color: TEXT_DARK, fontWeight: 800, mt: 0.5, lineHeight: 1.2 }}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

const ProfilePage = () => {
  const { token, role } = getAuthSession();
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  const [profile, setProfile] = useState({
    name: localStorage.getItem("user_name") || "Admin",
    email: localStorage.getItem("user_email") || "admin@daycatch.in",
    role: role || "Super Admin",
    phone: "+91 9876543210",
    city: "Hyderabad, India",
  });
  const [editForm, setEditForm] = useState({ ...profile });
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

  const getInitials = (name) => {
    if (!name) return "A";
    const parts = name.trim().split(" ");
    return parts.length >= 2 ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase() : parts[0][0].toUpperCase();
  };

  const showSnack = (msg, severity = "success") => setSnack({ open: true, msg, severity });

  const resetPasswordForm = () => {
    setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setChangingPassword(false);
    setShowOldPw(false);
    setShowNewPw(false);
  };

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) return showSnack("Name cannot be empty.", "error");
    if (!editForm.email?.trim()) return showSnack("Email cannot be empty.", "error");

    setLoading(true);
    try {
      await api.patch(
        "/auth/update-profile",
        { Name: editForm.name.trim(), Email: editForm.email.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("user_name", editForm.name.trim());
      localStorage.setItem("user_email", editForm.email.trim());
      setProfile((prev) => ({ ...prev, name: editForm.name.trim(), email: editForm.email.trim() }));
      setEditing(false);
      showSnack("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      showSnack("Failed to update profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwForm.oldPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      return showSnack("Please complete all password fields.", "error");
    }
    if (pwForm.newPassword.length < 8) {
      return showSnack("New password must be at least 8 characters.", "error");
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return showSnack("New password and confirmation do not match.", "error");
    }

    setLoading(true);
    try {
      await api.patch(
        "/auth/change-password",
        { oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSnack("Password updated successfully.");
      resetPasswordForm();
    } catch (err) {
      console.error(err);
      showSnack("Failed to update password.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    clearAuthSession();
    window.location.href = "/login";
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: SURFACE_BG, minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
        
        {/* Industry-Level Sleek Hero Banner */}
        <Paper
          sx={{
            ...panelSx,
            bgcolor: "#1f2937",
            mb: 4,
            pt: { xs: 4, md: 5 },
            px: { xs: 3, md: 5 },
            pb: { xs: 4, md: 5 },
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={4}
            alignItems={{ xs: "center", sm: "flex-end" }}
          >
            <Avatar
              sx={{
                width: { xs: 100, md: 130 },
                height: { xs: 100, md: 130 },
                border: "4px solid #ffffff",
                bgcolor: "#ffffff",
                color: BRAND_GREEN,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 900,
                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              }}
            >
              {getInitials(profile.name)}
            </Avatar>

            <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" }, pb: 1, pt: { xs: 2, sm: 0 } }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em", textShadow: "0 2px 10px rgba(0,0,0,0.15)" }}>
                {profile.name}
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 700, mt: 0.5 }}>
                {profile.email} • {profile.phone}
              </Typography>
              <Stack direction="row" spacing={1.5} sx={{ mt: 2, justifyContent: { xs: "center", sm: "flex-start" } }}>
                <Chip
                  label={profile.role}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "#ffffff",
                    fontWeight: 800,
                    borderRadius: "6px",
                    px: 1,
                  }}
                />
                <Chip
                  label="Verified Access"
                  size="small"
                  icon={<VerifiedUserIcon sx={{ fontSize: "16px !important", color: "#05cd99 !important" }} />}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.95)",
                    color: "#05cd99",
                    fontWeight: 800,
                    borderRadius: "6px",
                    px: 1,
                  }}
                />
              </Stack>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ pb: 1, width: { xs: "100%", sm: "auto" } }}>
              <Button
                variant="contained"
                startIcon={<LockResetIcon />}
                onClick={() => setChangingPassword(true)}
                fullWidth
                sx={{
                  bgcolor: "#ffffff",
                  color: "#1f2937",
                  borderRadius: "14px",
                  fontWeight: 900,
                  textTransform: "none",
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                  px: 4,
                  py: 1.5,
                  "&:hover": { bgcolor: "#f4f7fe", boxShadow: "0 10px 20px rgba(0,0,0,0.15)" },
                }}
              >
                Reset Password
              </Button>
              <Button
                variant="contained"
                startIcon={<LogoutIcon />}
                onClick={handleSignOut}
                fullWidth
                sx={{
                  bgcolor: "#ef4444",
                  color: "#fff",
                  borderRadius: "14px",
                  fontWeight: 900,
                  textTransform: "none",
                  boxShadow: "0 10px 20px rgba(239, 68, 68, 0.25)",
                  px: 4,
                  py: 1.5,
                  "&:hover": { bgcolor: "#dc2626", boxShadow: "0 10px 20px rgba(239, 68, 68, 0.4)" },
                }}
              >
                Sign Out
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Stack spacing={4}>
              {/* Profile Metrics */}
              <MetricCard icon={<AdminPanelIcon fontSize="large" />} label="Workspace Layer" value={profile.role} />
              <MetricCard icon={<CityIcon fontSize="large" />} label="Operating Zone" value={profile.city} />
              
              <Paper sx={{ ...panelSx, p: 3 }}>
                <SectionHeader title="Security Controls" />
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: "#ecfdf5", color: "#10b981", width: 40, height: 40, borderRadius: "10px" }}>
                       <ShieldIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: TEXT_DARK }}>Account Secured</Typography>
                      <Typography variant="caption" sx={{ color: TEXT_MUTED, fontWeight: 500 }}>Password rotation enabled</Typography>
                    </Box>
                  </Stack>
                  <Divider sx={{ borderColor: BORDER_COLOR }} />
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: "#eff6ff", color: "#3b82f6", width: 40, height: 40, borderRadius: "10px" }}>
                       <EmailIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: TEXT_DARK }}>Email Delivery</Typography>
                      <Typography variant="caption" sx={{ color: TEXT_MUTED, fontWeight: 500 }}>System alerts operational</Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Paper>
            </Stack>
          </Grid>

          <Grid item xs={12} md={8}>
            <Stack spacing={4}>
              {/* General Information Card */}
              <Paper sx={{ ...panelSx, p: { xs: 3, md: 4 } }}>
                <SectionHeader
                  title="Personal Information"
                  description="Manage your executive identity and contact details."
                  action={
                    !editing ? (
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => {
                          setEditForm({ ...profile });
                          setEditing(true);
                        }}
                        sx={{
                          borderColor: BORDER_COLOR,
                          color: TEXT_DARK,
                          borderRadius: "10px",
                          textTransform: "none",
                          fontWeight: 700,
                          "&:hover": { borderColor: "#d1d5db", backgroundColor: "#f9fafb" },
                        }}
                      >
                        Edit Details
                      </Button>
                    ) : (
                      <Stack direction="row" spacing={1.5}>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setEditForm({ ...profile });
                            setEditing(false);
                          }}
                          sx={{
                            borderColor: BORDER_COLOR,
                            color: TEXT_MUTED,
                            borderRadius: "10px",
                            textTransform: "none",
                            fontWeight: 700,
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                          onClick={handleSaveProfile}
                          disabled={loading}
                          sx={{
                            bgcolor: BRAND_GREEN,
                            borderRadius: "10px",
                            textTransform: "none",
                            fontWeight: 700,
                            boxShadow: "none",
                            "&:hover": { bgcolor: "#0a6c19", boxShadow: "none" },
                          }}
                        >
                          Save Changes
                        </Button>
                      </Stack>
                    )
                  }
                />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      label="Full Name"
                      value={editing ? editForm.name : profile.name}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      label="Email Address"
                      value={editing ? editForm.email : profile.email}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField label="Phone Number" value={profile.phone} disabled />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField label="Operational City" value={profile.city} disabled />
                  </Grid>
                </Grid>
              </Paper>

              {/* Password Change Card */}
              {changingPassword && (
                <Paper sx={{ ...panelSx, p: { xs: 3, md: 4 }, border: `1px solid ${BRAND_GREEN}` }}>
                  <SectionHeader
                    title="Change Password"
                    description="Ensure your new password is at least 8 characters long."
                    action={
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={resetPasswordForm}
                        sx={{
                          borderColor: BORDER_COLOR,
                          color: TEXT_MUTED,
                          borderRadius: "10px",
                          textTransform: "none",
                          fontWeight: 700,
                        }}
                      >
                        Cancel
                      </Button>
                    }
                  />

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <StyledTextField
                        label="Current Password"
                        type={showOldPw ? "text" : "password"}
                        value={pwForm.oldPassword}
                        onChange={(e) => setPwForm((prev) => ({ ...prev, oldPassword: e.target.value }))}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowOldPw(!showOldPw)} edge="end">
                              {showOldPw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        label="New Password"
                        type={showNewPw ? "text" : "password"}
                        value={pwForm.newPassword}
                        onChange={(e) => setPwForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowNewPw(!showNewPw)} edge="end">
                              {showNewPw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        label="Confirm New Password"
                        type={showNewPw ? "text" : "password"}
                        value={pwForm.confirmPassword}
                        onChange={(e) => setPwForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="contained"
                      onClick={handleChangePassword}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                      sx={{
                        bgcolor: BRAND_GREEN,
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: 700,
                        px: 4,
                        py: 1.2,
                        boxShadow: "none",
                        "&:hover": { bgcolor: "#0a6c19", boxShadow: "none" },
                      }}
                    >
                      Update Password
                    </Button>
                  </Box>
                </Paper>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Modern Floating Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snack.severity}
          sx={{
            borderRadius: "12px",
            fontWeight: 700,
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            bgcolor: snack.severity === "success" ? "#ecfdf5" : "#fef2f2",
            color: snack.severity === "success" ? "#065f46" : "#991b1b",
            "& .MuiAlert-icon": { color: snack.severity === "success" ? "#10b981" : "#ef4444" }
          }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;

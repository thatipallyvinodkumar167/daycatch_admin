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

  Cancel as CancelIcon,
  
  Email as EmailIcon,
  LocationCity as CityIcon,
  LockReset as LockResetIcon,
  Save as SaveIcon,
  Shield as ShieldIcon,
  Storefront as StorefrontIcon,
  VerifiedUser as VerifiedUserIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import api from "../../api/api";
import { getAuthSession } from "../../utils/authSession";

const BRAND_BLUE = "#1b2559";

const TEXT_DARK = "#1b2559";
const TEXT_MUTED = "#a3aed0";
const BORDER_COLOR = "#e0e5f2";

const panelSx = {
  borderRadius: "20px",
  border: `1px solid ${BORDER_COLOR}`,
  backgroundColor: "#ffffff",
  boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
};

const SectionHeader = ({ title, description }) => (
  <Stack spacing={0.5} sx={{ mb: 4 }}>
    <Typography variant="h6" sx={{ color: TEXT_DARK, fontWeight: 900, letterSpacing: "-0.5px" }}>
      {title}
    </Typography>
    {description && (
      <Typography variant="body2" sx={{ color: TEXT_MUTED, fontWeight: 600 }}>
        {description}
      </Typography>
    )}
  </Stack>
);

const StyledTextField = ({ label, value, type = "text", placeholder, disabled = false, endAdornment, onChange }) => (
  <Box>
    <Typography variant="caption" sx={{ mb: 1, display: "block", color: TEXT_MUTED, fontWeight: 800, textTransform: "uppercase" }}>
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
          borderRadius: "14px",
          backgroundColor: disabled ? "#f4f7fe" : "#ffffff",
          fontWeight: 700,
          color: TEXT_DARK,
        },
      }}
      sx={{
        "& input::-ms-reveal, & input::-ms-clear": {
          display: "none",
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: BORDER_COLOR },
          "&:hover fieldset": { borderColor: "#c2c9d6" },
          "&.Mui-focused fieldset": { borderColor: BRAND_BLUE, borderWidth: "2px" },
        },
      }}
    />
  </Box>
);

const MetricCard = ({ icon, label, value }) => (
  <Paper sx={{ ...panelSx, p: 3, display: "flex", alignItems: "center", gap: 2.5 }}>
    <Avatar sx={{ bgcolor: alpha(BRAND_BLUE, 0.05), color: BRAND_BLUE, width: 56, height: 56, borderRadius: "16px" }}>
      {icon}
    </Avatar>
    <Box>
      <Typography variant="caption" sx={{ color: TEXT_MUTED, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
        {label}
      </Typography>
      <Typography variant="h6" sx={{ color: TEXT_DARK, fontWeight: 900, mt: 0.5, lineHeight: 1.2 }}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

const StoreProfile = () => {
  const { store } = useOutletContext();
  const { token, role } = getAuthSession();
  
  const [changingPassword, setChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

  const getInitials = (name) => {
    if (!name) return "S";
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
      showSnack("Password updated securely.");
      resetPasswordForm();
    } catch (err) {
      console.error(err);
      showSnack(err.response?.data?.message || "Failed to update password.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 } }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        
        {/* Dynamic Store Hero Banner */}
        <Paper
          sx={{
            ...panelSx,
            bgcolor: "#1f2937",
            mb: 5,
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
              src={store?.logo}
              sx={{
                width: { xs: 120, md: 140 },
                height: { xs: 120, md: 140 },
                border: "4px solid #ffffff",
                bgcolor: "#ffffff",
                color: BRAND_BLUE,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 900,
                boxShadow: "0 10px 30px rgba(67, 24, 255, 0.15)",
              }}
            >
              {getInitials(store?.name)}
            </Avatar>

            <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" }, pb: 1, pt: { xs: 2, sm: 0 } }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "#ffffff", letterSpacing: "-1px", textShadow: "0 2px 10px rgba(0,0,0,0.15)" }}>
                {store?.name || "Store Panel"}
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 700, mt: 0.5 }}>
                {store?.city || "Location Pending"} • {store?.owner || "Owner"}
              </Typography>
              <Stack direction="row" spacing={1.5} sx={{ mt: 2.5, justifyContent: { xs: "center", sm: "flex-start" } }}>
                <Chip
                  label={role || "Store Sub-Admin"}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "#ffffff",
                    fontWeight: 900,
                    borderRadius: "8px",
                    px: 1,
                  }}
                />
                <Chip
                  label={store?.status?.toUpperCase() || "ACTIVE"}
                  size="small"
                  icon={<VerifiedUserIcon sx={{ fontSize: "16px !important", color: "#05cd99 !important" }} />}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.95)",
                    color: "#05cd99",
                    fontWeight: 900,
                    borderRadius: "8px",
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
                  bgcolor: "#E53935",
                  color: "#ffffff",
                  borderRadius: "14px",
                  fontWeight: 900,
                  textTransform: "none",
                  boxShadow: "0 10px 20px rgba(229, 57, 53, 0.25)",
                  px: 4,
                  py: 1.5,
                  "&:hover": { bgcolor: "#d32f2f", boxShadow: "0 10px 20px rgba(229, 57, 53, 0.4)" },
                }}
              >
                Reset Password
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Stack spacing={4}>
              <MetricCard icon={<StorefrontIcon fontSize="large" />} label="Workspace ID" value={store?.id?.substring(0,8)?.toUpperCase() || "N/A"} />
              <MetricCard icon={<CityIcon fontSize="large" />} label="Service Zone" value={store?.city || "Unassigned"} />
              
              <Paper sx={{ ...panelSx, p: 4 }}>
                <SectionHeader title="Security & Access" description="Security layer configurations." />
                <Stack spacing={3}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: "rgba(5, 205, 153, 0.1)", color: "#05cd99", width: 44, height: 44, borderRadius: "12px" }}>
                       <ShieldIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: TEXT_DARK }}>Encrypted Session</Typography>
                      <Typography variant="caption" sx={{ color: TEXT_MUTED, fontWeight: 600 }}>Active session secured</Typography>
                    </Box>
                  </Stack>
                  <Divider sx={{ borderColor: BORDER_COLOR }} />
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: alpha(BRAND_BLUE, 0.05), color: BRAND_BLUE, width: 44, height: 44, borderRadius: "12px" }}>
                       <EmailIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: TEXT_DARK }}>Authentication Email</Typography>
                      <Typography variant="caption" sx={{ color: TEXT_MUTED, fontWeight: 600 }}>{store?.email || "Pending"}</Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Paper>
            </Stack>
          </Grid>

          <Grid item xs={12} md={8}>
            <Stack spacing={4}>
              <Paper sx={{ ...panelSx, p: { xs: 3, md: 5 } }}>
                <SectionHeader
                  title="Dynamic Store Identity"
                  description="Your primary operational details established by the Super Admin."
                />

                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <StyledTextField label="Operational Store Name" value={store?.name || ""} disabled />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField label="Store Manager / Owner" value={store?.owner || "Not registered"} disabled />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField label="Contact Email" value={store?.email || "Not registered"} disabled />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField label="Mobile Number" value={store?.phone || "Not registered"} disabled />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField label="Physical Address" value={store?.address || "Not registered"} disabled />
                  </Grid>
                </Grid>
              </Paper>

              {changingPassword && (
                <Paper sx={{ ...panelSx, p: { xs: 3, md: 5 }, border: `2px solid ${BRAND_BLUE}` }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                      <Box>
                          <Typography variant="h6" sx={{ color: TEXT_DARK, fontWeight: 900, letterSpacing: "-0.5px" }}>Secure Password Reset</Typography>
                          <Typography variant="body2" sx={{ color: TEXT_MUTED, fontWeight: 600 }}>Update your dedicated store login credentials.</Typography>
                      </Box>
                      <IconButton onClick={resetPasswordForm} sx={{ color: TEXT_MUTED, bgcolor: "#f4f7fe" }}><CancelIcon /></IconButton>
                  </Stack>

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
                        label="New Security Password"
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
                        label="Confirm Security Password"
                        type={showNewPw ? "text" : "password"}
                        value={pwForm.confirmPassword}
                        onChange={(e) => setPwForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="contained"
                      onClick={handleChangePassword}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                      sx={{
                        bgcolor: BRAND_BLUE,
                        borderRadius: "14px",
                        textTransform: "none",
                        fontWeight: 800,
                        px: 5,
                        py: 1.5,
                        boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)",
                        "&:hover": { bgcolor: "#3311cc" },
                      }}
                    >
                      Authenticate & Save
                    </Button>
                  </Box>
                </Paper>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snack.severity}
          sx={{
            borderRadius: "14px",
            fontWeight: 800,
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            bgcolor: snack.severity === "success" ? "#ecfdf5" : "#fef2f2",
            color: snack.severity === "success" ? "#05cd99" : "#ff4d49",
            "& .MuiAlert-icon": { color: snack.severity === "success" ? "#05cd99" : "#ff4d49" }
          }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StoreProfile;

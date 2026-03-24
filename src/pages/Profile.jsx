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
  alpha
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  LockReset as LockResetIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Shield as ShieldIcon,
  Badge as BadgeIcon,
  AdminPanelSettings as AdminPanelIcon,
  VpnKey as VpnKeyIcon,
  Logout as LogoutIcon
} from "@mui/icons-material";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api/v1";

const SectionTitle = ({ children, subtitle }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-0.5px" }}>{children}</Typography>
    {subtitle && <Typography variant="caption" color="#a3aed0" fontWeight="700" sx={{ display: "block", fontSize: "10px" }}>{subtitle}</Typography>}
    <Divider sx={{ mt: 1, borderColor: "#f1f4f9" }} />
  </Box>
);

const StyledTextField = ({ label, value, onChange, type = "text", placeholder, disabled = false, endAdornment }) => (
  <Box sx={{ mb: 2 }}>
      <Typography variant="caption" fontWeight="900" color="#1b2559" sx={{ mb: 0.5, display: "block", textTransform: "uppercase", fontSize: "9px" }}>{label}</Typography>
      <TextField fullWidth size="small" type={type} placeholder={placeholder} value={value} onChange={onChange} disabled={disabled}
          InputProps={{ endAdornment, sx: { borderRadius: "10px", backgroundColor: disabled ? "#f4f7fe" : "#fcfdff", fontSize: "12px", fontWeight: "600" } }}
          sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#e0e5f2" } } }} />
  </Box>
);

const ProfilePage = () => {
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });
  const indigoPrimary = "#4318ff";

  const [profile, setProfile] = useState({
    name: localStorage.getItem("user_name") || "Admin",
    email: localStorage.getItem("user_email") || "admin@daycatch.in",
    role: localStorage.getItem("user_role") || "Super Admin",
  });

  const [editForm, setEditForm] = useState({ ...profile });
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

  const getInitials = (name) => {
    if (!name) return "A";
    const parts = name.trim().split(" ");
    return parts.length >= 2 ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase() : parts[0][0].toUpperCase();
  };

  const showSnack = (msg, severity = "success") => setSnack({ open: true, msg, severity });

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) return showSnack("Name cannot be empty.", "error");
    if (!editForm.email?.trim()) return showSnack("Email cannot be empty.", "error");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_BASE}/auth/update-profile`, { 
        Name: editForm.name.trim(), 
        Email: editForm.email.trim() 
      }, { headers: { Authorization: `Bearer ${token}` } });

      localStorage.setItem("user_name", editForm.name.trim());
      localStorage.setItem("user_email", editForm.email.trim());
      setProfile((prev) => ({ ...prev, name: editForm.name.trim(), email: editForm.email.trim() }));
      setEditing(false);
      showSnack("Identity nodes updated successfully!");
    } catch (err) {
      console.error(err);
      const errData = err.response?.data;
      const errMsg =
        typeof errData === 'string'
          ? errData
          : errData?.message || errData?.error || errData?.msg
          ? String(errData?.message || errData?.error || errData?.msg)
          : "Failed to update identity record.";
      showSnack(errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwForm.oldPassword || !pwForm.newPassword || !pwForm.confirmPassword) return showSnack("Security fields required.", "error");
    if (pwForm.newPassword.length < 8) return showSnack("Key must be at least 8 units.", "error");
    if (pwForm.newPassword !== pwForm.confirmPassword) return showSnack("Key mismatch detected.", "error");

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_BASE}/auth/change-password`, { oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword }, { headers: { Authorization: `Bearer ${token}` } });
      showSnack("Security protocol updated!");
      setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setChangingPassword(false);
    } catch (err) {
      console.error(err);
      const errData = err.response?.data;
      const errMsg =
        typeof errData === 'string'
          ? errData
          : errData?.message || errData?.error || errData?.msg
          ? String(errData?.message || errData?.error || errData?.msg)
          : "Failed to update security protocol.";
      showSnack(errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box><Typography variant="h6" fontWeight="900" color="#1b2559">Profile</Typography><Typography variant="caption" color="#a3aed0" fontWeight="800">Manage your profile information</Typography></Box>
      </Box>

      <Grid container spacing={3}>
        {/* IDENTITY CARD */}
        <Grid item xs={12} md={3.2}>
          <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid #e0e5f2", position: "sticky", top: "80px", bgcolor: "#fff" }}>
            <Box sx={{ height: 100, background: `linear-gradient(135deg, ${indigoPrimary} 0%, #3311db 100%)`, position: "relative" }} />
            <Box sx={{ px: 3, pb: 4, mt: -6, textAlign: "center" }}>
              <Avatar sx={{ width: 84, height: 84, fontSize: "1.8rem", fontWeight: 800, bgcolor: "#1b2559", border: "4px solid #fff", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", mb: 2, mx: "auto" }}>
                {getInitials(profile.name)}
              </Avatar>
              <Typography variant="body1" fontWeight="900" color="#1b2559" sx={{ mb: 0.5 }}>{profile.name}</Typography>
              <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ display: "block", mb: 2 }}>{profile.email}</Typography>
              <Chip label={profile.role} size="small" sx={{ bgcolor: alpha(indigoPrimary, 0.1), color: indigoPrimary, fontWeight: "900", border: `1px solid ${alpha(indigoPrimary, 0.2)}`, fontSize: "9px" }} />
              
              <Divider sx={{ my: 3, borderColor: "#f1f4f9" }} />
              
              <Stack spacing={2}>
                  {[
                      { icon: <BadgeIcon fontSize="small" />, label: "Full Name", value: profile.name },
                      { icon: <EmailIcon fontSize="small" />, label: "Email Node", value: profile.email },
                      { icon: <AdminPanelIcon fontSize="small" />, label: "Role Authority", value: profile.role },
                  ].map((item) => (
                      <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 1.5, textAlign: "left" }}>
                          <Box sx={{ p: 1, borderRadius: "10px", bgcolor: "#f4f7fe", color: indigoPrimary, display: "flex" }}>{item.icon}</Box>
                          <Box><Typography variant="caption" fontWeight="900" color="#1b2559" sx={{ display: "block", fontSize: "9px" }}>{item.label}</Typography><Typography variant="body2" fontWeight="700" color="#707eae" sx={{ fontSize: "11px" }}>{item.value}</Typography></Box>
                      </Box>
                  ))}
              </Stack>
            </Box>
          </Paper>
        </Grid>

        {/* OPERATION NODES */}
        <Grid item xs={12} md={8.8}>
          <Stack spacing={3}>
            {/* PERSONAL PROTOCOL */}
            <Paper sx={{ p: 4, borderRadius: "28px", border: "1px solid #e0e5f2", bgcolor: "#fff", boxShadow: "none" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <SectionTitle subtitle="Manage your name and email.">Personal Information</SectionTitle>
                {!editing ? (
                  <Button variant="contained" startIcon={<EditIcon sx={{ fontSize: 16 }} />} onClick={() => { setEditForm({ ...profile }); setEditing(true); }} sx={{ bgcolor: indigoPrimary, borderRadius: "10px", fontWeight: 900, textTransform: "none", fontSize: "12px" }}>Edit Profile</Button>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <SaveIcon sx={{ fontSize: 16 }} />} onClick={handleSaveProfile} disabled={loading} sx={{ bgcolor: "#00d26a", borderRadius: "10px", fontWeight: 900, textTransform: "none", fontSize: "12px", "&:hover": { bgcolor: "#00b25a" } }}>Save Changes</Button>
                    <Button variant="outlined" startIcon={<CancelIcon sx={{ fontSize: 16 }} />} onClick={() => setEditing(false)} sx={{ borderColor: "#e0e5f2", color: "#707eae", borderRadius: "10px", fontWeight: 900, textTransform: "none", fontSize: "12px" }}>Cancel</Button>
                  </Stack>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}><StyledTextField label="Full Identity Name" value={editing ? editForm.name : profile.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} disabled={!editing} /></Grid>
                <Grid item xs={12} md={6}><StyledTextField label="Primary Email Node" value={editing ? editForm.email : profile.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} disabled={!editing} /></Grid>
                <Grid item xs={12} md={6}><StyledTextField label="Authority Role" value={profile.role} disabled /></Grid>
                <Grid item xs={12} md={6}><StyledTextField label="Account Protocol" value="Management Console" disabled /></Grid>
              </Grid>
            </Paper>

            {/* SECURITY PROTOCOL */}
            <Paper sx={{ p: 4, borderRadius: "28px", border: "1px solid #e0e5f2", bgcolor: "#fff", boxShadow: "none" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <SectionTitle subtitle="Update your account password.">Security</SectionTitle>
                {!changingPassword ? (
                  <Button variant="contained" startIcon={<LockResetIcon sx={{ fontSize: 16 }} />} onClick={() => setChangingPassword(true)} sx={{ bgcolor: "#111c44", borderRadius: "10px", fontWeight: 900, textTransform: "none", fontSize: "12px" }}>Update Key</Button>
                ) : (
                  <Button variant="outlined" startIcon={<CancelIcon sx={{ fontSize: 16 }} />} onClick={() => { setChangingPassword(false); setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" }); }} sx={{ borderColor: "#e0e5f2", color: "#707eae", borderRadius: "10px", fontWeight: 900, textTransform: "none", fontSize: "12px" }}>Cancel</Button>
                )}
              </Box>

              {!changingPassword ? (
                <Box sx={{ p: 3, borderRadius: "20px", bgcolor: "#f4f7fe", border: "1px solid #e0e5f2", display: "flex", alignItems: "center", gap: 3 }}>
                    <Box sx={{ p: 1.8, borderRadius: "14px", bgcolor: "#fff", color: indigoPrimary, boxShadow: "0 4px 12px rgba(67, 24, 255, 0.1)" }}><VpnKeyIcon /></Box>
                    <Box><Typography variant="body2" fontWeight="900" color="#1b2559">Protocol Secured</Typography><Typography variant="caption" fontWeight="800" color="#a3aed0">Credentials are encrypted and stored in the core management vault.</Typography></Box>
                    <Chip label="ENCRYPTED" size="small" sx={{ ml: "auto", bgcolor: "#00d26a", color: "#fff", fontWeight: "900", fontSize: "10px" }} />
                </Box>
              ) : (
                <Box>
                    <Alert icon={<ShieldIcon />} severity="info" sx={{ mb: 4, borderRadius: "14px", fontWeight: 900, fontSize: "12px", bgcolor: alpha(indigoPrimary, 0.05), color: indigoPrimary, border: `1px solid ${alpha(indigoPrimary, 0.1)}` }}>
                        New security keys must contain at least 8 alphanumeric characters for verification.
                    </Alert>
                    <Grid container spacing={3}>
                        <Grid item xs={12}><StyledTextField label="Current Encryption Key" type={showOldPw ? "text" : "password"} value={pwForm.oldPassword} onChange={(e) => setPwForm({ ...pwForm, oldPassword: e.target.value })} endAdornment={<InputAdornment position="end"><IconButton onClick={() => setShowOldPw(!showOldPw)} size="small">{showOldPw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}</IconButton></InputAdornment>} /></Grid>
                        <Grid item xs={12} md={6}><StyledTextField label="New Primary Key" type={showNewPw ? "text" : "password"} value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} endAdornment={<InputAdornment position="end"><IconButton onClick={() => setShowNewPw(!showNewPw)} size="small">{showNewPw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}</IconButton></InputAdornment>} /></Grid>
                        <Grid item xs={12} md={6}><StyledTextField label="Confirm New Key" type={showNewPw ? "text" : "password"} value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} /></Grid>
                    </Grid>
                    <Button variant="contained" fullWidth onClick={handleChangePassword} disabled={loading} startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <LockResetIcon />} sx={{ mt: 3, bgcolor: indigoPrimary, borderRadius: "12px", fontWeight: 900, py: 1.5, fontSize: "13px" }}>Update Password</Button>
                </Box>
              )}
            </Paper>

            {/* SESSION CONTROL */}
            <Paper sx={{ p: 4, borderRadius: "28px", border: "1px solid #e0e5f2", bgcolor: "#fff", boxShadow: "none" }}>
                <SectionTitle subtitle="Manage your active login session.">Account Session</SectionTitle>
                <Box sx={{ p: 3, borderRadius: "20px", border: "1px solid #ffe0e0", bgcolor: "#fff8f8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box><Typography variant="body2" fontWeight="900" color="#c62828">Global Session Termination</Typography><Typography variant="caption" fontWeight="800" color="#707eae">Instantly sever all active connection threads and purge session cache.</Typography></Box>
                    <Button variant="contained" startIcon={<LogoutIcon />} onClick={() => { localStorage.clear(); window.location.href = "/login"; }} sx={{ bgcolor: "#c62828", borderRadius: "10px", fontWeight: 900, textTransform: "none", px: 4, "&:hover": { bgcolor: "#a51d1d" } }}>Logout</Button>
                </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snack.severity} sx={{ borderRadius: "12px", fontWeight: 900, fontSize: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;

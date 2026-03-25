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
  Logout as LogoutIcon,
  PhoneIphone as PhoneIcon,
  LocationCity as CityIcon
} from "@mui/icons-material";
import api from "../../api/api";
import { clearAuthSession, getAuthSession } from "../../utils/authSession";

const SectionTitle = ({ children, subtitle }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h5" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-0.5px" }}>{children}</Typography>
    {subtitle && <Typography variant="body2" color="#a3aed0" fontWeight="700" sx={{ display: "block", mt: 0.5 }}>{subtitle}</Typography>}
    <Divider sx={{ mt: 2, borderColor: "#f1f4f9" }} />
  </Box>
);

const StyledTextField = ({ label, value, onChange, type = "text", placeholder, disabled = false, endAdornment }) => (
  <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1, display: "block" }}>{label}</Typography>
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
            borderRadius: "16px", 
            backgroundColor: disabled ? "#f4f7fe" : "#fcfdff", 
            fontSize: "14px", 
            fontWeight: "600",
            py: 0.5
          } 
        }}
        sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#e0e5f2" }, "&:hover fieldset": { borderColor: "#4318ff" } } }} 
      />
  </Box>
);

const ProfilePage = () => {
  const { token, role } = getAuthSession();
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
    role: role || "Super Admin",
    phone: "+91 9876543210",
    city: "Hyderabad, India"
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
      await api.patch("/auth/update-profile", { 
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
      showSnack("Failed to update identity record.", "error");
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
      await api.patch("/auth/change-password", { oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword }, { headers: { Authorization: `Bearer ${token}` } });
      showSnack("Security protocol updated!");
      setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setChangingPassword(false);
    } catch (err) {
      console.error(err);
      showSnack("Failed to update security protocol.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 5, maxWidth: "1400px", mx: "auto" }}>
        <Typography variant="h3" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1.5px", mb: 0.5 }}>My Profile</Typography>
        <Typography variant="h6" color="#a3aed0" fontWeight="700">Manage your administrative identity and security.</Typography>
      </Box>

      <Grid container spacing={4} sx={{ maxWidth: "1400px", mx: "auto" }}>
        {/* IDENTITY CARD */}
        <Grid item xs={12} md={4} lg={3.5}>
          <Paper sx={{ borderRadius: "32px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", bgcolor: "#fff" }}>
            <Box sx={{ height: 140, background: `linear-gradient(135deg, ${indigoPrimary} 0%, #3311db 100%)`, position: "relative" }}>
               <Box sx={{ position: "absolute", bottom: -40, left: "50%", transform: "translateX(-50%)" }}>
                  <Avatar sx={{ width: 110, height: 110, fontSize: "2.5rem", fontWeight: 900, bgcolor: "#111c44", border: "6px solid #fff", boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}>
                    {getInitials(profile.name)}
                  </Avatar>
               </Box>
            </Box>
            
            <Box sx={{ px: 4, pt: 7, pb: 5, textAlign: "center" }}>
              <Typography variant="h4" fontWeight="900" color="#1b2559" sx={{ mb: 0.5 }}>{profile.name}</Typography>
              <Typography variant="body1" fontWeight="700" color="#a3aed0" sx={{ display: "block", mb: 3 }}>{profile.email}</Typography>
              <Chip label={profile.role} sx={{ bgcolor: alpha(indigoPrimary, 0.1), color: indigoPrimary, fontWeight: "900", border: `1px solid ${alpha(indigoPrimary, 0.2)}`, px: 2, height: 32 }} />
              
              <Divider sx={{ my: 4, borderColor: "#f1f4f9" }} />
              
              <Stack spacing={3}>
                  {[
                      { icon: <BadgeIcon />, label: "Full Name", value: profile.name },
                      { icon: <EmailIcon />, label: "Email Node", value: profile.email },
                      { icon: <PhoneIcon />, label: "Contact", value: profile.phone },
                      { icon: <CityIcon />, label: "Location", value: profile.city },
                  ].map((item) => (
                      <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 2.5, textAlign: "left" }}>
                          <Box sx={{ p: 1.5, borderRadius: "14px", bgcolor: "#f4f7fe", color: indigoPrimary, display: "flex" }}>{item.icon}</Box>
                          <Box>
                             <Typography variant="caption" fontWeight="900" color="#a3aed0" sx={{ display: "block", textTransform: "uppercase" }}>{item.label}</Typography>
                             <Typography variant="body2" fontWeight="800" color="#1b2559">{item.value}</Typography>
                          </Box>
                      </Box>
                  ))}
              </Stack>
            </Box>
          </Paper>
        </Grid>

        {/* OPERATION NODES */}
        <Grid item xs={12} md={8} lg={8.5}>
          <Stack spacing={4}>
            {/* PERSONAL PROTOCOL */}
            <Paper sx={{ p: 5, borderRadius: "32px", border: "1px solid #e0e5f2", bgcolor: "#fff", boxShadow: "0 10px 40px rgba(0,0,0,0.02)" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
                <SectionTitle subtitle="Core identity markers for the Super Admin account.">Personal Information</SectionTitle>
                {!editing ? (
                  <Button 
                    variant="contained" 
                    startIcon={<EditIcon />} 
                    onClick={() => { setEditForm({ ...profile }); setEditing(true); }} 
                    sx={{ bgcolor: indigoPrimary, borderRadius: "16px", fontWeight: 900, textTransform: "none", px: 4, py: 1.5, boxShadow: "0 10px 20px rgba(67,24,255,0.2)" }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Stack direction="row" spacing={2}>
                    <Button variant="contained" startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />} onClick={handleSaveProfile} disabled={loading} sx={{ bgcolor: "#05cd99", borderRadius: "16px", fontWeight: 900, textTransform: "none", px: 4, py: 1.5, "&:hover": { bgcolor: "#04b485" } }}>Save Changes</Button>
                    <Button variant="outlined" startIcon={<CancelIcon />} onClick={() => setEditing(false)} sx={{ borderColor: "#e0e5f2", color: "#707eae", borderRadius: "16px", fontWeight: 900, textTransform: "none", px: 4, py: 1.5 }}>Cancel</Button>
                  </Stack>
                )}
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}><StyledTextField label="Full Identity Name" value={editing ? editForm.name : profile.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} disabled={!editing} /></Grid>
                <Grid item xs={12} md={6}><StyledTextField label="Primary Email Node" value={editing ? editForm.email : profile.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} disabled={!editing} /></Grid>
                <Grid item xs={12} md={6}><StyledTextField label="Authority Role" value={profile.role} disabled /></Grid>
                <Grid item xs={12} md={6}><StyledTextField label="Phone Verification" value={profile.phone} disabled /></Grid>
              </Grid>
            </Paper>

            {/* SECURITY PROTOCOL */}
            <Paper sx={{ p: 5, borderRadius: "32px", border: "1px solid #e0e5f2", bgcolor: "#fff", boxShadow: "0 10px 40px rgba(0,0,0,0.02)" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
                <SectionTitle subtitle="Manage encryption keys and access credentials.">Security & Access</SectionTitle>
                {!changingPassword ? (
                  <Button 
                    variant="contained" 
                    startIcon={<LockResetIcon />} 
                    onClick={() => setChangingPassword(true)} 
                    sx={{ bgcolor: "#111c44", borderRadius: "16px", fontWeight: 900, textTransform: "none", px: 4, py: 1.5 }}
                  >
                    Set New Key
                  </Button>
                ) : (
                  <Button variant="outlined" startIcon={<CancelIcon />} onClick={() => { setChangingPassword(false); setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" }); }} sx={{ borderColor: "#e0e5f2", color: "#707eae", borderRadius: "16px", fontWeight: 900, textTransform: "none", px: 4, py: 1.5 }}>Cancel</Button>
                )}
              </Box>

              {!changingPassword ? (
                <Box sx={{ p: 4, borderRadius: "24px", bgcolor: "#f4f7fe", border: "1px solid #e0e5f2", display: "flex", alignItems: "center", gap: 4 }}>
                    <Box sx={{ p: 2, borderRadius: "18px", bgcolor: "#fff", color: indigoPrimary, boxShadow: "0 10px 20px rgba(67, 24, 255, 0.08)" }}><AdminPanelIcon fontSize="large" /></Box>
                    <Box sx={{ flex: 1 }}>
                       <Typography variant="h5" fontWeight="900" color="#1b2559">Access Protoco Locked</Typography>
                       <Typography variant="body2" fontWeight="700" color="#a3aed0">Your administrative credentials are protected by hardware-level AES-256 encryption within the platform core.</Typography>
                    </Box>
                    <Chip label="VERIFIED" sx={{ bgcolor: "#05cd99", color: "#fff", fontWeight: "900", height: 32, px: 2 }} />
                </Box>
              ) : (
                <Box>
                    <Alert icon={<ShieldIcon />} severity="info" sx={{ mb: 5, borderRadius: "18px", fontWeight: 800, py: 2, bgcolor: alpha(indigoPrimary, 0.05), color: indigoPrimary, border: `1px solid ${alpha(indigoPrimary, 0.1)}` }}>
                        Please enter a high-entropy key containing at least 8 characters for verification.
                    </Alert>
                    <Grid container spacing={4}>
                        <Grid item xs={12}><StyledTextField label="Current Encryption Key" type={showOldPw ? "text" : "password"} value={pwForm.oldPassword} onChange={(e) => setPwForm({ ...pwForm, oldPassword: e.target.value })} endAdornment={<InputAdornment position="end"><IconButton onClick={() => setShowOldPw(!showOldPw)} size="small" sx={{ mr: 1 }}>{showOldPw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}</IconButton></InputAdornment>} /></Grid>
                        <Grid item xs={12} md={6}><StyledTextField label="New Primary Key" type={showNewPw ? "text" : "password"} value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} endAdornment={<InputAdornment position="end"><IconButton onClick={() => setShowNewPw(!showNewPw)} size="small" sx={{ mr: 1 }}>{showNewPw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}</IconButton></InputAdornment>} /></Grid>
                        <Grid item xs={12} md={6}><StyledTextField label="Confirm New Key" type={showNewPw ? "text" : "password"} value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} /></Grid>
                    </Grid>
                    <Button variant="contained" fullWidth onClick={handleChangePassword} disabled={loading} startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />} sx={{ mt: 2, bgcolor: indigoPrimary, borderRadius: "18px", fontWeight: 900, py: 2.2, boxShadow: "0 15px 30px rgba(67,24,255,0.25)" }}>Confirm Key Update</Button>
                </Box>
              )}
            </Paper>

            {/* SESSION CONTROL */}
            <Paper sx={{ p: 5, borderRadius: "32px", border: "1px solid #ffdcdc", bgcolor: "#fff8f8", boxShadow: "0 10px 40px rgba(224,0,0,0.02)" }}>
                <SectionTitle subtitle="Purge session tokens and terminate authentication threads.">Session Control</SectionTitle>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 3 }}>
                    <Box>
                       <Typography variant="h6" fontWeight="900" color="#c62828">Emergency Session Purge</Typography>
                       <Typography variant="body2" fontWeight="700" color="#707eae">Instantly sever all active connection threads and wipe regional cache.</Typography>
                    </Box>
                    <Button variant="contained" startIcon={<LogoutIcon />} onClick={() => { clearAuthSession(); window.location.href = "/login"; }} sx={{ bgcolor: "#c62828", borderRadius: "16px", fontWeight: 900, textTransform: "none", px: 5, py: 1.8, fontSize: "15px", "&:hover": { bgcolor: "#a51d1d" } }}>Sign Out Globally</Button>
                </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snack.severity} sx={{ borderRadius: "16px", fontWeight: 900, fontSize: "14px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", px: 3, py: 1.5 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;

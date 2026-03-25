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
  const pageMaxWidth = "1480px";
  const orderPanelSx = {
    borderRadius: "24px",
    border: "1px solid #e0e5f2",
    bgcolor: "#fff",
    boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
  };

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
      <Box sx={{ maxWidth: pageMaxWidth, mx: "auto" }}>
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
              My Profile
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 500 }}>
              Review identity, access, and security controls with the same layout language as order history.
            </Typography>
          </Box>
          {!editing && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => {
                setEditForm({ ...profile });
                setEditing(true);
              }}
              sx={{
                backgroundColor: "#1b2559",
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 700,
                px: 3,
                boxShadow: "0 10px 20px rgba(27, 37, 89, 0.2)",
                "&:hover": { backgroundColor: "#111c44" },
              }}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: "ROLE", value: profile.role, icon: <AdminPanelIcon />, color: "#4318ff", bg: "#eef2ff" },
            { label: "EMAIL", value: profile.email, icon: <EmailIcon />, color: "#ffb800", bg: "#fff9e6" },
            { label: "PHONE", value: profile.phone, icon: <PhoneIcon />, color: "#24d164", bg: "#e6f9ed" },
            { label: "LOCATION", value: profile.city, icon: <CityIcon />, color: "#ff4d49", bg: "#fff1f0" },
          ].map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <Paper sx={{ p: 2.5, borderRadius: "20px", display: "flex", alignItems: "center", gap: 2, border: "1px solid #e0e5f2" }}>
                <Avatar sx={{ bgcolor: stat.bg, color: stat.color, width: 48, height: 48, borderRadius: "12px" }}>
                  {stat.icon}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ letterSpacing: "0.5px" }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h6" fontWeight="800" color="#1b2559" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {stat.value}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper
          sx={{
            p: 2,
            mb: 3,
            borderRadius: "20px",
            border: "1px solid #e0e5f2",
            bgcolor: "#fff",
            boxShadow: "0 10px 24px rgba(17, 28, 68, 0.04)",
          }}
        >
          <Stack direction={{ xs: "column", lg: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "stretch", lg: "center" }}>
            <Typography variant="body2" color="#a3aed0" fontWeight="800" sx={{ px: 1 }}>
              Manage profile identity, password rotation, and session control from this workspace.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
              <Button
                variant="text"
                startIcon={<LockResetIcon />}
                onClick={() => setChangingPassword(true)}
                sx={{
                  textTransform: "none",
                  borderRadius: "12px",
                  fontWeight: 800,
                  px: 2.25,
                  py: 1.1,
                  color: "#2b3674",
                  border: "1px solid #e0e5f2",
                  "&:hover": { bgcolor: "#eef2ff" },
                }}
              >
                Security
              </Button>
              <Button
                variant="text"
                startIcon={<LogoutIcon />}
                onClick={() => { clearAuthSession(); window.location.href = "/login"; }}
                sx={{
                  textTransform: "none",
                  borderRadius: "12px",
                  fontWeight: 800,
                  px: 2.25,
                  py: 1.1,
                  color: "#ff4d49",
                  border: "1px solid #ffe0df",
                  "&:hover": { bgcolor: "#fff1f0" },
                }}
              >
                Sign Out
              </Button>
            </Stack>
          </Stack>
        </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4} lg={3.5}>
          <Paper
            sx={{
              ...orderPanelSx,
              p: 4,
              height: "100%",
            }}
          >
            <Stack direction={{ xs: "column", sm: "row", md: "column" }} spacing={3} alignItems={{ xs: "flex-start", sm: "center", md: "flex-start" }}>
              <Stack direction="row" spacing={2.5} alignItems="center" sx={{ width: "100%" }}>
                <Avatar
                  sx={{
                    width: 84,
                    height: 84,
                    fontSize: "1.9rem",
                    fontWeight: 900,
                    bgcolor: "#eef2ff",
                    color: indigoPrimary,
                    borderRadius: "22px",
                  }}
                >
                  {getInitials(profile.name)}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h4" fontWeight="900" color="#1b2559" sx={{ lineHeight: 1.1 }}>
                    {profile.name}
                  </Typography>
                  <Typography variant="body1" fontWeight="700" color="#a3aed0" sx={{ mt: 0.75, wordBreak: "break-word" }}>
                    {profile.email}
                  </Typography>
                  <Chip
                    label={profile.role}
                    sx={{
                      mt: 2,
                      bgcolor: alpha(indigoPrimary, 0.08),
                      color: indigoPrimary,
                      fontWeight: "900",
                      border: `1px solid ${alpha(indigoPrimary, 0.14)}`,
                      px: 1.5,
                      height: 32,
                    }}
                  />
                </Box>
              </Stack>

              <Divider sx={{ width: "100%", borderColor: "#eef2f7" }} />

              <Stack spacing={2} sx={{ width: "100%" }}>
                {[
                  { icon: <BadgeIcon />, label: "Full Name", value: profile.name },
                  { icon: <EmailIcon />, label: "Email Node", value: profile.email },
                  { icon: <PhoneIcon />, label: "Contact", value: profile.phone },
                  { icon: <CityIcon />, label: "Location", value: profile.city },
                ].map((item) => (
                  <Paper
                    key={item.label}
                    sx={{
                      p: 2,
                      borderRadius: "18px",
                      border: "1px solid #eef2f7",
                      boxShadow: "none",
                      bgcolor: "#fafbff",
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "#eef2ff", color: indigoPrimary, width: 42, height: 42, borderRadius: "12px" }}>
                        {item.icon}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" fontWeight="900" color="#a3aed0" sx={{ display: "block", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          {item.label}
                        </Typography>
                        <Typography variant="body2" fontWeight="800" color="#1b2559" sx={{ wordBreak: "break-word" }}>
                          {item.value}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8} lg={8.5}>
          <Stack spacing={4}>
            <Paper
              sx={{
                p: { xs: 3, md: 5 },
                ...orderPanelSx,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
                <SectionTitle subtitle="Core identity markers for the Super Admin account.">Personal Information</SectionTitle>
                {!editing ? (
                  <Button 
                    variant="contained" 
                    startIcon={<EditIcon />} 
                    onClick={() => { setEditForm({ ...profile }); setEditing(true); }} 
                    sx={{ bgcolor: "#1b2559", borderRadius: "12px", fontWeight: 800, textTransform: "none", px: 3, py: 1.35, boxShadow: "0 10px 20px rgba(27, 37, 89, 0.2)", "&:hover": { bgcolor: "#111c44" } }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Stack direction="row" spacing={2}>
                    <Button variant="contained" startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />} onClick={handleSaveProfile} disabled={loading} sx={{ bgcolor: "#1b2559", borderRadius: "12px", fontWeight: 800, textTransform: "none", px: 3, py: 1.35, boxShadow: "0 10px 20px rgba(27, 37, 89, 0.2)", "&:hover": { bgcolor: "#111c44" } }}>Save Changes</Button>
                    <Button variant="outlined" startIcon={<CancelIcon />} onClick={() => setEditing(false)} sx={{ borderColor: "#e0e5f2", color: "#707eae", borderRadius: "12px", fontWeight: 800, textTransform: "none", px: 3, py: 1.35 }}>Cancel</Button>
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

            <Paper
              sx={{
                p: { xs: 3, md: 5 },
                ...orderPanelSx,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
                <SectionTitle subtitle="Manage encryption keys and access credentials.">Security & Access</SectionTitle>
                {!changingPassword ? (
                  <Button 
                    variant="contained" 
                    startIcon={<LockResetIcon />} 
                    onClick={() => setChangingPassword(true)} 
                    sx={{ bgcolor: "#1b2559", borderRadius: "12px", fontWeight: 800, textTransform: "none", px: 3, py: 1.35, boxShadow: "0 10px 20px rgba(27, 37, 89, 0.2)", "&:hover": { bgcolor: "#111c44" } }}
                  >
                    Set New Key
                  </Button>
                ) : (
                  <Button variant="outlined" startIcon={<CancelIcon />} onClick={() => { setChangingPassword(false); setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" }); }} sx={{ borderColor: "#e0e5f2", color: "#707eae", borderRadius: "12px", fontWeight: 800, textTransform: "none", px: 3, py: 1.35 }}>Cancel</Button>
                )}
              </Box>

              {!changingPassword ? (
                <Box sx={{ p: 4, borderRadius: "20px", bgcolor: "#fafbff", border: "1px solid #e0e5f2", display: "flex", alignItems: "center", gap: 4 }}>
                    <Box sx={{ p: 2, borderRadius: "16px", bgcolor: "#eef2ff", color: indigoPrimary, boxShadow: "none" }}><AdminPanelIcon fontSize="large" /></Box>
                    <Box sx={{ flex: 1 }}>
                       <Typography variant="h5" fontWeight="900" color="#1b2559">Access Protocol Locked</Typography>
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
                    <Button variant="contained" fullWidth onClick={handleChangePassword} disabled={loading} startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />} sx={{ mt: 2, bgcolor: "#1b2559", borderRadius: "12px", fontWeight: 800, py: 1.9, boxShadow: "0 10px 20px rgba(27, 37, 89, 0.2)", "&:hover": { bgcolor: "#111c44" } }}>Confirm Key Update</Button>
                </Box>
              )}
            </Paper>

            <Paper
              sx={{
                p: { xs: 3, md: 5 },
                ...orderPanelSx,
                border: "1px solid #ffe0df",
              }}
            >
                <SectionTitle subtitle="Purge session tokens and terminate authentication threads.">Session Control</SectionTitle>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 3 }}>
                    <Box>
                       <Typography variant="h6" fontWeight="900" color="#c62828">Emergency Session Purge</Typography>
                       <Typography variant="body2" fontWeight="700" color="#707eae">Instantly sever all active connection threads and wipe regional cache.</Typography>
                    </Box>
                    <Button variant="contained" startIcon={<LogoutIcon />} onClick={() => { clearAuthSession(); window.location.href = "/login"; }} sx={{ bgcolor: "#ff4d49", borderRadius: "12px", fontWeight: 800, textTransform: "none", px: 4, py: 1.35, fontSize: "15px", boxShadow: "0 10px 20px rgba(255, 77, 73, 0.18)", "&:hover": { bgcolor: "#df3733" } }}>Sign Out Globally</Button>
                </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
      </Box>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snack.severity} sx={{ borderRadius: "16px", fontWeight: 900, fontSize: "14px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", px: 3, py: 1.5 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;

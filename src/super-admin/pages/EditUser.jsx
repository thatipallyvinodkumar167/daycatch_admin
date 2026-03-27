import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
  InputAdornment,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditNoteIcon from "@mui/icons-material/EditNote";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate, useParams } from "react-router-dom";
import { genericApi } from "../../api/genericApi";
import { getUser, updateUser } from "../../api/usersApi";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    backgroundColor: "#f4f7fe",
  },
};

const labelSx = {
  mb: 1,
  ml: 0.5,
  display: "block",
  color: "#1b2559",
  fontWeight: 800,
};

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    city: "",
    society: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    walletBalance: "0",
    userRewards: "0",
    isVerified: true,
    status: "Active",
    registrationDate: "",
  });

  const showMsg = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  useEffect(() => {
    const fetchEditData = async () => {
      setLoading(true);
      try {
        const [userRes, cityRes, areaRes] = await Promise.all([
          getUser(id),
          genericApi.getAll("cities"),
          genericApi.getAll("area"),
        ]);

        const user = userRes.data?.data || {};
        const cityRows = cityRes.data?.results || cityRes.data?.data || cityRes.data || [];
        const areaRows = areaRes.data?.results || areaRes.data?.data || areaRes.data || [];

        setCities(cityRows.map((item) => item["City Name"] || item.name || item.Name || "").filter(Boolean));
        setAreas(areaRows);
        setFormData({
          city: user.City || "",
          society: user.Society || user.Location || "",
          name: user["User Name"] || "",
          email: user["User Email"] || "",
          phone: user["User Phone"] || "",
          password: "",
          walletBalance: String(user["Wallet Balance"] ?? 0),
          userRewards: String(user["User Rewards"] ?? 0),
          isVerified: Boolean(user["Is Verified"]),
          status: user.status || user.Status || "Active",
          registrationDate: user["Registration Date"] || "",
        });
      } catch (error) {
        console.error("Error loading user:", error);
        showMsg("Failed to load user details.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchEditData();
  }, [id]);

  const societyOptions = useMemo(() => {
    const selectedCity = formData.city.trim().toLowerCase();
    if (!selectedCity) return [];

    return areas
      .filter((area) => (area["City Name"] || area.city || "").trim().toLowerCase() === selectedCity)
      .map((area) => area["Society Name"] || area.name || area.area || "")
      .filter(Boolean);
  }, [areas, formData.city]);

  const setField = (key) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "city" ? { society: "" } : {}),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      showMsg("User name and phone are required.", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        "User Name": formData.name.trim(),
        "User Email": formData.email.trim(),
        "User Phone": formData.phone.trim(),
        City: formData.city,
        Society: formData.society,
        Location: formData.society,
        "Wallet Balance": Number(formData.walletBalance || 0),
        "User Rewards": Number(formData.userRewards || 0),
        "Is Verified": Boolean(formData.isVerified),
        status: formData.status,
      };

      if (formData.password.trim()) {
        payload["User Password"] = formData.password.trim();
      }

      await updateUser(id, payload);
      showMsg("User details updated successfully.");
      setTimeout(() => navigate("/user-data"), 900);
    } catch (error) {
      console.error("Error updating user:", error);
      showMsg("Failed to update user details.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 3 }}>
        <Tooltip title="Back to App Users">
          <IconButton
            onClick={() => navigate("/user-data")}
            sx={{ backgroundColor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: "14px", p: 1.5 }}
          >
            <ArrowBackIcon sx={{ color: "#4318ff" }} />
          </IconButton>
        </Tooltip>
        <Box>
          <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
            Edit User
          </Typography>
          <Typography variant="body2" color="#a3aed0" fontWeight="600">
            Update app user details, balance, rewards, and verification status.
          </Typography>
        </Box>
      </Box>

      <Paper
        sx={{
          p: 5,
          borderRadius: "28px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
          border: "1px solid #e0e5f2",
          maxWidth: 1100,
          mx: "auto",
          bgcolor: "#fff",
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h6" fontWeight="800" color="#1b2559">
              App Users
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
              Registration Date:{" "}
              {formData.registrationDate
                ? new Date(formData.registrationDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "N/A"}
            </Typography>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={formData.isVerified}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, isVerified: event.target.checked }))
                }
                color="primary"
              />
            }
            label={formData.isVerified ? "Verified" : "Unverified"}
            labelPlacement="start"
            sx={{ m: 0, "& .MuiTypography-root": { fontWeight: 800, color: formData.isVerified ? "#4318ff" : "#a3aed0" } }}
          />
        </Stack>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" sx={labelSx}>CITY</Typography>
            <TextField
              select
              fullWidth
              value={formData.city}
              onChange={setField("city")}
              sx={fieldSx}
            >
              <MenuItem value="">Select City</MenuItem>
              {formData.city && !cities.includes(formData.city) && (
                <MenuItem value={formData.city}>{formData.city}</MenuItem>
              )}
              {cities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="caption" sx={labelSx}>SOCIETY</Typography>
            <TextField
              select
              fullWidth
              value={formData.society}
              onChange={setField("society")}
              sx={fieldSx}
            >
              <MenuItem value="">Select Society</MenuItem>
              {formData.society && !societyOptions.includes(formData.society) && (
                <MenuItem value={formData.society}>{formData.society}</MenuItem>
              )}
              {societyOptions.map((society) => (
                <MenuItem key={society} value={society}>
                  {society}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="caption" sx={labelSx}>USER NAME</Typography>
            <TextField fullWidth value={formData.name} onChange={setField("name")} sx={fieldSx} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="caption" sx={labelSx}>USER EMAIL</Typography>
            <TextField fullWidth type="email" value={formData.email} onChange={setField("email")} sx={fieldSx} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="caption" sx={labelSx}>USER PHONE</Typography>
            <TextField fullWidth value={formData.phone} onChange={setField("phone")} sx={fieldSx} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="caption" sx={labelSx}>USER PASSWORD</Typography>
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              placeholder="Enter New Password If you want to change"
              value={formData.password}
              onChange={setField("password")}
              sx={fieldSx}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="caption" sx={labelSx}>WALLET BALANCE</Typography>
            <TextField
              fullWidth
              type="number"
              value={formData.walletBalance}
              onChange={setField("walletBalance")}
              sx={fieldSx}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="caption" sx={labelSx}>USER REWARDS</Typography>
            <TextField
              fullWidth
              type="number"
              value={formData.userRewards}
              onChange={setField("userRewards")}
              sx={fieldSx}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="caption" sx={labelSx}>STATUS</Typography>
            <TextField
              select
              fullWidth
              value={formData.status}
              onChange={setField("status")}
              sx={fieldSx}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Blocked">Blocked</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, opacity: 0.1 }} />

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <EditNoteIcon />}
            onClick={handleSubmit}
            disabled={saving}
            sx={{
              backgroundColor: "#4318ff",
              "&:hover": { backgroundColor: "#3311cc" },
              borderRadius: "18px",
              px: 6,
              py: 1.7,
              fontWeight: "800",
              textTransform: "none",
              boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)",
            }}
          >
            {saving ? "Saving User..." : "Submit"}
          </Button>
          <Button
            variant="text"
            onClick={() => navigate("/user-data")}
            sx={{ textTransform: "none", fontWeight: 800, color: "#1b2559" }}
          >
            Close
          </Button>
        </Stack>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%", borderRadius: "14px" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditUser;

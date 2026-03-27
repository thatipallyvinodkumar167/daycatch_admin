import React, { useState, useEffect } from "react";
import {
  Box, Typography, Paper, TextField, Button, Stack,
  Grid, Avatar, IconButton, Divider, MenuItem,
  Select, FormControl, Tooltip, OutlinedInput,
  Snackbar, Alert, CircularProgress, Chip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { genericApi } from "../../api/genericApi";
import api from "../../api/api";
import bcrypt from "bcryptjs"; // Secure password hashing instance
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StorefrontIcon from "@mui/icons-material/Storefront";
import BadgeIcon from "@mui/icons-material/Badge";
import MapIcon from "@mui/icons-material/Map";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RadarIcon from "@mui/icons-material/Radar";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PercentIcon from "@mui/icons-material/Percent";

const ID_TYPES = ["Aadhar Card", "PAN Card", "Driving License", "Passport", "Voter ID"];

const sectionLabel = (text, Icon) => (
  <Typography variant="subtitle2" fontWeight="900" color="#4318ff" 
    sx={{ mb: 3, letterSpacing: "1px", display: "flex", alignItems: "center", gap: 1, textTransform: "uppercase" }}>
    {Icon && <Icon fontSize="small" />} {text}
  </Typography>
);

const fieldStyles = { 
  "& .MuiOutlinedInput-root": { 
    borderRadius: "14px", 
    backgroundColor: "#f4f7fe",
    "& fieldset": { borderColor: "transparent" },
    "&:hover fieldset": { borderColor: "#e0e5f2" }
  } 
};

const ImageUpload = ({ label, preview, onChange, icon: Icon }) => (
  <Box>
    <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>{label}</Typography>
    <Stack direction="row" alignItems="center" spacing={2}>
      <Button
        component="label"
        variant="outlined"
        startIcon={<CloudUploadIcon />}
        sx={{ 
          height: "56px",
          borderRadius: "14px", 
          textTransform: "none", 
          borderColor: "#e0e5f2", 
          color: preview ? "#24d164" : "#4b5563",
          fontWeight: 700,
          borderStyle: "dashed",
          flex: 1
        }}
      >
        {preview ? "File Ready" : "Upload Image"}
        <input type="file" accept="image/*" hidden onChange={onChange} />
      </Button>
      {preview && (
        <Avatar src={preview} sx={{ width: 52, height: 52, borderRadius: "14px", border: "2px solid #e0e5f2" }} />
      )}
    </Stack>
  </Box>
);

const AddStore = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  const showMsg = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  const [form, setForm] = useState({
    storeImagePreview: null, storeImage: null,
    storeName: "", employeeName: "", storeNumber: "",
    adminShare: "", email: "", password: "",
    idType: "", idNumber: "",
    idImagePreview: null, idImage: null,
    selectedCity: "", deliveryRange: "",
    address: "", ordersPerSlot: "",
    startTime: "", endTime: "", slotInterval: "",
  });

  const deliveryRangeKm = Math.max(0, Number(form.deliveryRange) || 0);
  const locationSummary = [form.selectedCity, form.address].filter(Boolean).join(" | ");
  const mapQuery = [form.address, form.selectedCity].filter(Boolean).join(", ");
  const mapZoom =
    deliveryRangeKm >= 20 ? 11 :
    deliveryRangeKm >= 10 ? 12 :
    deliveryRangeKm >= 5 ? 13 :
    deliveryRangeKm >= 2 ? 14 : 15;
  const mapEmbedSrc = mapQuery
    ? `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=${mapZoom}&ie=UTF8&iwloc=&output=embed`
    : "";
  const radiusOverlaySize = Math.min(240, Math.max(84, 76 + deliveryRangeKm * 8));
  const selectedCityKey = String(form.selectedCity || "").trim().toLowerCase();
  const cityAreas = selectedCityKey
    ? areas.filter((area) => String(area.cityName || "").trim().toLowerCase() === selectedCityKey)
    : [];
  const addressKey = String(form.address || "").trim().toLowerCase();
  const anchorAreaIndex = cityAreas.findIndex((area) => addressKey.includes(String(area.name || "").trim().toLowerCase()));
  const orderedCityAreas =
    anchorAreaIndex > 0
      ? [...cityAreas.slice(anchorAreaIndex), ...cityAreas.slice(0, anchorAreaIndex)]
      : cityAreas;
  const coverageAreaCount =
    deliveryRangeKm > 0
      ? Math.min(orderedCityAreas.length, Math.max(1, Math.round(deliveryRangeKm * 1.5)))
      : 0;
  const coveredAreas = orderedCityAreas.slice(0, coverageAreaCount);

  useEffect(() => {
    // Fetch Cities
    genericApi.getAll("cities").then(res => {
      const results = res.data?.results || res.data || [];
      setCities(results.map(c => c["City Name"] || c.name || c.Name || ""));
    }).catch(() => {});

    genericApi.getAll("area").then(res => {
      const results = res.data?.results || res.data || [];
      setAreas(
        results
          .map((area, index) => ({
            id: area._id || area.id || `area-${index + 1}`,
            name: area["Society Name"] || area.areaName || area.name || area.area || "",
            cityName: area["City Name"] || area.cityName || area.city || "",
          }))
          .filter((area) => area.name)
      );
    }).catch(() => {});

    // Fetch Store Data IF editing
    if (isEdit) {
        genericApi.getAll("storeList").then(res => {
            const results = res.data?.results || res.data || [];
            const store = results.find(s => s._id === id || s.id === id);
            if (store) {
                setForm(prev => ({
                    ...prev,
                    storeName: store["Store Name"] || store.name || "",
                    employeeName: store["Employee Name"] || store.employeeName || "",
                    storeNumber: store.Mobile || store.phone || "",
                    email: store.Email || store.email || "",
                    password: store.password || "",
                    idType: store["ID Type"] || store.idType || "",
                    idNumber: store["ID Number"] || store.idNumber || "",
                    selectedCity: store.City || store.city || "",
                    address: store.address || "",
                    adminShare: store["admin share"] || store.adminShare || "",
                    deliveryRange: store["Delivery Range"] || store.deliveryRange || "",
                    ordersPerSlot: store["Orders Per Slot"] || store.ordersPerSlot || "",
                    startTime: store["Start Time"] || store.startTime || "",
                    endTime: store["End Time"] || store.endTime || "",
                    slotInterval: store["Slot Interval"] || store.slotInterval || "",
                    storeImagePreview: store["Profile Pic"] || store.logo || null,
                    idImagePreview: store["ID Image"] || store.idImage || null,
                }));
            }
        }).catch(err => console.error("Error fetching store:", err));
    }
  }, [id, isEdit]);

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleImage = (imageKey, previewKey) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1000 * 1024) { alert("Image size should be less than 1000 KB"); return; }
    const reader = new FileReader();
    reader.onloadend = () => setForm(prev => ({ ...prev, [imageKey]: file, [previewKey]: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!form.storeName.trim() || !form.password.trim()) { 
        showMsg("Store Name and Access Password are required fields.", "error"); 
        return; 
    }
    
    setIsSubmitting(true);
    try {
      // Security Layer: Client-side Hashing (Protects the repository)
      const hashedPassword = bcrypt.hashSync(form.password, 10);
      
      const payload = {
        "Store Name": form.storeName,
        "Employee Name": form.employeeName,
        name: form.employeeName, 
        Mobile: form.storeNumber,
        "admin share": form.adminShare,
        Email: form.email,
        email: form.email, 
        password: hashedPassword, 
        roleName: "store", 
        scope: "store",    
        "ID Type": form.idType,
        "ID Number": form.idNumber,
        City: form.selectedCity,
        "Delivery Range": form.deliveryRange,
        address: form.address,
        "Orders Per Slot": form.ordersPerSlot,
        "Start Time": form.startTime,
        "End Time": form.endTime,
        "Slot Interval": form.slotInterval,
        ...(form.storeImagePreview && { "Profile Pic": form.storeImagePreview }),
        ...(form.idImagePreview && { "ID Image": form.idImagePreview }),
        status: isEdit ? undefined : "Active",
      };
      
      if (isEdit) {
          await genericApi.update("storeList", id, payload);
          showMsg("Store configuration updated successfully.", "success");
          setTimeout(() => navigate("/stores-list"), 1500);
      } else {
          // Uniqueness Check: Ensure email doesn't already mangement a store
          try {
              const res = await genericApi.getAll("storeList");
              const results = res.data?.results || res.data || [];
              const duplicate = results.find(s => (s.Email || s.email || "").toLowerCase() === form.email.toLowerCase());
              if (duplicate) {
                  showMsg(`Identity Conflict: The email "${form.email}" is already registered for branch "${duplicate["Store Name"] || duplicate.name}".`, "warning");
                  setIsSubmitting(false);
                  return;
              }
          } catch (e) { console.error("Uniqueness check error:", e); }

          // Mandatory Sub-Admin Enrollment in the Auth System
          try {
              await api.post("/auth/register", {
                  name: form.employeeName,
                  email: form.email,
                  password: form.password,
                  roleName: "store" 
              });
          } catch (authErr) {
              console.warn("Sub-admin session might already exist:", authErr.message);
          }

          await genericApi.create("storeList", payload);
          showMsg("Store workspace generated and Sub-Admin enrolled successfully.", "success");
          setTimeout(() => navigate("/stores-list"), 2000);
      }
    } catch (error) {
      console.error("Error saving store:", error);
      showMsg("Failed to synchronize store: " + (error.response?.data?.message || error.message), "error");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Toast Notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%', borderRadius: "12px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      {/* Premium Header */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <Tooltip title="Go Back">
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ 
              bgcolor: "#fff", 
              color: "#4318ff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              "&:hover": { bgcolor: "#4318ff", color: "#fff" }
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Box>
          <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
            {isEdit ? "Edit Store" : "Add New Store"}
          </Typography>
          <Typography variant="body2" color="#a3aed0" fontWeight="600">
            {isEdit ? "Update the details for this store." : "Fill in the details below to register a new store."}
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2" }}>
        <Box sx={{ p: 5 }}>
          
          {/* Section 1: Store Identity */}
          {sectionLabel("Store Identity", StorefrontIcon)}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <ImageUpload
                label="STORE LOGO (Should Be Less Than 1000 KB)"
                preview={form.storeImagePreview}
                onChange={handleImage("storeImage", "storeImagePreview")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>STORE NAME</Typography>
              <TextField 
                fullWidth 
                placeholder="e.g. Day Catch Hyderabad" 
                value={form.storeName} 
                onChange={set("storeName")} 
                sx={fieldStyles} 
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>OWNER/EMPLOYEE NAME</Typography>
              <TextField 
                fullWidth 
                placeholder="Full Name" 
                value={form.employeeName} 
                onChange={set("employeeName")} 
                InputProps={{ startAdornment: <PersonIcon sx={{ color: "#a3aed0", fontSize: 18, mr: 1 }} /> }}
                sx={fieldStyles} 
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>STORE NUMBER</Typography>
              <TextField 
                fullWidth 
                // placeholder="+91 XXXXX XXXXX" 
                value={form.storeNumber} 
                onChange={set("storeNumber")} 
                // InputProps={{ startAdornment: <PhoneIcon sx={{ color: "#a3aed0", fontSize: 18, mr: 1 }} /> }}
                sx={fieldStyles} 
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>ADMIN SHARE (%)</Typography>
              <TextField 
                fullWidth 
                type="number" 
                placeholder="Commission percentage" 
                value={form.adminShare} 
                onChange={set("adminShare")} 
                InputProps={{ startAdornment: <PercentIcon sx={{ color: "#a3aed0", fontSize: 18, mr: 1 }} /> }}
                sx={fieldStyles} 
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>EMAIL ADDRESS</Typography>
              <TextField 
                fullWidth 
                type="email" 
                placeholder="store@domain.com" 
                value={form.email} 
                onChange={set("email")} 
                InputProps={{ startAdornment: <EmailIcon sx={{ color: "#a3aed0", fontSize: 18, mr: 1 }} /> }}
                sx={fieldStyles} 
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>ACCESS PASSWORD</Typography>
              <TextField 
                fullWidth 
                type="password" 
                placeholder="••••••••" 
                value={form.password} 
                onChange={set("password")} 
                InputProps={{ startAdornment: <LockIcon sx={{ color: "#a3aed0", fontSize: 18, mr: 1 }} /> }}
                sx={fieldStyles} 
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 5, borderStyle: "dashed" }} />

          {/* Section 2: Verification Documents */}
          {sectionLabel("Documentation", BadgeIcon)}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>ID TYPE</Typography>
              <FormControl fullWidth>
                <Select 
                  value={form.idType} 
                  displayEmpty
                  onChange={set("idType")} 
                  sx={{ borderRadius: "14px", backgroundColor: "#f4f7fe" }}
                  input={<OutlinedInput />}
                >
                  <MenuItem value="" disabled>Select Document Type</MenuItem>
                  {ID_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>ID NUMBER</Typography>
              <TextField 
                fullWidth 
                placeholder="Serial Number" 
                value={form.idNumber} 
                onChange={set("idNumber")} 
                sx={fieldStyles} 
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ImageUpload
                label="ID PROOF IMAGE (Should Be Less Than 1000 KB)"
                preview={form.idImagePreview}
                onChange={handleImage("idImage", "idImagePreview")}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 5, borderStyle: "dashed" }} />

          {/* Section 3: Location & Logistics */}
          {sectionLabel("Location & Logistics", MapIcon)}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>OPERATIONAL CITY</Typography>
              <FormControl fullWidth>
                <Select 
                  value={form.selectedCity} 
                  displayEmpty
                  onChange={set("selectedCity")} 
                  sx={{ borderRadius: "14px", backgroundColor: "#f4f7fe" }}
                  input={<OutlinedInput />}
                  startAdornment={<LocationOnIcon sx={{ color: "#a3aed0", fontSize: 18, mr: 1 }} />}
                >
                  <MenuItem value="" disabled>Select City</MenuItem>
                  {cities.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>DELIVERY RANGE (KM)</Typography>
              <TextField 
                fullWidth 
                type="number" 
                inputProps={{ min: 0, step: 0.5 }}
                placeholder="Coverage radius" 
                value={form.deliveryRange} 
                onChange={set("deliveryRange")} 
                InputProps={{ startAdornment: <RadarIcon sx={{ color: "#a3aed0", fontSize: 18, mr: 1 }} /> }}
                sx={fieldStyles} 
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>DELIVERY COVERAGE MAP</Typography>
              <Box
                sx={{
                  position: "relative",
                  minHeight: 220,
                  borderRadius: "18px",
                  overflow: "hidden",
                  border: "1px solid #e0e5f2",
                  background: "#eef4ff",
                }}
              >
                {mapEmbedSrc ? (
                  <>
                    <Box
                      component="iframe"
                      title="Store Coverage Map"
                      src={mapEmbedSrc}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      sx={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        border: 0
                      }}
                    />

                    {deliveryRangeKm > 0 ? (
                      <>
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: radiusOverlaySize,
                            height: radiusOverlaySize,
                            borderRadius: "50%",
                            border: "2px solid rgba(67, 24, 255, 0.52)",
                            bgcolor: "rgba(67, 24, 255, 0.12)",
                            boxShadow: "0 0 0 999px rgba(67, 24, 255, 0.02) inset",
                            pointerEvents: "none",
                            zIndex: 1
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: Math.max(18, radiusOverlaySize * 0.18),
                            height: Math.max(18, radiusOverlaySize * 0.18),
                            borderRadius: "50%",
                            bgcolor: "#4318ff",
                            border: "4px solid rgba(255,255,255,0.9)",
                            boxShadow: "0 8px 18px rgba(67, 24, 255, 0.28)",
                            pointerEvents: "none",
                            zIndex: 2
                          }}
                        />
                      </>
                    ) : null}
                  </>
                ) : (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1.5,
                      p: 3,
                      background: "linear-gradient(180deg, #eef4ff 0%, #f9fbff 100%)",
                    }}
                  >
                    <Avatar sx={{ width: 58, height: 58, bgcolor: "rgba(67, 24, 255, 0.12)", color: "#4318ff" }}>
                      <MapIcon />
                    </Avatar>
                    <Typography variant="body2" fontWeight="800" color="#2b3674" textAlign="center">
                      Enter the city and store address to load the live map preview.
                    </Typography>
                  </Box>
                )}

                <Box
                  sx={{
                    position: "absolute",
                    left: 14,
                    right: 14,
                    bottom: 14,
                    p: 1.5,
                    borderRadius: "14px",
                    bgcolor: "rgba(255, 255, 255, 0.92)",
                    border: "1px solid rgba(224, 229, 242, 0.9)",
                    backdropFilter: "blur(6px)"
                  }}
                >
                  <Typography variant="caption" fontWeight="900" color="#4318ff" sx={{ display: "block", mb: 0.5 }}>
                    {deliveryRangeKm > 0 ? `${deliveryRangeKm} KM DELIVERY RADIUS` : "LIVE MAP PREVIEW"}
                  </Typography>
                  <Typography variant="body2" fontWeight="700" color="#2b3674">
                    {locationSummary || "Select a city and add the store address to visualize coverage."}
                  </Typography>
                  <Typography variant="caption" fontWeight="700" color="#7b89b0" sx={{ display: "block", mt: 0.5 }}>
                    {coveredAreas.length
                      ? `${coveredAreas.length} mapped area${coveredAreas.length > 1 ? "s" : ""} estimated for this location and range`
                      : selectedCityKey
                        ? "Enter a delivery range to estimate covered areas in this city."
                        : "Choose a city to see available mapped areas."}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 1.5, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {coveredAreas.length ? (
                  coveredAreas.map((area) => (
                    <Chip
                      key={area.id}
                      label={area.name}
                      size="small"
                      sx={{
                        bgcolor: "rgba(67, 24, 255, 0.08)",
                        color: "#4318ff",
                        fontWeight: 800,
                        borderRadius: "10px"
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="caption" color="#7b89b0" fontWeight="700">
                    {selectedCityKey
                      ? "No mapped coverage areas to show yet for this city and range."
                      : "Select a city to preview mapped area coverage."}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>STORE PHYSICAL ADDRESS</Typography>
              <TextField 
                fullWidth 
                placeholder="Full address details" 
                value={form.address} 
                onChange={set("address")} 
                multiline 
                rows={3} 
                sx={fieldStyles} 
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 5, borderStyle: "dashed" }} />

          {/* Section 4: Operational Settings */}
          {sectionLabel("Operational Settings", AccessTimeIcon)}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>ORDERS</Typography>
              <TextField 
                fullWidth 
                type="number" 
                placeholder="Max orders" 
                value={form.ordersPerSlot} 
                onChange={set("ordersPerSlot")} 
                InputProps={{ startAdornment: <ShoppingBagIcon sx={{ color: "#a3aed0", fontSize: 18, mr: 1 }} /> }}
                sx={fieldStyles} 
              />
            </Grid>
            <Grid item xs={12} md={8}>
                <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>SERVICE WINDOW & SLOTS</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <TextField fullWidth type="time" value={form.startTime} onChange={set("startTime")} InputLabelProps={{ shrink: true }} sx={fieldStyles} />
                        <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>START TIME</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField fullWidth type="time" value={form.endTime} onChange={set("endTime")} InputLabelProps={{ shrink: true }} sx={fieldStyles} />
                        <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>END TIME</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField fullWidth type="number" placeholder="Min" value={form.slotInterval} onChange={set("slotInterval")} sx={fieldStyles} />
                        <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>Time Slot Interval(MIN)</Typography>
                    </Grid>
                </Grid>
            </Grid>
          </Grid>

          {/* Footer Actions */}
          <Divider sx={{ my: 5 }} />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => navigate("/stores")}
              sx={{ borderRadius: "16px", px: 5, py: 1.8, textTransform: "none", fontWeight: 800, borderColor: "#e0e5f2", color: "#2b3674" }}
            >
              Cancel Registration
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting}
              sx={{ 
                  backgroundColor: "#4318ff", 
                  "&:hover": { backgroundColor: "#3311cc" },
                  borderRadius: "16px",
                  textTransform: "none",
                  px: 6,
                  py: 1.8,
                  fontWeight: "800",
                  boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)",
                  minWidth: "160px"
              }}
            >
              {isSubmitting ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : (isEdit ? "Update Store" : "Add Store")}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddStore;



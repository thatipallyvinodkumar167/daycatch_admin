import React, { useState, useEffect } from "react";
import {
  Box, Typography, Paper, TextField, Button, Stack,
  Grid, Avatar, IconButton, Divider, MenuItem,
  Select, FormControl, Tooltip, OutlinedInput,
  Snackbar, Alert, CircularProgress, Chip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { genericApi } from "../../api/genericApi";
import { subAdminApi } from "../../api/subAdminApi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StorefrontIcon from "@mui/icons-material/Storefront";
import BadgeIcon from "@mui/icons-material/Badge";
import MapIcon from "@mui/icons-material/Map";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RadarIcon from "@mui/icons-material/Radar";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PercentIcon from "@mui/icons-material/Percent";

const ID_TYPES = ["Aadhar Card", "PAN Card", "Driving License", "Passport", "Voter ID"];
const normalizeEmail = (value = "") => String(value || "").trim().toLowerCase();

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
  const [linkedSubAdmin, setLinkedSubAdmin] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [showPassword, setShowPassword] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoCoords, setGeoCoords] = useState(null);
  const [geoCityCandidate, setGeoCityCandidate] = useState("");
  const [geoAreaCandidate, setGeoAreaCandidate] = useState("");
  const [geoAddressCandidate, setGeoAddressCandidate] = useState("");
  
  const showMsg = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  const findCityMatch = (candidate, cityList) => {
    const needle = String(candidate || "").trim().toLowerCase();
    if (!needle) return "";
    const exact = cityList.find((c) => String(c || "").trim().toLowerCase() === needle);
    if (exact) return exact;
    const partial = cityList.find(
      (c) =>
        String(c || "").trim().toLowerCase().includes(needle) ||
        needle.includes(String(c || "").trim().toLowerCase())
    );
    return partial || "";
  };

  const findCityFromAddress = (addressText, cityList) => {
    const hay = String(addressText || "").trim().toLowerCase();
    if (!hay) return "";
    const match = cityList.find((c) => hay.includes(String(c || "").trim().toLowerCase()));
    return match || "";
  };

  const findAreaMatch = (candidate, cityValue, areaList) => {
    const needle = String(candidate || "").trim().toLowerCase();
    if (!needle) return "";
    const cityKey = String(cityValue || "").trim().toLowerCase();
    const scopedAreas = cityKey
      ? areaList.filter((area) => String(area.cityName || "").trim().toLowerCase() === cityKey)
      : areaList;
    const exact = scopedAreas.find((area) => String(area.name || "").trim().toLowerCase() === needle);
    if (exact?.name) return exact.name;
    const contains = scopedAreas.find(
      (area) =>
        String(area.name || "").trim().toLowerCase().includes(needle) ||
        needle.includes(String(area.name || "").trim().toLowerCase())
    );
    return contains?.name || "";
  };

  const findAreaFromAddress = (addressText, cityValue, areaList) => {
    const hay = String(addressText || "").trim().toLowerCase();
    if (!hay) return "";
    const cityKey = String(cityValue || "").trim().toLowerCase();
    const scopedAreas = cityKey
      ? areaList.filter((area) => String(area.cityName || "").trim().toLowerCase() === cityKey)
      : areaList;
    const match = scopedAreas.find((area) =>
      hay.includes(String(area.name || "").trim().toLowerCase())
    );
    return match?.name || "";
  };

  const [form, setForm] = useState({
    storeImagePreview: null, storeImage: null,
    storeName: "", employeeName: "", storeNumber: "",
    adminShare: "", email: "", password: "",
    idType: "", idNumber: "",
    idImagePreview: null, idImage: null,
    selectedCity: "", selectedArea: "", deliveryRange: "",
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
  const mapEmbedSrc = geoCoords
    ? `https://maps.google.com/maps?q=${geoCoords.lat},${geoCoords.lng}&t=&z=${Math.max(14, mapZoom)}&ie=UTF8&iwloc=&output=embed`
    : mapQuery
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
    if (!geoCityCandidate || form.selectedCity) return;
    const matchedCity =
      findCityMatch(geoCityCandidate, cities) ||
      findCityFromAddress(geoAddressCandidate, cities) ||
      "";
    if (matchedCity) {
      setForm((prev) => ({ ...prev, selectedCity: matchedCity }));
    }
  }, [geoCityCandidate, geoAddressCandidate, cities, form.selectedCity]);

  useEffect(() => {
    if (!geoAreaCandidate || form.selectedArea) return;
    const cityValue =
      form.selectedCity ||
      findCityMatch(geoCityCandidate, cities) ||
      findCityFromAddress(geoAddressCandidate, cities) ||
      "";
    const matchedArea =
      findAreaMatch(geoAreaCandidate, cityValue, areas) ||
      findAreaMatch(geoAreaCandidate, "", areas) ||
      findAreaFromAddress(geoAddressCandidate, cityValue, areas) ||
      findAreaFromAddress(geoAddressCandidate, "", areas) ||
      "";
    if (matchedArea) {
      setForm((prev) => ({ ...prev, selectedArea: matchedArea }));
    }
  }, [geoAreaCandidate, geoAddressCandidate, geoCityCandidate, areas, cities, form.selectedCity, form.selectedArea]);

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
        Promise.allSettled([genericApi.getAll("storeList"), subAdminApi.getAll()])
          .then(([storeResult, subAdminResult]) => {
            if (storeResult.status !== "fulfilled") {
              throw storeResult.reason;
            }

            const stores = storeResult.value.data?.results || storeResult.value.data || [];
            const store = stores.find((item) => item._id === id || item.id === id);
            if (!store) return;

            const subAdmins =
              subAdminResult.status === "fulfilled"
                ? subAdminResult.value?.data?.data || []
                : [];

            const storeEmail = normalizeEmail(store.Email || store.email);
            const matchedSubAdmin =
              subAdmins.find(
                (admin) =>
                  String(admin.storeId || "") === String(id) ||
                  normalizeEmail(admin.Email || admin.email) === storeEmail
              ) || null;

            setLinkedSubAdmin(matchedSubAdmin);
            setForm((prev) => ({
              ...prev,
              storeName: store["Store Name"] || store.name || "",
              employeeName: matchedSubAdmin?.Name || store["Employee Name"] || store.employeeName || "",
              storeNumber: matchedSubAdmin?.phone || store.Mobile || store.phone || "",
              email: matchedSubAdmin?.Email || store.Email || store.email || "",
              password: "",
              idType: store["ID Type"] || store.idType || "",
              idNumber: store["ID Number"] || store.idNumber || "",
              selectedCity: store.City || store.city || "",
              selectedArea: store.Area || store.area || "",
              address: store.address || "",
              adminShare: store["admin share"] || store.adminShare || "",
              deliveryRange: store["Delivery Range"] || store.deliveryRange || "",
              ordersPerSlot: store["Orders Per Slot"] || store.ordersPerSlot || "",
              startTime: store["Start Time"] || store.startTime || "",
              endTime: store["End Time"] || store.endTime || "",
              slotInterval: store["Slot Interval"] || store.slotInterval || "",
              storeImagePreview: store["Profile Pic"] || store.logo || matchedSubAdmin?.Image || null,
              idImagePreview: store["ID Image"] || store.idImage || null,
            }));
          })
          .catch((err) => console.error("Error fetching store:", err));
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

  const buildStorePayload = () => ({
    "Store Name": form.storeName,
    "Employee Name": form.employeeName,
    name: form.employeeName,
    Mobile: form.storeNumber,
    "admin share": form.adminShare,
    Email: form.email,
    email: form.email,
    "ID Type": form.idType,
    "ID Number": form.idNumber,
    City: form.selectedCity,
    Area: form.selectedArea,
    "Delivery Range": form.deliveryRange,
    address: form.address,
    "Orders Per Slot": form.ordersPerSlot,
    "Start Time": form.startTime,
    "End Time": form.endTime,
    "Slot Interval": form.slotInterval,
    ...(form.storeImagePreview && { "Profile Pic": form.storeImagePreview }),
    ...(form.idImagePreview && { "ID Image": form.idImagePreview }),
    status: isEdit ? undefined : "Active",
  });

  const buildStoreSubAdminPayload = (storeIdValue, options = {}) => {
    const includePassword = Boolean(options.includePassword && form.password.trim());

    return {
      Name: form.employeeName.trim() || form.storeName.trim(),
      Email: form.email.trim(),
      phone: form.storeNumber.trim(),
      "role Name": linkedSubAdmin?.["role Name"] || "Store Admin",
      scope: "store",
      storeId: storeIdValue,
      storeName: form.storeName.trim(),
      status: linkedSubAdmin?.status || "Active",
      Image: form.storeImagePreview || linkedSubAdmin?.Image || "",
      ...(includePassword ? { password: form.password } : {}),
    };
  };

  const handleSubmit = async () => {
    if (!form.storeName.trim() || !form.employeeName.trim() || !form.storeNumber.trim() || !form.email.trim()) {
        showMsg("Store name, owner name, phone number, and email are required fields.", "error");
        return;
    }

    if (!isEdit && !form.password.trim()) {
        showMsg("Access password is required while creating a store login.", "error");
        return;
    }

    if (isEdit && !linkedSubAdmin && !form.password.trim()) {
        showMsg("This store has no linked sub-admin login yet. Enter a password to create one.", "warning");
        return;
    }
    
    setIsSubmitting(true);
    try {
      const payload = buildStorePayload();

      try {
          const res = await genericApi.getAll("storeList");
          const results = res.data?.results || res.data || [];
          const duplicate = results.find(
            (store) =>
              normalizeEmail(store.Email || store.email) === normalizeEmail(form.email) &&
              String(store._id || store.id || "") !== String(id || "")
          );

          if (duplicate) {
              showMsg(`Identity Conflict: The email "${form.email}" is already registered for branch "${duplicate["Store Name"] || duplicate.name}".`, "warning");
              setIsSubmitting(false);
              return;
          }
      } catch (lookupError) {
          console.error("Uniqueness check error:", lookupError);
      }
      
      if (isEdit) {
          await genericApi.update("storeList", id, payload);

          if (linkedSubAdmin?._id) {
              await subAdminApi.update(
                linkedSubAdmin._id,
                buildStoreSubAdminPayload(id, { includePassword: Boolean(form.password.trim()) })
              );
          } else {
              const createdSubAdminResponse = await subAdminApi.create(
                buildStoreSubAdminPayload(id, { includePassword: true })
              );
              setLinkedSubAdmin(createdSubAdminResponse?.data?.data || null);
          }

          showMsg("Store configuration updated successfully.", "success");
          setTimeout(() => navigate("/stores-list"), 1500);
      } else {
          let createdStoreId = "";

          try {
              const storeResponse = await genericApi.create("storeList", payload);
              createdStoreId = storeResponse?.data?._id || storeResponse?.data?.id || "";

              if (!createdStoreId) {
                  throw new Error("Store created, but the backend did not return a store identifier.");
              }

              await subAdminApi.create(buildStoreSubAdminPayload(createdStoreId, { includePassword: true }));
          } catch (creationError) {
              if (createdStoreId) {
                  try {
                      await genericApi.remove("storeList", createdStoreId);
                  } catch (rollbackError) {
                      console.error("Store rollback failed:", rollbackError);
                  }
              }

              throw creationError;
          }

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

  const handleUseLiveLocation = () => {
    if (!navigator.geolocation) {
      showMsg("Geolocation is not supported by this browser.", "error");
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords || {};
        if (typeof latitude === "number" && typeof longitude === "number") {
          const coords = { lat: Number(latitude.toFixed(6)), lng: Number(longitude.toFixed(6)) };
          setGeoCoords(coords);

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}&zoom=10&addressdetails=1`,
              { headers: { "Accept-Language": "en" } }
            );
            const data = await response.json();
            const address = data?.address || {};
            const cityCandidate =
              address.city || address.town || address.village || address.state_district || address.state || "";
            const areaCandidate =
              address.suburb || address.neighbourhood || address.quarter || address.county || "";
            const displayAddress = data?.display_name || "";

            setGeoCityCandidate(cityCandidate || "");
            setGeoAreaCandidate(areaCandidate || "");
            setGeoAddressCandidate(displayAddress || "");

            const matchedCity =
              findCityMatch(cityCandidate, cities) ||
              findCityFromAddress(displayAddress, cities) ||
              "";
            const matchedArea =
              findAreaMatch(areaCandidate, matchedCity, areas) ||
              findAreaMatch(areaCandidate, "", areas) ||
              findAreaFromAddress(displayAddress, matchedCity, areas) ||
              findAreaFromAddress(displayAddress, "", areas) ||
              "";

            setForm((prev) => ({
              ...prev,
              selectedCity: matchedCity || prev.selectedCity,
              selectedArea: matchedArea || prev.selectedArea,
              address: displayAddress || prev.address,
            }));

            showMsg("Live location captured. City and area updated from GPS.", "success");
          } catch (err) {
            console.error("Reverse geocoding failed:", err);
            showMsg("Live location captured. Map centered to your current position.", "success");
          }
        } else {
          showMsg("Unable to read live location coordinates.", "error");
        }
        setGeoLoading(false);
      },
      (error) => {
        const message =
          error?.code === 1
            ? "Location permission denied. Please allow access and try again."
            : error?.code === 2
              ? "Location unavailable. Try again in a moment."
              : "Unable to fetch live location.";
        showMsg(message, "error");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 10000 }
    );
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
            <Grid item xs={12} md={8} sx={{ mx: "auto" }}>
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
              <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>
                {isEdit ? "ACCESS PASSWORD (OPTIONAL ON EDIT)" : "ACCESS PASSWORD"}
              </Typography>
              <TextField 
                fullWidth 
                type={showPassword ? "text" : "password"}
                placeholder={isEdit ? "Leave blank to keep current password" : "Enter a secure password"} 
                value={form.password} 
                onChange={set("password")} 
                InputProps={{ 
                  startAdornment: <LockIcon sx={{ color: "#a3aed0", fontSize: 18, mr: 1 }} />,
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "#a3aed0" }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  )
                }}
                sx={{
                  ...fieldStyles,
                  "& input::-ms-reveal": { display: "none" } // Hide Edge native reveal button
                }} 
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
              <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block"  }}>OPERATIONAL CITY</Typography>
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
            <Grid item xs={12} md={8} sx={{ml:18}}>
              <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 20, mb: 1, display: "block"}}>DELIVERY COVERAGE MAP</Typography>
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
                        border: 0,
                        
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
                            transform: "translate(-50%, -60%)",
                            pointerEvents: "none",
                            zIndex: 3
                          }}
                        >
                          <LocationOnIcon sx={{ color: "#e53935", fontSize: 22, filter: "drop-shadow(0 2px 6px rgba(229, 57, 53, 0.45))" }} />
                        </Box>
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
                    backdropFilter: "blur(6px)",
                    
                  }}
                >
                 
                  <Typography variant="body2" fontWeight="700" color="#2b3674" >
                    {geoCoords
                      ? `Live location: ${geoCoords.lat}, ${geoCoords.lng}`
                      : locationSummary || "Select a city and add the store address to visualize coverage."}
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
              <Box sx={{ mt: 1.5, display: "flex", gap: 1, alignItems: "center" }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleUseLiveLocation}
                  disabled={geoLoading}
                  sx={{
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 800,
                    borderColor: "rgba(229, 57, 53, 0.4)",
                    color: "#e53935",
                    "&:hover": { borderColor: "#e53935", bgcolor: "rgba(229, 57, 53, 0.08)" }
                  }}
                >
                  {geoLoading ? "Fetching Location..." : "Use Live Location"}
                </Button>
                {geoCoords ? (
                  <Typography variant="caption" fontWeight="700" color="#7b89b0">
                    Live location is active for the map preview.
                  </Typography>
                ) : null}
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

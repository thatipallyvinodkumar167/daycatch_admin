import React, { useState, useEffect } from "react";
import {
  Box, Typography, Paper, TextField, Button, Stack,
  Grid, Avatar, IconButton, Divider, MenuItem,
  Select, FormControl, Tooltip, OutlinedInput,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { genericApi } from "../../api/genericApi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StorefrontIcon from "@mui/icons-material/Storefront";
import BadgeIcon from "@mui/icons-material/Badge";
import MapIcon from "@mui/icons-material/Map";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
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

  useEffect(() => {
    // Fetch Cities
    genericApi.getAll("cities").then(res => {
      const results = res.data?.results || res.data || [];
      setCities(results.map(c => c["City Name"] || c.name || c.Name || ""));
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
    if (!form.storeName.trim()) { alert("Store Name is required."); return; }
    try {
      const payload = {
        "Store Name": form.storeName,
        "Employee Name": form.employeeName,
        Mobile: form.storeNumber,
        "admin share": form.adminShare,
        Email: form.email,
        password: form.password,
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
          alert("Store updated successfully!");
          navigate("/stores-list");
      } else {
          await genericApi.create("storeList", payload);
          alert("Store added successfully! The assigned sub-admin can log in now.");
          navigate("/stores-list");
      }
    } catch (error) {
      console.error("Error saving store:", error);
      alert("Failed to save store: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
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
              <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>MOBILE NUMBER</Typography>
              <TextField 
                fullWidth 
                placeholder="+91 XXXXX XXXXX" 
                value={form.storeNumber} 
                onChange={set("storeNumber")} 
                InputProps={{ startAdornment: <PhoneIcon sx={{ color: "#a3aed0", fontSize: 18, mr: 1 }} /> }}
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
                placeholder="Coverage radius" 
                value={form.deliveryRange} 
                onChange={set("deliveryRange")} 
                InputProps={{ startAdornment: <RadarIcon sx={{ color: "#a3aed0", fontSize: 18, mr: 1 }} /> }}
                sx={fieldStyles} 
              />
            </Grid>
            <Grid item xs={12} md={8}>
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
              <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>ORDERS PER SLOT</Typography>
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
                        <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>INTERVAL (MIN)</Typography>
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
              sx={{ 
                  backgroundColor: "#4318ff", 
                  "&:hover": { backgroundColor: "#3311cc" },
                  borderRadius: "16px",
                  textTransform: "none",
                  px: 6,
                  py: 1.8,
                  fontWeight: "800",
                  boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)",
              }}
            >
              {isEdit ? "Update Store" : "Add Store"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddStore;



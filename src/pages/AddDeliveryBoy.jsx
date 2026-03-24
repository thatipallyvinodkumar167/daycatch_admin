import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  MenuItem,
  FormControl,
  Select,
  Grid,
  Checkbox,
  ListItemText,
  OutlinedInput,
  IconButton,
  Tooltip,
  InputAdornment,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { addDeliveryBoy } from "../api/deliveryBoyApi";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import MapIcon from "@mui/icons-material/Map";
import BadgeIcon from "@mui/icons-material/Badge";
import HomeIcon from "@mui/icons-material/Home";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PublicIcon from "@mui/icons-material/Public";
import StarIcon from "@mui/icons-material/Star";
import {
  DELIVERY_BOY_ID_TYPES,
  DELIVERY_BOY_STATUS,
  normalizeDeliveryBoyIdType,
  normalizeDeliveryBoyStatus,
} from "../utils/deliveryBoyUtils";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      borderRadius: "16px",
      marginTop: "8px",
      boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
    },
  },
};

const AddDeliveryBoy = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    city: "",
    idType: "",
    idNumber: "",
    address: "",
    stores: [],
    status: DELIVERY_BOY_STATUS.ON_DUTY,
    earnings: 0,
    rating: 5.0,
  });
  const [idImage, setIdImage] = useState(null);
  const [idImageBase64, setIdImageBase64] = useState("");

  const cities = [
    { name: "Hyderabad", _id: "city_hyd_001" },
    { name: "Kurnool", _id: "city_kurn_002" }
  ];

  const storeList = [
    { name: "Hyderabad Store", _id: "store_hyd_101" },
    { name: "Vijayawada Store", _id: "store_vj_102" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStoreChange = (event) => {
    const { target: { value } } = event;
    
    if (value && value.includes("all")) {
        if (formData.stores && formData.stores.length === storeList.length) {
            setFormData({ ...formData, stores: [] });
        } else {
            setFormData({ ...formData, stores: storeList.map(s => s._id) });
        }
        return;
    }

    setFormData({
      ...formData,
      stores: typeof value === 'string' ? value.split(',') : (value || [])
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setIdImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setIdImageBase64("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.password.trim()) {
      alert("Required: Name, Phone and Auth Password are mandatory for enrollment.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        "Boy Name": formData.name,
        "Boy Phone": formData.phone,
        "Boy Password": formData.password,
        "Status": normalizeDeliveryBoyStatus(formData.status),
        "Total Earnings": Number(formData.earnings),
        "Rating": Number(formData.rating),
        "Details": {
          "Email": formData.email,
          "City": formData.city,
          "ID Type": normalizeDeliveryBoyIdType(formData.idType),
          "ID Number": formData.idNumber,
          "Boy Address": formData.address,
          "Store": formData.stores && formData.stores.length > 0 ? formData.stores[0] : "",
          "ID Image": idImageBase64 ? idImageBase64 : "placeholder_image.jpg"
        }
      };

      await addDeliveryBoy(payload);
      alert("New Personnel Successfully Enrolled in Fleet Master.");
      navigate("/delivery-boy-list");
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("Failed to process enrollment. Please verify server connectivity.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <Tooltip title="Cancel Registration">
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
          <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>Add Delivery Boy</Typography>
          <Typography variant="body2" color="#a3aed0" fontWeight="600">Register a new delivery boy to your system.</Typography>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2" }}>
        
        {/* Form Main Body */}
        <Box sx={{ p: 5 }}>
          <form onSubmit={handleSubmit}>
            
            {/* Section 1: Personal Background */}
            <Typography variant="subtitle2" fontWeight="900" color="#4318ff" sx={{ mb: 3, letterSpacing: "1px", display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon fontSize="small" /> PERSONAL DETAILS
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>FULL NAME</Typography>
                <TextField
                  fullWidth
                  name="name"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: "#a3aed0", fontSize: 18 }} /></InputAdornment> }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f4f7fe" } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>MOBILE NUMBER</Typography>
                <TextField
                  fullWidth
                  name="phone"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: "#a3aed0", fontSize: 18 }} /></InputAdornment> }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f4f7fe" } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>EMAIL ADDRESS</Typography>
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  placeholder="contact@delivery.com"
                  value={formData.email}
                  onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: "#a3aed0", fontSize: 18 }} /></InputAdornment> }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f4f7fe" } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>PASSWORD</Typography>
                <TextField
                  fullWidth
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: "#a3aed0", fontSize: 18 }} /></InputAdornment> }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f4f7fe" } }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 5, borderStyle: "dashed" }} />

            {/* Section 2: Fleet Documentation */}
            <Typography variant="subtitle2" fontWeight="900" color="#4318ff" sx={{ mb: 3, letterSpacing: "1px", display: "flex", alignItems: "center", gap: 1 }}>
                <BadgeIcon fontSize="small" /> DOCUMENT DETAILS
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>SELECT CITY</Typography>
                <FormControl fullWidth>
                  <Select
                    name="city"
                    displayEmpty
                    value={formData.city}
                    onChange={handleChange}
                    startAdornment={<InputAdornment position="start"><PublicIcon sx={{ color: "#a3aed0", fontSize: 18, ml: 1, mr: 0.5 }} /></InputAdornment>}
                    sx={{ borderRadius: "14px", bgcolor: "#f4f7fe" }}
                    input={<OutlinedInput />}
                  >
                    <MenuItem value="" disabled>Select Core City</MenuItem>
                    {cities.map(city => (
                      <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>ID PROOF CATEGORY</Typography>
                <FormControl fullWidth>
                  <Select
                    name="idType"
                    displayEmpty
                    value={formData.idType}
                    onChange={handleChange}
                    startAdornment={<InputAdornment position="start"><BadgeIcon sx={{ color: "#a3aed0", fontSize: 18, ml: 1, mr: 0.5 }} /></InputAdornment>}
                    sx={{ borderRadius: "14px", bgcolor: "#f4f7fe" }}
                    input={<OutlinedInput />}
                  >
                    <MenuItem value="" disabled>Select Document</MenuItem>
                    {DELIVERY_BOY_ID_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>DOCUMENT SERIAL NUMBER</Typography>
                <TextField
                  fullWidth
                  name="idNumber"
                  placeholder="e.g. AB123XX45"
                  value={formData.idNumber}
                  onChange={handleChange}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f4f7fe" } }}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>RESIDENTIAL ADDRESS</Typography>
                <TextField
                  fullWidth
                  name="address"
                  placeholder="Line 1, Landmark, Area Code..."
                  value={formData.address}
                  onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><HomeIcon sx={{ color: "#a3aed0", fontSize: 18 }} /></InputAdornment> }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f4f7fe" } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>UPLOAD ID IMAGE</Typography>
                <Button
                  component="label"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                  variant="outlined"
                  sx={{ 
                    height: "56px",
                    borderRadius: "14px", 
                    textTransform: "none", 
                    borderColor: "#e0e5f2", 
                    color: idImage ? "#24d164" : "#4b5563",
                    fontWeight: 700,
                    borderStyle: "dashed"
                  }}
                >
                  {idImage ? idImage.name : "Choose File"}
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
              </Grid>
            </Grid>

            <Divider sx={{ my: 5, borderStyle: "dashed" }} />

            {/* Section 3: Operational Scale */}
            <Typography variant="subtitle2" fontWeight="900" color="#4318ff" sx={{ mb: 3, letterSpacing: "1px", display: "flex", alignItems: "center", gap: 1 }}>
                <MapIcon fontSize="small" /> OPERATIONAL SCALE & METRICS
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>OPENING RATING</Typography>
                <TextField
                  fullWidth
                  type="number"
                  name="rating"
                  inputProps={{ step: 0.1, min: 0, max: 5 }}
                  value={formData.rating}
                  onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><StarIcon sx={{ color: "#ffb800", fontSize: 18 }} /></InputAdornment> }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f4f7fe" } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>INITIAL EARNINGS (₹)</Typography>
                <TextField
                  fullWidth
                  type="number"
                  name="earnings"
                  value={formData.earnings}
                  onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ color: "#24d164", fontWeight: 800, ml: 1, mr: 0.5 }}>₹</Typography></InputAdornment> }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f4f7fe" } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>HUB ASSIGNMENT</Typography>
                <FormControl fullWidth>
                  <Select
                    name="stores"
                    multiple
                    displayEmpty
                    value={formData.stores}
                    onChange={handleStoreChange}
                    sx={{ borderRadius: "14px", bgcolor: "#f4f7fe" }}
                    input={<OutlinedInput />}
                    startAdornment={<InputAdornment position="start"><StorefrontIcon sx={{ color: "#4318ff", fontSize: 18, ml: 1, mr: 0.5 }} /></InputAdornment>}
                    renderValue={(selected) => {
                      if (!selected || selected.length === 0) return <Typography color="#a3aed0" fontWeight="600">Select Stores</Typography>;
                      const names = storeList.filter(s => selected.includes(s._id)).map(s => s.name);
                      return <Typography fontWeight="700" color="#2b3674">{names.join(", ")}</Typography>;
                    }}
                    MenuProps={MenuProps}
                  >
                    <MenuItem value="all">
                        <Checkbox 
                            color="primary"
                            checked={(formData.stores || []).length === storeList.length && storeList.length > 0} 
                            indeterminate={(formData.stores || []).length > 0 && (formData.stores || []).length < storeList.length}
                        />
                        <ListItemText primary="Select all" sx={{ "& span": { fontWeight: 800 } }} />
                    </MenuItem>
                    {storeList.map((store) => (
                      <MenuItem key={store._id} value={store._id}>
                        <Checkbox color="primary" checked={(formData.stores || []).indexOf(store._id) > -1} />
                        <ListItemText primary={store.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Footer Actions */}
            <Divider sx={{ my: 5 }} />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button 
                    variant="outlined" 
                    onClick={() => navigate(-1)}
                    sx={{ borderRadius: "16px", px: 5, py: 1.8, textTransform: "none", fontWeight: 800, borderColor: "#e0e5f2", color: "#2b3674" }}
                >
                    Cancel
                </Button>
                <Button 
                    type="submit"
                    variant="contained" 
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
                    }}
                >
                    {isSubmitting ? "Adding..." : "Add Delivery Boy"}
                </Button>
            </Stack>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddDeliveryBoy;

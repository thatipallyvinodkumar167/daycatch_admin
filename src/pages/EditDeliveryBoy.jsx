import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Checkbox,
  ListItemText,
  OutlinedInput,
  IconButton,
  Tooltip,
  InputAdornment,
  Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getAllDeliveryBoys, updateDeliveryBoy } from "../api/deliveryBoyApi";
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

const EditDeliveryBoy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
  const [existingImageUrl, setExistingImageUrl] = useState("");

  const cities = [
    { name: "Hyderabad", _id: "city_hyd_001" },
    { name: "Kurnool", _id: "city_kurn_002" }
  ];

  const storeList = [
    { name: "Hyderabad Store", _id: "store_hyd_101" },
    { name: "Vijayawada Store", _id: "store_vj_102" }
  ];

  useEffect(() => {
    const fetchBoy = async () => {
      try {
        setLoading(true);
        const response = await getAllDeliveryBoys();
        const list = Array.isArray(response.data) ? response.data : (response.data.data || []);
        const found = list.find(b => String(b._id) === String(id) || String(b.id) === String(id));

        if (found) {
          const details = typeof found.Details === "object" ? found.Details : (typeof found.details === "object" ? found.details : {});
          
          let stList = details.Store || details.store || details.stores || found["Store"] || found.store || found.stores || [];
          if (!Array.isArray(stList)) stList = [stList];

          setFormData({
            name: found["Boy Name"] || found.boyName || found.name || "",
            phone: found["Boy Phone"] || found.boyMobile || found.phone || "",
            email: found["Boy Email"] || details.Email || details.email || details.boyEmail || found.email || "",
            password: found["Boy Password"] || found.boyPassword || found.password || "",
            city: details.City || details.city || found["City"] || (typeof found.city === 'object' ? found.city?._id : found.city) || "",
            idType: normalizeDeliveryBoyIdType(details["ID Type"] || details.idType || found["ID Type"] || found.idType || ""),
            idNumber: details["ID Number"] || details.idNumber || found["ID Number"] || found.idNumber || "",
            address: details["Boy Address"] || details.address || details.boyAddress || found["Boy Address"] || found.address || found.boyAddress || "",
            stores: stList.map(s => typeof s === 'object' ? s._id : s).filter(s => s),
            status: normalizeDeliveryBoyStatus(found["Status"] || found.status),
            earnings: found["Total Earnings"] || found.totalEarnings || found.earnings || 0,
            rating: found["Rating"] || found.rating || 5.0,
          });
          const imgUrl = details["ID Image"] || details.idImage || found["ID Image"] || found.idImage || "";
          if (imgUrl) setExistingImageUrl(imgUrl);
        }
      } catch (error) {
        console.error("Error fetching delivery boy:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBoy();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStoreChange = (event) => {
    const { value } = event;
    
    if (value && value.includes("all")) {
        if (formData.stores.length === storeList.length) {
            setFormData({ ...formData, stores: [] });
        } else {
            setFormData({ ...formData, stores: storeList.map(s => s._id) });
        }
        return;
    }

    setFormData({
      ...formData,
      stores: typeof value === 'string' ? value.split(',') : value
    });
  };

  const handleFileChange = (e) => {
    setIdImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        "Boy Name": formData.name,
        "Boy Phone": formData.phone,
        "Boy Password": formData.password,
        "Status": normalizeDeliveryBoyStatus(formData.status),
        "Details": {
          "Email": formData.email,
          "City": formData.city,
          "ID Type": normalizeDeliveryBoyIdType(formData.idType),
          "ID Number": formData.idNumber,
          "Boy Address": formData.address,
          "Store": formData.stores && formData.stores.length > 0 ? formData.stores[0] : "",
          "ID Image": idImage ? idImage.name : (existingImageUrl || "placeholder_image.jpg")
        },
        "Total Earnings": Number(formData.earnings),
        "Rating": Number(formData.rating)
      };

      await updateDeliveryBoy(id, payload);
      alert("Fleet Records Updated Successfully.");
      navigate("/delivery-boy-list");
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to sync updates with server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress sx={{ color: "#4318ff" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <Tooltip title="Cancel and Return">
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
          <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>Edit Delivery Boy</Typography>
          <Typography variant="body2" color="#a3aed0" fontWeight="600">Edit delivery boy information for <span style={{ color: "#4318ff" }}>{formData.name}</span></Typography>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2" }}>
        
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
                  value={formData.name}
                  onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: "#a3aed0", fontSize: 18 }} /></InputAdornment> }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f4f7fe" } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>CONTACT MOBILE</Typography>
                <TextField
                  fullWidth
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: "#a3aed0", fontSize: 18 }} /></InputAdornment> }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f4f7fe" } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>EMAIL ID</Typography>
                <TextField
                  fullWidth
                  name="email"
                  type="email"
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
                    value={formData.city}
                    onChange={handleChange}
                    startAdornment={<InputAdornment position="start"><PublicIcon sx={{ color: "#a3aed0", fontSize: 18, ml: 1, mr: 0.5 }} /></InputAdornment>}
                    sx={{ borderRadius: "14px", bgcolor: "#f4f7fe" }}
                    input={<OutlinedInput />}
                  >
                    <MenuItem value="" disabled>Select City</MenuItem>
                    {cities.map(city => (
                      <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>ID CATEGORY</Typography>
                <FormControl fullWidth>
                  <Select
                    name="idType"
                    value={formData.idType}
                    onChange={handleChange}
                    startAdornment={<InputAdornment position="start"><BadgeIcon sx={{ color: "#a3aed0", fontSize: 18, ml: 1, mr: 0.5 }} /></InputAdornment>}
                    sx={{ borderRadius: "14px", bgcolor: "#f4f7fe" }}
                    input={<OutlinedInput />}
                  >
                    {DELIVERY_BOY_ID_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>DOCUMENT ID</Typography>
                <TextField
                  fullWidth
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f4f7fe" } }}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>FULL ADDRESS</Typography>
                <TextField
                  fullWidth
                  name="address"
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
                  {idImage ? idImage.name : (existingImageUrl ? "ID Already Uploaded" : "Change File")}
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
              </Grid>
            </Grid>

            <Divider sx={{ my: 5, borderStyle: "dashed" }} />

            {/* Section 3: Operational Context */}
            <Typography variant="subtitle2" fontWeight="900" color="#4318ff" sx={{ mb: 3, letterSpacing: "1px", display: "flex", alignItems: "center", gap: 1 }}>
                <MapIcon fontSize="small" /> OTHER DETAILS
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>FLEET RATING</Typography>
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
                <Typography variant="caption" fontWeight="800" color="#2b3674" sx={{ ml: 0.5, mb: 1, display: "block" }}>TOTAL EARNINGS (₹)</Typography>
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
                            checked={formData.stores.length === storeList.length && storeList.length > 0} 
                            indeterminate={formData.stores.length > 0 && formData.stores.length < storeList.length}
                        />
                        <ListItemText primary="Select all" sx={{ "& span": { fontWeight: 800 } }} />
                    </MenuItem>
                    {storeList.map((store) => (
                      <MenuItem key={store._id} value={store._id}>
                        <Checkbox color="primary" checked={formData.stores.indexOf(store._id) > -1} />
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
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
            </Stack>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditDeliveryBoy;

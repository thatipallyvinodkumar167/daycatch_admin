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
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getAllDeliveryBoys, updateDeliveryBoy } from "../api/deliveryBoyApi";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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
  });
  const [idImage, setIdImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");

  const cities = [
    { name: "Hyderabad", _id: "69b78e59c52e71920fa867ac" },
    { name: "Kurnool", _id: "69b78e59c52e71920fa867ac" }
  ];

  const storeList = [
    { name: "Hyderabad Store", _id: "69b7ac7bad9d8224d7a970d7" },
    { name: "Vijayawada Store", _id: "69b7ac7bad9d8224d7a970d7" }
  ];

  useEffect(() => {
    const fetchBoy = async () => {
      try {
        // Fetch all boys and find the one matching the ID
        const response = await getAllDeliveryBoys();
        const list = Array.isArray(response.data) ? response.data : (response.data.data || []);
        const found = list.find(b => String(b._id) === String(id) || String(b.id) === String(id));

        if (found) {
          const detailsInfo = found.Details || found.details || {};
          setFormData({
            name: found.boyName || found.name || found["Boy Name"] || "",
            phone: found.boyMobile || found.phone || found["Boy Phone"] || "",
            email: found.boyEmail || found.email || found["Boy Email"] || detailsInfo.Email || detailsInfo.boyEmail || "",
            password: found.boyPassword || found.password || found["Boy Password"] || "",
            city: detailsInfo.City || typeof found.city === 'object' ? found.city?._id : (found.city || ""),
            idType: normalizeDeliveryBoyIdType(detailsInfo["ID Type"] || found.idType),
            idNumber: detailsInfo["ID Number"] || found.idNumber || "",
            address: detailsInfo["Boy Address"] || found.boyAddress || found.address || "",
            stores: detailsInfo.Store ? [detailsInfo.Store] : found.store ? (Array.isArray(found.store) ? found.store : [typeof found.store === 'object' ? found.store._id : found.store]) : (found.stores || []),
            status: normalizeDeliveryBoyStatus(found.status || found.Status),
          });
          if (detailsInfo["ID Image"] || found.idImage) setExistingImageUrl(detailsInfo["ID Image"] || found.idImage);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching delivery boy:", error);
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
    const {
      target: { value },
    } = event;
    
    if (value.includes("all")) {
        if (formData.stores.length === storeList.length) {
            setFormData({ ...formData, stores: [] });
        } else {
            setFormData({ ...formData, stores: storeList.map((store) => store._id) });
        }
        return;
    }

    setFormData({
      ...formData,
      stores: typeof value === 'string' ? value.split(',') : value,
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
        }
      };

      const response = await updateDeliveryBoy(id, payload);

      console.log("Update Delivery Boy Response:", response.data);
      alert("Delivery Boy updated successfully!");
      navigate("/delivery-boy-list");
    } catch (error) {
      console.error("Error updating delivery boy:", error);
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;
      alert(serverMessage || "Failed to update delivery boy.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Page Heading */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Edit delivery boy details.
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        {/* Card Header */}
        <Box sx={{ p: 3, borderBottom: "1px solid #f1f1f1" }}>
          <Typography variant="h6" fontWeight="600" color="#1b2559">
            Edit Delivery Boy
          </Typography>
        </Box>

        <Box sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              
              {/* Boy Name */}
              <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
                  Boy Name
                </Typography>
                <TextField
                  fullWidth
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              </Grid>

              {/* Boy Phone */}
              <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
                  Boy Phone
                </Typography>
                <TextField
                  fullWidth
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              </Grid>

              {/* Boy Email */}
              <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
                  Boy Email
                </Typography>
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              </Grid>

              {/* Password */}
              <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
                  Password
                </Typography>
                <TextField
                  fullWidth
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              </Grid>

              {/* Select City */}
              <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
                  Select City
                </Typography>
                <FormControl fullWidth>
                  <Select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    sx={{ borderRadius: "8px" }}
                    input={<OutlinedInput />}
                  >
                    <MenuItem value="" disabled>Select City</MenuItem>
                    {cities.map(city => (
                      <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Select ID */}
              <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
                  Select ID
                </Typography>
                <FormControl fullWidth>
                  <Select
                    name="idType"
                    value={formData.idType}
                    onChange={handleChange}
                    sx={{ borderRadius: "8px" }}
                    input={<OutlinedInput />}
                  >
                    {DELIVERY_BOY_ID_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* ID Number */}
              <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
                  ID Number
                </Typography>
                <TextField
                  fullWidth
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              </Grid>

              {/* ID Image */}
              <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
                  ID Image
                </Typography>
                <Box 
                  sx={{ 
                    border: "1px dashed #d1d5db", 
                    borderRadius: "8px", 
                    p: 1.5, 
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    backgroundColor: "#f9fafb"
                  }}
                >
                  {existingImageUrl && !idImage && (
                    <Box component="img" src={existingImageUrl} sx={{ width: 40, height: 40, borderRadius: "4px" }} />
                  )}
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="id-image-upload"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="id-image-upload">
                    <Button
                      variant="text"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      sx={{ textTransform: "none", color: "#4b5563" }}
                    >
                      {idImage ? idImage.name : "Change file"}
                    </Button>
                  </label>
                </Box>
              </Grid>

              {/* Boy Address */}
              <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
                  Boy Address
                </Typography>
                <TextField
                  fullWidth
                  name="address"
                  placeholder="Enter a location"
                  value={formData.address}
                  onChange={handleChange}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              </Grid>

              {/* All Stores */}
              <Grid item xs={12}>
                <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
                  All Stores
                </Typography>
                <FormControl fullWidth>
                  <Select
                    name="stores"
                    multiple
                    value={formData.stores}
                    onChange={handleStoreChange}
                    sx={{ borderRadius: "8px" }}
                    input={<OutlinedInput />}
                    renderValue={(selected) => {
                      if (!selected || selected.length === 0) {
                        return <Typography color="textSecondary">Select Stores</Typography>;
                      }
                      const selectedStoreNames = storeList
                        .filter(store => selected.includes(store._id))
                        .map(store => store.name);
                      return selectedStoreNames.join(', ');
                    }}
                    MenuProps={MenuProps}
                  >
                    <MenuItem value="all">
                        <Checkbox checked={formData.stores.length === storeList.length && storeList.length > 0} indeterminate={formData.stores.length > 0 && formData.stores.length < storeList.length} />
                        <ListItemText primary="Select all" />
                    </MenuItem>
                    {storeList.map(store => (
                      <MenuItem key={store._id} value={store._id}>
                        <Checkbox checked={formData.stores.indexOf(store._id) > -1} />
                        <ListItemText primary={store.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button 
                    type="submit"
                    variant="contained" 
                    disabled={isSubmitting}
                    sx={{ 
                      backgroundColor: "#2d60ff", 
                      "&:hover": { backgroundColor: "#2046cc" },
                      borderRadius: "8px",
                      textTransform: "none",
                      px: 4,
                      py: 1.5,
                      fontWeight: "600"
                    }}
                  >
                    {isSubmitting ? "Updating..." : "Update Delivery Boy"}
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate("/delivery-boy-list")}
                    sx={{ 
                      borderRadius: "8px",
                      textTransform: "none",
                      px: 4,
                      borderColor: "#d1d5db",
                      color: "#4b5563"
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Grid>

            </Grid>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditDeliveryBoy;

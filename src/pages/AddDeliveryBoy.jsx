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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { addDeliveryBoy } from "../api/deliveryBoyApi";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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
  });
  const [idImage, setIdImage] = useState(null);

  const cities = [
    "Hyderabad",
    "Kurnool",
    "Vijayawada",
    "Warrangal",
    "Guntur",
    "Mangalgiri",
    "Khammam",
    "Nellore"
  ];

  const idTypes = [
    "Aadhar Card",
    "PAN Card",
    "Business Proof"
  ];

  const storeList = [
    "Hyderabad Store",
    "Vijayawada Store",
    "Kurnool Store",
    "Khammam Store",
    "Guntur Store",
    "Mangalgiri Store",
    "Warrangal Store"
  ];

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
            setFormData({ ...formData, stores: [...storeList] });
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
    if (!formData.name.trim() || !formData.phone.trim() || !formData.password.trim()) {
      alert("Please fill in the required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      
      const payload = {
        boyName: formData.name,
        boyMobile: formData.phone,
        boyEmail: formData.email,
        boyPassword: formData.password,
        city: formData.city, // Wait until these IDs match backend strings/ObjectIds
        idType: formData.idType,
        idNumber: formData.idNumber,
        boyAddress: formData.address,
        status: "Active",
        store: formData.stores && formData.stores.length > 0 ? formData.stores[0] : "",
        idImage: idImage ? idImage.name : "placeholder_image.jpg" // Some APIs test upload as simple string names like your snippet earlier "nag_aadhar.jpg"
      };

      const response = await addDeliveryBoy(payload);

      console.log("Add Delivery Boy Response:", response.data);
      alert("Delivery Boy added successfully!");
      navigate("/delivery-boy-list");
    } catch (error) {
      console.error("Error adding delivery boy:", error);
      const serverMessage = error?.response?.data?.message || error?.response?.data?.error;
      alert(serverMessage || "Failed to add delivery boy (Server Error 500). Please check if all fields are valid.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Page Heading */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Add a new delivery boy to your team.
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        {/* Card Header */}
        <Box sx={{ p: 3, borderBottom: "1px solid #f1f1f1" }}>
          <Typography variant="h6" fontWeight="600" color="#1b2559">
            Add Delivery Boy
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
                  placeholder="Enter boy name..."
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
                  placeholder="Enter phone number..."
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
                  placeholder="Enter email address..."
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
                  placeholder="Enter password..."
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
                    displayEmpty
                    value={formData.city}
                    onChange={handleChange}
                    sx={{ borderRadius: "8px" }}
                    input={<OutlinedInput />}
                  >
                    <MenuItem value="" disabled>Select City</MenuItem>
                    {cities.map(city => (
                      <MenuItem key={city} value={city}>{city}</MenuItem>
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
                    displayEmpty
                    value={formData.idType}
                    onChange={handleChange}
                    sx={{ borderRadius: "8px" }}
                    input={<OutlinedInput />}
                  >
                    <MenuItem value="" disabled>Select ID</MenuItem>
                    {idTypes.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
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
                  placeholder="Enter ID number..."
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
                    p: 2, 
                    textAlign: "center",
                    backgroundColor: "#f9fafb"
                  }}
                >
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
                      {idImage ? idImage.name : "Choose file"}
                    </Button>
                  </label>
                  {!idImage && <Typography variant="caption" display="block" color="textSecondary">No file chosen</Typography>}
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
                    displayEmpty
                    value={formData.stores}
                    onChange={handleStoreChange}
                    sx={{ borderRadius: "8px" }}
                    input={<OutlinedInput />}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <Typography color="textSecondary">Select Stores</Typography>;
                      }
                      return selected.join(', ');
                    }}
                    MenuProps={MenuProps}
                  >
                    <MenuItem value="all">
                        <Checkbox checked={formData.stores.length === storeList.length} indeterminate={formData.stores.length > 0 && formData.stores.length < storeList.length} />
                        <ListItemText primary="Select all" />
                    </MenuItem>
                    {storeList.map(store => (
                      <MenuItem key={store} value={store}>
                        <Checkbox checked={formData.stores.indexOf(store) > -1} />
                        <ListItemText primary={store} />
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
                    {isSubmitting ? "Adding..." : "Add Delivery Boy"}
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

export default AddDeliveryBoy;

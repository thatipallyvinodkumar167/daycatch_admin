import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getAllDeliveryBoys } from "../api/deliveryBoyApi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  formatDeliveryBoyIdType,
  formatDeliveryBoyStatus,
  isDeliveryBoyOffDuty,
  normalizeDeliveryBoyIdType,
  normalizeDeliveryBoyStatus,
} from "../utils/deliveryBoyUtils";

const DeliveryBoyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [boy, setBoy] = useState(null);

  useEffect(() => {
    const fetchBoy = async () => {
      try {
        const response = await getAllDeliveryBoys();
        const list = Array.isArray(response.data.data) ? response.data.data : (response.data || []);
        const found = list.find(b => String(b._id) === String(id) || String(b.id) === String(id));

        if (found) {
          setBoy({
            name: found.boyName || found.name || found["Boy Name"] || "N/A",
            phone: found.boyMobile || found.phone || found["Boy Phone"] || "N/A",
            email: found.boyEmail || found.email || found["Boy Email"] || "N/A",
            status: normalizeDeliveryBoyStatus(found.status || found["Status"]),
            city: found.city?.cityName || found.city || found["City"] || "N/A",
            idType: normalizeDeliveryBoyIdType(found.idType || found["ID Type"]),
            idNumber: found.idNumber || found["ID Number"] || "N/A",
            addressLine: found.boyAddress || found.address || found["Boy Address"] || "N/A",
            stores: found.store ? (Array.isArray(found.store) ? found.store : [found.store]) : (found["Store"] ? (Array.isArray(found["Store"]) ? found["Store"] : [found["Store"]]) : []),
            idImage: found.idImage || found["ID Image"] || "",
            createdAt: found.createdAt ? new Date(found.createdAt).toLocaleDateString() : "N/A",
            orders: found.orders || found["Orders"] || 0,
            totalEarnings: "N/A"
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching delivery boy details:", error);
        setLoading(false);
      }
    };
    fetchBoy();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!boy) {
    return <Typography>Boy not found</Typography>;
  }

  const isOffDuty = isDeliveryBoyOffDuty(boy.status);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Page Heading and Back Button */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <Button 
            onClick={() => navigate(-1)}
            sx={{ 
                minWidth: "auto", 
                backgroundColor: "white", 
                borderRadius: "10px", 
                p: 1, 
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                color: "#2b3674",
                "&:hover": { backgroundColor: "#f0f0f0" }
            }}
        >
            <ArrowBackIcon />
        </Button>
        <Box>
            <Typography variant="h4" fontWeight="700" color="#2b3674">
                Delivery Boy Details
            </Typography>
            <Typography variant="body1" color="textSecondary">
                Viewing profile: {boy.name}
            </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        
        {/* Left Column: Profile Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ borderRadius: "15px", p: 4, textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <Box 
              sx={{ 
                width: 120, 
                height: 120, 
                borderRadius: "50%", 
                backgroundColor: "#e0e7ff", 
                color: "#4318ff", 
                fontSize: "40px", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                fontWeight: "700",
                margin: "0 auto 20px",
                border: "4px solid #fff",
                boxShadow: "0 10px 20px rgba(67, 24, 255, 0.1)"
              }}
            >
              {boy.name.charAt(0)}
            </Box>
            <Typography variant="h5" fontWeight="700" color="#1b2559">
              {boy.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Delivery Partner
            </Typography>
            <Chip 
              label={formatDeliveryBoyStatus(boy.status)} 
              sx={{ 
                backgroundColor: isOffDuty ? "#fff1f0" : "#e6f9ed", 
                color: isOffDuty ? "#ff4d49" : "#24d164", 
                fontWeight: "700",
                px: 2
              }} 
            />
            
            <Divider sx={{ my: 3 }} />
            
            <Stack spacing={2}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="textSecondary">Total Orders</Typography>
                    <Typography variant="body2" fontWeight="700" color="#1b2559">{boy.orders}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="textSecondary">Earnings</Typography>
                    <Typography variant="body2" fontWeight="700" color="#24d164">{boy.totalEarnings}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="textSecondary">Rating</Typography>
                    <Typography variant="body2" fontWeight="700" color="#ffb800">4.8 ★</Typography>
                </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Right Column: Detailed Info */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ borderRadius: "15px", p: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            
            <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>
                Personal & ID Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: "600", textTransform: "uppercase", fontSize: "10px" }}>Phone Number</Typography>
                <Typography variant="body1" fontWeight="600" color="#1b2559">{boy.phone}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: "600", textTransform: "uppercase", fontSize: "10px" }}>City</Typography>
                <Typography variant="body1" fontWeight="600" color="#1b2559">{boy.city}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: "600", textTransform: "uppercase", fontSize: "10px" }}>ID Type</Typography>
                <Typography variant="body1" fontWeight="600" color="#1b2559">{formatDeliveryBoyIdType(boy.idType)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: "600", textTransform: "uppercase", fontSize: "10px" }}>ID Number</Typography>
                <Typography variant="body1" fontWeight="600" color="#1b2559">{boy.idNumber}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: "600", textTransform: "uppercase", fontSize: "10px" }}>Boy Address</Typography>
                <Typography variant="body1" fontWeight="600" color="#1b2559">{boy.addressLine}</Typography>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 4 }} />
            
            <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 2 }}>
                Assigned Stores
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {boy.stores.map(store => (
                    <Chip key={store} label={store} variant="outlined" sx={{ borderRadius: "8px", fontWeight: "500" }} />
                ))}
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 2 }}>
                ID Proof Document
            </Typography>
            <Box 
                sx={{ 
                    width: "100%", 
                    height: 200, 
                    borderRadius: "12px", 
                    backgroundColor: "#f4f7fe", 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center",
                    border: "1px dashed #d1d5db"
                }}
            >
                <Typography variant="body2" color="textSecondary">
                    [ ID Image Preview: {formatDeliveryBoyIdType(boy.idType)} ]
                </Typography>
            </Box>

          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DeliveryBoyDetails;

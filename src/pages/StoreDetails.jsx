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
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { genericApi } from "../api/genericApi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RadarIcon from "@mui/icons-material/Radar";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PercentIcon from "@mui/icons-material/Percent";
import PersonIcon from "@mui/icons-material/Person";

const StoreDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        const response = await genericApi.getOne("storeList", id);
        const found = response.data;

        if (found) {
          setStore({
            id: found.id || found._id,
            name: found["Store Name"] || found.name || "Unnamed Store",
            owner: found["Employee Name"] || found.owner || "N/A",
            phone: found.Mobile || found.phone || "N/A",
            email: found.Email || found.email || "N/A",
            status: found.status || "Active",
            city: found.City || found.city || "N/A",
            address: found.address || found.Address || "N/A",
            idType: found["ID Type"] || found.idType || "Aadhar Card",
            idNumber: found["ID Number"] || found.idNumber || "N/A",
            idImage: found["ID Image"] || found.idImage || found.aadhaarPhoto || "",
            logo: found["Profile Pic"] || found.logo || "",
            ordersPerSlot: found["Orders Per Slot"] || found.orders || 0,
            adminShare: found["admin share"] || found.adminShare || found["Admin Share"] || 0,
            deliveryRange: found["Delivery Range"] || found.deliveryRange || 0,
            startTime: found["Start Time"] || found.startTime || "N/A",
            endTime: found["End Time"] || found.endTime || "N/A",
            slotInterval: found["Slot Interval"] || found.slotInterval || "N/A",
            totalOrders: found.totalOrders || found.orders || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching store details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress sx={{ color: "#4318ff" }} />
      </Box>
    );
  }

  if (!store) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h5" color="textSecondary">Store Record Not Found</Typography>
        <Button onClick={() => navigate("/stores")} sx={{ mt: 2, textTransform: 'none', color: '#4318ff' }}>Return to Stores</Button>
      </Box>
    );
  }

  const isBlocked = (store.status || "").toLowerCase() === "inactive" || (store.status || "").toLowerCase() === "blocked";

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Dynamic Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title="Back to Stores">
                <IconButton 
                    onClick={() => navigate("/stores")}
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
                    Store Profile
                </Typography>
                <Typography variant="body2" color="#a3aed0" fontWeight="600">
                    System Entity ID: <span style={{ color: "#4318ff" }}>{store.id}</span>
                </Typography>
            </Box>
        </Box>
        <Stack direction="row" spacing={2}>
            <Button 
                variant="outlined" 
                onClick={() => window.print()}
                sx={{ borderRadius: "12px", textTransform: 'none', fontWeight: 700, borderColor: '#e0e5f2', color: '#2b3674' }}
            >
                Print Profile
            </Button>
            <Button 
                variant="contained" 
                onClick={() => navigate("/stores")} // Just a placeholder, usually it would go to edit page
                sx={{ borderRadius: "12px", textTransform: 'none', fontWeight: 700, bgcolor: '#4318ff', '&:hover': { bgcolor: '#3311cc' } }}
            >
                Return to List
            </Button>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        
        {/* Left: Summary Profile Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ borderRadius: "24px", p: 4, textAlign: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2" }}>
            <Avatar 
              src={store.logo}
              sx={{ 
                width: 100, 
                height: 100, 
                bgcolor: "#eef2ff", 
                color: "#4318ff", 
                fontSize: "36px", 
                fontWeight: "800",
                margin: "0 auto 16px",
                border: "4px solid #fff",
                boxShadow: "0 10px 30px rgba(67, 24, 255, 0.15)",
                borderRadius: "24px"
              }}
            >
              {store.name[0].toUpperCase()}
            </Avatar>
            <Typography variant="h5" fontWeight="800" color="#1b2559">
              {store.name}
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600" sx={{ mb: 2 }}>
              Strategic Retail Partner
            </Typography>
            
            <Chip 
              label={store.status.toUpperCase()} 
              sx={{ 
                backgroundColor: isBlocked ? "#fff1f0" : "#e6f9ed", 
                color: isBlocked ? "#ff4d49" : "#24d164", 
                fontWeight: "900",
                fontSize: "10px",
                borderRadius: "10px",
                height: "24px",
                px: 1
              }} 
            />
            
            <Divider sx={{ my: 4, borderStyle: "dashed" }} />
            
            <Grid container spacing={2}>
              {[
                { label: "Total Orders", value: store.totalOrders, color: "#4318ff", icon: <ShoppingBagIcon sx={{fontSize: 14}}/> },
                { label: "Admin Share", value: store.adminShare + "%", color: "#24d164", icon: <PercentIcon sx={{fontSize: 14}}/> },
                { label: "Slot Buffer", value: store.slotInterval + "m", color: "#ffb800", icon: <AccessTimeIcon sx={{fontSize: 14}}/> }
              ].map((stat) => (
                <Grid item xs={4} key={stat.label}>
                  <Typography variant="h6" fontWeight="800" sx={{ color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color="#a3aed0" fontWeight="700" sx={{ fontSize: "9px" }}>{stat.label.toUpperCase()}</Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Quick Contacts Card */}
          <Paper sx={{ mt: 3, p: 3, borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2" }}>
            <Typography variant="subtitle2" fontWeight="800" color="#1b2559" gutterBottom>Administrative Contact</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#f4f7fe" }}><PersonIcon sx={{ fontSize: 16, color: "#4318ff" }} /></Avatar>
                    <Typography variant="body2" fontWeight="700" color="#475467">{store.owner}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#f4f7fe" }}><PhoneIcon sx={{ fontSize: 16, color: "#4318ff" }} /></Avatar>
                    <Typography variant="body2" fontWeight="700" color="#475467">{store.phone}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#f4f7fe" }}><EmailIcon sx={{ fontSize: 16, color: "#4318ff" }} /></Avatar>
                    <Typography variant="body2" fontWeight="700" color="#475467">{store.email}</Typography>
                </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Right: Detailed Core Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ borderRadius: "24px", p: 4, boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2" }}>
            
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight="800" color="#1b2559">Legal & Logistics Presence</Typography>
                <Typography variant="body2" color="#a3aed0">Corporate documentation and operational reach</Typography>
            </Box>
            
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={0.5}>
                    <Typography variant="caption" color="#a3aed0" fontWeight="800">BASE OF OPERATIONS</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <LocationOnIcon sx={{ color: "#4318ff", fontSize: 18 }} />
                        <Typography variant="body1" fontWeight="700" color="#1b2559">{store.city}</Typography>
                    </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={0.5}>
                    <Typography variant="caption" color="#a3aed0" fontWeight="800">DELIVERY RADIUS</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <RadarIcon sx={{ color: "#4318ff", fontSize: 18 }} />
                        <Typography variant="body1" fontWeight="700" color="#1b2559">{store.deliveryRange} KM Coverage</Typography>
                    </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={0.5}>
                    <Typography variant="caption" color="#a3aed0" fontWeight="800">VERIFICATION TYPE</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <BadgeIcon sx={{ color: "#4318ff", fontSize: 18 }} />
                        <Typography variant="body1" fontWeight="700" color="#1b2559">{store.idType}</Typography>
                    </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={0.5}>
                    <Typography variant="caption" color="#a3aed0" fontWeight="800">DOCUMENT ID NUMBER</Typography>
                    <Typography variant="body1" fontWeight="800" color="#1b2559" sx={{ letterSpacing: 1 }}>{store.idNumber}</Typography>
                </Stack>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
                <Typography variant="caption" color="#a3aed0" fontWeight="800">REGISTERED STORE ADDRESS</Typography>
                <Typography variant="body1" fontWeight="700" color="#475467">{store.address}</Typography>
            </Box>
            
            <Divider sx={{ my: 5, borderStyle: "dashed" }} />
            
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="800" color="#1b2559">Operational Settings</Typography>
                <Typography variant="body2" color="#a3aed0">Slot availability and fulfillment capacity</Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ mb: 1.5, display: "block" }}>FULFILLMENT CAPACITY</Typography>
                    <Stack direction="row" spacing={2}>
                        <Paper sx={{ p: 2, flex: 1, borderRadius: "16px", bgcolor: "#f4f7fe", border: "1px solid #e0e5f2" }}>
                            <Typography variant="caption" color="#a3aed0" fontWeight="800">ORDERS PER SLOT</Typography>
                            <Typography variant="h6" fontWeight="800" color="#4318ff">{store.ordersPerSlot}</Typography>
                        </Paper>
                        <Paper sx={{ p: 2, flex: 1, borderRadius: "16px", bgcolor: "#f4f7fe", border: "1px solid #e0e552" }}>
                            <Typography variant="caption" color="#a3aed0" fontWeight="800">SERVICE WINDOW</Typography>
                            <Typography variant="body2" fontWeight="800" color="#1b2559">{store.startTime} - {store.endTime}</Typography>
                        </Paper>
                    </Stack>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ mb: 1.5, display: "block" }}>ID DOC PREVIEW</Typography>
                    <Box 
                        sx={{ 
                            width: "100%", 
                            height: 140, 
                            borderRadius: "16px", 
                            backgroundColor: store.idImage ? "transparent" : "#f4f7fe", 
                            display: "flex", 
                            flexDirection: "column",
                            justifyContent: "center", 
                            alignItems: "center",
                            border: store.idImage ? "none" : "2px dashed #e0e5f2",
                            overflow: "hidden",
                        }}
                    >
                        {store.idImage ? (
                             <img 
                                src={store.idImage} 
                                alt="ID Document" 
                                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                             />
                        ) : (
                            <>
                                <Box sx={{ opacity: 0.5, mb: 1 }}>[ Document Icon ]</Box>
                                <Typography variant="caption" color="#a3aed0" fontWeight="700">Digital Archive Preview</Typography>
                            </>
                        )}
                    </Box>
                </Grid>
            </Grid>

          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StoreDetails;

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
import { getAllDeliveryBoys } from "../api/deliveryBoyApi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import StorefrontIcon from "@mui/icons-material/Storefront";
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
        setLoading(true);
        const response = await getAllDeliveryBoys();
        const rawList = Array.isArray(response.data.data) ? response.data.data : (response.data || []);
        
        // Comprehensive ID matching
        const found = rawList.find(b => 
            String(b._id) === String(id) || 
            String(b.id) === String(id) || 
            String(b.uid) === String(id)
        );

        if (found) {
          // Extra robust details extraction
          const details = found.Details || found.details || found.Detail || found.detail || {};
          
          setBoy({
            id: found._id || found.id,
            name: found["Boy Name"] || found.boyName || found.name || found.userName || "Unnamed Personnel",
            phone: found["Boy Phone"] || found.boyMobile || found.phone || found.mobile || "N/A",
            email: details.Email || details.email || found["Boy Email"] || found.email || "N/A",
            status: normalizeDeliveryBoyStatus(found["Status"] || found.status || found.dutyStatus),
            
            // Geographic Info
            city: (() => {
                const c = details.City || details.city || found["City"] || found.city || "Hyderabad";
                if (c === "city_hyd_001") return "Hyderabad";
                if (c === "city_kurn_002") return "Kurnool";
                return c;
            })(),
            addressLine: details["Boy Address"] || details.address || details.boyAddress || found["Boy Address"] || found.address || found.boyAddress || "Street Address Not Provided",
            
            // Identification Info
            idType: normalizeDeliveryBoyIdType(details["ID Type"] || details.idType || found["ID Type"] || found.idType || "Aadhar"),
            idNumber: details["ID Number"] || details.idNumber || found["ID Number"] || found.idNumber || found.aadhaarNumber || "Pending Verification",
            
            // Operational Metrics
            stores: (() => {
               const st = details.Store || details.store || details.stores || found["Store"] || found.store || found.stores || [];
               const stArray = Array.isArray(st) ? st : [st];
               return stArray.filter(s => s && s !== "").map(s => {
                   if (s === "store_hyd_101") return "Hyderabad Store";
                   if (s === "store_vj_102") return "Vijayawada Store";
                   return s;
               });
            })(),
            idImage: details["ID Image"] || details.idImage || found["ID Image"] || found.idImage || "",
            orders: found["Orders"] || found.orders || 0,
            totalEarnings: found["Total Earnings"] || found.totalEarnings || found.earnings || 0,
            rating: found["Rating"] || found.rating || 4.8,
            joinDate: found.createdAt || found.date || found.created_at
          });
        }
      } catch (error) {
        console.error("Error fetching delivery boy details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBoy();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress sx={{ color: "#4318ff" }} />
      </Box>
    );
  }

  if (!boy) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h5" color="textSecondary">Personnel Record Not Found</Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2, textTransform: 'none', color: '#4318ff' }}>Return to Fleet Master</Button>
      </Box>
    );
  }

  const isOffDuty = isDeliveryBoyOffDuty(boy.status);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Dynamic Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title="Back to Fleet Manager">
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
                    Personnel Profile
                </Typography>
                <Typography variant="body2" color="#a3aed0" fontWeight="600">
                    System Record ID: <span style={{ color: "#4318ff" }}>{boy.id}</span>
                </Typography>
            </Box>
        </Box>
        <Stack direction="row" spacing={2}>
            <Button 
                variant="outlined" 
                onClick={() => window.print()}
                sx={{ borderRadius: "12px", textTransform: 'none', fontWeight: 700, borderColor: '#e0e5f2', color: '#2b3674' }}
            >
                Print ID Card
            </Button>
            <Button 
                variant="contained" 
                onClick={() => navigate(`/delivery-boy-list/edit/${boy.id}`)}
                sx={{ borderRadius: "12px", textTransform: 'none', fontWeight: 700, bgcolor: '#4318ff', '&:hover': { bgcolor: '#3311cc' } }}
            >
                Edit Profile
            </Button>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        
        {/* Left: Summary Profile Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ borderRadius: "24px", p: 4, textAlign: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2" }}>
            <Avatar 
              sx={{ 
                width: 100, 
                height: 100, 
                bgcolor: "#eef2ff", 
                color: "#4318ff", 
                fontSize: "36px", 
                fontWeight: "800",
                margin: "0 auto 16px",
                border: "4px solid #fff",
                boxShadow: "0 10px 30px rgba(67, 24, 255, 0.15)"
              }}
            >
              {boy.name[0]}
            </Avatar>
            <Typography variant="h5" fontWeight="800" color="#1b2559">
              {boy.name}
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600" sx={{ mb: 2 }}>
              Certified Logistics Partner
            </Typography>
            
            <Chip 
              label={formatDeliveryBoyStatus(boy.status).toUpperCase()} 
              sx={{ 
                backgroundColor: isOffDuty ? "#fff1f0" : "#e6f9ed", 
                color: isOffDuty ? "#ff4d49" : "#24d164", 
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
                { label: "Fleet Rating", value: boy.rating + " ★", color: "#ffb800" },
                { label: "Completed Orders", value: boy.orders, color: "#4318ff" },
                { label: "Accrued Tips", value: "₹" + boy.totalEarnings.toLocaleString(), color: "#24d164" }
              ].map((stat) => (
                <Grid item xs={4} key={stat.label}>
                  <Typography variant="h6" fontWeight="800" sx={{ color: stat.color }}>{stat.value}</Typography>
                  <Typography variant="caption" color="#a3aed0" fontWeight="700" sx={{ fontSize: "9px" }}>{stat.label.toUpperCase()}</Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Quick Contacts Card */}
          <Paper sx={{ mt: 3, p: 3, borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2" }}>
            <Typography variant="subtitle2" fontWeight="800" color="#1b2559" gutterBottom>Primary Contacts</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#f4f7fe" }}><PhoneIcon sx={{ fontSize: 16, color: "#4318ff" }} /></Avatar>
                    <Typography variant="body2" fontWeight="700" color="#475467">{boy.phone}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#f4f7fe" }}><EmailIcon sx={{ fontSize: 16, color: "#4318ff" }} /></Avatar>
                    <Typography variant="body2" fontWeight="700" color="#475467">{boy.email}</Typography>
                </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Right: Detailed Core Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ borderRadius: "24px", p: 4, boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2" }}>
            
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight="800" color="#1b2559">Documentation & Residency</Typography>
                <Typography variant="body2" color="#a3aed0">Verified Identification and Home Address Records</Typography>
            </Box>
            
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={0.5}>
                    <Typography variant="caption" color="#a3aed0" fontWeight="800">BASE OF OPERATIONS</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <LocationOnIcon sx={{ color: "#4318ff", fontSize: 18 }} />
                        <Typography variant="body1" fontWeight="700" color="#1b2559">{boy.city}</Typography>
                    </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={0.5}>
                    <Typography variant="caption" color="#a3aed0" fontWeight="800">RESIDENTIAL ADDRESS</Typography>
                    <Typography variant="body2" fontWeight="700" color="#475467">{boy.addressLine}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={0.5}>
                    <Typography variant="caption" color="#a3aed0" fontWeight="800">VERIFICATION TYPE</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <BadgeIcon sx={{ color: "#4318ff", fontSize: 18 }} />
                        <Typography variant="body1" fontWeight="700" color="#1b2559">{formatDeliveryBoyIdType(boy.idType)}</Typography>
                    </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={0.5}>
                    <Typography variant="caption" color="#a3aed0" fontWeight="800">DOCUMENT ID NUMBER</Typography>
                    <Typography variant="body1" fontWeight="800" color="#1b2559" sx={{ letterSpacing: 1 }}>{boy.idNumber}</Typography>
                </Stack>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 5, borderStyle: "dashed" }} />
            
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="800" color="#1b2559">Operational Context</Typography>
                <Typography variant="body2" color="#a3aed0">Assigned fulfillment hubs and logistics proof</Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ mb: 1, display: "block" }}>ASSIGNED FULFILLMENT HUBS</Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {boy.stores.length === 0 ? (
                            <Typography variant="body2" color="#a3aed0" italic>No specific store assignments found</Typography>
                        ) : (
                            boy.stores.map((store, i) => (
                                <Chip 
                                    key={i} 
                                    icon={<StorefrontIcon sx={{ fontSize: "14px !important" }} />}
                                    label={store} 
                                    sx={{ borderRadius: "10px", fontWeight: "700", bgcolor: "#f4f7fe", color: "#4318ff", border: "1px solid #e0e5f2" }} 
                                />
                            ))
                        )}
                    </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ mb: 1.5, display: "block" }}>ID DOC PREVIEW</Typography>
                    <Box 
                        sx={{ 
                            width: "100%", 
                            height: 140, 
                            borderRadius: "16px", 
                            backgroundColor: boy.idImage ? "transparent" : "#f4f7fe", 
                            display: "flex", 
                            flexDirection: "column",
                            justifyContent: "center", 
                            alignItems: "center",
                            border: boy.idImage ? "none" : "2px dashed #e0e5f2",
                            cursor: "pointer",
                            overflow: "hidden",
                            "&:hover": { borderColor: "#4318ff", opacity: 0.9 },
                            transition: "0.3s"
                        }}
                    >
                        {boy.idImage ? (
                             <img 
                                src={boy.idImage.startsWith("http") || boy.idImage.startsWith("data:") ? boy.idImage : `http://localhost:5001/uploads/${boy.idImage}`} 
                                alt="ID Document" 
                                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                onError={(e) => { 
                                    e.target.onerror = null; 
                                    e.target.src = `https://picsum.photos/seed/${boy.id}/400/200`; 
                                }}
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

export default DeliveryBoyDetails;

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Grid,
  TextField,
  Button,
  InputAdornment,
  Avatar
} from "@mui/material";
import {
  AccessTime as TimeIcon,
  DeliveryDining as DeliveryIcon,
  ShoppingBag as OrderIcon,
  MonetizationOn as IncentiveIcon,
  Save as SaveIcon
} from "@mui/icons-material";

const StoreSettings = () => {
  const [settings, setSettings] = useState({
    openingTime: "06:00",
    closingTime: "09:00",
    interval: "30",
    freeDeliveryLimit: "",
    deliveryCharge: "",
    minOrderValue: "",
    maxOrderValue: "",
    driverIncentive: ""
  });

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const orderPanelSx = {
    borderRadius: "24px",
    border: "1px solid #e0e5f2",
    bgcolor: "#fff",
    boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
  };

  const SettingCard = ({ title, icon: Icon, children }) => (
    <Paper sx={{ p: 4, ...orderPanelSx, height: "100%" }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Avatar sx={{ bgcolor: "#eef2ff", color: "#1b2559", width: 48, height: 48, borderRadius: "12px" }}>
           <Icon />
        </Avatar>
        <Typography variant="h5" fontWeight="900" color="#1b2559">{title}</Typography>
      </Stack>
      {children}
    </Paper>
  );

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        
        <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1b2559", mb: 0.5, letterSpacing: "-1.5px" }}>
               Store Settings
            </Typography>
            <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
               <TimeIcon sx={{ fontSize: 18 }} /> Settings Node • Operational Constraints
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{
              borderRadius: "14px",
              py: 1.5,
              px: 4,
              bgcolor: "#E53935",
              boxShadow: "0 10px 20px rgba(229, 57, 53, 0.2)",
              textTransform: "none",
              fontWeight: 900,
              fontSize: "15px",
              "&:hover": { bgcolor: "#d32f2f" }
            }}
          >
            Deploy Sync
          </Button>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <SettingCard title="Temporal Windows" icon={TimeIcon}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>Opening Aperture</Typography>
                  <TextField fullWidth type="time" name="openingTime" value={settings.openingTime} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>Closing Aperture</Typography>
                  <TextField fullWidth type="time" name="closingTime" value={settings.closingTime} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>Fulfillment Interval (Mins)</Typography>
                  <TextField fullWidth type="number" name="interval" value={settings.interval} onChange={handleChange} placeholder="30" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }} />
                </Grid>
              </Grid>
            </SettingCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <SettingCard title="Financial Logistics" icon={DeliveryIcon}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>Free Delivery Threshold (Rs.)</Typography>
                  <TextField fullWidth name="freeDeliveryLimit" value={settings.freeDeliveryLimit} onChange={handleChange} placeholder="enter minimum cart value" InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>Standard Dispatch Fee</Typography>
                  <TextField fullWidth name="deliveryCharge" value={settings.deliveryCharge} onChange={handleChange} placeholder="enter delivery charge" InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }} />
                </Box>
              </Stack>
            </SettingCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <SettingCard title="Transactional Limits" icon={OrderIcon}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>Minimum Payload</Typography>
                  <TextField fullWidth name="minOrderValue" value={settings.minOrderValue} onChange={handleChange} placeholder="Enter minimum order value" InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>Maximum Payload</Typography>
                  <TextField fullWidth name="maxOrderValue" value={settings.maxOrderValue} onChange={handleChange} placeholder="Enter maximum order value" InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }} />
                </Grid>
              </Grid>
            </SettingCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <SettingCard title="Personnel Incentive" icon={IncentiveIcon}>
              <Box>
                <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>Incentive Node (Rs) Per Order</Typography>
                <TextField fullWidth name="driverIncentive" value={settings.driverIncentive} onChange={handleChange} placeholder="Driver Incentive Per Order" InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }} />
              </Box>
            </SettingCard>
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 6 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              borderRadius: "18px",
              py: 2,
              px: 6,
              bgcolor: "#E53935",
              fontWeight: 900,
              fontSize: "16px",
              boxShadow: "0 10px 25px rgba(229, 57, 53,0.25)",
              textTransform: "none"
            }}
          >
            Save All Settings
          </Button>
        </Stack>

      </Box>
    </Box>
  );
};

export default StoreSettings;

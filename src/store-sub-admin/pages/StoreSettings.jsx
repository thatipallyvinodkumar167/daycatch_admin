import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Grid,
  TextField,
  Button,
  alpha,
  Divider,
  InputAdornment,
  MenuItem
} from "@mui/material";
import {
  Settings as SettingsIcon,
  AccessTime as TimeIcon,
  DeliveryDining as DeliveryIcon,
  ShoppingBag as OrderIcon,
  MonetizationOn as IncentiveIcon,
  Save as SaveIcon
} from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";

const StoreSettings = () => {
  const { store } = useOutletContext();
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

  const SettingCard = ({ title, icon: Icon, children }) => (
    <Paper sx={{ p: 4, borderRadius: "28px", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", height: "100%" }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Box sx={{ p: 1.5, borderRadius: "14px", bgcolor: alpha("#4318ff", 0.08) }}>
           <Icon sx={{ color: "#4318ff", fontSize: 24 }} />
        </Box>
        <Typography variant="h5" fontWeight="900" color="#1b2559">{title}</Typography>
      </Stack>
      {children}
    </Paper>
  );

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Box sx={{ maxWidth: "1420px", mx: "auto" }}>
        
        <Stack spacing={1} sx={{ mb: 5 }}>
          <Typography variant="h3" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1.5px" }}>
            Hi, {store.name}.
          </Typography>
          <Typography variant="body1" color="#a3aed0" fontWeight="700">
             Welcome to your Store Panel. Manage your store operations here.
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          {/* Store Time Slot */}
          <Grid item xs={12} md={6}>
            <SettingCard title="Store Time Slot" icon={TimeIcon}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>Store Opening Time</Typography>
                  <TextField fullWidth type="time" name="openingTime" value={settings.openingTime} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>Store Closing Time</Typography>
                  <TextField fullWidth type="time" name="closingTime" value={settings.closingTime} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>Interval (Minutes)</Typography>
                  <TextField fullWidth type="number" name="interval" value={settings.interval} onChange={handleChange} placeholder="30" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }} />
                </Grid>
              </Grid>
            </SettingCard>
          </Grid>

          {/* Delivery Charge Setting */}
          <Grid item xs={12} md={6}>
            <SettingCard title="Delivery Charge Setting" icon={DeliveryIcon}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>Free delivery cart value(Min)</Typography>
                  <TextField fullWidth name="freeDeliveryLimit" value={settings.freeDeliveryLimit} onChange={handleChange} placeholder="enter minimum cart value" InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>Delivery Charge</Typography>
                  <TextField fullWidth name="deliveryCharge" value={settings.deliveryCharge} onChange={handleChange} placeholder="enter delivery charge" InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }} />
                </Box>
              </Stack>
            </SettingCard>
          </Grid>

          {/* Order Value Setting */}
          <Grid item xs={12} md={6}>
            <SettingCard title="Order Value Setting" icon={OrderIcon}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>Minimum Value</Typography>
                  <TextField fullWidth name="minOrderValue" value={settings.minOrderValue} onChange={handleChange} placeholder="Enter minimum order value" InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>Maximum Value</Typography>
                  <TextField fullWidth name="maxOrderValue" value={settings.maxOrderValue} onChange={handleChange} placeholder="Enter maximum order value" InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }} />
                </Grid>
              </Grid>
            </SettingCard>
          </Grid>

          {/* Driver Incentive */}
          <Grid item xs={12} md={6}>
            <SettingCard title="Driver Incentive" icon={IncentiveIcon}>
              <Box>
                <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>Driver Incentive (Rs) Per Order</Typography>
                <TextField fullWidth name="driverIncentive" value={settings.driverIncentive} onChange={handleChange} placeholder="Driver Incentive Per Order" InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }} />
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
              bgcolor: "#4318ff",
              fontWeight: 900,
              fontSize: "16px",
              boxShadow: "0 10px 25px rgba(67,24,255,0.25)",
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

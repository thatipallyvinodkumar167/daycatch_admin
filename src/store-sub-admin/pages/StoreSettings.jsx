import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  AccessTime as TimeIcon,
  DeliveryDining as DeliveryIcon,
  MonetizationOn as IncentiveIcon,
  Save as SaveIcon,
  ShoppingBag as OrderIcon,
} from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { storeWorkspaceApi } from "../../api/storeWorkspaceApi";

const DEFAULT_SETTINGS = {
  openingTime: "06:00",
  closingTime: "21:00",
  interval: "30",
  freeDeliveryLimit: "",
  deliveryCharge: "",
  minOrderValue: "",
  maxOrderValue: "",
  driverIncentive: "",
};

const StoreSettings = () => {
  const { store } = useOutletContext();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((current) => ({ ...current, [name]: value }));
  };

  const showSnackbar = (severity, message) => {
    setSnackbar({ open: true, severity, message });
  };

  useEffect(() => {
    const fetchSettings = async () => {
      if (!store?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await storeWorkspaceApi.getSettings(store.id);
        const data = response?.data?.data || {};
        setSettings({
          openingTime: data.openingTime || DEFAULT_SETTINGS.openingTime,
          closingTime: data.closingTime || DEFAULT_SETTINGS.closingTime,
          interval: String(data.interval ?? DEFAULT_SETTINGS.interval),
          freeDeliveryLimit:
            data.freeDeliveryLimit != null ? String(data.freeDeliveryLimit) : DEFAULT_SETTINGS.freeDeliveryLimit,
          deliveryCharge:
            data.deliveryCharge != null ? String(data.deliveryCharge) : DEFAULT_SETTINGS.deliveryCharge,
          minOrderValue:
            data.minOrderValue != null ? String(data.minOrderValue) : DEFAULT_SETTINGS.minOrderValue,
          maxOrderValue:
            data.maxOrderValue != null ? String(data.maxOrderValue) : DEFAULT_SETTINGS.maxOrderValue,
          driverIncentive:
            data.driverIncentive != null ? String(data.driverIncentive) : DEFAULT_SETTINGS.driverIncentive,
        });
      } catch (error) {
        console.error("Failed to load store settings:", error);
        showSnackbar("error", "Unable to load store settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [store?.id]);

  const handleSave = async () => {
    if (!store?.id) {
      showSnackbar("error", "Store information is missing.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        openingTime: settings.openingTime,
        closingTime: settings.closingTime,
        interval: Number(settings.interval || 0),
        freeDeliveryLimit: Number(settings.freeDeliveryLimit || 0),
        deliveryCharge: Number(settings.deliveryCharge || 0),
        minOrderValue: Number(settings.minOrderValue || 0),
        maxOrderValue: Number(settings.maxOrderValue || 0),
        driverIncentive: Number(settings.driverIncentive || 0),
      };

      const response = await storeWorkspaceApi.updateSettings(store.id, payload);
      const data = response?.data?.data || payload;
      setSettings({
        openingTime: data.openingTime || payload.openingTime,
        closingTime: data.closingTime || payload.closingTime,
        interval: String(data.interval ?? payload.interval),
        freeDeliveryLimit: String(data.freeDeliveryLimit ?? payload.freeDeliveryLimit),
        deliveryCharge: String(data.deliveryCharge ?? payload.deliveryCharge),
        minOrderValue: String(data.minOrderValue ?? payload.minOrderValue),
        maxOrderValue: String(data.maxOrderValue ?? payload.maxOrderValue),
        driverIncentive: String(data.driverIncentive ?? payload.driverIncentive),
      });
      showSnackbar("success", "Store settings saved successfully.");
    } catch (error) {
      console.error("Failed to save store settings:", error);
      showSnackbar(
        "error",
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Unable to save store settings."
      );
    } finally {
      setSaving(false);
    }
  };

  const orderPanelSx = useMemo(
    () => ({
      borderRadius: "24px",
      border: "1px solid #e0e5f2",
      bgcolor: "#fff",
      boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
    }),
    []
  );

  const SettingCard = ({ title, icon: Icon, children }) => (
    <Paper sx={{ p: 4, ...orderPanelSx, height: "100%" }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Avatar sx={{ bgcolor: "#eef2ff", color: "#1b2559", width: 48, height: 48, borderRadius: "12px" }}>
          <Icon />
        </Avatar>
        <Typography variant="h5" fontWeight="900" color="#1b2559">
          {title}
        </Typography>
      </Stack>
      {children}
    </Paper>
  );

  if (loading) {
    return (
      <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress sx={{ color: "#E53935" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1b2559", mb: 0.5, letterSpacing: "-1.5px" }}>
              Store Settings
            </Typography>
            <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
              <TimeIcon sx={{ fontSize: 18 }} /> Settings Node • Operational Constraints for {store?.name}
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            sx={{
              borderRadius: "14px",
              py: 1.5,
              px: 4,
              bgcolor: "#E53935",
              boxShadow: "0 10px 20px rgba(229, 57, 53, 0.2)",
              textTransform: "none",
              fontWeight: 900,
              fontSize: "15px",
              "&:hover": { bgcolor: "#d32f2f" },
            }}
          >
            {saving ? "Saving..." : "Deploy Sync"}
          </Button>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <SettingCard title="Temporal Windows" icon={TimeIcon}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>
                    Opening Aperture
                  </Typography>
                  <TextField fullWidth type="time" name="openingTime" value={settings.openingTime} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>
                    Closing Aperture
                  </Typography>
                  <TextField fullWidth type="time" name="closingTime" value={settings.closingTime} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>
                    Fulfillment Interval (Mins)
                  </Typography>
                  <TextField fullWidth type="number" name="interval" value={settings.interval} onChange={handleChange} placeholder="30" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }} />
                </Grid>
              </Grid>
            </SettingCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <SettingCard title="Financial Logistics" icon={DeliveryIcon}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>
                    Free Delivery Threshold (Rs.)
                  </Typography>
                  <TextField fullWidth name="freeDeliveryLimit" value={settings.freeDeliveryLimit} onChange={handleChange} placeholder="enter minimum cart value" InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>
                    Standard Dispatch Fee
                  </Typography>
                  <TextField fullWidth name="deliveryCharge" value={settings.deliveryCharge} onChange={handleChange} placeholder="enter delivery charge" InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }} />
                </Box>
              </Stack>
            </SettingCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <SettingCard title="Transactional Limits" icon={OrderIcon}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>
                    Minimum Payload
                  </Typography>
                  <TextField fullWidth name="minOrderValue" value={settings.minOrderValue} onChange={handleChange} placeholder="Enter minimum order value" InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>
                    Maximum Payload
                  </Typography>
                  <TextField fullWidth name="maxOrderValue" value={settings.maxOrderValue} onChange={handleChange} placeholder="Enter maximum order value" InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }} />
                </Grid>
              </Grid>
            </SettingCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <SettingCard title="Personnel Incentive" icon={IncentiveIcon}>
              <Box>
                <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>
                  Incentive Node (Rs) Per Order
                </Typography>
                <TextField fullWidth name="driverIncentive" value={settings.driverIncentive} onChange={handleChange} placeholder="Driver Incentive Per Order" InputProps={{ startAdornment: <InputAdornment position="start">Rs.</InputAdornment> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }} />
              </Box>
            </SettingCard>
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 6 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
            sx={{
              borderRadius: "18px",
              py: 2,
              px: 6,
              bgcolor: "#E53935",
              fontWeight: 900,
              fontSize: "16px",
              boxShadow: "0 10px 25px rgba(229, 57, 53,0.25)",
              textTransform: "none",
            }}
          >
            {saving ? "Saving..." : "Save All Settings"}
          </Button>
        </Stack>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
          sx={{ borderRadius: "14px", fontWeight: 800 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StoreSettings;

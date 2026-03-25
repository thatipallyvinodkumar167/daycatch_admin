import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  IconButton,
  Avatar,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import {
  ShoppingCart as OrderIcon,
  Payments as RevenueIcon,
  Inventory2 as ProductIcon,
  SupportAgent as CallbackIcon,
  NotificationsActive as NotificationIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreIcon,
  Speed as PerformanceIcon,
} from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { storeWorkspaceApi } from "../../api/storeWorkspaceApi";

const StoreDetails = () => {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    callbackCount: 0,
    fulfillmentRate: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navy = "#1b2559";
  const red = "#E53935";

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await storeWorkspaceApi.getDashboard(store?.id);
      const data = response?.data?.data || response?.data || {};

      setDashboardData({
        totalOrders: data.totalOrders || 0,
        totalRevenue: data.totalRevenue || 0,
        totalProducts: data.totalProducts || 0,
        callbackCount: data.callbackCount || 0,
        fulfillmentRate: data.fulfillmentRate || 0,
        recentOrders: data.recentOrders || [],
      });
    } catch (err) {
      console.error("Dashboard Dynamic Sync Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [store?.id]);

  useEffect(() => {
    if (store?.id) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchDashboardData, store?.id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "80vh", gap: 3 }}>
        <CircularProgress size={60} thickness={4} sx={{ color: red }} />
        <Typography variant="body1" fontWeight="700" color="#a3aed0">Loading store data...</Typography>
      </Box>
    );
  }

  const kpiCards = [
    {
      label: "Total Orders",
      value: dashboardData.totalOrders,
      icon: <OrderIcon sx={{ fontSize: 24 }} />,
      color: red,
      route: "../orders",
    },
    {
      label: "Total Revenue",
      value: `Rs. ${Number(dashboardData.totalRevenue).toLocaleString()}`,
      icon: <RevenueIcon sx={{ fontSize: 24 }} />,
      color: "#05cd99",
      route: "../reports",
    },
    {
      label: "Products",
      value: dashboardData.totalProducts,
      icon: <ProductIcon sx={{ fontSize: 24 }} />,
      color: "#ffb547",
      route: "../products",
    },
    {
      label: "Fulfillment",
      value: `${dashboardData.fulfillmentRate}%`,
      icon: <PerformanceIcon sx={{ fontSize: 24 }} />,
      color: navy,
      route: "../orders",
    },
  ];

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>

        {/* Header */}
        <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: navy, mb: 0.5, letterSpacing: "-1.5px" }}>
              {store?.name || "Store Dashboard"}
            </Typography>
            <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>
              Operational overview for your store workspace.
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <Tooltip title={refreshing ? "Refreshing..." : "Refresh Data"}>
              <IconButton
                onClick={() => fetchDashboardData(true)}
                disabled={refreshing}
                sx={{ bgcolor: "#fff", border: "1px solid #e0e5f2", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", "&:hover": { bgcolor: "#f4f7fe" } }}
              >
                <RefreshIcon sx={{ color: navy, animation: refreshing ? "spin 1.5s linear infinite" : "none" }} />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              onClick={() => navigate("../orders")}
              sx={{ borderRadius: "14px", bgcolor: red, fontWeight: 900, textTransform: "none", px: 3, py: 1.5, fontSize: "15px", boxShadow: "0 10px 20px rgba(229,57,53,0.2)", "&:hover": { bgcolor: "#d32f2f" } }}
            >
              View Orders
            </Button>
          </Stack>
        </Box>

        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {kpiCards.map((card, i) => (
            <Grid item xs={12} sm={6} lg={3} key={i}>
              <Paper
                onClick={() => navigate(card.route)}
                sx={{
                  p: 3.5,
                  borderRadius: "24px",
                  border: "1px solid #e0e5f2",
                  bgcolor: "#fff",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: "0 20px 50px rgba(0,0,0,0.08)" },
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box sx={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, bgcolor: alpha(card.color, 0.04), borderRadius: "50%" }} />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box sx={{ p: 1.5, borderRadius: "14px", bgcolor: alpha(card.color, 0.08), color: card.color, display: "flex" }}>
                    {card.icon}
                  </Box>
                  <IconButton size="small" sx={{ color: "#a3aed0" }}>
                    <MoreIcon fontSize="small" />
                  </IconButton>
                </Stack>
                <Typography variant="caption" sx={{ mt: 3, display: "block", fontWeight: 900, color: "#a3aed0", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                  {card.label}
                </Typography>
                <Typography variant="h4" sx={{ mt: 0.5, fontWeight: 900, color: navy, letterSpacing: "-1px" }}>
                  {card.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, borderRadius: "24px", border: "1px solid #e0e5f2", bgcolor: "#fff", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: navy, mb: 1, letterSpacing: "-1px" }}>Recent Activity</Typography>
              <Typography variant="body2" sx={{ color: "#a3aed0", fontWeight: 700, mb: 4 }}>Latest operational threads from your store.</Typography>

              {dashboardData.recentOrders.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <OrderIcon sx={{ fontSize: 48, color: "#e0e5f2", mb: 2 }} />
                  <Typography variant="body1" color="#a3aed0" fontWeight="700">No recent orders to display.</Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {dashboardData.recentOrders.slice(0, 5).map((order, i) => (
                    <Box key={i} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderRadius: "14px", bgcolor: "#f8f9fc" }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: alpha(red, 0.1), color: red, borderRadius: "10px" }}>
                          <OrderIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="800" color={navy}>#{order.id || "N/A"}</Typography>
                          <Typography variant="caption" color="#a3aed0" fontWeight="700">{order.customer || "Unknown"}</Typography>
                        </Box>
                      </Stack>
                      <Chip
                        label={order.status || "Pending"}
                        size="small"
                        sx={{ bgcolor: alpha("#05cd99", 0.1), color: "#05cd99", fontWeight: 800, borderRadius: "8px" }}
                      />
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, borderRadius: "24px", bgcolor: navy, color: "#fff", boxShadow: "0 20px 50px rgba(27,37,89,0.2)", position: "relative", overflow: "hidden", height: "100%" }}>
              <Box sx={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, bgcolor: alpha("#fff", 0.06), borderRadius: "50%" }} />
              <Box sx={{ position: "absolute", bottom: -40, left: -40, width: 180, height: 180, bgcolor: alpha("#fff", 0.04), borderRadius: "50%" }} />

              <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, position: "relative", letterSpacing: "-1px" }}>Quick Actions</Typography>
              <Typography variant="body2" sx={{ mb: 4, opacity: 0.7, fontWeight: 600, position: "relative" }}>Navigate your store control nodes.</Typography>

              <Stack spacing={2} sx={{ position: "relative" }}>
                {[
                  { label: "Notifications", icon: <NotificationIcon />, route: "../send-notifications" },
                  { label: "Callbacks", icon: <CallbackIcon />, route: "../callback-requests" },
                  { label: "Products", icon: <ProductIcon />, route: "../products" },
                ].map((action, i) => (
                  <Button
                    key={i}
                    fullWidth
                    variant="outlined"
                    startIcon={action.icon}
                    onClick={() => navigate(action.route)}
                    sx={{
                      borderColor: "rgba(255,255,255,0.2)",
                      color: "#fff",
                      fontWeight: 800,
                      textTransform: "none",
                      borderRadius: "12px",
                      py: 1.5,
                      justifyContent: "flex-start",
                      "&:hover": { bgcolor: alpha("#fff", 0.08), borderColor: "rgba(255,255,255,0.4)" }
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate("../orders")}
                  sx={{ bgcolor: red, color: "#fff", fontWeight: 900, textTransform: "none", borderRadius: "12px", py: 1.5, boxShadow: "0 10px 20px rgba(229,57,53,0.3)", "&:hover": { bgcolor: "#d32f2f" } }}
                >
                  View All Orders
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
};

export default StoreDetails;
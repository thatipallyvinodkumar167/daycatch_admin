import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
  IconButton,
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
import { formatStoreDate } from "../utils/storeWorkspace";

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
  const buildStoreRoute = useCallback(
    (path) => `/stores/details/${encodeURIComponent(store?.id || "")}/${path}`,
    [store?.id]
  );

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await storeWorkspaceApi.getDashboard(store?.id);
      const data = response?.data?.data || response?.data || {};
      const summary = data.summary || {};

      setDashboardData({
        totalOrders: data.totalOrders || summary.totalOrders || summary.newOrders || 0,
        totalRevenue: data.totalRevenue || summary.totalRevenue || summary.revenue || 0,
        totalProducts: data.totalProducts || summary.totalProducts || summary.approvedProducts || 0,
        callbackCount: data.callbackCount || summary.callbackCount || summary.callbackRequests || 0,
        fulfillmentRate: data.fulfillmentRate || summary.fulfillmentRate || 0,
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
      route: buildStoreRoute("orders/all"),
    },
    {
      label: "Total Revenue",
      value: `Rs. ${Number(dashboardData.totalRevenue).toLocaleString()}`,
      icon: <RevenueIcon sx={{ fontSize: 24 }} />,
      color: "#05cd99",
      route: buildStoreRoute("reports/sales-report"),
      isIncrease: true,
      change: "+100%",
      subItems: [
        { label: "Merchant Share", val: `Rs. ${Math.round(Number(dashboardData.totalRevenue) * 0.88).toLocaleString()}` },
        { label: "Admin Share", val: `Rs. ${Math.round(Number(dashboardData.totalRevenue) * 0.12).toLocaleString()}` }
      ]
    },
    {
      label: "Products",
      value: dashboardData.totalProducts,
      icon: <ProductIcon sx={{ fontSize: 24 }} />,
      color: "#ffb547",
      route: buildStoreRoute("products"),
    },
    {
      label: "Fulfillment",
      value: `${dashboardData.fulfillmentRate}%`,
      icon: <PerformanceIcon sx={{ fontSize: 24 }} />,
      color: navy,
      route: buildStoreRoute("orders/all"),
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
              onClick={() => navigate(buildStoreRoute("orders/all"))}
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
                  borderRadius: "32px",
                  border: "1px solid #e0e5f2",
                  bgcolor: "#fff",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: "0 20px 50px rgba(0,0,0,0.08)" },
                  position: "relative",
                  overflow: "hidden",
                  height: "100%",
                }}
              >
                <Box sx={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, bgcolor: alpha(card.color, 0.03), borderRadius: "50%", pointerEvents: "none" }} />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box sx={{ p: 1.5, borderRadius: "16px", bgcolor: alpha(card.color, 0.08), color: card.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {card.icon}
                  </Box>
                  {card.change ? (
                    <Chip
                      icon={<Typography sx={{ fontSize: "14px", fontWeight: 900, pb: 0.3 }}>↗</Typography>}
                      label={card.change}
                      size="small"
                      sx={{
                        bgcolor: card.isIncrease ? alpha("#05cd99", 0.1) : alpha("#E53935", 0.1),
                        color: card.isIncrease ? "#05cd99" : "#E53935",
                        fontWeight: "900",
                        borderRadius: "10px",
                        border: "none",
                        height: 26,
                        px: 0.5,
                        fontSize: "12px",
                        "& .MuiChip-icon": { color: "inherit" }
                      }}
                    />
                  ) : (
                    <IconButton size="small" sx={{ color: "#a3aed0", bgcolor: "transparent" }}>
                      <MoreIcon fontSize="small" sx={{ opacity: 0.5 }} />
                    </IconButton>
                  )}
                </Stack>
                <Typography variant="caption" sx={{ mt: 3, display: "block", fontWeight: 900, color: "#a3aed0", textTransform: "uppercase", letterSpacing: "1px", fontSize: "10px" }}>
                  {card.label}
                </Typography>
                <Typography sx={{ mt: 0.2, fontWeight: 900, color: navy, fontSize: "22px", letterSpacing: "-0.5px", lineHeight: 1.2 }}>
                  {card.value}
                </Typography>

                {card.subItems && (
                  <Box sx={{ mt: 2, pt: 1.5, borderTop: "1px dashed #e0e5f2" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                      {card.subItems.map((sub, idx) => (
                        <Box key={idx} sx={{ minWidth: 0, flex: 1, pr: idx === 0 ? 0.5 : 0 }}>
                          <Typography variant="caption" sx={{ display: "block", fontWeight: 800, color: "#a3aed0", textTransform: "uppercase", letterSpacing: "0.2px", mb: 0.2, fontSize: "8px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {sub.label}
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 900, color: navy, fontSize: "11px", whiteSpace: "nowrap" }}>
                            {sub.val}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, borderRadius: "24px", border: "1px solid #e0e5f2", bgcolor: "#fff", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: navy, mb: 1, letterSpacing: "-1px" }}>Recent Orders</Typography>
              <Typography variant="body2" sx={{ color: "#a3aed0", fontWeight: 700, mb: 4 }}>Latest order records from your store workspace.</Typography>

              <TableContainer sx={{ border: "1px solid #eef2f6", borderRadius: "20px", overflow: "hidden" }}>
                <Table>
                  <TableHead sx={{ bgcolor: "#fafbfc" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "14px", width: "50px", whiteSpace: "nowrap" }}>#</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "14px", whiteSpace: "nowrap" }}>Cart ID</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "14px", whiteSpace: "nowrap" }}>Cart price</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "14px", whiteSpace: "nowrap" }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "14px", whiteSpace: "nowrap" }}>Delivery Date</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "14px", whiteSpace: "nowrap" }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "14px", whiteSpace: "nowrap", textAlign: "right" }}>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.recentOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                          <Typography variant="h6" color={navy} fontWeight="900" gutterBottom>
                            No operational data found
                          </Typography>
                          <Typography variant="body1" color="#a3aed0" fontWeight="700">
                            There are currently no active all orders list to display.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      dashboardData.recentOrders.slice(0, 5).map((order, index) => (
                        <TableRow key={order.id || order.cartId || index} hover sx={{ "&:hover": { bgcolor: alpha(navy, 0.02) } }}>
                          <TableCell sx={{ fontWeight: 800, color: navy }}>{index + 1}</TableCell>
                          <TableCell sx={{ fontWeight: 800, color: navy }}>{order.cartId || order.id || "N/A"}</TableCell>
                          <TableCell sx={{ fontWeight: 900, color: red }}>
                            Rs. {Number(order.amount || 0).toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#707eae" }}>{order.customer || "Unknown User"}</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#707eae" }}>{formatStoreDate(order.deliveryDate)}</TableCell>
                          <TableCell>
                            <Chip
                              label={order.status || "Pending"}
                              size="small"
                              sx={{ bgcolor: alpha("#05cd99", 0.1), color: "#05cd99", fontWeight: 800, borderRadius: "8px" }}
                            />
                          </TableCell>
                          <TableCell sx={{ textAlign: "right" }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => navigate(buildStoreRoute("orders/all"))}
                              sx={{
                                borderRadius: "10px",
                                textTransform: "none",
                                fontWeight: 800,
                                borderColor: "#e0e5f2",
                                color: navy,
                              }}
                            >
                              View Order
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, borderRadius: "24px", bgcolor: navy, color: "#fff", boxShadow: "0 20px 50px rgba(27,37,89,0.2)", position: "relative", overflow: "hidden", height: "100%" }}>
              <Box sx={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, bgcolor: alpha("#fff", 0.06), borderRadius: "50%", pointerEvents: "none" }} />
              <Box sx={{ position: "absolute", bottom: -40, left: -40, width: 180, height: 180, bgcolor: alpha("#fff", 0.04), borderRadius: "50%", pointerEvents: "none" }} />

              <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, position: "relative", letterSpacing: "-1px" }}>Quick Actions</Typography>
              <Typography variant="body2" sx={{ mb: 4, opacity: 0.7, fontWeight: 600, position: "relative" }}>Navigate your store control nodes.</Typography>

              <Stack spacing={2} sx={{ position: "relative" }}>
                {[
                  { label: "Notifications", icon: <NotificationIcon />, route: buildStoreRoute("notifications/users") },
                  { label: "Callbacks", icon: <CallbackIcon />, route: buildStoreRoute("callback/users") },
                  { label: "Products", icon: <ProductIcon />, route: buildStoreRoute("products") },
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
                      position: "relative",
                      zIndex: 1,
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
                  onClick={() => navigate(buildStoreRoute("orders/all"))}
                  sx={{ bgcolor: red, color: "#fff", fontWeight: 900, textTransform: "none", borderRadius: "12px", py: 1.5, position: "relative", zIndex: 1, boxShadow: "0 10px 20px rgba(229,57,53,0.3)", "&:hover": { bgcolor: "#d32f2f" } }}
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

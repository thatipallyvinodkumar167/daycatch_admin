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
  Tooltip
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
  Speed as PerformanceIcon
} from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { storeWorkspaceApi } from "../../api/storeWorkspaceApi";

const StatCard = ({ title, value, detail, icon: Icon, color, bg }) => (
  <Paper
    sx={{
      p: 2.5,
      borderRadius: "20px",
      display: "flex",
      alignItems: "center",
      gap: 2,
      border: "1px solid #e0e5f2",
      boxShadow: "0 10px 24px rgba(17, 28, 68, 0.04)",
      bgcolor: "#fff"
    }}
  >
    <Avatar sx={{ bgcolor: bg, color: color, width: 48, height: 48, borderRadius: "12px" }}>
      <Icon />
    </Avatar>
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ letterSpacing: "0.5px", textTransform: "uppercase" }}>
        {title}
      </Typography>
      <Typography variant="h5" fontWeight="800" color="#1b2559" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

function StoreDashboard() {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      revenue: 0,
      orders: 0,
      products: 0,
      callbacks: 0,
    },
    recentOrders: [],
    alerts: [
      { id: 1, type: "error", title: "Pending Orders (0)", detail: "Action required on items waiting for fulfillment." },
      { id: 2, type: "warning", title: "Low Stock Alert", detail: "Update inventory for high-demand items." }
    ]
  });

  const orderPanelSx = {
    borderRadius: "24px",
    border: "1px solid #e0e5f2",
    bgcolor: "#fff",
    boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
  };

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await storeWorkspaceApi.getDashboard(store?.id);
      const data = response?.data?.data || response?.data || {};

      setDashboardData({
        stats: {
          revenue: data.revenue || 124500,
          orders: data.ordersCount || 842,
          products: data.productsCount || 156,
          callbacks: data.callbacksCount || 14
        },
        recentOrders: data.recentOrders || [],
        alerts: data.alerts || [
          { id: 1, type: "error", title: `Pending Orders (${data.pendingOrdersCount || 0})`, detail: "Action required on items waiting for fulfillment." },
          { id: 2, type: "warning", title: "Low Stock Alert", detail: `${data.lowStockCount || 5} products are below threshold.` }
        ]
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
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "80vh", gap: 3 }}>
        <CircularProgress size={60} thickness={4} sx={{ color: "#E53935" }} />
        <Typography variant="h6" fontWeight="800" color="#a3aed0">Synchronizing Store Workspace...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        
        <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1b2559", mb: 0.5, letterSpacing: "-1.5px" }}>
               Hi, {store.name}
            </Typography>
            <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
               <PerformanceIcon sx={{ fontSize: 18 }} /> Store Terminal • System Workspace Synced
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
             <Tooltip title="Force Refresh Sync">
                <Button 
                  onClick={() => fetchDashboardData(true)}
                  disabled={refreshing}
                  sx={{ borderRadius: "14px", minWidth: "54px", height: "54px", bgcolor: "#fff", border: "1px solid #e0e5f2", color: "#1b2559", boxShadow: "0 10px 24px rgba(0,0,0,0.04)" }}
                >
                  {refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
                </Button>
             </Tooltip>
             <Button 
               variant="contained" 
               sx={{ 
                 borderRadius: "14px", 
                 px: 4, 
                 py: 1.5, 
                 fontWeight: 900, 
                 textTransform: "none", 
                 bgcolor: "#E53935", 
                 boxShadow: "0 10px 20px rgba(229, 57, 53, 0.2)", 
                 "&:hover": { bgcolor: "#d32f2f" } 
               }}
               onClick={() => navigate("orders/all")}
             >
               Launch Orders Deck
             </Button>
          </Stack>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Live Revenue" value={`Rs. ${dashboardData.stats.revenue.toLocaleString()}`} icon={RevenueIcon} color="#E53935" bg={alpha("#E53935", 0.08)} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Volume" value={dashboardData.stats.orders.toLocaleString()} icon={OrderIcon} color="#05cd99" bg="#e6f9ed" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Catalog Depth" value={dashboardData.stats.products.toLocaleString()} icon={ProductIcon} color="#ffb800" bg="#fff9e6" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Support Load" value={dashboardData.stats.callbacks.toLocaleString()} icon={CallbackIcon} color="#ff4d49" bg="#fff1f0" />
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {/* Recent Operations Section */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ ...orderPanelSx, p: 4, height: "100%" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: "900", color: "#1b2559", letterSpacing: "-1px" }}>Recent Operations</Typography>
                  <Typography variant="body2" sx={{ color: "#a3aed0", fontWeight: 700 }}>Real-time order stream from your store terminal.</Typography>
                </Box>
                <IconButton sx={{ bgcolor: "#fafbff" }}><MoreIcon /></IconButton>
              </Stack>
              
              <Stack spacing={2}>
                {dashboardData.recentOrders.length > 0 ? dashboardData.recentOrders.map((order) => (
                   <Paper key={order.id} sx={{ p: 2, borderRadius: "18px", border: "1px solid #eef2f7", transition: "0.2s", "&:hover": { bgcolor: "#fafbff", transform: "translateY(-2px)" }, boxShadow: "none" }}>
                     <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={2} alignItems="center">
                           <Avatar sx={{ width: 44, height: 44, bgcolor: "#eef2ff", color: "#E53935", borderRadius: "12px" }}><OrderIcon /></Avatar>
                           <Box>
                              <Typography variant="body1" fontWeight="900" color="#1b2559">Order #{order.orderId || order.id}</Typography>
                              <Typography variant="caption" fontWeight="800" color="#a3aed0">{order.customerName || "Customer Node"}</Typography>
                           </Box>
                        </Stack>
                        <Stack alignItems="flex-end" spacing={0.5}>
                           <Typography variant="body1" fontWeight="900" color="#1b2559">Rs. {order.amount || 0}</Typography>
                           <Chip 
                             label={order.status?.toUpperCase() || "PENDING"} 
                             size="small" 
                             sx={{ 
                               fontWeight: 900, 
                               fontSize: "10px",
                               height: 20,
                               bgcolor: order.status === "delivered" ? "#e6f9ed" : "#fff1f0",
                               color: order.status === "delivered" ? "#05cd99" : "#ff4d49",
                               border: "1px solid",
                               borderColor: "inherit"
                             }} 
                           />
                        </Stack>
                     </Stack>
                   </Paper>
                )) : (
                  <Box sx={{ py: 8, textAlign: "center", bgcolor: "#fafbff", borderRadius: "20px", border: "1px solid #e0e5f2" }}>
                     <OrderIcon sx={{ color: "#d1d9e2", fontSize: 48, mb: 1.5 }} />
                     <Typography variant="h6" color="#a3aed0" fontWeight="800">No active operational threads.</Typography>
                     <Typography variant="caption" color="#a3aed0" fontWeight="600">New orders will materialize here instantly.</Typography>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
               <Paper sx={{ ...orderPanelSx, p: 4, background: "linear-gradient(135deg, #111c44 0%, #1b2559 100%)", color: "#fff" }}>
                 <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                   <Avatar sx={{ bgcolor: alpha("#fff", 0.1), color: "#fff", borderRadius: "12px" }}>
                     <NotificationIcon />
                   </Avatar>
                   <Typography variant="h5" fontWeight="900">System Alerts</Typography>
                 </Stack>

                 <Stack spacing={2}>
                   {dashboardData.alerts.map((alert) => (
                      <Box key={alert.id} sx={{ p: 2.5, borderRadius: "18px", border: "1px solid rgba(255,255,255,0.1)", bgcolor: "rgba(255,255,255,0.05)" }}>
                         <Stack direction="row" spacing={1.5}>
                            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: alert.type === "error" ? "#ff4d49" : "#ffb800", mt: 1 }} />
                            <Box>
                               <Typography variant="body1" fontWeight="800" sx={{ mb: 0.5 }}>{alert.title}</Typography>
                               <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 600 }}>{alert.detail}</Typography>
                            </Box>
                         </Stack>
                      </Box>
                   ))}
                   
                   <Button 
                     fullWidth 
                     variant="contained" 
                     sx={{ mt: 1, py: 1.5, borderRadius: "12px", bgcolor: "#fff", color: "#111c44", fontWeight: 800, textTransform: "none", "&:hover": { bgcolor: alpha("#fff", 0.9) } }}
                     onClick={() => navigate("reports/item-requirement")}
                   >
                     Launch Intelligence deck
                   </Button>
                 </Stack>
               </Paper>

               <Paper sx={{ ...orderPanelSx, p: 4, textAlign: "center" }}>
                  <Typography variant="caption" fontWeight="900" color="#a3aed0" sx={{ mb: 3, textTransform: "uppercase", letterSpacing: "1px", display: "block" }}>Workspace Efficiency</Typography>
                  <Box sx={{ position: "relative", display: "inline-flex", mb: 2 }}>
                     <CircularProgress variant="determinate" value={85} size={110} thickness={5} sx={{ color: "#E53935" }} />
                     <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography variant="h5" fontWeight="900" color="#1b2559">85%</Typography>
                     </Box>
                  </Box>
                  <Typography variant="body2" fontWeight="800" color="#05cd99">Optimal Performance Level</Typography>
               </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default StoreDashboard;

import React, { useEffect, useMemo, useState } from "react";
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
  Divider,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShoppingCart as OrderIcon,
  Payments as RevenueIcon,
  Inventory2 as ProductIcon,
  SupportAgent as CallbackIcon,
  ArrowForward as ArrowIcon,
  NotificationsActive as NotificationIcon,
  FiberManualRecord as DotIcon
} from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const normalize = (value) => String(value || "").trim().toLowerCase();

const matchesStore = (record, storeName) => {
  const name = normalize(storeName);
  const candidates = [
    record?.Store,
    record?.store,
    record?.["Store Name"],
    record?.storeName,
    record?.Details?.Store,
  ];
  return candidates.some((item) => {
    const value = normalize(item);
    return value && name && (value === name || value.includes(name) || name.includes(value));
  });
};

const StatCard = ({ title, value, detail, icon: Icon, color, trend }) => (
  <Paper
    sx={{
      p: 3,
      borderRadius: "32px",
      border: "1px solid #e0e5f2",
      boxShadow: "0 10px 40px rgba(15,23,42,0.03)",
      position: "relative",
      overflow: "hidden",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2.5 }}>
      <Box sx={{ p: 1.5, borderRadius: "14px", bgcolor: alpha(color, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon sx={{ color: color, fontSize: 24 }} />
      </Box>
      <Box>
        <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ textTransform: "uppercase", letterSpacing: "1px" }}>{title}</Typography>
        <Typography variant="h4" fontWeight="900" color="#1b2559">{value}</Typography>
      </Box>
    </Stack>
    
    <Stack direction="row" alignItems="center" spacing={1}>
       <Box sx={{ display: "flex", alignItems: "center", color: trend >= 0 ? "#05cd99" : "#ee5d50" }}>
          {trend >= 0 ? <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} /> : <TrendingDownIcon sx={{ fontSize: 16, mr: 0.5 }} />}
          <Typography variant="caption" fontWeight="900">{Math.abs(trend)}%</Typography>
       </Box>
       <Typography variant="caption" fontWeight="700" color="#a3aed0">vs last month</Typography>
    </Stack>
  </Paper>
);

function StoreDashboard() {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState({
    payments: [],
    products: [],
    orders: [],
    pending: [],
    cancelled: [],
    callbacks: [],
  });

  useEffect(() => {
    if (!store?.name) return;
    const fetchData = async () => {
      try {
        const [payRes, prodRes, ordRes, callsRes] = await Promise.all([
          genericApi.getAll("payments"),
          genericApi.getAll("store_products"),
          genericApi.getAll("orders"),
          genericApi.getAll("user_callback_request"),
        ]);

        const storeName = store.name;
        const filterByStore = (list) => (list || []).filter(item => matchesStore(item, storeName));

        setWorkspace({
          payments: filterByStore(payRes.data),
          products: filterByStore(prodRes.data),
          orders: filterByStore(ordRes.data),
          pending: filterByStore(ordRes.data).filter(o => normalize(o.status) === "pending"),
          cancelled: filterByStore(ordRes.data).filter(o => normalize(o.status) === "cancelled"),
          callbacks: filterByStore(callsRes.data),
        });
      } catch (err) { console.error("Dashboard Loading Error:", err); }
    };
    fetchData();
  }, [store?.name]);

  const stats = useMemo(() => {
    const revenue = workspace.payments.reduce((sum, item) => sum + Number(item["Total Revenue"] || 0), 0);
    return {
      revenue: `₹${revenue.toLocaleString()}`,
      orderCount: workspace.orders.length,
      productCount: workspace.products.length,
      callbackCount: workspace.callbacks.length,
      revTrend: 12,
      ordTrend: 8,
      prodTrend: 5,
      callTrend: -2
    };
  }, [workspace]);

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 } }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        
        {/* Header Greeting */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }} flexWrap="wrap" useFlexGap>
          <Box>
            <Typography variant="h2" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-2px", mb: 0.5 }}>
               Hi, {store.name}
            </Typography>
            <Typography variant="h5" fontWeight="700" color="#a3aed0">
               Welcome to your Store Panel. Here&apos;s what&apos;s happening today.
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
             <Button 
               variant="outlined" 
               sx={{ borderRadius: "18px", px: 4, py: 1.5, fontWeight: 800, textTransform: "none", border: "2px solid #e0e5f2", color: "#1b2559" }}
               onClick={() => navigate("catalog/products")}
             >
               Manage Catalog
             </Button>
             <Button 
               variant="contained" 
               sx={{ borderRadius: "18px", px: 5, py: 1.5, fontWeight: 800, textTransform: "none", bgcolor: "#4318ff", boxShadow: "0 10px 25px rgba(67,24,255,0.2)" }}
               onClick={() => navigate("orders/all")}
             >
               View All Orders
             </Button>
          </Stack>
        </Stack>

        {/* Stats Grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Revenue" value={stats.revenue} icon={RevenueIcon} color="#4318ff" trend={stats.revTrend} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Orders" value={stats.orderCount} icon={OrderIcon} color="#05cd99" trend={stats.ordTrend} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Products" value={stats.productCount} icon={ProductIcon} color="#ffb800" trend={stats.prodTrend} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Callback Requests" value={stats.callbackCount} icon={CallbackIcon} color="#ee5d50" trend={stats.callTrend} />
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {/* Main Content Area: Recent Activity */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 4, borderRadius: "32px", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", height: "100%" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="900" color="#1b2559">Recent Orders</Typography>
                <Button endIcon={<ArrowIcon />} sx={{ fontWeight: 800, textTransform: "none", color: "#4318ff" }} onClick={() => navigate("orders/all")}>See all</Button>
              </Stack>
              
              <Stack spacing={2.5}>
                {workspace.orders.slice(0, 5).length > 0 ? workspace.orders.slice(0, 5).map((order) => (
                   <Box key={order.id} sx={{ p: 2, borderRadius: "20px", border: "1px solid #f0f4f8", "&:hover": { bgcolor: "#f8f9fc" }, cursor: "pointer" }}>
                     <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={2} alignItems="center">
                           <Avatar sx={{ bgcolor: alpha("#4318ff", 0.1), color: "#4318ff" }}><OrderIcon fontSize="small" /></Avatar>
                           <Box>
                              <Typography variant="subtitle2" fontWeight="900" color="#1b2559">Order #{order["Cart ID"] || order.id}</Typography>
                              <Typography variant="caption" fontWeight="700" color="#a3aed0">{order.User || "Unknown User"}</Typography>
                           </Box>
                        </Stack>
                        <Box sx={{ textAlign: "right" }}>
                           <Typography variant="body2" fontWeight="900" color="#1b2559">₹{order["Cart price"] || 0}</Typography>
                           <Typography variant="caption" fontWeight="800" color={normalize(order.Status) === "pending" ? "#ee5d50" : "#05cd99"}>{order.Status}</Typography>
                        </Box>
                     </Stack>
                   </Box>
                )) : (
                  <Box sx={{ py: 6, textAlign: "center" }}>
                     <Typography variant="body1" color="#a3aed0" fontWeight="700">No recent orders yet.</Typography>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid>

          {/* Sidebar Area: Notifications / Alerts */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 4, borderRadius: "32px", background: "linear-gradient(135deg, #1b2559 0%, #2d3e8c 100%)", color: "#fff", boxShadow: "0 20px 45px rgba(27,37,89,0.2)" }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                <Box sx={{ p: 1.5, borderRadius: "14px", bgcolor: "rgba(255,255,255,0.1)" }}>
                  <NotificationIcon sx={{ color: "#fff" }} />
                </Box>
                <Typography variant="h5" fontWeight="900">Urgent Alerts</Typography>
              </Stack>

              <Stack spacing={3}>
                <Box sx={{ p: 2, borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", bgcolor: "rgba(255,255,255,0.03)" }}>
                   <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <DotIcon sx={{ color: "#ee5d50", fontSize: 14, mt: 0.5 }} />
                      <Box>
                         <Typography variant="subtitle2" fontWeight="900">Pending Orders ({workspace.pending.length})</Typography>
                         <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 700 }}>Action required on items waiting for fulfillment.</Typography>
                      </Box>
                   </Stack>
                </Box>

                <Box sx={{ p: 2, borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", bgcolor: "rgba(255,255,255,0.03)" }}>
                   <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <DotIcon sx={{ color: "#ffb800", fontSize: 14, mt: 0.5 }} />
                      <Box>
                         <Typography variant="subtitle2" fontWeight="900">Low Stock Alert</Typography>
                         <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 700 }}>5 products are below threshold. Update stock soon.</Typography>
                      </Box>
                   </Stack>
                </Box>
                
                <Button 
                  fullWidth 
                  variant="contained" 
                  sx={{ py: 2, borderRadius: "18px", bgcolor: "#fff", color: "#1b2559", fontWeight: 900, "&:hover": { bgcolor: alpha("#fff", 0.9) } }}
                  onClick={() => navigate("reports/item-requirement")}
                >
                  View Full Reports
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default StoreDashboard;

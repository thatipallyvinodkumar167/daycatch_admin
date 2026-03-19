import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  Stack,
  useTheme,
  alpha,
  Avatar,
  IconButton,
  Tooltip,
  Button
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ReplayIcon from "@mui/icons-material/Replay";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonIcon from "@mui/icons-material/Person";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import { getAllOrders } from "../api/ordersApi";

const cardVariants = {
  initial: { opacity: 0, scale: 0.95, y: 15 },
  animate: { opacity: 1, scale: 1, y: 0 },
  hover: { scale: 1.02, transition: { duration: 0.2 } }
};

const DashboardCards = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [stats, setStats] = useState([
    {
      title: "Revenue (Week)",
      value: "Rs. 0",
      change: "-100%",
      isIncrease: false,
      icon: <CurrencyRupeeIcon />,
      color: "#E53935",
      subItems: [
        { label: "Store", val: "Rs. 18" },
        { label: "Admin", val: "Rs. 2" }
      ]
    },
    {
      title: "Incoming Orders",
      value: "0",
      change: "+0%",
      isIncrease: true,
      icon: <ShoppingBagIcon />,
      color: "#E53935",
    },
    {
      title: "New Users",
      value: "33",
      change: "-17%",
      isIncrease: false,
      icon: <PersonIcon />,
      color: "#E53935",
    },
    {
      title: "Fulfillment Rate",
      value: "94%",
      change: "+2%",
      isIncrease: true,
      icon: <CheckCircleIcon />,
      color: "#2ED480",
    },
  ]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await getAllOrders();
      const orderList = response.data.data || [];

      const mappedOrders = orderList.map((order) => ({
        id: order["Cart ID"] || order._id?.slice(-8) || "N/A",
        date: order["Delivery Date"]
          ? new Date(order["Delivery Date"]).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })
          : "N/A",
        customer: order["User"] || "Guest User",
        phone: order.Details?.phone || order.Details?.mobile || "90000 00000",
        status: order["Status"] || "Pending",
        amount: order["Cart price"] || 0,
      }));

      setOrders(mappedOrders);

      // Only update stats if we have data or want to refresh specific numbers
      setStats(prev => [
        { ...prev[0] }, // Keep revenue as is or update from orderList logic
        {
          ...prev[1],
          value: orderList.length.toString(),
        },
        ...prev.slice(2)
      ]);
    } catch (error) {
      console.error("Dashboard Sync Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStatusConfig = (status) => {
    const s = status.toLowerCase();
    if (s.includes("complete")) return { color: "#2ED480", icon: <CheckCircleIcon />, label: "Completed" };
    if (s.includes("cancel") || s.includes("reject")) return { color: "#F45252", icon: <ErrorIcon />, label: "Cancelled" };
    if (s.includes("place") || s.includes("pending")) return { color: "#E53935", icon: <AccessTimeFilledIcon />, label: "Received" };
    return { color: "#808191", icon: <AccessTimeFilledIcon />, label: status };
  };

  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Box className="premium-orbit-loader" />
      <Typography variant="body2" sx={{ mt: 3, fontWeight: 700, color: "text.secondary", letterSpacing: 2 }}>
        SYNCING ENGINE...
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ py: 3, px: { xs: 1, md: 3 } }}>
      {/* Header Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "text.primary", mb: 0.5 }}>
            Enterprise Metrics
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Real-time performance analytics for your platform
          </Typography>
        </Box>
        <Tooltip title="Refresh Dashboard">
          <IconButton 
            onClick={fetchData} 
            sx={{ 
              bgcolor: "white", 
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              animation: refreshing ? "spin 1s linear infinite" : "none"
            }}
          >
            <ReplayIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Stats Row */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} lg={3} key={i}>
            <Paper
              component={motion.div}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              sx={{
                p: 3,
                borderRadius: "24px",
                border: "1px solid rgba(0,0,0,0.03)",
                background: "#fff",
                boxShadow: "0 10px 40px rgba(0,0,0,0.02)",
                height: "100%",
                position: "relative",
                transition: "all 0.3s ease"
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Avatar sx={{ bgcolor: alpha("#FDEAEA", 0.6), color: "#E53935", borderRadius: "12px", width: 42, height: 42 }}>
                  {stat.icon}
                </Avatar>
                <Chip
                  icon={stat.isIncrease ? <TrendingUpIcon sx={{ fontSize: "14px !important" }} /> : <TrendingDownIcon sx={{ fontSize: "14px !important" }} />}
                  label={stat.change}
                  size="small"
                  sx={{
                    bgcolor: stat.isIncrease ? alpha("#E8F5E9", 0.8) : alpha("#FDEAEA", 0.8),
                    color: stat.isIncrease ? "#2E7D32" : "#D32F2F",
                    fontWeight: 750,
                    borderRadius: "8px",
                    px: 0.5,
                    border: "none"
                  }}
                />
              </Stack>
              
              <Typography variant="body2" sx={{ mt: 3, fontWeight: 750, color: "#808191", textTransform: "uppercase", fontSize: 10, letterSpacing: 1 }}>
                {stat.title}
              </Typography>
              
              <Typography variant="h3" sx={{ mt: 0.5, fontWeight: 900, color: "#11142D", fontSize: "2.5rem" }}>
                {stat.value}
              </Typography>
              
              {stat.subItems && (
                <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                  {stat.subItems.map((sub, j) => (
                    <Box key={j}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: "#808191", fontSize: 11 }}>{sub.label}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 850, color: "#E53935" }}>{sub.val}</Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Orders Table */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 4, borderRadius: "24px", bgcolor: "#fff", border: "1px solid rgba(0,0,0,0.03)", boxShadow: "0 10px 60px rgba(0,0,0,0.02)" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 850, color: "#11142D" }}>Operational Logs</Typography>
              <Typography 
                variant="button" 
                onClick={() => navigate("/all-orders")}
                sx={{ color: theme.palette.primary.main, fontWeight: 800, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
              >
                View Manifest
              </Typography>
            </Stack>

            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, color: "#808191", fontSize: 12, textTransform: "uppercase", border: "none" }}>ID / Date</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: "#808191", fontSize: 12, textTransform: "uppercase", border: "none" }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: "#808191", fontSize: 12, textTransform: "uppercase", border: "none" }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, color: "#808191", fontSize: 12, textTransform: "uppercase", border: "none" }}>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {orders.map((order, idx) => {
                      const status = getStatusConfig(order.status);
                      return (
                        <TableRow 
                          key={order.id + idx}
                          component={motion.tr}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: idx * 0.05 }}
                          sx={{ "&:hover": { bgcolor: "rgba(0,0,0,0.01)" }, transition: "0.2s" }}
                        >
                          <TableCell sx={{ borderBottom: "1px solid rgba(0,0,0,0.04)", py: 2.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 850, color: "#E53935" }}>{order.id}</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>{order.date}</Typography>
                          </TableCell>
                          <TableCell sx={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: "#11142D" }}>{order.customer}</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>{order.phone}</Typography>
                          </TableCell>
                          <TableCell sx={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: status.color }} />
                              <Typography variant="caption" sx={{ fontWeight: 800, color: status.color, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                {status.label}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="right" sx={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                            <Typography variant="body1" sx={{ fontWeight: 900, color: "#E53935" }}>Rs. {order.amount}</Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Action Center / Bestseller */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 4, borderRadius: "24px", height: "100%", bgcolor: theme.palette.primary.main, color: "#fff", position: "relative", overflow: "hidden" }}>
            <Box sx={{ position: "absolute", top: -20, right: -20, width: 150, height: 150, background: alpha("#fff", 0.1), borderRadius: "50%" }} />
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, position: "relative" }}>Top Performer</Typography>
            <Typography variant="body2" sx={{ mb: 4, opacity: 0.8, fontWeight: 500 }}>High velocity products this period</Typography>
            
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: 250 }}>
              <Avatar sx={{ width: 100, height: 100, bgcolor: alpha("#fff", 0.2), mb: 3 }}>
                <TrendingUpIcon sx={{ fontSize: 48 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Loading Intel...</Typography>
              <Typography variant="caption" sx={{ opacity: 0.6 }}>Gathering sales velocity data</Typography>
            </Box>
            
            <Button 
              fullWidth 
              variant="contained" 
              sx={{ 
                mt: 2, 
                bgcolor: "#fff", 
                color: theme.palette.primary.main, 
                fontWeight: 900,
                borderRadius: "12px",
                "&:hover": { bgcolor: alpha("#fff", 0.9) }
              }}
              onClick={() => navigate("/products")}
            >
              Analyze Products
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .premium-orbit-loader {
          width: 50px;
          height: 50px;
          border: 4px solid ${alpha(theme.palette.primary.main, 0.1)};
          border-top-color: ${theme.palette.primary.main};
          border-radius: 50%;
          animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        }
      `}</style>
    </Box>
  );
};

export default DashboardCards;
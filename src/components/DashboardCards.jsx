import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CancelOutlined from "@mui/icons-material/CancelOutlined";
import StatCard from "./StatCard";
import { getAllOrders } from "../api/ordersApi";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const DashboardCards = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";

  const [stats, setStats] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await getAllOrders();
        const results = response.data.results || [];

        const mappedOrders = results.map((order) => ({
          id: order["Cart ID"] || order._id?.slice(-8) || "N/A",
          date: order["Delivery Date"]
            ? new Date(order["Delivery Date"]).toISOString().split("T")[0]
            : "N/A",
          customer: order["User"] || "Guest User",
          phone:
            order.Details?.phone ||
            order.Details?.mobile ||
            order.Details?.contact ||
            "N/A",
          status: order["Status"] || "Pending",
          amount: `Rs. ${order["Cart price"] || 0}`,
        }));

        setOrders(mappedOrders);

        setStats([
          {
            title: "This Week Earning",
            value: "Rs. 0",
            change: "-100 %",
            icon: "revenue",
            comparisonLabel: "last week",
            subData: [
              { label: "Store Earnings", value: "Rs. 18" },
              { label: "Admin Earnings", value: "Rs. 2" },
            ],
          },
          {
            title: "New Orders",
            value: results.length.toString(),
            change: "0 %",
            icon: "orders",
            comparisonLabel: "last week",
          },
          {
            title: "Cancelled Orders",
            value: "0",
            change: "-100 %",
            icon: "cancelled",
            comparisonLabel: "last week",
          },
          {
            title: "Pending Orders",
            value: "1",
            change: "-75 %",
            icon: "pending",
            comparisonLabel: "last week",
          },
          {
            title: "This Week App Users",
            value: "33",
            change: "-17.5 %",
            icon: "customers",
            comparisonLabel: "last week",
          },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const glassStyle = {
    background: isDark
      ? alpha(theme.palette.background.paper, 0.8)
      : alpha("#fff", 0.8),
    backdropFilter: "blur(12px)",
    borderRadius: "24px",
    border: `1px solid ${
      isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"
    }`,
    boxShadow: isDark
      ? "0 8px 32px rgba(0,0,0,0.3)"
      : "0 8px 32px rgba(0,0,0,0.03)",
    overflow: "hidden",
    height: "100%",
  };

  const getStatusChip = (status) => {
    const configs = {
      Completed: {
        color: "#10b981",
        bg: alpha("#10b981", 0.1),
        icon: <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />,
      },
      Cancelled: {
        color: theme.palette.error.main,
        bg: alpha(theme.palette.error.main, 0.1),
        icon: <CancelOutlined sx={{ fontSize: 16 }} />,
      },
      Pending: {
        color: "#f59e0b",
        bg: alpha("#f59e0b", 0.1),
        icon: <ShoppingBagOutlinedIcon sx={{ fontSize: 16 }} />,
      },
      Placed: {
        color: "#3b82f6",
        bg: alpha("#3b82f6", 0.1),
        icon: <ShoppingBagOutlinedIcon sx={{ fontSize: 16 }} />,
      },
    };

    const config = configs[status] || configs.Pending;

    return (
      <Chip
        label={status}
        size="small"
        icon={config.icon}
        sx={{
          backgroundColor: config.bg,
          color: config.color,
          fontWeight: 700,
          borderRadius: "8px",
          "& .MuiChip-icon": { color: "inherit" },
        }}
      />
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: 2,
        }}
      >
        <Box className="loader-orbit" />
        <Typography
          variant="body1"
          sx={{ color: "text.secondary", fontWeight: 600 }}
        >
          Analyzing Live Inventory...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{ pb: 6 }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 900, color: "text.primary", letterSpacing: "-0.5px" }}
          >
            Super Admin Overview
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            Operational performance for the current week.
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        {stats.map((stat, i) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={i}
            component={motion.div}
            variants={itemVariants}
          >
            <StatCard {...stat} />
            {stat.subData && (
              <Box sx={{ mt: 1, px: 2, display: "flex", gap: 2 }}>
                {stat.subData.map((sub, idx) => (
                  <Typography
                    key={idx}
                    variant="caption"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 700,
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                    onClick={() => navigate("/admin/store-earnings")}
                  >
                    {sub.label}: {sub.value}
                  </Typography>
                ))}
              </Box>
            )}
          </Grid>
        ))}

        <Grid item xs={12} md={4} component={motion.div} variants={itemVariants}>
          <Paper
            sx={{
              ...glassStyle,
              p: 4,
              display: "flex",
              flexDirection: "column",
              minHeight: 300,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Bestseller
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 4 }}>
              Top product sales this week
            </Typography>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: "50%",
                  background: alpha(theme.palette.text.primary, 0.03),
                }}
              >
                <ShoppingBagOutlinedIcon
                  sx={{ color: alpha(theme.palette.text.primary, 0.2), fontSize: 48 }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontWeight: 600 }}
              >
                No data found
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8} component={motion.div} variants={itemVariants}>
          <Paper sx={{ ...glassStyle, p: 0 }}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Orders
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Latest order history
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(theme.palette.text.primary, 0.02) }}>
                    <TableCell sx={{ fontWeight: 700, px: 4 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Cart ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>User Details</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, pr: 4 }}>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order, i) => (
                    <TableRow
                      key={i}
                      sx={{ "&:hover": { bgcolor: alpha(theme.palette.text.primary, 0.01) } }}
                    >
                      <TableCell sx={{ px: 4, fontWeight: 700, color: "text.secondary" }}>
                        {i + 1}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 900, color: "primary.main" }}
                        >
                          {order.id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.date}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {order.customer}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.phone}
                        </Typography>
                      </TableCell>
                      <TableCell>{getStatusChip(order.status)}</TableCell>
                      <TableCell sx={{ fontWeight: 900, fontSize: "1rem", pr: 4 }}>
                        {order.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .loader-orbit {
          width: 40px;
          height: 40px;
          border: 3px solid ${alpha(theme.palette.primary.main, 0.1)};
          border-top-color: ${theme.palette.primary.main};
          border-radius: 50%;
          animation: orbit 1s linear infinite;
        }
      `}</style>
    </Box>
  );
};

export default DashboardCards;

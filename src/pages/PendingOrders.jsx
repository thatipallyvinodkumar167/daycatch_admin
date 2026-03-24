import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Chip,
  Stack,
  Button,
  Avatar,
  AvatarGroup,
  Tooltip,
  IconButton,
  Collapse,
  LinearProgress,
  CircularProgress,
  Grid,
} from "@mui/material";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PrintIcon from "@mui/icons-material/Print";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningIcon from "@mui/icons-material/Warning";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../api/genericApi";
import OrderDetailsDialog from "../components/OrderDetailsDialog";
import {
  buildOrderPayload,
  moveOrderBetweenCollections,
  syncOrderHistory,
} from "../utils/orderLifecycle";

const PendingOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // Track which order is being updated

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await genericApi.getAll("pending orders");
      const apiResults = response.data?.results || response.data?.data || response.data || [];
      
      const formattedData = apiResults.map((order, index) => ({
        id: order._id || index + 1,
        cartId: order["Cart ID"] || order.cartId || order._id,
        cartPrice: parseFloat(order["Cart price"] || order.cartPrice || 0),
        userName: order["User"] || order.user || "N/A",
        userPhone: order["User Phone"] || order.phone || order.Details?.phone || "N/A",
        deliveryDate: order["Delivery Date"] ? new Date(order["Delivery Date"]).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : "N/A",
        timeSlot: order["Time Slot"] || order.timeSlot || "N/A",
        address: order.Address || order.address || order.Details?.address || "N/A",
        status: order["Status"] || order.status || "Pending",
        products: (order.Products || order.products || []).map(p => ({
          name: p.product_name || p.name || "Product",
          img: p.image || p.img || ""
        })),
        products_expanded: (order.Products || order.products || []).map(p => ({
            name: p.product_name || p.name || "Product",
            qty: p.qty || 0,
            tax: p.tax || "0 %",
            price: p.price || 0,
            total: p.total || 0,
            img: p.image || p.img || ""
        })),
        raw: order,
      }));

      setOrders(formattedData);
    } catch (error) {
      console.error("Error fetching pending orders:", error);
      setOrders([]);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const toggleExpand = (id) => setExpandedOrderId(expandedOrderId === id ? null : id);

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setOpenDetails(true);
  };

  const handleUpdateStatus = async (order, newStatus) => {
    setActionLoading(order.id);
    try {
        if (newStatus === "Accepted" || newStatus === "Processing") {
            const ongoingStatus = newStatus === "Processing" ? "Processing" : "Ongoing";
            const ongoingPayload = buildOrderPayload(order, {
              Status: ongoingStatus,
              status: ongoingStatus,
            });

            await moveOrderBetweenCollections({
              sourceCollection: "pending orders",
              targetCollection: "ongoingorders",
              order,
              payload: ongoingPayload,
            });

            setOrders(prev => prev.filter(o => o.id !== order.id));
            return;
        }

        if (newStatus === "Cancelled") {
            const cancellationReason =
              order.raw?.["Cancelling Reason"] ||
              order.raw?.reason ||
              "Cancelled from Pending Orders";

            const cancelledPayload = buildOrderPayload(order, {
              Status: "Cancelled",
              status: "Cancelled",
              "Cancelling Reason": cancellationReason,
              reason: cancellationReason,
            });

            await moveOrderBetweenCollections({
              sourceCollection: "pending orders",
              targetCollection: "cancelled orders",
              order,
              payload: cancelledPayload,
            });

            setOrders(prev => prev.filter(o => o.id !== order.id));
            return;
        }

        await genericApi.update("pending orders", order.id, {
          Status: newStatus,
          status: newStatus,
        });
        await syncOrderHistory(
          buildOrderPayload(order, {
            Status: newStatus,
            status: newStatus,
          })
        );

        // Optimistic update for UI feel
        setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o));

        // Final refresh from server
        setTimeout(() => fetchOrders(), 1000);
    } catch (error) {
        console.error("Failed to update order status:", error);
        alert("Failed to update order status. Please try again after the API is available.");
        fetchOrders();
    } finally {
        setActionLoading(null);
    }
  };

  const filteredOrders = useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return orders;
    return orders.filter((order) => {
        const cid = (order.cartId || "").toString().toLowerCase();
        const uname = (order.userName || "").toString().toLowerCase();
        return cid.includes(s) || uname.includes(s);
    });
  }, [orders, search]);

  const buildOrderDetailsPath = (orderId) =>
    `/all-orders/details/${orderId}?collection=${encodeURIComponent("pending orders")}`;

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Page Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Pending Orders
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ fontWeight: "500" }}>
                Accept, Reject, or Mark orders for preparation.
            </Typography>
        </Box>
      </Box>

      {/* Summary Cards Row (Matching AllOrders) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
            { label: "PENDING ORDERS", value: orders.length, icon: <PendingActionsIcon />, color: "#ffb800", bg: "#fff9e6" },
            { label: "TO BE ACCEPTED", value: orders.filter(o => o.status.toLowerCase() === "pending").length, icon: <ShoppingBasketIcon />, color: "#4318ff", bg: "#eef2ff" },
            { label: "URGENT ACTIONS", value: orders.filter(o => o.deliveryDate.includes("Today")).length, icon: <WarningIcon />, color: "#ff4d49", bg: "#fff1f0" },
            { label: "EST. VALUE", value: "₹" + orders.reduce((sum, o) => sum + o.cartPrice, 0).toLocaleString(), icon: <TrendingUpIcon />, color: "#24d164", bg: "#e6f9ed" },
        ].map((stat, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
                <Paper sx={{ p: 2.5, borderRadius: "20px", display: "flex", alignItems: "center", gap: 2, border: "1px solid #e0e5f2", bgcolor: "#fff" }}>
                    <Avatar sx={{ bgcolor: stat.bg, color: stat.color, width: 48, height: 48, borderRadius: "12px" }}>
                        {stat.icon}
                    </Avatar>
                    <Box>
                        <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ letterSpacing: "0.5px" }}>{stat.label}</Typography>
                        <Typography variant="h5" fontWeight="800" color="#1b2559">{stat.value}</Typography>
                    </Box>
                </Paper>
            </Grid>
        ))}
      </Grid>

      {/* Utility Bar */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }} justifyContent="space-between">
        <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
            <TextField
                size="small"
                placeholder="Search by cart ID or user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                    flex: 1,
                    maxWidth: "500px",
                    "& .MuiOutlinedInput-root": { 
                        borderRadius: "16px", 
                        backgroundColor: "#fff",
                        "& fieldset": { borderColor: "#e0e5f2" } 
                    }
                }}
            />
        </Box>
        <Stack direction="row" spacing={1.5}>
            <Tooltip title="Print Manifest">
                <IconButton onClick={() => window.print()} sx={{ backgroundColor: "#fff", border: "1px solid #e0e5f2", borderRadius: "12px" }}>
                    <PrintIcon sx={{ color: "#2b3674" }} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Download CSV">
                <IconButton sx={{ backgroundColor: "#fff", border: "1px solid #e0e5f2", borderRadius: "12px" }}>
                    <FileDownloadIcon sx={{ color: "#2b3674" }} />
                </IconButton>
            </Tooltip>
        </Stack>
      </Stack>

      <Paper
        sx={{
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
          border: "1px solid #e0e5f2",
          background: "#fff",
        }}
      >
        {loading && <LinearProgress sx={{ "& .MuiLinearProgress-bar": { bgcolor: "#4318ff" } }} />}
        
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", py: 2, pl: 4, borderBottom: "1px solid #e0e5f2" }}>#</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>ORDER</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>CUSTOMER</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>PRICE</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>STATUS</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>DATE</TableCell>
                <TableCell align="center" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>DETAILS</TableCell>
                <TableCell align="right" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", pr: 4, borderBottom: "1px solid #e0e5f2" }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                    <Typography variant="body1" color="#a3aed0" fontWeight="600">
                      No pending orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order, index) => {
                  const isExpanded = expandedOrderId === order.id;
                  const isUpdating = actionLoading === order.id;

                  return (
                    <React.Fragment key={order.id}>
                    <TableRow sx={{ "&:hover": { bgcolor: "#f4f7fe" }, transition: "0.2s", backgroundColor: isExpanded ? "#f4f7fe" : "inherit" }}>
                      <TableCell sx={{ color: "#a3aed0", fontWeight: "800", pl: 4 }}>
                        <IconButton size="small" onClick={() => toggleExpand(order.id)} sx={{ mr: 1, color: "#4318ff" }}>
                          {isExpanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                        </IconButton>
                        {String(index + 1).padStart(2, '0')}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: "#eef2ff", color: "#4318ff", border: "2px solid #e0e5f2" }}>
                            <ShoppingBasketIcon fontSize="small" />
                          </Avatar>
                          <Typography variant="body2" fontWeight="800" color="#1b2559">
                            {order.cartId}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="800" color="#1b2559">{order.userName}</Typography>
                          <Typography variant="caption" color="#a3aed0" fontWeight="600">{order.userPhone}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "800" }}>₹{order.cartPrice.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status.toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor: order.status.toLowerCase() === "pending" ? "#fff8e6" : "#e6f9ed",
                            color: order.status.toLowerCase() === "pending" ? "#ffb800" : "#24d164",
                            fontWeight: "900",
                            fontSize: "10px",
                            borderRadius: "10px",
                            px: 1.5,
                            height: "26px",
                            border: `1px solid ${order.status.toLowerCase() === "pending" ? "#ffccc7" : "#b7eb8f"}`
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: "#475467", fontWeight: "700" }}>{order.deliveryDate}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenDetails(order)}
                          sx={{
                            borderRadius: "10px",
                            textTransform: "none",
                            fontWeight: "800",
                            borderColor: "#e0e5f2",
                            color: "#1b2559",
                            "&:hover": { borderColor: "#4318ff", backgroundColor: "#eef2ff" }
                          }}
                        >
                          View Order
                        </Button>
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 3 }}>
                         <Stack direction="row" spacing={1} justifyContent="flex-end">
                            {isUpdating ? <CircularProgress size={24} sx={{ m: 1 }} /> : (
                                <>
                                    <Tooltip title="Track Record">
                                        <IconButton 
                                            size="small" 
                                            onClick={() => navigate(buildOrderDetailsPath(order.id))}
                                            sx={{ 
                                                color: "#fff", 
                                                bgcolor: "#1b2559", 
                                                borderRadius: "12px", 
                                                width: "36px", 
                                                height: "36px", 
                                                "&:hover": { bgcolor: "#0d1433", transform: "translateY(-1px)" },
                                                boxShadow: "0 4px 10px rgba(27,37,89,0.2)",
                                                transition: "0.2s"
                                            }}
                                        >
                                            <VisibilityIcon sx={{ fontSize: "18px" }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Approve Order">
                                        <IconButton 
                                            size="small" 
                                            onClick={() => handleUpdateStatus(order, "Accepted")}
                                            sx={{ 
                                                color: "#fff", 
                                                bgcolor: "#24d164", 
                                                borderRadius: "12px", 
                                                width: "36px", 
                                                height: "36px", 
                                                "&:hover": { bgcolor: "#1fb355", transform: "translateY(-1px)" },
                                                boxShadow: "0 4px 10px rgba(36,209,100,0.2)",
                                                transition: "0.2s"
                                            }}
                                        >
                                            <CheckCircleOutlineIcon sx={{ fontSize: "18px" }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Cancel Order">
                                        <IconButton 
                                            size="small" 
                                            onClick={() => handleUpdateStatus(order, "Cancelled")}
                                            sx={{ 
                                                color: "#fff", 
                                                bgcolor: "#ff4d49", 
                                                borderRadius: "12px", 
                                                width: "36px", 
                                                height: "36px", 
                                                "&:hover": { bgcolor: "#e03e3a", transform: "translateY(-1px)" },
                                                boxShadow: "0 4px 10px rgba(255,77,73,0.2)",
                                                transition: "0.2s"
                                            }}
                                        >
                                            <CancelOutlinedIcon sx={{ fontSize: "18px" }} />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )}
                        </Stack>
                      </TableCell>
                    </TableRow>
 
                    <TableRow>
                        <TableCell colSpan={8} sx={{ py: 0, borderBottom: isExpanded ? "1px solid #e0e5f2" : "none" }}>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                <Box sx={{ p: 4, backgroundColor: "#fafbfc" }}>
                                    <Stack direction="row" spacing={4} alignItems="flex-start">
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle2" fontWeight="800" gutterBottom color="#2b3674">DELIVERY ADDRESS</Typography>
                                            <Typography variant="body2" color="#475467" fontWeight="600">{order.address}</Typography>
                                            <Typography variant="body2" color="#a3aed0" sx={{ mt: 1 }}>Time Slot: {order.timeSlot}</Typography>
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle2" fontWeight="800" gutterBottom color="#2b3674">PRODUCTS</Typography>
                                            <AvatarGroup max={5} sx={{ justifyContent: "flex-start", "& .MuiAvatar-root": { width: 40, height: 40, borderRadius: "12px", border: "2px solid #fff" } }}>
                                                {order.products.map((p, i) => (
                                                    <Tooltip key={i} title={p.name}>
                                                        <Avatar src={p.img} alt={p.name} />
                                                    </Tooltip>
                                                ))}
                                            </AvatarGroup>
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="800" gutterBottom color="#2b3674">QUICK ACTIONS</Typography>
                                            <Button 
                                              variant="contained" 
                                              size="small" 
                                              disabled={isUpdating}
                                              onClick={() => handleUpdateStatus(order, "Processing")}
                                              sx={{ 
                                                bgcolor: "#4318ff", 
                                                borderRadius: "12px", 
                                                textTransform: "none", 
                                                px: 3,
                                                py: 1,
                                                fontWeight: "800",
                                                boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)",
                                                "&:hover": { bgcolor: "#3311cc" } 
                                              }}
                                            >
                                                {isUpdating ? "Processing..." : "Start Processing"}
                                            </Button>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Collapse>
                        </TableCell>
                    </TableRow>
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <OrderDetailsDialog 
        open={openDetails} 
        onClose={() => setOpenDetails(false)} 
        order={selectedOrder} 
      />
    </Box>
  );
};

export default PendingOrders;

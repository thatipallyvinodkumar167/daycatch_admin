import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Button,
  alpha,
  CircularProgress,
  TextField,
  InputAdornment,
  Chip,
  Tooltip,
  Snackbar,
  Alert,
  Dialog,
  Grid,
} from "@mui/material";
import {
  Search as SearchIcon,
  LocalShipping as ShippingIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Phone as PhoneIcon,
  ShoppingBag as OrdersIcon,
  Person as PersonIcon,
  Store as StoreIcon,
  TwoWheeler as BikeIcon,
  Payments as CashIcon,
  Close as CloseIcon,
  Sync as SyncIcon,
} from "@mui/icons-material";
import { useOutletContext, useNavigate } from "react-router-dom";
import { getAllOrders } from "../../api/ordersApi";
import { genericApi } from "../../api/genericApi";
import { formatStoreDate } from "../utils/storeWorkspace";
import { buildOrderPayload, moveOrderBetweenCollections } from "../../utils/orderLifecycle";

const StoreOrders = ({ viewType, title }) => {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const navy = "#1b2559";
  const red = "#E53935";

  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params = { storeId: store?.id };
      
      const statusMap = {
        confirmed: "Accepted",
        out_for_delivery: "Out For Delivery",
        payment_failed: "Payment Failed",
        completed: "Delivered",
        missed: "Missed"
      };
      
      if (viewType && viewType !== "all" && viewType !== "day_wise" && !["today", "next_day"].includes(viewType)) {
          params.status = statusMap[viewType] || viewType;
      }

      // API selection based on viewType
      let collectionName = "orders";
      if (viewType === "pending") collectionName = "pending orders";
      else if (viewType === "cancelled") collectionName = "cancelled orders";
      else if (viewType === "confirmed") collectionName = "ongoingorders";
      else if (viewType === "out_for_delivery") collectionName = "out for orders";
      else if (viewType === "payment_failed") collectionName = "payment failed orders";
      else if (viewType === "completed") collectionName = "completed orders";
      else if (viewType === "missed") collectionName = "missed orders";
      else if (viewType === "day_wise") collectionName = "day wise orders";

      let list = [];
      try {
          const response = await genericApi.getAll(collectionName, params);
          list = response?.data?.results || response?.data || [];
      } catch (e) {
          const response = await getAllOrders(params);
          list = response?.data?.results || response?.data || [];
      }
      
      const normalizedList = Array.isArray(list) ? list : [];
      
      setOrders(normalizedList.map(order => ({
        id: order._id || order.id || "N/A",
        cartId: order["Cart ID"] || order.cartId || order._id?.substring(0, 8) || "N/A",
        price: order["Cart price"] || order.amount || order.totalAmount || 0,
        user: order.User || order.user || order.customer || "User",
        userPhone: order["User Phone"] || order.phone || order.Details?.phone || "N/A",
        date: order["Delivery Date"] || order.deliveryDate || order.createdAt || "",
        timeSlot: order["Time Slot"] || order.timeSlot || order.Details?.["Time Slot"] || order.Details?.timeSlot || "N/A",
        address: order.Address || order.address || order.Details?.address || order.Details?.Address || "N/A",
        status: order.Status || order.status || "Pending",
        reason: order["Cancelling Reason"] || order.cancelReason || order.Details?.["Cancelling Reason"] || "N/A",
        items_count: (order.Products || order.products || order.Details?.Products || []).length,
        items_preview: (order.Products || order.products || order.Details?.Products || []).map(p => ({
            name: p.product_name || p.name || "Item",
            img: p.image || p.img || ""
        })),
        dboy: order["Boy Name"] || order.deliveryBoyName || order.Details?.["Boy Name"] || "Not Assigned",
        payment: order.paymentStatus || order.paymentMethod || "COD",
        raw: order
      })));
    } catch (err) {
      console.error("Orders Sync Error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [store?.id, viewType]);

  useEffect(() => {
    if (store?.id) fetchOrders();
  }, [fetchOrders, store?.id]);

  const handleUpdateStatus = async (order, newStatus) => {
    setActionLoading(order.id);
    try {
        const sourceMap = { pending: "pending orders", confirmed: "ongoingorders", out_for_delivery: "out for orders" };
        const statusToColl = { Accepted: "ongoingorders", Cancelled: "cancelled orders", Delivered: "completed orders" };
        
        const payload = buildOrderPayload(order.raw, {
            Status: newStatus,
            status: newStatus,
            "Cancelling Reason": newStatus === "Cancelled" ? "Cancelled by Store Manager" : undefined
        });

        await moveOrderBetweenCollections({
            sourceCollection: sourceMap[viewType] || "orders",
            targetCollection: statusToColl[newStatus] || "orders",
            order: { id: order.id },
            payload
        });

        setOrders(prev => prev.filter(o => o.id !== order.id));
        setSnackbar({ open: true, message: `Order marked as ${newStatus}`, severity: "success" });
    } catch (e) {
        setSnackbar({ open: true, message: "Action failed", severity: "error" });
    } finally {
        setActionLoading(null);
    }
  };

  const filteredOrders = useMemo(() => orders.filter(o => 
    o.cartId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user.toLowerCase().includes(searchTerm.toLowerCase())
  ), [orders, searchTerm]);

  const stats = useMemo(() => {
     return [
        { label: "VOLUME", value: orders.length, icon: <OrdersIcon />, color: "#4318ff", bg: "#eef2ff" },
        { label: "VALUE", value: `Rs. ${orders.reduce((acc, o) => acc + Number(o.price || 0), 0).toLocaleString()}`, icon: <CashIcon />, color: "#05cd99", bg: "#e6f9ed" },
        { label: "STATE", value: (title || "Orders").split(" ")[0].toUpperCase(), icon: <ShippingIcon />, color: red, bg: alpha(red, 0.05) },
     ];
  }, [orders, title]);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}><CircularProgress sx={{ color: red }} /></Box>;

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        
        {/* Header Section */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: navy, mb: 0.5, letterSpacing: "-1px" }}>
               {title || "Orders Dashboard"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#a3aed0", fontWeight: 700 }}>
               Fulfillment management pipeline for {store.name}
            </Typography>
          </Box>
          <Tooltip title={refreshing ? "Refreshing..." : "Sync Threads"}>
            <IconButton 
                onClick={() => fetchOrders(true)} 
                sx={{ bgcolor: "#fff", border: "1px solid #e0e5f2", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
            >
                <SyncIcon sx={{ color: navy, animation: refreshing ? "spin 1s linear infinite" : "none" }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Intelligence Cards */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
            {stats.map((stat, i) => (
                <Grid item xs={12} sm={4} key={i}>
                    <Paper sx={{ p: 2.5, borderRadius: "20px", display: "flex", alignItems: "center", gap: 2, border: "1px solid #e0e5f2" }}>
                        <Avatar sx={{ bgcolor: stat.bg, color: stat.color, width: 48, height: 48, borderRadius: "14px" }}>
                            {stat.icon}
                        </Avatar>
                        <Box>
                            <Typography variant="caption" color="#a3aed0" fontWeight="900" sx={{ letterSpacing: "1px" }}>{stat.label}</Typography>
                            <Typography variant="h5" fontWeight="900" color="#1b2559">{stat.value}</Typography>
                        </Box>
                    </Paper>
                </Grid>
            ))}
        </Grid>

        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: "24px", border: "1px solid #e0e5f2", boxShadow: "0 25px 50px rgba(0,0,0,0.04)" }}>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }} justifyContent="space-between" alignItems="center">
            <TextField
              placeholder="Search Seq or User..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#a3aed0", fontSize: 20 }} /></InputAdornment>,
                sx: { borderRadius: "14px", bgcolor: "#f8f9fc", width: { xs: "100%", sm: "320px" }, fontSize: "14px", "& fieldset": { borderColor: "transparent" } }
              }}
            />
          </Stack>

          <TableContainer sx={{ border: "1px solid #eef2f6", borderRadius: "20px", overflow: "hidden" }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#fafbfc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", py: 2, pl: 3 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", py: 2 }}>CART ID</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", py: 2 }}>VALUATION</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", py: 2 }}>CUSTOMER</TableCell>
                  {viewType === "cancelled" && <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", py: 2 }}>AGENT</TableCell>}
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", py: 2 }}>SCHEDULE</TableCell>
                  {viewType === "cancelled" && <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", py: 2 }}>FAILURE POINT</TableCell>}
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", py: 2 }}>STATUS</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", py: 2, pr: 3 }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow><TableCell colSpan={10} align="center" sx={{ py: 8 }}><Typography variant="body2" fontWeight="800" color="#a3aed0">Empty fulfillment queue.</Typography></TableCell></TableRow>
                ) : (
                  filteredOrders.map((row, index) => {
                    const isUpdating = actionLoading === row.id;
                    const isFailed = row.status.toLowerCase().includes("cancel") || row.status.toLowerCase().includes("reject") || row.status.toLowerCase().includes("fail");
                    
                    return (
                        <TableRow key={row.id} hover sx={{ "&:hover": { bgcolor: "#f9fbff" } }}>
                        <TableCell sx={{ fontWeight: 800, color: "#a3aed0", pl: 3 }}>{index + 1}</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: navy, fontSize: "13px" }}>{row.cartId}</TableCell>
                        <TableCell sx={{ fontWeight: 900, color: red, fontSize: "13px" }}>₹{Number(row.price).toLocaleString()}</TableCell>
                        <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Avatar sx={{ bgcolor: alpha(navy, 0.05), color: navy, borderRadius: "8px", width: 28, height: 28 }}><PersonIcon sx={{ fontSize: 16 }} /></Avatar>
                                <Box>
                                    <Typography variant="body2" fontWeight="800" color={navy} noWrap sx={{ maxWidth: "120px" }}>{row.user}</Typography>
                                    <Typography variant="caption" fontWeight="700" color="#a3aed0">{row.userPhone}</Typography>
                                </Box>
                            </Stack>
                        </TableCell>
                        {viewType === "cancelled" && (
                             <TableCell>
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <BikeIcon sx={{ color: "#a3aed0", fontSize: 14 }} />
                                    <Typography variant="caption" fontWeight="800" color={navy}>{row.dboy}</Typography>
                                </Stack>
                            </TableCell>
                        )}
                        <TableCell>
                            <Typography variant="caption" fontWeight="800" color="#707eae">{formatStoreDate(row.date)}</Typography>
                            <Typography variant="caption" display="block" color="#a3aed0">{row.timeSlot}</Typography>
                        </TableCell>
                        {viewType === "cancelled" && (
                            <TableCell sx={{ maxWidth: "180px" }}>
                                <Typography variant="caption" fontWeight="800" color={red} sx={{ lineHeight: 1.2 }}>{row.reason}</Typography>
                            </TableCell>
                        )}
                        <TableCell>
                            <Chip 
                                label={row.status.toUpperCase()} 
                                size="small" 
                                sx={{ 
                                    fontWeight: 900, 
                                    bgcolor: isFailed ? alpha(red, 0.05) : row.status.toLowerCase() === "pending" ? alpha("#ffb547", 0.05) : alpha("#05cd99", 0.05), 
                                    color: isFailed ? red : row.status.toLowerCase() === "pending" ? "#ffb547" : "#05cd99",
                                    borderRadius: "6px", px: 0.5, fontSize: "10px", height: "18px",
                                    border: `1px solid ${isFailed ? alpha(red, 0.2) : row.status.toLowerCase() === "pending" ? alpha("#ffb547", 0.2) : alpha("#05cd99", 0.2)}`
                                }} 
                            />
                        </TableCell>
                        <TableCell align="right" sx={{ pr: 3 }}>
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                {isUpdating ? <CircularProgress size={20} sx={{ color: navy, m: 0.5 }} /> : (
                                    <>
                                        {viewType === "pending" && (
                                            <>
                                                <IconButton disabled={isUpdating} onClick={() => handleUpdateStatus(row, "Accepted")} sx={{ bgcolor: alpha("#05cd99", 0.05), color: "#05cd99", borderRadius: "8px", width: 28, height: 28 }}><ApproveIcon sx={{ fontSize: 16 }} /></IconButton>
                                                <IconButton disabled={isUpdating} onClick={() => handleUpdateStatus(row, "Cancelled")} sx={{ bgcolor: alpha(red, 0.05), color: red, borderRadius: "8px", width: 28, height: 28 }}><RejectIcon sx={{ fontSize: 16 }} /></IconButton>
                                            </>
                                        )}
                                        <IconButton size="small" onClick={() => navigate(`../details/${row.id}`, { relative: "path" })} sx={{ color: navy, bgcolor: alpha(navy, 0.05), borderRadius: "8px", width: 28, height: 28 }}><ViewIcon sx={{ fontSize: 16 }} /></IconButton>
                                    </>
                                )}
                            </Stack>
                        </TableCell>
                        </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: "16px", fontWeight: "900" }}>{snackbar.message}</Alert>
      </Snackbar>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
};

export default StoreOrders;

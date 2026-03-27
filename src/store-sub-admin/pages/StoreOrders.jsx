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
  CircularProgress,
  TextField,
  Chip,
  Tooltip,
  Button,
  Collapse,
  LinearProgress,
  alpha,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import {
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Refresh as RefreshIcon,
  ShoppingBasket as ShoppingBasketIcon,
  LocalShipping as LocalShippingIcon,
  DoneAll as DoneAllIcon,
  Print as PrintIcon,
  Article as InvoiceIcon,
  People as ReassignIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  FileDownload as FileDownloadIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useOutletContext, useNavigate } from "react-router-dom";
import { storeWorkspaceApi } from "../../api/storeWorkspaceApi";
import { formatStoreDate } from "../utils/storeWorkspace";

const getCollectionNameForView = (viewType) => {
  if (viewType === "pending") return "pending orders";
  if (viewType === "cancelled") return "cancelled orders";
  if (viewType === "confirmed") return "ongoingorders";
  if (viewType === "out_for_delivery") return "out for orders";
  if (viewType === "payment_failed") return "payment failed orders";
  if (viewType === "completed") return "completed orders";
  if (viewType === "missed") return "missed orders";
  if (viewType === "day_wise" || viewType === "today" || viewType === "next_day") return "day wise orders";
  return "orders";
};

const getProductsSource = (order = {}) =>
  order.Products ||
  order.products ||
  order["Cart Products"] ||
  order["cart product"] ||
  order.Details?.Products ||
  [];

const mapOrderRecord = (order = {}) => {
  const productsSource = getProductsSource(order);

  return {
    id: order._id || order.id || "N/A",
    cartId: order["Cart ID"] || order.cartId || order._id?.substring(0, 8) || "N/A",
    price: order["Cart price"] || order["Total Price"] || order.amount || order.totalAmount || 0,
    user: order.User || order.user || order.customer || "User",
    userPhone: order["User Phone"] || order.phone || order.Details?.phone || "N/A",
    date: order["Delivery Date"] || order.deliveryDate || order.createdAt || "",
    timeSlot:
      order["Time Slot"] ||
      order.timeSlot ||
      order.Details?.["Time Slot"] ||
      order.Details?.timeSlot ||
      "N/A",
    address: order.Address || order.address || order.Details?.address || order.Details?.Address || "N/A",
    status: order.Status || order.status || "Pending",
    reason:
      order["Cancelling Reason"] ||
      order.reason ||
      order.cancelReason ||
      order.Details?.["Cancelling Reason"] ||
      "N/A",
    items_count: productsSource.length,
    items_preview: productsSource.map((product) => ({
      name: product.product_name || product.name || "Item",
      img: product.image || product.img || "",
      qty: product.qty || product.quantity || 1,
    })),
    cartProducts: productsSource.map((product) => product.product_name || product.name || product || "Item"),
    dboy:
      order["Boy Name"] ||
      order["Delivery Boy"] ||
      order.Assign ||
      order.deliveryBoyName ||
      order.Details?.["Boy Name"] ||
      "Not Assigned",
    storeName:
      order["Store Name"] ||
      order.storeName ||
      order.Store ||
      order.store ||
      order.Details?.["Store Name"] ||
      order.Details?.Store ||
      "Main Store",
    orderStatus:
      order["Order Status"] ||
      order.orderStatus ||
      order.Details?.["Order Status"] ||
      order.Status ||
      order.status ||
      "Missed",
    signature: order.Signature || order.signature || order.Details?.Signature || "N/A",
    payment:
      order.paymentStatus ||
      order.paymentMethod ||
      order.payment ||
      order["Payment Method"] ||
      order["Payment Status"] ||
      "COD",
    raw: order,
  };
};

const getEmptyStateCopy = (viewType) => {
  if (viewType === "today") return "today";
  if (viewType === "next_day") return "the next day";
  if (viewType === "day_wise") return "the selected period";
  if (viewType === "completed") return "completed orders";
  if (viewType === "cancelled") return "cancelled orders";
  if (viewType === "payment_failed") return "payment failed orders";
  if (viewType === "out_for_delivery") return "out for delivery orders";
  if (viewType === "confirmed") return "ongoing orders";
  if (viewType === "missed") return "missed orders";
  if (viewType === "pending") return "pending orders";
  return "this order view";
};

const StoreOrders = ({ viewType, title }) => {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  // Day-wise filtering state
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const red = "#E53935";
  const detailCollection = getCollectionNameForView(viewType);

  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params = { view: viewType };

      if (viewType === "day_wise") {
          if (fromDate) params.fromDate = fromDate;
          if (toDate) params.toDate = toDate;
          if (paymentFilter !== "all") params.paymentMethod = paymentFilter;
      }
      const response = await storeWorkspaceApi.getOrders(store?.id, params);
      const list = response?.data?.data || response?.data?.results || response?.data || [];
      const normalizedList = Array.isArray(list) ? list : [];

      setOrders(normalizedList.map(mapOrderRecord));
    } catch (err) {
      console.error("Orders Sync Error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [store, viewType, fromDate, toDate, paymentFilter]);

  useEffect(() => {
    if (store?.id) fetchOrders();
  }, [fetchOrders, store?.id]);

  const handleUpdateStatus = useCallback(async (order, newStatus) => {
    try {
        await storeWorkspaceApi.updateOrderStatus(store?.id, order.id, {
            view: viewType,
            nextStatus: newStatus,
            cancellationReason: newStatus === "Cancelled" ? "Cancelled by Store Manager" : undefined
        });

        await fetchOrders(true);
        setSnackbar({ open: true, message: `Order marked as ${newStatus}`, severity: "success" });
    } catch (e) {
        setSnackbar({ open: true, message: "Action failed", severity: "error" });
    }
  }, [fetchOrders, store?.id, viewType]);

  const handleOpenOrderDetails = useCallback((order) => {
    navigate(`../details/${order.id}?collection=${encodeURIComponent(detailCollection)}`, {
      relative: "path",
      state: {
        order: order.raw,
        collection: detailCollection,
      },
    });
  }, [detailCollection, navigate]);

  const filteredOrders = useMemo(() => orders.filter(o => 
    o.cartId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user.toLowerCase().includes(searchTerm.toLowerCase())
  ), [orders, searchTerm]);

  const stats = useMemo(() => {
     return [
        { label: "TOTAL ORDERS", value: orders.length, icon: <ShoppingBasketIcon />, color: "#4318ff", bg: "#eef2ff" },
        { label: "ACTIVE SHIPMENTS", value: orders.filter(o => ["Accepted", "Out For Delivery", "Processing"].includes(o.status)).length, icon: <LocalShippingIcon />, color: "#ffb800", bg: "#fff9e6" },
        { label: "COMPLETED", value: orders.filter(o => ["Delivered", "Completed"].includes(o.status)).length, icon: <DoneAllIcon />, color: "#24d164", bg: "#e6f9ed" },
        { label: "REVENUE", value: "₹" + orders.reduce((sum, o) => sum + Number(o.price || 0), 0).toLocaleString(), icon: <TrendingUpIcon />, color: "#ff4d49", bg: "#fff1f0" },
     ];
  }, [orders]);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}><CircularProgress sx={{ color: red }} /></Box>;  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Header Section */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                {title || "Order History"}
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ fontWeight: "500" }}>
                Browse and audit the complete repository of lifecycle order data for {store.name}.
            </Typography>
        </Box>
        <Button 
            variant="contained" 
            startIcon={refreshing ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />} 
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            sx={{ 
                backgroundColor: "#1b2559", 
                borderRadius: "12px", 
                textTransform: "none", 
                fontWeight: "700",
                px: 3,
                boxShadow: "0 10px 20px rgba(27, 37, 89, 0.2)",
                "&:hover": { bgcolor: "#0d1433" }
            }}
        >
            {refreshing ? "Refreshing..." : "Reload Data"}
        </Button>
      </Box>

      {/* Summary Cards Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
                <Paper sx={{ p: 2.5, borderRadius: "20px", display: "flex", alignItems: "center", gap: 2, border: "1px solid #e0e5f2", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
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

      {/* DAY WISE FILTER BAR */}
      {viewType === "day_wise" && (
          <Paper sx={{ p: 2.5, mb: 3, borderRadius: "20px", border: "1px solid #e0e5f2", boxShadow: "0 10px 20px rgba(0,0,0,0.02)" }}>
              <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                      <Typography variant="caption" fontWeight="900" color="#a3aed0" display="block" sx={{ mb: 1, letterSpacing: "1px" }}>PAYMENT METHOD</Typography>
                      <TextField 
                        select 
                        fullWidth 
                        size="small" 
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                        SelectProps={{ native: true }}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
                      >
                          <option value="all">All Methods</option>
                          <option value="COD">Cash on Delivery</option>
                          <option value="Online">Online Payment</option>
                          <option value="Wallet">Wallet</option>
                      </TextField>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                      <Typography variant="caption" fontWeight="900" color="#a3aed0" display="block" sx={{ mb: 1, letterSpacing: "1px" }}>FROM DATE</Typography>
                      <TextField 
                        type="date" 
                        fullWidth 
                        size="small" 
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
                      />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                      <Typography variant="caption" fontWeight="900" color="#a3aed0" display="block" sx={{ mb: 1, letterSpacing: "1px" }}>TO DATE</Typography>
                      <TextField 
                        type="date" 
                        fullWidth 
                        size="small" 
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
                      />
                  </Grid>
                  <Grid item xs={12} sm={3} sx={{ mt: 2.5 }}>
                      <Button 
                        variant="contained" 
                        fullWidth
                        onClick={() => fetchOrders(true)}
                        sx={{ bgcolor: "#4318ff", borderRadius: "12px", fontWeight: "800", textTransform: "none", py: 1 }}
                      >
                          Filter Repository
                      </Button>
                  </Grid>
              </Grid>
          </Paper>
      )}

      {/* Utility Bar */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }} justifyContent="space-between">
        <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
            <TextField
                size="small"
                placeholder="Search by ID or Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                    flex: 1,
                    maxWidth: "500px",
                    "& .MuiOutlinedInput-root": { 
                        borderRadius: "16px", 
                        backgroundColor: "#fff",
                        "& fieldset": { borderColor: "#e0e5f2" } 
                    }
                }}
                InputProps={{
                    startAdornment: <SearchIcon sx={{ color: "#a3aed0", fontSize: 20, mr: 1 }} />
                }}
            />
        </Box>
        <Stack direction="row" spacing={1.5}>
            <Tooltip title="Print Table">
                <IconButton onClick={() => window.print()} sx={{ backgroundColor: "#fff", border: "1px solid #e0e5f2", borderRadius: "12px" }}>
                    <PrintIcon sx={{ color: "#2b3674" }} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Export Report">
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
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", py: 2, pl: 4 }}>#</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>CART ID</TableCell>
                {viewType === "today" || viewType === "next_day" ? (
                    <>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>CART PRICE</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>USER</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>DELIVERY DATE</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>DELIVERY BOY</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>CART PRODUCTS</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>PAYMENT</TableCell>
                        <TableCell align="center" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>CONFIRMATION</TableCell>
                        <TableCell align="center" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>REASSIGN DBOY</TableCell>
                        <TableCell align="right" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", pr: 4 }}>INVOICE</TableCell>
                    </>
                ) : viewType === "day_wise" ? (
                    <>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>CART PRICE</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>USER</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>DELIVERY DATE</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>DELIVERY BOY</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>CART PRODUCTS</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>PAYMENT</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>ORDER STATUS</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", pr: 4 }}>STORE</TableCell>
                    </>
                ) : viewType === "completed" ? (
                    <>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>CART PRICE</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>USER</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>STORE</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>DELIVERY BOY</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>DELIVERY DATE</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>STATUS</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>CART PRODUCTS</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", pr: 4 }}>SIGNATURE</TableCell>
                    </>
                ) : viewType === "missed" ? (
                    <>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>STORE</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>TOTAL PRICE</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>USER</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>DELIVERY DATE</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>STATUS</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>CART PRODUCTS</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>ASSIGN</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", pr: 4 }}>ORDER STATUS</TableCell>
                    </>
                ) : viewType === "payment_failed" ? (
                    <>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>CART PRICE</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>USER</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>DELIVERY DATE</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>STATUS</TableCell>
                        <TableCell align="right" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", pr: 4 }}>DETAILS</TableCell>
                    </>
                ) : viewType === "out_for_delivery" ? (
                    <>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>CART PRICE</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>USER</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>DELIVERY DATE</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>STATUS</TableCell>
                        <TableCell align="right" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", pr: 4 }}>DETAILS</TableCell>
                    </>
                ) : viewType === "confirmed" ? (
                    <>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>CART PRICE</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>USER</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>DELIVERY DATE</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>STATUS</TableCell>
                        <TableCell align="right" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", pr: 4 }}>DETAILS</TableCell>
                    </>
                ) : viewType === "cancelled" ? (
                    <>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>CART PRICE</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>USER</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>STORE</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>DELIVERY BOY</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>DELIVERY DATE</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>STATUS</TableCell>
                        <TableCell align="right" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", pr: 4 }}>DETAILS</TableCell>
                    </>
                ) : (
                    <>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>CART PRICE</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>USER</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>DELIVERY DATE</TableCell>
                        <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>STATUS</TableCell>
                        <TableCell align="right" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", pr: 4 }}>DETAILS</TableCell>
                    </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={viewType === "completed" || viewType === "missed" || viewType === "day_wise" || viewType === "today" || viewType === "next_day" ? 11 : 7} align="center" sx={{ py: 10 }}>
                    <Typography variant="body1" color="#a3aed0" fontWeight="600">
                      No order records found for {getEmptyStateCopy(viewType)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((row, index) => {
                  const isExpanded = expandedOrderId === row.id;
                  const isFailed = row.status.toLowerCase().includes("cancel") || row.status.toLowerCase().includes("reject") || row.status.toLowerCase().includes("fail") || row.status.toLowerCase().includes("miss");

                  if (viewType === "today" || viewType === "next_day") {
                      return (
                        <TableRow key={row.id} hover sx={{ "&:hover": { backgroundColor: "#f9fbff" }, borderBottom: "1px solid #eef2f6" }}>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4, py: 2 }}>{String(index + 1).padStart(2, '0')}</TableCell>
                           <TableCell sx={{ color: "#4318ff", fontWeight: "900", fontFamily: "monospace" }}>{row.cartId}</TableCell>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "900" }}>₹{Number(row.price || 0).toLocaleString()}</TableCell>
                           <TableCell>
                                <Typography variant="body2" fontWeight="800" color="#1b2559">{row.user}</Typography>
                                <Typography variant="caption" color="#a3aed0" fontWeight="700">{row.userPhone}</Typography>
                           </TableCell>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "750" }}>{formatStoreDate(row.date)}</TableCell>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "750" }}>{row.dboy}</TableCell>
                           <TableCell sx={{ maxWidth: "200px" }}>
                                <Typography variant="caption" fontWeight="700" color="#707eae" sx={{ whiteSpace: "normal" }}>
                                    {row.items_preview.map(i => i.name).join(", ")}
                                </Typography>
                           </TableCell>
                           <TableCell>
                                <Chip label={row.payment?.toUpperCase() || "COD"} size="small" sx={{ fontWeight: 900, bgcolor: alpha("#4318ff", 0.05), color: "#4318ff", borderRadius: "8px", fontSize: "9px" }} />
                           </TableCell>
                           <TableCell align="center">
                                <Stack direction="row" spacing={1} justifyContent="center">
                                    <IconButton size="small" onClick={() => handleUpdateStatus(row, "Accepted")} sx={{ bgcolor: alpha("#05cd99", 0.1), color: "#05cd99", width: 30, height: 30 }}><DoneAllIcon sx={{ fontSize: 16 }} /></IconButton>
                                    <IconButton size="small" onClick={() => handleUpdateStatus(row, "Cancelled")} sx={{ bgcolor: alpha(red, 0.1), color: red, width: 30, height: 30 }}><RefreshIcon sx={{ fontSize: 16 }} /></IconButton>
                                </Stack>
                           </TableCell>
                           <TableCell align="center">
                                <IconButton size="small" sx={{ bgcolor: alpha("#4318ff", 0.05), color: "#4318ff", width: 36, height: 36, borderRadius: "10px" }}>
                                    <ReassignIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                           </TableCell>
                           <TableCell align="right" sx={{ pr: 4 }}>
                                <IconButton size="small" onClick={() => handleOpenOrderDetails(row)} sx={{ color: "#1b2559", borderRadius: "8px" }}>
                                    <InvoiceIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                           </TableCell>
                        </TableRow>
                      );
                  }

                  if (viewType === "day_wise") {
                      return (
                        <TableRow key={row.id} hover sx={{ "&:hover": { backgroundColor: "#f9fbff" }, borderBottom: "1px solid #eef2f6" }}>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4, py: 2 }}>{String(index + 1).padStart(2, '0')}</TableCell>
                           <TableCell sx={{ color: "#4318ff", fontWeight: "900", fontFamily: "monospace" }}>{row.cartId}</TableCell>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "900" }}>₹{Number(row.price || 0).toLocaleString()}</TableCell>
                           <TableCell>
                                <Typography variant="body2" fontWeight="800" color="#1b2559">{row.user}</Typography>
                                <Typography variant="caption" color="#a3aed0" fontWeight="700">{row.userPhone}</Typography>
                           </TableCell>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "750" }}>{formatStoreDate(row.date)}</TableCell>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "750" }}>{row.dboy}</TableCell>
                           <TableCell sx={{ maxWidth: "200px" }}>
                                <Typography variant="caption" fontWeight="700" color="#707eae" sx={{ whiteSpace: "normal" }}>
                                    {row.items_preview.map(i => i.name).join(", ")}
                                </Typography>
                           </TableCell>
                           <TableCell>
                                <Chip label={row.payment?.toUpperCase() || "COD"} size="small" sx={{ fontWeight: 900, bgcolor: alpha("#4318ff", 0.05), color: "#4318ff", borderRadius: "8px", fontSize: "9px" }} />
                           </TableCell>
                           <TableCell>
                                <Chip 
                                    label={(row.status || "PLACED").toUpperCase()} 
                                    size="small" 
                                    sx={{ 
                                        fontWeight: 900, 
                                        bgcolor: isFailed ? alpha(red, 0.05) : row.status?.toLowerCase() === "pending" ? alpha("#ffb547", 0.05) : alpha("#05cd99", 0.05), 
                                        color: isFailed ? red : row.status?.toLowerCase() === "pending" ? "#ffb547" : "#05cd99",
                                        borderRadius: "8px", fontSize: "9px"
                                    }} 
                                />
                           </TableCell>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "750", pr: 4 }}>{row.storeName}</TableCell>
                        </TableRow>
                      );
                  }

                  if (viewType === "payment_failed") {
                      return (
                        <TableRow key={row.id} hover sx={{ "&:hover": { backgroundColor: "#f9fbff" }, borderBottom: "1px solid #eef2f6" }}>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4, py: 2 }}>{String(index + 1).padStart(2, '0')}</TableCell>
                           <TableCell sx={{ color: "#4318ff", fontWeight: "900", fontFamily: "monospace" }}>{row.cartId}</TableCell>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "900" }}>₹{Number(row.price || 0).toLocaleString()}</TableCell>
                           <TableCell>
                                <Typography variant="body2" fontWeight="800" color="#1b2559">{row.user}</Typography>
                                <Typography variant="caption" color="#a3aed0" fontWeight="700">{row.userPhone}</Typography>
                           </TableCell>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "750" }}>{formatStoreDate(row.date)}</TableCell>
                           <TableCell>
                                <Chip label="FAILED" size="small" sx={{ fontWeight: 900, bgcolor: alpha(red, 0.1), color: red, borderRadius: "8px", fontSize: "9px" }} />
                           </TableCell>
                           <TableCell align="right" sx={{ pr: 4 }}>
                                <IconButton size="small" onClick={() => handleOpenOrderDetails(row)} sx={{ color: "#4318ff", bgcolor: alpha("#4318ff", 0.05), "&:hover": { bgcolor: alpha("#4318ff", 0.1) } }}>
                                    <VisibilityIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                           </TableCell>
                        </TableRow>
                      );
                  }

                  if (viewType === "out_for_delivery") {
                      return (
                        <TableRow key={row.id} hover sx={{ "&:hover": { backgroundColor: "#f9fbff" }, borderBottom: "1px solid #eef2f6" }}>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4, py: 2 }}>{String(index + 1).padStart(2, '0')}</TableCell>
                           <TableCell sx={{ color: "#4318ff", fontWeight: "900", fontFamily: "monospace" }}>{row.cartId}</TableCell>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "900" }}>₹{Number(row.price || 0).toLocaleString()}</TableCell>
                           <TableCell>
                                <Typography variant="body2" fontWeight="800" color="#1b2559">{row.user}</Typography>
                                <Typography variant="caption" color="#a3aed0" fontWeight="700">{row.userPhone}</Typography>
                           </TableCell>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "750" }}>{formatStoreDate(row.date)}</TableCell>
                           <TableCell>
                                <Chip label="ON THE WAY" size="small" sx={{ fontWeight: 900, bgcolor: alpha("#4318ff", 0.1), color: "#4318ff", borderRadius: "8px", fontSize: "9px" }} />
                           </TableCell>
                           <TableCell align="right" sx={{ pr: 4 }}>
                                <IconButton size="small" onClick={() => handleOpenOrderDetails(row)} sx={{ color: "#4318ff", bgcolor: alpha("#4318ff", 0.05), "&:hover": { bgcolor: alpha("#4318ff", 0.1) } }}>
                                    <VisibilityIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                           </TableCell>
                        </TableRow>
                      );
                  }

                  if (viewType === "confirmed") {
                      return (
                        <TableRow key={row.id} hover sx={{ "&:hover": { backgroundColor: "#f9fbff" }, borderBottom: "1px solid #eef2f6" }}>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4, py: 2 }}>{String(index + 1).padStart(2, '0')}</TableCell>
                           <TableCell sx={{ color: "#4318ff", fontWeight: "900", fontFamily: "monospace" }}>{row.cartId}</TableCell>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "900" }}>₹{Number(row.price || 0).toLocaleString()}</TableCell>
                           <TableCell>
                                <Typography variant="body2" fontWeight="800" color="#1b2559">{row.user}</Typography>
                                <Typography variant="caption" color="#a3aed0" fontWeight="700">{row.userPhone}</Typography>
                           </TableCell>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "750" }}>{formatStoreDate(row.date)}</TableCell>
                           <TableCell>
                                <Chip label="PROCESSING" size="small" sx={{ fontWeight: 900, bgcolor: alpha("#05cd99", 0.1), color: "#05cd99", borderRadius: "8px", fontSize: "9px" }} />
                           </TableCell>
                           <TableCell align="right" sx={{ pr: 4 }}>
                                <IconButton size="small" onClick={() => handleOpenOrderDetails(row)} sx={{ color: "#4318ff", bgcolor: alpha("#4318ff", 0.05), "&:hover": { bgcolor: alpha("#4318ff", 0.1) } }}>
                                    <VisibilityIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                           </TableCell>
                        </TableRow>
                      );
                  }

                  if (viewType === "cancelled") {
                      return (
                        <React.Fragment key={row.id}>
                            <TableRow hover sx={{ "&:hover": { backgroundColor: "#f9fbff" }, borderBottom: "1px solid #eef2f6" }}>
                                <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4, py: 2 }}>
                                    <IconButton size="small" onClick={() => setExpandedOrderId(isExpanded ? null : row.id)} sx={{ color: red, mr: 1 }}>
                                        {isExpanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                                    </IconButton>
                                    {String(index + 1).padStart(2, '0')}
                                </TableCell>
                                <TableCell sx={{ color: "#4318ff", fontWeight: "900", fontFamily: "monospace" }}>{row.cartId}</TableCell>
                                <TableCell sx={{ color: "#1b2559", fontWeight: "900" }}>₹{Number(row.price || 0).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="800" color="#1b2559">{row.user}</Typography>
                                    <Typography variant="caption" color="#a3aed0" fontWeight="700">{row.userPhone}</Typography>
                                </TableCell>
                                <TableCell sx={{ color: "#1b2559", fontWeight: "750" }}>{row.storeName}</TableCell>
                                <TableCell sx={{ color: "#1b2559", fontWeight: "750" }}>{row.dboy}</TableCell>
                                <TableCell sx={{ color: "#1b2559", fontWeight: "750" }}>{formatStoreDate(row.date)}</TableCell>
                                <TableCell sx={{ pr: 4 }}>
                                    <Chip label="CANCELLED" size="small" sx={{ fontWeight: 900, bgcolor: alpha(red, 0.1), color: red, borderRadius: "8px", fontSize: "9px" }} />
                                </TableCell>
                                <TableCell align="right" sx={{ pr: 4 }}>
                                    <IconButton size="small" onClick={() => handleOpenOrderDetails(row)} sx={{ color: "#4318ff", bgcolor: alpha("#4318ff", 0.05), "&:hover": { bgcolor: alpha("#4318ff", 0.1) } }}>
                                        <VisibilityIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={9} sx={{ py: 0, border: "none" }}>
                                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                        <Box sx={{
                                            py: 3, px: 6,
                                            backgroundColor: alpha(red, 0.02),
                                            borderBottom: `1px solid ${alpha(red, 0.1)}`,
                                            borderLeft: `6px solid ${red}`,
                                            display: "flex", alignItems: "flex-start", gap: 6
                                        }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="caption" color={red} fontWeight="900" sx={{ letterSpacing: "1px" }}>CANCELLING REASON</Typography>
                                                <Typography variant="body2" color="#1b2559" fontWeight="700" sx={{ mt: 1 }}>{row.reason || "Client-Side Cancellation or Manual Override"}</Typography>
                                            </Box>
                                            <Box sx={{ height: "60px", borderLeft: `1px solid ${alpha(red, 0.2)}` }} />
                                            <Box sx={{ flex: 2 }}>
                                                <Typography variant="caption" color="#a3aed0" fontWeight="900" sx={{ letterSpacing: "1px" }}>CART PRODUCTS (DETAILS)</Typography>
                                                <Typography variant="body2" color="#707eae" fontWeight="700" sx={{ mt: 1, whiteSpace: "normal" }}>
                                                    {row.items_preview.map(i => `${i.name} (${i.qty})`).join(", ")}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ ml: "auto", alignSelf: "center" }}>
                                                <Button variant="text" size="small" onClick={() => handleOpenOrderDetails(row)} sx={{ color: red, fontWeight: "800", textTransform: "none" }}>
                                                    Audit Lifecycle Log →
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </React.Fragment>
                      );
                  }

                  if (viewType === "completed") {
                    return (
                        <TableRow key={row.id} hover sx={{ "&:hover": { backgroundColor: "#f9fbff" }, borderBottom: "1px solid #eef2f6" }}>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4, py: 2 }}>{String(index + 1).padStart(2, '0')}</TableCell>
                           <TableCell sx={{ color: "#4318ff", fontWeight: "900", fontFamily: "monospace" }}>{row.cartId}</TableCell>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "900" }}>₹{Number(row.price || 0).toLocaleString()}</TableCell>
                           <TableCell>
                                <Typography variant="body2" fontWeight="800" color="#1b2559">{row.user}</Typography>
                                <Typography variant="caption" color="#a3aed0" fontWeight="700">{row.userPhone}</Typography>
                           </TableCell>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "750" }}>{row.storeName}</TableCell>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "750" }}>{row.dboy}</TableCell>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "750" }}>{formatStoreDate(row.date)}</TableCell>
                           <TableCell>
                                <Chip label="DELIVERED" size="small" sx={{ fontWeight: 900, bgcolor: alpha("#05cd99", 0.1), color: "#05cd99", borderRadius: "8px", fontSize: "9px" }} />
                           </TableCell>
                           <TableCell sx={{ maxWidth: "200px" }}>
                                <Typography variant="caption" fontWeight="700" color="#707eae" sx={{ whiteSpace: "normal" }}>
                                    {row.items_preview.map(i => i.name).join(", ")}
                                </Typography>
                           </TableCell>
                           <TableCell sx={{ pr: 4 }}>
                                {row.signature && row.signature !== "N/A" ? (
                                    <Avatar src={row.signature} sx={{ width: 60, height: 30, borderRadius: "6px", border: "1px solid #e0e5f2" }} variant="square" />
                                ) : (
                                    <Typography variant="caption" fontWeight="800" color="#05cd99">VERIFIED</Typography>
                                )}
                           </TableCell>
                        </TableRow>
                    );
                  }

                  if (viewType === "missed") {
                      return (
                        <TableRow key={row.id} hover sx={{ "&:hover": { backgroundColor: "#f9fbff" }, borderBottom: "1px solid #eef2f6" }}>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4, py: 2 }}>{String(index + 1).padStart(2, '0')}</TableCell>
                           <TableCell sx={{ color: "#4318ff", fontWeight: "900", fontFamily: "monospace" }}>{row.cartId}</TableCell>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "750" }}>{row.storeName}</TableCell>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "900" }}>₹{Number(row.price || 0).toLocaleString()}</TableCell>
                           <TableCell>
                                <Typography variant="body2" fontWeight="800" color="#1b2559">{row.user}</Typography>
                                <Typography variant="caption" color="#a3aed0" fontWeight="700">{row.userPhone}</Typography>
                           </TableCell>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "750" }}>{formatStoreDate(row.date)}</TableCell>
                           <TableCell>
                                <Chip label="MISSED" size="small" sx={{ fontWeight: 900, bgcolor: alpha(red, 0.1), color: red, borderRadius: "8px", fontSize: "9px" }} />
                           </TableCell>
                           <TableCell sx={{ maxWidth: "200px" }}>
                                <Typography variant="caption" fontWeight="700" color="#707eae" sx={{ whiteSpace: "normal" }}>
                                    {row.items_preview.map(i => i.name).join(", ")}
                                </Typography>
                           </TableCell>
                           <TableCell sx={{ color: "#1b2559", fontWeight: "750" }}>{row.dboy}</TableCell>
                           <TableCell sx={{ pr: 4 }}>
                                <Chip 
                                    label={(row.status || "MISSED").toUpperCase()} 
                                    size="small" 
                                    sx={{ fontWeight: "900", bgcolor: alpha("#4318ff", 0.06), color: "#4318ff", borderRadius: "8px", fontSize: "9px" }} 
                                />
                           </TableCell>
                        </TableRow>
                      );
                  }

                  return (
                    <TableRow key={row.id} hover sx={{ "&:hover": { backgroundColor: "#f9fbff" }, borderBottom: "1px solid #eef2f6" }}>
                        <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4, py: 2 }}>
                            {String(index + 1).padStart(2, '0')}
                        </TableCell>
                        <TableCell sx={{ color: "#4318ff", fontWeight: "900", fontFamily: "monospace" }}>{row.cartId}</TableCell>
                        <TableCell sx={{ color: "#1b2559", fontWeight: "900" }}>₹{Number(row.price || 0).toLocaleString()}</TableCell>
                        <TableCell>
                            <Typography variant="body2" fontWeight="800" color="#1b2559">{row.user}</Typography>
                            <Typography variant="caption" color="#a3aed0" fontWeight="700">{row.userPhone}</Typography>
                        </TableCell>
                        <TableCell sx={{ color: "#1b2559", fontWeight: "750" }}>{formatStoreDate(row.date)}</TableCell>
                        <TableCell>
                            <Chip 
                                label={(row.status || "PENDING").toUpperCase()} 
                                size="small" 
                                sx={{ 
                                    fontWeight: 900, 
                                    bgcolor: isFailed ? alpha(red, 0.05) : row.status?.toLowerCase() === "pending" ? alpha("#ffb547", 0.05) : alpha("#05cd99", 0.05), 
                                    color: isFailed ? red : row.status?.toLowerCase() === "pending" ? "#ffb547" : "#05cd99",
                                    borderRadius: "8px", fontSize: "9px"
                                }} 
                            />
                        </TableCell>
                        <TableCell align="right" sx={{ pr: 4 }}>
                            <IconButton size="small" onClick={() => handleOpenOrderDetails(row)} sx={{ color: "#4318ff", bgcolor: alpha("#4318ff", 0.05), "&:hover": { bgcolor: alpha("#4318ff", 0.1) } }}>
                                <VisibilityIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: "16px", fontWeight: "900" }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default StoreOrders;

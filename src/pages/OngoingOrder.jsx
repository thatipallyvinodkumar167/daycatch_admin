import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PrintIcon from "@mui/icons-material/Print";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import StoreIcon from "@mui/icons-material/Store";
import { genericApi } from "../api/genericApi";
import OrderDetailsDialog from "../components/OrderDetailsDialog";
import StoreAssignDialog from "../components/StoreAssignDialog";
import {
  buildOrderPayload,
  moveOrderBetweenCollections,
  syncOrderHistory,
} from "../utils/orderLifecycle";

const OngoingOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await genericApi.getAll("ongoingorders");
      const apiResults = response.data?.results || response.data?.data || response.data || [];
      
      const formattedData = apiResults.map((order, index) => ({
        id: order._id || index + 1,
        cartId: order["Cart ID"] || order.cartId || order._id,
        cartPrice: parseFloat(order["Cart price"] || order.cartPrice || 0),
        userName: order["User"] || order.user || "N/A",
        userPhone: order["User Phone"] || order.phone || order.Details?.phone || "N/A",
        deliveryDateRaw: order["Delivery Date"] || order.deliveryDate || null,
        deliveryDate: order["Delivery Date"] ? new Date(order["Delivery Date"]).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : "N/A",
        status: order["Status"] || order.status || "Ongoing",
        timeSlot: order["Time Slot"] || order.timeSlot || "N/A",
        address: order.Address || order.address || order.Details?.address || "N/A",
        store: order["Store Name"] || order.Store || order.storeName || "N/A",
        deliveryBoy: order["Boy Name"] || order.Assign || order["Delivery Boy"] || "N/A",
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
      console.error("Error fetching ongoing orders:", error);
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

  const handleOpenAssign = (order) => {
    setSelectedOrder(order);
    setOpenAssign(true);
  };

  const handleDispatchOrder = async (order) => {
    setActionLoading(order.id);
    try {
      const outForDeliveryPayload = buildOrderPayload(order, {
        Status: "Out for Delivery",
        status: "Out for Delivery",
      });

      await moveOrderBetweenCollections({
        sourceCollection: "ongoingorders",
        targetCollection: "out for orders",
        order,
        payload: outForDeliveryPayload,
      });

      setOrders((prev) => prev.filter((item) => item.id !== order.id));
    } catch (error) {
      console.error("Failed to dispatch order:", error);
      alert("Failed to move order to Out for Delivery. Please try again.");
      fetchOrders();
    } finally {
      setActionLoading(null);
    }
  };

  const handleAssignStore = async (store) => {
    if (!selectedOrder) return;

    setActionLoading(selectedOrder.id);
    try {
      const storeName = store["Store Name"] || store.name || "N/A";
      const updatedPayload = buildOrderPayload(selectedOrder, {
        "Store Name": storeName,
        storeId: store._id,
        storeName,
      });

      await genericApi.update("ongoingorders", selectedOrder.id, updatedPayload);
      await syncOrderHistory(updatedPayload);
      setOpenAssign(false);
      fetchOrders();
    } catch (error) {
      console.error("Failed to update assigned store:", error);
      alert("Failed to change store. Please try again.");
      setOpenAssign(false);
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
    `/all-orders/details/${orderId}?collection=${encodeURIComponent("ongoingorders")}`;

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Page Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Ongoing Orders
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ fontWeight: "500" }}>
                Monitor active orders currently in preparation or transit.
            </Typography>
        </Box>
      </Box>

      {/* Summary Cards Row (Matching AllOrders) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
            { label: "ONGOING ORDERS", value: orders.length, icon: <LocalShippingIcon />, color: "#4318ff", bg: "#eef2ff" },
            { label: "IN PROCESSING", value: orders.filter(o => o.status.toLowerCase().includes("process")).length, icon: <ShoppingBasketIcon />, color: "#ffb800", bg: "#fff9e6" },
            { label: "DISPATCHED", value: orders.filter(o => o.status.toLowerCase().includes("deliver")).length, icon: <DoneAllIcon />, color: "#24d164", bg: "#e6f9ed" },
            { label: "ACTIVE REVENUE", value: "₹" + orders.reduce((sum, o) => sum + o.cartPrice, 0).toLocaleString(), icon: <TrendingUpIcon />, color: "#ff4d49", bg: "#fff1f0" },
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
                placeholder="Search by cart ID or customer..."
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
            <Tooltip title="Print List">
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
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>CART ID</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>PRICE</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>USER</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>DATE</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>PRODUCTS</TableCell>
                <TableCell align="center" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>DETAILS</TableCell>
                <TableCell align="right" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", pr: 4, borderBottom: "1px solid #e0e5f2" }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                    <Typography variant="body1" color="#a3aed0" fontWeight="600">
                      No ongoing orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order, index) => {
                  const isExpanded = expandedOrderId === order.id;

                  return (
                    <React.Fragment key={order.id}>
                    <TableRow sx={{ "&:hover": { bgcolor: "#f4f7fe" }, transition: "0.2s", backgroundColor: isExpanded ? "#f4f7fe" : "inherit" }}>
                      <TableCell sx={{ color: "#a3aed0", fontWeight: "800", pl: 4 }}>
                        <IconButton size="small" onClick={() => toggleExpand(order.id)} sx={{ mr: 1, color: "#4318ff" }}>
                          {isExpanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                        </IconButton>
                        {String(index + 1).padStart(2, '0')}
                      </TableCell>
                      <TableCell sx={{ color: "#4318ff", fontWeight: "800" }}>{order.cartId}</TableCell>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "800" }}>₹{order.cartPrice.toLocaleString()}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="800" color="#1b2559">{order.userName}</Typography>
                          <Typography variant="caption" color="#a3aed0" fontWeight="600">{order.userPhone}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: "#475467", fontWeight: "700" }}>{order.deliveryDate}</TableCell>
                      <TableCell>
                         <AvatarGroup max={3} sx={{ justifyContent: "flex-start", "& .MuiAvatar-root": { width: 34, height: 34, borderRadius: "10px", border: "2px solid #fff" } }}>
                          {order.products.map((p, i) => (
                            <Tooltip key={i} title={p.name}>
                              <Avatar src={p.img} alt={p.name} />
                            </Tooltip>
                          ))}
                        </AvatarGroup>
                      </TableCell>
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
                            Track Order
                        </Button>
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 3 }}>
                         <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Manage Store">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleOpenAssign(order)}
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
                                    <StoreIcon sx={{ fontSize: "18px" }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Full Order Summary">
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
                        </Stack>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell colSpan={8} sx={{ py: 0, borderBottom: isExpanded ? "1px solid #e0e5f2" : "none" }}>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                <Box sx={{ p: 4, backgroundColor: "#fafbfc" }}>
                                    <Stack direction="row" spacing={4} alignItems="flex-start">
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle2" fontWeight="800" gutterBottom color="#2b3674">LOGISTICS SUMMARY</Typography>
                                            <Typography variant="body2" color="#475467" fontWeight="600">{order.address}</Typography>
                                            <Typography variant="body2" color="#a3aed0" sx={{ mt: 1 }}>Time Slot: {order.timeSlot}</Typography>
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle2" fontWeight="800" gutterBottom color="#2b3674">FULFILLMENT ACTIONS</Typography>
                                            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                                <Button
                                                    variant="contained"
                                                    startIcon={actionLoading === order.id ? <CircularProgress size={16} color="inherit" /> : <LocalShippingIcon />}
                                                    onClick={() => handleDispatchOrder(order)}
                                                    disabled={actionLoading === order.id}
                                                    sx={{ bgcolor: "#11b055", borderRadius: "12px", textTransform: "none", fontWeight: "800", "&:hover": { bgcolor: "#0e9146" } }}
                                                >
                                                    {actionLoading === order.id ? "Dispatching..." : "Dispatch Order"}
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => handleOpenAssign(order)}
                                                    disabled={actionLoading === order.id}
                                                    sx={{ borderRadius: "12px", textTransform: "none", fontWeight: "800", color: "#1b2559", borderColor: "#e0e5f2" }}
                                                >
                                                    Change Store
                                                </Button>
                                            </Stack>
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

      <StoreAssignDialog 
        open={openAssign}
        onClose={() => setOpenAssign(false)}
        onAssign={handleAssignStore}
        orderId={selectedOrder?.cartId}
      />
    </Box>
  );
};

export default OngoingOrder;

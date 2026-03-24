import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Button,
  Chip,
  Stack,
  Avatar,
  AvatarGroup,
  Tooltip,
  IconButton,
  Collapse,
  LinearProgress,
  CircularProgress,
  Grid,
} from "@mui/material";
import { 
  LocalShipping as LocalShippingIcon,
  Refresh as RefreshIcon,
  ShoppingBasket as ShoppingBasketIcon,
  Print as PrintIcon,
  FileDownload as FileDownloadIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  DoneAll as DoneAllIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Store as StoreIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";
import { getAllOrders } from "../api/ordersApi";
import OrderDetailsDialog from "../components/OrderDetailsDialog";
import StoreAssignDialog from "../components/StoreAssignDialog";

const getStatusConfig = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("complete") || s.includes("deliver")) return { color: "#00d26a", bgcolor: "rgba(0, 210, 106, 0.08)", icon: <DoneAllIcon sx={{ fontSize: 14 }} /> };
    if (s.includes("cancel") || s.includes("reject")) return { color: "#ff4d49", bgcolor: "rgba(255, 77, 73, 0.08)", icon: <WarningIcon sx={{ fontSize: 14 }} /> };
    if (s.includes("ongoing") || s.includes("shipping")) return { color: "#4318ff", bgcolor: "rgba(67, 24, 255, 0.08)", icon: <LocalShippingIcon sx={{ fontSize: 14 }} /> };
    return { color: "#ffb547", bgcolor: "rgba(255, 181, 71, 0.08)", icon: <InventoryIcon sx={{ fontSize: 14 }} /> };
};

const AllOrders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const storeId = queryParams.get("storeId");

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const response = await getAllOrders({ limit: 500, storeId: storeId });
      const apiResults = response.data?.results || response.data?.data || response.data || [];

      const formattedData = apiResults.map((order, index) => ({
        id: order._id || index + 1,
        cartId: order["Cart ID"] || order.cartId || order._id,
        cartPrice: parseFloat(order["Cart price"] || order.cartPrice || 0),
        userName: order["User"] || order.user || "N/A",
        userPhone: order.Details?.phone || order["User Phone"] || "N/A",
        deliveryDate: order["Delivery Date"] ? new Date(order["Delivery Date"]).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : "N/A",
        status: order["Status"] || order.status || "Processing",
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
        address: order.Address || order.address || order.Details?.address || "N/A",
        timeSlot: order["Time Slot"] || order.timeSlot || "N/A",
      }));

      setOrders(formattedData);
    } catch (error) {
      console.error("Error fetching pending orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [storeId]);

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

  const filteredOrders = useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return orders;
    return orders.filter(
      (order) =>
        (order.cartId || "").toString().toLowerCase().includes(s) ||
        (order.userName || "").toString().toLowerCase().includes(s)
    );
  }, [orders, search]);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Header Section */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Order History
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ fontWeight: "500" }}>
                Browse and audit the complete repository of lifecycle order data.
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
                boxShadow: "0 10px 20px rgba(27, 37, 89, 0.2)"
            }}
        >
            {refreshing ? "Refreshing..." : "Reload Data"}
        </Button>
      </Box>

      {/* Summary Cards Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
            { label: "TOTAL ORDERS", value: orders.length, icon: <ShoppingBasketIcon />, color: "#4318ff", bg: "#eef2ff" },
            { label: "ACTIVE SHIPMENTS", value: orders.filter(o => o.status.toLowerCase().includes("ongoing")).length, icon: <LocalShippingIcon />, color: "#ffb800", bg: "#fff9e6" },
            { label: "COMPLETED", value: orders.filter(o => o.status.toLowerCase().includes("complete")).length, icon: <DoneAllIcon />, color: "#24d164", bg: "#e6f9ed" },
            { label: "REVENUE", value: "₹" + orders.reduce((sum, o) => sum + o.cartPrice, 0).toLocaleString(), icon: <TrendingUpIcon />, color: "#ff4d49", bg: "#fff1f0" },
        ].map((stat, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
                <Paper sx={{ p: 2.5, borderRadius: "20px", display: "flex", alignItems: "center", gap: 2, border: "1px solid #e0e5f2" }}>
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
                placeholder="Search by ID or Customer..."
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
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>PRICE</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>USER</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>DATE</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>PREVIEW</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>STATUS</TableCell>
                <TableCell align="center" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>QUICK VIEW</TableCell>
                <TableCell align="right" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", pr: 4 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 10 }}>
                    <Typography variant="body1" color="#a3aed0" fontWeight="600">
                      No order records found in history
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order, index) => {
                  const isExpanded = expandedOrderId === order.id;
                  const config = getStatusConfig(order.status);

                  return (
                    <React.Fragment key={order.id}>
                    <TableRow sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s", backgroundColor: isExpanded ? "#f9fbff" : "inherit" }}>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4 }}>
                        <IconButton size="small" onClick={() => toggleExpand(order.id)} sx={{ color: "#4318ff", mr: 1 }}>
                          {isExpanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                        </IconButton>
                        {String(index + 1).padStart(2, '0')}
                      </TableCell>
                      <TableCell sx={{ color: "#4318ff", fontWeight: "900", fontFamily: "monospace" }}>{order.cartId}</TableCell>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "900" }}>₹{order.cartPrice.toLocaleString()}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="800" color="#1b2559">{order.userName}</Typography>
                        <Typography variant="caption" color="#a3aed0" fontWeight="700">{order.userPhone}</Typography>
                      </TableCell>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "750" }}>{order.deliveryDate}</TableCell>
                      <TableCell>
                        <AvatarGroup max={3} sx={{ justifyContent: "flex-start", "& .MuiAvatar-root": { width: 32, height: 32, borderRadius: "10px", border: "2px solid #fff" } }}>
                          {order.products.map((p, i) => (
                            <Tooltip key={i} title={p.name}>
                              <Avatar src={p.img} alt={p.name} />
                            </Tooltip>
                          ))}
                        </AvatarGroup>
                      </TableCell>
                      <TableCell>
                         <Chip 
                            label={order.status.toUpperCase()} 
                            size="small" 
                            icon={config.icon}
                            sx={{ backgroundColor: config.bgcolor, color: config.color, fontWeight: "900", fontSize: "10px", borderRadius: "8px" }} 
                         />
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
                            Quick View
                        </Button>
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 3 }}>
                         <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Track & Audit Order">
                                <Button
                                  variant="contained"
                                  size="small"
                                  startIcon={<LocationOnIcon sx={{ fontSize: "14px !important" }} />}
                                  onClick={() => navigate(`/all-orders/details/${order.id}`)}
                                  sx={{ 
                                    bgcolor: "#4318ff", 
                                    borderRadius: "10px", 
                                    textTransform: "none", 
                                    fontWeight: "800",
                                    fontSize: "12px",
                                    "&:hover": { bgcolor: "#3311cc" },
                                    boxShadow: "0 4px 10px rgba(67, 24, 255, 0.2)"
                                  }}
                                >
                                    Track Order
                                </Button>
                            </Tooltip>
                            <Tooltip title="Re-assign Store">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleOpenAssign(order)}
                                  sx={{ 
                                    color: "#fff", 
                                    bgcolor: "#24d164", 
                                    borderRadius: "12px", 
                                    width: "36px", 
                                    height: "36px", 
                                    "&:hover": { bgcolor: "#1fb355" },
                                    boxShadow: "0 4px 10px rgba(36,209,100,0.2)"
                                  }}
                                >
                                    <StoreIcon sx={{ fontSize: "18px" }} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                        <TableCell colSpan={9} sx={{ py: 0, border: "none" }}>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                <Box sx={{
                                    py: 3, px: 6,
                                    backgroundColor: "#f4f7fe",
                                    borderBottom: "1px solid #e0e5f2",
                                    borderLeft: "6px solid #4318ff",
                                    display: "flex", alignItems: "center", gap: 6
                                }}>
                                    <Box>
                                        <Typography variant="caption" color="#a3aed0" fontWeight="800">SHIPPING DESTINATION</Typography>
                                        <Typography variant="body2" color="#1b2559" fontWeight="700">{order.address}</Typography>
                                    </Box>
                                    <Box sx={{ height: "40px", borderLeft: "2px solid #e0e5f2" }} />
                                    <Box>
                                        <Typography variant="caption" color="#a3aed0" fontWeight="800">DELIVERY SLOT</Typography>
                                        <Typography variant="body2" color="#1b2559" fontWeight="700">{order.timeSlot}</Typography>
                                    </Box>
                                    <Box sx={{ ml: "auto" }}>
                                        <Button variant="text" size="small" onClick={() => navigate(`/all-orders/details/${order.id}`)} sx={{ color: "#4318ff", fontWeight: "800", textTransform: "none" }}>
                                            View Detailed Tracking History →
                                        </Button>
                                    </Box>
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

      {/* View Details Dialog */}
      <OrderDetailsDialog 
        open={openDetails} 
        onClose={() => setOpenDetails(false)} 
        order={selectedOrder} 
      />

      {/* Assign Store Dialog */}
      <StoreAssignDialog 
        open={openAssign}
        onClose={() => setOpenAssign(false)}
        onAssign={(store) => {
          alert(`Order Assigned to ${store.name || "Selected Store"}`);
          setOpenAssign(false);
          fetchOrders();
        }}
        orderId={selectedOrder?.cartId}
      />
    </Box>
  );
};

export default AllOrders;

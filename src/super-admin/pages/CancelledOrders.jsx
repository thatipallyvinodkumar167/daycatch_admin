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
  Stack,
  Button,
  Avatar,
  AvatarGroup,
  Tooltip,
  IconButton,
  Collapse,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import { genericApi } from "../../api/genericApi";
import OrderDetailsDialog from "../../components/OrderDetailsDialog";
import {
  buildOrderPayload,
  moveOrderBetweenCollections,
} from "../../utils/orderLifecycle";

const CancelledOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await genericApi.getAll("cancelled orders");
      const apiResults = response.data?.results || response.data?.data || response.data || [];
      
      const formattedData = apiResults.map((order, index) => ({
        id: order._id || index + 1,
        cartId: order["Cart ID"] || order.cartId || order._id,
        cartPrice: parseFloat(order["Cart price"] || order.cartPrice || 0),
        userName: order["User"] || order.user || "N/A",
        userPhone: order["User Phone"] || order.phone || order.Details?.phone || "N/A",
        store: order["Store Name"] || order.store || "N/A",
        deliveryBoy: order["Boy Name"] || order.deliveryBoy || "N/A",
        deliveryDate: order["Delivery Date"] ? new Date(order["Delivery Date"]).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : "N/A",
        status: order["Status"] || order.status || "Cancelled",
        reason: order["Cancelling Reason"] || order.reason || "N/A",
        address: order.Address || order.address || order.Details?.address || "N/A",
        timeSlot: order["Time Slot"] || order.timeSlot || "N/A",
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
      console.error("Error fetching cancelled orders:", error);
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
    `/all-orders/details/${orderId}?collection=${encodeURIComponent("cancelled orders")}`;

  const handleRestartOrder = async (order) => {
    setActionLoading(order.id);
    try {
      const pendingPayload = buildOrderPayload(order, {
        Status: "Pending",
        status: "Pending",
      });

      delete pendingPayload["Cancelling Reason"];
      delete pendingPayload.reason;

      await moveOrderBetweenCollections({
        sourceCollection: "cancelled orders",
        targetCollection: "pending orders",
        order,
        payload: pendingPayload,
      });
      setOrders((prev) => prev.filter((item) => item.id !== order.id));
    } catch (error) {
      console.error("Failed to restart cancelled order:", error);
      alert("Failed to restart order. Please try again after the API is available.");
      fetchOrders();
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Page Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Cancelled Orders
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ fontWeight: "500" }}>
                Record of orders that were voided or retracted.
            </Typography>
        </Box>
      </Box>

      {/* Stats Summary Section */}
      <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
        <Paper sx={{ p: 3, flex: 1, borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 2, backgroundColor: "#fff" }}>
          <Avatar sx={{ bgcolor: "#fff5f5", color: "#ff4d49", width: 56, height: 56 }}>
            <CancelIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ letterSpacing: "1px" }}>TOTAL CANCELLED</Typography>
            <Typography variant="h4" fontWeight="800" color="#1b2559">{orders.length}</Typography>
          </Box>
        </Paper>
      </Stack>

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
        {loading && <LinearProgress sx={{ "& .MuiLinearProgress-bar": { bgcolor: "#ff4d49" } }} />}
        
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", py: 2, pl: 4, borderBottom: "1px solid #e0e5f2" }}>#</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>CART ID</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>PRICE</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>USER</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>DATE</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>REASON</TableCell>
                <TableCell align="center" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>DETAILS</TableCell>
                <TableCell align="right" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", pr: 4, borderBottom: "1px solid #e0e5f2" }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                    <Typography variant="body1" color="#a3aed0" fontWeight="600">
                      No cancelled orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order, index) => {
                  const isExpanded = expandedOrderId === order.id;
                  const isActingOnOrder = actionLoading === order.id;

                  return (
                    <React.Fragment key={order.id}>
                    <TableRow sx={{ "&:hover": { bgcolor: "#f4f7fe" }, transition: "0.2s", backgroundColor: isExpanded ? "#f4f7fe" : "inherit" }}>
                      <TableCell sx={{ color: "#a3aed0", fontWeight: "800", pl: 4 }}>
                        <IconButton size="small" onClick={() => toggleExpand(order.id)} sx={{ mr: 1, color: "#4318ff" }}>
                          {isExpanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                        </IconButton>
                        {String(index + 1).padStart(2, '0')}
                      </TableCell>
                      <TableCell sx={{ color: "#ff4d49", fontWeight: "800" }}>{order.cartId}</TableCell>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "800" }}>₹{order.cartPrice.toLocaleString()}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="800" color="#1b2559">{order.userName}</Typography>
                          <Typography variant="caption" color="#a3aed0" fontWeight="600">{order.userPhone}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: "#475467", fontWeight: "700" }}>{order.deliveryDate}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="700" color="#ff4d49" sx={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {order.reason}
                        </Typography>
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
                            View Log
                        </Button>
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 3 }}>
                         <Stack direction="row" spacing={1} justifyContent="flex-end">
                            {isActingOnOrder ? (
                              <CircularProgress size={24} sx={{ m: 1 }} />
                            ) : (
                              <>
                                <Tooltip title="View Details">
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleOpenDetails(order)}
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
                                <Tooltip title="Edit Case">
                                    <IconButton className="action-edit" 
                                      size="small" 
                                      onClick={() => navigate(buildOrderDetailsPath(order.id))}
                                      sx={{ 
                                        color: "#fff", 
                                        bgcolor: "#a3aed0", 
                                        borderRadius: "12px", 
                                        width: "36px", 
                                        height: "36px", 
                                        "&:hover": { bgcolor: "#8f9bba", transform: "translateY(-1px)" },
                                        transition: "0.2s"
                                      }}
                                    >
                                        <EditIcon sx={{ fontSize: "18px" }} />
                                    </IconButton>
                                </Tooltip>
                              </>
                            )}
                        </Stack>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell colSpan={8} sx={{ p: 0, borderBottom: "none" }}>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                <Box sx={{ p: 3, backgroundColor: "#fafbfc", borderTop: "1px solid #e0e5f2" }}>
                                    <Stack direction="row" spacing={4} alignItems="flex-start">
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle2" fontWeight="800" gutterBottom color="#2b3674">CANCELLATION CONTEXT</Typography>
                                            <Typography variant="body2" color="#475467" fontWeight="600">Reason: {order.reason}</Typography>
                                            <Typography variant="body2" color="#a3aed0" sx={{ mt: 1 }}>Location: {order.address}</Typography>
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle2" fontWeight="800" gutterBottom color="#2b3674">PRODUCTS INVOLVED</Typography>
                                            <AvatarGroup max={5} sx={{ justifyContent: "flex-start", "& .MuiAvatar-root": { width: 40, height: 40, borderRadius: "12px", border: "2px solid #fff" } }}>
                                                {order.products.map((p, i) => (
                                                    <Tooltip key={i} title={p.name}>
                                                        <Avatar src={p.img} alt={p.name} />
                                                    </Tooltip>
                                                ))}
                                            </AvatarGroup>
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="800" gutterBottom color="#2b3674">ACTIONS</Typography>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                disabled={isActingOnOrder}
                                                onClick={() => handleRestartOrder(order)}
                                                sx={{ 
                                                  borderRadius: "12px", 
                                                  bgcolor: "#4318ff", 
                                                  textTransform: "none", 
                                                  fontWeight: "800",
                                                  px: 2,
                                                  boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)"
                                                }}
                                            >
                                                {isActingOnOrder ? "Restarting..." : "Restart Order"}
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

export default CancelledOrders;




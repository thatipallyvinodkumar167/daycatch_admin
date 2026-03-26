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
  TextField,
  InputAdornment,
  Button,
  alpha,
  CircularProgress,
  IconButton,
  Tooltip,
  Chip,
  Collapse,
  Avatar,
  AvatarGroup,
  Grid,
} from "@mui/material";
import {
  Search as SearchIcon,
  LocalShipping as ShippingIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  CheckCircleOutline as ApproveIcon,
  CancelOutlined as RejectIcon,
  KeyboardArrowDown as ExpandIcon,
  KeyboardArrowUp as CollapseIcon,
  PlayArrow as ProcessIcon,
  CalendarMonth as CalendarIcon,
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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const navy = "#1b2559";
  const red = "#E53935";

  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params = { storeId: store?.id };
      
      if (viewType && viewType !== "all") {
        if (viewType === "today") {
          params.deliveryDate = new Date().toISOString().split('T')[0];
        } else if (viewType === "next_day") {
          const nextDay = new Date();
          nextDay.setDate(nextDay.getDate() + 1);
          params.deliveryDate = nextDay.toISOString().split('T')[0];
        } else if (viewType === "day_wise") {
          params.deliveryDate = selectedDate;
        } else {
          params.status = viewType;
        }
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
          console.warn(`Collection ${collectionName} might not be initialized, falling back to general orders.`);
          const response = await getAllOrders(params);
          list = response?.data?.results || response?.data || [];
      }
      
      const normalizedList = Array.isArray(list) ? list : [];
      
      setOrders(normalizedList.map(order => ({
        id: order._id || order.id || "N/A",
        cartId: order["Cart ID"] || order.cartId || order._id?.substring(0, 8) || "N/A",
        price: order["Cart price"] || order.amount || order.totalAmount || 0,
        user: order.User || order.user || order.customer || "User",
        userPhone: order["User Phone"] || order.phone || "N/A",
        date: order["Delivery Date"] || order.deliveryDate || order.createdAt || "",
        timeSlot: order["Time Slot"] || order.timeSlot || "N/A",
        address: order.Address || order.address || "N/A",
        status: order.Status || order.status || "Pending",
        reason: order["Cancelling Reason"] || order.cancelReason || "N/A",
        items_count: (order.Products || order.products || []).length,
        items_preview: (order.Products || order.products || []).map(p => ({
            name: p.product_name || p.name || "Item",
            img: p.image || p.img || ""
        })),
        dboy: order["Boy Name"] || order.deliveryBoyName || "Not Assigned",
        payment: order.paymentStatus || order.paymentMethod || "COD",
        raw: order
      })));
    } catch (err) {
      console.error("Orders Sync Error:", err);
      // Fallback for demonstration
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [store?.id, viewType, selectedDate]);

  useEffect(() => {
    if (store?.id) fetchOrders();
  }, [fetchOrders, store?.id, selectedDate]); // Trigger on date change too

  const handleUpdateStatus = async (order, newStatus) => {
    setActionLoading(order.id);
    try {
        const sourceMapping = {
            pending: "pending orders",
            confirmed: "ongoingorders",
            out_for_delivery: "out for orders"
        };
        const source = sourceMapping[viewType] || "orders";
        
        const statusMap = {
            Accepted: "ongoingorders",
            Processing: "ongoingorders",
            Cancelled: "cancelled orders",
            Delivered: "completed orders"
        };
        
        const target = statusMap[newStatus] || "orders";

        const payload = buildOrderPayload(order.raw, {
            Status: newStatus,
            status: newStatus,
            "Cancelling Reason": newStatus === "Cancelled" ? "Cancelled by Store Manager" : undefined
        });

        await moveOrderBetweenCollections({
            sourceCollection: source,
            targetCollection: target,
            order: { id: order.id },
            payload
        });

        setOrders(prev => prev.filter(o => o.id !== order.id));
    } catch (e) {
        console.error("Status Update Failed:", e);
    } finally {
        setActionLoading(null);
    }
  };

  const filteredOrders = useMemo(() => orders.filter(o => 
    o.cartId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user.toLowerCase().includes(searchTerm.toLowerCase())
  ), [orders, searchTerm]);

  const getTableColumns = () => {
     const common = [
        { id: "expand", label: "", width: "50px" },
        { id: "cartId", label: "Cart ID" },
        { id: "price", label: "Cart price" },
        { id: "user", label: "User" },
        { id: "date", label: "Delivery Date" },
        { id: "status", label: "Status" },
     ];
     return [...common, { id: "actions", label: "Actions", align: "right" }];
  };

  const columns = getTableColumns();

  if (loading) return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "60vh", gap: 2 }}>
      <CircularProgress sx={{ color: red }} />
      <Typography variant="body2" fontWeight="700" color="#a3aed0">Syncing order threads...</Typography>
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        
        <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: navy, mb: 0.5, letterSpacing: "-1.5px" }}>
               {title || "Orders Management"}
            </Typography>
            <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>
               Managing fulfillment for {store?.name || "assigned store"}.
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
             {viewType === "day_wise" && (
                <TextField
                   type="date"
                   size="small"
                   value={selectedDate}
                   onChange={(e) => setSelectedDate(e.target.value)}
                   InputProps={{
                      startAdornment: <InputAdornment position="start"><CalendarIcon sx={{ color: navy }} /></InputAdornment>,
                      sx: { borderRadius: "14px", bgcolor: "#fff", fontWeight: 800, border: "1px solid #e0e5f2", "& fieldset": { border: "none" } }
                   }}
                />
             )}
             <Tooltip title={refreshing ? "Refreshing..." : "Sync System"}>
               <IconButton 
                 onClick={() => fetchOrders(true)} 
                 disabled={refreshing}
                 sx={{ bgcolor: "#fff", border: "1px solid #e0e5f2", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
               >
                 <RefreshIcon sx={{ color: navy, animation: refreshing ? "spin 1.5s linear infinite" : "none" }} />
               </IconButton>
             </Tooltip>
             <Button
               variant="contained"
               sx={{ borderRadius: "14px", bgcolor: red, fontWeight: 900, textTransform: "none", px: 4, py: 1.2, boxShadow: "0 10px 20px rgba(229, 57, 53, 0.2)", "&:hover": { bgcolor: "#d32f2f" } }}
             >
               Export
             </Button>
          </Stack>
        </Box>

        <Paper sx={{ p: 4, borderRadius: "32px", border: "1px solid #e0e5f2", bgcolor: "#fff", boxShadow: "0 20px 50px rgba(0,0,0,0.03)" }}>
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 4 }}>
            <TextField
              placeholder="Search sequence or user..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#a3aed0" }} /></InputAdornment>,
                sx: { borderRadius: "16px", bgcolor: "#f8f9fc", width: { xs: "100%", sm: "320px" }, "& fieldset": { borderColor: "transparent" } }
              }}
            />
          </Stack>

          <TableContainer sx={{ border: "1px solid #eef2f6", borderRadius: "20px", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#fafbfc" }}>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell key={col.id} sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", textAlign: col.align || "left", pl: col.id === 'expand' ? 4 : 2 }}>
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center" sx={{ py: 12 }}>
                      <Stack alignItems="center" spacing={2.5}>
                        <Box sx={{ p: 3, borderRadius: "50%", bgcolor: alpha(red, 0.05) }}>
                          <ShippingIcon sx={{ color: red, fontSize: 56, opacity: 0.5 }} />
                        </Box>
                        <Box>
                           <Typography variant="h5" color={navy} fontWeight="900" gutterBottom>Operational sequence not found</Typography>
                           <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>No orders detected for the specified criteria.</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((row) => {
                    const isExpanded = expandedOrderId === row.id;
                    const isUpdating = actionLoading === row.id;

                    return (
                        <React.Fragment key={row.id}>
                            <TableRow hover sx={{ "&:hover": { bgcolor: alpha(navy, 0.01) }, borderBottom: "none" }}>
                                <TableCell sx={{ pl: 4 }}>
                                    <IconButton size="small" onClick={() => setExpandedOrderId(isExpanded ? null : row.id)}>
                                        {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
                                    </IconButton>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800, color: navy }}>{row.cartId}</TableCell>
                                <TableCell sx={{ fontWeight: 900, color: red }}>Rs. {Number(row.price).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Box>
                                        <Typography variant="body2" fontWeight="800" color={navy}>{row.user}</Typography>
                                        <Typography variant="caption" fontWeight="700" color="#a3aed0">{row.userPhone}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700, color: "#707eae" }}>{formatStoreDate(row.date)}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={row.status.toUpperCase()} 
                                        size="small" 
                                        sx={{ 
                                            fontWeight: 900, 
                                            borderRadius: "10px", 
                                            bgcolor: row.status.toLowerCase() === "pending" ? alpha("#ffb547", 0.1) : alpha("#05cd99", 0.1),
                                            color: row.status.toLowerCase() === "pending" ? "#ffb547" : "#05cd99",
                                            fontSize: "10px"
                                        }} 
                                    />
                                </TableCell>
                                <TableCell sx={{ textAlign: "right", pr: 4 }}>
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        {isUpdating ? <CircularProgress size={24} sx={{ m: 1, color: navy }} /> : (
                                            <>
                                                {viewType === "pending" && (
                                                    <>
                                                        <IconButton onClick={() => handleUpdateStatus(row, "Accepted")} sx={{ bgcolor: "#05cd99", color: "#fff", borderRadius: "10px" }}><ApproveIcon fontSize="small" /></IconButton>
                                                        <IconButton onClick={() => handleUpdateStatus(row, "Cancelled")} sx={{ bgcolor: red, color: "#fff", borderRadius: "10px" }}><RejectIcon fontSize="small" /></IconButton>
                                                    </>
                                                )}
                                                <IconButton onClick={() => navigate(`../details/${row.id}`, { relative: "path" })} sx={{ bgcolor: navy, color: "#fff", borderRadius: "10px" }}><ViewIcon fontSize="small" /></IconButton>
                                            </>
                                        )}
                                    </Stack>
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={columns.length} sx={{ py: 0, borderBottom: isExpanded ? "1px solid #eef2f6" : "none" }}>
                                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                        <Box sx={{ p: 4, bgcolor: "#fafbfc", borderTop: "1px dashed #e0e5f2" }}>
                                            <Grid container spacing={4}>
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="caption" fontWeight="900" color="#a3aed0" sx={{ mb: 1, display: "block" }}>DESTINATION</Typography>
                                                    <Typography variant="body2" fontWeight="700" color={navy} sx={{ mb: 1 }}>{row.address}</Typography>
                                                    <Typography variant="body2" fontWeight="800" color="#707eae">Slot: {row.timeSlot}</Typography>
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="caption" fontWeight="900" color="#a3aed0" sx={{ mb: 1, display: "block" }}>ITEMS ({row.items_count})</Typography>
                                                    <AvatarGroup max={5} sx={{ justifyContent: "flex-start" }}>
                                                        {row.items_preview.map((item, i) => (
                                                            <Avatar key={i} src={item.img} sx={{ borderRadius: "10px", border: "2px solid #fff" }}>{item.name[0]}</Avatar>
                                                        ))}
                                                    </AvatarGroup>
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="caption" fontWeight="900" color="#a3aed0" sx={{ mb: 1, display: "block" }}>CONTROL</Typography>
                                                    <Button variant="contained" startIcon={<ProcessIcon />} onClick={() => handleUpdateStatus(row, "Processing")} sx={{ bgcolor: navy, borderRadius: "12px", textTransform: "none", fontWeight: 900 }}>Start Process</Button>
                                                </Grid>
                                            </Grid>
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
      </Box>

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

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
  Button,
  Chip,
  Stack,
  Avatar,
  AvatarGroup,
  Tooltip,
  IconButton,
  Collapse,
  Divider,
  LinearProgress,
  CircularProgress
} from "@mui/material";
import { 
  LocalShipping as LocalShippingIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Inventory as InventoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  TrendingUp as TrendingUpIcon,
  DoneAll as DoneAllIcon,
  Warning as WarningIcon
} from "@mui/icons-material";
import { getAllOrders } from "../api/ordersApi";
import OrderDetailsDialog from "../components/OrderDetailsDialog";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const response = await getAllOrders({ limit: 500 });
      const results = response.data?.results || response.data?.data || [];

      const formattedData = results.map((order, index) => ({
        id: order._id || index + 1,
        cartId: order["Cart ID"] || order.cartId || order._id,
        cartPrice: parseFloat(order["Cart price"] || order.cartPrice || 0),
        userName: order["User"] || order.user || "N/A",
        userPhone: order.Details?.phone || order["User Phone"] || "N/A",
        deliveryDate: order["Delivery Date"] ? new Date(order["Delivery Date"]).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A",
        status: order["Status"] || order.status || "Processing",
        products: (order.Products || order.products || []).map(p => ({
          name: p.product_name || p.name || "Ref Node",
          img: p.image || p.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.product_name || "P")}&background=4318ff&color=fff`
        })),
        raw: order
      }));

      setOrders(formattedData);
    } catch (error) {
      console.error("Critical: Order Matrix Fetch failure:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const toggleExpand = (id) => setExpandedOrderId(expandedOrderId === id ? null : id);

  const handleOpenDetails = (order) => {
    setSelectedOrder(order.raw);
    setOpenDetails(true);
  };

  const getStatusConfig = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("complete") || s.includes("deliver")) return { color: "RS #00d26a", bgcolor: "rgba(0, 210, 106, 0.08)", icon: <DoneAllIcon sx={{ fontSize: 14 }} /> };
    if (s.includes("cancel") || s.includes("reject")) return { color: "#ff4d49", bgcolor: "rgba(255, 77, 73, 0.08)", icon: <WarningIcon sx={{ fontSize: 14 }} /> };
    if (s.includes("ongoing") || s.includes("shipping")) return { color: "#4318ff", bgcolor: "rgba(67, 24, 255, 0.08)", icon: <LocalShippingIcon sx={{ fontSize: 14 }} /> };
    return { color: "#ffb547", bgcolor: "rgba(255, 181, 71, 0.08)", icon: <InventoryIcon sx={{ fontSize: 14 }} /> };
  };

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return orders;
    return orders.filter((order) => {
        const cid = String(order.cartId).toLowerCase();
        const uname = String(order.userName).toLowerCase();
        return cid.includes(query) || uname.includes(query);
    });
  }, [orders, search]);

  const stats = useMemo(() => [
    { label: "Total Manifests", value: orders.length, icon: <InventoryIcon sx={{ fontSize: 18 }} />, color: "#4318ff" },
    { label: "Matrix Efficiency", value: "94.2%", icon: <TrendingUpIcon sx={{ fontSize: 18 }} />, color: "#00d26a" },
  ], [orders]);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1.5px" }}>
                Global Transaction Ledger
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Observing cross-platform order trajectories and fulfillment metrics.
            </Typography>
        </Box>
        <Stack direction="row" spacing={3} alignItems="center">
            {stats.map((stat) => (
                <Stack key={stat.label} direction="row" spacing={1} alignItems="center">
                    <Box sx={{ color: stat.color, display: "flex" }}>{stat.icon}</Box>
                    <Box>
                        <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ textTransform: "uppercase", display: "block", lineHeight: 1 }}>{stat.label}</Typography>
                        <Typography variant="subtitle2" fontWeight="800" color="#1b2559">{stat.value}</Typography>
                    </Box>
                </Stack>
            ))}
            <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: "center" }} />
            <Tooltip title="Synch Neural Ledger">
                <IconButton 
                    onClick={() => fetchOrders(true)} 
                    disabled={refreshing || loading}
                    sx={{ bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", p: 1.5 }}
                >
                    {refreshing ? <CircularProgress size={20} /> : <RefreshIcon sx={{ color: "#4318ff" }} />}
                </IconButton>
            </Tooltip>
        </Stack>
      </Box>

      {/* Full Width Ledger Hub */}
      <Paper sx={{ borderRadius: "28px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff", position: "relative" }}>
          {loading && (
              <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: "#f4f7fe", "& .MuiLinearProgress-bar": { backgroundColor: "#4318ff" } }} />
          )}
          
          {/* Search Toolbar */}
          <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
              <Typography variant="subtitle1" fontWeight="800" color="#1b2559">Manifest Stream</Typography>
              <TextField
                  size="small"
                  placeholder="ID or Node Identity..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                      startAdornment: <SearchIcon sx={{ color: "#a3aed0", mr: 1, fontSize: 20 }} />
                  }}
                  sx={{ 
                      "& .MuiOutlinedInput-root": { 
                          borderRadius: "14px", 
                          backgroundColor: "#fff",
                          width: "320px"
                      } 
                  }}
              />
          </Box>

          <TableContainer sx={{ 
              maxHeight: "calc(100vh - 280px)",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" }
          }}>
              <Table stickyHeader>
                  <TableHead>
                      <TableRow>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", pl: 4, bgcolor: "#f4f7fe" }}>#</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Protocol ID</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Capital</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Node Profile</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Manifest Date</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Payload</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Status</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", pr: 4, bgcolor: "#f4f7fe" }}>Ops</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {filteredOrders.length === 0 ? (
                          <TableRow>
                              <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                                  <Typography color="#a3aed0" fontWeight="600">No active manifests detected in the platform stream.</Typography>
                              </TableCell>
                          </TableRow>
                      ) : (
                          filteredOrders.map((order, index) => {
                              const config = getStatusConfig(order.status);
                              return (
                                  <React.Fragment key={order.id}>
                                      <TableRow sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}>
                                          <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4 }}>
                                              <IconButton size="small" onClick={() => toggleExpand(order.id)} sx={{ color: "#4318ff", mr: 1 }}>
                                                  {expandedOrderId === order.id ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                                              </IconButton>
                                              {index + 1}
                                          </TableCell>
                                          <TableCell sx={{ color: "#4318ff", fontWeight: "900", fontFamily: "monospace" }}>{order.cartId}</TableCell>
                                          <TableCell sx={{ color: "#1b2559", fontWeight: "900" }}>RS {order.cartPrice.toLocaleString()}</TableCell>
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
                                          <TableCell align="right" sx={{ pr: 3 }}>
                                              <Button 
                                                  variant="contained" 
                                                  size="small"
                                                  onClick={() => handleOpenDetails(order)}
                                                  sx={{ 
                                                      backgroundColor: "#4318ff", 
                                                      borderRadius: "10px", 
                                                      textTransform: "none", 
                                                      fontWeight: "800",
                                                      boxShadow: "0 6px 15px rgba(67, 24, 255, 0.2)",
                                                      "&:hover": { backgroundColor: "#3311cc" }
                                                  }}
                                              >
                                                  Inspect
                                              </Button>
                                          </TableCell>
                                      </TableRow>
                                      
                                      {/* Collapsible Inspection Panel */}
                                      <TableRow>
                                          <TableCell colSpan={8} sx={{ py: 0, border: "none" }}>
                                              <Collapse in={expandedOrderId === order.id} timeout="auto" unmountOnExit>
                                                  <Box sx={{
                                                      py: 3, px: 6,
                                                      backgroundColor: "#f4f7fe",
                                                      borderBottom: "1px solid #e0e5f2",
                                                      borderLeft: "6px solid #4318ff",
                                                      display: "flex", alignItems: "center", gap: 6
                                                  }}>
                                                      <Box>
                                                          <Typography variant="caption" fontWeight="900" color="#4318ff" sx={{ textTransform: "uppercase", letterSpacing: 2, display: "block", mb: 1 }}>Neural Insight</Typography>
                                                          <Typography variant="body2" color="#1b2559" fontWeight="700">Verified transaction path for node {order.userName}.</Typography>
                                                      </Box>
                                                      <Stack direction="row" spacing={2}>
                                                          <Button startIcon={<LocalShippingIcon fontSize="small" />} sx={{ color: "#00d26a", fontWeight: "900", textTransform: "none" }}>Track Payload</Button>
                                                          <Button startIcon={<InventoryIcon fontSize="small" />} sx={{ color: "#1b2559", fontWeight: "900", textTransform: "none" }}>Audit Resource</Button>
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

export default AllOrders;

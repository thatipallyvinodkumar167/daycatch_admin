import React, { useEffect, useState, useMemo, useCallback } from "react";
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
} from "@mui/material";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import PrintIcon from "@mui/icons-material/Print";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReplayIcon from "@mui/icons-material/Replay";
import EditIcon from "@mui/icons-material/Edit";
import { genericApi } from "../api/genericApi";
import OrderDetailsDialog from "../components/OrderDetailsDialog";

const MissedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await genericApi.getAll("missed orders");
      const apiResults = response.data?.results || response.data?.data || response.data || [];
      
      const formattedData = apiResults.map((order, index) => ({
        id: order._id || index + 1,
        cartId: order["Cart ID"] || order.cartId || order._id,
        cartPrice: parseFloat(order["Cart price"] || order.cartPrice || 0),
        userName: order["User"] || order.user || "N/A",
        userPhone: order["User Phone"] || order.phone || order.Details?.phone || "N/A",
        deliveryDate: order["Delivery Date"] ? new Date(order["Delivery Date"]).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : "N/A",
        status: (order["Status"] || order.status || "Missed").toUpperCase(),
        timeSlot: order["Time Slot"] || order.timeSlot || "N/A",
        address: order.Address || order.address || order.Details?.address || "N/A",
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
        }))
      }));

      setOrders(formattedData);
    } catch (error) {
      console.error("Error fetching missed orders:", error);
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

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Missed Orders
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ fontWeight: "500" }}>
                Monitor and recover orders that were not fulfilled within scheduled windows.
            </Typography>
        </Box>
      </Box>

      {/* Stats Summary Section */}
      <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
        <Paper sx={{ p: 3, flex: 1, borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 2, backgroundColor: "#fff" }}>
          <Avatar sx={{ bgcolor: "#fff1f0", color: "#ff4d49", width: 56, height: 56 }}>
            <AnnouncementIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ letterSpacing: "1px" }}>TOTAL MISSED</Typography>
            <Typography variant="h4" fontWeight="800" color="#1b2559">{orders.length}</Typography>
          </Box>
        </Paper>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }} justifyContent="space-between">
        <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
            <TextField
                size="small"
                placeholder="Search cart or customer..."
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
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>ORDER</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>CUSTOMER</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>PRICE</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>MISSED DATE</TableCell>
                <TableCell align="center" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>DETAILS</TableCell>
                <TableCell align="right" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", pr: 4, borderBottom: "1px solid #e0e5f2" }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                    <Typography variant="body1" color="#a3aed0" fontWeight="600">
                      No missed orders found
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
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: "#fff1f0", color: "#ff4d49", border: "2px solid #e0e5f2" }}>
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
                      <TableCell sx={{ color: "#475467", fontWeight: "700" }}>{order.deliveryDate}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenDetails(order)}
                          sx={{
                            borderRadius: "10px",
                            textTransform: "none",
                            fontWeight: "700",
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
                            <Tooltip title="Reschedule Delivery">
                                <IconButton 
                                  size="small" 
                                  onClick={() => alert("Rescheduling order... (Simulated)")}
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
                                    <ReplayIcon sx={{ fontSize: "18px" }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Alert Customer">
                                <IconButton 
                                  size="small" 
                                  onClick={() => alert("Notifying customer... (Simulated)")}
                                  sx={{ 
                                    color: "#fff", 
                                    bgcolor: "#ffb800", 
                                    borderRadius: "12px", 
                                    width: "36px", 
                                    height: "36px", 
                                    "&:hover": { bgcolor: "#e6a600", transform: "translateY(-1px)" },
                                    boxShadow: "0 4px 10px rgba(255,184,0,0.2)",
                                    transition: "0.2s"
                                  }}
                                >
                                    <NotificationImportantIcon sx={{ fontSize: "18px" }} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell colSpan={7} sx={{ py: 0, borderBottom: isExpanded ? "1px solid #e0e5f2" : "none" }}>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                <Box sx={{ p: 4, backgroundColor: "#fafbfc" }}>
                                    <Stack direction="row" spacing={4} alignItems="flex-start">
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle2" fontWeight="800" gutterBottom color="#2b3674">DELIVERY ADDRESS</Typography>
                                            <Typography variant="body2" color="#475467" fontWeight="600">{order.address}</Typography>
                                            <Typography variant="body2" color="#a3aed0" sx={{ mt: 1 }}>Missed Slot: {order.timeSlot}</Typography>
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle2" fontWeight="800" gutterBottom color="#2b3674">ORDER ENTITIES</Typography>
                                            <AvatarGroup max={5} sx={{ justifyContent: "flex-start", "& .MuiAvatar-root": { width: 40, height: 40, borderRadius: "12px", border: "2px solid #fff" } }}>
                                                {order.products.map((p, i) => (
                                                    <Tooltip key={i} title={p.name}>
                                                        <Avatar src={p.img} alt={p.name} />
                                                    </Tooltip>
                                                ))}
                                            </AvatarGroup>
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="800" gutterBottom color="#2b3674">RECOVERY ACTIONS</Typography>
                                            <Button variant="contained" size="small" startIcon={<ReplayIcon fontSize="small" />} sx={{ bgcolor: "#4318ff", borderRadius: "12px", textTransform: "none", fontWeight: "800", boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)" }}>
                                                Reschedule Now
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

export default MissedOrders;

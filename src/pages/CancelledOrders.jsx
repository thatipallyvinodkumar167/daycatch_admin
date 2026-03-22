import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { genericApi } from "../api/genericApi";
import OrderDetailsDialog from "../components/OrderDetailsDialog";

const CancelledOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await genericApi.getAll("cancelled orders");
      const results = response.data.results || response.data || [];
      
      const formattedData = results.map((order, index) => ({
        id: order._id || index + 1,
        cartId: order["Cart ID"] || order.cartId || order._id,
        cartPrice: parseFloat(order["Cart price"] || order.cartPrice || 0),
        userName: order["User"] || order.user || "N/A",
        userPhone: order["User Phone"] || order.phone || order.Details?.phone || "N/A",
        store: order["Store Name"] || order.store || "N/A",
        deliveryBoy: order["Boy Name"] || order.deliveryBoy || "N/A",
        deliveryDate: order["Delivery Date"] ? new Date(order["Delivery Date"]).toISOString().split('T')[0] : "N/A",
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
        }))
      }));

      setOrders(formattedData);
    } catch (error) {
      console.error("Error fetching cancelled orders:", error);
    }
  };

  const toggleExpand = (id) => setExpandedOrderId(expandedOrderId === id ? null : id);

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setOpenDetails(true);
  };

  const filteredOrders = orders.filter((order) => {
    const cid = (order.cartId || "").toString().toLowerCase();
    const uname = (order.userName || "").toString().toLowerCase();
    const s = search.toLowerCase().trim();
    return cid.includes(s) || uname.includes(s);
  });

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.{" "}
          <Box component="span" sx={{ fontSize: "16px", fontWeight: "400", color: "#a3aed0" }}>
            Viewing orders that were cancelled.
          </Box>
        </Typography>
      </Box>

      {/* Stats Summary Section */}
      <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
        <Paper sx={{ flex: 1, p: 3, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: "#fff1f0" }}>
                    <CancelIcon sx={{ color: "#ff4d49" }} />
                </Box>
                <Box>
                    <Typography variant="caption" color="textSecondary" fontWeight="600">CANCELLED HISTORY COUNT</Typography>
                    <Typography variant="h3" fontWeight="800" color="#1b2559">{orders.length}</Typography>
                </Box>
            </Stack>
        </Paper>
      </Stack>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6" fontWeight="700" color="#1b2559">Cancelled Orders List</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="#a3aed0" fontWeight="600">Search:</Typography>
            <TextField
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" }, width: "200px" }}
            />
            <Button variant="outlined" sx={{ borderRadius: "8px", textTransform: "none", color: "#475467", borderColor: "#e0e5f2", fontWeight: "600" }}>Print</Button>
            <Button variant="outlined" sx={{ borderRadius: "8px", textTransform: "none", color: "#475467", borderColor: "#e0e5f2", fontWeight: "600" }}>CSV</Button>
          </Stack>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell width={80} sx={{ fontWeight: "700", color: "#a3aed0" }}>#</TableCell>
                <TableCell width={140} sx={{ fontWeight: "700", color: "#a3aed0" }}>CART ID</TableCell>
                <TableCell width={120} sx={{ fontWeight: "700", color: "#a3aed0" }}>CART PRICE</TableCell>
                <TableCell width={200} sx={{ fontWeight: "700", color: "#a3aed0" }}>USER</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>REASON</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>CART PRODUCTS</TableCell>
                <TableCell align="center" sx={{ fontWeight: "700", color: "#a3aed0" }}>STATUS</TableCell>
                <TableCell align="center" sx={{ fontWeight: "700", color: "#a3aed0" }}>DETAILS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>No cancelled orders recorded.</TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order, index) => (
                  <React.Fragment key={order.id}>
                    <TableRow sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>
                        <IconButton size="small" onClick={() => toggleExpand(order.id)} sx={{ color: "#a3aed0" }}>
                          {expandedOrderId === order.id ? <RemoveCircleOutlineIcon fontSize="inherit" /> : <AddCircleOutlineIcon fontSize="inherit" />}
                        </IconButton>
                        <span style={{ marginLeft: "8px" }}>{index + 1}</span>
                      </TableCell>
                      <TableCell sx={{ color: "#ff4d49", fontWeight: "700" }}>{order.cartId || "N/A"}</TableCell>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "800" }}>₹{order.cartPrice.toLocaleString()}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="700" color="#1b2559">{order.userName}</Typography>
                          <Typography variant="caption" color="textSecondary">{order.userPhone}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: "#475467", fontWeight: "500", fontStyle: "italic" }}>{order.reason}</TableCell>
                      <TableCell>
                        <AvatarGroup max={3} sx={{ justifyContent: "flex-start", "& .MuiAvatar-root": { width: 34, height: 34, borderRadius: "8px" } }}>
                          {order.products.map((p, i) => (
                            <Tooltip key={i} title={p.name}>
                              <Avatar src={p.img} alt={p.name} />
                            </Tooltip>
                          ))}
                        </AvatarGroup>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={order.status || "Cancelled"}
                          size="small"
                          sx={{ backgroundColor: "#fff1f0", color: "#ff4d49", fontWeight: "800", fontSize: "10px", textTransform: "uppercase" }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button 
                          variant="contained" 
                          onClick={() => handleOpenDetails(order)}
                          sx={{ backgroundColor: "#4318ff", borderRadius: "8px", textTransform: "none", fontWeight: "700" }}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={8} sx={{ py: 0, border: "none" }}>
                        <Collapse in={expandedOrderId === order.id} timeout="auto" unmountOnExit>
                          <Box sx={{
                            py: 3, px: 4,
                            display: "flex", alignItems: "center", gap: 4,
                            backgroundColor: "#f4f7fe",
                            borderBottom: "1px solid #e0e5f2",
                            borderLeft: "6px solid #4318ff",
                          }}>
                            <Typography variant="caption" fontWeight="900" color="#ff4d49" sx={{ textTransform: "uppercase", letterSpacing: 2 }}>Audit History Queue</Typography>
                            <Stack direction="row" spacing={2}>
                              <Tooltip title="View Order Insights">
                                <Button
                                  variant="contained"
                                  startIcon={<VisibilityIcon sx={{ fontSize: "16px !important" }} />}
                                  onClick={() => handleOpenDetails(order)}
                                  sx={{ backgroundColor: "#1b2559", color: "#fff", borderRadius: "10px", px: 2, textTransform: "none", fontWeight: "700", boxShadow: "0 4px 12px rgba(27,37,89,0.2)", "&:hover": { backgroundColor: "#111a40" } }}
                                >
                                  Inspect Details
                                </Button>
                              </Tooltip>

                              <Tooltip title="Download Cancellation Receipt">
                                <Button
                                  variant="contained"
                                  startIcon={<FileDownloadIcon sx={{ fontSize: "16px !important" }} />}
                                  sx={{ backgroundColor: "#2d60ff", color: "#fff", borderRadius: "10px", px: 2, textTransform: "none", fontWeight: "700", boxShadow: "0 4px 12px rgba(45,96,255,0.2)", "&:hover": { backgroundColor: "#1e4de6" } }}
                                >
                                  Receipt
                                </Button>
                              </Tooltip>
                            </Stack>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
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
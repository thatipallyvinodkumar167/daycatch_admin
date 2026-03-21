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
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { genericApi } from "../api/genericApi";

const MissedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryBoy, setDeliveryBoy] = useState("");

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleOpenAssign = (order) => {
    setSelectedOrder(order);
    setOpenAssign(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenAssign(false);
    setSelectedOrder(null);
    setDeliveryBoy("");
  };

  const handleAssignSubmit = () => {
    // Logic to update assign
    console.log(`Assigning ${selectedOrder.cartId} to ${deliveryBoy}`);
    handleClose();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await genericApi.getAll("missed orders");
      const results = response.data.results || response.data || [];
      
      const formattedData = results.map((order, index) => ({
        id: order._id || index + 1,
        cartId: order["Cart ID"] || `ORD-MIS-${index}`,
        cartPrice: typeof order["Cart price"] === "number" ? `₹${order["Cart price"]}` : (order["Cart price"] || `₹0`),
        userName: order["User"] || order.user || "Unknown",
        userPhone: order["User Phone"] || order.phone || order.Details?.phone || "N/A",
        store: order["Store Name"] || order.store || "Unknown Store",
        deliveryDate: order["Delivery Date"] ? new Date(order["Delivery Date"]).toLocaleDateString() : "N/A",
        status: order["Status"] || "Missed",
        cartProducts: Array.isArray(order["Products"]) ? `${order["Products"].length} items` : "N/A",
        assign: order.Assign || order["Delivery Boy"] || order.assign || "Unassigned",
        orderStatus: order["Order Status"] || order["Status"] || "Missed",
      }));

      setOrders(formattedData);
    } catch (error) {
      console.error("Error fetching missed orders:", error);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.cartId.toLowerCase().includes(search.toLowerCase()) ||
    order.userName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Analyze orders that missed their delivery schedule.
        </Typography>
      </Box>

      {/* Stats Summary */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", borderLeft: "6px solid #475467" }}>
        <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: "#f0f4ff" }}>
                <FeedbackIcon sx={{ color: "#475467" }} />
            </Box>
            <Box>
                <Typography variant="caption" color="textSecondary" fontWeight="600">MISSED ORDERS</Typography>
                <Typography variant="h5" fontWeight="800" color="#1b2559">{orders.length}</Typography>
            </Box>
        </Stack>
      </Paper>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
          <Typography variant="h6" fontWeight="600" color="#1b2559">Missed Deliveries</Typography>
          <TextField
            size="small"
            placeholder="Search Order ID or User..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" }, width: "300px" }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>CART ID</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>STORE</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>TOTAL PRICE</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>USER</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>DELIVERY DATE</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>CART PRODUCT</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>ASSIGN</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>ORDER STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    No Missed Orders Found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order, index) => (
                    <TableRow key={order.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                      <TableCell sx={{ color: "#475467", fontWeight: "700" }}>{order.cartId}</TableCell>
                      <TableCell sx={{ color: "#475467", fontWeight: "600" }}>{order.store}</TableCell>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>{order.cartPrice}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="700" color="#1b2559">{order.userName}</Typography>
                        <Typography variant="caption" color="textSecondary">{order.userPhone}</Typography>
                      </TableCell>
                      <TableCell sx={{ color: "#475467", fontWeight: "600" }}>{order.deliveryDate}</TableCell>
                      <TableCell sx={{ color: "#ff4d49", fontWeight: "600" }}>{order.status}</TableCell>
                      <TableCell>
                        <IconButton 
                          onClick={() => handleOpenDetails(order)}
                          sx={{ 
                            backgroundColor: "#4318ff", 
                            color: "#fff", 
                            fontSize: "12px", 
                            borderRadius: "6px",
                            px: 2,
                            py: 0.5,
                            "&:hover": { backgroundColor: "#3a15dc" }
                          }}
                        >
                          Details
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          onClick={() => handleOpenAssign(order)}
                          sx={{ 
                            backgroundColor: "#4318ff", 
                            color: "#fff", 
                            fontSize: "12px", 
                            borderRadius: "6px",
                            px: 2,
                            py: 0.5,
                            "&:hover": { backgroundColor: "#3a15dc" }
                          }}
                        >
                          Assigned
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{ pr: 4 }}>
                        <IconButton 
                          sx={{ 
                            backgroundColor: "#4318ff", 
                            color: "#fff", 
                            fontSize: "12px", 
                            borderRadius: "6px",
                            px: 2,
                            py: 0.5,
                            "&:hover": { backgroundColor: "#3a15dc" }
                          }}
                        >
                          Cancel/Refund
                        </IconButton>
                      </TableCell>
                    </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Order Details Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth sx={{ "& .MuiDialog-paper": { borderRadius: "16px" } }}>
        <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "700", color: "#1b2559" }}>
          Order Details
          <IconButton onClick={handleClose} size="small" sx={{ color: "#a3aed0" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3 }}>
          {selectedOrder && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3, backgroundColor: "#f4f7fe", p: 2, borderRadius: "12px" }}>
                <Grid item xs={7}>
                  <Typography variant="body2" sx={{ mb: 0.5 }}><Box component="span" fontWeight="700">Order ID :</Box> {selectedOrder.cartId}</Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}><Box component="span" fontWeight="700">Customer name :</Box> {selectedOrder.userName}</Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}><Box component="span" fontWeight="700">Contact :</Box> {selectedOrder.userPhone}</Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}><Box component="span" fontWeight="700">Delivery Date :</Box> {selectedOrder.deliveryDate}</Typography>
                  <Typography variant="body2"><Box component="span" fontWeight="700">Time Slot :</Box> 06:00 am - 06:30 am</Typography>
                </Grid>
                <Grid item xs={5}>
                  <Typography variant="body2" fontWeight="700" textAlign="right">Delivery Address</Typography>
                  <Typography variant="caption" color="textSecondary" display="block" textAlign="right" sx={{ mt: 1 }}>
                    Home : 3-28,N/A, Bapu Museum, Vijayawada, Andhra Pradesh, 520001
                  </Typography>
                </Grid>
              </Grid>

              <Table size="small">
                <TableHead>
                  <TableRow sx={{ "& .MuiTableCell-root": { fontWeight: "700", color: "#a3aed0", borderBottom: "1px solid #f1f1f1" } }}>
                    <TableCell>Product Name</TableCell>
                    <TableCell align="center">Qty</TableCell>
                    <TableCell align="center">Tax</TableCell>
                    <TableCell align="center">Price</TableCell>
                    <TableCell align="right">Total Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[1, 2].map((item) => (
                    <TableRow key={item} sx={{ "& .MuiTableCell-root": { borderBottom: "1px solid #f1f1f1", py: 1.5 } }}>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box component="img" src="https://via.placeholder.com/30" sx={{ borderRadius: "4px" }} />
                          <Typography variant="body2" fontWeight="600" color="#1b2559">Pink Perch ({item === 1 ? "41/2 KG" : "11KG"})</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center" sx={{ color: "#1b2559" }}>2</TableCell>
                      <TableCell align="center" sx={{ color: "#1b2559" }}>2 % (GST)</TableCell>
                      <TableCell align="center" sx={{ color: "#1b2559" }}>{item === 1 ? "450" : "800"}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "700", color: "#1b2559" }}>{item === 1 ? "450" : "800"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Box sx={{ mt: 3, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                <Typography variant="body2" sx={{ display: "flex", gap: 4 }}>
                  <Box component="span" fontWeight="700" color="#1b2559">Products Price :</Box>
                  <Box component="span" fontWeight="700" color="#1b2559" sx={{ minWidth: "60px", textAlign: "right" }}>1250</Box>
                </Typography>
                <Typography variant="body2" sx={{ display: "flex", gap: 4 }}>
                  <Box component="span" fontWeight="700" color="#1b2559">Delivery Charge :</Box>
                  <Box component="span" fontWeight="700" color="#1b2559" sx={{ minWidth: "60px", textAlign: "right" }}>+0</Box>
                </Typography>
                <Divider sx={{ width: "200px", my: 1 }} />
                <Typography variant="body1" sx={{ display: "flex", gap: 4 }}>
                  <Box component="span" fontWeight="800" color="#1b2559">Net Total(Payable):</Box>
                  <Box component="span" fontWeight="800" color="#1b2559" sx={{ minWidth: "60px", textAlign: "right" }}>1250</Box>
                </Typography>
              </Box>

              <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                <IconButton onClick={handleClose} sx={{ backgroundColor: "#ff4d49", color: "#fff", borderRadius: "8px", px: 3, py: 1, fontSize: "14px", fontWeight: "700", "&:hover": { backgroundColor: "#e64440" } }}>
                  Close
                </IconButton>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={openAssign} onClose={handleClose} maxWidth="xs" fullWidth sx={{ "& .MuiDialog-paper": { borderRadius: "16px", p: 1 } }}>
        <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "700", color: "#1b2559", fontSize: "16px" }}>
          Assign ({selectedOrder?.cartId})
          <IconButton onClick={handleClose} size="small" sx={{ color: "#a3aed0" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3, textAlign: "center" }}>
          <TextField
              select
              fullWidth
              size="small"
              value={deliveryBoy}
              onChange={(e) => setDeliveryBoy(e.target.value)}
              SelectProps={{ native: true }}
              sx={{ mb: 4, "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          >
              <option value="">Select Delivery Boy</option>
              <option value="Boy 1">Delivery Boy 1</option>
              <option value="Boy 2">Delivery Boy 2</option>
              <option value="Boy 3">Delivery Boy 3</option>
          </TextField>

          <IconButton 
              onClick={handleAssignSubmit}
              sx={{ 
                  backgroundColor: "#4318ff", 
                  color: "#fff", 
                  borderRadius: "8px", 
                  px: 4, 
                  py: 1, 
                  fontSize: "14px", 
                  fontWeight: "700", 
                  "&:hover": { backgroundColor: "#3a15dc" } 
              }}
          >
              Submit
          </IconButton>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MissedOrders;
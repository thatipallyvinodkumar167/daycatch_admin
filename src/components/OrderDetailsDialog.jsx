import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Avatar,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from "@mui/icons-material/Print";

/**
 * OrderDetailsDialog - A premium, dynamic floating order view.
 * Displays comprehensive order information based on the passed 'order' object.
 */
const OrderDetailsDialog = ({ open, onClose, order }) => {
  if (!order) return null;

  // Derive values with fallbacks for dynamic robustness
  const products = order.products_expanded || [];
  const subtotal = order.cartPrice || products.reduce((sum, p) => sum + (p.total || 0), 0);
  const deliveryCharge = order.deliveryCharge || 0;
  const netTotal = subtotal + deliveryCharge;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth 
      sx={{ 
        "& .MuiDialog-paper": { borderRadius: "24px", boxShadow: "0 20px 50px rgba(0,0,0,0.15)", overflow: "hidden" } 
      }}
    >
      {/* Header Section */}
      <DialogTitle sx={{ m: 0, p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fafbfc" }}>
        <Box>
            <Typography variant="h5" fontWeight="900" color="#1b2559">Order Details</Typography>
            <Typography variant="caption" color="#a3aed0" fontWeight="700">Live overview for Order #{order.cartId}</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
            <IconButton onClick={() => window.print()} sx={{ color: "#4318ff", backgroundColor: "#f4f7fe", borderRadius: "10px" }}>
                <PrintIcon />
            </IconButton>
            <IconButton onClick={onClose} sx={{ color: "#ff4d49", backgroundColor: "#fff1f0", borderRadius: "10px" }}>
                <CloseIcon />
            </IconButton>
        </Stack>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ p: 0 }}>
        {/* Information Grid */}
        <Box sx={{ p: 4, backgroundColor: "#f4f7fe" }}>
            <Grid container spacing={4}>
                {/* Logistics Info Card */}
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 3, borderRadius: "20px", boxShadow: "0 4px 10px rgba(0,0,0,0.02)", border: "1px solid #e0e5f2" }}>
                        <Stack spacing={2}>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" color="#a3aed0" fontWeight="800">ORDER ID</Typography>
                                <Typography variant="body2" color="#4318ff" fontWeight="800">{order.cartId}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" color="#a3aed0" fontWeight="800">CUSTOMER NAME</Typography>
                                <Typography variant="body2" color="#1b2559" fontWeight="800">{order.userName}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" color="#a3aed0" fontWeight="800">CONTACT</Typography>
                                <Typography variant="body2" color="#1b2559" fontWeight="800">{order.userPhone}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" color="#a3aed0" fontWeight="800">DELIVERY DATE</Typography>
                                <Typography variant="body2" color="#1b2559" fontWeight="800">{order.deliveryDate}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" color="#a3aed0" fontWeight="800">TIME SLOT</Typography>
                                <Typography variant="body2" color="#1b2559" fontWeight="800">{order.timeSlot || "N/A"}</Typography>
                            </Box>
                            {order.reason && (
                                <Box sx={{ display: "flex", justifyContent: "space-between", pt: 1, borderTop: "1px dashed #e0e5f2" }}>
                                    <Typography variant="body2" color="#ff4d49" fontWeight="800">REASON</Typography>
                                    <Typography variant="body2" color="#ff4d49" fontWeight="800">{order.reason}</Typography>
                                </Box>
                            )}
                        </Stack>
                    </Paper>
                </Grid>
                
                {/* Address Info Card */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3, borderRadius: "20px", boxShadow: "0 4px 10px rgba(0,0,0,0.02)", border: "1px solid #e0e5f2", height: "100%" }}>
                        <Typography variant="body2" color="#a3aed0" fontWeight="800" sx={{ mb: 2 }}>DELIVERY ADDRESS</Typography>
                        <Box sx={{ p: 2, backgroundColor: "#fff", borderRadius: "14px", border: "1px dashed #e0e5f2" }}>
                            <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>Fulfillment Point</Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ lineHeight: 1.6, display: "block" }}>
                                {order.address || "No address provided for this order."}
                            </Typography>
                        </Box>
                        <Box sx={{ mt: 3 }}>
                            <Chip 
                              label={order.status} 
                              size="small"
                              sx={{ 
                                fontWeight: "800", 
                                textTransform: "uppercase", 
                                fontSize: "10px", 
                                borderRadius: "8px",
                                backgroundColor: (order.status || "").toLowerCase().includes("cancel") || (order.status || "").toLowerCase().includes("fail") ? "#fff1f0" : "#e6f9ed",
                                color: (order.status || "").toLowerCase().includes("cancel") || (order.status || "").toLowerCase().includes("fail") ? "#ff4d49" : "#24d164"
                              }} 
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>

        {/* Dynamic Items Table */}
        <Box sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="800" color="#1b2559" sx={{ mb: 3 }}>Order Line Items</Typography>
            <TableContainer component={Box} sx={{ border: "1px solid #f1f1f1", borderRadius: "15px", overflow: "hidden" }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                            <TableCell sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px" }}>PRODUCT</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px" }}>QTY</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px" }}>TAX</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px" }}>PRICE</TableCell>
                            <TableCell align="right" sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px", pr: 4 }}>TOTAL</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4, color: "#a3aed0" }}>No product data available</TableCell>
                            </TableRow>
                        ) : (
                            products.map((prod, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <Avatar src={prod.img} variant="rounded" sx={{ width: 40, height: 40, border: "1px solid #f1f1f1" }} />
                                            <Typography variant="body2" fontWeight="700" color="#1b2559">{prod.name}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "#1b2559", fontWeight: "700" }}>x{prod.qty}</TableCell>
                                    <TableCell align="center" sx={{ color: "#1b2559", fontWeight: "700" }}>{prod.tax || "0%"}</TableCell>
                                    <TableCell align="center" sx={{ color: "#1b2559", fontWeight: "700" }}>₹{prod.price}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: "900", color: "#1b2559", pr: 4 }}>₹{prod.total}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Financial Summary */}
            <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                <Paper sx={{ p: 4, borderRadius: "20px", backgroundColor: "#1b2559", color: "#fff", width: "350px", boxShadow: "0 10px 30px rgba(27,37,89,0.2)" }}>
                    <Stack spacing={2}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2" sx={{ opacity: 0.7 }}>Products Value :</Typography>
                            <Typography variant="body2" fontWeight="700">₹{subtotal.toLocaleString()}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2" sx={{ opacity: 0.7 }}>Delivery Fee :</Typography>
                            <Typography variant="body2" fontWeight="700">+{deliveryCharge ? `₹${deliveryCharge}` : "₹0"}</Typography>
                        </Box>
                        <Divider sx={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="h6" fontWeight="900">Amount Payable :</Typography>
                            <Typography variant="h6" fontWeight="900" color="#24d164">₹{netTotal.toLocaleString()}</Typography>
                        </Box>
                        <Typography variant="caption" sx={{ opacity: 0.6, textAlign: "center", fontStyle: "italic", mt: 1 }}>
                            Inclusive of platform fees and taxes.
                        </Typography>
                    </Stack>
                </Paper>
            </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;

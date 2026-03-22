import React, { useEffect, useState, useCallback } from "react";
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
  Avatar,
  Stack,
  Divider,
  Grid,
  Button,
  IconButton,
  Breadcrumbs,
  Link,
  Chip,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import StoreIcon from "@mui/icons-material/Store";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { getOrder } from "../api/ordersApi";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getOrder(id);
      const data = response.data.results || response.data || {};

      const formatted = {
        cartId: data["Cart ID"] || data.cartId || id,
        customerName: data["User"] || data.user || "Hari Babu Battula",
        contact: data.Details?.phone || data.phone || "9346014473, 9346014473",
        deliveryDate: data["Delivery Date"] || "2026-03-22",
        timeSlot: data["Time Slot"] || data.timeSlot || "06:30 am - 07:00 am",
        address: data.Address || data.address || data.Details?.address || `Flat No 108/2, Syndicate Bank Colony, KL Rao Park Road,\nChittinagar, Vijayawada,N/A,\nKL Rao Park,\nVijayawada,AP,\n520001`,
        productsPrice: data["Products Price"] || 200,
        deliveryCharge: data["Delivery Charge"] || 0,
        netTotal: data["Net Total"] || 200,
        status: data["Status"] || "Pending",
        products: (data.Products || data.products || [
          { name: "Sea white prawns(small)(101/2 KG)", qty: 1, tax: "4 % (GST)", price: 192, total: 200, img: "https://cdn-icons-png.flaticon.com/128/2224/2224115.png" }
        ]).map(p => ({
          name: p.product_name || p.name || "Product Name",
          qty: p.qty || p.quantity || 1,
          tax: p.tax || "0 %",
          price: p.price || 0,
          total: p.total || ((p.qty || 1) * (p.price || 0)),
          img: p.image || p.img || "https://cdn-icons-png.flaticon.com/128/2224/2224115.png"
        }))
      };

      setOrder(formatted);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrderDetails();
  }, [id, fetchOrderDetails]);

  if (loading) return <Box sx={{ p: 4 }}><Typography>Loading order details...</Typography></Box>;
  if (!order) return <Box sx={{ p: 4 }}><Typography>Order not found.</Typography></Box>;

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Breadcrumbs */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Link underline="hover" color="inherit" onClick={() => navigate("/")} sx={{ cursor: "pointer", fontWeight: "600", color: "#a3aed0" }}>
            Admin
          </Link>
          <Link underline="hover" color="inherit" onClick={() => navigate("/all-orders")} sx={{ cursor: "pointer", fontWeight: "600", color: "#a3aed0" }}>
            Orders Management
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: "700", color: "#2b3674" }}>Order Details</Typography>
        </Breadcrumbs>
      </Box>

      {/* Header Actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton onClick={() => navigate("/all-orders")} sx={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="800" color="#2b3674">Order Summary</Typography>
        </Stack>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          sx={{ backgroundColor: "#1b2559", borderRadius: "12px", textTransform: "none", fontWeight: "700", px: 4, py: 1.2, boxShadow: "0 4px 12px rgba(27,37,89,0.3)" }}
        >
          Print Invoice
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Left Section: Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
              <Typography variant="h6" fontWeight="800" color="#1b2559">Order Information</Typography>
              <Chip label={order.status} size="small" sx={{ backgroundColor: "#fff8e6", color: "#ffb800", fontWeight: "900", textTransform: "uppercase" }} />
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ textTransform: "uppercase" }}>Order ID</Typography>
                    <Typography variant="body1" fontWeight="700" color="#1b2559">{order.cartId}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ textTransform: "uppercase" }}>Customer Name</Typography>
                    <Typography variant="body1" fontWeight="700" color="#1b2559">{order.customerName}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ textTransform: "uppercase" }}>Contact</Typography>
                    <Typography variant="body1" fontWeight="700" color="#1b2559">{order.contact}</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ textTransform: "uppercase" }}>Delivery Date</Typography>
                    <Typography variant="body1" fontWeight="700" color="#1b2559">{order.deliveryDate}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ textTransform: "uppercase" }}>Time Slot</Typography>
                    <Typography variant="body1" fontWeight="700" color="#1b2559">{order.timeSlot}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ textTransform: "uppercase" }}>Payment Status</Typography>
                    <Typography variant="body1" fontWeight="700" color="#24d164">PAID</Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* Product Items Table */}
          <Paper sx={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <Box sx={{ p: 4, display: "flex", alignItems: "center", gap: 2, borderBottom: "1px solid #f1f1f1" }}>
              <StoreIcon sx={{ color: "#4318ff" }} />
              <Typography variant="h6" fontWeight="800" color="#1b2559">Itemized Breakdown</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                    <TableCell sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px", pl: 4 }}>PRODUCT NAME</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px" }}>QTY</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px" }}>TAX</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px" }}>PRICE</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px", pr: 4 }}>TOTAL PRICE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.products.map((item, index) => (
                    <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#f9f9fab" } }}>
                      <TableCell sx={{ pl: 4 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar src={item.img} variant="rounded" sx={{ width: 44, height: 44, border: "1px solid #f1f1f1" }} />
                          <Typography variant="body2" fontWeight="700" color="#1b2559">{item.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "600", color: "#475467" }}>{item.qty}</TableCell>
                      <TableCell align="center" sx={{ color: "#475467" }}>{item.tax}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "600", color: "#1b2559" }}>₹{item.price}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "800", color: "#4318ff", pr: 4 }}>₹{item.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Right Section: Address & Payment Detail */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", mb: 3 }}>
            <Typography variant="h6" fontWeight="800" color="#1b2559" sx={{ mb: 2 }}>Delivery Address</Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Box sx={{ mt: 0.5, p: 1, borderRadius: "10px", backgroundColor: "#f4f7fe" }}>
                <Typography variant="caption" fontWeight="900" color="#4318ff">HOME</Typography>
              </Box>
              <Typography variant="body2" color="#475467" sx={{ lineHeight: 1.8, fontWeight: "600", whiteSpace: "pre-line" }}>
                {order.address}
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 4, borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <Typography variant="h6" fontWeight="800" color="#1b2559" sx={{ mb: 2 }}>Order Summary</Typography>
            <Divider sx={{ mb: 3 }} />
            <Stack spacing={2.5}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" fontWeight="700" color="#a3aed0">Products Price</Typography>
                <Typography variant="body2" fontWeight="800" color="#1b2559">₹{order.productsPrice}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" fontWeight="700" color="#a3aed0">Delivery Charges</Typography>
                <Typography variant="body2" fontWeight="800" color="#24d164">+{order.deliveryCharge === 0 ? "FREE" : `₹${order.deliveryCharge}`}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", pt: 1 }}>
                <Box>
                  <Typography variant="h5" fontWeight="900" color="#1b2559">Net Total</Typography>
                  <Typography variant="caption" color="textSecondary">(Incl. all taxes)</Typography>
                </Box>
                <Typography variant="h4" fontWeight="900" color="#4318ff">₹{order.netTotal}</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetails;

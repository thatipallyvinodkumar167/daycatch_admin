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
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import StoreIcon from "@mui/icons-material/Store";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import PaymentIcon from "@mui/icons-material/Payment";
import HistoryIcon from "@mui/icons-material/History";
import { getOrder } from "../../api/ordersApi";
import { genericApi } from "../../api/genericApi";
import { getAllDeliveryBoys } from "../../api/deliveryBoyApi";

const COLLECTION_TO_ROUTE = {
  orders: "/all-orders",
  "pending orders": "/pending-orders",
  "cancelled orders": "/cancelled-orders",
  ongoingorders: "/ongoing-orders",
  "out for orders": "/out-of-delivery-orders",
  "payment failed orders": "/payment-failed-orders",
  "completed orders": "/completed-orders",
  "day wise orders": "/day-wise-orders",
  "missed orders": "/missed-orders",
  rejectedbystore: "/rejected-by-store",
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryParams = new URLSearchParams(location.search);
  const collection = queryParams.get("collection") || "orders";
  const backPath = COLLECTION_TO_ROUTE[collection] || "/all-orders";

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      let data = null;
      
      try {
        if (collection === "orders") {
          const response = await getOrder(id);
          data = response.data?.data || response.data?.results || response.data;
        } else {
          const response = await genericApi.getOne(collection, id);
          data = response.data?.data || response.data?.results || response.data;
        }
      } catch (err) {
        console.warn(`API fetch failed for order ID ${id} in collection ${collection}:`, err);
      }

      // If API fails or returns null, no fallback
      if (!data || Object.keys(data).length === 0) {
        setOrder(null);
        return;
      }

      const driverName =
        data.deliveryBoyName ||
        data["Boy Name"] ||
        data["Delivery Boy"] ||
        data.Assign ||
        data.deliveryBoy?.name ||
        "N/A";

      let driverPhone =
        data.deliveryBoy?.phone ||
        data["Boy Phone"] ||
        data["Delivery Boy Phone"] ||
        data.deliveryBoyPhone ||
        data.boyPhone ||
        data.AssignPhone ||
        data.Details?.driverPhone ||
        "N/A";

      if (driverName !== "N/A" && driverPhone === "N/A") {
        try {
          const deliveryBoyResponse = await getAllDeliveryBoys({ limit: 500 });
          const deliveryBoys =
            deliveryBoyResponse.data?.results ||
            deliveryBoyResponse.data?.data ||
            deliveryBoyResponse.data ||
            [];

          const normalizedDriverName = String(driverName).trim().toLowerCase();
          const matchedDriver = deliveryBoys.find((boy) => {
            const boyName = String(
              boy["Boy Name"] || boy.name || boy.deliveryBoyName || ""
            )
              .trim()
              .toLowerCase();

            return boyName === normalizedDriverName;
          });

          if (matchedDriver) {
            driverPhone =
              matchedDriver["Boy Phone"] ||
              matchedDriver.phone ||
              matchedDriver.boyMobile ||
              matchedDriver.mobile ||
              "N/A";
          }
        } catch (deliveryBoyError) {
          console.warn("Unable to resolve delivery boy phone:", deliveryBoyError);
        }
      }

      const formatted = {
        cartId: data.cartId || data["Cart ID"] || data._id || id,
        customerName: data.user || data.userName || data.User || data.customerName || data.name || "N/A",
        contact: data.phone || data.userPhone || data["User Phone"] || data.phone || data.Details?.phone || data.mobile || "N/A",
        email: data.email || data.userEmail || data.Details?.email || data.Details?.email || "N/A",
        deliveryDate: (data.deliveryDate || data["Delivery Date"]) ? new Date(data.deliveryDate || data["Delivery Date"]).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : "N/A",
        timeSlot: data.timeSlot || data["Time Slot"] || "N/A",
        address: data.address || data.Address || data.Details?.address || data.shippingAddress || data.location || "N/A",
        productsPrice: parseFloat(data.cartPrice || data["Cart price"] || data.totalPrice || data.amount || 0),
        deliveryCharge: parseFloat(data.deliveryCharge || data["Delivery Charge"] || 0),
        netTotal: parseFloat(data.cartPrice || data["Cart price"] || data.totalPrice || data.amount || 0) + parseFloat(data.deliveryCharge || data["Delivery Charge"] || 0),
        status: data["Status"] || data.status || "Processing",
        paymentMethod: data.paymentMethod || data.PaymentMethod || data.payment_method || "N/A",
        paymentStatus: data.paymentStatus || data.payment?.status || data.payment_status || "N/A",
        transactionId: data.transactionId || data.payment?.transactionId || data.txnId || "N/A",
        store: {
            name: data.storeName || data["Store Name"] || data.store?.name || data.store || "N/A",
            address: data.store?.address || data["Store Address"] || "N/A",
            phone: data.store?.phone || data.storePhone || data["Store Phone"] || "N/A"
        },
        deliveryBoy: {
            name: driverName,
            phone: driverPhone,
            photo: data.deliveryBoy?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(driverName !== "N/A" ? driverName : "D")}&background=4318ff&color=fff`
        },
        products: (data.products || data.Products || data["cart product"] || data["Cart Products"] || []).map(p => ({
          name: p.product_name || p.name || p.title || "Product Name",
          qty: p.qty || p.quantity || 1,
          tax: p.tax || "0 %",
          price: p.price || 0,
          total: p.total || ((p.qty || 1) * (p.price || 0)),
          img: p.image || p.img || p.product_image || ""
        }))
      };

      setOrder(formatted);
    } catch (error) {
      console.error("Error processing order details:", error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [collection, id]);

  useEffect(() => {
    fetchOrderDetails();
  }, [id, fetchOrderDetails]);

  if (loading) return <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Typography variant="h6">Loading order data...</Typography></Box>;
  
  if (!order) return (
    <Box sx={{ p: 4, textAlign: "center", mt: 10 }}>
        <Typography variant="h5" color="error" gutterBottom fontWeight="800">Order Not Found</Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>The requested Order ID "{id}" could not be located in our live records or history.</Typography>
        <Button variant="contained" onClick={() => navigate(backPath)} sx={{ bgcolor: "#1b2559", borderRadius: "10px" }}>Back to Orders</Button>
    </Box>
  );

  const activityItems = [
    order.status ? { label: "Current Status", value: order.status } : null,
    order.deliveryDate !== "N/A"
      ? { label: "Scheduled Delivery", value: `${order.deliveryDate}${order.timeSlot !== "N/A" ? ` | ${order.timeSlot}` : ""}` }
      : null,
    order.store.name !== "N/A" ? { label: "Assigned Store", value: order.store.name } : null,
    order.deliveryBoy.name !== "N/A" ? { label: "Delivery Partner", value: order.deliveryBoy.name } : null,
  ].filter(Boolean);

  const handleContactDriver = () => {
    if (!order?.deliveryBoy?.phone || order.deliveryBoy.phone === "N/A") {
      alert("Driver phone number is not available for this order.");
      return;
    }

    window.location.href = `tel:${order.deliveryBoy.phone}`;
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Breadcrumbs */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Link underline="hover" color="inherit" onClick={() => navigate("/")} sx={{ cursor: "pointer", fontWeight: "600", color: "#a3aed0" }}>
            Admin
          </Link>
          <Link underline="hover" color="inherit" onClick={() => navigate(backPath)} sx={{ cursor: "pointer", fontWeight: "600", color: "#a3aed0" }}>
            Orders Management
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: "700", color: "#2b3674" }}>Detailed Audit</Typography>
        </Breadcrumbs>
      </Box>

      {/* Header Actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton onClick={() => navigate(backPath)} sx={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1.5px" }}>Order Audit Report</Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">Verification Hash: {order.cartId}</Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2}>
            <Button
                variant="outlined"
                startIcon={<HistoryIcon />}
                sx={{ borderRadius: "12px", textTransform: "none", fontWeight: "700", borderColor: "#e0e5f2", color: "#1b2559" }}
            >
                View Activity Log
            </Button>
            <Button
                variant="contained"
                startIcon={<PrintIcon />}
                sx={{ backgroundColor: "#1b2559", borderRadius: "12px", textTransform: "none", fontWeight: "700", px: 4, py: 1.2, boxShadow: "0 4px 12px rgba(27,37,89,0.3)" }}
            >
                Print Invoice
            </Button>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        {/* Left Section: Details, Table, Timeline */}
        <Grid item xs={12} lg={8}>
          {/* Order Details Grid */}
          <Paper sx={{ p: 4, borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4, alignItems: "center" }}>
              <Typography variant="h6" fontWeight="900" color="#1b2559">Order Intelligence</Typography>
              <Chip 
                label={order.status} 
                sx={{ 
                    backgroundColor: "#e6f9ed", 
                    color: "#24d164", 
                    fontWeight: "900", 
                    px: 2, 
                    borderRadius: "10px",
                    border: "1px solid #b7eb8f" 
                }} 
              />
            </Box>
            
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <Stack spacing={2}>
                    <Box>
                        <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>Customer Profile</Typography>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
                            <Avatar sx={{ bgcolor: "#eef2ff", color: "#4318ff" }}><PersonIcon /></Avatar>
                            <Box>
                                <Typography variant="body1" fontWeight="800" color="#1b2559">{order.customerName}</Typography>
                                <Typography variant="caption" color="textSecondary" fontWeight="600">{order.email}</Typography>
                            </Box>
                        </Stack>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>Contact Verified</Typography>
                        <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mt: 0.5 }}>{order.contact}</Typography>
                    </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Stack spacing={2}>
                    <Box>
                        <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>Store Fulfillment</Typography>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
                            <Avatar sx={{ bgcolor: "#fff8e6", color: "#ffb800" }}><StoreIcon /></Avatar>
                            <Box>
                                <Typography variant="body1" fontWeight="800" color="#1b2559">{order.store.name}</Typography>
                                <Typography variant="caption" color="textSecondary" fontWeight="600">{order.store.phone}</Typography>
                            </Box>
                        </Stack>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>Logistics Window</Typography>
                        <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mt: 0.5 }}>{order.deliveryDate} | {order.timeSlot}</Typography>
                    </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Stack spacing={2}>
                    <Box>
                        <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>Payment Status</Typography>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
                            <Avatar sx={{ bgcolor: "#e6f4ff", color: "#1890ff" }}><PaymentIcon /></Avatar>
                            <Box>
                                <Typography variant="body1" fontWeight="800" color="#1b2559">{order.paymentMethod}</Typography>
                                <Typography variant="caption" color="#24d164" fontWeight="800">{order.paymentStatus}</Typography>
                            </Box>
                        </Stack>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>Transaction ID</Typography>
                        <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mt: 0.5 }}>{order.transactionId}</Typography>
                    </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* Product Items Table */}
          <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", mb: 4 }}>
            <Box sx={{ p: 4, borderBottom: "1px solid #f1f1f1", backgroundColor: "#fafbfc" }}>
              <Typography variant="h6" fontWeight="900" color="#1b2559">Itemized Ledger</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f4f7fe" }}>
                    <TableCell sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px", pl: 4 }}>PRODUCT DESC</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px" }}>QTY</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px" }}>TAX</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px" }}>PRICE</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px", pr: 4 }}>TOTAL</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.products.length > 0 ? order.products.map((item, index) => (
                    <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#f9fbff" } }}>
                      <TableCell sx={{ pl: 4 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          {item.img ? (
                              <Avatar src={item.img} variant="rounded" sx={{ width: 44, height: 44, border: "1px solid #f1f1f1", borderRadius: "10px" }} />
                          ) : (
                              <Avatar variant="rounded" sx={{ width: 44, height: 44, bgcolor: "#f4f7fe", color: "#1b2559", fontSize: "14px", fontWeight: "800" }}>{item.name.charAt(0)}</Avatar>
                          )}
                          <Typography variant="body2" fontWeight="800" color="#1b2559">{item.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "700", color: "#1b2559" }}>x{item.qty}</TableCell>
                      <TableCell align="center" sx={{ color: "#a3aed0", fontWeight: "700" }}>{item.tax}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "700", color: "#1b2559" }}>₹{item.price}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "900", color: "#4318ff", pr: 4 }}>₹{item.total}</TableCell>
                    </TableRow>
                  )) : (
                      <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 4 }}><Typography color="textSecondary">No product details found for this order.</Typography></TableCell>
                      </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Fulfillment Summary */}
          <Paper sx={{ p: 4, borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2" }}>
            <Typography variant="h6" fontWeight="900" color="#1b2559" sx={{ mb: 4 }}>Lifecycle Summary</Typography>
            {activityItems.length === 0 ? (
              <Typography variant="body2" color="#475467">
                Lifecycle events are not available for this order yet.
              </Typography>
            ) : (
              <Stack spacing={2.5}>
                {activityItems.map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                      borderRadius: "16px",
                      backgroundColor: "#fafbfc",
                      border: "1px solid #e0e5f2",
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="800" color="#1b2559">
                      {item.label}
                    </Typography>
                    <Typography variant="body2" color="#475467" fontWeight="700">
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Right Section: Totals, Store, Delivery Boy */}
        <Grid item xs={12} lg={4}>
          {/* Order Totals Card */}
          <Paper sx={{ p: 4, borderRadius: "24px", backgroundColor: "#1b2559", color: "#ffffff", boxShadow: "0 15px 40px rgba(27,37,89,0.25)", mb: 4 }}>
            <Typography variant="h6" fontWeight="900" sx={{ mb: 3 }}>Summary Ledger</Typography>
            <Stack spacing={3}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ opacity: 0.7, fontWeight: "600" }}>Items Total</Typography>
                <Typography variant="body1" fontWeight="800">₹{order.productsPrice}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ opacity: 0.7, fontWeight: "600" }}>Delivery Surcharge</Typography>
                <Typography variant="body1" fontWeight="800" color="#24d164">+{order.deliveryCharge === 0 ? "FREE" : `₹${order.deliveryCharge}`}</Typography>
              </Box>
              <Divider sx={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", pt: 1 }}>
                <Box>
                  <Typography variant="h5" fontWeight="900">Total Paid</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.5, fontWeight: "600" }}>(Incl. Taxes)</Typography>
                </Box>
                <Typography variant="h4" fontWeight="900" color="#24d164">₹{order.netTotal}</Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Delivery Boy Assignment Card */}
          <Paper sx={{ p: 4, borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", mb: 4 }}>
            <Typography variant="h6" fontWeight="900" color="#1b2559" sx={{ mb: 3 }}>Fulfillment Agent</Typography>
            <Divider sx={{ mb: 3 }} />
            <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={order.deliveryBoy.photo} sx={{ width: 64, height: 64, borderRadius: "16px", border: "3px solid #f4f7fe" }} />
                <Box>
                    <Typography variant="h6" fontWeight="900" color="#1b2559">{order.deliveryBoy.name}</Typography>
                    <Typography variant="body2" color="#a3aed0" fontWeight="700">{order.deliveryBoy.phone || "N/A"}</Typography>
                    <Typography variant="caption" color="#24d164" fontWeight="800" sx={{ mt: 1, display: "block" }}>{String(order.status || "N/A").toUpperCase()}</Typography>
                </Box>
            </Stack>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleContactDriver}
              disabled={!order.deliveryBoy.phone || order.deliveryBoy.phone === "N/A"}
              sx={{ mt: 3, borderRadius: "12px", textTransform: "none", fontWeight: "800", borderColor: "#f4f7fe" }}
            >
              {order.deliveryBoy.phone && order.deliveryBoy.phone !== "N/A" ? "Contact Driver" : "Driver Phone Unavailable"}
            </Button>
          </Paper>

          {/* Delivery Address Card */}
          <Paper sx={{ p: 4, borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2" }}>
            <Typography variant="h6" fontWeight="900" color="#1b2559" sx={{ mb: 2 }}>Destination</Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: "flex", gap: 2 }}>
                <IconButton sx={{ bgcolor: "#f4f7fe", color: "#4318ff", borderRadius: "12px" }}>
                    <LocalShippingIcon />
                </IconButton>
                <Box>
                    <Typography variant="subtitle2" fontWeight="800" color="#1b2559" gutterBottom>Shipping Address</Typography>
                    <Typography variant="body2" color="#475467" sx={{ lineHeight: 1.8, fontWeight: "600", whiteSpace: "pre-line" }}>
                        {order.address}
                    </Typography>
                </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetails;



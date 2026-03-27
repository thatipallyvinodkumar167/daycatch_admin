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
  Chip,
  alpha,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowBack as ArrowBackIcon,
  Print as PrintIcon,
  Store as StoreIcon,
  LocalShipping as ShippingIcon,
  Person as PersonIcon,
  History as HistoryIcon,
  Verified as VerifiedIcon,
  ContactPhone as PhoneIcon,
  Email as EmailIcon,
  Place as LocationIcon,
  CalendarToday as DateIcon,
  ReceiptLong as LedgerIcon,
} from "@mui/icons-material";
import { getOrder } from "../../api/ordersApi";
import { genericApi } from "../../api/genericApi";

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
const normalizeFlag = (value) => String(value || "").trim().toLowerCase();

const getToneByLabel = (value) => {
  const normalized = normalizeFlag(value);

  if (
    normalized.includes("failed") ||
    normalized.includes("cancel") ||
    normalized.includes("missed")
  ) {
    return {
      color: "#E53935",
      bg: alpha("#E53935", 0.1),
      border: "1px solid rgba(229,57,53,0.2)",
    };
  }

  if (normalized.includes("pending")) {
    return {
      color: "#ffb547",
      bg: alpha("#ffb547", 0.12),
      border: "1px solid rgba(255,181,71,0.2)",
    };
  }

  return {
    color: "#05cd99",
    bg: alpha("#05cd99", 0.1),
    border: "1px solid rgba(5,205,153,0.2)",
  };
};

const inferPaymentStatus = (data = {}, collection = "") => {
  const explicitStatus =
    data.paymentStatus ||
    data["Payment Status"] ||
    data.payment_state ||
    data.paymentState;

  if (explicitStatus) {
    return explicitStatus;
  }

  const statusCandidates = [
    data.status,
    data.Status,
    data["Order Status"],
    collection,
  ]
    .map(normalizeFlag)
    .filter(Boolean);

  if (statusCandidates.some((item) => item.includes("payment failed") || item === "failed" || item.includes("failed"))) {
    return "Failed";
  }

  if (statusCandidates.some((item) => item.includes("pending"))) {
    return "Pending";
  }

  return "Paid";
};

const normalizeOrderLineItems = (data = {}) => {
  const sourceItems =
    data.items ||
    data.products ||
    data.Products ||
    data["Cart Products"] ||
    data["cart product"] ||
    data.Details?.Products ||
    [];

  return (Array.isArray(sourceItems) ? sourceItems : []).map((item) => {
    if (typeof item === "string") {
      return {
        name: item,
        qty: 1,
        price: 0,
        total: 0,
        img: "",
      };
    }

    const qty = Number(item.qty || item.quantity || 1);
    const price = Number(item.price || item.amount || 0);

    return {
      name: item.product_name || item.name || "Product Name",
      qty,
      price,
      total: Number(item.total || qty * price),
      img: item.image || item.product_image || item.img || "",
    };
  });
};

const normalizeOrderDetails = (data, fallbackId, collection = "") => {
  const productsPrice = parseFloat(
    data.amount ||
      data.totalPrice ||
      data.cartPrice ||
      data["Cart price"] ||
      data["Total Price"] ||
      0
  );
  const deliveryCharge = parseFloat(data.deliveryCharge || data["Delivery Charge"] || 0);
  const products = normalizeOrderLineItems(data);

  return {
    cartId: data.cartId || data["Cart ID"] || data._id || fallbackId,
    customerName: data.user || data.userName || data.User || data.customerName || data.customer || data.name || "N/A",
    contact: data.phone || data.userPhone || data["User Phone"] || data.Details?.phone || data.mobile || "N/A",
    email: data.email || data.userEmail || data.Details?.email || "N/A",
    deliveryDate: (data.deliveryDate || data["Delivery Date"])
      ? new Date(data.deliveryDate || data["Delivery Date"]).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A",
    timeSlot: data.timeSlot || data["Time Slot"] || data.Details?.["Time Slot"] || "N/A",
    address: data.address || data.Address || data.Details?.address || data.shippingAddress || "N/A",
    productsPrice,
    deliveryCharge,
    netTotal: productsPrice + deliveryCharge,
    status: data.status || data.Status || data["Order Status"] || "Processing",
    paymentMethod: data.paymentMethod || data.payment || data.PaymentMethod || "COD",
    paymentStatus: inferPaymentStatus(data, collection),
    store: {
      name:
        data.storeName ||
        data["Store Name"] ||
        data.Store ||
        data.store?.name ||
        data.Details?.Store ||
        "Store",
    },
    deliveryBoy: {
      name:
        data.deliveryBoyName ||
        data["Boy Name"] ||
        data["Delivery Boy"] ||
        data.Assign ||
        "Not Assigned",
    },
    products,
  };
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryParams = new URLSearchParams(location.search);
  const collection = queryParams.get("collection") || location.state?.collection || "orders";
  const prefetchedOrder = location.state?.order || null;

  const navy = "#1b2559";
  const red = "#E53935";

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      let data = prefetchedOrder;
      
      try {
        if (collection === "orders") {
          const response = await getOrder(id);
          data = response.data?.data || response.data?.results || response.data;
        } else {
          const response = await genericApi.getOne(collection, id);
          data = response.data?.data || response.data?.results || response.data;
        }
      } catch (err) {
        console.warn(`API fetch failed for order ID ${id}:`, err);
      }

      if (!data || Object.keys(data).length === 0) {
        setOrder(null);
        return;
      }

      setOrder(normalizeOrderDetails(data, id, collection));
    } catch (error) {
      console.error("Error processing order details:", error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [collection, id, prefetchedOrder]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  if (loading) return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "80vh", gap: 3 }}>
      <CircularProgress size={60} thickness={4} sx={{ color: red }} />
      <Typography variant="body1" fontWeight="700" color="#a3aed0">Loading order details...</Typography>
    </Box>
  );
  
  if (!order) return (
    <Box sx={{ p: 4, textAlign: "center", mt: 10 }}>
        <Typography variant="h3" fontWeight="900" color={navy} sx={{ letterSpacing: "-1px", mb: 2 }}>Order Not Found</Typography>
        <Typography variant="h6" color="#a3aed0" sx={{ mb: 4, fontWeight: 700 }}>The requested Order sequence "{id}" could not be located.</Typography>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ bgcolor: navy, borderRadius: "14px", px: 4, py: 1.5 }}>Back to Fleet</Button>
    </Box>
  );

  const orderTone = getToneByLabel(order.status);
  const paymentTone = getToneByLabel(order.paymentStatus);

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Header Panel */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 5, flexWrap: "wrap", gap: 2 }}>
        <Stack direction="row" spacing={2.5} alignItems="center">
          <IconButton onClick={() => navigate(-1)} sx={{ backgroundColor: "#fff", borderRadius: "16px", boxShadow: "0 6px 18px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2" }}>
            <ArrowBackIcon sx={{ color: navy }} />
          </IconButton>
          <Box>
            <Typography variant="h3" fontWeight="900" color={navy} sx={{ letterSpacing: "-2px", mb: 0.5 }}>
               Order Details
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="700">Order ID: {order.cartId}</Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2}>
            <Tooltip title="Coming Soon">
                <Button variant="outlined" startIcon={<HistoryIcon />} sx={{ borderRadius: "14px", border: "1px solid #e0e5f2", color: navy, bgcolor: "#fff", fontWeight: 800 }}>
                   Order History
                </Button>
            </Tooltip>
            <Button 
                variant="contained" 
                startIcon={<PrintIcon />} 
                onClick={() => window.print()}
                sx={{ bgcolor: red, borderRadius: "14px", fontWeight: 900, px: 4, boxShadow: "0 10px 20px rgba(229,57,53,0.2)", "&:hover": { bgcolor: "#d32f2f" } }}
            >
                Print Order
            </Button>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          {/* Core Info Paper */}
          <Paper sx={{ p: 4, borderRadius: "32px", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", mb: 4, position: "relative", overflow: "hidden" }}>
            <Box sx={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, bgcolor: alpha(red, 0.03), borderRadius: "50%" }} />
            
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight="900" color={navy}>Order Overview</Typography>
                <Chip 
                  label={order.status.toUpperCase()} 
                  sx={{ bgcolor: orderTone.bg, color: orderTone.color, fontWeight: 900, borderRadius: "12px", border: orderTone.border }} 
                />
            </Stack>

            <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                    <Box>
                        <Typography variant="caption" fontWeight="900" color="#a3aed0" sx={{ textTransform: "uppercase", letterSpacing: 1, mb: 2, display: "block" }}>
                           Customer Identity
                        </Typography>
                        <Stack spacing={1.5}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ bgcolor: alpha(navy, 0.05), color: navy }}><PersonIcon fontSize="small" /></Avatar>
                                <Typography variant="subtitle1" fontWeight="800" color={navy}>{order.customerName}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ pl: 0.5 }}>
                                <PhoneIcon sx={{ fontSize: 16, color: "#a3aed0" }} />
                                <Typography variant="body2" fontWeight="700" color="#707eae">{order.contact}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ pl: 0.5 }}>
                                <EmailIcon sx={{ fontSize: 16, color: "#a3aed0" }} />
                                <Typography variant="body2" fontWeight="700" color="#707eae">{order.email}</Typography>
                            </Stack>
                        </Stack>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Box>
                        <Typography variant="caption" fontWeight="900" color="#a3aed0" sx={{ textTransform: "uppercase", letterSpacing: 1, mb: 2, display: "block" }}>
                           Store Details
                        </Typography>
                        <Stack spacing={1.5}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ bgcolor: alpha("#ffb547", 0.05), color: "#ffb547" }}><StoreIcon fontSize="small" /></Avatar>
                                <Typography variant="subtitle1" fontWeight="800" color={navy}>{order.store.name}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ pl: 0.5 }}>
                                <DateIcon sx={{ fontSize: 16, color: "#a3aed0" }} />
                                <Typography variant="body2" fontWeight="700" color="#707eae">{order.deliveryDate}</Typography>
                            </Stack>
                            <Chip label={order.timeSlot} size="small" sx={{ alignSelf: "flex-start", ml: 0.5, fontWeight: 800, bgcolor: "#f4f7fe", color: navy, fontSize: "10px" }} />
                        </Stack>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Box>
                        <Typography variant="caption" fontWeight="900" color="#a3aed0" sx={{ textTransform: "uppercase", letterSpacing: 1, mb: 2, display: "block" }}>
                           Payment Details
                        </Typography>
                        <Stack spacing={1.5}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ bgcolor: paymentTone.bg, color: paymentTone.color }}><VerifiedIcon fontSize="small" /></Avatar>
                                <Typography variant="subtitle1" fontWeight="800" color={navy}>{order.paymentMethod}</Typography>
                            </Stack>
                            <Typography variant="body2" fontWeight="800" color={paymentTone.color} sx={{ pl: 1 }}>{order.paymentStatus}</Typography>
                        </Stack>
                    </Box>
                </Grid>
            </Grid>
          </Paper>

          {/* Ledger Table */}
          <Paper sx={{ borderRadius: "32px", overflow: "hidden", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", mb: 4 }}>
            <Box sx={{ p: 3.5, bgcolor: "#fafbfc", borderBottom: "1px solid #f1f1f1" }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <LedgerIcon sx={{ color: navy }} />
                    <Typography variant="h6" fontWeight="900" color={navy}>Order Items</Typography>
                </Stack>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: "#f8f9fc" }}>
                            <TableCell sx={{ color: "#a3aed0", fontWeight: 900, fontSize: "10px", textTransform: "uppercase", pl: 4 }}>Product Desc</TableCell>
                            <TableCell align="center" sx={{ color: "#a3aed0", fontWeight: 900, fontSize: "10px", textTransform: "uppercase" }}>Quantity</TableCell>
                            <TableCell align="right" sx={{ color: "#a3aed0", fontWeight: 900, fontSize: "10px", textTransform: "uppercase" }}>Unit Price</TableCell>
                            <TableCell align="right" sx={{ color: "#a3aed0", fontWeight: 900, fontSize: "10px", textTransform: "uppercase", pr: 4 }}>Total price</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {order.products.map((item, i) => (
                            <TableRow key={i} hover sx={{ "&:hover": { bgcolor: alpha(navy, 0.01) } }}>
                                <TableCell sx={{ pl: 4 }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar src={item.img} sx={{ width: 48, height: 48, borderRadius: "14px", border: "2px solid #f4f7fe" }}>{item.name[0]}</Avatar>
                                        <Typography variant="body2" fontWeight="800" color={navy}>{item.name}</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 800, color: "#707eae" }}>x {item.qty}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 800, color: "#707eae" }}>Rs. {Number(item.price).toLocaleString()}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 900, color: navy, pr: 4 }}>Rs. {Number(item.total).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Stack spacing={4}>
            {/* Net Total Panel */}
            <Paper sx={{ p: 2.5, borderRadius: "26px", bgcolor: navy, color: "#fff", boxShadow: "0 20px 50px rgba(27,37,89,0.2)", position: "relative", overflow: "hidden" }}>
                <Box sx={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, bgcolor: alpha("#fff", 0.05), borderRadius: "50%" }} />
                <Stack spacing={1.75} sx={{ position: "relative", zIndex: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                            <Typography variant="caption" sx={{ opacity: 0.6, fontWeight: 900, letterSpacing: 1.2, display: "block", mb: 0.5 }}>
                                ORDER SUMMARY
                            </Typography>
                            <Typography variant="subtitle1" fontWeight="900">Amount Breakdown</Typography>
                        </Box>
                        <Chip
                          label={order.paymentStatus || "Paid"}
                          sx={{
                            bgcolor: paymentTone.bg,
                            color: paymentTone.color,
                            fontWeight: 900,
                            borderRadius: "12px",
                            height: 28,
                            border: paymentTone.border,
                          }}
                        />
                    </Stack>

                    <Stack spacing={1}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="body2" sx={{ opacity: 0.72, fontWeight: 700 }}>Items Total</Typography>
                            <Typography variant="body2" fontWeight="900">{formatCurrency(order.productsPrice)}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="body2" sx={{ opacity: 0.72, fontWeight: 700 }}>Delivery Charge</Typography>
                            {order.deliveryCharge === 0 ? (
                              <Chip
                                label="Free Delivery"
                                size="small"
                                sx={{
                                  bgcolor: alpha("#05cd99", 0.12),
                                  color: "#05cd99",
                                  fontWeight: 900,
                                  borderRadius: "10px",
                                  height: 24,
                                }}
                              />
                            ) : (
                              <Typography variant="body2" fontWeight="900" color="#05cd99">{formatCurrency(order.deliveryCharge)}</Typography>
                            )}
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="body2" sx={{ opacity: 0.72, fontWeight: 700 }}>Payment Method</Typography>
                            <Typography variant="body2" fontWeight="800">{order.paymentMethod}</Typography>
                        </Box>
                    </Stack>

                    <Divider sx={{ bgcolor: "rgba(255,255,255,0.12)" }} />

                    <Box
                      sx={{
                        p: 1.75,
                        borderRadius: "18px",
                        bgcolor: alpha("#fff", 0.06),
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                        <Typography variant="caption" sx={{ opacity: 0.6, fontWeight: 900, letterSpacing: 1.1 }}>
                            FINAL TOTAL
                        </Typography>
                        <Stack spacing={1.25} sx={{ mt: 0.75 }}>
                            <Typography
                              variant="h5"
                              fontWeight="900"
                              color="#05cd99"
                              sx={{ whiteSpace: "nowrap", lineHeight: 1.1 }}
                            >
                              {formatCurrency(order.netTotal)}
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={1}
                              useFlexGap
                              flexWrap="wrap"
                              alignItems="center"
                            >
                                <Box
                                  sx={{
                                    px: 1.2,
                                    py: 0.6,
                                    borderRadius: "999px",
                                    bgcolor: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                  }}
                                >
                                  <Typography variant="caption" sx={{ opacity: 0.75, fontWeight: 800 }}>
                                    Inclusive of tax
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    px: 1.2,
                                    py: 0.6,
                                    borderRadius: "999px",
                                    bgcolor: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                  }}
                                >
                                  <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 800 }}>
                                    {order.deliveryCharge === 0 ? "Free delivery" : "Delivery included"}
                                  </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Paper>

            {/* Destination Panel */}
            <Paper sx={{ p: 4, borderRadius: "32px", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}>
                <Stack spacing={3}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ p: 1.5, borderRadius: "14px", bgcolor: alpha(navy, 0.05), color: navy }}>
                            <LocationIcon />
                        </Box>
                        <Typography variant="h6" fontWeight="900" color={navy}>Delivery Address</Typography>
                    </Stack>
                    <Typography variant="body2" color="#707eae" fontWeight="700" sx={{ lineHeight: 1.7 }}>
                        {order.address}
                    </Typography>
                </Stack>
            </Paper>

            {/* Agent Allocation */}
            <Paper sx={{ p: 4, borderRadius: "32px", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}>
                <Typography variant="caption" fontWeight="900" color="#a3aed0" sx={{ textTransform: "uppercase", letterSpacing: 1, mb: 3, display: "block" }}>
                    Assigned Delivery Boy
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ width: 56, height: 56, borderRadius: "16px", bgcolor: alpha(red, 0.05), color: red }}>
                        <ShippingIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle1" fontWeight="800" color={navy}>{order.deliveryBoy.name}</Typography>
                        <Typography variant="body2" color="#a3aed0" fontWeight="700">Service Status: Active</Typography>
                    </Box>
                </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetails;

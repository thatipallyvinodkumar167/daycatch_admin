import React, { useState, useEffect } from "react";
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
  IconButton,
  Button,
  alpha,
  CircularProgress,
  Chip,
  Avatar,
  AvatarGroup,
  Tooltip
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Person as PersonIcon,
  Description as InvoiceIcon,
  AssignTurnedIn as AssignIcon
} from "@mui/icons-material";
import { useOutletContext, useLocation } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const StoreOrders = ({ viewType, title }) => {
  const { store } = useOutletContext();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Determine status from viewType or location
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Mocking behavior for different types
        // In reality: genericApi.getAll("orders", { storeId: store.id, status: viewType })
        setTimeout(() => {
           setOrders([]); // Defaulting to "No data found" as requested for specific views
           setLoading(false);
        }, 500);
      } catch (err) { console.error(err); setLoading(false); }
    };
    fetchOrders();
  }, [viewType, location.pathname]);

  const StatusChip = ({ status }) => {
    const s = String(status).toLowerCase();
    let config = { label: status, color: "#707eae", bg: alpha("#707eae", 0.1), icon: <PendingIcon sx={{ fontSize: 16 }} /> };
    
    if (s.includes("pending")) config = { label: "Pending", color: "#4318ff", bg: alpha("#4318ff", 0.08), icon: <PendingIcon sx={{ fontSize: 16 }} /> };
    if (s.includes("confirm")) config = { label: "Confirmed", color: "#01b574", bg: alpha("#01b574", 0.08), icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> };
    if (s.includes("delivery") || s.includes("out")) config = { label: "Out For Delivery", color: "#ffb547", bg: alpha("#ffb547", 0.1), icon: <ShippingIcon sx={{ fontSize: 16 }} /> };
    if (s.includes("cancel") || s.includes("fail")) config = { label: "Cancelled", color: "#ee5d50", bg: alpha("#ee5d50", 0.08), icon: <CancelIcon sx={{ fontSize: 16 }} /> };
    if (s.includes("complete")) config = { label: "Completed", color: "#05cd99", bg: alpha("#05cd99", 0.1), icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> };

    return (
      <Chip 
        label={config.label} 
        icon={config.icon}
        size="small" 
        sx={{ bgcolor: config.bg, color: config.color, fontWeight: 800, borderRadius: "10px", "& .MuiChip-icon": { color: "inherit" } }} 
      />
    );
  };

  const getTableColumns = () => {
     // Columns based on User Request
     const common = [
        { id: "id", label: "#", width: "50px" },
        { id: "cartId", label: "Cart ID" },
        { id: "price", label: "Cart price" },
        { id: "user", label: "User" },
        { id: "date", label: "Delivery Date" },
        { id: "status", label: "Status" },
     ];

     if (viewType === "cancelled") {
        return [...common, { id: "reason", label: "Cancelling Reason" }, { id: "actions", label: "Actions", align: "right" }];
     }
     if (viewType === "completed") {
        return [...common, { id: "products", label: "Cart Products" }, { id: "signature", label: "Signature" }];
     }
     if (viewType === "missed") {
        return [...common, { id: "assign", label: "Assign" }, { id: "orderStatus", label: "Order Status" }];
     }
     if (viewType === "today" || viewType === "next_day") {
        return [
           { id: "id", label: "#" },
           { id: "cartId", label: "Cart ID" },
           { id: "price", label: "Cart price" },
           { id: "user", label: "User" },
           { id: "date", label: "Delivery Date" },
           { id: "dboy", label: "Delivery Boy" },
           { id: "products", label: "Cart Products" },
           { id: "payment", label: "Payment" },
           { id: "confirmation", label: "Confirmation" },
           { id: "invoice", label: "Invoice", align: "right" }
        ];
     }

     return [...common, { id: "actions", label: "Details", align: "right" }];
  };

  const columns = getTableColumns();

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress sx={{ color: "#4318ff" }} /></Box>;

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} flexWrap="wrap" useFlexGap>
          <Box>
            <Typography variant="h3" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1.5px" }}>
              {title || "Orders Management"}
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
               Manage orders for {store.name} storefront.
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
             <Button
               variant="outlined"
               startIcon={<FilterIcon />}
               sx={{ borderRadius: "14px", fontWeight: 800, textTransform: "none", border: "1px solid #e0e5f2", color: "#1b2559" }}
             >
               Filter
             </Button>
             <Button
               variant="contained"
               sx={{ borderRadius: "14px", bgcolor: "#4318ff", fontWeight: 800, textTransform: "none", px: 3, boxShadow: "0 10px 20px rgba(67,24,255,0.2)" }}
             >
               Export Results
             </Button>
          </Stack>
        </Stack>

        <Paper sx={{ p: 4, borderRadius: "28px", border: "1px solid #e0e5f2", boxShadow: "0 18px 40px rgba(15,23,42,0.04)" }}>
          
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 4 }}>
            <TextField
              placeholder="Search by Cart ID or User..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#a3aed0" }} /></InputAdornment>,
                sx: { borderRadius: "14px", bgcolor: "#f8f9fc", width: { xs: "100%", sm: "320px" } }
              }}
            />
          </Stack>

          <TableContainer sx={{ border: "1px solid #eef2f6", borderRadius: "20px", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#fafbfc" }}>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell key={col.id} sx={{ fontWeight: 900, color: "#a3aed0", textAlign: col.align || "left" }}>
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center" sx={{ py: 12 }}>
                      <Stack alignItems="center" spacing={2.5}>
                        <Box sx={{ p: 3, borderRadius: "50%", bgcolor: alpha("#4318ff", 0.05) }}>
                          <ShippingIcon sx={{ color: "#4318ff", fontSize: 56, opacity: 0.5 }} />
                        </Box>
                        <Box>
                           <Typography variant="h5" color="#1b2559" fontWeight="900" gutterBottom>No data found</Typography>
                           <Typography variant="body2" color="#a3aed0" fontWeight="600">
                             There are currently no {title.toLowerCase()} list to display.
                           </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((row, index) => (
                    <TableRow key={row.cartId} hover>
                       {/* Table implementation for data rows */}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

        </Paper>

      </Box>
    </Box>
  );
};

export default StoreOrders;

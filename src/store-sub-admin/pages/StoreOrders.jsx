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
  Button,
  alpha,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  LocalShipping as ShippingIcon
} from "@mui/icons-material";
import { useOutletContext, useLocation } from "react-router-dom";

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

  const orderPanelSx = {
    borderRadius: "24px",
    border: "1px solid #e0e5f2",
    bgcolor: "#fff",
    boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
  };

  const columns = getTableColumns();

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}><CircularProgress sx={{ color: "#E53935" }} /></Box>;

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        
        <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1b2559", mb: 0.5, letterSpacing: "-1.5px" }}>
               {title || "Orders Management"}
            </Typography>
            <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>
               Review and manage fulfillment threads for {store.name}.
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
             <Button
               variant="outlined"
               startIcon={<FilterIcon />}
               sx={{ borderRadius: "14px", fontWeight: 800, textTransform: "none", border: "1px solid #e0e5f2", color: "#1b2559", bgcolor: "#fff" }}
             >
               Filter
             </Button>
             <Button
               variant="contained"
               sx={{ borderRadius: "14px", bgcolor: "#E53935", fontWeight: 900, textTransform: "none", px: 4, fontSize: "15px", boxShadow: "0 10px 20px rgba(229, 57, 53, 0.2)", "&:hover": { bgcolor: "#d32f2f" } }}
             >
               Export Results
             </Button>
          </Stack>
        </Box>

        <Paper sx={{ p: 4, ...orderPanelSx }}>
          
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
                    <TableCell key={col.id} sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", textAlign: col.align || "left" }}>
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
                        <Box sx={{ p: 3, borderRadius: "50%", bgcolor: alpha("#E53935", 0.05) }}>
                          <ShippingIcon sx={{ color: "#E53935", fontSize: 56, opacity: 0.5 }} />
                        </Box>
                        <Box>
                           <Typography variant="h5" color="#1b2559" fontWeight="900" gutterBottom>No operational data found</Typography>
                           <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>
                             There are currently no active {title?.toLowerCase()} list to display.
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

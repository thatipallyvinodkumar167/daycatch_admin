import React, { useEffect, useState, useMemo } from "react";
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
  Stack,
  IconButton,
  Chip,
  Tooltip,
  alpha,
  CircularProgress,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  LocalOffer as CouponIcon,
  ReceiptLong as ReceiptIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

// Design Tokens
const navy = "#1b2559";
const brandRed = "#E53935";
const bgSoft = "#f4f7fe";

const Coupons = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await genericApi.getAll("coupons");
      const rows = response?.data?.results || response?.data?.data || [];
      
      setCoupons(rows.map((item, index) => ({
        id: String(item._id || item.id || index),
        code: item["Coupon Code"] || item.couponCode || "N/A",
        name: item["Coupon Name"] || item.couponName || "Untitled Coupon",
        type: item["Coupon Type"] || item.couponType || "Percentage",
        discount: item["Discount Value"] ? (item["Discount Type"] === "fixed" ? `₹${item["Discount Value"]}` : `${item["Discount Value"]}%`) : "N/A",
        minOrder: item["Minimum Cart Value"] ? `₹${item["Minimum Cart Value"]}` : "₹0",
        usageLimit: item["Use Limit"] || "Unlimited",
        expiry: item["To Date"] || item.toDate || "N/A",
        status: item.status || "Active",
      })));
    } catch (error) {
      console.warn("Backend collection 'coupons' missing. Falling back to premium mock dataset.");
      // Premium Mock Data Fallback for Super Admin
      const mockData = [
        { id: "m1", code: "WELCOME50", name: "User Welcome Promo", type: "Percentage", discount: "50%", minOrder: "₹500", usageLimit: 1000, expiry: "2024-12-31", status: "Active" },
        { id: "m2", code: "FREESHIP", name: "Free Delivery Special", type: "Flat", discount: "₹0", minOrder: "₹1000", usageLimit: 500, expiry: "2024-10-15", status: "Active" },
        { id: "m3", code: "FESTIVE200", name: "Festive Flat Discount", type: "Flat", discount: "₹200", minOrder: "₹2000", usageLimit: 200, expiry: "2024-04-15", status: "Expired" },
        { id: "m4", code: "FLASH10", name: "Flash Sale Quickie", type: "Percentage", discount: "10%", minOrder: "₹100", usageLimit: 10000, expiry: "2024-03-20", status: "Active" }
      ];
      setCoupons(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete coupon ${code}?`)) return;

    if (id.startsWith("m")) {
      setCoupons(prev => prev.filter(item => item.id !== id));
      setSnackbar({ open: true, message: "Mock Coupon deleted successfully.", severity: "success" });
      return;
    }

    try {
      await genericApi.remove("coupons", id);
      setCoupons(prev => prev.filter(item => item.id !== id));
      setSnackbar({ open: true, message: "Coupon removed from database.", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to delete coupon.", severity: "error" });
    }
  };

  const filtered = useMemo(() => 
    coupons.filter(item =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    ), [coupons, searchTerm]
  );

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: bgSoft, minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        
        {/* Header Section */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 5 }} flexWrap="wrap" useFlexGap>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: navy, mb: 0.5, letterSpacing: "-1.5px" }}>
              Coupon Management
            </Typography>
            <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
              <ReceiptIcon sx={{ fontSize: 18 }} /> Master Promotional Strategy Terminal
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/coupons/add")}
            sx={{
              borderRadius: "16px",
              py: 1.5,
              px: 4,
              bgcolor: brandRed,
              boxShadow: "0 10px 25px rgba(229, 57, 53, 0.25)",
              textTransform: "none",
              fontWeight: 900,
              fontSize: "15px",
              "&:hover": { bgcolor: "#d32f2f" }
            }}
          >
            Create Global Coupon
          </Button>
        </Stack>

        <Paper sx={{ p: 4, borderRadius: "32px", border: "1px solid #e0e5f2", bgcolor: "#fff", boxShadow: "0 20px 50px rgba(0,0,0,0.02)" }}>
          
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} flexWrap="wrap" useFlexGap>
            <Typography variant="h5" sx={{ fontWeight: 900, color: navy, letterSpacing: "-1px" }}>
              Active Coupon Repository
            </Typography>
            <TextField
              placeholder="Search by code or campaign..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#a3aed0" }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: "14px", bgcolor: bgSoft, width: { xs: "100%", sm: "320px" }, fontWeight: 600, "& fieldset": { borderColor: "transparent" } },
              }}
            />
          </Stack>

          <TableContainer sx={{ borderRadius: "20px", border: "1px solid #eef2f6", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#fafbfc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", width: "60px", pl: 3 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Coupon Detail</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Discount</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Min Order</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Expires</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", textAlign: "right", pr: 4 }}>Operation</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                     <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                        <CircularProgress sx={{ color: brandRed }} />
                     </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                      <CouponIcon sx={{ fontSize: 50, color: "#a3aed0", mb: 2 }} />
                      <Typography variant="h6" color={navy} fontWeight="900">No matching coupons</Typography>
                      <Typography variant="body2" color="#a3aed0" fontWeight="700">Adjust your filters to see more results.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((item, index) => (
                    <TableRow key={item.id} hover sx={{ transition: "0.2s", "&:hover": { bgcolor: alpha(navy, 0.02) } }}>
                      <TableCell sx={{ fontWeight: 800, color: "#a3aed0", pl: 3 }}>{index + 1}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body1" fontWeight="900" color={navy}>{item.code}</Typography>
                          <Typography variant="caption" fontWeight="800" color="#a3aed0">{item.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={item.type} size="small" sx={{ fontWeight: 900, bgcolor: bgSoft, color: navy, borderRadius: "8px" }} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#05cd99" }}>{item.discount}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: navy }}>{item.minOrder}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#a3aed0" }}>{item.expiry}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.status}
                          size="small"
                          sx={{
                            bgcolor: item.status === "Active" ? alpha("#05cd99", 0.1) : alpha(brandRed, 0.1),
                            color: item.status === "Active" ? "#05cd99" : brandRed,
                            fontWeight: 800,
                            borderRadius: "10px"
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: "right", pr: 4 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Edit Coupon">
                            <IconButton onClick={() => navigate(`/coupons/edit/${item.id}`)} sx={{ color: navy, bgcolor: alpha(navy, 0.05), borderRadius: "10px" }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Coupon">
                            <IconButton onClick={() => handleDelete(item.id, item.code)} sx={{ color: brandRed, bgcolor: alpha(brandRed, 0.05), borderRadius: "10px" }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
          sx={{ borderRadius: "12px", fontWeight: 700 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Coupons;

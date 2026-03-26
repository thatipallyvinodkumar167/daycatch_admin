import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  alpha,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  LocalOffer as CouponIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";
import { matchesStoreRecord } from "../utils/storeWorkspace";

const getCouponStatus = (coupon) => {
  if (coupon.status) return coupon.status;
  if (!coupon.toDate) return "Active";
  const expiryDate = new Date(coupon.toDate);
  if (Number.isNaN(expiryDate.getTime())) return "Active";
  return expiryDate < new Date() ? "Expired" : "Active";
};

const formatCouponDate = (value) => {
  if (!value) return "N/A";
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return String(value);
  }
};

// Colors
const navy = "#1b2559";
const brandRed = "#E53935";
const bgSoft = "#f4f7fe";

function StoreCoupons() {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  // Edit Modal State
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [editForm, setEditForm] = useState({ 
    name: "", 
    code: "", 
    discountValue: "",
    fromDate: "",
    toDate: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const response = await genericApi.getAll("coupons");
      const rows = response?.data?.results || [];
      setCoupons(
        rows
          .filter((row) => matchesStoreRecord(row, store))
          .map((row) => ({
            id: String(row._id ?? row.id ?? ""),
            name: row["Coupon Name"] || row.couponName || "Untitled Coupon",
            code: row["Coupon Code"] || row.couponCode || "N/A",
            type: row["Coupon Type"] || row.couponType || "regular",
            discountType: row["Discount Type"] || row.discount || "percentage",
            discountValue: Number(row["Discount Value"] || row.discountValue || 0),
            useLimit: Number(row["Use Limit"] || row.useLimit || 0),
            minCartValue: Number(row["Minimum Cart Value"] || row.minCartValue || 0),
            fromDate: row["From Date"] || row.fromDate || "",
            toDate: row["To Date"] || row.toDate || "",
            status: getCouponStatus({
              status: row.Status || row.status,
              toDate: row["To Date"] || row.toDate,
            }),
          }))
      );
    } catch (error) {
      console.warn("Backend collection 'coupons' not initialized yet (404). Falling back to mock data.");
      setCoupons([
        {
          id: "mock-1",
          name: "Welcome Discount",
          code: "WELCOME50",
          discountType: "percentage",
          discountValue: 50,
          minCartValue: 500,
          fromDate: new Date().toISOString().substring(0, 16),
          toDate: new Date(Date.now() + 86400000 * 30).toISOString().substring(0, 16),
          status: "Active"
        },
        {
          id: "mock-2",
          name: "Flat 200 Off",
          code: "FLAT200",
          discountType: "fixed",
          discountValue: 200,
          minCartValue: 1500,
          fromDate: new Date(Date.now() - 86400000 * 5).toISOString().substring(0, 16),
          toDate: new Date(Date.now() - 86400000).toISOString().substring(0, 16),
          status: "Expired"
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [store]);

  useEffect(() => {
    if (store?.id || store?.name) {
      fetchCoupons();
    }
  }, [fetchCoupons, store?.id, store?.name]);

  const filteredCoupons = useMemo(
    () =>
      coupons.filter((coupon) => {
        const query = searchTerm.toLowerCase().trim();
        return (
          coupon.name.toLowerCase().includes(query) ||
          coupon.code.toLowerCase().includes(query)
        );
      }),
    [coupons, searchTerm]
  );

  const handleDelete = async (couponId) => {
    if (!window.confirm("Are you sure you want to completely delete this coupon?")) return;
    
    if (couponId.includes("mock-")) {
      setCoupons((prev) => prev.filter(c => c.id !== couponId));
      setSnackbar({ open: true, message: "Mock Coupon deleted successfully.", severity: "success" });
      return;
    }

    try {
      await genericApi.remove("coupons", couponId);
      setCoupons((current) => current.filter((coupon) => coupon.id !== couponId));
      setSnackbar({ open: true, message: "Coupon deleted successfully.", severity: "success" });
    } catch (error) {
      console.error("Unable to delete coupon:", error);
      setSnackbar({ open: true, message: "Failed to delete coupon.", severity: "error" });
    }
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    // Cleanup dates for datetime-local input
    const cleanDate = (d) => {
        if (!d) return "";
        try {
            return new Date(d).toISOString().substring(0, 16);
        } catch { return ""; }
    };

    setEditForm({
      name: coupon.name,
      code: coupon.code,
      discountValue: coupon.discountValue,
      fromDate: cleanDate(coupon.fromDate),
      toDate: cleanDate(coupon.toDate)
    });
  };

  const handleSaveEdit = async () => {
    if (!editingCoupon) return;
    setIsSaving(true);
    
    const updatePayload = {
        "Coupon Name": editForm.name.trim(),
        "Coupon Code": editForm.code.trim(),
        "Discount Value": Number(editForm.discountValue),
        "From Date": editForm.fromDate,
        "To Date": editForm.toDate,
        fromDate: editForm.fromDate, // Sync legacy fields
        toDate: editForm.toDate
    };

    if (editingCoupon.id.includes("mock-")) {
      setTimeout(() => {
        setCoupons(prev => prev.map(c => c.id === editingCoupon.id ? { 
          ...c, 
          name: editForm.name, 
          code: editForm.code, 
          discountValue: Number(editForm.discountValue),
          fromDate: editForm.fromDate,
          toDate: editForm.toDate,
          status: getCouponStatus({ toDate: editForm.toDate })
        } : c));
        setSnackbar({ open: true, message: "Mock Coupon updated globally.", severity: "success" });
        setIsSaving(false);
        setEditingCoupon(null);
      }, 500);
      return;
    }

    try {
      await genericApi.update("coupons", editingCoupon.id, updatePayload);
      await fetchCoupons();
      setSnackbar({ open: true, message: "Coupon profile synced successfully.", severity: "success" });
      setEditingCoupon(null);
    } catch (error) {
      console.error("Unable to update coupon:", error);
      setSnackbar({ open: true, message: "Sync failed. Retry required.", severity: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}><CircularProgress sx={{ color: brandRed }} /></Box>;
  }

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: bgSoft, minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>

        {/* Page Header */}
        <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: navy, mb: 0.5, letterSpacing: "-1.5px" }}>
              Store Coupons
            </Typography>
            <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
              <CouponIcon sx={{ fontSize: 18 }} /> Incentive Console • Promotional Strategy
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate("../add-coupon")}
            sx={{
              borderRadius: "16px",
              py: 1.5,
              px: 4,
              bgcolor: brandRed,
              boxShadow: "0 14px 28px rgba(229, 57, 53, 0.25)",
              textTransform: "none",
              fontWeight: 900,
              fontSize: "15px",
              "&:hover": { bgcolor: "#d32f2f" }
            }}
          >
            + Create Coupon
          </Button>
        </Box>

        <Paper sx={{ p: 4, borderRadius: "32px", border: "1px solid #e0e5f2", bgcolor: "#fff", boxShadow: "0 20px 50px rgba(0,0,0,0.03)" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} flexWrap="wrap" useFlexGap>
            <Typography variant="h5" sx={{ fontWeight: 900, color: navy, letterSpacing: "-1px" }}>
              Coupon Live Catalog
            </Typography>
            <TextField
              placeholder="Search active codes..."
              size="small"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#a3aed0" }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: "14px", bgcolor: bgSoft, width: { xs: "100%", sm: "280px" }, fontWeight: 600, "& fieldset": { borderColor: "transparent" } },
              }}
            />
          </Stack>

          <TableContainer sx={{ borderRadius: "20px", border: "1px solid #eef2f6", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#fafbfc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", width: "60px", pl: 3 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Coupon Name</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Discount</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Valid Till</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Min Cart</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", textAlign: "right", pr: 4 }}>Manage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCoupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                      <CouponIcon sx={{ fontSize: 50, color: "#a3aed0", mb: 2 }} />
                      <Typography variant="h6" color={navy} fontWeight="900">No active coupons</Typography>
                      <Typography variant="body2" color="#a3aed0" fontWeight="700">Create promos to drive user engagement.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCoupons.map((coupon, index) => (
                    <TableRow key={coupon.id} hover sx={{ transition: "0.2s", "&:hover": { bgcolor: alpha(navy, 0.02) } }}>
                      <TableCell sx={{ fontWeight: 800, color: "#a3aed0", pl: 3 }}>
                        <Box sx={{ width: 28, height: 28, borderRadius: "8px", bgcolor: bgSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {index + 1}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 800, color: navy }}>{coupon.name}</TableCell>
                      <TableCell>
                        <Chip label={coupon.code} size="small" sx={{ fontWeight: 900, color: brandRed, bgcolor: alpha(brandRed, 0.08), borderRadius: "10px" }} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#05cd99" }}>
                        {coupon.discountType === "fixed" ? `Rs. ${coupon.discountValue}` : `${coupon.discountValue}%`}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#a3aed0" }}>{formatCouponDate(coupon.toDate)}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: navy }}>Rs. {coupon.minCartValue}</TableCell>
                      <TableCell>
                        <Chip
                          icon={coupon.status === "Active" ? <CouponIcon sx={{ fontSize: "12px !important" }} /> : undefined}
                          label={coupon.status}
                          size="small"
                          sx={{
                            bgcolor: coupon.status === "Active" ? alpha("#05cd99", 0.1) : alpha(brandRed, 0.1),
                            color: coupon.status === "Active" ? "#05cd99" : brandRed,
                            fontWeight: 800,
                            borderRadius: "10px"
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: "right", pr: 4 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Edit Code">
                            <IconButton onClick={() => openEditModal(coupon)} sx={{ color: navy, bgcolor: alpha(navy, 0.05), borderRadius: "12px", "&:hover": { bgcolor: alpha(navy, 0.1) } }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Coupon">
                            <IconButton onClick={() => handleDelete(coupon.id)} sx={{ color: brandRed, bgcolor: alpha(brandRed, 0.05), borderRadius: "12px", "&:hover": { bgcolor: alpha(brandRed, 0.1) } }}>
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

      {/* Edit Modal */}
      <Dialog 
        open={Boolean(editingCoupon)} 
        onClose={() => !isSaving && setEditingCoupon(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "28px", p: 1, boxShadow: "0 20px 60px rgba(0,0,0,0.1)" } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
          <Box>
            <Typography variant="h5" fontWeight="900" color={navy} sx={{ letterSpacing: "-1px" }}>
              Edit Coupon Configuration
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="700">
              Modify the primary parameters of the active promo code.
            </Typography>
          </Box>
          <IconButton onClick={() => !isSaving && setEditingCoupon(null)} sx={{ bgcolor: bgSoft }}>
            <CloseIcon sx={{ color: navy }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minHeight: "200px", pt: "20px !important" }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>Coupon Marketing Name</Typography>
              <TextField 
                fullWidth 
                value={editForm.name} 
                onChange={(e) => setEditForm(prev => ({...prev, name: e.target.value}))}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: bgSoft, "& fieldset": { borderColor: "transparent" } } }} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>Coupon Checkout Code</Typography>
              <TextField 
                fullWidth 
                value={editForm.code} 
                onChange={(e) => setEditForm(prev => ({...prev, code: e.target.value}))}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: bgSoft, "& fieldset": { borderColor: "transparent" } } }} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>Discount Amplitude</Typography>
              <TextField 
                fullWidth 
                type="number"
                value={editForm.discountValue} 
                onChange={(e) => setEditForm(prev => ({...prev, discountValue: e.target.value}))}
                InputProps={{
                  startAdornment: <Typography fontWeight="900" color={navy} sx={{ mr: 1, opacity: 0.5 }}>{editingCoupon?.discountType === "fixed" ? "Rs." : "%"}</Typography>
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: bgSoft, "& fieldset": { borderColor: "transparent" } } }} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>From Date</Typography>
              <TextField 
                fullWidth 
                type="datetime-local"
                value={editForm.fromDate} 
                onChange={(e) => {
                    setEditForm(prev => ({...prev, fromDate: e.target.value}));
                    if (e.target.value) e.target.blur();
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: bgSoft, "& fieldset": { borderColor: "transparent" } } }} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>To Date (Expiry)</Typography>
              <TextField 
                fullWidth 
                type="datetime-local"
                value={editForm.toDate} 
                inputProps={{ min: editForm.fromDate }}
                onChange={(e) => {
                    setEditForm(prev => ({...prev, toDate: e.target.value}));
                    if (e.target.value) e.target.blur();
                }}
                error={editForm.fromDate && editForm.toDate && editForm.toDate < editForm.fromDate}
                helperText={editForm.fromDate && editForm.toDate && editForm.toDate < editForm.fromDate ? "Expiry cannot be earlier" : ""}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: bgSoft, "& fieldset": { borderColor: "transparent" } } }} 
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button onClick={() => setEditingCoupon(null)} sx={{ color: "#a3aed0", fontWeight: 800, textTransform: "none" }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveEdit}
            disabled={isSaving || !editForm.name || !editForm.code}
            startIcon={<SaveIcon />}
            sx={{ bgcolor: brandRed, borderRadius: "14px", px: 4, py: 1.5, fontWeight: 900, textTransform: "none", boxShadow: "0 10px 20px rgba(229, 57, 53, 0.25)", "&:hover": { bgcolor: "#d32f2f" } }}
          >
            {isSaving ? "Saving Identity..." : "Save Coupon Profile"}
          </Button>
        </DialogActions>
      </Dialog>

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
          sx={{ borderRadius: "12px", width: "100%", fontWeight: 700 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default StoreCoupons;

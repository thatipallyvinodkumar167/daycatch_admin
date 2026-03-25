import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  alpha,
  Box,
  Button,
  Chip,
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
  Alert,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  LocalOffer as CouponIcon,
} from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";
import { formatStoreDate, matchesStoreRecord } from "../utils/storeWorkspace";

const getCouponStatus = (coupon) => {
  if (coupon.status) return coupon.status;
  if (!coupon.toDate) return "Active";
  const expiryDate = new Date(coupon.toDate);
  if (Number.isNaN(expiryDate.getTime())) return "Active";
  return expiryDate < new Date() ? "Expired" : "Active";
};

function StoreCoupons() {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchCoupons = useCallback(async () => {
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
      console.error("Error fetching coupons:", error);
      setCoupons([]);
    }
  }, [store]);

  useEffect(() => {
    if (store?.id || store?.name) {
      fetchCoupons();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCoupons, store?.id, store?.name]);

  const orderPanelSx = {
    borderRadius: "24px",
    border: "1px solid #e0e5f2",
    bgcolor: "#fff",
    boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
  };

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
    try {
      await genericApi.remove("coupons", couponId);
      setCoupons((current) => current.filter((coupon) => coupon.id !== couponId));
      setSnackbar({ open: true, message: "Coupon deleted successfully.", severity: "success" });
    } catch (error) {
      console.error("Unable to delete coupon:", error);
      setSnackbar({ open: true, message: "Failed to delete coupon.", severity: "error" });
    }
  };

  const handleQuickEdit = async (coupon) => {
    const nextName = window.prompt("Coupon name", coupon.name);
    if (nextName === null) return;
    const nextCode = window.prompt("Coupon code", coupon.code);
    if (nextCode === null) return;
    try {
      await genericApi.update("coupons", coupon.id, {
        "Coupon Name": nextName.trim() || coupon.name,
        "Coupon Code": nextCode.trim() || coupon.code,
      });
      await fetchCoupons();
      setSnackbar({ open: true, message: "Coupon updated successfully.", severity: "success" });
    } catch (error) {
      console.error("Unable to update coupon:", error);
      setSnackbar({ open: true, message: "Failed to update coupon.", severity: "error" });
    }
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>

        {/* Page Header */}
        <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1b2559", mb: 0.5, letterSpacing: "-1.5px" }}>
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
              borderRadius: "14px",
              py: 1.5,
              px: 4,
              bgcolor: "#E53935",
              boxShadow: "0 10px 20px rgba(229, 57, 53, 0.2)",
              textTransform: "none",
              fontWeight: 900,
              fontSize: "15px",
              "&:hover": { bgcolor: "#d32f2f" }
            }}
          >
            + Create Coupon
          </Button>
        </Box>

        <Paper sx={{ p: 4, ...orderPanelSx }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} flexWrap="wrap" useFlexGap>
            <Typography variant="h5" sx={{ fontWeight: 900, color: "#1b2559", letterSpacing: "-1px" }}>
              Coupon List
            </Typography>
            <TextField
              placeholder="Search coupons..."
              size="small"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#a3aed0" }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "14px",
                  bgcolor: "#f8f9fc",
                  width: { xs: "100%", sm: "280px" },
                  fontWeight: 600,
                  "& fieldset": { borderColor: "rgba(224,229,242,0.8)" },
                },
              }}
            />
          </Stack>

          <TableContainer sx={{ borderRadius: "16px", border: "1px solid #eef2f6", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#fafbfc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", width: "60px" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Coupon Name</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Discount</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Valid Till</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Min Cart</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", textAlign: "right" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCoupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                      <Typography variant="h6" color="#a3aed0" fontWeight="800">
                        No coupons found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCoupons.map((coupon, index) => (
                    <TableRow key={coupon.id} hover sx={{ transition: "0.2s", "&:hover": { bgcolor: alpha("#1b2559", 0.02) } }}>
                      <TableCell sx={{ fontWeight: 800, color: "#a3aed0" }}>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559" }}>{coupon.name}</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#1b2559" }}>{coupon.code}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#05cd99" }}>
                        {coupon.discountType === "fixed" ? `Rs. ${coupon.discountValue}` : `${coupon.discountValue}%`}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#a3aed0" }}>{formatStoreDate(coupon.toDate)}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559" }}>Rs. {coupon.minCartValue}</TableCell>
                      <TableCell>
                        <Chip
                          label={coupon.status}
                          size="small"
                          sx={{
                            backgroundColor: coupon.status === "Active" ? alpha("#05cd99", 0.1) : alpha("#E53935", 0.1),
                            color: coupon.status === "Active" ? "#05cd99" : "#E53935",
                            fontWeight: 800,
                            borderRadius: "10px"
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Quick Edit">
                            <IconButton
                              className="action-edit"
                              size="small"
                              onClick={() => handleQuickEdit(coupon)}
                              sx={{ color: "#1b2559", bgcolor: alpha("#1b2559", 0.05), borderRadius: "10px" }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              className="action-delete"
                              size="small"
                              onClick={() => handleDelete(coupon.id)}
                              sx={{ color: "#E53935", bgcolor: alpha("#E53935", 0.05), borderRadius: "10px" }}
                            >
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
        autoHideDuration={3500}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
          sx={{ borderRadius: "12px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default StoreCoupons;
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  LocalFireDepartment as HotIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { storeWorkspaceApi } from "../../api/storeWorkspaceApi";

const toDateTimeLocal = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
};

const StoreAddDealProduct = () => {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();
  const editingDeal = location.state?.deal || null;
  const dealsRoute = `/stores/details/${store?.id}/catalog/deals`;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: editingDeal?.productId || "",
    dealPrice: editingDeal?.dealPrice || "",
    fromDate: toDateTimeLocal(editingDeal?.fromDate),
    toDate: toDateTimeLocal(editingDeal?.toDate),
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await storeWorkspaceApi.getCatalogProducts(store.id);
        const rows = response?.data?.data || [];
        setProducts(
          rows.map((product) => ({
            id: product.id,
            productCode: product.productCode || product.id,
            name: product.productName || "Unnamed Product",
          }))
        );
      } catch (error) {
        console.error("Unable to load store catalog products:", error);
        setSnackbar({ open: true, message: "Failed to load store products.", severity: "error" });
      } finally {
        setLoadingProducts(false);
      }
    };

    if (store?.id) {
      fetchProducts();
    }
  }, [store?.id]);

  const selectedProductLabel = useMemo(
    () => products.find((product) => product.id === formData.productId)?.name || "",
    [products, formData.productId]
  );

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.productId || !formData.dealPrice || !formData.fromDate || !formData.toDate) {
      setSnackbar({ open: true, message: "All fields are required.", severity: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      await storeWorkspaceApi.createDeal(store.id, {
        productId: formData.productId,
        dealPrice: Number(formData.dealPrice),
        fromDate: new Date(formData.fromDate).toISOString(),
        toDate: new Date(formData.toDate).toISOString(),
      });

      setSnackbar({
        open: true,
        message: editingDeal ? "Deal updated successfully!" : "Deal created successfully!",
        severity: "success",
      });
      setTimeout(() => navigate(dealsRoute), 1000);
    } catch (error) {
      console.error("Unable to save deal:", error);
      setSnackbar({ open: true, message: "Failed to save deal.", severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1000px", mx: "auto" }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <IconButton
            onClick={() => navigate(dealsRoute)}
            sx={{ bgcolor: "#fff", color: "#E53935", boxShadow: "0 6px 18px rgba(15,23,42,0.06)", "&:hover": { bgcolor: "#f4f7fe" } }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Box>
            <Typography variant="h3" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1.5px" }}>
              {editingDeal ? "Edit Deal Product" : "Add Deal Product"}
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
              {editingDeal ? `Update the active deal for ${selectedProductLabel || "this product"}.` : `Launch a new limited-time offer for ${store.name}.`}
            </Typography>
          </Box>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 4.5, borderRadius: "28px", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}>
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                      Select Product
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        name="productId"
                        value={formData.productId}
                        onChange={handleChange}
                        displayEmpty
                        disabled={loadingProducts || Boolean(editingDeal)}
                        sx={{ borderRadius: "16px", bgcolor: "#fafbfc" }}
                      >
                        <MenuItem value="" disabled>
                          {loadingProducts ? "Loading products..." : "Select Product"}
                        </MenuItem>
                        {products.map((product) => (
                          <MenuItem key={product.id} value={product.id}>
                            {product.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                      Deal Price (Rs.)
                    </Typography>
                    <TextField
                      fullWidth
                      name="dealPrice"
                      type="number"
                      placeholder="Enter the offer price"
                      value={formData.dealPrice}
                      onChange={handleChange}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }}
                    />
                  </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                          From Date
                        </Typography>
                        <TextField
                          fullWidth
                          name="fromDate"
                          type="datetime-local"
                          value={formData.fromDate}
                          onChange={(e) => {
                              setFormData({ ...formData, fromDate: e.target.value });
                              if (e.target.value) e.target.blur();
                          }}
                          InputLabelProps={{ shrink: true }}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                          To Date
                        </Typography>
                        <TextField
                          fullWidth
                          name="toDate"
                          type="datetime-local"
                          inputProps={{ min: formData.fromDate }}
                          value={formData.toDate}
                          onChange={(e) => {
                              setFormData({ ...formData, toDate: e.target.value });
                              if (e.target.value) e.target.blur();
                          }}
                          error={formData.fromDate && formData.toDate && formData.toDate < formData.fromDate}
                          helperText={formData.fromDate && formData.toDate && formData.toDate < formData.fromDate ? "Expiry cannot be earlier" : ""}
                          InputLabelProps={{ shrink: true }}
                          sx={{ 
                            "& .MuiOutlinedInput-root": { 
                                borderRadius: "16px", 
                                bgcolor: "#fafbfc",
                                "&.Mui-error": { borderColor: "#E53935" }
                            } 
                          }}
                        />
                      </Grid>
                    </Grid>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isSubmitting || loadingProducts}
                    startIcon={<HotIcon />}
                    sx={{
                      py: 2.2,
                      borderRadius: "20px",
                      bgcolor: "#E53935",
                      fontWeight: 900,
                      textTransform: "none",
                      fontSize: "17px",
                      boxShadow: "0 14px 28px rgba(229, 57, 53, 0.22)",
                      "&:hover": { bgcolor: "#d32f2f" },
                    }}
                  >
                    {isSubmitting ? "Saving Identity..." : editingDeal ? "Update Deal" : "Activate Deal Product"}
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 4, borderRadius: "32px", border: "1px solid #e0e5f2", bgcolor: alpha("#ee5d50", 0.02), height: "fit-content" }}>
                <Stack spacing={3} alignItems="center" textAlign="center">
                  <Box sx={{ p: 2, borderRadius: "50%", bgcolor: alpha("#ee5d50", 0.1) }}>
                    <HotIcon sx={{ color: "#ee5d50", fontSize: 40 }} />
                  </Box>
                  <Typography variant="h5" fontWeight="900" color="#1b2559">
                    Deal Strategy
                  </Typography>
                  <Typography variant="body2" color="#707eae" fontWeight="600">
                    Limited-time deals create urgency and drive higher conversion for store catalog products.
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Box sx={{ px: 2, py: 1, bgcolor: "#fff", borderRadius: "12px", border: "1px solid #eef2f6" }}>
                      <Typography variant="caption" color="#a3aed0" fontWeight="800">
                        Selected
                      </Typography>
                      <Typography variant="h6" color="#E53935" fontWeight="900">
                        {selectedProductLabel || "Product"}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </form>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: "12px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StoreAddDealProduct;

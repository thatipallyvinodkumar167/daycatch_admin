import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
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
  Typography,
  alpha,
} from "@mui/material";
import {
  Close as CloseIcon,
  Search as SearchIcon,
  Update as UpdateIcon,
} from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { storeWorkspaceApi } from "../../api/storeWorkspaceApi";

const normalizeCatalogRow = (product) => ({
  id: product.id,
  name: product.productName || "Unnamed Product",
  productCode: product.productCode || product.id,
  currentStock: Number(product.stock || 0),
  newStock: Number(product.stock || 0),
});

const StoreUpdateStock = () => {
  const { store } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [products, setProducts] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchCatalogProducts = async () => {
      try {
        const response = await storeWorkspaceApi.getCatalogProducts(store.id);
        const productRows = response?.data?.data || [];
        setProducts(productRows.map(normalizeCatalogRow));
      } catch (error) {
        console.error("Unable to load store stock:", error);
        setSnackbar({ open: true, message: "Failed to load store products.", severity: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (store?.id) {
      fetchCatalogProducts();
    }
  }, [store?.id]);

  const handleStockChange = (id, value) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === id ? { ...product, newStock: value === "" ? "" : Number(value) } : product
      )
    );
  };

  const handleReset = (id) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === id ? { ...product, newStock: product.currentStock } : product
      )
    );
  };

  const handleUpdate = async (product) => {
    const nextStock = Number(product.newStock);

    if (!Number.isFinite(nextStock) || nextStock < 0) {
      setSnackbar({ open: true, message: "Enter a valid stock value.", severity: "error" });
      return;
    }

    setSavingId(product.id);
    try {
      const response = await storeWorkspaceApi.updateCatalogStock(store.id, product.id, {
        stock: nextStock,
      });

      const updated = normalizeCatalogRow(response?.data?.data || {});
      setProducts((current) =>
        current.map((row) => (row.id === product.id ? updated : row))
      );
      setSnackbar({ open: true, message: "Stock updated successfully.", severity: "success" });
    } catch (error) {
      console.error("Unable to update stock:", error);
      setSnackbar({ open: true, message: "Failed to update stock.", severity: "error" });
    } finally {
      setSavingId("");
    }
  };

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(product.productCode).toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [products, searchTerm]
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: "#4318ff" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Box sx={{ maxWidth: "1420px", mx: "auto" }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h3" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1.5px" }}>
              Update Stock
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
              Batch update product inventory for {store.name}.
            </Typography>
          </Box>
        </Stack>

        <Paper sx={{ p: 4, borderRadius: "28px", border: "1px solid #e0e5f2", boxShadow: "0 18px 40px rgba(15,23,42,0.04)" }}>
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 4 }}>
            <TextField
              placeholder="Search products..."
              size="small"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#a3aed0" }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: "14px", bgcolor: "#f8f9fc", width: "320px" },
              }}
            />
          </Stack>

          <TableContainer sx={{ border: "1px solid #eef2f6", borderRadius: "20px", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#fafbfc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", width: "60px" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0" }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0" }}>Current Stock</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0" }}>Add Stock</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", textAlign: "right" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Typography variant="body1" color="#a3aed0" fontWeight="700">
                        No store products found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((row, index) => (
                    <TableRow key={row.id} hover sx={{ transition: "0.2s" }}>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559" }}>{index + 1}</TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight="900" color="#1b2559" sx={{ fontSize: "14px", lineHeight: 1.3, maxWidth: "250px" }}>
                          {row.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#707eae" }}>{row.productCode}</TableCell>
                      <TableCell>
                        <Typography variant="caption" fontWeight="800" color="#05cd99" sx={{ bgcolor: alpha("#05cd99", 0.05), px: 1.5, py: 0.5, borderRadius: "10px", width: "fit-content" }}>
                          {row.currentStock} in stock
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ width: "120px" }}>
                          <TextField
                            size="small"
                            type="number"
                            placeholder="0"
                            value={row.newStock}
                            onChange={(event) => handleStockChange(row.id, event.target.value)}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#f8f9fc" } }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleUpdate(row)}
                            disabled={savingId === row.id}
                            startIcon={savingId === row.id ? <CircularProgress size={16} color="inherit" /> : <UpdateIcon />}
                            sx={{ borderRadius: "14px", bgcolor: "#4318ff", fontWeight: 800, textTransform: "none", py: 1, px: 2, boxShadow: "0 6px 16px rgba(67,24,255,0.15)" }}
                          >
                            {savingId === row.id ? "Updating" : "Update"}
                          </Button>
                          <IconButton
                            size="small"
                            onClick={() => handleReset(row.id)}
                            sx={{ bgcolor: alpha("#ee5d50", 0.1), color: "#ee5d50", borderRadius: "12px", border: "1px solid rgba(238,93,80,0.2)" }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
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

export default StoreUpdateStock;

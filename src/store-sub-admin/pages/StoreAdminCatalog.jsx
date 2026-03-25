import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
  CheckCircle as CheckCircleIcon,
  Inventory2Outlined as InventoryIcon,
  Search as SearchIcon,
  Update as UpdateIcon,
} from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";
import { storeWorkspaceApi } from "../../api/storeWorkspaceApi";

const normalize = (value) => String(value || "").trim().toLowerCase();

const mapAdminProduct = (product) => ({
  id: String(product._id ?? product.id ?? ""),
  productCode: String(product["Product Id"] ?? ""),
  name: product["Product Name"] || "Unnamed Product",
  image: product["Product Image"] || "",
  category: product.Category || "",
  type: product.Type || "",
  price: Number(product.price || 0),
  mrp: Number(product.MRP || 0),
  stock: Number(product.Quantity || 0),
});

const mapStoreProduct = (product) => ({
  storeProductId: String(product.id ?? ""),
  adminProductId: String(product.adminProductId ?? ""),
  productCode: String(product.productCode ?? ""),
  name: product.productName || "Unnamed Product",
  image: product.image || "",
  category: product.category || "",
  type: product.type || "",
  price: Number(product.price || 0),
  mrp: Number(product.mrp || 0),
  stock: Number(product.stock || 0),
});

const productsMatch = (left, right) =>
  Boolean(
    (left.adminProductId && right.id && left.adminProductId === right.id) ||
      (left.productCode && right.productCode && normalize(left.productCode) === normalize(right.productCode))
  );

const StoreAdminCatalog = () => {
  const { store } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [persistedProducts, setPersistedProducts] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchData = async () => {
    try {
      const [adminResponse, storeResponse] = await Promise.all([
        genericApi.getAll("Adminproducts"),
        storeWorkspaceApi.getCatalogProducts(store.id),
      ]);

      const adminProducts = (adminResponse?.data?.results || []).map(mapAdminProduct);
      const storeProducts = (storeResponse?.data?.data || []).map(mapStoreProduct);

      setCatalogProducts(adminProducts);
      setSelectedProducts(storeProducts);
      setPersistedProducts(storeProducts);
    } catch (error) {
      console.error("Unable to load admin catalog:", error);
      setCatalogProducts([]);
      setSelectedProducts([]);
      setPersistedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (store?.id) {
      fetchData();
    }
  }, [store?.id]);

  const availableProducts = useMemo(
    () =>
      catalogProducts.filter((product) => {
        if (!product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }

        return !selectedProducts.some((selected) => productsMatch(selected, product));
      }),
    [catalogProducts, searchTerm, selectedProducts]
  );

  const handleAdd = (product) => {
    setSelectedProducts((current) => [
      ...current,
      {
        storeProductId: "",
        adminProductId: product.id,
        productCode: product.productCode,
        name: product.name,
        image: product.image,
        category: product.category,
        type: product.type,
        price: product.price,
        mrp: product.mrp,
        stock: product.stock,
      },
    ]);
  };

  const handleRemove = (product) => {
    setSelectedProducts((current) =>
      current.filter((row) =>
        row.storeProductId
          ? row.storeProductId !== product.storeProductId
          : !productsMatch(row, { id: product.adminProductId, productCode: product.productCode })
      )
    );
  };

  const handleConfirmSelection = async () => {
    setSaving(true);
    try {
      const removedProducts = persistedProducts.filter(
        (persisted) =>
          !selectedProducts.some(
            (current) =>
              (persisted.storeProductId && current.storeProductId === persisted.storeProductId) ||
              productsMatch(current, { id: persisted.adminProductId, productCode: persisted.productCode })
          )
      );

      const addedProducts = selectedProducts.filter(
        (current) =>
          !current.storeProductId &&
          !persistedProducts.some((persisted) =>
            productsMatch(persisted, { id: current.adminProductId, productCode: current.productCode })
          )
      );

      await Promise.all(
        removedProducts.map((product) =>
          genericApi.remove("storeProducts", product.storeProductId)
        )
      );

      await Promise.all(
        addedProducts.map((product) =>
          genericApi.create("storeProducts", {
            storeId: store.id,
            adminProductId: product.adminProductId,
            "Product Id": product.productCode,
            Image: product.image,
            "Product Name": product.name,
            Category: product.category,
            Type: product.type,
            Price: product.price,
            MRP: product.mrp,
            stock: product.stock,
            "Order Quantity": 1,
            Store: store.name,
            status: "Pending",
            submittedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        )
      );

      await fetchData();
      setSnackbar({ open: true, message: "Store catalog updated successfully.", severity: "success" });
    } catch (error) {
      console.error("Unable to update store catalog:", error);
      setSnackbar({ open: true, message: "Failed to update store catalog.", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: "#E53935" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1b2559", mb: 0.5, letterSpacing: "-1.5px" }}>
              Admin Catalog
            </Typography>
            <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>
              Select which global products {store.name} carries.
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, borderRadius: "24px", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", height: "100%" }}>
              <Typography variant="h5" fontWeight="900" color="#1b2559" sx={{ mb: 1 }}>Select Products</Typography>
              <Typography variant="body2" color="#707eae" fontWeight="600" sx={{ mb: 4 }}>Select the products you have available in stock.</Typography>

              <TextField
                fullWidth
                placeholder="Search products..."
                size="small"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#a3aed0" }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: "14px", bgcolor: "#f8f9fc" },
                }}
              />

              <List sx={{ maxHeight: "500px", overflowY: "auto", border: "1px solid #f0f4f8", borderRadius: "16px" }}>
                {availableProducts.length === 0 ? (
                  <ListItem>
                    <ListItemText primary="No global products found" sx={{ textAlign: "center", color: "#a3aed0" }} />
                  </ListItem>
                ) : (
                  availableProducts.map((product) => (
                    <ListItem
                      key={product.id}
                      secondaryAction={
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleAdd(product)}
                          sx={{ borderRadius: "10px", bgcolor: alpha("#E53935", 0.08), color: "#E53935", fontWeight: 800, textTransform: "none", boxShadow: "none", "&:hover": { bgcolor: "#E53935", color: "#fff" } }}
                        >
                          Add
                        </Button>
                      }
                      divider
                      sx={{ py: 1.5, "&:last-child": { borderBottom: "none" } }}
                    >
                      <ListItemIcon>
                        <InventoryIcon sx={{ color: "#a3aed0" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography variant="body1" fontWeight="800" color="#1b2559">{product.name}</Typography>}
                        secondary={<Typography variant="caption" fontWeight="600" color="#a3aed0">ID: {product.productCode || product.id}</Typography>}
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, borderRadius: "24px", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", height: "100%" }}>
              <Typography variant="h5" fontWeight="900" color="#1b2559" sx={{ mb: 1 }}>Selected Products</Typography>
              <Typography variant="body2" color="#707eae" fontWeight="600" sx={{ mb: 4 }}>Products currently assigned to your store.</Typography>

              <TableContainer sx={{ border: "1px solid #eef2f6", borderRadius: "20px", overflow: "hidden" }}>
                <Table>
                  <TableHead sx={{ bgcolor: "#fafbfc" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Product Name</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", textAlign: "right" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} align="center" sx={{ py: 6 }}>
                          <Typography variant="body1" color="#a3aed0" fontWeight="700">No products selected yet.</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      selectedProducts.map((row) => (
                        <TableRow key={row.storeProductId || `${row.adminProductId}-${row.productCode}`} hover>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                              <CheckCircleIcon sx={{ color: "#05cd99", fontSize: 18 }} />
                              <Typography variant="body1" fontWeight="800" color="#1b2559">{row.name}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ textAlign: "right" }}>
                            <Button
                              variant="text"
                              onClick={() => handleRemove(row)}
                              sx={{ color: "#ee5d50", fontWeight: 800, textTransform: "none" }}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Button
                fullWidth
                variant="contained"
                onClick={handleConfirmSelection}
                disabled={saving}
                startIcon={<UpdateIcon />}
                sx={{ mt: 4, py: 2, borderRadius: "18px", bgcolor: "#05cd99", fontWeight: 900, fontSize: "16px", boxShadow: "0 10px 25px rgba(5,205,153,0.25)", "&:hover": { bgcolor: "#04b486" } }}
              >
                {saving ? "Updating..." : "Confirm Selection"}
              </Button>
            </Paper>
          </Grid>
        </Grid>
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
};

export default StoreAdminCatalog;

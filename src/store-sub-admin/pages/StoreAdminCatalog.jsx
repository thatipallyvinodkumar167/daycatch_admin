import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
  Avatar,
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
  TextField,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Inventory2 as InventoryIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
  Storefront as StoreIcon,
  MonetizationOn as MoneyIcon,
} from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";
import { matchesStoreRecord } from "../utils/storeWorkspace";

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
  storeProductId: String(product.id || product._id || ""),
  adminProductId: String(product.adminProductId ?? ""),
  productCode: String(product.productCode ?? product["Product Id"] ?? ""),
  name: product.productName || product["Product Name"] || "Unnamed Product",
  image: product.image || product["Product Image"] || product.Image || "",
  category: product.category || product.Category || "",
  type: product.type || product.Type || "",
  price: Number(product.price || product.Price || 0),
  mrp: Number(product.mrp || product.MRP || 0),
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
  const [persistedProducts, setPersistedProducts] = useState([]);
  const [selectedToAdd, setSelectedToAdd] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Aesthetic Colors
  const navy = "#1b2559";
  const brandRed = "#E53935";
  const bgSoft = "#f4f7fe";

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [adminResponse, storeResponse] = await Promise.all([
        genericApi.getAll("admin_products"),
        genericApi.getAll("store_products"),
      ]);

      const adminProducts = (adminResponse?.data?.results || []).map(mapAdminProduct);
      const storeProducts = (storeResponse?.data?.results || [])
        .filter((product) => matchesStoreRecord(product, store))
        .map(mapStoreProduct);

      setCatalogProducts(adminProducts);
      setPersistedProducts(storeProducts);
    } catch (error) {
      console.error("Unable to load catalogs:", error);
    } finally {
      setLoading(false);
    }
  }, [store]);

  useEffect(() => {
    if (store?.id) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, store?.id]);

  const availableProducts = useMemo(
    () =>
      catalogProducts.filter(
        (product) => !persistedProducts.some((persisted) => productsMatch(persisted, product))
      ),
    [catalogProducts, persistedProducts]
  );

  const displayedStoreProducts = useMemo(() => {
    const query = normalize(searchTerm);
    if (!query) return persistedProducts;
    return persistedProducts.filter((p) =>
      [p.name, p.productCode, p.category].some((val) => normalize(val).includes(query))
    );
  }, [persistedProducts, searchTerm]);

  const handlePushProducts = async () => {
    if (!selectedToAdd.length) return;
    setSaving(true);
    try {
      await Promise.all(
        selectedToAdd.map((product) =>
          genericApi.create("store_products", {
            storeId: store.id,
            adminProductId: product.id,
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

      setSnackbar({ open: true, message: `Successfully added ${selectedToAdd.length} products to your store.`, severity: "success" });
      setSelectedToAdd([]);
      setIsAddModalOpen(false);
      await fetchData();
    } catch (error) {
      console.error("Unable to push products:", error);
      setSnackbar({ open: true, message: "Failed to add products.", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (product) => {
    if (!product.storeProductId) return;
    if (!window.confirm(`Are you sure you want to remove ${product.name} from your store?`)) return;

    try {
      await genericApi.remove("store_products", product.storeProductId);
      setSnackbar({ open: true, message: "Product removed from store.", severity: "success" });
      await fetchData();
    } catch (error) {
      console.error("Unable to remove product:", error);
      setSnackbar({ open: true, message: "Failed to remove product.", severity: "error" });
    }
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: bgSoft, minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        
        {/* Dynamic Page Header */}
        <Box sx={{ mb: 6, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 3 }}>
          <Box>
            <Typography variant="h3" fontWeight="900" color={navy} sx={{ letterSpacing: "-1.5px", mb: 0.5, display: "flex", alignItems: "center", gap: 1.5 }}>
              Catalog Operations <InventoryIcon sx={{ color: brandRed, fontSize: 36, mb: 0.5 }} />
            </Typography>
            <Typography variant="body1" color="#a3aed0" fontWeight="700">
              Manage the global products carried by {store?.name || "this store"}.
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search store inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#a3aed0" }} />
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: "14px", 
                  bgcolor: "#fff", 
                  width: { xs: "100%", sm: "280px" }, 
                  "& fieldset": { borderColor: "transparent" },
                  boxShadow: "0 4px 15px rgba(0,0,0,0.03)"
                }
              }}
            />
            <Button
              variant="contained"
              onClick={() => setIsAddModalOpen(true)}
              startIcon={<AddIcon />}
              sx={{
                borderRadius: "14px",
                py: 1.2,
                px: 3,
                bgcolor: brandRed,
                fontWeight: 900,
                fontSize: "15px",
                textTransform: "none",
                boxShadow: "0 10px 20px rgba(229, 57, 53, 0.25)",
                "&:hover": { bgcolor: "#d32f2f" }
              }}
            >
              Add Products
            </Button>
          </Stack>
        </Box>

        {/* Catalog Dashboard Stats */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[
            { title: "Store Inventory", value: persistedProducts.length, icon: <StoreIcon />, color: navy },
            { title: "Available Global", value: availableProducts.length, icon: <CategoryIcon />, color: brandRed },
            { title: "Avg. Price", value: persistedProducts.length ? `Rs. ${Math.round(persistedProducts.reduce((acc, p) => acc + p.price, 0) / persistedProducts.length)}` : "Rs. 0", icon: <MoneyIcon />, color: "#05cd99" },
          ].map((stat, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Paper sx={{ p: 3, borderRadius: "24px", display: "flex", alignItems: "center", gap: 2.5, border: "1px solid #e0e5f2", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
                <Box sx={{ p: 2, borderRadius: "16px", bgcolor: alpha(stat.color, 0.08), color: stat.color, display: "flex" }}>
                  {React.cloneElement(stat.icon, { sx: { fontSize: 32 } })}
                </Box>
                <Box>
                  <Typography variant="body2" color="#a3aed0" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" fontWeight="900" color={navy} sx={{ mt: 0.5, letterSpacing: "-1px" }}>
                    {stat.value}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Gallery / Cards Layout */}
        {loading && persistedProducts.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 15 }}>
            <CircularProgress sx={{ color: brandRed }} />
          </Box>
        ) : displayedStoreProducts.length === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 15, opacity: 0.7 }}>
            <InventoryIcon sx={{ fontSize: 80, color: "#a3aed0", mb: 2 }} />
            <Typography variant="h5" color={navy} fontWeight="900">No Catalog Products</Typography>
            <Typography variant="body1" color="#a3aed0" fontWeight="700">Your store database currently holds no products from the admin catalog.</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {displayedStoreProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.storeProductId || product.adminProductId}>
                <Paper
                  sx={{
                    borderRadius: "24px",
                    overflow: "hidden",
                    border: "1px solid #e0e5f2",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                    position: "relative",
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "translateY(-6px)", boxShadow: "0 20px 40px rgba(0,0,0,0.08)" },
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    bgcolor: "#fff"
                  }}
                >
                  {/* Delete / Remove Action */}
                  <Tooltip title="Remove Output from Store">
                    <IconButton
                      onClick={() => handleRemove(product)}
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        bgcolor: "rgba(255,255,255,0.9)",
                        color: brandRed,
                        zIndex: 2,
                        backdropFilter: "blur(4px)",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                        "&:hover": { bgcolor: "#fff", color: "#d32f2f" }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {/* Image Display */}
                  <Box sx={{ height: 200, bgcolor: bgSoft, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {product.image ? (
                      <Box component="img" src={product.image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <CategoryIcon sx={{ fontSize: 60, color: "#d1d9e6" }} />
                    )}
                  </Box>

                  {/* Card Details */}
                  <Box sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box>
                      <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                        <Chip label={product.category} size="small" sx={{ bgcolor: alpha(navy, 0.05), color: navy, fontWeight: 800, fontSize: "10px", height: 22 }} />
                        <Chip label={`SKU: ${product.productCode}`} size="small" sx={{ bgcolor: alpha("#a3aed0", 0.1), color: "#a3aed0", fontWeight: 800, fontSize: "10px", height: 22 }} />
                      </Stack>
                      <Typography variant="h6" fontWeight="900" color={navy} sx={{ lineHeight: 1.2, mb: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {product.name}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h5" fontWeight="900" color={brandRed}>
                          Rs. {product.price}
                        </Typography>
                        {product.mrp > product.price && (
                          <Typography variant="body2" fontWeight="700" color="#a3aed0" sx={{ textDecoration: "line-through", pb: 0.2 }}>
                            Rs. {product.mrp}
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Add Products Modal */}
      <Dialog 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "24px", p: 2, boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }
        }}
      >
        <DialogTitle sx={{ pb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h5" fontWeight="900" color={navy} sx={{ letterSpacing: "-1px" }}>
              Available Global Products
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="700" sx={{ mt: 0.5 }}>
              Select products from the admin-approved catalog to carry in your store.
            </Typography>
          </Box>
          <IconButton onClick={() => setIsAddModalOpen(false)} sx={{ bgcolor: bgSoft }}>
            <CloseIcon sx={{ color: navy }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ minHeight: "340px", pb: 4 }}>
          <Box sx={{ py: 2 }}>
            <Autocomplete
              multiple
              options={availableProducts}
              value={selectedToAdd}
              onChange={(_, value) => setSelectedToAdd(value)}
              getOptionLabel={(option) => `${option.name} (SKU: ${option.productCode})`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={availableProducts.length ? "Search global catalog..." : "No available global products"}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "16px",
                      backgroundColor: bgSoft,
                      py: 1.5,
                      "& fieldset": { borderColor: "transparent" },
                      "&:hover fieldset": { borderColor: alpha(navy, 0.2) },
                      "&.Mui-focused fieldset": { borderColor: navy }
                    }
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.id} sx={{ '&:hover': { bgcolor: alpha(brandRed, 0.04) }, borderRadius: "12px", mx: 1 }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 1 }}>
                    <Avatar src={option.image} variant="rounded" sx={{ width: 50, height: 50, borderRadius: "12px" }} />
                    <Box>
                      <Typography variant="body1" fontWeight="800" color={navy}>
                        {option.name}
                      </Typography>
                      <Typography variant="caption" color="#a3aed0" fontWeight="700" sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <CategoryIcon sx={{ fontSize: 13 }} /> {option.category} • Rs. {option.price}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              )}
            />

            <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selectedToAdd.map((item) => (
                <Chip
                  key={item.id}
                  label={item.name}
                  onDelete={() => setSelectedToAdd(prev => prev.filter(p => p.id !== item.id))}
                  sx={{ bgcolor: alpha(brandRed, 0.08), color: brandRed, fontWeight: "800", borderRadius: "10px", "& .MuiChip-deleteIcon": { color: alpha(brandRed, 0.6), "&:hover": { color: brandRed } } }}
                />
              ))}
              {selectedToAdd.length === 0 && (
                <Typography variant="body2" color="#a3aed0" fontWeight="600" sx={{ mt: 1 }}>No products selected to add yet.</Typography>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setIsAddModalOpen(false)} 
            sx={{ color: "#a3aed0", fontWeight: 800, textTransform: "none", mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePushProducts}
            disabled={saving || !selectedToAdd.length}
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
            sx={{
              backgroundColor: brandRed,
              "&:hover": { backgroundColor: "#d32f2f" },
              borderRadius: "14px",
              py: 1.5,
              px: 4,
              textTransform: "none",
              fontWeight: "900",
              boxShadow: "0 10px 20px rgba(229, 57, 53, 0.25)"
            }}
          >
            {saving ? "Adding..." : `Add ${selectedToAdd.length} Global Products to Store`}
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
          sx={{ borderRadius: "12px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StoreAdminCatalog;

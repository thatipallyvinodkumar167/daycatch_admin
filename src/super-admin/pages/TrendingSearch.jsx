import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
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
  Stack,
  TextField,
  Tooltip,
  Typography,
  alpha
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  LocalFireDepartment as FireIcon,
  Search as SearchIcon,
  Storefront as StoreIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const normalizeValue = (value) => String(value || "").trim().toLowerCase();

const extractItems = (payload) => {
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

const normalizeStatus = (value) => {
  const normalized = normalizeValue(value);
  if (["approved", "live", "active", "accepted"].includes(normalized)) return "Approved";
  if (["rejected", "declined"].includes(normalized)) return "Rejected";
  return "Pending";
};

const getProductKey = (item) =>
  normalizeValue(
    item.storeProductId ||
      item["Store Product Id"] ||
      `${item.storeName || item.Store || ""}::${item.productID || item["Product Id"] || item.productName || item["Product Name"] || item.Keyword}`
  );

const formatStoreProduct = (item, index) => ({
  id: item._id || item.id || `store-product-${index}`,
  storeProductId: item._id || item.id || `store-product-${index}`,
  productID: item["Product Id"] || item.productID || "",
  productName: item["Product Name"] || item.productName || item.name || "Unnamed Product",
  category: item.Category || item.category || "General",
  type: item.Type || item.type || "General",
  image: item.Image || item["Product Image"] || item.image || "",
  tags: item.Tags || item.tags || "",
  unit: item.Unit || item.unit || "",
  mrp: Number(item.MRP || item.mrp || 0),
  price: Number(item.price || item.Price || 0),
  storeName: item.Store || item.storeName || item.store || "Unknown Store",
  requestStatus: normalizeStatus(item.status),
  sourceType: "store",
  sourceLabel: "Approval Product"
});

const formatAdminProduct = (item, index) => ({
  id: item._id || item.id || `admin-product-${index}`,
  storeProductId: "",
  productID: item["Product Id"] || item.productID || "",
  productName: item["Product Name"] || item.productName || item.name || "Unnamed Product",
  category: item.Category || item.category || "General",
  type: item.Type || item.type || "General",
  image: item["Product Image"] || item.image || "",
  tags: item.Tags || item.tags || "",
  unit: item.Unit || item.unit || "",
  mrp: Number(item.MRP || item.mrp || 0),
  price: Number(item.price || item.Price || 0),
  storeName: "Admin Catalog",
  requestStatus: "Admin Product",
  sourceType: "admin",
  sourceLabel: "Admin Product"
});

const formatTrendingProduct = (item, index) => ({
  id: item._id || item.id || `trending-${index}`,
  storeProductId: item["Store Product Id"] || item.storeProductId || "",
  productID: item["Product Id"] || item.productID || "",
  productName: item["Product Name"] || item.productName || item.Keyword || item.keyword || "Unnamed Product",
  category: item.Category || item.category || "General",
  type: item.Type || item.type || "General",
  image: item["Product Image"] || item.image || "",
  storeName: item.Store || item.storeName || item.store || "Unknown Store",
  mrp: Number(item.MRP || item.mrp || 0),
  price: Number(item.price || item.Price || 0),
  status: item.status || "Active",
  position: Number(item.Position || item.position || index + 1),
  searchCount: Number(item["Search Count"] || item.searchCount || 0),
  lastUpdated: item["Last Updated"] ? new Date(item["Last Updated"]).toLocaleDateString() : "N/A"
});

const TrendingSearch = () => {
  const navigate = useNavigate();
  const [sourceProducts, setSourceProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sourceInventoryCounts, setSourceInventoryCounts] = useState({
    admin: 0,
    approval: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });

  // Aesthetic Colors
  const navy = "#1b2559";
  const brandRed = "#E53935";
  const bgSoft = "#f4f7fe";

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [productsResponse, trendingResponse, adminResponse] = await Promise.all([
        genericApi.getAll("storeProducts"),
        genericApi.getAll("trending_search"),
        genericApi.getAll("Adminproducts")
      ]);

      const rawProducts = extractItems(productsResponse.data);
      const rawTrending = extractItems(trendingResponse.data);
      const rawAdminProducts = extractItems(adminResponse.data);

      const allStoreProducts = rawProducts.map(formatStoreProduct);
      const allAdminProducts = rawAdminProducts.map(formatAdminProduct);

      const formattedProducts = [...allAdminProducts, ...allStoreProducts.filter((item) => item.requestStatus !== "Rejected")]
        .sort((a, b) => a.productName.localeCompare(b.productName));
      
      const formattedTrending = rawTrending
        .map(formatTrendingProduct)
        .sort((a, b) => a.position - b.position || a.productName.localeCompare(b.productName));

      setSourceProducts(formattedProducts);
      setTrendingProducts(formattedTrending);
      setSourceInventoryCounts({
        admin: allAdminProducts.length,
        approval: allStoreProducts.filter((item) => item.requestStatus !== "Rejected").length,
        approved: allStoreProducts.filter((item) => item.requestStatus === "Approved").length,
        pending: allStoreProducts.filter((item) => item.requestStatus === "Pending").length,
        rejected: allStoreProducts.filter((item) => item.requestStatus === "Rejected").length
      });
    } catch (error) {
      console.error("Error fetching trending product data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const trendingKeys = useMemo(() => new Set(trendingProducts.map(getProductKey).filter(Boolean)), [trendingProducts]);

  const availableProducts = useMemo(() => 
    sourceProducts.filter((item) => !trendingKeys.has(getProductKey(item))), 
  [sourceProducts, trendingKeys]);

  const filteredTrendingProducts = useMemo(() => {
    const query = normalizeValue(search);
    if (!query) return trendingProducts;

    return trendingProducts.filter((item) =>
      [item.productName, item.productID, item.storeName, item.category, item.type].some((value) =>
        normalizeValue(value).includes(query)
      )
    );
  }, [trendingProducts, search]);

  const handleAddProducts = async () => {
    if (!selectedProducts.length) return;
    setSaving(true);
    try {
      const basePosition = trendingProducts.length;
      const now = new Date().toISOString();
      const payloads = selectedProducts.map((product, index) => ({
        Keyword: product.productName,
        "Store Product Id": product.storeProductId,
        "Product Id": product.productID,
        "Product Name": product.productName,
        Category: product.category,
        Type: product.type,
        "Product Image": product.image,
        Store: product.storeName,
        Tags: product.tags,
        Unit: product.unit,
        MRP: product.mrp,
        price: product.price,
        status: "Active",
        Position: basePosition + index + 1,
        "Search Count": 0,
        "Last Updated": now
      }));

      if (payloads.length === 1) {
        await genericApi.create("trending_search", payloads[0]);
      } else {
        await genericApi.bulkCreate("trending_search", payloads);
      }

      setSelectedProducts([]);
      setIsAddModalOpen(false);
      await fetchData();
    } catch (error) {
      console.error("Error adding trending products:", error);
      alert(error.response?.data?.error || "Failed to add selected products to trending.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this product from trending?")) return;
    try {
      await genericApi.remove("trending_search", id);
      await fetchData();
    } catch (error) {
      console.error("Error deleting trending product:", error);
      alert("Failed to remove product from trending.");
    }
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: bgSoft, minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        
        {/* Dynamic Page Header */}
        <Box sx={{ mb: 6, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 3 }}>
          <Box>
            <Typography variant="h3" fontWeight="900" color={navy} sx={{ letterSpacing: "-1.5px", mb: 0.5, display: "flex", alignItems: "center", gap: 1.5 }}>
              Trending Overview <FireIcon sx={{ color: brandRed, fontSize: 36, mb: 0.5 }} />
            </Typography>
            <Typography variant="body1" color="#a3aed0" fontWeight="700">
              Manage the most popular and highly searched products dynamically.
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search active trending..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#a3aed0" }} />
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: "14px", 
                  bgcolor: "#fff", 
                  width: { xs: "100%", sm: "260px" }, 
                  "& fieldset": { borderColor: "transparent" },
                  boxShadow: "0 4px 15px rgba(0,0,0,0.03)"
                }
              }}
            />
            <Button
              variant="contained"
              onClick={() => setIsAddModalOpen(true)}
              startIcon={<AddIcon />}
              disabled={loading}
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

        {/* Trending Dashboard Stats */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[
            { title: "Total Trending", value: trendingProducts.length, icon: <TrendingUpIcon />, color: navy },
            { title: "Admin Products", value: sourceInventoryCounts.admin, icon: <StoreIcon />, color: brandRed },
            { title: "Approval Products", value: sourceInventoryCounts.approval, icon: <StoreIcon />, color: "#05cd99" },
            { title: "Pending Review", value: sourceInventoryCounts.pending, icon: <SearchIcon />, color: brandRed },
          ].map((stat, i) => (
            <Grid item xs={12} sm={6} lg={3} key={i}>
              <Paper sx={{ p: 3, borderRadius: "24px", display: "flex", alignItems: "center", gap: 2.5, border: "1px solid #e0e5f2", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
                <Box sx={{ p: 2, borderRadius: "16px", bgcolor: alpha(stat.color, 0.08), color: stat.color, display: "flex" }}>
                  {React.cloneElement(stat.icon, { sx: { fontSize: 32 } })}
                </Box>
                <Box>
                  <Typography variant="body2" color="#a3aed0" fontWeight="800" textTransform="uppercase" letterSpacing="1px">
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" fontWeight="900" color={navy} sx={{ mt: 0.5, letterSpacing: "-1px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "200px" }}>
                    {stat.value}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Gallery / Cards Layout */}
        {loading && trendingProducts.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 15 }}>
            <CircularProgress sx={{ color: brandRed }} />
          </Box>
        ) : filteredTrendingProducts.length === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 15, opacity: 0.7 }}>
            <TrendingUpIcon sx={{ fontSize: 80, color: "#a3aed0", mb: 2 }} />
            <Typography variant="h5" color={navy} fontWeight="900">No Trending Products</Typography>
            <Typography variant="body1" color="#a3aed0" fontWeight="700" sx={{ textAlign: "center", maxWidth: 520 }}>
              {availableProducts.length > 0
                ? `No products are in the trending collection yet. ${availableProducts.length} product(s) from admin products and store approval are ready to be added.`
                : "There are no source products available right now. Add admin products or review store products first, then come back here to publish them."}
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsAddModalOpen(true)}
                sx={{
                  borderRadius: "14px",
                  px: 3,
                  py: 1.2,
                  bgcolor: brandRed,
                  textTransform: "none",
                  fontWeight: 900,
                  "&:hover": { bgcolor: "#d32f2f" }
                }}
                >
                Add Source Products
                </Button>
              {availableProducts.length === 0 && (
                <>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/store-products")}
                  sx={{
                    borderRadius: "14px",
                    px: 3,
                    py: 1.2,
                    textTransform: "none",
                    fontWeight: 900
                  }}
                >
                  Review Store Products
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/products")}
                  sx={{
                    borderRadius: "14px",
                    px: 3,
                    py: 1.2,
                    textTransform: "none",
                    fontWeight: 900
                  }}
                >
                  Open Admin Products
                </Button>
                </>
              )}
            </Stack>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredTrendingProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
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
                    height: "100%"
                  }}
                >
                  {/* Rank Badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      bgcolor: index < 3 ? brandRed : "rgba(255,255,255,0.9)",
                      color: index < 3 ? "#fff" : navy,
                      fontWeight: 900,
                      px: 2,
                      py: 0.5,
                      borderRadius: "10px",
                      zIndex: 2,
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      backdropFilter: "blur(4px)"
                    }}
                  >
                    #{index + 1}
                  </Box>

                  {/* Delete Button */}
                  <Tooltip title="Remove from Trending">
                    <IconButton
                      onClick={() => handleDelete(product.id)}
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        bgcolor: "rgba(255,255,255,0.8)",
                        color: brandRed,
                        zIndex: 2,
                        backdropFilter: "blur(4px)",
                        "&:hover": { bgcolor: "#fff", color: "#d32f2f" }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {/* Image Area */}
                  <Box sx={{ height: 200, bgcolor: "#fafbfc", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {product.image ? (
                      <Box component="img" src={product.image} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <StoreIcon sx={{ fontSize: 60, color: "#e0e5f2" }} />
                    )}
                  </Box>

                  {/* Details Area */}
                  <Box sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box>
                      <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                        <Chip label={product.category} size="small" sx={{ bgcolor: alpha(navy, 0.05), color: navy, fontWeight: 800, fontSize: "10px", height: 22 }} />
                        <Chip label="Live" size="small" icon={<FireIcon sx={{ fontSize: "12px !important", color: "#05cd99" }} />} sx={{ bgcolor: alpha("#05cd99", 0.1), color: "#05cd99", fontWeight: 800, fontSize: "10px", height: 22, pl: 0.5 }} />
                      </Stack>
                      <Typography variant="h6" fontWeight="900" color={navy} sx={{ lineHeight: 1.2, mb: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {product.productName}
                      </Typography>
                      <Typography variant="caption" color="#a3aed0" fontWeight="700" sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}>
                        <StoreIcon sx={{ fontSize: 14 }} /> {product.storeName}
                      </Typography>
                    </Box>

                    <Stack direction="row" alignItems="flex-end" spacing={1}>
                      <Typography variant="h5" fontWeight="900" color={brandRed}>
                        Rs. {product.price}
                      </Typography>
                      {product.mrp > product.price && (
                        <Typography variant="body2" fontWeight="700" color="#a3aed0" sx={{ textDecoration: "line-through", pb: 0.5 }}>
                          Rs. {product.mrp}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Add New Trending Products Modal */}
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
              Curate Trending List
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="700" sx={{ mt: 0.5 }}>
              Select admin products and approval products to push to the homepage trending feed.
            </Typography>
          </Box>
          <IconButton onClick={() => setIsAddModalOpen(false)} sx={{ bgcolor: bgSoft }}>
            <CloseIcon sx={{ color: navy }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ minHeight: "340px", pb: 4 }}>
          <Box sx={{ py: 2 }}>
            {availableProducts.length === 0 && (
              <Paper
                sx={{
                  mb: 3,
                  p: 3,
                  borderRadius: "18px",
                  border: "1px solid #e0e5f2",
                  backgroundColor: "#fafbfc"
                }}
              >
                <Typography variant="h6" fontWeight="900" color={navy} sx={{ mb: 1 }}>
                  No Source Products Available
                </Typography>
                <Typography variant="body2" color="#a3aed0" fontWeight="700" sx={{ mb: 2 }}>
                  {sourceInventoryCounts.admin > 0
                    ? "All currently available admin products and approval products are already in trending."
                    : sourceInventoryCounts.pending > 0
                      ? `You currently have ${sourceInventoryCounts.pending} pending store product request(s). You can review them, or add admin products first.`
                      : "There are no admin products or approval products available to add to trending right now."}
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      navigate("/store-products");
                    }}
                    sx={{
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: 900
                    }}
                  >
                    Open Store Products
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      navigate("/products");
                    }}
                    sx={{
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: 900
                    }}
                  >
                    Open Admin Products
                  </Button>
                </Stack>
              </Paper>
            )}
            <Autocomplete
              multiple
              options={availableProducts}
              value={selectedProducts}
              onChange={(_, value) => setSelectedProducts(value)}
              getOptionLabel={(option) => `${option.productName} (${option.sourceLabel})`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search admin products and approval products..."
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
                      <Stack direction="row" spacing={1} sx={{ mb: 0.5, flexWrap: "wrap" }}>
                        <Chip
                          label={option.sourceLabel}
                          size="small"
                          sx={{ bgcolor: alpha(brandRed, 0.08), color: brandRed, fontWeight: 800, fontSize: "10px", height: 22 }}
                        />
                        <Chip
                          label={option.requestStatus}
                          size="small"
                          sx={{ bgcolor: alpha(navy, 0.08), color: navy, fontWeight: 800, fontSize: "10px", height: 22 }}
                        />
                      </Stack>
                      <Typography variant="body1" fontWeight="800" color={navy}>
                        {option.productName}
                      </Typography>
                      <Typography variant="caption" color="#a3aed0" fontWeight="700" sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <StoreIcon sx={{ fontSize: 13 }} /> {option.storeName} • Rs. {option.price}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              )}
            />

            <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selectedProducts.map((item) => (
                <Chip
                  key={item.id}
                  label={item.productName}
                  onDelete={() => setSelectedProducts(prev => prev.filter(p => p.id !== item.id))}
                  sx={{ bgcolor: alpha(brandRed, 0.08), color: brandRed, fontWeight: "800", borderRadius: "10px", "& .MuiChip-deleteIcon": { color: alpha(brandRed, 0.6), "&:hover": { color: brandRed } } }}
                />
              ))}
              {selectedProducts.length === 0 && (
                <Typography variant="body2" color="#a3aed0" fontWeight="600" sx={{ mt: 1 }}>
                  {availableProducts.length
                    ? "No products selected. Search above to begin."
                    : sourceInventoryCounts.admin > 0 || sourceInventoryCounts.approved > 0 || sourceInventoryCounts.pending > 0
                      ? "All available source products are already in trending."
                      : "No admin products or approval products are available yet."}
                </Typography>
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
            onClick={handleAddProducts}
            disabled={saving || !selectedProducts.length}
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
            {saving ? "Pushing..." : `Push ${selectedProducts.length} Products`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrendingSearch;

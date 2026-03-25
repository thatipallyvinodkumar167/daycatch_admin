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
import { genericApi } from "../../api/genericApi";

const normalizeValue = (value) => String(value || "").trim().toLowerCase();

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
  requestStatus: normalizeStatus(item.status)
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
  const [approvedStoreProducts, setApprovedStoreProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Aesthetic Colors
  const navy = "#1b2559";
  const brandRed = "#E53935";
  const bgSoft = "#f4f7fe";

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [productsResponse, trendingResponse] = await Promise.all([
        genericApi.getAll("storeProducts"),
        genericApi.getAll("trending_search")
      ]);

      const rawProducts = productsResponse.data?.results || productsResponse.data || [];
      const rawTrending = trendingResponse.data?.results || trendingResponse.data || [];

      const formattedProducts = rawProducts
        .map(formatStoreProduct)
        .filter((item) => item.requestStatus === "Approved")
        .sort((a, b) => a.productName.localeCompare(b.productName));
      
      const formattedTrending = rawTrending
        .map(formatTrendingProduct)
        .sort((a, b) => a.position - b.position || a.productName.localeCompare(b.productName));

      setApprovedStoreProducts(formattedProducts);
      setTrendingProducts(formattedTrending);
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
    approvedStoreProducts.filter((item) => !trendingKeys.has(getProductKey(item))), 
  [approvedStoreProducts, trendingKeys]);

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
            { title: "Top Searched", value: trendingProducts.length ? trendingProducts[0].productName : "N/A", icon: <SearchIcon />, color: brandRed },
            { title: "Live Stores", value: new Set(trendingProducts.map(p => p.storeName)).size, icon: <StoreIcon />, color: "#05cd99" },
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
            <Typography variant="body1" color="#a3aed0" fontWeight="700">Add products to see them appear in your live feed.</Typography>
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
              Select live store inventory to push to the homepage trending feed.
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
              value={selectedProducts}
              onChange={(_, value) => setSelectedProducts(value)}
              getOptionLabel={(option) => option.productName}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search and select approved products..."
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
                <Typography variant="body2" color="#a3aed0" fontWeight="600" sx={{ mt: 1 }}>No products selected. Search above to begin.</Typography>
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

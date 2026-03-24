import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PrintIcon from "@mui/icons-material/Print";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { genericApi } from "../api/genericApi";

const normalizeValue = (value) => String(value || "").trim().toLowerCase();

const normalizeStatus = (value) => {
  const normalized = normalizeValue(value);

  if (["approved", "live", "active", "accepted"].includes(normalized)) {
    return "Approved";
  }

  if (["rejected", "declined"].includes(normalized)) {
    return "Rejected";
  }

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

const downloadCsv = (rows) => {
  const headers = ["#", "Store Product Id", "Product Name", "Store", "Category", "Type", "Price", "MRP", "Status", "Search Count", "Last Updated"];
  const csvRows = rows.map((item, index) => [
    index + 1,
    item.storeProductId || item.productID,
    item.productName,
    item.storeName,
    item.category,
    item.type,
    item.price,
    item.mrp,
    item.status,
    item.searchCount,
    item.lastUpdated
  ]);

  const csvContent = [headers, ...csvRows]
    .map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "trending-products.csv";
  link.click();
  window.URL.revokeObjectURL(url);
};

const TrendingSearch = () => {
  const [approvedStoreProducts, setApprovedStoreProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

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
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const trendingKeys = useMemo(() => {
    return new Set(trendingProducts.map(getProductKey).filter(Boolean));
  }, [trendingProducts]);

  const availableProducts = useMemo(() => {
    return approvedStoreProducts.filter((item) => !trendingKeys.has(getProductKey(item)));
  }, [approvedStoreProducts, trendingKeys]);

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
    if (!selectedProducts.length) {
      alert("Select at least one approved store product.");
      return;
    }

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
      await fetchData(true);
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
      await fetchData(true);
    } catch (error) {
      console.error("Error deleting trending product:", error);
      alert("Failed to remove product from trending.");
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
            Trending Products
          </Typography>
          <Typography variant="body2" color="#a3aed0" fontWeight="600">
            Super-admin selects only approved store products here, then the user app can highlight real live listings as trending picks.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 2,
              py: 1,
              borderRadius: "14px",
              bgcolor: "#fff",
              border: "1px solid #e0e5f2",
              boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
            }}
          >
            <Box sx={{ p: 1, borderRadius: "8px", bgcolor: "#fff4eb", display: "flex" }}>
              <LocalFireDepartmentIcon sx={{ color: "#ff7a00", fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ display: "block", lineHeight: 1 }}>
                LIVE NOW
              </Typography>
              <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ lineHeight: 1.2 }}>
                {trendingProducts.length} Trending Products
              </Typography>
            </Box>
          </Box>

          <Tooltip title="Refresh List">
            <IconButton
              onClick={() => fetchData(true)}
              disabled={refreshing || loading}
              sx={{ bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", p: 1.5 }}
            >
              {refreshing ? <CircularProgress size={20} /> : <RefreshIcon sx={{ color: "#4318ff" }} />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <Grid container spacing={4} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4.5}>
          <Paper sx={{ p: 4, borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "1px solid #e0e5f2", bgcolor: "#fff", height: "100%" }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" fontWeight="800" color="#1b2559">
                  Select Approved Store Products
                </Typography>
                <Typography variant="body2" color="#a3aed0" fontWeight="600" sx={{ mt: 0.5 }}>
                  Choose one or more approved live store listings to push into the trending shelf.
                </Typography>
              </Box>

              <Autocomplete
                multiple
                options={availableProducts}
                value={selectedProducts}
                onChange={(_, value) => setSelectedProducts(value)}
                loading={loading}
                getOptionLabel={(option) => option.productName}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={availableProducts.length ? "Search approved store products..." : "No approved store products available"}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "16px",
                        backgroundColor: "#f4f7fe"
                      }
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} key={option.id}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ py: 0.5 }}>
                      <Avatar src={option.image} variant="rounded" sx={{ width: 42, height: 42, borderRadius: "10px" }} />
                      <Box>
                        <Typography variant="body2" fontWeight="800" color="#1b2559">
                          {option.productName}
                        </Typography>
                        <Typography variant="caption" color="#a3aed0" fontWeight="700">
                          {option.storeName} | Rs {option.price} | {option.category}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                )}
              />

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {selectedProducts.length ? (
                  selectedProducts.map((item) => (
                    <Chip
                      key={item.id}
                      label={item.productName}
                      onDelete={() => setSelectedProducts((prev) => prev.filter((product) => product.id !== item.id))}
                      sx={{ bgcolor: "#eef2ff", color: "#4318ff", fontWeight: "800" }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="#a3aed0" fontWeight="600">
                    No products selected yet.
                  </Typography>
                )}
              </Stack>

              <Button
                variant="contained"
                onClick={handleAddProducts}
                disabled={saving || !selectedProducts.length}
                sx={{
                  backgroundColor: "#4318ff",
                  "&:hover": { backgroundColor: "#3311cc" },
                  borderRadius: "16px",
                  py: 1.8,
                  textTransform: "none",
                  fontWeight: "800",
                  boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)"
                }}
              >
                {saving
                  ? "Adding to Trending..."
                  : `Add ${selectedProducts.length} Selected ${selectedProducts.length === 1 ? "Product" : "Products"}`}
              </Button>

              <Paper sx={{ p: 2.5, borderRadius: "18px", bgcolor: "#fafbff", border: "1px solid #eef2ff" }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ p: 1.3, borderRadius: "12px", bgcolor: "#f4f7fe", display: "flex" }}>
                    <TrendingUpIcon sx={{ color: "#4318ff" }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ textTransform: "uppercase" }}>
                      Approved Live Listings
                    </Typography>
                    <Typography variant="h5" fontWeight="800" color="#1b2559">
                      {availableProducts.length}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7.5}>
          <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff" }}>
            <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, bgcolor: "#fafbfc" }}>
              <Typography variant="subtitle1" fontWeight="800" color="#1b2559">
                Selected Products
              </Typography>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <TextField
                  size="small"
                  placeholder="Search selected products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: "#a3aed0", mr: 1, fontSize: 20 }} />
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "#fff",
                      width: { xs: "180px", md: "280px" }
                    }
                  }}
                />
                <Tooltip title="Print List">
                  <IconButton onClick={() => window.print()} sx={{ backgroundColor: "#fff", border: "1px solid #e0e5f2", borderRadius: "12px" }}>
                    <PrintIcon sx={{ color: "#2b3674" }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download CSV">
                  <IconButton onClick={() => downloadCsv(filteredTrendingProducts)} sx={{ backgroundColor: "#fff", border: "1px solid #e0e5f2", borderRadius: "12px" }}>
                    <FileDownloadIcon sx={{ color: "#2b3674" }} />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>

            <TableContainer sx={{ maxHeight: "calc(100vh - 320px)" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", pl: 4, bgcolor: "#f4f7fe" }}>#</TableCell>
                    <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", bgcolor: "#f4f7fe" }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", bgcolor: "#f4f7fe" }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", bgcolor: "#f4f7fe" }}>Store</TableCell>
                    <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", bgcolor: "#f4f7fe" }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", bgcolor: "#f4f7fe" }}>MRP</TableCell>
                    <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", bgcolor: "#f4f7fe" }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", pr: 4, bgcolor: "#f4f7fe" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && trendingProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                        <CircularProgress sx={{ color: "#4318ff" }} />
                      </TableCell>
                    </TableRow>
                  ) : filteredTrendingProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                        <Typography color="#a3aed0" fontWeight="600">
                          No trending products found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTrendingProducts.map((item, index) => (
                      <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}>
                        <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4 }}>#{index + 1}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar src={item.image} variant="rounded" sx={{ width: 50, height: 50, borderRadius: "12px", border: "2px solid #f4f7fe" }}>
                              {item.productName?.charAt(0) || "P"}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="800" color="#1b2559">
                                {item.productName}
                              </Typography>
                              <Typography variant="caption" color="#a3aed0" fontWeight="700">
                                {item.storeName} | {item.productID || "No Product ID"} | {item.type}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip label={item.category} size="small" sx={{ bgcolor: "#f4f7fe", color: "#1b2559", fontWeight: "700", borderRadius: "8px" }} />
                        </TableCell>
                        <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>
                          {item.storeName}
                        </TableCell>
                        <TableCell sx={{ color: "#4318ff", fontWeight: "900" }}>
                          {item.price ? `Rs ${item.price}` : "Rs 0"}
                        </TableCell>
                        <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>
                          {item.mrp ? `Rs ${item.mrp}` : "Rs 0"}
                        </TableCell>
                        <TableCell>
                          <Chip label={item.status} size="small" sx={{ bgcolor: "#fff4eb", color: "#ff7a00", fontWeight: "800", borderRadius: "8px" }} />
                        </TableCell>
                        <TableCell align="right" sx={{ pr: 3 }}>
                          <Tooltip title="Remove From Trending">
                            <IconButton
                              onClick={() => handleDelete(item.id)}
                              sx={{
                                backgroundColor: "#fff5f5",
                                color: "#ff4d49",
                                borderRadius: "10px",
                                "&:hover": { backgroundColor: "#ffebeb" }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TrendingSearch;

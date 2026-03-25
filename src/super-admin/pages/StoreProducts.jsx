import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
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
  Typography,
  Chip,
  LinearProgress
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import InventoryIcon from "@mui/icons-material/Inventory";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import { genericApi } from "../../api/genericApi";

const STATUS_ORDER = {
  Pending: 0,
  Approved: 1,
  Rejected: 2
};

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

const formatCurrency = (value) => Number(value || 0).toLocaleString("en-IN");

const buildCsv = (rows) => {
  const headers = ["#", "Product Name", "Price", "MRP", "Store", "Status"];
  const csvRows = rows.map((item, index) => [
    index + 1,
    item.productName,
    item.price,
    item.mrp,
    item.storeName,
    item.status
  ]);

  return [headers, ...csvRows]
    .map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
};

const downloadCsv = (rows) => {
  const blob = new Blob([buildCsv(rows)], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "store-product-requests.csv";
  link.click();
  window.URL.revokeObjectURL(url);
};


const StoreProducts = () => {
  const [storeProducts, setStoreProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  const fetchStoreProducts = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await genericApi.getAll("storeProducts");
      const results = response.data.results || response.data || [];

      const formattedData = results
        .map((item, index) => ({
          id: item._id || item.id || `store-product-${index}`,
          image:
            item.Image ||
            item["Product Image"] ||
            item.image ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(item["Product Name"] || "SP")}&background=random`,
          productName: item["Product Name"] || item.productName || item.name || `Product ${index + 1}`,
          price: Number(item.Price || item.price || 0),
          mrp: Number(item.MRP || item.mrp || 0),
          storeName: item.Store || item.storeName || item.store || `Store ${index + 1}`,
          status: normalizeStatus(item.status),
          raw: item
        }))
        .sort((a, b) => {
          const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
          if (statusDiff !== 0) return statusDiff;
          return a.productName.localeCompare(b.productName);
        });

      setStoreProducts(formattedData);
    } catch (error) {
      console.error("Error fetching store products:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStoreProducts();
  }, [fetchStoreProducts]);

  const handleStatusUpdate = async (item, nextStatus) => {
    setUpdatingId(item.id);

    try {
      await genericApi.update("storeProducts", item.id, {
        ...item.raw,
        status: nextStatus,
        reviewedAt: new Date().toISOString()
      });

      await fetchStoreProducts(true);
    } catch (error) {
      console.error(`Error updating store product to ${nextStatus}:`, error);
      alert(`Failed to mark this request as ${nextStatus}.`);
    } finally {
      setUpdatingId("");
    }
  };

  const filteredProducts = useMemo(() => {
    const query = normalizeValue(search);
    if (!query) return storeProducts;

    return storeProducts.filter((item) =>
      [item.productName, item.storeName, item.status].some((value) => normalizeValue(value).includes(query))
    );
  }, [search, storeProducts]);

  const totalRequests = storeProducts.length;
  const approvedCount = storeProducts.filter(p => p.status === "Approved").length;
  const rejectedCount = storeProducts.filter(p => p.status === "Rejected").length;
  const pendingCount = storeProducts.filter(p => p.status === "Pending").length;

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
            Store Products (For Approval)
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 0.5 }}>
            Review store product requests, then approve or reject each listing.
          </Typography>
        </Box>
      </Box>

      {/* Summary Cards Row (Matching Store Earnings) */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "Total Requests", value: totalRequests, icon: <InventoryIcon />, color: "#4318ff", bg: "#eef2ff" },
          { label: "Approved", value: approvedCount, icon: <CheckCircleIcon />, color: "#24d164", bg: "#e6f9ed" },
          { label: "Rejected", value: rejectedCount, icon: <CancelIcon />, color: "#ff4d49", bg: "#fff1f0" },
          { label: "Pending Review", value: pendingCount, icon: <PendingIcon />, color: "#ffb800", bg: "#fff9e6" },
        ].map((stat) => (
          <Paper key={stat.label} sx={{ flex: 1, p: 3, borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", bgcolor: "#fff" }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: stat.bg, color: stat.color }}>
                {stat.icon}
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary" fontWeight="600">{stat.label}</Typography>
                <Typography variant="h5" fontWeight="800" color="#1b2559">{stat.value}</Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Paper sx={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: "1px solid #f1f1f1", backgroundColor: "#fff" }}>
        {/* Table Header Row Matching Store Earnings */}
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
          <Box>
            <Typography variant="h6" fontWeight="700" color="#1b2559">Product Approval List</Typography>
            <Typography variant="caption" color="textSecondary">{filteredProducts.length} requests found</Typography>
          </Box>
          <Stack direction="row" alignItems="center" spacing={2}>
            <TextField
              size="small"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search store or product..."
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: "#a3aed0", mr: 1, fontSize: 20 }} />
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  width: { xs: "220px", md: "280px" }
                }
              }}
            />
            <Stack direction="row" spacing={1}>
                <Button variant="outlined" size="small" onClick={() => window.print()} sx={{ borderRadius: "10px", textTransform: "none", fontWeight: "700" }}>
                Print
                </Button>
                <Button variant="outlined" size="small" onClick={() => downloadCsv(filteredProducts)} sx={{ borderRadius: "10px", textTransform: "none", fontWeight: "700" }}>
                CSV
                </Button>
                <Tooltip title="Refresh">
                <IconButton
                    size="small"
                    onClick={() => fetchStoreProducts(true)}
                    disabled={refreshing || loading}
                    sx={{ border: "1px solid #e0e5f2", borderRadius: "10px" }}
                >
                    {refreshing ? <CircularProgress size={20} /> : <RefreshIcon sx={{ color: "#2b3674", fontSize: 20 }} />}
                </IconButton>
                </Tooltip>
            </Stack>
          </Stack>
        </Box>

        {loading && <LinearProgress />}
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", width: 60, pl: 3 }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>PRODUCT</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>PRICE/MRP</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>STORE</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", textAlign: "right", pr: 3 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: "#a3aed0" }}>
                    <InventoryIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1, display: "block", mx: "auto" }} />
                    No product requests found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((item, index) => (
                  <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500", pl: 3 }}>{index + 1}</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          src={item.image}
                          variant="rounded"
                          sx={{ width: 44, height: 44, borderRadius: "10px", border: "2px solid #f4f7fe" }}
                        />
                        <Box>
                          <Typography fontWeight="700" color="#1b2559" fontSize="14px">{item.productName}</Typography>
                          <Typography variant="caption" color="textSecondary">{item.category || "General"}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography fontWeight="800" color="#4318ff">₹{formatCurrency(item.price)}</Typography>
                        <Typography variant="caption" sx={{ textDecoration: "line-through", opacity: 0.5 }}>₹{formatCurrency(item.mrp)}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ color: "#475467", fontWeight: "600" }}>
                      {item.storeName}
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      {item.status === "Pending" ? (
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button
                            variant="contained"
                            size="small"
                            disabled={updatingId === item.id}
                            onClick={() => handleStatusUpdate(item, "Approved")}
                            sx={{
                              backgroundColor: "#24d164",
                              "&:hover": { backgroundColor: "#1fb355" },
                              borderRadius: "10px",
                              textTransform: "none",
                              fontWeight: "700",
                              px: 2
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            disabled={updatingId === item.id}
                            onClick={() => handleStatusUpdate(item, "Rejected")}
                            sx={{ borderRadius: "10px", textTransform: "none", fontWeight: "700", px: 2 }}
                          >
                            Reject
                          </Button>
                        </Stack>
                      ) : (
                        <Chip
                          label={item.status}
                          size="small"
                          sx={{
                            backgroundColor: item.status === "Approved" ? "#e6f9ed" : "#fff1f0",
                            color: item.status === "Approved" ? "#24d164" : "#ff4d49",
                            fontWeight: "700",
                            borderRadius: "8px"
                          }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default StoreProducts;



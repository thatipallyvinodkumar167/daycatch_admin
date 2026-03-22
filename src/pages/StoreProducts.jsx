import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  CircularProgress
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { genericApi } from "../api/genericApi";

const StoreProducts = () => {
  const [storeProducts, setStoreProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStoreProducts = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await genericApi.getAll("storeProducts");
      const results = response.data.results || response.data || [];
      
      const formattedData = results.map((item, index) => ({
        id: item._id || index,
        storeName: item.Store || item.storeName || item.store || `Store ${index}`,
        storeImage: item.Image || item.storeImage || item.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.Store || "S")}&background=random`,
        productName: item["Product Name"] || item.productName || item.name || `Product ${index}`,
        category: item.category || "Uncategorized",
        price: item.Price || item.price ? `₹${item.Price || item.price}` : "₹0",
        status: item.status || "Live"
      }));

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

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return storeProducts;
    return storeProducts.filter((item) =>
      item.storeName.toLowerCase().includes(query) ||
      item.productName.toLowerCase().includes(query)
    );
  }, [storeProducts, search]);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header Container */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Merchant Inventory Feed
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Auditing and monitoring SKU dynamics from the partner ecosystem.
            </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
            <Tooltip title="Refresh Feed">
                <IconButton 
                    onClick={() => fetchStoreProducts(true)} 
                    disabled={refreshing || loading}
                    sx={{ bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", p: 1.5 }}
                >
                    {refreshing ? <CircularProgress size={20} /> : <RefreshIcon sx={{ color: "#4318ff" }} />}
                </IconButton>
            </Tooltip>
        </Stack>
      </Box>

      {/* Stats Analytics Card */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "1px solid #e0e5f2", width: "fit-content", minWidth: 280, bgcolor: "#fff" }}>
        <Stack direction="row" alignItems="center" spacing={3}>
          <Box sx={{ p: 2, borderRadius: "16px", backgroundColor: "#f4f7fe" }}>
            <StorefrontIcon sx={{ color: "#4318ff", fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ textTransform: "uppercase" }}>
              Collaborator Shares
            </Typography>
            <Typography variant="h4" fontWeight="800" color="#1b2559">
              {storeProducts.length} Listings
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Directory Paper */}
      <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff" }}>
        
        {/* Search Toolbar */}
        <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
            <Typography variant="subtitle1" fontWeight="800" color="#1b2559">Merchant SKU Console</Typography>
            <TextField
                size="small"
                placeholder="Identify Merchant or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                    startAdornment: <SearchIcon sx={{ color: "#a3aed0", mr: 1, fontSize: 20 }} />
                }}
                sx={{ 
                    "& .MuiOutlinedInput-root": { 
                        borderRadius: "12px", 
                        backgroundColor: "#fff",
                        width: "360px"
                    } 
                }}
            />
        </Box>

        <TableContainer sx={{ 
          maxHeight: "calc(100vh - 400px)",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" }
        }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f4f7fe" }}>
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", pl: 4, borderBottom: "1px solid #e0e5f2", bgcolor: "#f4f7fe" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", borderBottom: "1px solid #e0e5f2", bgcolor: "#f4f7fe" }}>Merchant</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", borderBottom: "1px solid #e0e5f2", bgcolor: "#f4f7fe" }}>SKU Narrative</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", borderBottom: "1px solid #e0e5f2", bgcolor: "#f4f7fe" }}>Valuation</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", borderBottom: "1px solid #e0e5f2", bgcolor: "#f4f7fe" }}>Policy</TableCell>
                <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", borderBottom: "1px solid #e0e5f2", pr: 4, bgcolor: "#f4f7fe" }}>Operations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                    <CircularProgress sx={{ color: "#4318ff" }} />
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                    <Typography color="#a3aed0" fontWeight="600">No partner listings found in the active feed.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item, index) => (
                  <TableRow 
                    key={item.id} 
                    sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}
                  >
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700", pl: 4 }}>
                      #{index + 1}
                    </TableCell>
                    <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar 
                                src={item.storeImage} 
                                sx={{ width: 40, height: 40, border: "2px solid #f4f7fe", borderRadius: "10px" }} 
                            />
                            <Typography variant="body2" fontWeight="800" color="#1b2559">{item.storeName}</Typography>
                        </Stack>
                    </TableCell>
                    <TableCell>
                        <Typography variant="body2" fontWeight="800" color="#1b2559">{item.productName}</Typography>
                        <Typography variant="caption" color="#a3aed0" fontWeight="700">{item.category}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: "#4318ff", fontWeight: "900", fontSize: "15px" }}>
                      {item.price}
                    </TableCell>
                    <TableCell>
                        <Chip 
                            label={item.status} 
                            size="small" 
                            sx={{ 
                                backgroundColor: item.status === "Live" ? "#f0fff4" : "#fff8e6", 
                                color: item.status === "Live" ? "#24d164" : "#ffb800",
                                fontWeight: "800",
                                borderRadius: "8px"
                            }} 
                        />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Examine Listings">
                            <IconButton 
                                sx={{ backgroundColor: "#f4f7fe", color: "#4318ff", borderRadius: "10px", "&:hover": { backgroundColor: "#e0e5f2" } }}
                            >
                                <VisibilityIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Revoke Share">
                            <IconButton 
                                sx={{ backgroundColor: "#fff5f5", color: "#ff4d49", borderRadius: "10px", "&:hover": { backgroundColor: "#ffebeb" } }}
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
  );
};

export default StoreProducts;

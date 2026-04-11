import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
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
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory2Outlined as InventoryIcon
} from "@mui/icons-material";
import { useOutletContext, useNavigate } from "react-router-dom";
import { genericApi } from "../../api/genericApi";
import { matchesStoreRecord } from "../utils/storeWorkspace";

const StoreProductList = () => {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await genericApi.getAll("store_products");
        const list = response?.data?.results || [];
        setProducts(
          list
            .filter((product) => matchesStoreRecord(product, store))
            .map((product) => ({
              id: String(product._id || product.id || ""),
              name: product["Product Name"] || product.name || "Unnamed Product",
              category: product.Category || product.category || "N/A",
              image:
                product.Image ||
                product["Product Image"] ||
                product.image ||
                "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000",
              productCode: product["Product Id"] || product.productCode || "N/A",
              status: product.status || product.Status || "Pending",
              price: Number(product.Price || product.price || 0),
              mrp: Number(product.MRP || product.mrp || 0),
            }))
        );
      } catch (error) {
        console.warn("Backend collection 'store_products' not initialized yet (404). Falling back to mock data.");
        setProducts([
          {
            id: "mock-prod-1",
            name: "HyperX Cloud Alpha Wireless",
            category: "Audio",
            image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=400&h=400",
            productCode: "HX-CAW",
            status: "Approved",
            price: 199,
            mrp: 229,
          },
          {
            id: "mock-prod-2",
            name: "Logitech MX Master 3S",
            category: "Peripherals",
            image: "https://images.unsplash.com/photo-1527814050087-379381547969?auto=format&fit=crop&q=80&w=400&h=400",
            productCode: "LOGI-MX3S",
            status: "Pending",
            price: 99,
            mrp: 120,
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    if (store?.id || store?.name) fetchProducts();
  }, [store?.id, store?.name, store]);

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.productCode.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [products, searchTerm]
  );
  const orderPanelSx = {
    borderRadius: "24px",
    border: "1px solid #e0e5f2",
    bgcolor: "#fff",
    boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
  };

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete ${productName}?`)) return;

    if (productId.includes("mock-")) {
      setProducts(curr => curr.filter(p => p.id !== productId));
      setSnackbar({ open: true, message: "Mock Product removed successfully.", severity: "success" });
      return;
    }

    try {
      await genericApi.remove("store_products", productId);
      setProducts(curr => curr.filter(p => p.id !== productId));
      setSnackbar({ open: true, message: "Product deleted from operational system.", severity: "success" });
    } catch (error) {
      console.error("Failed to delete product:", error);
      setSnackbar({ open: true, message: error?.response?.data?.error || "Error removing product", severity: "error" });
    }
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}><CircularProgress sx={{ color: "#E53935" }} /></Box>;

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        
        <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1b2559", mb: 0.5, letterSpacing: "-1.5px" }}>
               Products
            </Typography>
            <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
               <InventoryIcon sx={{ fontSize: 18 }} /> Catalog Terminal • Workspace Node
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate("add")}
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
            + Create Product
          </Button>
        </Box>

        <Paper sx={{ p: 4, ...orderPanelSx }}>
          
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} flexWrap="wrap" useFlexGap>
            <Typography variant="h4" fontWeight="800" color="#1b2559">
              Product List
            </Typography>
            <TextField
              placeholder="Search products..."
              size="small"
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
                  bgcolor: "#f8f9fc",
                  width: { xs: "100%", sm: "320px" },
                  fontWeight: 600,
                  "& fieldset": { borderColor: "rgba(224,229,242,0.8)" },
                }
              }}
            />
          </Stack>

          <TableContainer sx={{ border: "1px solid #eef2f6", borderRadius: "20px", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#fafbfc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", px: 4 }}># Index</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Product ID</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Resource</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", px: 4, textAlign: "right" }}>Operation</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 12 }}>
                      <Stack alignItems="center" spacing={2.5}>
                        <Box sx={{ p: 3, borderRadius: "50%", bgcolor: alpha("#E53935", 0.05) }}>
                          <InventoryIcon sx={{ color: "#E53935", fontSize: 56, opacity: 0.5 }} />
                        </Box>
                        <Box>
                           <Typography variant="h5" color="#1b2559" fontWeight="900" gutterBottom>No operational items found</Typography>
                           <Typography variant="body2" color="#a3aed0" fontWeight="600">You haven't added any products to your catalog terminal yet.</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((row, index) => (
                    <TableRow key={row.id} hover sx={{ transition: "0.2s", "&:hover": { bgcolor: alpha("#1b2559", 0.02) } }}>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559" }}>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559" }}>{row.name}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#a3aed0" }}>{row.productCode}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#E53935" }}>{row.category}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: row.status === "Approved" ? "#05cd99" : "#a3aed0" }}>
                        {row.status}
                      </TableCell>
                      <TableCell>
                        <Avatar
                          src={row.image}
                          variant="rounded"
                          sx={{ width: 48, height: 48, borderRadius: "12px", border: "1px solid #e0e5f2" }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Edit Product Node">
                            <IconButton onClick={() => navigate(`edit/${row.id}`)} className="action-edit" size="small" sx={{ color: "#1b2559", bgcolor: alpha("#1b2559", 0.05), borderRadius: "10px", "&:hover": { bgcolor: alpha("#1b2559", 0.1) } }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Product Profile">
                            <IconButton onClick={() => handleDelete(row.id, row.name)} className="action-delete" size="small" sx={{ color: "#E53935", bgcolor: alpha("#E53935", 0.05), borderRadius: "10px", "&:hover": { bgcolor: alpha("#E53935", 0.1) } }}>
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
        autoHideDuration={4000}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
          sx={{ borderRadius: "12px", fontWeight: 700 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StoreProductList;

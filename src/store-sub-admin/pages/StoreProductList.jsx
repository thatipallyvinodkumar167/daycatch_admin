import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  IconButton,
  alpha,
  CircularProgress,
  Button,
  Avatar
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory2Outlined as InventoryIcon
} from "@mui/icons-material";
import { useOutletContext, useNavigate } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const StoreProductList = () => {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await genericApi.getAll("products");
        const list = response?.data?.results || [];
        setProducts(list.filter(p => String(p.storeId) === String(store.id)).map(p => ({
          id: p._id || p.id,
          name: p["Product Name"] || p.name,
          category: p["Category"] || p.category,
          image: p["Product Image"] || p.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000",
        })));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    if (store?.id) fetchProducts();
  }, [store?.id]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const orderPanelSx = {
    borderRadius: "24px",
    border: "1px solid #e0e5f2",
    bgcolor: "#fff",
    boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
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
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Object Reference</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>ID Segment</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Resource</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", px: 4, textAlign: "right" }}>Operation</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 12 }}>
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
                      <TableCell sx={{ fontWeight: 700, color: "#a3aed0" }}>#{row.id}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#E53935" }}>{row.category}</TableCell>
                      <TableCell>
                        <Avatar
                          src={row.image}
                          variant="rounded"
                          sx={{ width: 48, height: 48, borderRadius: "12px", border: "1px solid #e0e5f2" }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton className="action-edit" size="small" sx={{ color: "#1b2559", bgcolor: alpha("#1b2559", 0.05), borderRadius: "10px" }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton className="action-delete" size="small" sx={{ color: "#f44336", bgcolor: alpha("#f44336", 0.05), borderRadius: "10px" }}>
                            <DeleteIcon fontSize="small" />
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
    </Box>
  );
};

export default StoreProductList;

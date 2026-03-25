import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  alpha,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox
} from "@mui/material";
import {
  Search as SearchIcon,
  AddCircleOutline as AddIcon,
  RemoveCircleOutline as RemoveIcon,
  Inventory2Outlined as InventoryIcon,
  CheckCircle as CheckCircleIcon
} from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const StoreAdminCatalog = () => {
  const { store } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [globalProducts, setGlobalProducts] = useState([
    { id: 101, name: "Tiger Prawns (Global)" },
    { id: 102, name: "Rohu Fish (Global)" },
    { id: 103, name: "Sea Crabs (Global)" },
    { id: 104, name: "Chicken Breast (Global)" },
    { id: 105, name: "Mutton Curry Cut (Global)" },
  ]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all global products
        const res = await genericApi.getAll("products");
        if (res.data && res.data.length > 0) {
           setGlobalProducts(res.data.map(p => ({ id: p.id, name: p.name })));
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleAdd = (product) => {
    setSelectedProducts([...selectedProducts, product]);
    setGlobalProducts(globalProducts.filter(p => p.id !== product.id));
  };

  const handleRemove = (product) => {
    setGlobalProducts([...globalProducts, product]);
    setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress sx={{ color: "#4318ff" }} /></Box>;

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Box sx={{ maxWidth: "1420px", mx: "auto" }}>
        
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h3" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1.5px" }}>
              Admin Catalog
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
               Select which global products {store.name} carries.
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={4}>
          {/* Left: Global Catalog Selection */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, borderRadius: "28px", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", height: "100%" }}>
              <Typography variant="h5" fontWeight="900" color="#1b2559" sx={{ mb: 1 }}>Select Products</Typography>
              <Typography variant="body2" color="#707eae" fontWeight="600" sx={{ mb: 4 }}>Select the products you have available in stock.</Typography>
              
              <TextField
                fullWidth
                placeholder="Search products..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#a3aed0" }} /></InputAdornment>,
                  sx: { borderRadius: "14px", bgcolor: "#f8f9fc" }
                }}
              />

              <List sx={{ maxHeight: "500px", overflowY: "auto", border: "1px solid #f0f4f8", borderRadius: "16px" }}>
                {globalProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                   <ListItem><ListItemText primary="No global products found" sx={{ textAlign: "center", color: "#a3aed0" }} /></ListItem>
                ) : (
                  globalProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((product) => (
                    <ListItem
                      key={product.id}
                      secondaryAction={
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleAdd(product)}
                          sx={{ borderRadius: "10px", bgcolor: alpha("#4318ff", 0.08), color: "#4318ff", fontWeight: 800, textTransform: "none", filter: "none", boxShadow: "none", "&:hover": { bgcolor: "#4318ff", color: "#fff" } }}
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
                        secondary={<Typography variant="caption" fontWeight="600" color="#a3aed0">ID: #{product.id}</Typography>}
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </Paper>
          </Grid>

          {/* Right: Selected Products Table */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, borderRadius: "28px", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", height: "100%" }}>
              <Typography variant="h5" fontWeight="900" color="#1b2559" sx={{ mb: 1 }}>Selected Products</Typography>
              <Typography variant="body2" color="#707eae" fontWeight="600" sx={{ mb: 4 }}>Products currently assigned to your store.</Typography>

              <TableContainer sx={{ border: "1px solid #eef2f6", borderRadius: "20px", overflow: "hidden" }}>
                <Table>
                  <TableHead sx={{ bgcolor: "#fafbfc" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 900, color: "#a3aed0" }}>Product Name</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#a3aed0", textAlign: "right" }}>Actions</TableCell>
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
                        <TableRow key={row.id} hover>
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

              {selectedProducts.length > 0 && (
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 4, py: 2, borderRadius: "18px", bgcolor: "#05cd99", fontWeight: 900, fontSize: "16px", boxShadow: "0 10px 25px rgba(5,205,153,0.25)", "&:hover": { bgcolor: "#04b486" } }}
                >
                  Confirm Selection
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default StoreAdminCatalog;

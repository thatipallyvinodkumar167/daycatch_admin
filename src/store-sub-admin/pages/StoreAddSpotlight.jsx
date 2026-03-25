import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
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
  StarOutline as StarIcon,
} from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { storeWorkspaceApi } from "../../api/storeWorkspaceApi";

const StoreAddSpotlight = () => {
  const { store } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catalogResponse, spotlightResponse] = await Promise.all([
          storeWorkspaceApi.getCatalogProducts(store.id),
          storeWorkspaceApi.getSpotlight(store.id),
        ]);

        const catalogProducts = catalogResponse?.data?.data || [];
        const spotlightProducts = spotlightResponse?.data?.data || [];
        const spotlightIds = new Set(spotlightProducts.map((product) => product.id));

        setSelectedProducts(
          spotlightProducts.map((product) => ({
            id: product.id,
            name: product.productName || "Unnamed Product",
          }))
        );

        setAvailableProducts(
          catalogProducts
            .filter((product) => !spotlightIds.has(product.id))
            .map((product) => ({
              id: product.id,
              name: product.productName || "Unnamed Product",
            }))
        );
      } catch (error) {
        console.error("Unable to load spotlight data:", error);
        setSnackbar({ open: true, message: "Failed to load spotlight products.", severity: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (store?.id) {
      fetchData();
    }
  }, [store?.id]);

  const filteredAvailableProducts = useMemo(
    () =>
      availableProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [availableProducts, searchTerm]
  );

  const handleAdd = (product) => {
    setSelectedProducts((current) => [...current, product]);
    setAvailableProducts((current) => current.filter((row) => row.id !== product.id));
  };

  const handleRemove = (product) => {
    setAvailableProducts((current) => [...current, product].sort((left, right) => left.name.localeCompare(right.name)));
    setSelectedProducts((current) => current.filter((row) => row.id !== product.id));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await storeWorkspaceApi.updateSpotlight(store.id, {
        productIds: selectedProducts.map((product) => product.id),
      });
      setSnackbar({ open: true, message: "Spotlight updated successfully.", severity: "success" });
    } catch (error) {
      console.error("Unable to update spotlight:", error);
      setSnackbar({ open: true, message: "Failed to save spotlight selection.", severity: "error" });
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
            <Typography variant="h3" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1.5px" }}>
              Spotlight Products
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
              Feature your best store products on the home screen spotlight.
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, borderRadius: "28px", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", height: "100%" }}>
              <Typography variant="h5" fontWeight="900" color="#1b2559" sx={{ mb: 1 }}>
                Select Products for Spotlight
              </Typography>
              <Typography variant="body2" color="#707eae" fontWeight="600" sx={{ mb: 4 }}>
                Pick store catalog products to highlight in the spotlight section.
              </Typography>

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

              <List sx={{ maxHeight: "400px", overflowY: "auto", border: "1px solid #f0f4f8", borderRadius: "16px" }}>
                {filteredAvailableProducts.length === 0 ? (
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="#a3aed0" fontWeight="700">
                          No available products found.
                        </Typography>
                      }
                    />
                  </ListItem>
                ) : (
                  filteredAvailableProducts.map((product) => (
                    <ListItem
                      key={product.id}
                      secondaryAction={
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleAdd(product)}
                          sx={{ borderRadius: "10px", bgcolor: alpha("#E53935", 0.08), color: "#E53935", fontWeight: 800, textTransform: "none", filter: "none", boxShadow: "none", "&:hover": { bgcolor: "#E53935", color: "#fff" } }}
                        >
                          Add
                        </Button>
                      }
                      divider
                    >
                      <ListItemIcon>
                        <InventoryIcon sx={{ color: "#a3aed0" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight="800" color="#1b2559">
                            {product.name}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, borderRadius: "28px", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", height: "100%" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                  <Typography variant="h5" fontWeight="900" color="#1b2559" sx={{ mb: 1 }}>
                    Selected Products
                  </Typography>
                  <Typography variant="body2" color="#707eae" fontWeight="600">
                    Currently featured in spotlight.
                  </Typography>
                </Box>
                <Chip label={`${selectedProducts.length} Selected`} color="primary" sx={{ fontWeight: 800, borderRadius: "10px", bgcolor: "#E53935" }} />
              </Stack>

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
                        <TableCell colSpan={2} align="center" sx={{ py: 8 }}>
                          <Stack alignItems="center" spacing={1}>
                            <StarIcon sx={{ color: "#d1d9e2", fontSize: 40 }} />
                            <Typography variant="body1" color="#a3aed0" fontWeight="700">
                              No data found
                            </Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ) : (
                      selectedProducts.map((row) => (
                        <TableRow key={row.id} hover>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                              <CheckCircleIcon sx={{ color: "#05cd99", fontSize: 18 }} />
                              <Typography variant="body1" fontWeight="800" color="#1b2559">
                                {row.name}
                              </Typography>
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
                onClick={handleSave}
                disabled={saving}
                sx={{ mt: 4, py: 2, borderRadius: "18px", bgcolor: "#E53935", fontWeight: 900, fontSize: "16px", boxShadow: "0 10px 25px rgba(229, 57, 53,0.2)" }}
              >
                {saving ? "Saving..." : "Save Spotlight Selection"}
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
          onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: "12px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StoreAddSpotlight;

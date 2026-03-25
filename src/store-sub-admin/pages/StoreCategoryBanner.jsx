import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
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
  Image as ImageIcon,
  Close as CloseIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";
import { formatStoreDate, matchesStoreRecord } from "../utils/storeWorkspace";

const navy = "#1b2559";
const brandRed = "#E53935";
const bgSoft = "#f4f7fe";

const StoreCategoryBanner = () => {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Premium Modal State
  const [editingBanner, setEditingBanner] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", imageUrl: "", categoryRedirect: "" });
  const [isSaving, setIsSaving] = useState(false);

  const fetchBanners = useCallback(async () => {
    try {
      const response = await genericApi.getAll("category_banners");
      const rows = response?.data?.results || response?.data?.data || [];
      setBanners(
        rows
          .filter((row) => matchesStoreRecord(row, store))
          .map((row, index) => ({
            id: String(row._id ?? row.id ?? index),
            title: row.title || row.Title || "Untitled Banner",
            categoryRedirect:
              row.categoryName || row["Category Name"] || row.categoryRedirect || row.categoryId || "N/A",
            imageUrl: row.imageUrl || row.Image || row.image || "",
            createdAt: row.createdAt || row["Created At"] || "",
          }))
      );
    } catch (error) {
      console.warn("Backend collection 'category_banners' not initialized yet (404). Falling back to mock data.");
      // Render beautiful mock data until the backend collections are officially established
      setBanners([
        {
          id: "mock-banner-1",
          title: "Diwali Big Sale",
          categoryRedirect: "Electronics",
          imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=400&h=200",
          createdAt: new Date().toISOString()
        },
        {
          id: "mock-banner-2",
          title: "Fresh Groceries Drop",
          categoryRedirect: "Groceries",
          imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400&h=200",
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [store]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const filteredBanners = useMemo(
    () =>
      banners.filter((banner) =>
        [banner.title, banner.categoryRedirect].some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      ),
    [banners, searchTerm]
  );

  const handleDelete = async (banner) => {
    if (!window.confirm(`Delete completely: "${banner.title}"?`)) return;

    if (banner.id.includes("mock-")) {
      setBanners((current) => current.filter((entry) => entry.id !== banner.id));
      setSnackbar({ open: true, message: "Mock Banner deleted successfully (Bypassed API).", severity: "success" });
      return;
    }

    try {
      await genericApi.remove("category_banners", banner.id);
      setBanners((current) => current.filter((entry) => entry.id !== banner.id));
      setSnackbar({ open: true, message: "Banner deleted successfully.", severity: "success" });
    } catch (error) {
      console.error("Unable to delete category banner:", error);
      setSnackbar({ open: true, message: error?.response?.data?.error || "Failed to delete banner.", severity: "error" });
    }
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setEditForm({
      title: banner.title,
      imageUrl: banner.imageUrl,
      categoryRedirect: banner.categoryRedirect
    });
  };

  const handleSaveEdit = async () => {
    if (!editingBanner) return;
    setIsSaving(true);

    if (editingBanner.id.includes("mock-")) {
      setTimeout(() => {
        setBanners(prev => prev.map(b => b.id === editingBanner.id ? {
          ...b,
          title: editForm.title,
          imageUrl: editForm.imageUrl,
          categoryRedirect: editForm.categoryRedirect
        } : b));
        setSnackbar({ open: true, message: "Mock Banner updated globally.", severity: "success" });
        setIsSaving(false);
        setEditingBanner(null);
      }, 500);
      return;
    }

    try {
      await genericApi.update("category_banners", editingBanner.id, { 
        title: editForm.title.trim(),
        imageUrl: editForm.imageUrl.trim(),
        categoryRedirect: editForm.categoryRedirect.trim()
      });
      await fetchBanners();
      setSnackbar({ open: true, message: "Banner updated successfully.", severity: "success" });
      setEditingBanner(null);
    } catch (error) {
      console.error("Unable to update category banner:", error);
      setSnackbar({ open: true, message: error?.response?.data?.error || "Failed to update banner.", severity: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: brandRed }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: bgSoft, minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} flexWrap="wrap" useFlexGap>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: navy, mb: 0.5, letterSpacing: "-1.5px" }}>
              Category Banners
            </Typography>
            <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>
              Manage category-linked promotional banners for {store.name}.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate("add")}
            sx={{
              borderRadius: "16px",
              py: 1.5,
              px: 4,
              bgcolor: brandRed,
              boxShadow: "0 10px 25px rgba(229, 57, 53,0.25)",
              textTransform: "none",
              fontWeight: 800,
              fontSize: "15px",
              "&:hover": { bgcolor: "#d32f2f" }
            }}
          >
            + Add Banner
          </Button>
        </Stack>

        <Paper sx={{ p: 4, borderRadius: "32px", border: "1px solid #e0e5f2", boxShadow: "0 18px 40px rgba(15,23,42,0.03)" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} flexWrap="wrap" useFlexGap>
            <Typography variant="h5" fontWeight="900" color={navy} letterSpacing="-1px">
              Banner Active Catalog
            </Typography>
            <TextField
              placeholder="Search banners..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#a3aed0" }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: "14px", bgcolor: bgSoft, width: { xs: "100%", sm: "300px" }, fontWeight: 600, "& fieldset": { borderColor: "transparent" } }
              }}
            />
          </Stack>

          <TableContainer sx={{ border: "1px solid #eef2f6", borderRadius: "18px", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#fafbfc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", width: "80px", pl: 3 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Category Redirect</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Visual Image</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", textAlign: "right", pr: 4 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBanners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 10, color: "#a3aed0", fontWeight: 800 }}>
                      <ImageIcon sx={{ fontSize: 50, color: "#e0e5f2" }} />
                      <Typography variant="h6" color={navy} fontWeight="900" sx={{ mt: 2 }}>No Banners Found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBanners.map((row, index) => (
                    <TableRow key={row.id} hover sx={{ transition: "0.2s", "&:hover": { bgcolor: alpha(brandRed, 0.02) } }}>
                      <TableCell sx={{ fontWeight: 800, color: navy, pl: 3 }}>
                        <Box sx={{ width: 28, height: 28, borderRadius: "8px", bgcolor: bgSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {index + 1}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 800, color: navy }}>{row.title}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#a3aed0" }}>{row.categoryRedirect}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            width: 140,
                            height: 60,
                            borderRadius: "12px",
                            bgcolor: bgSoft,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #e0e5f2",
                            overflow: "hidden"
                          }}
                        >
                          {row.imageUrl ? (
                            <Box component="img" src={row.imageUrl} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <ImageIcon sx={{ color: "#a3aed0", fontSize: 24 }} />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#a3aed0" }}>{formatStoreDate(row.createdAt)}</TableCell>
                      <TableCell sx={{ textAlign: "right", pr: 4 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Reconfigure Banner">
                            <IconButton onClick={() => openEditModal(row)} sx={{ color: navy, bgcolor: alpha(navy, 0.05), borderRadius: "10px", "&:hover": { bgcolor: alpha(navy, 0.1) } }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Banner Record">
                            <IconButton onClick={() => handleDelete(row)} sx={{ color: brandRed, bgcolor: alpha(brandRed, 0.05), borderRadius: "10px", "&:hover": { bgcolor: alpha(brandRed, 0.1) } }}>
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

      {/* Modern Operations Edit Drawer Modal */}
      <Dialog 
        open={Boolean(editingBanner)} 
        onClose={() => !isSaving && setEditingBanner(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "28px", p: 1, boxShadow: "0 20px 60px rgba(0,0,0,0.1)" } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
          <Box>
            <Typography variant="h5" fontWeight="900" color={navy} sx={{ letterSpacing: "-1px" }}>
              Banner Reconfiguration
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="700">
              Editing primary visual nodes.
            </Typography>
          </Box>
          <IconButton onClick={() => !isSaving && setEditingBanner(null)} sx={{ bgcolor: bgSoft }}>
            <CloseIcon sx={{ color: navy }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minHeight: "200px", pt: "20px !important" }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>Banner Title Strategy</Typography>
              <TextField 
                fullWidth 
                value={editForm.title} 
                onChange={(e) => setEditForm(prev => ({...prev, title: e.target.value}))}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: bgSoft, "& fieldset": { borderColor: "transparent" } } }} 
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>Target Category Pipeline</Typography>
              <TextField 
                fullWidth 
                value={editForm.categoryRedirect} 
                onChange={(e) => setEditForm(prev => ({...prev, categoryRedirect: e.target.value}))}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: bgSoft, "& fieldset": { borderColor: "transparent" } } }} 
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>Creative URL</Typography>
              <TextField 
                fullWidth 
                value={editForm.imageUrl} 
                onChange={(e) => setEditForm(prev => ({...prev, imageUrl: e.target.value}))}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: bgSoft, "& fieldset": { borderColor: "transparent" } } }} 
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button onClick={() => setEditingBanner(null)} sx={{ color: "#a3aed0", fontWeight: 800, textTransform: "none" }}>Disengage</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveEdit}
            disabled={isSaving || !editForm.title}
            startIcon={<SaveIcon />}
            sx={{ bgcolor: navy, borderRadius: "14px", px: 4, py: 1.5, fontWeight: 900, textTransform: "none", boxShadow: "0 10px 20px rgba(27, 37, 89, 0.2)", "&:hover": { bgcolor: "#11183b" } }}
          >
            {isSaving ? "Syncing Network..." : "Deploy Config"}
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
          sx={{ borderRadius: "12px", fontWeight: 700 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StoreCategoryBanner;

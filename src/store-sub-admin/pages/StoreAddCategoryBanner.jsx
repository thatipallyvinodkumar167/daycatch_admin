import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  Select,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  PhotoCamera as PhotoCameraIcon,
  Close as CloseIcon,
  Image as ImageIcon
} from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const StoreAddCategoryBanner = () => {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    categoryId: ""
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await genericApi.getAll("parentcategories");
        const rows = response?.data?.results || [];
        setCategories(
          rows.map((category) => ({
            id: String(category._id ?? category.id ?? ""),
            name: category.Title || category.Category || "Untitled Category"
          }))
        );
      } catch (err) {
        console.error("Categories Error:", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1000 * 1024) {
      setSnackbar({ open: true, message: "Image size must be less than 1MB", severity: "error" });
      e.target.value = "";
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.categoryId || !imageFile) {
      setSnackbar({ open: true, message: "Title, Category, and Image are required", severity: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCategory = categories.find((category) => category.id === formData.categoryId);
      await genericApi.create("category_banners", {
        storeId: store.id,
        Store: store.name,
        title: formData.title,
        categoryId: formData.categoryId,
        categoryName: selectedCategory?.name || "",
        imageUrl: imagePreview || null,
        status: "Active",
        createdAt: new Date().toISOString(),
      });
      setSnackbar({ open: true, message: "Banner added successfully!", severity: "success" });
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error("Error creating banner:", error);
      setSnackbar({ open: true, message: "Failed to add banner", severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1000px", mx: "auto" }}>
        
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: "#fff", color: "#E53935", boxShadow: "0 6px 18px rgba(15,23,42,0.06)", "&:hover": { bgcolor: "#f4f7fe" } }}>
             <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Box>
            <Typography variant="h3" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1.5px" }}>
              Add Category Banner
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
               Promote a category for {store.name}
            </Typography>
          </Box>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Left Column: Form Details */}
            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 4.5, borderRadius: "28px", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}>
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>Banner Title</Typography>
                    <TextField
                      fullWidth
                      name="title"
                      placeholder="Insert the name of the banner"
                      value={formData.title}
                      onChange={handleChange}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>Select Category</Typography>
                    <FormControl fullWidth>
                      <Select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        displayEmpty
                        sx={{ borderRadius: "16px", bgcolor: "#fafbfc" }}
                      >
                        <MenuItem value="" disabled>Select Category</MenuItem>
                        {categories.map((cat) => (
                           <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>Banner Image</Typography>
                    <Box
                      sx={{
                        border: "2px dashed #e0e5f2",
                        borderRadius: "20px",
                        p: 3,
                        textAlign: "center",
                        bgcolor: "#fafbfc",
                        cursor: "pointer",
                        "&:hover": { borderColor: "#E53935", bgcolor: "rgba(229, 57, 53, 0.02)" },
                        transition: "0.2s"
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {!imagePreview ? (
                        <Stack spacing={1} alignItems="center" sx={{ py: 3 }}>
                          <PhotoCameraIcon sx={{ color: "#a3aed0", fontSize: 48 }} />
                          <Typography variant="body1" fontWeight="700" color="#707eae">Click to upload banner</Typography>
                          <Typography variant="caption" color="#a3aed0">PNG, JPG, JPEG • Recommended 1200x400</Typography>
                        </Stack>
                      ) : (
                        <Box sx={{ position: "relative" }}>
                          <Box component="img" src={imagePreview} sx={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "16px" }} />
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); removeImage(); }} sx={{ position: "absolute", top: -12, right: -12, bgcolor: "#ff4d49", color: "#fff", "&:hover": { bgcolor: "#d32f2f" } }}>
                            <CloseIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Box>
                      )}
                      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
                    </Box>
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{
                      py: 2.2,
                      borderRadius: "20px",
                      bgcolor: "#E53935",
                      fontWeight: 900,
                      textTransform: "none",
                      fontSize: "17px",
                      boxShadow: "0 14px 28px rgba(229, 57, 53,0.22)",
                      "&:hover": { bgcolor: "#d32f2f" }
                    }}
                  >
                    {isSubmitting ? "Saving Banner..." : "Save Category Banner"}
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            {/* Right Column: Dynamic Preview */}
            <Grid item xs={12} md={5}>
               <Box sx={{ position: "sticky", top: 20 }}>
                  <Typography variant="h6" fontWeight="800" color="#1b2559" sx={{ mb: 3, px: 1 }}>Live App Preview</Typography>
                  <Paper sx={{ p: 4, borderRadius: "32px", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", background: "#fff" }}>
                     <Box sx={{ borderRadius: "20px", overflow: "hidden", border: "1px solid #f0f0f0", position: "relative" }}>
                        {imagePreview ? (
                           <Box component="img" src={imagePreview} sx={{ width: "100%", aspectRatio: "2/1", objectFit: "cover" }} />
                        ) : (
                           <Box sx={{ width: "100%", aspectRatio: "2/1", bgcolor: "#f8f9fc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <ImageIcon sx={{ color: "#d1d9e2", fontSize: 60 }} />
                           </Box>
                        )}
                        <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: 2, background: "linear-gradient(transparent, rgba(0,0,0,0.7))", color: "#fff" }}>
                           <Typography variant="body1" fontWeight="900" sx={{ letterSpacing: "-0.5px" }}>{formData.title || "Banner Headline"}</Typography>
                           <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 700 }}>Redirect: {categories.find(c => c.id === formData.categoryId)?.name || "Select Category"}</Typography>
                        </Box>
                     </Box>
                     <Typography variant="body2" sx={{ mt: 3, color: "#a3aed0", textAlign: "center", fontStyle: "italic", fontWeight: 600 }}>
                        &ldquo;Elevate your store visibility with high-impact category promotions.&rdquo;
                     </Typography>
                  </Paper>
               </Box>
            </Grid>
          </Grid>
        </form>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: "14px", fontWeight: "700" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StoreAddCategoryBanner;

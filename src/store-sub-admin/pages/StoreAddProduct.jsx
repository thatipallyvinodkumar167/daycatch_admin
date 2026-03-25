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
  Select,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  AddPhotoAlternateOutlined as AddPhotoIcon,
  PhotoCamera as PhotoCameraIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const StoreAddProduct = () => {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const mainImageRef = useRef(null);
  const galleryImagesRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [mainImage, setMainImage] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [formData, setFormData] = useState({
    category: "",
    type: "",
    name: "",
    quantity: "",
    unit: "KG",
    eanCode: "",
    mrp: "",
    price: "",
    tags: "",
    description: ""
  });

  const orderPanelSx = {
    borderRadius: "24px",
    border: "1px solid #e0e5f2",
    bgcolor: "#fff",
    boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
  };

  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        const [categoryResponse, subcategoryResponse] = await Promise.all([
          genericApi.getAll("parentcategories"),
          genericApi.getAll("subcategories")
        ]);

        setCategories(
          (categoryResponse?.data?.results || []).map((category) => ({
            id: String(category._id ?? category.id ?? ""),
            name: category.Title || category.Category || "Untitled Category"
          }))
        );

        setSubcategories(
          (subcategoryResponse?.data?.results || []).map((subcategory) => ({
            id: String(subcategory._id ?? subcategory.id ?? ""),
            name: subcategory.Title || "Untitled Subcategory",
            parentCategory: subcategory["Parent Category"] || ""
          }))
        );
      } catch (err) {
        console.error(err);
        setCategories([]);
        setSubcategories([]);
      }
    };
    fetchLookupData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
      ...(name === "category" ? { type: "" } : {})
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1000 * 1024) {
      setSnackbar({ open: true, message: "Main image must be less than 1MB", severity: "error" });
      e.target.value = "";
      return;
    }
    setMainImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setMainPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(f => f.size <= 1000 * 1024);
    
    if (validFiles.length < files.length) {
      setSnackbar({ open: true, message: "Some images were omitted (must be < 1MB)", severity: "warning" });
    }

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index) => {
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !mainImage) {
      setSnackbar({ open: true, message: "Name, Price, and Main Image are required", severity: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      await genericApi.create("storeProducts", {
        storeId: store.id,
        "Product Id": formData.eanCode || `STORE-${Date.now()}`,
        "Product Name": formData.name,
        Category: formData.category,
        Type: formData.type,
        Price: Number(formData.price) || 0,
        MRP: Number(formData.mrp) || 0,
        stock: Number(formData.quantity) || 0,
        "Order Quantity": 1,
        Store: store.name,
        Image: mainImage?.name || "",
        status: "Pending",
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        Unit: formData.unit,
        Tags: formData.tags,
        description: formData.description,
        galleryCount: galleryPreviews.length
      });
      setSnackbar({ open: true, message: "Product added successfully!", severity: "success" });
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: "Failed to add product", severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableTypes = subcategories.filter(
    (subcategory) => !formData.category || subcategory.parentCategory === formData.category
  );

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        
        <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: "#fff", color: "#1b2559", border: "1px solid #e0e5f2", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", "&:hover": { bgcolor: "#f4f7fe" } }}>
               <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#1b2559", mb: 0.5, letterSpacing: "-1.5px" }}>
                Add Product
              </Typography>
              <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>
                 Catalog expansion for {store.name}.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Left: Product Details */}
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 4, ...orderPanelSx }}>
                <Stack spacing={4}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block" }}>Category</Typography>
                      <Select fullWidth name="category" value={formData.category} onChange={handleChange} displayEmpty sx={{ borderRadius: "16px", bgcolor: "#fafbfc" }}>
                        <MenuItem value="" disabled>Select Category</MenuItem>
                        {categories.map(c => <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>)}
                      </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block" }}>Type</Typography>
                      <Select fullWidth name="type" value={formData.type} onChange={handleChange} displayEmpty sx={{ borderRadius: "16px", bgcolor: "#fafbfc" }}>
                        <MenuItem value="" disabled>Select Type</MenuItem>
                        {availableTypes.map((type) => (
                          <MenuItem key={type.id} value={type.name}>
                            {type.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block" }}>Product Name</Typography>
                      <TextField fullWidth name="name" placeholder="Insert product name" value={formData.name} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }} />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block" }}>Quantity</Typography>
                      <TextField fullWidth name="quantity" type="number" placeholder="0" value={formData.quantity} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }} />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block" }}>Unit</Typography>
                      <Select fullWidth name="unit" value={formData.unit} onChange={handleChange} sx={{ borderRadius: "16px", bgcolor: "#fafbfc" }}>
                        <MenuItem value="G">G</MenuItem>
                        <MenuItem value="KG">KG</MenuItem>
                        <MenuItem value="Ltrs">Ltrs</MenuItem>
                        <MenuItem value="Ml">Ml</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block" }}>EAN Code</Typography>
                      <TextField fullWidth name="eanCode" placeholder="Scan or enter code" value={formData.eanCode} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>MRP (Rs.)</Typography>
                      <TextField fullWidth name="mrp" placeholder="Maximum Retail Price" value={formData.mrp} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>Sale Price (Rs.)</Typography>
                      <TextField fullWidth name="price" placeholder="Discounted Price" value={formData.price} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }} />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>Tags</Typography>
                      <TextField fullWidth name="tags" placeholder="Separate with commas (e.g. fresh, organic)" value={formData.tags} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }} />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>Description</Typography>
                      <TextField fullWidth multiline rows={4} name="description" placeholder="Short product story..." value={formData.description} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }} />
                    </Grid>
                  </Grid>
                </Stack>
              </Paper>
            </Grid>

            {/* Right: Media & Submit */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={3}>
                <Paper sx={{ p: 4, ...orderPanelSx }}>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 2, display: "block" }}>Main Image</Typography>
                  <Box sx={{ border: "2px dashed #e0e5f2", borderRadius: "16px", textAlign: "center", bgcolor: "#fafbff", cursor: "pointer", p: mainPreview ? 0 : 3 }} onClick={() => mainImageRef.current.click()}>
                    {!mainPreview ? (
                      <Stack spacing={1} alignItems="center">
                        <PhotoCameraIcon sx={{ color: "#a3aed0", fontSize: 40 }} />
                        <Typography variant="caption" color="#a3aed0">Less than 1000 KB</Typography>
                      </Stack>
                    ) : (
                      <Box sx={{ position: "relative" }}>
                        <Box component="img" src={mainPreview} sx={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "16px" }} />
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); setMainPreview(null); }} sx={{ position: "absolute", top: 8, right: 8, bgcolor: "#E53935", color: "#fff" }}>
                          <CloseIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    )}
                    <input type="file" ref={mainImageRef} hidden accept="image/*" onChange={handleMainImageChange} />
                  </Box>

                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mt: 4, mb: 2, display: "block" }}>Gallery Images</Typography>
                  <Grid container spacing={1.5}>
                    {galleryPreviews.map((img, i) => (
                      <Grid item xs={4} key={i}>
                        <Box sx={{ position: "relative" }}>
                          <Box component="img" src={img} sx={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: "12px", border: "1px solid #e0e5f2" }} />
                          <IconButton size="small" onClick={() => removeGalleryImage(i)} sx={{ position: "absolute", top: -5, right: -5, p: 0.5, bgcolor: "#E53935", color: "#fff", "&:hover": { bgcolor: "#d32f2f" } }}>
                            <CloseIcon sx={{ fontSize: 10 }} />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}
                    <Grid item xs={4}>
                      <Box sx={{ width: "100%", aspectRatio: "1/1", border: "2px dashed #e0e5f2", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", bgcolor: "#fafbff" }} onClick={() => galleryImagesRef.current.click()}>
                        <AddPhotoIcon sx={{ color: "#a3aed0" }} />
                      </Box>
                    </Grid>
                  </Grid>
                  <input type="file" multiple ref={galleryImagesRef} hidden accept="image/*" onChange={handleGalleryChange} />
                </Paper>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{ py: 2.2, borderRadius: "12px", bgcolor: "#1b2559", fontWeight: 800, textTransform: "none", fontSize: "17px", boxShadow: "0 10px 20px rgba(27, 37, 89, 0.2)", "&:hover": { bgcolor: "#111c44" } }}
                >
                  {isSubmitting ? "Disseminating..." : "Deploy Product"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: "14px", fontWeight: "700" }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default StoreAddProduct;

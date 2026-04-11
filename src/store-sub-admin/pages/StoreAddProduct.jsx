import React, { useState, useRef, useEffect, useCallback } from "react";
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
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  PhotoCamera as PhotoCameraIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const StoreAddProduct = ({ isEdit = false }) => {
  const { store } = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const mainImageRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [mainImage, setMainImage] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
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

  const navy = "#1b2559";
  const red = "#E53935";

  const fetchLookupData = useCallback(async () => {
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
      console.error("Error fetching lookups:", err);
    }
  }, []);

  const fetchProductData = useCallback(async () => {
    if (!id || !isEdit) return;
    try {
      setLoading(true);
      const response = await genericApi.getOne("store_products", id);
      const data = response.data?.data || response.data?.results || response.data;
      
      if (data) {
        setFormData({
          category: data.Category || "",
          type: data.Type || "",
          name: data["Product Name"] || data.name || "",
          quantity: data.stock || 0,
          unit: data.Unit || "KG",
          eanCode: data["Product Id"] || "",
          mrp: data.MRP || 0,
          price: data.Price || 0,
          tags: data.Tags || "",
          description: data.description || ""
        });
        setMainPreview(data.Image || data.image || "");
      }
    } catch (err) {
      console.error("Error fetching product profile:", err);
      setSnackbar({ open: true, message: "Identification of product failed.", severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [id, isEdit]);

  useEffect(() => {
    fetchLookupData();
    if (isEdit) fetchProductData();
  }, [fetchLookupData, fetchProductData, isEdit]);

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
    setMainImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setMainPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || (!mainPreview && !mainImage)) {
      setSnackbar({ open: true, message: "Critical fields required (Name, Price, Image)", severity: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        storeId: store?.id,
        "Product Id": formData.eanCode || `STORE-${Date.now()}`,
        "Product Name": formData.name,
        Category: formData.category,
        Type: formData.type,
        Price: Number(formData.price) || 0,
        MRP: Number(formData.mrp) || 0,
        stock: Number(formData.quantity) || 0,
        Unit: formData.unit,
        Tags: formData.tags,
        description: formData.description,
        Image: mainPreview || "",
        updatedAt: new Date().toISOString()
      };

      if (isEdit && id) {
        await genericApi.update("store_products", id, payload);
        setSnackbar({ open: true, message: "Product profile updated successfully.", severity: "success" });
      } else {
        await genericApi.create("store_products", { ...payload, status: "Pending", submittedAt: new Date().toISOString() });
        setSnackbar({ open: true, message: "New product deployed to catalog.", severity: "success" });
      }
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error("Transmission Error:", error);
      setSnackbar({ open: true, message: "Sync failed. Check connection.", severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableTypes = subcategories.filter(
    (subcategory) => !formData.category || subcategory.parentCategory === formData.category
  );

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <CircularProgress sx={{ color: red }} />
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        
        <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: "#fff", color: navy, border: "1px solid #e0e5f2", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
               <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: navy, mb: 0.5, letterSpacing: "-1.5px" }}>
                {isEdit ? "Modify Product" : "Expand Catalog"}
              </Typography>
              <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>
                 Identity & Resource Management for {store?.name || "Workspace"}.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 4, borderRadius: "24px", border: "1px solid #e0e5f2", bgcolor: "#fff", boxShadow: "0 20px 50px rgba(0,0,0,0.05)" }}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight="900" color="#a3aed0" sx={{ mb: 1.5, display: "block" }}>PRODUCT IDENTITY</Typography>
                    <TextField fullWidth name="name" placeholder="Item sequence name" value={formData.name} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight="900" color="#a3aed0" sx={{ mb: 1.5, display: "block" }}>IDENTIFIER (EAN/CODE)</Typography>
                    <TextField fullWidth name="eanCode" placeholder="Scan result" value={formData.eanCode} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }} />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight="900" color="#a3aed0" sx={{ mb: 1.5, display: "block" }}>PRIMARY CATEGORY</Typography>
                    <Select fullWidth name="category" value={formData.category} onChange={handleChange} displayEmpty sx={{ borderRadius: "16px", bgcolor: "#fafbfc" }}>
                      <MenuItem value="" disabled>Select Segment</MenuItem>
                      {categories.map(c => <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>)}
                    </Select>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" fontWeight="900" color="#a3aed0" sx={{ mb: 1.5, display: "block" }}>SUB-TYPE SEGMENT</Typography>
                    <Select fullWidth name="type" value={formData.type} onChange={handleChange} displayEmpty sx={{ borderRadius: "16px", bgcolor: "#fafbfc" }}>
                      <MenuItem value="" disabled>Select Sub-Type</MenuItem>
                      {availableTypes.map((type) => <MenuItem key={type.id} value={type.name}>{type.name}</MenuItem>)}
                    </Select>
                  </Grid>

                  <Grid item xs={6} sm={4}>
                    <Typography variant="caption" fontWeight="900" color="#a3aed0" sx={{ mb: 1.5, display: "block" }}>STOCK QUANTITY</Typography>
                    <TextField fullWidth name="quantity" type="number" placeholder="0" value={formData.quantity} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }} />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="caption" fontWeight="900" color="#a3aed0" sx={{ mb: 1.5, display: "block" }}>LOGISTICS UNIT</Typography>
                    <Select fullWidth name="unit" value={formData.unit} onChange={handleChange} sx={{ borderRadius: "16px", bgcolor: "#fafbfc" }}>
                      {["G", "KG", "Ltrs", "Ml", "Packet", "Box"].map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                    </Select>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" fontWeight="900" color="#a3aed0" sx={{ mb: 1.5, display: "block" }}>PRICING MRP (INR)</Typography>
                    <TextField fullWidth name="mrp" placeholder="0.00" value={formData.mrp} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" fontWeight="900" color={navy} sx={{ mb: 1 }}>Fulfillment Price (Rs.)</Typography>
                    <TextField fullWidth name="price" placeholder="Target price" value={formData.price} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", border: "2px solid #eef2f6" } }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" fontWeight="900" color={navy} sx={{ mb: 1 }}>Profile Description</Typography>
                    <TextField fullWidth multiline rows={4} name="description" placeholder="Technical specifications or story..." value={formData.description} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }} />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Stack spacing={4}>
                <Paper sx={{ p: 4, borderRadius: "24px", border: "1px solid #e0e5f2", bgcolor: "#fff", boxShadow: "0 20px 50px rgba(0,0,0,0.05)" }}>
                  <Typography variant="subtitle2" fontWeight="900" color={navy} sx={{ mb: 3 }}>Resource Assets</Typography>
                  <Box sx={{ border: "2px dashed #e0e5f2", borderRadius: "20px", textAlign: "center", bgcolor: "#fafbfc", cursor: "pointer", p: mainPreview ? 0 : 5 }} onClick={() => mainImageRef.current.click()}>
                    {!mainPreview ? (
                      <Stack spacing={1.5} alignItems="center">
                        <PhotoCameraIcon sx={{ color: "#a3aed0", fontSize: 48 }} />
                        <Typography variant="caption" fontWeight="800" color="#a3aed0">UPLOAD PRIMARY IMAGE</Typography>
                      </Stack>
                    ) : (
                      <Box sx={{ position: "relative" }}>
                        <Box component="img" src={mainPreview} sx={{ width: "100%", height: "240px", objectFit: "cover", borderRadius: "18px" }} />
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); setMainPreview(null); }} sx={{ position: "absolute", top: 12, right: 12, bgcolor: red, color: "#fff", "&:hover": { bgcolor: "#d32f2f" } }}>
                          <CloseIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    )}
                    <input type="file" ref={mainImageRef} hidden accept="image/*" onChange={handleMainImageChange} />
                  </Box>
                </Paper>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{ py: 2.5, borderRadius: "16px", bgcolor: navy, fontWeight: 900, textTransform: "none", fontSize: "18px", boxShadow: "0 10px 30px rgba(27, 37, 89, 0.3)", "&:hover": { bgcolor: "#111c44" } }}
                >
                  {isSubmitting ? "Disseminating..." : isEdit ? "Sync Modifications" : "Deploy Product"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: "14px", fontWeight: "900" }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default StoreAddProduct;

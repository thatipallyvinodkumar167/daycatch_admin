import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Stack,
  MenuItem,
  Select,
  FormControl,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback } from "react";
import { getParentCategories, getSubCategories } from "../api/categoryApi";
import { getProduct, updateProduct } from "../api/productApi";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parentCats, setParentCats] = useState([]);
  const [subCats, setSubCats] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    productID: "",
    name: "",
    category: "",
    type: "",
    imagePreview: "",
    quantity: 0,
    ean: "",
    tags: "",
    unit: "",
    mrp: 0,
    price: 0,
    description: "",
  });

  const fetchInitialData = useCallback(async () => {
    try {
      const pRes = await getParentCategories();
      const pData = pRes.data?.results || pRes.data?.data || [];
      setParentCats(pData.map(c => c.name || c["Title"] || c["Category Name"]));

      const sRes = await getSubCategories();
      const sData = sRes.data?.results || sRes.data?.data || [];
      setSubCats(sData.map(s => ({
        name: s.name || s["Title"] || s["Sub Category Name"],
        parent: s.parentCategory || s["Parent Category"]
      })));
    } catch (error) {
       console.error("Error fetching categories:", error);
    }
  }, []);

  const fetchProductData = useCallback(async () => {
    try {
      const response = await getProduct(id);
      const p = response.data.data || response.data;
      setFormData({
        productID: p["Product Id"] || "",
        name: p["Product Name"] || "",
        category: p.Category || "",
        type: p.Type || "",
        imagePreview: p["Product Image"] || "",
        quantity: p.Quantity || 0,
        ean: p["EAN code"] || "",
        tags: p.Tags || "",
        unit: p.Unit || "",
        mrp: p.MRP || 0,
        price: p.price || 0,
        description: p.description || "",
      });
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchInitialData();
    if (id) fetchProductData();
  }, [id, fetchInitialData, fetchProductData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 1000 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imagePreview: reader.result }));
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert("Image must be less than 1000 KB");
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.category) {
      alert("Please fill name and category.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        "Product Id": formData.productID,
        "Product Name": formData.name,
        Category: formData.category,
        Type: formData.type,
        "Product Image": formData.imagePreview,
        Quantity: Number(formData.quantity),
        "EAN code": formData.ean,
        Tags: formData.tags,
        Unit: formData.unit,
        MRP: Number(formData.mrp),
        price: Number(formData.price),
        description: formData.description,
      };
      await updateProduct(id, payload);
      alert("Product updated successfully!");
      navigate("/products");
    } catch (error) {
      console.error("Error updating product:", error.response?.data || error.message);
      const detail = error.response?.data?.message || error.response?.data?.error?.message || error.message;
      alert(`Failed to update product: ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton onClick={() => navigate("/products")} sx={{ backgroundColor: "#fff", borderRadius: "10px" }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight="700" color="#2b3674">Edit Product</Typography>
          <Typography variant="body1" color="textSecondary">Modify product details and interlinked categories.</Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 4, borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        <Grid container spacing={3}>
           <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Product Name</Typography>
                <TextField fullWidth size="small" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Category (Parent)</Typography>
                <FormControl fullWidth size="small">
                  <Select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} sx={{ borderRadius: "10px" }}>
                    {parentCats.map(name => <MenuItem key={name} value={name}>{name}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Type / Sub-Category</Typography>
                <FormControl fullWidth size="small">
                  <Select 
                    displayEmpty
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    sx={{ borderRadius: "10px" }}
                  >
                    <MenuItem value="">Select Type / Sub-Category</MenuItem>
                    <MenuItem value="Regular">Regular</MenuItem>
                    <MenuItem value="In Season">In Season</MenuItem>
                    {subCats
                      .filter(s => !formData.category || (s.parent && s.parent.toLowerCase().trim() === formData.category.toLowerCase().trim()))
                      .map(s => (
                        <MenuItem key={s.name} value={s.name}>{s.name}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Price</Typography>
                <TextField fullWidth size="small" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
             <Stack spacing={2}>
              <Box>
                <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Product ID</Typography>
                <TextField fullWidth size="small" disabled value={formData.productID} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Product Image</Typography>
                <Box component="label" sx={{ 
                  display: "flex", alignItems: "center", gap: 1, p: 1, border: "1px dashed #d1d9e8", borderRadius: "10px", cursor: "pointer"
                }}>
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                  <Typography variant="body2" color="textSecondary" sx={{ flex: 1, overflow: "hidden" }}>
                    {formData.imagePreview ? "Change product image..." : "Choose product image..."}
                  </Typography>
                  <Button variant="contained" component="span" size="small" sx={{ borderRadius: "8px", textTransform: "none" }}>Browse</Button>
                </Box>
                {formData.imagePreview && (
                    <Box sx={{ mt: 1 }}>
                        <img src={formData.imagePreview} alt="Preview" style={{ width: 100, height: 100, borderRadius: 10, objectFit: "cover" }} />
                    </Box>
                )}
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>MRP</Typography>
                <TextField fullWidth size="small" type="number" value={formData.mrp} onChange={e => setFormData({...formData, mrp: e.target.value})} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Unit</Typography>
                <TextField fullWidth size="small" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12}>
              <Box>
                <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Description</Typography>
                <TextField fullWidth multiline rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
              </Box>
          </Grid>

          <Grid item xs={12}>
            <Button 
                variant="contained" 
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                disabled={loading}
                sx={{ 
                    backgroundColor: "#00d26a", 
                    "&:hover": { backgroundColor: "#00b85c" },
                    borderRadius: "12px", 
                    px: 6, py: 1.5, 
                    fontWeight: "700",
                    textTransform: "none"
                }}
            >
              {loading ? "Updating..." : "Update Product"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default EditProduct;

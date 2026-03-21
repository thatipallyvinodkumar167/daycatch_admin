import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Grid,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { genericApi } from "../api/genericApi";

const EditMembership = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    days: "",
    price: "",
    rewardPoint: "",
    freeDelivery: "No",
    instantDelivery: "No",
    image: null,
    existingImage: "",
    description: "",
  });

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await genericApi.get("membership", id);
        const data = response.data.data;
        setFormData({
          name: data?.name || "",
          days: data?.days || "",
          price: data?.price || "",
          rewardPoint: data?.rewardPoint || "",
          freeDelivery: data?.freeDelivery || "No",
          instantDelivery: data?.instantDelivery || "No",
          existingImage: data?.existingImage || data?.image || "",
          description: data?.description || "",
        });
      } catch (error) {
        console.error("Error fetching membership plan:", error);
      }
    };
    fetchPlan();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 1000 * 1024) {
      alert("Image size should be less than 1000 KB");
      return;
    }
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      delete payload.existingImage;
      if (payload.image && typeof payload.image !== 'string') {
        // In a real scenario, you'd upload the image first and get a URL
        // For now, we'll just send the file object if the API handles it, 
        // or omit it if it's just a mock-to-real transition.
      } else {
        delete payload.image;
      }

      await genericApi.update("membership", id, payload);
      alert("Membership updated successfully!");
      navigate("/membership-plain");
    } catch (error) {
      console.error("Error updating membership:", error);
      alert("Failed to update membership.");
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <Button
          onClick={() => navigate("/membership-plain")}
          startIcon={<ArrowBackIcon />}
          sx={{ color: "#2b3674", fontWeight: "700", textTransform: "none" }}
        >
          Back to List
        </Button>
      </Stack>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Edit Membership
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Here is your admin panel.
        </Typography>
      </Box>

      <Paper
        sx={{
          borderRadius: "20px",
          p: { xs: 3, md: 5 },
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 4 }}>
          Membership Details
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Plan Name & Plan Days */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1.5 }}>
                Plan Name
              </Typography>
              <TextField
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1.5 }}>
                Plan Days
              </Typography>
              <TextField
                fullWidth
                name="days"
                type="number"
                value={formData.days}
                onChange={handleInputChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>

            {/* Plan Price & Reward Point */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1.5 }}>
                Plan Price
              </Typography>
              <TextField
                fullWidth
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1.5 }}>
                Reward Point (keywords.like 2 for 2x ,3 for 3x etc)
              </Typography>
              <TextField
                fullWidth
                name="rewardPoint"
                value={formData.rewardPoint}
                onChange={handleInputChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>

            {/* Free Delivery & Instant Delivery */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1.5 }}>
                Free Delivery
              </Typography>
              <TextField
                select
                fullWidth
                name="freeDelivery"
                value={formData.freeDelivery}
                onChange={handleInputChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1.5 }}>
                Instant Delivery
              </Typography>
              <TextField
                select
                fullWidth
                name="instantDelivery"
                value={formData.instantDelivery}
                onChange={handleInputChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1.5 }}>
                Image (It Should Be Less Then 1000 KB)
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #E0E5F2",
                  borderRadius: "12px",
                  overflow: "hidden",
                  mb: (formData.image || formData.existingImage) ? 2 : 0
                }}
              >
                <Box sx={{ p: 2, flex: 1, color: "text.secondary" }}>
                  {formData.image ? formData.image.name : "Choose file"}
                </Box>
                <Button
                  component="label"
                  variant="contained"
                  sx={{
                    borderRadius: "0",
                    height: "56px",
                    px: 4,
                    backgroundColor: "#e9edf7",
                    color: "#2b3674",
                    boxShadow: "none",
                    borderLeft: "1px solid #E0E5F2",
                    "&:hover": { backgroundColor: "#d1d9e8", boxShadow: "none" },
                    textTransform: "none",
                    fontWeight: "600",
                  }}
                >
                  Browse
                  <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>
              </Box>
              {(formData.image || formData.existingImage) && (
                <Box sx={{ position: "relative", width: 100, height: 100, borderRadius: "12px", overflow: "hidden", border: "1px solid #E0E5F2" }}>
                  <img 
                    src={formData.image ? URL.createObjectURL(formData.image) : formData.existingImage} 
                    alt="Preview" 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                </Box>
              )}
            </Grid>

            {/* Description with Styles */}
            <Grid item xs={12}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1.5 }}>
                Description
              </Typography>
              <Box 
                sx={{ 
                  "& .quill": {
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid #E0E5F2",
                  },
                  "& .ql-toolbar": {
                    border: "none",
                    borderBottom: "1px solid #E0E5F2",
                    background: "#f8f9fa"
                  },
                  "& .ql-container": {
                    border: "none",
                    minHeight: "200px",
                    fontSize: "16px",
                    fontFamily: "inherit"
                  }
                }}
              >
                <ReactQuill 
                  theme="snow" 
                  value={formData.description} 
                  onChange={(content) => setFormData({ ...formData, description: content })}
                  placeholder="Enter benefits and details of this membership plan..."
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                      ['link', 'image'],
                      ['clean']
                    ],
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-start" sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    backgroundColor: "#2d60ff",
                    "&:hover": { backgroundColor: "#2046cc" },
                    borderRadius: "12px",
                    px: 6,
                    py: 1.5,
                    textTransform: "none",
                    fontWeight: "700",
                    boxShadow: "0 4px 12px rgba(45, 96, 255, 0.3)",
                  }}
                >
                  Update Membership
                </Button>
                <Button
                  onClick={() => navigate("/membership-plain")}
                  sx={{
                    color: "#475467",
                    fontWeight: "600",
                    textTransform: "none",
                    px: 4,
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default EditMembership;

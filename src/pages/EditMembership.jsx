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
    image: "", // Changed to string for URL
    description: "",
  });

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await genericApi.get("membership", id);
        const data = response.data.data;
        setFormData({
          name: data?.name || data?.["Plan Name"] || "",
          days: data?.days || data?.["Plan Days"] || "",
          price: data?.price || data?.["Plan Price"] || "",
          rewardPoint: data?.rewardPoint || data?.Reward || "",
          freeDelivery: (data?.freeDelivery ?? data?.["Free Delivery"]) ? "Yes" : "No",
          instantDelivery: (data?.instantDelivery ?? data?.["Instant Delivery"]) ? "Yes" : "No",
          image: data?.image || data?.Image || "",
          description: data?.description || data?.Description || "",
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
      const payload = {
        "Plan Name": formData.name,
        "Plan Days": Number(formData.days),
        "Plan Price": Number(formData.price),
        "Free Delivery": formData.freeDelivery === "Yes",
        "Instant Delivery": formData.instantDelivery === "Yes",
        Reward: Number(formData.rewardPoint),
        Image: formData.image,
        Description: formData.description
      };

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

            {/* Image URL */}
            <Grid item xs={12}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1.5 }}>
                Image URL (e.g. https://example.com/image.png)
              </Typography>
              <TextField
                fullWidth
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://..."
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
              {formData.image && (
                <Box sx={{ mt: 2, position: "relative", width: 100, height: 100, borderRadius: "12px", overflow: "hidden", border: "1px solid #E0E5F2" }}>
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    onError={(e) => { e.target.src = "https://via.placeholder.com/100?text=Invalid+URL"; }}
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

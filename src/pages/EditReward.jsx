import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { genericApi } from "../api/genericApi";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EditReward = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cartValue: "",
    rewardPoints: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await genericApi.getOne("rewards", id);
        const data = response.data.data || response.data;
        setFormData({
          cartValue: data?.["Cart Value"] || data?.cartValue || "",
          rewardPoints: data?.["Reward Points"] || data?.rewardPoints || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reward:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        "Cart Value": Number(formData.cartValue),
        "Reward Points": Number(formData.rewardPoints),
      };
      await genericApi.update("rewards", id, payload);
      alert("Reward points updated successfully!");
      navigate("/rewards-list");
    } catch (error) {
      console.error("Error updating reward:", error);
      alert("Failed to update reward points.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <Button onClick={() => navigate(-1)} sx={{ minWidth: "auto", color: "#2b3674" }}>
          <ArrowBackIcon />
        </Button>
        <Box>
          <Typography variant="h4" fontWeight="700" color="#2b3674">Edit Rewards Points</Typography>
          <Typography variant="body1" color="textSecondary">Modify the rewards points rule.</Typography>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: "15px", p: 4, maxWidth: "600px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="body1" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Cart Value</Typography>
              <TextField
                fullWidth
                name="cartValue"
                type="number"
                value={formData.cartValue}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" }, backgroundColor: "#fff" }}
              />
            </Box>
            
            <Box>
              <Typography variant="body1" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Reward Points</Typography>
              <TextField
                fullWidth
                name="rewardPoints"
                type="number"
                value={formData.rewardPoints}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" }, backgroundColor: "#fff" }}
              />
            </Box>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button 
                type="submit"
                variant="contained" 
                disabled={isSubmitting}
                sx={{ 
                  backgroundColor: "#2d60ff", 
                  "&:hover": { backgroundColor: "#2046cc" },
                  borderRadius: "10px",
                  textTransform: "none",
                  px: 4,
                  py: 1.5,
                  fontWeight: "700",
                  fontSize: "15px"
                }}
              >
                {isSubmitting ? "Updating..." : "Update Reward Points"}
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => navigate(-1)} 
                sx={{ 
                  borderRadius: "10px", 
                  textTransform: "none", 
                  px: 4,
                  borderColor: "#d1d5db",
                  color: "#475467" 
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default EditReward;

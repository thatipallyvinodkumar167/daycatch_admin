import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../api/genericApi";

const AddDeliveryBoyCallbackRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    deliveryBoyName: "",
    deliveryBoyPhone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.deliveryBoyName.trim() || !formData.deliveryBoyPhone.trim()) {
      alert("Please fill in the required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        "Delivery Boy Name": formData.deliveryBoyName.trim(),
        "Delivery Boy Phone": formData.deliveryBoyPhone.trim(),
        "Status": "Pending",
        "Date": new Date().toISOString()
      };
      await genericApi.create("deliveryboycallbackrequests", payload);
      alert("Delivery Boy callback request created successfully!");
      navigate("/delivery-boy-callback-request");
    } catch (error) {
      console.error("Error creating delivery boy callback request:", error);
      alert("Failed to create request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Page Heading */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Here is your admin panel.
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        {/* Card Header */}
        <Box 
          sx={{ 
            p: 3, 
            borderBottom: "1px solid #f1f1f1"
          }}
        >
          <Typography variant="h6" fontWeight="600" color="#1b2559">
            Create Delivery Boy Callback Request
          </Typography>
        </Box>

        <Box sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="body1" fontWeight="500" color="#1b2559" sx={{ mb: 1 }}>
                  Delivery Boy Name
                </Typography>
                <TextField
                  fullWidth
                  name="deliveryBoyName"
                  placeholder="Enter delivery boy name..."
                  variant="outlined"
                  value={formData.deliveryBoyName}
                  onChange={handleChange}
                  sx={{ 
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                    backgroundColor: "#fff"
                  }}
                />
              </Box>

              <Box>
                <Typography variant="body1" fontWeight="500" color="#1b2559" sx={{ mb: 1 }}>
                  Delivery Boy Phone
                </Typography>
                <TextField
                  fullWidth
                  name="deliveryBoyPhone"
                  placeholder="Enter delivery boy phone..."
                  variant="outlined"
                  value={formData.deliveryBoyPhone}
                  onChange={handleChange}
                  sx={{ 
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                    backgroundColor: "#fff"
                  }}
                />
              </Box>

              <Box>
                <Button 
                  type="submit"
                  variant="contained" 
                  disabled={isSubmitting}
                  sx={{ 
                    backgroundColor: "#2d60ff", 
                    "&:hover": { backgroundColor: "#2046cc" },
                    borderRadius: "8px",
                    textTransform: "none",
                    px: 4,
                    py: 1,
                    fontSize: "16px"
                  }}
                >
                  {isSubmitting ? "Creating..." : "Submit"}
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>

      </Paper>
    </Box>
  );
};

export default AddDeliveryBoyCallbackRequest;

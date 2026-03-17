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
import axios from "axios";

const AddCancellingReason = () => {
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert("Please enter a reason.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Mock POST request to fake API
      await axios.post("https://jsonplaceholder.typicode.com/todos", {
        title: reason.toUpperCase(),
        completed: false,
        userId: 1,
      });

      alert("Reason added successfully (Mock API)!");
      navigate("/cancelling-reasons");
    } catch (error) {
      console.error("Error adding reason:", error);
      alert("Failed to add reason.");
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
            Add Reason
          </Typography>
        </Box>

        <Box sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="body1" fontWeight="500" color="#1b2559" sx={{ mb: 1 }}>
                  Reason
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter reason here..."
                  variant="outlined"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
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
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>

       

      </Paper>
    </Box>
  );
};

export default AddCancellingReason;

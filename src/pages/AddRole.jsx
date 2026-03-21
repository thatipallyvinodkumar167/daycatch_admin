import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  Stack,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../api/genericApi";

const AddRole = () => {
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState({
    Dashboard: false,
    Category: false,
    Tax: false,
    Id: false,
    Membership: false,
    Reports: false,
    Notification: false,
    Users: false,
    Product: false,
    Area: false,
    Store: false,
    Orders: false,
    Payout: false,
    Rewards: false,
    "Delivery Boy": false,
    Pages: false,
    Feedback: false,
    Callback: false,
    Settings: false,
    "Cancelling Reasons": false,
  });

  const handleCheckboxChange = (event) => {
    setPermissions({
      ...permissions,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) {
      alert("Please enter a role name.");
      return;
    }
    
    try {
      const payload = {
        name: roleName.trim(),
        permissions: permissions
      };
      
      const response = await genericApi.create("roles", payload);
      console.log("Role created:", response.data);
      alert("Role added successfully!");
      navigate("/roles");
    } catch (error) {
      console.error("Error adding role:", error);
      const msg = error.response?.data?.message || error.message;
      alert("Failed to add role: " + msg);
    }
  };

  const permissionCategories = {
    "Core Management": ["Dashboard", "Users"],
    "Inventory & Sales": ["Category", "Product", "Orders"],
    "Operations": ["Store", "Delivery Boy", "Area"],
    "Financials": ["Tax", "Id", "Payout"],
    "Promotions": ["Rewards", "Membership"],
    "Communications": ["Notification"],
    "Support & Pages": ["Callback", "Feedback", "Pages"],
    "System Settings": ["Settings", "Cancelling Reasons"]
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Add New Role
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Create a new administrative role and define its access permissions.
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 6,
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          maxWidth: "1000px",
          mx: "auto",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 2 }}>
              Role Information
            </Typography>
            <TextField
              fullWidth
              label="Role Name"
              placeholder="e.g. Content Manager"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          </Box>

          <Divider sx={{ mb: 5 }} />

          <Box sx={{ mb: 5 }}>
            <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3, textAlign: "center" }}>
              Enable Sections
            </Typography>
            {Object.entries(permissionCategories).map(([category, keys]) => (
              <Box key={category} sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight="700" color="#2b3674" sx={{ mb: 2, borderBottom: "1px solid #e0e5f2", pb: 1 }}>
                  {category}
                </Typography>
                <Grid container spacing={2}>
                  {keys.map((section) => (
                    <Grid item xs={12} sm={6} md={3} key={section}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          borderRadius: "12px",
                          border: permissions[section] ? "2px solid #4318ff" : "1px solid #e0e5f2",
                          backgroundColor: permissions[section] ? "#f4f7fe" : "transparent",
                          transition: "all 0.2s",
                          "&:hover": {
                            backgroundColor: "#f4f7fe",
                          },
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={permissions[section]}
                              onChange={handleCheckboxChange}
                              name={section}
                              sx={{
                                color: "#d1d5db",
                                "&.Mui-checked": {
                                  color: "#4318ff",
                                },
                              }}
                            />
                          }
                          label={
                            <Typography
                              variant="body2"
                              fontWeight={permissions[section] ? "700" : "500"}
                              color={permissions[section] ? "#1b2559" : "#475467"}
                            >
                              {section}
                            </Typography>
                          }
                          sx={{ width: "100%", m: 0 }}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>

          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/roles")}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: "700",
                px: 4,
                borderColor: "#e0e5f2",
                color: "#1b2559",
              }}
            >
              Close
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: "700",
                px: 6,
                backgroundColor: "#4318ff",
                "&:hover": {
                    backgroundColor: "#3311cc"
                },
                boxShadow: "0 4px 12px rgba(67, 24, 255, 0.3)"
              }}
            >
              Submit
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default AddRole;

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Stack,
  IconButton,
  Chip,
  Tooltip,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";

const MembershipPlain = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      // Simulate API call using axios
      // In production, replace with: const response = await axios.get("https://api.daycatch.in/membership");
      // For now, we simulate the structure of an API response
      const apiResponse = {
        data: [
          {
            id: 1,
            name: "Monthly Starter",
            days: 30,
            price: 299,
            freeDelivery: true,
            instantDelivery: false,
            rewards: "2",
            description: "Perfect for regular household needs.",
            image: "5672200.png" // Filename from API
          },
          {
            id: 2,
            name: "Quarterly Pro",
            days: 90,
            price: 799,
            freeDelivery: true,
            instantDelivery: true,
            rewards: "3",
            description: "Our most popular value plan.",
            image: "2583344.png" // Filename from API
          },
          {
            id: 3,
            name: "Annual Elite",
            days: 365,
            price: 2499,
            freeDelivery: true,
            instantDelivery: true,
            rewards: "5",
            description: "Premium benefits for heavy users.",
            image: "2583319.png" // Filename from API
          }
        ]
      };

      // Base URL for images retrieved from the API
      const BASE_IMG_URL = "https://cdn-icons-png.flaticon.com/512/5672/"; // Example external source
      const FLATICON_PRO_URL = "https://cdn-icons-png.flaticon.com/512/2583/";

      const processedPlans = apiResponse.data.map(plan => ({
        ...plan,
        image: plan.id === 1 ? `${BASE_IMG_URL}${plan.image}` : `${FLATICON_PRO_URL}${plan.image}`
      }));

      setPlans(processedPlans);

    } catch (error) {
      console.error("Error fetching membership plans:", error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this membership plan?")) {
      setPlans(plans.filter(p => p.id !== id));
      alert("Plan deleted successfully!");
    }
  };

  const filteredPlans = plans.filter((plan) =>
    plan.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="700" color="#2b3674">
                Hi, Day Catch Super Admin Panel.
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                Create and manage subscription plans for Day Catch members.
            </Typography>
        </Box>
        <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate("/membership-plain/add")}
            sx={{ 
                backgroundColor: "#2d60ff", 
                "&:hover": { backgroundColor: "#2046cc" },
                borderRadius: "12px",
                textTransform: "none",
                px: 3,
                fontWeight: "700",
                boxShadow: "0 4px 12px rgba(45, 96, 255, 0.3)"
            }}
        >
            Add New Plan
        </Button>
      </Box>

      {/* Stats Summary */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", borderLeft: "6px solid #2d60ff", width: "fit-content", minWidth: 250 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: "#e0e7ff" }}>
                <CardMembershipIcon sx={{ color: "#2d60ff" }} />
            </Box>
            <Box>
                <Typography variant="caption" color="textSecondary" fontWeight="600">ACTIVE PLANS</Typography>
                <Typography variant="h5" fontWeight="800" color="#1b2559">{plans.length}</Typography>
            </Box>
        </Stack>
      </Paper>

      <Paper sx={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
          <Typography variant="h6" fontWeight="700" color="#1b2559">Membership Management</Typography>
          <TextField
            size="small"
            placeholder="Search plans..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" }, width: "280px" }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>IMAGE</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>PLAIN NAME</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>PLAIN DAYS</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>PLAIN PRICE</TableCell>
                <TableCell align="center" sx={{ fontWeight: "700", color: "#a3aed0" }}>FREE DELIVERY</TableCell>
                <TableCell align="center" sx={{ fontWeight: "700", color: "#a3aed0" }}>INSTANT DELIVERY</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>REWARDS</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>DESCRIPTION</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPlans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    No membership plans found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlans.map((plan, index) => (
                  <TableRow key={plan.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell sx={{ fontWeight: "600", color: "#1b2559" }}>{index + 1}</TableCell>
                    <TableCell>
                        <Avatar src={plan.image} variant="rounded" sx={{ width: 45, height: 45, borderRadius: "10px" }} />
                    </TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>{plan.name}</TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>{plan.days} Days</TableCell>
                    <TableCell sx={{ color: "#2d60ff", fontWeight: "800", fontSize: "16px" }}>₹{plan.price}</TableCell>
                    <TableCell align="center">
                        {plan.freeDelivery ? <CheckCircleIcon sx={{ color: "#24d164" }} /> : <CancelIcon sx={{ color: "#ff4d49" }} />}
                    </TableCell>
                    <TableCell align="center">
                        {plan.instantDelivery ? <CheckCircleIcon sx={{ color: "#24d164" }} /> : <CancelIcon sx={{ color: "#ff4d49" }} />}
                    </TableCell>
                    <TableCell>
                        <Chip label={`${plan.rewards}x Points`} size="small" sx={{ fontWeight: "700", bgcolor: "#f4f7fe", color: "#4318ff", borderRadius: "6px" }} />
                    </TableCell>
                    <TableCell sx={{ color: "#475467", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {plan.description?.replace(/<[^>]*>/g, '')}
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit Plan">
                            <IconButton 
                                onClick={() => navigate(`/membership-plain/edit/${plan.id}`)}
                                sx={{ backgroundColor: "#24d164", color: "#ffffff", borderRadius: "10px", "&:hover": { backgroundColor: "#1eb856" } }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Plan">
                            <IconButton 
                                onClick={() => handleDelete(plan.id)}
                                sx={{ backgroundColor: "#ff4d49", color: "#ffffff", borderRadius: "10px", "&:hover": { backgroundColor: "#e04340" } }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default MembershipPlain;
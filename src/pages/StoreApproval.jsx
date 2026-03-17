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
  Chip,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StorefrontIcon from "@mui/icons-material/Storefront";
import axios from "axios";

const StoreApproval = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPendingStores();
  }, []);

  const fetchPendingStores = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users?_limit=6"
      );
      
      const cities = ["New York", "Chicago", "Miami", "Austin", "Seattle", "Boston"];
      const formattedData = response.data.map((user, index) => ({
        id: user.id,
        storeName: user.company.name,
        city: cities[index % cities.length],
        mobile: user.phone.split(" ")[0],
        email: user.email,
        adminShare: "10%",
        ownerName: user.name,
        status: "Pending",
        logo: `https://ui-avatars.com/api/?name=${user.company.name}&background=random`
      }));

      setStores(formattedData);
    } catch (error) {
      console.error("Error fetching pending stores:", error);
    }
  };

  const handleApprove = (id) => {
    if (window.confirm("Approve this store to start selling?")) {
        setStores(prev => prev.filter(s => s.id !== id));
        alert("Store approved successfully!");
    }
  };

  const filteredStores = stores.filter((store) =>
    store.storeName.toLowerCase().includes(search.toLowerCase()) ||
    store.ownerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
            Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            Review and approve new vendor registrations to expand your network.
        </Typography>
      </Box>

      {/* Summary Card */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 2, borderLeft: "6px solid #4318ff", width: "fit-content" }}>
          <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: "#e0e7ff" }}>
              <StorefrontIcon sx={{ color: "#4318ff" }} />
          </Box>
          <Box>
              <Typography variant="caption" color="textSecondary" fontWeight="600">PENDING APPROVALS</Typography>
              <Typography variant="h5" fontWeight="800" color="#1b2559">{stores.length}</Typography>
          </Box>
      </Paper>

      <Paper sx={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
          <Typography variant="h6" fontWeight="700" color="#1b2559">Approval Queue</Typography>
          <TextField
            size="small"
            placeholder="Search store or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" }, width: "300px" }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>STORE</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>CITY</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>CONTACT</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>OWNER</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>ADMIN SHARE</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    No pending approvals
                  </TableCell>
                </TableRow>
              ) : (
                filteredStores.map((store, index) => (
                  <TableRow key={store.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>{index + 1}</TableCell>
                    <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar src={store.logo} sx={{ width: 40, height: 40, borderRadius: "10px" }} />
                            <Typography variant="body2" fontWeight="700" color="#1b2559">{store.storeName}</Typography>
                        </Stack>
                    </TableCell>
                    <TableCell sx={{ color: "#475467" }}>{store.city}</TableCell>
                    <TableCell>
                        <Typography variant="body2" fontWeight="600" color="#1b2559">{store.mobile}</Typography>
                        <Typography variant="caption" color="textSecondary">{store.email}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>{store.ownerName}</TableCell>
                    <TableCell>
                        <Chip 
                            label={store.adminShare}
                            size="small"
                            sx={{ bgcolor: "#f4f7fe", color: "#4318ff", fontWeight: "700" }}
                        />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View Profile">
                            <IconButton sx={{ backgroundColor: "#f4f7fe", color: "#4318ff", borderRadius: "10px" }}>
                                <VisibilityIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Approve Store">
                            <IconButton 
                                onClick={() => handleApprove(store.id)}
                                sx={{ backgroundColor: "#e6f9ed", color: "#24d164", borderRadius: "10px" }}
                            >
                                <CheckCircleIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject Store">
                            <IconButton 
                                sx={{ backgroundColor: "#fff1f0", color: "#ff4d49", borderRadius: "10px" }}
                            >
                                <CancelIcon fontSize="small" />
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

export default StoreApproval;
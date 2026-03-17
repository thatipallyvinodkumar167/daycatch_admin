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
  Tooltip,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SubAdmin = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users?_limit=8"
      );
      
      const roles = ["Manager", "Editor", "Support", "Inventory Manager", "Delivery Lead"];
      const formattedData = response.data.map((user, index) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone.split(" ")[0],
        role: roles[index % roles.length],
        status: index % 3 === 0 ? "Inactive" : "Active",
        image: `https://i.pravatar.cc/150?u=${user.id}`
      }));

      setAdmins(formattedData);
    } catch (error) {
      console.error("Error fetching sub-admins:", error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this sub-admin?")) {
      setAdmins(prev => prev.filter(admin => admin.id !== id));
    }
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.name.toLowerCase().includes(search.toLowerCase()) ||
    admin.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="700" color="#2b3674">
                Hi, Day Catch Super Admin Panel.
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                Manage sub-admins and assign them specific roles.
            </Typography>
        </Box>
        <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate("/sub-admin/add")}
            sx={{ 
                backgroundColor: "#4318ff", 
                "&:hover": { backgroundColor: "#3311cc" },
                borderRadius: "12px",
                textTransform: "none",
                px: 3,
                fontWeight: "700"
            }}
        >
            Add Sub-Admin
        </Button>
      </Box>

      {/* Summary Card */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 2, borderLeft: "6px solid #4318ff", width: "fit-content" }}>
          <Avatar sx={{ bgcolor: "#e0e7ff", color: "#4318ff" }}>
              <ManageAccountsIcon />
          </Avatar>
          <Box>
              <Typography variant="caption" color="textSecondary" fontWeight="600">SUB-ADMINS</Typography>
              <Typography variant="h5" fontWeight="800" color="#1b2559">{admins.length}</Typography>
          </Box>
      </Paper>

      <Paper sx={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
          <Typography variant="h6" fontWeight="700" color="#1b2559">Admin List</Typography>
          <TextField
            size="small"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" }, width: "300px" }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", width: "80px" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>IMAGE</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>NAME</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>EMAIL</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAdmins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    No sub-admins found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdmins.map((admin, index) => (
                  <TableRow key={admin.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>{index + 1}</TableCell>
                    <TableCell>
                        <Avatar src={admin.image} sx={{ width: 45, height: 45, borderRadius: "12px" }} />
                    </TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>
                        {admin.name}
                    </TableCell>
                    <TableCell sx={{ color: "#475467" }}>
                        {admin.email}
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit Admin">
                            <IconButton 
                                onClick={() => navigate(`/sub-admin/edit/${admin.id}`)}
                                sx={{ backgroundColor: "#24d164", color: "#ffffff", borderRadius: "10px", "&:hover": { backgroundColor: "#1eb856" } }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Admin">
                            <IconButton 
                                onClick={() => handleDelete(admin.id)}
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

export default SubAdmin;
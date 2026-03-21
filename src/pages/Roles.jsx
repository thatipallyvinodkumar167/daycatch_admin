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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../api/genericApi";

const Roles = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await genericApi.getAll("roles");
      const results = response.data.results || response.data || [];
      
      const formattedData = results.map((role) => ({
        id: role._id,
        name: role.name || "Unnamed Role",
      }));

      setRoles(formattedData);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await genericApi.remove("roles", id);
        setRoles(roles.filter(r => r.id !== id));
        alert("Role deleted successfully!");
      } catch (error) {
        console.error("Error deleting role:", error);
        alert("Failed to delete role.");
      }
    }
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="700" color="#2b3674">
                Hi, Day Catch Super Admin Panel.
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                Define and manage administrative roles.
            </Typography>
        </Box>
        <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate("/roles/add")}
            sx={{ 
                backgroundColor: "#4318ff", 
                "&:hover": { backgroundColor: "#3311cc" },
                borderRadius: "12px",
                textTransform: "none",
                px: 3,
                fontWeight: "700"
            }}
        >
            Add New Role
        </Button>
      </Box>

      {/* Stats Summary */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", borderLeft: "6px solid #4318ff", width: "fit-content", minWidth: 200 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: "#e0e7ff" }}>
                <AdminPanelSettingsIcon sx={{ color: "#4318ff" }} />
            </Box>
            <Box>
                <Typography variant="caption" color="textSecondary" fontWeight="600">TOTAL ROLES</Typography>
                <Typography variant="h5" fontWeight="800" color="#1b2559">{roles.length}</Typography>
            </Box>
        </Stack>
      </Paper>

      <Paper sx={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
          <Typography variant="h6" fontWeight="700" color="#1b2559">Roles List</Typography>
          <TextField
            size="small"
            placeholder="Search roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" }, width: "280px" }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", width: "100px" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>ROLE NAME</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    No roles found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((role, index) => (
                  <TableRow key={role.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>{index + 1}</TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700", fontSize: "16px" }}>{role.name}</TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit Role">
                            <IconButton 
                                onClick={() => navigate(`/roles/edit/${role.id}`)}
                                sx={{ backgroundColor: "#24d164", color: "#ffffff", borderRadius: "10px", "&:hover": { backgroundColor: "#1eb856" } }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Role">
                            <IconButton 
                                onClick={() => handleDelete(role.id)}
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

export default Roles;
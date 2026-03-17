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
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CancellingReasons = () => {
  const navigate = useNavigate();
  const [reasons, setReasons] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchReasons();
  }, []);

  const fetchReasons = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/todos?_limit=12"
      );
      
      const formattedData = response.data.map(item => ({
        id: item.id,
        reason: item.title.charAt(0).toUpperCase() + item.title.slice(1)
      }));

      setReasons(formattedData);
    } catch (error) {
      console.error("Error fetching reasons:", error);
    }
  };

  const filteredReasons = reasons.filter((item) =>
    item.reason?.toLowerCase().includes(search.toLowerCase().trim())
  );

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this cancellation reason?")) {
      setReasons(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="700" color="#2b3674">
                Hi, Day Catch Super Admin Panel.
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                Predefined reasons for order cancellations by users or delivery boys.
            </Typography>
        </Box>
        <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate("/cancelling-reasons/add")}
            sx={{ 
                backgroundColor: "#4318ff", 
                "&:hover": { backgroundColor: "#3311cc" },
                borderRadius: "12px",
                textTransform: "none",
                px: 3,
                fontWeight: "700"
            }}
        >
            Add Reason
        </Button>
      </Box>

      <Paper sx={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        <Box 
          sx={{ 
            p: 3, 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            borderBottom: "1px solid #f1f1f1"
          }}
        >
          <Typography variant="h6" fontWeight="700" color="#1b2559">
            Cancellation Reasons
          </Typography>
          <TextField
            size="small"
            placeholder="Search reasons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ 
              "& .MuiOutlinedInput-root": { borderRadius: "10px" },
              width: "280px"
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", width: "80px" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>REASON</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReasons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Stack alignItems="center" spacing={1}>
                        <HelpOutlineIcon sx={{ fontSize: 40, color: "#a3aed0" }} />
                        <Typography color="textSecondary">No reasons found matching your search</Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                filteredReasons.map((item, index) => (
                  <TableRow 
                    key={item.id} 
                    sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                  >
                    <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>{index + 1}</TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500", fontSize: "15px" }}>{item.reason}</TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit Reason">
                            <IconButton 
                                onClick={() => navigate(`/cancelling-reasons/edit/${item.id}`)}
                                sx={{ 
                                    backgroundColor: "#00d26a", 
                                    color: "#fff", 
                                    borderRadius: "10px",
                                    "&:hover": { backgroundColor: "#00b85c" }
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Reason">
                            <IconButton 
                                onClick={() => handleDelete(item.id)}
                                sx={{ 
                                    backgroundColor: "#ff4d49", 
                                    color: "#fff", 
                                    borderRadius: "10px",
                                    "&:hover": { backgroundColor: "#e03e3e" }
                                }}
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

export default CancellingReasons;

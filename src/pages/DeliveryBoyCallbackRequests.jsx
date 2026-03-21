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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../api/genericApi";

const DeliveryBoyCallbackRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");

  // API Call (using JSONPlaceholder as fakeapi)
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await genericApi.getAll("deliveryboycallbackrequests");
      const results = response.data.results || response.data || [];
      
      const formattedData = results.map((item, index) => ({
        id: item._id || index,
        deliveryBoyName: item.deliveryBoyName || item.name || "Unknown",
        deliveryBoyPhone: item.deliveryBoyPhone || item.phone || "N/A",
        addedBy: item.addedBy || "Admin",
      }));

      setRequests(formattedData);
    } catch (error) {
      console.error("Error fetching delivery boy callback requests:", error);
    }
  };

  const filteredRequests = React.useMemo(() => {
    return requests.filter((item) =>
      item.deliveryBoyName?.toLowerCase().includes(search.toLowerCase().trim()) ||
      item.deliveryBoyPhone?.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [requests, search]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this delivery boy callback request?")) {
      try {
        await genericApi.remove("deliveryboycallbackrequests", id);
        setRequests(prev => prev.filter(item => item.id !== id));
        alert("Delivery boy callback request deleted successfully!");
      } catch (error) {
        console.error("Error deleting callback request:", error);
        alert("Failed to delete request.");
      }
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
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            borderBottom: "1px solid #f1f1f1"
          }}
        >
          <Typography variant="h6" fontWeight="600" color="#1b2559">
            Delivery Boy Callback Requests
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate("/delivery-boy-callback-request/add")}
            sx={{ 
              backgroundColor: "#2d60ff", 
              "&:hover": { backgroundColor: "#2046cc" },
              borderRadius: "8px",
              textTransform: "none",
              px: 3
            }}
          >
            Add
          </Button>
        </Box>

        {/* Toolbar (Search) */}
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={1}
          sx={{ p: 3 }}
        >
          <Typography variant="body2" sx={{ mr: 1 }}>Search:</Typography>
          <TextField
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ 
              "& .MuiOutlinedInput-root": { borderRadius: "8px" },
              width: "250px"
            }}
          />
        </Stack>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Delivery Boy Name</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Delivery Boy Phone</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Added By</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2", pr: 4 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((item, index) => (
                  <TableRow 
                    key={item.id} 
                    sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                  >
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500", py: 2 }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>
                      {item.id}
                    </TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>
                      {item.deliveryBoyName}
                    </TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>
                      {item.deliveryBoyPhone}
                    </TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>
                      {item.addedBy}
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton 
                          onClick={() => navigate(`/delivery-boy-callback-request/edit/${item.id}`)}
                          sx={{ 
                            backgroundColor: "#24d164", 
                            color: "white",
                            borderRadius: "6px",
                            "&:hover": { backgroundColor: "#1fa951" },
                            p: 0.5
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <Button 
                          variant="contained" 
                          size="small"
                          onClick={() => handleDelete(item.id)}
                          sx={{ 
                            backgroundColor: "#ff4d49", 
                            color: "white",
                            borderRadius: "6px",
                            textTransform: "none",
                            "&:hover": { backgroundColor: "#e03e3a" },
                            boxShadow: "none"
                          }}
                        >
                          Close
                        </Button>
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

export default DeliveryBoyCallbackRequests;

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Button,
  alpha,
  CircularProgress,
  Switch,
  TextField,
  InputAdornment,
  Chip,
  Tooltip
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  TwoWheeler as BikeIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  ShoppingBag as OrdersIcon,
  Add as AddIcon
} from "@mui/icons-material";
import { useOutletContext, useNavigate } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const StoreDeliveryBoyList = () => {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [boys, setBoys] = useState([
    { id: "DB101", name: "Rahul Sharma", phone: "9876543210", password: "••••••••", status: "active", orders: 45 },
    { id: "DB102", name: "Anil Kumar", phone: "9123456789", password: "••••••••", status: "active", orders: 12 },
    { id: "DB103", name: "Suresh Raina", phone: "9988776655", password: "••••••••", status: "inactive", orders: 8 }
  ]);

  useEffect(() => {
    // Simulating loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleStatusChange = (id) => {
    setBoys(boys.map(b => b.id === id ? { ...b, status: b.status === "active" ? "inactive" : "active" } : b));
  };

  const filteredBoys = boys.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.phone.includes(searchTerm)
  );

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress sx={{ color: "#4318ff" }} /></Box>;

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Box sx={{ maxWidth: "1500px", mx: "auto" }}>
        
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} flexWrap="wrap" useFlexGap>
          <Box>
            <Typography variant="h3" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1.5px" }}>
              Delivery Boy List
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
               Manage delivery personnel assigned to {store.name}.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("add")}
            sx={{
              borderRadius: "18px",
              py: 1.5,
              px: 4,
              bgcolor: "#4318ff",
              boxShadow: "0 10px 25px rgba(67,24,255,0.25)",
              textTransform: "none",
              fontWeight: 800,
              fontSize: "15px",
              "&:hover": { bgcolor: "#3310cc" }
            }}
          >
            Add New Boy
          </Button>
        </Stack>

        <Paper sx={{ p: 4, borderRadius: "28px", border: "1px solid #e0e5f2", boxShadow: "0 18px 40px rgba(15,23,42,0.04)" }}>
          
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 4 }}>
            <TextField
              placeholder="Search by ID, Name or Phone..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#a3aed0" }} /></InputAdornment>,
                sx: { borderRadius: "14px", bgcolor: "#f8f9fc", width: { xs: "100%", sm: "350px" } }
              }}
            />
          </Stack>

          <TableContainer sx={{ border: "1px solid #eef2f6", borderRadius: "20px", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#fafbfc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", width: "60px" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0" }}>Boy ID</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0" }}>Boy Name</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0" }}>Boy Phone</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0" }}>Boy Password</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0" }}>Orders</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", textAlign: "right" }}>Details & Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBoys.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                       <Typography variant="h6" color="#a3aed0" fontWeight="800">No data found</Typography>
                     </TableCell>
                  </TableRow>
                ) : (
                  filteredBoys.map((row, index) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559" }}>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#4318ff" }}>{row.id}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar sx={{ bgcolor: alpha("#4318ff", 0.08), color: "#4318ff" }}><BikeIcon fontSize="small" /></Avatar>
                          <Typography variant="body1" fontWeight="800" color="#1b2559">{row.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                           <PhoneIcon sx={{ color: "#05cd99", fontSize: 16 }} />
                           <Typography variant="body2" fontWeight="700" color="#707eae">{row.phone}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                           <LockIcon sx={{ color: "#a3aed0", fontSize: 16 }} />
                           <Typography variant="body2" fontWeight="700" color="#707eae">{row.password}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={row.status === "active"} 
                          onChange={() => handleStatusChange(row.id)}
                          sx={{ 
                            "& .MuiSwitch-switchBase.Mui-checked": { color: "#05cd99" },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#05cd99" }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                         <Chip 
                           label={`${row.orders} Orders`} 
                           size="small" 
                           icon={<OrdersIcon sx={{ fontSize: "14px !important" }} />}
                           sx={{ fontWeight: 800, borderRadius: "10px", bgcolor: alpha("#4318ff", 0.05), color: "#4318ff" }} 
                         />
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="View Stats">
                            <IconButton size="small" sx={{ color: "#4318ff", bgcolor: alpha("#4318ff", 0.1), borderRadius: "10px" }} onClick={() => navigate(`details/${row.id}`)}><ViewIcon fontSize="small" /></IconButton>
                          </Tooltip>
                          <IconButton size="small" sx={{ color: "#a3aed0" }}><EditIcon fontSize="small" /></IconButton>
                          <IconButton size="small" sx={{ color: "#ee5d50", bgcolor: alpha("#ee5d50", 0.05), borderRadius: "10px" }}><DeleteIcon fontSize="small" /></IconButton>
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
    </Box>
  );
};

export default StoreDeliveryBoyList;

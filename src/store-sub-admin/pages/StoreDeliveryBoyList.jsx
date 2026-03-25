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
  Add as AddIcon,
  DeliveryDining as DeliveryIcon
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

  const orderPanelSx = {
    borderRadius: "24px",
    border: "1px solid #e0e5f2",
    bgcolor: "#fff",
    boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
  };

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

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}><CircularProgress sx={{ color: "#E53935" }} /></Box>;

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        
        <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1b2559", mb: 0.5, letterSpacing: "-1.5px" }}>
               Delivery Fleet
            </Typography>
            <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
               <DeliveryIcon sx={{ fontSize: 18 }} /> Logistics Terminal • Assigned Personnel
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate("add")}
            sx={{
              borderRadius: "14px",
              py: 1.5,
              px: 4,
              bgcolor: "#E53935",
              boxShadow: "0 10px 20px rgba(229, 57, 53, 0.2)",
              textTransform: "none",
              fontWeight: 900,
              fontSize: "15px",
              "&:hover": { bgcolor: "#d32f2f" }
            }}
          >
            + Register Agent
          </Button>
        </Box>

        <Paper sx={{ p: 4, ...orderPanelSx }}>
          
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
                     <TableCell colSpan={8} align="center" sx={{ py: 12 }}>
                       <Stack alignItems="center" spacing={2.5}>
                         <Box sx={{ p: 3, borderRadius: "50%", bgcolor: alpha("#E53935", 0.05) }}>
                           <BikeIcon sx={{ color: "#E53935", fontSize: 56, opacity: 0.5 }} />
                         </Box>
                         <Typography variant="h5" color="#1b2559" fontWeight="900">No personnel data found</Typography>
                         <Typography variant="body2" color="#a3aed0" fontWeight="600">Register your delivery boys to start dispatching orders.</Typography>
                       </Stack>
                     </TableCell>
                  </TableRow>
                ) : (
                  filteredBoys.map((row, index) => (
                    <TableRow key={row.id} hover sx={{ "&:hover": { bgcolor: alpha("#1b2559", 0.02) } }}>
                      <TableCell sx={{ fontWeight: 800, color: "#a3aed0" }}>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#1b2559" }}>{row.id}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar sx={{ bgcolor: alpha("#E53935", 0.08), color: "#E53935", borderRadius: "12px" }}><BikeIcon fontSize="small" /></Avatar>
                          <Typography variant="body1" fontWeight="800" color="#1b2559">{row.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                           <PhoneIcon sx={{ color: "#05cd99", fontSize: 16 }} />
                           <Typography variant="body2" fontWeight="700" color="#a3aed0">{row.phone}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                           <LockIcon sx={{ color: "#a3aed0", fontSize: 16 }} />
                           <Typography variant="body2" fontWeight="700" color="#a3aed0">{row.password}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={row.status === "active"} 
                          onChange={() => handleStatusChange(row.id)}
                          sx={{ 
                            "& .MuiSwitch-switchBase.Mui-checked": { color: "#05cd99" },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: alpha("#05cd99", 0.5) }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                         <Chip 
                           label={`${row.orders} Orders`} 
                           size="small" 
                           icon={<OrdersIcon sx={{ fontSize: "14px !important" }} />}
                           sx={{ fontWeight: 800, borderRadius: "10px", bgcolor: alpha("#1b2559", 0.05), color: "#1b2559" }} 
                         />
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="View Stats">
                            <IconButton size="small" sx={{ color: "#1b2559", bgcolor: alpha("#1b2559", 0.05), borderRadius: "10px" }} onClick={() => navigate(`details/${row.id}`)}><ViewIcon fontSize="small" /></IconButton>
                          </Tooltip>
                          <IconButton className="action-edit" size="small" sx={{ color: "#a3aed0" }}><EditIcon fontSize="small" /></IconButton>
                          <IconButton className="action-delete" size="small" sx={{ color: "#ee5d50", bgcolor: alpha("#ee5d50", 0.05), borderRadius: "10px" }}><DeleteIcon fontSize="small" /></IconButton>
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

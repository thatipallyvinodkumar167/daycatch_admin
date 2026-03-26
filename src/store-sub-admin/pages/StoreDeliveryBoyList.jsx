import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  TextField,
  InputAdornment,
  Chip,
  Tooltip,
  Snackbar,
  Alert,
  Dialog,
  Grid,
} from "@mui/material";
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  TwoWheeler as BikeIcon,
  Phone as PhoneIcon,
  ShoppingBag as OrdersIcon,
  DeliveryDining as DeliveryIcon,
  AssignmentInd as IdIcon,
  Close as CloseIcon,
  CheckCircle as ActiveIcon,
  PauseCircle as InactiveIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getAllDeliveryBoys, deleteDeliveryBoy } from "../../api/deliveryBoyApi";
import { matchesStoreRecord } from "../utils/storeWorkspace";

const StoreDeliveryBoyList = () => {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [boys, setBoys] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [previewImage, setPreviewImage] = useState(null);

  const fetchBoys = useCallback(async () => {
    try {
      const response = await getAllDeliveryBoys();
      const rawList = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
          ? response.data
          : [];
      
      setBoys(
        rawList
          .filter(row => matchesStoreRecord(row, store))
          .map((row, index) => ({
            id: String(row._id ?? row.id ?? index),
            name: row.boyName || row.name || row["Boy Name"] || "Unnamed Partner",
            phone: row.boyMobile || row.phone || row["Boy Phone"] || "",
            password: row.boyPassword || row.password || row["Boy Password"] || "••••••",
            status: row.status || row.Status || "Off duty",
            orders: row.orders || row.Orders || 0,
            idImage: (row.Details?.["ID Image"]) || (row.details?.["ID Image"]) || "",
            city: (row.Details?.City) || (row.details?.City) || "N/A"
          }))
      );
    } catch (error) {
      console.error("Fleet sync error:", error);
      setSnackbar({ open: true, message: "Sync failure.", severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [store]);

  useEffect(() => {
    if (store?.id || store?.name) {
      fetchBoys();
    }
  }, [fetchBoys]);

  const handleDelete = async (boyId) => {
    if (!window.confirm("Permanently deactivate and remove this agent?")) return;
    try {
        await deleteDeliveryBoy(boyId);
        setBoys(current => current.filter(b => b.id !== boyId));
        setSnackbar({ open: true, message: "Agent removed.", severity: "success" });
    } catch (err) {
        setSnackbar({ open: true, message: "Deletion failed.", severity: "error" });
    }
  };

  const filteredBoys = useMemo(() => {
    return boys.filter(b => 
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b.phone.includes(searchTerm)
    );
  }, [boys, searchTerm]);

  const stats = useMemo(() => {
    return [
        { label: "TOTAL FLEET", value: boys.length, icon: <BikeIcon />, color: "#4318ff", bg: "#eef2ff" },
        { label: "ON DUTY", value: boys.filter(b => !String(b.status).toLowerCase().includes("off")).length, icon: <ActiveIcon />, color: "#05cd99", bg: "#e6f9ed" },
        { label: "OFF DUTY", value: boys.filter(b => String(b.status).toLowerCase().includes("off")).length, icon: <InactiveIcon />, color: "#ee5d50", bg: "#fff1f0" },
    ];
  }, [boys]);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}><CircularProgress sx={{ color: "#E53935" }} /></Box>;

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        
        {/* Header Section */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: "#1b2559", mb: 0.5, letterSpacing: "-1px" }}>
               Logistics Terminal
            </Typography>
            <Typography variant="body2" sx={{ color: "#a3aed0", fontWeight: 700 }}>
               Real-time delivery fleet allocation for {store.name}
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate("add")}
            sx={{ borderRadius: "14px", py: 1.5, px: 3.5, bgcolor: "#E53935", fontWeight: 900, "&:hover": { bgcolor: "#d32f2f" } }}
          >
            + Register Agent
          </Button>
        </Box>

        {/* Dynamic Stats Cards */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
            {stats.map((stat, i) => (
                <Grid item xs={12} sm={4} key={i}>
                    <Paper sx={{ p: 2.5, borderRadius: "20px", display: "flex", alignItems: "center", gap: 2, border: "1px solid #e0e5f2" }}>
                        <Avatar sx={{ bgcolor: stat.bg, color: stat.color, width: 48, height: 48, borderRadius: "14px" }}>
                            {stat.icon}
                        </Avatar>
                        <Box>
                            <Typography variant="caption" color="#a3aed0" fontWeight="900" sx={{ letterSpacing: "1px" }}>{stat.label}</Typography>
                            <Typography variant="h5" fontWeight="900" color="#1b2559">{stat.value}</Typography>
                        </Box>
                    </Paper>
                </Grid>
            ))}
        </Grid>

        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: "24px", border: "1px solid #e0e5f2", boxShadow: "0 25px 50px rgba(0,0,0,0.04)" }}>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }} justifyContent="space-between" alignItems="center">
            <TextField
              placeholder="Search by Agent Name or Phone..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#a3aed0", fontSize: 20 }} /></InputAdornment>,
                sx: { borderRadius: "14px", bgcolor: "#f8f9fc", width: { xs: "100%", sm: "320px" }, fontSize: "14px" }
              }}
            />
          </Stack>

          <TableContainer sx={{ border: "1px solid #eef2f6", borderRadius: "20px", overflow: "hidden" }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#fafbfc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", py: 2, pl: 3 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", py: 2 }}>ID PROOF</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", py: 2 }}>AGENT NAME</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", py: 2 }}>CONTACT</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", py: 2 }}>PASSWORD</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", py: 2 }}>DUTY STATUS</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", py: 2 }}>ACTIVITY</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", py: 2, pr: 3 }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBoys.length === 0 ? (
                  <TableRow><TableCell colSpan={8} align="center" sx={{ py: 8 }}><Typography variant="body2" fontWeight="800" color="#a3aed0">No personnel found in fleet.</Typography></TableCell></TableRow>
                ) : (
                  filteredBoys.map((row, index) => {
                    const isOff = String(row.status).toLowerCase().includes("off");
                    return (
                        <TableRow key={row.id} hover sx={{ "&:hover": { bgcolor: "#f9fbff" } }}>
                        <TableCell sx={{ fontWeight: 800, color: "#a3aed0", pl: 3 }}>{index + 1}</TableCell>
                        <TableCell>
                            <Box 
                                onClick={() => row.idImage && setPreviewImage(row.idImage)}
                                sx={{ 
                                    width: 48, height: 32, borderRadius: "8px", border: "1px solid #e0e5f2", overflow: "hidden", cursor: row.idImage ? "pointer" : "default", bgcolor: "#f8f9fc", display: "flex", alignItems: "center", justifyContent: "center"
                                }}
                            >
                                {row.idImage ? (
                                    <img src={row.idImage} alt="ID" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <IdIcon sx={{ color: "#d1d9e2", fontSize: 18 }} />
                                )}
                            </Box>
                        </TableCell>
                        <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Avatar sx={{ bgcolor: alpha("#E53935", 0.1), color: "#E53935", borderRadius: "8px", width: 28, height: 28 }}><PersonIcon sx={{ fontSize: 16 }} /></Avatar>
                                <Typography variant="body2" fontWeight="800" color="#1b2559" noWrap sx={{ maxWidth: "120px" }}>{row.name}</Typography>
                            </Stack>
                        </TableCell>
                        <TableCell>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <PhoneIcon sx={{ color: "#05cd99", fontSize: 14 }} />
                                <Typography variant="caption" fontWeight="800" color="#1b2559">{row.phone}</Typography>
                            </Stack>
                        </TableCell>
                        <TableCell sx={{ color: "#707eae", fontFamily: "monospace", fontSize: "12px" }}>{row.password}</TableCell>
                        <TableCell>
                            <Chip 
                                label={isOff ? "OFF DUTY" : "ON DUTY"} 
                                size="small" 
                                sx={{ 
                                    fontWeight: 900, 
                                    bgcolor: isOff ? alpha("#ee5d50", 0.05) : alpha("#05cd99", 0.05), 
                                    color: isOff ? "#ee5d50" : "#05cd99",
                                    borderRadius: "6px", px: 0.5, fontSize: "10px", height: "20px",
                                    border: `1px solid ${isOff ? alpha("#ee5d50", 0.2) : alpha("#05cd99", 0.2)}`
                                }} 
                            />
                        </TableCell>
                        <TableCell>
                            <Tooltip title="View Logs">
                                <Chip 
                                    label={`${row.orders} Jobs`} 
                                    size="small"
                                    onClick={() => navigate(`/delivery-boy-list/orders/${row.id}`)}
                                    icon={<OrdersIcon sx={{ fontSize: "12px !important" }} />}
                                    sx={{ fontWeight: 900, borderRadius: "8px", bgcolor: alpha("#1b2559", 0.04), color: "#1b2559", cursor: "pointer", fontSize: "10px", height: "22px" }} 
                                />
                            </Tooltip>
                        </TableCell>
                        <TableCell align="right" sx={{ pr: 3 }}>
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                <IconButton size="small" onClick={() => navigate(`/delivery-boy-list/details/${row.id}`)} sx={{ color: "#4318ff", bgcolor: "#f4f7fe", borderRadius: "8px", width: 30, height: 30 }}><ViewIcon sx={{ fontSize: 18 }} /></IconButton>
                                <IconButton size="small" onClick={() => handleDelete(row.id)} sx={{ color: "#ee5d50", bgcolor: alpha("#ee5d50", 0.05), borderRadius: "8px", width: 30, height: 30 }}><DeleteIcon sx={{ fontSize: 18 }} /></IconButton>
                            </Stack>
                        </TableCell>
                        </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* ID Preview Dialog */}
      <Dialog open={!!previewImage} onClose={() => setPreviewImage(null)} maxWidth="md" PaperProps={{ sx: { borderRadius: "24px", overflow: "hidden" } }}>
         <Box sx={{ position: "relative" }}>
            <IconButton onClick={() => setPreviewImage(null)} sx={{ position: "absolute", top: 12, right: 12, bgcolor: "rgba(0,0,0,0.4)", color: "#fff", "&:hover": { bgcolor: "rgba(0,0,0,0.6)" }, zIndex: 1 }}><CloseIcon /></IconButton>
            <img src={previewImage} alt="ID Preview" style={{ width: "100%", maxHeight: "80vh", objectFit: "contain", display: "block" }} />
         </Box>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: "16px", fontWeight: "900" }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default StoreDeliveryBoyList;

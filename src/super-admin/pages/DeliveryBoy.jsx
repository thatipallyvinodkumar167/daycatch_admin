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
  LinearProgress,
  Avatar,
  Tooltip,
  Collapse,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PrintIcon from "@mui/icons-material/Print";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import HistoryIcon from "@mui/icons-material/History";
import { useNavigate } from "react-router-dom";
import { getAllDeliveryBoys, deleteDeliveryBoy } from "../../api/deliveryBoyApi";
import {
  formatDeliveryBoyStatus,
  isDeliveryBoyOffDuty,
} from "../../utils/deliveryBoyUtils";
import DriverOrdersDialog from "../../components/DriverOrdersDialog";

const DeliveryBoy = () => {
  const navigate = useNavigate();
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [openJobsModal, setOpenJobsModal] = useState(false);

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const fetchDeliveryBoys = async () => {
    setLoading(true);
    try {
      const response = await getAllDeliveryBoys();
      const rawList = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
          ? response.data
          : [];

      const normalizedList = rawList.map(item => ({
        ...item,
        id: item.id || item.dboy_id || item._id,
        boyName: item.boy_name || item.boyName || item.name || item["Boy Name"] || "Unnamed",
        boyMobile: item.boy_phone || item.boyMobile || item.phone || item["Boy Phone"] || "N/A",
        boyPassword: item.boyPassword || item.password || item["Boy Password"] || "••••••",
        status: item.status || item.Status || "Off duty",
        orders: item.orders || item.Orders || 0,
        city: ((item.Details && item.Details.City) || (item.details && item.details.City) || item.City || item.city || "Not Assigned") === "city_hyd_001" ? "Hyderabad" : 
              ((item.Details && item.Details.City) || (item.details && item.details.City) || item.City || item.city || "Not Assigned") === "city_kurn_002" ? "Kurnool" : 
              ((item.Details && item.Details.City) || (item.details && item.details.City) || item.City || item.city || "Not Assigned"),
      }));

      setDeliveryBoys(normalizedList);
    } catch (error) {
      console.error("Error fetching delivery boys:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBoys = React.useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return deliveryBoys;

    return deliveryBoys.filter((item) => {
      const name = String(item.boyName || item.name || "").toLowerCase();
      const phone = String(item.boyMobile || item.phone || "").toLowerCase();
      return name.includes(s) || phone.includes(s);
    });
  }, [deliveryBoys, search]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this delivery boy?")) {
      try {
        await deleteDeliveryBoy(id);
        setDeliveryBoys((prev) =>
          prev.filter((item) => item._id !== id && item.id !== id)
        );
        alert("Delivery boy deleted successfully!");
      } catch (error) {
        console.error("Error deleting delivery boy:", error);
        alert("Failed to delete delivery boy.");
      }
    }
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleDownloadCSV = () => {
    if (filteredBoys.length === 0) {
      alert("No data available to download.");
      return;
    }

    const headers = ["Driver ID", "Driver Name", "Contact Number", "Password", "Duty Status", "Total Deliveries", "Base City"];
    const csvRows = [headers.join(",")];

    filteredBoys.forEach(boy => {
      const row = [
        boy._id || boy.id || "N/A",
        `"${String(boy.boyName || boy.name || "").replace(/"/g, '""')}"`,
        `"${String(boy.boyMobile || boy.phone || "").replace(/"/g, '""')}"`,
        `"${String(boy.boyPassword || boy.password || "").replace(/"/g, '""')}"`,
        `"${String(boy.status || "").toUpperCase()}"`,
        boy.orders || 0,
        `"${String(boy.city || "").replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(","));
    });

    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", "DayCatch_Driver_List.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Page Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
            Driver List
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ fontWeight: "500" }}>
            Manage and monitor active delivery drivers.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate("/delivery-boy-list/add")}
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "#4318ff",
            "&:hover": { backgroundColor: "#3311cc" },
            borderRadius: "16px",
            textTransform: "none",
            px: 4,
            py: 1.8,
            fontWeight: "800",
            boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)",
          }}
        >
          Register New Driver
        </Button>
      </Box>

      {/* Stats Section - AllOrders Style */}
      <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
        <Paper sx={{ p: 3, flex: 1, borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 2, backgroundColor: "#fff" }}>
          <Avatar sx={{ bgcolor: "#eef2ff", color: "#4318ff", width: 56, height: 56 }}>
            <DeliveryDiningIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ letterSpacing: "1px" }}>TOTAL DRIVERS</Typography>
            <Typography variant="h4" fontWeight="800" color="#1b2559">{deliveryBoys.length}</Typography>
          </Box>
        </Paper>
        <Paper sx={{ p: 3, flex: 1, borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 2, backgroundColor: "#fff" }}>
          <Avatar sx={{ bgcolor: "#e6f9ed", color: "#24d164", width: 56, height: 56 }}>
            <CheckCircleIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ letterSpacing: "1px" }}>ACTIVE ON DUTY</Typography>
            <Typography variant="h4" fontWeight="800" color="#1b2559">
              {deliveryBoys.filter(b => !isDeliveryBoyOffDuty(b.status)).length}
            </Typography>
          </Box>
        </Paper>
      </Stack>

      {/* Utility Bar - AllOrders Style */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }} justifyContent="space-between">
        <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
            <TextField
                size="small"
                placeholder="Search by name, mobile or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                    flex: 1,
                    maxWidth: "500px",
                    "& .MuiOutlinedInput-root": { 
                        borderRadius: "16px", 
                        backgroundColor: "#fff",
                        "& fieldset": { borderColor: "#e0e5f2" } 
                    }
                }}
            />
        </Box>
        <Stack direction="row" spacing={1.5}>
            <Tooltip title="Print List">
                <IconButton onClick={() => window.print()} sx={{ backgroundColor: "#fff", border: "1px solid #e0e5f2", borderRadius: "12px" }}>
                    <PrintIcon sx={{ color: "#2b3674" }} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Download CSV">
                <IconButton onClick={handleDownloadCSV} sx={{ backgroundColor: "#fff", border: "1px solid #e0e5f2", borderRadius: "12px" }}>
                    <FileDownloadIcon sx={{ color: "#2b3674" }} />
                </IconButton>
            </Tooltip>
        </Stack>
      </Stack>

      <Paper
        sx={{
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
          border: "1px solid #e0e5f2",
          background: "#fff",
        }}
      >
        {loading && <LinearProgress sx={{ "& .MuiLinearProgress-bar": { bgcolor: "#4318ff" } }} />}
        
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", py: 2, pl: 4, borderBottom: "1px solid #e0e5f2" }}>#</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>DRIVER</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>CONTACT</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>PASSWORD</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>STATUS</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>TOTAL DELIVERIES</TableCell>
                <TableCell align="center" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>DETAILS</TableCell>
                <TableCell align="right" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", pr: 4, borderBottom: "1px solid #e0e5f2" }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBoys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                    <Typography variant="body1" color="#a3aed0" fontWeight="600">
                      No drivers found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBoys.map((item, index) => {
                  const isOffDuty = isDeliveryBoyOffDuty(item.status);
                  const isExpanded = expandedRow === (item._id || item.id);

                  return (
                    <React.Fragment key={item._id || item.id}>
                    <TableRow sx={{ "&:hover": { bgcolor: "#f4f7fe" }, transition: "0.2s", backgroundColor: isExpanded ? "#f4f7fe" : "inherit" }}>
                      <TableCell sx={{ color: "#a3aed0", fontWeight: "800", pl: 4 }}>
                        <IconButton size="small" onClick={() => toggleRow(item._id || item.id)} sx={{ mr: 1, color: "#4318ff" }}>
                          {isExpanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                        </IconButton>
                        {String(index + 1).padStart(2, '0')}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ 
                            bgcolor: isOffDuty ? "#f4f7fe" : "#eef2ff", 
                            color: "#4318ff", 
                            fontWeight: "800", 
                            fontSize: "14px",
                            border: "2px solid #e0e5f2"
                          }}>
                            {(item.boyName || item.name || "U")[0].toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" fontWeight="800" color="#1b2559">
                            {item.boyName || item.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="700" color="#475467">
                          {item.boyMobile || item.phone}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color: "#a3aed0",
                            fontFamily: "monospace",
                            fontSize: "13px",
                            bgcolor: "#f4f7fe",
                            px: 1,
                            borderRadius: "6px",
                            fontWeight: "700"
                          }}
                        >
                          {item.boyPassword || item.password || "••••••"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatDeliveryBoyStatus(item.status).toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor: isOffDuty ? "#fff5f5" : "#e6f9ed",
                            color: isOffDuty ? "#ee2d35" : "#24d164",
                            fontWeight: "900",
                            fontSize: "10px",
                            borderRadius: "10px",
                            px: 1.5,
                            height: "26px",
                            border: `1px solid ${isOffDuty ? "#ffccc7" : "#b7eb8f"}`
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View All Jobs Assigned to this Driver">
                            <Box 
                                onClick={() => {
                                    setSelectedDriver(item.boyName || item.name);
                                    setOpenJobsModal(true);
                                }}
                                sx={{ 
                                    display: "inline-flex", 
                                    alignItems: "center", 
                                    gap: 1,
                                    bgcolor: "#f4f7fe", 
                                    px: 2, 
                                    py: 0.8, 
                                    borderRadius: "12px",
                                    border: "1px solid #e0e5f2",
                                    cursor: "pointer",
                                    transition: "0.2s",
                                    "&:hover": { bgcolor: "#eef2ff", borderColor: "#4318ff", transform: "translateY(-1px)" }
                                }}
                            >
                            <Typography fontWeight="900" color="#4318ff" variant="subtitle2">
                                {item.orders ?? 0} <span style={{ color: "#a3aed0", fontSize: "10px", fontWeight: "600" }}>JOBS</span>
                            </Typography>
                            </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/delivery-boy-list/details/${item._id || item.id}`)}
                          sx={{
                            borderRadius: "10px",
                            textTransform: "none",
                            fontWeight: "700",
                            borderColor: "#e0e5f2",
                            color: "#1b2559",
                            "&:hover": { borderColor: "#4318ff", backgroundColor: "#eef2ff" }
                          }}
                        >
                          View Profile
                        </Button>
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Edit Profile">
                                <IconButton className="action-edit"
                                    size="small"
                                    onClick={() => navigate(`/delivery-boy-list/edit/${item._id || item.id}`)}
                                    sx={{
                                        color: "#fff",
                                        bgcolor: "#24d164",
                                        borderRadius: "10px",
                                        width: "32px",
                                        height: "32px",
                                        "&:hover": { bgcolor: "#1fb355", transform: "translateY(-1px)" },
                                        transition: "0.2s"
                                    }}
                                >
                                    <EditIcon sx={{ fontSize: "16px" }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Account">
                                <IconButton className="action-delete"
                                    size="small"
                                    onClick={() => handleDelete(item._id || item.id)}
                                    sx={{
                                        color: "#fff",
                                        bgcolor: "#ff4d49",
                                        borderRadius: "10px",
                                        width: "32px",
                                        height: "32px",
                                        "&:hover": { bgcolor: "#e03e3a", transform: "translateY(-1px)" },
                                        transition: "0.2s"
                                    }}
                                >
                                    <DeleteIcon sx={{ fontSize: "16px" }} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>

                    {/* Expandable Content - Tactical Fleet Details */}
                    <TableRow>
                        <TableCell colSpan={8} sx={{ py: 0, borderBottom: isExpanded ? "1px solid #e0e5f2" : "none" }}>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                <Box sx={{ p: 4, backgroundColor: "#fafbfc" }}>
                                    <Grid container spacing={4}>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="subtitle2" fontWeight="800" gutterBottom color="#2b3674">DRIVER OVERVIEW</Typography>
                                            <Typography variant="body2" color="#a3aed0">This driver is part of the delivery fleet. You can monitor their location, incentive history, and performance metrics from the detailed profile view.</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <Stack direction="row" spacing={3}>
                                                <Paper sx={{ p: 2, flex: 1, borderRadius: "16px", border: "1px dashed #e0e5f2", textAlign: 'center' }}>
                                                    <Typography variant="caption" color="#a3aed0" fontWeight="700">CITY</Typography>
                                                    <Typography variant="body2" fontWeight="800" color="#1b2559">{item.city}</Typography>
                                                </Paper>
                                                <Paper sx={{ p: 2, flex: 1, borderRadius: "16px", border: "1px dashed #e0e5f2", textAlign: 'center' }}>
                                                  <Button 
                                                    startIcon={<HistoryIcon />} 
                                                    onClick={() => navigate(`/delivery-boy-incentive/history/${item._id || item.id}`)}
                                                    sx={{ 
                                                        textTransform: 'none', 
                                                        fontWeight: 800, 
                                                        color: '#4318ff',
                                                        "&:hover": { bgcolor: "rgba(67, 24, 255, 0.05)" }
                                                    }}
                                                  >
                                                    View Log
                                                  </Button>
                                                </Paper>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Collapse>
                        </TableCell>
                    </TableRow>
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <DriverOrdersDialog 
        open={openJobsModal}
        onClose={() => setOpenJobsModal(false)}
        driverName={selectedDriver}
      />
    </Box>
  );
};

// Help Grid component for expandable row
const Grid = ({ children, container, item, xs, md, spacing }) => {
    return <Box sx={{ 
        display: container ? 'flex' : 'block', 
        flexWrap: 'wrap', 
        width: item ? (xs ? `${(xs/12)*100}%` : 'auto') : '100%',
        p: spacing ? spacing : 0,
        ...(md && { width: { md: `${(md/12)*100}%` } })
    }}>{children}</Box>
}

export default DeliveryBoy;






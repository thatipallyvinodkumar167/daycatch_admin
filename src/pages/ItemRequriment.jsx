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
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import InventoryIcon from "@mui/icons-material/Inventory";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../api/genericApi";

const ItemRequirement = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("list"); // 'list' or 'detail'
  const [requirements, setRequirements] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    try {
      const response = await genericApi.getAll("item_requirement");
      const results = response.data.results || response.data || [];
      const formattedData = results.map((item, index) => ({
        id: item._id || index + 1,
        storeName: item["Store Name"] || item.storeName || "Unknown Store",
        city: item["City"] || item.city || "N/A",
        mobile: item["Mobile"] || item.mobile || "N/A",
        email: item["Email"] || item.email || "N/A",
      }));
      setRequirements(formattedData);
    } catch (error) {
      console.error("Error fetching requirements:", error);
    }
  };


  const filteredRequirements = requirements.filter((item) =>
    item.storeName.toLowerCase().includes(search.toLowerCase()) ||
    item.city.toLowerCase().includes(search.toLowerCase())
  );

  const StatsCard = ({ title, value, icon }) => (
    <Paper sx={{ 
        p: 2.5, 
        borderRadius: "20px", 
        boxShadow: "0 10px 30px rgba(0,0,0,0.02)", 
        borderLeft: "6px solid #2d60ff",
        display: "flex",
        alignItems: "center",
        gap: 2.5,
        width: "fit-content",
        minWidth: "240px",
        backgroundColor: "white"
    }}>
        <Box sx={{ p: 1.8, borderRadius: "14px", bgcolor: "#e9edf7", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {icon}
        </Box>
        <Box>
            <Typography variant="body2" fontWeight="700" color="#a3aed0" sx={{ mb: 0.2, fontSize: "0.75rem", textTransform: "uppercase" }}>{title}</Typography>
            <Typography variant="h4" fontWeight="800" color="#1b2559">{value}</Typography>
        </Box>
    </Paper>
  );

  const renderListView = () => (
    <>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674">Hi, Day Catch Super Admin Panel.</Typography>
            <Typography variant="h6" color="#707eae" fontWeight="500">Analyze inventory requirements based on incoming orders for each store.</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
            <Button 
                variant="outlined" 
                startIcon={<AssessmentIcon />}
                onClick={() => navigate("/sales-report")}
                sx={{ 
                    borderRadius: "12px",
                    textTransform: "none",
                    px: 3,
                    py: 1.5,
                    fontWeight: "700",
                    color: "#2d60ff",
                    borderColor: "#2d60ff",
                    "&:hover": { borderColor: "#2046cc", backgroundColor: "#f0f4ff" }
                }}
            >
                Item Sale Report
            </Button>
            <Button 
                variant="contained" 
                startIcon={<FileDownloadIcon />}
                sx={{ 
                    backgroundColor: "#2d60ff", 
                    borderRadius: "12px",
                    textTransform: "none",
                    px: 3,
                    py: 1.5,
                    fontWeight: "700",
                    boxShadow: "0 4px 12px rgba(45, 96, 255, 0.2)",
                    "&:hover": { backgroundColor: "#2046cc" }
                }}
            >
                Download Summary
            </Button>
        </Stack>
      </Box>

      <Box sx={{ mb: 6 }}>
        <StatsCard title="Active Stores" value={requirements.length} icon={<InventoryIcon sx={{ color: "#2d60ff" }} />} />
      </Box>

      <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "none" }}>
        <Box sx={{ p: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" fontWeight="700" color="#1b2559">Item Requirement Overview</Typography>
          <TextField
              size="small"
              placeholder="Search stores..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#a3aed0" }} />
                    </InputAdornment>
                ),
              }}
              sx={{ 
                width: "350px",
                "& .MuiOutlinedInput-root": { 
                    borderRadius: "15px", 
                    backgroundColor: "#f4f7fe",
                    "& fieldset": { border: "none" }
                }
              }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "0.85rem", py: 3 }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "0.85rem", py: 3 }}>STORE NAME</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "0.85rem", py: 3 }}>CITY</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "0.85rem", py: 3 }}>MOBILE</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "0.85rem", py: 3 }}>EMAIL</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "0.85rem", py: 3 }}>ITEM SALE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequirements.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}>No stores found</TableCell></TableRow>
              ) : (
                filteredRequirements.map((item, index) => (
                  <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>{index + 1}</TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "800" }}>{item.storeName}</TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>{item.city}</TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{item.mobile}</TableCell>
                    <TableCell sx={{ color: "#a3aed0" }}>{item.email}</TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        variant="text" 
                        onClick={() => navigate("/sales-report")}
                        sx={{ color: "#2d60ff", fontWeight: "700", textTransform: "none" }}
                      >
                        Item Sale report
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );

  const renderDetailView = () => (
    <>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <IconButton onClick={() => setView("list")} sx={{ bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", "&:hover": { bgcolor: "#f1f1f1" } }}>
              <ArrowBackIcon sx={{ color: "#2d60ff" }} />
          </IconButton>
          <Typography variant="h3" fontWeight="800" color="#1b2559" sx={{ fontSize: "2rem" }}>
              Required Item List {selectedDate}
          </Typography>
      </Stack>

      <Paper sx={{ p: 4, borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", mb: 4 }}>
        <Stack direction="row" spacing={3} alignItems="flex-end" sx={{ mb: 4 }}>
            <Box sx={{ minWidth: "220px" }}>
                <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1, textTransform: "uppercase", fontSize: "0.75rem" }}>Select Date</Typography>
                <TextField
                    type="date"
                    fullWidth
                    size="small"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", backgroundColor: "#f4f7fe", "& fieldset": { borderColor: "#e9edf7" } } }}
                />
            </Box>
            <Box>
                <Typography variant="body1" color="#a3aed0" fontWeight="500">Viewing requirements for <b>{selectedStore?.storeName}</b></Typography>
            </Box>
        </Stack>

        <TableContainer sx={{ border: "1px solid #f1f1f1", borderRadius: "15px", overflow: "hidden" }}>
            <Table>
                <TableHead sx={{ backgroundColor: "#f4f7fe" }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "700", color: "#a3aed0", width: 80, py: 2 }}>#</TableCell>
                        <TableCell sx={{ fontWeight: "700", color: "#a3aed0", py: 2 }}>PRODUCT NAME</TableCell>
                        <TableCell sx={{ fontWeight: "700", color: "#a3aed0", py: 2 }}>QUANTITY</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {detailItems.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} align="center" sx={{ py: 8 }}>
                                <Box sx={{ opacity: 0.2, mb: 1 }}>
                                    <EventNoteIcon sx={{ fontSize: 60 }} />
                                </Box>
                                <Typography variant="h6" fontWeight="600" color="#a3aed0">No data found</Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        detailItems.map((item, index) => (
                            <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                                <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>{index + 1}</TableCell>
                                <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>{item.name}</TableCell>
                                <TableCell sx={{ color: "#2d60ff", fontWeight: "800" }}>{item.quantity}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
      </Paper>
    </>
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
        {view === "list" ? renderListView() : renderDetailView()}
    </Box>
  );
};

export default ItemRequirement;
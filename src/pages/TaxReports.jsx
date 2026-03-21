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
  Stack,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { genericApi } from "../api/genericApi";

const TaxReports = () => {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchTaxReports();
  }, [selectedDate]);

  const fetchTaxReports = async () => {
    try {
      const response = await genericApi.getAll("tax_report");
      const results = response.data.results || response.data || [];
      const formattedData = results.map((item, index) => ({
        id: item._id || index + 1,
        productName: item["Product Name"] || item.productName || "Unknown Product",
        quantity: item["Quantity"] || item.quantity || "0",
      }));
      setReports(formattedData);
    } catch (error) {
      console.error("Error fetching tax reports:", error);
    }
  };

  const filteredReports = reports.filter((report) =>
    report.productName.toLowerCase().includes(search.toLowerCase())
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

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="800" color="#2b3674">Hi, Day Catch Super Admin Panel.</Typography>
        <Typography variant="h6" color="#707eae" fontWeight="500">View item-wise tax quantities for administrative records on {selectedDate}.</Typography>
      </Box>

      <Box sx={{ mb: 6 }}>
        <StatsCard title="Taxed Products" value={reports.length} icon={<AssessmentIcon sx={{ color: "#2d60ff" }} />} />
      </Box>

      <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "none" }}>
        <Box sx={{ p: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Typography variant="h5" fontWeight="700" color="#1b2559">Item TAX List</Typography>
            <TextField
                type="date"
                size="small"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                sx={{ 
                    "& .MuiOutlinedInput-root": { 
                        borderRadius: "12px", 
                        backgroundColor: "#f4f7fe", 
                        "& fieldset": { border: "none" } 
                    },
                    width: "180px"
                }}
            />
          </Stack>
          
          <TextField
              size="small"
              placeholder="Search products..."
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
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "0.85rem", py: 3 }}>PRODUCT NAME</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "0.85rem", py: 3, pr: 4 }}>QUANTITY</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 8 }}>
                    <Box sx={{ opacity: 0.2, mb: 1 }}>
                        <EventNoteIcon sx={{ fontSize: 60 }} />
                    </Box>
                    <Typography variant="h6" fontWeight="600" color="#a3aed0">No data found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report, index) => (
                  <TableRow key={report.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>{index + 1}</TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "800" }}>{report.productName}</TableCell>
                    <TableCell align="right" sx={{ pr: 4, color: "#2d60ff", fontWeight: "800" }}>
                        {report.quantity}
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

export default TaxReports;
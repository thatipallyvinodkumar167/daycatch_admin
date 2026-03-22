import React, { useState, useEffect } from "react";
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
  Button,
  CircularProgress,
  Chip,
  IconButton,
  Avatar,
  Stack,
  Tooltip,
  Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from "@mui/icons-material/Print";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PaidIcon from "@mui/icons-material/Paid";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const IncentiveHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [boy, setBoy] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Using sample data source or your specific API endpoint
        const userRes = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
        setBoy(userRes.data);
        
        // Mocking high-fidelity history data
        const mockHistory = [
          { id: 1, date: "2024-03-10", amount: 1500, method: "UPI", ref: "TXN987654SB", status: "Success" },
          { id: 2, date: "2024-03-01", amount: 2200, method: "Bank Transfer", ref: "TXN123456FT", status: "Success" },
          { id: 3, date: "2024-02-15", amount: 1800, method: "Bank Transfer", ref: "TXN554433RD", status: "Success" },
        ];
        setHistory(mockHistory);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress sx={{ color: "#4318ff" }} />
      </Box>
    );
  }

  const totalSettled = history.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Header with Navigation */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title="Go Back">
            <IconButton 
              onClick={() => navigate(-1)} 
              sx={{ 
                bgcolor: "#fff", 
                color: "#4318ff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                "&:hover": { bgcolor: "#4318ff", color: "#fff" }
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}> Settlement Audit</Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
              Reviewing payout history for <span style={{ color: "#1b2559", fontWeight: "800" }}>{boy?.name || "Personnel #"+id}</span>
            </Typography>
          </Box>
        </Box>
        
        <Stack direction="row" spacing={1.5}>
            <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                sx={{ borderRadius: "12px", textTransform: "none", fontWeight: "700", borderColor: "#e0e5f2", color: "#1b2559" }}
            >
                Print Statement
            </Button>
            <Button
                variant="contained"
                startIcon={<FileDownloadIcon />}
                sx={{ borderRadius: "12px", textTransform: "none", fontWeight: "700", bgcolor: "#4318ff", "&:hover": { bgcolor: "#3311cc" } }}
            >
                Export PDF
            </Button>
        </Stack>
      </Box>

      {/* Summary Cards */}
      <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
        <Paper sx={{ p: 3, flex: 1, borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 2, borderLeft: "6px solid #24d164" }}>
          <Avatar sx={{ bgcolor: "#e6f9ed", color: "#24d164", width: 52, height: 52 }}>
            <PaidIcon />
          </Avatar>
          <Box>
            <Typography variant="caption" color="#a3aed0" fontWeight="800">TOTAL SETTLED</Typography>
            <Typography variant="h5" fontWeight="800" color="#1b2559">₹{totalSettled.toLocaleString()}</Typography>
          </Box>
        </Paper>
        <Paper sx={{ p: 3, flex: 1, borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 2, borderLeft: "6px solid #4318ff" }}>
          <Avatar sx={{ bgcolor: "#eef2ff", color: "#4318ff", width: 52, height: 52 }}>
            <AccountBalanceIcon />
          </Avatar>
          <Box>
            <Typography variant="caption" color="#a3aed0" fontWeight="800">TOTAL TRANSACTIONS</Typography>
            <Typography variant="h5" fontWeight="800" color="#1b2559">{history.length}</Typography>
          </Box>
        </Paper>
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
        <Box sx={{ p: 3, borderBottom: "1px solid #f1f1f1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight="800" color="#1b2559">Financial Ledger</Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", py: 2, pl: 4, borderBottom: "1px solid #e0e5f2" }}>DATE</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>AMOUNT SETTLED</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>PAYMENT METHOD</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>TRANSACTION REFERENCE</TableCell>
                <TableCell align="right" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", pr: 4, borderBottom: "1px solid #e0e5f2" }}>STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" color="#a3aed0" fontWeight="600">No Transaction History Found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                history.map((row) => (
                  <TableRow key={row.id} sx={{ "&:hover": { bgcolor: "#f9fafc" }, transition: "0.2s" }}>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700", pl: 4 }}>{row.date}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="800" color="#24d164">₹{row.amount.toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#4318ff" }} />
                            <Typography variant="body2" fontWeight="600" color="#475467">{row.method}</Typography>
                        </Stack>
                    </TableCell>
                    <TableCell>
                        <Typography
                          sx={{
                            color: "#a3aed0",
                            fontFamily: "monospace",
                            fontSize: "12px",
                            fontWeight: "700",
                            bgcolor: "#f4f7fe",
                            px: 1,
                            borderRadius: "6px",
                            letterSpacing: "0.5px"
                          }}
                        >
                          {row.ref}
                        </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Chip 
                        label={row.status.toUpperCase()} 
                        size="small" 
                        sx={{ 
                          bgcolor: "#e6f9ed", 
                          color: "#24d164", 
                          fontWeight: "900",
                          fontSize: "10px",
                          borderRadius: "10px",
                          px: 1,
                          height: "24px"
                        }} 
                      />
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

export default IncentiveHistory;

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
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const IncentiveHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [boy, setBoy] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
        setBoy(userRes.data);
        
        // Mocking history data
        const mockHistory = [
          { id: 1, date: "2024-03-10", amount: "₹1,500", method: "UPI", ref: "TXN987654", status: "Success" },
          { id: 2, date: "2024-03-01", amount: "₹2,200", method: "Bank Transfer", ref: "TXN123456", status: "Success" },
          { id: 3, date: "2024-02-15", amount: "₹1,800", method: "Bank Transfer", ref: "TXN554433", status: "Success" },
        ];
        setHistory(mockHistory);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching history:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <Button onClick={() => navigate(-1)} sx={{ minWidth: "auto", color: "#2b3674" }}>
          <ArrowBackIcon />
        </Button>
        <Box>
          <Typography variant="h4" fontWeight="700" color="#2b3674">Payment History</Typography>
          <Typography variant="body1" color="textSecondary">Payout records for {boy.name}</Typography>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        <Box sx={{ p: 3, borderBottom: "1px solid #f1f1f1" }}>
          <Typography variant="h6" fontWeight="600" color="#1b2559">All Payout Transactions</Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Method</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Reference ID</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{row.date}</TableCell>
                  <TableCell sx={{ color: "#24d164", fontWeight: "700" }}>{row.amount}</TableCell>
                  <TableCell>{row.method}</TableCell>
                  <TableCell sx={{ color: "#475467", fontSize: "12px" }}>{row.ref}</TableCell>
                  <TableCell>
                    <Chip size="small" label={row.status} sx={{ backgroundColor: "#e6f9ed", color: "#24d164", fontWeight: "700" }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default IncentiveHistory;

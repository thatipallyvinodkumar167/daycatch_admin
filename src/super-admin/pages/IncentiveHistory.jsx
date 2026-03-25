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
  Button,
  CircularProgress,
  Chip,
  IconButton,
  Avatar,
  Stack,
  Tooltip,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PaidIcon from "@mui/icons-material/Paid";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { genericApi } from "../../api/genericApi";
import {
  formatCurrency,
  normalizeIncentiveRecord,
} from "../../utils/deliveryIncentiveUtils";

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
        const response = await genericApi.getOne("deliveryboy_incentives", id);
        const record = response.data?.data || response.data?.results || response.data;
        const normalizedRecord = normalizeIncentiveRecord(record);
        setBoy(normalizedRecord);
        setHistory(normalizedRecord.history || []);
      } catch (error) {
        console.error("Error fetching incentive history:", error);
        setBoy(null);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleExportCsv = () => {
    if (history.length === 0) {
      alert("No transaction history found.");
      return;
    }

    const rows = [
      ["Date", "Amount", "Method", "Reference", "Status", "Notes"].join(","),
      ...history.map((entry) =>
        [
          `"${new Date(entry.date).toLocaleString("en-IN")}"`,
          entry.amount,
          `"${String(entry.method || "").replace(/"/g, '""')}"`,
          `"${String(entry.ref || "").replace(/"/g, '""')}"`,
          `"${String(entry.status || "").replace(/"/g, '""')}"`,
          `"${String(entry.notes || "").replace(/"/g, '""')}"`,
        ].join(",")
      ),
    ];

    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `driver-incentive-history-${id}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress sx={{ color: "#4318ff" }} />
      </Box>
    );
  }

  if (!boy) {
    return (
      <Box sx={{ p: 4, textAlign: "center", mt: 10 }}>
        <Typography variant="h5" color="error" gutterBottom fontWeight="800">
          Incentive History Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          The selected driver incentive record could not be loaded.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/delivery-boy-incentive")} sx={{ bgcolor: "#1b2559", borderRadius: "10px" }}>
          Back to Incentives
        </Button>
      </Box>
    );
  }

  const totalSettled = history.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title="Go Back">
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                bgcolor: "#fff",
                color: "#4318ff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                "&:hover": { bgcolor: "#4318ff", color: "#fff" },
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
              Settlement Audit
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
              Reviewing payout history for <span style={{ color: "#1b2559", fontWeight: "800" }}>{boy.name}</span>
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
            sx={{ borderRadius: "12px", textTransform: "none", fontWeight: "700", borderColor: "#e0e5f2", color: "#1b2559" }}
          >
            Print Statement
          </Button>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportCsv}
            sx={{ borderRadius: "12px", textTransform: "none", fontWeight: "700", bgcolor: "#4318ff", "&:hover": { bgcolor: "#3311cc" } }}
          >
            Export CSV
          </Button>
        </Stack>
      </Box>

      <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
        <Paper sx={{ p: 3, flex: 1, borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 2, borderLeft: "6px solid #24d164" }}>
          <Avatar sx={{ bgcolor: "#e6f9ed", color: "#24d164", width: 52, height: 52 }}>
            <PaidIcon />
          </Avatar>
          <Box>
            <Typography variant="caption" color="#a3aed0" fontWeight="800">TOTAL SETTLED</Typography>
            <Typography variant="h5" fontWeight="800" color="#1b2559">{formatCurrency(totalSettled)}</Typography>
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
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>NOTES</TableCell>
                <TableCell align="right" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", pr: 4, borderBottom: "1px solid #e0e5f2" }}>STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" color="#a3aed0" fontWeight="600">No Transaction History Found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                history.map((row) => (
                  <TableRow key={row.id} sx={{ "&:hover": { bgcolor: "#f9fafc" }, transition: "0.2s" }}>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700", pl: 4 }}>
                      {new Date(row.date).toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="800" color="#24d164">{formatCurrency(row.amount)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600" color="#475467">{row.method}</Typography>
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
                          letterSpacing: "0.5px",
                        }}
                      >
                        {row.ref}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: "#475467", maxWidth: "220px" }}>{row.notes || "-"}</TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Chip
                        label={String(row.status || "Success").toUpperCase()}
                        size="small"
                        sx={{
                          bgcolor: "#e6f9ed",
                          color: "#24d164",
                          fontWeight: "900",
                          fontSize: "10px",
                          borderRadius: "10px",
                          px: 1,
                          height: "24px",
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



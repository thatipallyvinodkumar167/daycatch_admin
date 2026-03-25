import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
  alpha,
  Paper,
} from "@mui/material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

function StoreItemRequirement() {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Date state (dd-mm-yyyy format display, but yyyy-mm-dd for input)
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [selectedDate, setSelectedDate] = useState(todayStr);
  
  const [tableData, setTableData] = useState([]);

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1b2559", mb: 0.5, letterSpacing: "-1.5px" }}>
              Item Requirement
            </Typography>
            <Typography variant="body2" fontWeight="700" color="#a3aed0">
              Required Product List for {store.name}
            </Typography>
          </Box>
        </Stack>

        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: "28px", boxShadow: "0 18px 40px rgba(15,23,42,0.04)", border: "1px solid #e0e5f2" }}>
          
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} flexWrap="wrap" useFlexGap>
            <Typography variant="h4" fontWeight="800" color="#1b2559">
              Required Product List
            </Typography>
            
            <Box>
              <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ display: "block", mb: 0.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Date (DD-MM-YYYY)
              </Typography>
              <TextField
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                size="small"
                InputProps={{
                  sx: {
                    borderRadius: "12px",
                    bgcolor: "#f8f9fc",
                    fontWeight: 700,
                    color: "#1b2559",
                    "& fieldset": { borderColor: "rgba(224,229,242,0.8)" },
                    "&:hover fieldset": { borderColor: "#E53935" },
                    "&.Mui-focused fieldset": { borderColor: "#E53935", borderWidth: "2px" },
                  }
                }}
              />
            </Box>
          </Stack>

          <TableContainer sx={{ borderRadius: "16px", border: "1px solid #e0e5f2", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#f8f9fc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", width: "80px", py: 2 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", py: 2 }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", py: 2, textAlign: "right" }}>Stock</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 8 }}>
                      <Typography variant="h6" color="#a3aed0" fontWeight="800">No data found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  tableData.map((row, index) => (
                    <TableRow key={index} hover sx={{ "&:last-child td, &:last-child th": { border: 0 }, transition: "0.2s", "&:hover": { bgcolor: alpha("#E53935", 0.03) } }}>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559", py: 2.5 }}>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559", py: 2.5 }}>{row.productName}</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#E53935", py: 2.5, textAlign: "right" }}>{row.stock}</TableCell>
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
}

export default StoreItemRequirement;

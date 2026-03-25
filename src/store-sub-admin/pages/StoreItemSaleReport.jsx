import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";
import { formatStoreDate, matchesStoreRecord } from "../utils/storeWorkspace";

function StoreItemSaleReport() {
  const { store } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchSalesReport = async () => {
      try {
        const response = await genericApi.getAll("item_sale_report");
        const rows = response?.data?.results || response?.data?.data || [];
        const matchedRows = rows.filter((row) => matchesStoreRecord(row, store));
        const effectiveRows = matchedRows.length ? matchedRows : rows;

        setTableData(
          effectiveRows.map((row, index) => ({
            id: String(row._id ?? row.id ?? index),
            productName: row["Product Name"] || row.productName || "Unnamed Product",
            stock: Number(row.Stock ?? row.stock ?? 0),
            date: row.Date || row.date || row["Created At"] || row.createdAt || "",
          }))
        );
      } catch (error) {
        console.error("Unable to load item sales report:", error);
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesReport();
  }, [store]);

  const filteredRows = useMemo(
    () =>
      tableData.filter((row) =>
        row.productName.toLowerCase().includes(searchTerm.toLowerCase().trim())
      ),
    [searchTerm, tableData]
  );

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1b2559", mb: 0.5, letterSpacing: "-1.5px" }}>
              Item Sales Report
            </Typography>
            <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>
              Sales breakdown for {store.name} in the last 30 days
            </Typography>
          </Box>
        </Stack>

        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: "24px", boxShadow: "0 18px 40px rgba(15,23,42,0.04)", border: "1px solid #e0e5f2" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} flexWrap="wrap" useFlexGap>
            <Typography variant="h4" fontWeight="800" color="#1b2559">
              Item Sales Report (Last 30 Days)
            </Typography>
            <TextField
              placeholder="Search products..."
              size="small"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#a3aed0" }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "14px",
                  bgcolor: "#f8f9fc",
                  width: { xs: "100%", sm: "280px" },
                  fontWeight: 600,
                  "& fieldset": { borderColor: "rgba(224,229,242,0.8)" },
                },
              }}
            />
          </Stack>

          <TableContainer sx={{ borderRadius: "16px", border: "1px solid #e0e5f2", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#f8f9fc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", width: "80px", py: 2 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", py: 2 }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", py: 2 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", py: 2, textAlign: "right" }}>Stock</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                      <CircularProgress sx={{ color: "#E53935" }} />
                    </TableCell>
                  </TableRow>
                ) : filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                      <Typography variant="h6" color="#a3aed0" fontWeight="800">No data found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((row, index) => (
                    <TableRow key={row.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 }, transition: "0.2s", "&:hover": { bgcolor: alpha("#E53935", 0.03) } }}>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559", py: 2.5 }}>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559", py: 2.5 }}>{row.productName}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#a3aed0", py: 2.5 }}>{formatStoreDate(row.date)}</TableCell>
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

export default StoreItemSaleReport;

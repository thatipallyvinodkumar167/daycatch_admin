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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { getAllDeliveryBoys, deleteDeliveryBoy } from "../api/deliveryBoyApi";
import {
  formatDeliveryBoyStatus,
  isDeliveryBoyOffDuty,
} from "../utils/deliveryBoyUtils";

const DeliveryBoy = () => {
  const navigate = useNavigate();
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const fetchDeliveryBoys = async () => {
    try {
      const response = await getAllDeliveryBoys();
      const list = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
          ? response.data
          : [];
      setDeliveryBoys(list);
    } catch (error) {
      console.error("Error fetching delivery boys:", error);
    }
  };

  const filteredBoys = React.useMemo(() => {
    return deliveryBoys.filter(
      (item) =>
        (item.boyName || item.name)
          ?.toLowerCase()
          .includes(search.toLowerCase().trim()) ||
        (item.boyMobile || item.phone)
          ?.toLowerCase()
          .includes(search.toLowerCase().trim())
    );
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
        const serverMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message;
        alert(serverMessage || "Failed to delete delivery boy.");
      }
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Here is your admin panel.
        </Typography>
      </Box>

      <Paper
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
          border: "1px solid #e0e5f2",
          background: "#fff",
        }}
      >
        <Box
          sx={{
            p: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #f1f1f1",
            background: "linear-gradient(90deg, #fff 0%, #fafbfc 100%)",
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="800" color="#1b2559">
              Fleet Management
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
              Monitor real-time delivery performance and duty status of your personnel.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate("/delivery-boy-list/add")}
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "#E53935",
              "&:hover": { backgroundColor: "#C62828" },
              borderRadius: "14px",
              textTransform: "none",
              px: 4,
              py: 1.5,
              fontWeight: "700",
              boxShadow: "0 6px 20px rgba(229, 57, 53, 0.3)",
            }}
          >
            Add New Boy
          </Button>
        </Box>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 4, backgroundColor: "#fff" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ px: 2, py: 1, backgroundColor: "#f4f7fe", borderRadius: "10px" }}>
                <Typography variant="body2" fontWeight="800" color="#1b2559">
                    {filteredBoys.length} <span style={{ color: "#a3aed0", fontWeight: "600" }}>Total Fleet</span>
                </Typography>
            </Box>
            <Box sx={{ px: 2, py: 1, backgroundColor: "#e6f9ed", borderRadius: "10px" }}>
                <Typography variant="body2" fontWeight="800" color="#24d164">
                    {deliveryBoys.filter(b => !isDeliveryBoyOffDuty(b.status)).length} <span style={{ color: "#24d164", opacity: 0.7, fontWeight: "600" }}>On Duty</span>
                </Typography>
            </Box>
          </Box>
          <TextField
            size="small"
            placeholder="Search by name, phone or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": { 
                borderRadius: "12px", 
                backgroundColor: "#f4f7fe", 
                border: "none",
                "& fieldset": { border: "none" }
              },
              width: "350px",
            }}
          />
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px", py: 2, pl: 4 }}>#</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px" }}>PERSONNEL</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px" }}>CONTACT INFO</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px" }}>ACCESS KEY</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px" }}>DUTY STATUS</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px" }}>DELIVERIES</TableCell>
                <TableCell align="center" sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px" }}>PROFILE</TableCell>
                <TableCell align="right" sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px", pr: 4 }}>MANAGEMENT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBoys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" color="textSecondary" fontWeight="600">
                        No Delivery Boys Found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBoys.map((item, index) => {
                  const isOffDuty = isDeliveryBoyOffDuty(item.status);

                  return (
                    <TableRow
                      key={item._id || item.id}
                      sx={{
                        "&:hover": { backgroundColor: "#f9fafc" },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <TableCell sx={{ color: "#a3aed0", fontWeight: "600", pl: 4 }}>
                        {String(index + 1).padStart(2, '0')}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="800" color="#1b2559">
                          {item.boyName || item.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="600" color="#475467">
                          {item.boyMobile || item.phone}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color: "#a3aed0",
                            fontFamily: "Monaco, monospace",
                            fontSize: "12px",
                            letterSpacing: "1px",
                            backgroundColor: "#f4f7fe",
                            px: 1,
                            py: 0.2,
                            borderRadius: "4px",
                            display: "inline-block"
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
                            backgroundColor: isOffDuty ? "#FFF5F5" : "#E6FFFA",
                            color: isOffDuty ? "#E53935" : "#2ED480",
                            fontWeight: "900",
                            fontSize: "10px",
                            borderRadius: "8px",
                            px: 1.5,
                            height: "24px"
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ 
                          display: "inline-flex", 
                          alignItems: "center", 
                          gap: 1,
                          backgroundColor: "#f4f7fe",
                          borderRadius: "12px",
                          px: 2,
                          py: 0.5,
                          border: "1px solid #e0e5f2"
                        }}>
                          <Typography
                            onClick={() =>
                              navigate(
                                `/delivery-boy-list/orders/${item._id || item.id}`
                              )
                            }
                            sx={{
                              color: "#E53935",
                              fontWeight: "900",
                              fontSize: "14px",
                              cursor: "pointer",
                              "&:hover": { textDecoration: "underline" },
                            }}
                          >
                            {item.orders ?? 0}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate(
                              `/delivery-boy-list/details/${item._id || item.id}`
                            )
                          }
                          sx={{
                            backgroundColor: "#f4f7fe",
                            color: "#1b2559",
                            borderRadius: "12px",
                            transition: "all 0.3s",
                            "&:hover": { backgroundColor: "#1b2559", color: "#fff", transform: "translateY(-2px)" },
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          justifyContent="flex-end"
                        >
                          <IconButton
                            onClick={() =>
                              navigate(
                                `/delivery-boy-list/edit/${item._id || item.id}`
                              )
                            }
                            sx={{
                              color: "#2ED480",
                              backgroundColor: "rgba(46, 212, 128, 0.1)",
                              borderRadius: "10px",
                              "&:hover": { backgroundColor: "#2ED480", color: "#fff" },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(item._id || item.id)}
                            sx={{
                              color: "#E53935",
                              backgroundColor: "rgba(229, 57, 53, 0.1)",
                              borderRadius: "10px",
                              "&:hover": { backgroundColor: "#E53935", color: "#fff" },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
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
  );
};

export default DeliveryBoy;

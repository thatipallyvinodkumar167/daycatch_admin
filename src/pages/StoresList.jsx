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
  Avatar,
  IconButton,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Grid,
  Modal,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Collapse,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StorefrontIcon from "@mui/icons-material/Storefront";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../api/genericApi";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", md: 680 },
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
};

const emptyForm = {
  storeImage: null, storeImagePreview: null,
  name: "", employeeName: "", storeNumber: "",
  adminShare: "", email: "", password: "",
  idType: "", idNumber: "", idImage: null, idImagePreview: null,
  city: "", deliveryRange: "", address: "",
  ordersPerSlot: "", startTime: "", endTime: "", slotInterval: "",
};

const ID_TYPES = ["Aadhar Card", "PAN Card", "Driving License", "Passport", "Voter ID"];

const StoresList = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [expandedStoreId, setExpandedStoreId] = useState(null);

  const toggleExpand = (id) => setExpandedStoreId(expandedStoreId === id ? null : id);

  const handleOpenDetails = (store) => {
    setSelectedStore(store);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStore(null);
  };

  const handleOpenAdd = () => navigate("/stores/add");

  const handleOpenEdit = (store) => {
    setFormData({
      ...emptyForm,
      name: store.name,
      email: store.email,
      storeNumber: store.phone,
      city: store.city,
      address: store.address,
      employeeName: store.owner,
      adminShare: store.adminShare || "",
    });
    setIsEditing(true);
    setEditId(store.id);
    setAddEditOpen(true);
  };

  const handleCloseAddEdit = () => {
    setAddEditOpen(false);
    setFormData(emptyForm);
  };

  const handleImageChange = (field, previewField) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1000 * 1024) { alert("Image size should be less than 1000 KB"); return; }
    const reader = new FileReader();
    reader.onloadend = () => setFormData(prev => ({ ...prev, [field]: file, [previewField]: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleFieldChange = (key) => (e) => setFormData(prev => ({ ...prev, [key]: e.target.value }));

  const handleSave = async () => {
    if (!formData.name.trim()) { alert("Store name is required."); return; }
    try {
      const payload = {
        "Store Name": formData.name,
        "Employee Name": formData.employeeName,
        Mobile: formData.storeNumber,
        "admin share": formData.adminShare,
        Email: formData.email,
        password: formData.password,
        "ID Type": formData.idType,
        "ID Number": formData.idNumber,
        City: formData.city,
        "Delivery Range": formData.deliveryRange,
        address: formData.address,
        "Orders Per Slot": formData.ordersPerSlot,
        "Start Time": formData.startTime,
        "End Time": formData.endTime,
        "Slot Interval": formData.slotInterval,
        ...(formData.storeImagePreview && { "Profile Pic": formData.storeImagePreview }),
        ...(formData.idImagePreview && { "ID Image": formData.idImagePreview }),
      };
      if (isEditing) {
        await genericApi.update("storeList", editId, payload);
        alert("Store updated successfully!");
      } else {
        await genericApi.create("storeList", payload);
        alert("Store added successfully!");
      }
      handleCloseAddEdit();
      fetchStores();
    } catch (error) {
      console.error("Error saving store:", error);
      alert("Failed to save store: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete store "${name}"?`)) return;
    try {
      await genericApi.remove("storeList", id);
      fetchStores();
    } catch (error) {
      console.error("Error deleting store:", error);
      alert("Failed to delete store.");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = (currentStatus || "").toLowerCase() === "active" ? "Inactive" : "Active";
      await genericApi.update("storeList", id, { status: newStatus });
      fetchStores();
      alert(`Store ${newStatus === "Active" ? "unblocked" : "blocked"} successfully!`);
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await genericApi.getAll("storeList");
      const results = response.data.results || response.data || [];
      
      const formattedData = results.map((store, index) => ({
        id: store._id || index,
        name: store["Store Name"] || store.name || "Unnamed Store",
        email: store.Email || store.email || store.mail || "N/A",
        phone: store.Mobile || store.phone || store.contact || "N/A",
        city: store.City || store.city || "N/A",
        totalOrders: store.orders || store.Orders || 0,
        status: store.status || "Active",
        logo: store["Profile Pic"] || store.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(store["Store Name"] || store.name || "S")}&background=4318ff&color=fff`,
        owner: store["Employee Name"] || store["owner name"] || store.ownerName || "N/A",
        address: store.address || store.Address || "N/A",
        time: (store["Start Time"] && store["End Time"])
          ? `${store["Start Time"]} - ${store["End Time"]}`
          : (store.time || "N/A"),
        adminShare: store["admin share"] || store["Admin Share"] || store.adminShare || 0,
        // ID Verification
        idType: store["ID Type"] || "Aadhar Card",
        aadhaar: store["ID Number"] || store.aadhaar || "N/A",
        aadhaarPhoto: store["ID Image"] || store.aadhaarPhoto || null,
        // Extra
        ordersPerSlot: store["Orders Per Slot"] || store.orders || store.Orders || "N/A",
        deliveryRange: store["Delivery Range"] || "N/A",
        slotInterval: store["Slot Interval"] || "N/A",
        storeNumber: store.Mobile || store.phone || "N/A",
      }));

      setStores(formattedData);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase().trim()) ||
    store.city.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" fontWeight="700" color="#2b3674">
            Hi, Day Catch Super Admin Panel.{" "}
            <Box component="span" sx={{ fontSize: "18px", fontWeight: "400", color: "#a3aed0" }}>
              Here is your admin panel.
            </Box>
          </Typography>
        </Box>
      </Box>

      {/* Stats Section */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "Total Stores", value: stores.length, color: "#2d60ff", bg: "#e0e7ff" },
          { label: "Active Stores", value: stores.filter(s => s.status === "Active").length, color: "#24d164", bg: "#e6f9ed" },
          { label: "Pending Approval", value: stores.filter(s => s.status === "Pending").length, color: "#ffb800", bg: "#fff8e6" },
        ].map((stat) => (
          <Paper key={stat.label} sx={{ flex: 1, p: 3, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: stat.bg }}>
                <StorefrontIcon sx={{ color: stat.color }} />
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary" fontWeight="600">{stat.label}</Typography>
                <Typography variant="h5" fontWeight="800" color="#1b2559">{stat.value}</Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6" fontWeight="700" color="#1b2559">Store List</Typography>
            <Button
              variant="contained"
              onClick={handleOpenAdd}
              sx={{
                backgroundColor: "#2d60ff",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "700",
                px: 3,
                boxShadow: "0 4px 10px rgba(45,96,255,0.1)",
                "&:hover": { backgroundColor: "#1e4de6" }
              }}
            >
              Add
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="#a3aed0" fontWeight="600">Search:</Typography>
            <TextField
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" }, width: "200px" }}
            />
            <Button variant="outlined" sx={{ borderRadius: "8px", textTransform: "none", color: "#475467", borderColor: "#e0e5f2", fontWeight: "600" }}>Print</Button>
            <Button variant="outlined" sx={{ borderRadius: "8px", textTransform: "none", color: "#475467", borderColor: "#e0e5f2", fontWeight: "600" }}>CSV</Button>
          </Stack>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", width: 50 }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>PROFILE PIC</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>STORE NAME</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>CITY</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>MOBILE</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>EMAIL</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>ORDERS</TableCell>
                <TableCell align="center" sx={{ fontWeight: "700", color: "#a3aed0" }}>DETAILS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    No Stores Found
                  </TableCell>
                </TableRow>
              ) : (
                filteredStores.map((store, index) => (
                  <React.Fragment key={store.id}>
                    <TableRow sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>
                        <IconButton size="small" onClick={() => toggleExpand(store.id)} sx={{ color: "#a3aed0" }}>
                          {expandedStoreId === store.id ? <RemoveCircleOutlineIcon fontSize="inherit" /> : <AddCircleOutlineIcon fontSize="inherit" />}
                        </IconButton>
                        <span style={{ marginLeft: "8px" }}>{index + 1}</span>
                      </TableCell>
                      <TableCell>
                        <Avatar src={store.logo} sx={{ borderRadius: "10px", width: 40, height: 40, border: "2px solid #f4f7fe" }} />
                      </TableCell>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>{store.name}</TableCell>
                      <TableCell sx={{ color: "#475467" }}>{store.city}</TableCell>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>{store.storeNumber || store.phone}</TableCell>
                      <TableCell sx={{ color: "#475467" }}>{store.email}</TableCell>
                      <TableCell>
                        <StorefrontIcon sx={{ color: "#24d164" }} />
                      </TableCell>
                      <TableCell align="center">
                        <Button 
                          variant="contained" 
                          onClick={() => handleOpenDetails(store)}
                          sx={{ backgroundColor: "#4318ff", borderRadius: "8px", textTransform: "none", fontWeight: "700" }}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                    {/* Collapsible Action Row */}
                    <TableRow>
                      <TableCell colSpan={8} sx={{ py: 0, border: "none" }}>
                        <Collapse in={expandedStoreId === store.id} timeout="auto" unmountOnExit>
                          <Box sx={{
                            py: 3, px: 4,
                            display: "flex", alignItems: "center", gap: 4,
                            backgroundColor: "#f4f7fe",
                            borderBottom: "1px solid #e0e5f2",
                            borderLeft: "6px solid #4318ff",
                          }}>
                            <Typography variant="caption" fontWeight="900" color="#4318ff" sx={{ textTransform: "uppercase", letterSpacing: 2 }}>Quick Actions</Typography>
                            <Stack direction="row" spacing={2}>
                              <Tooltip title="Edit Store Details">
                                <Button
                                  variant="contained"
                                  startIcon={<EditIcon sx={{ fontSize: "16px !important" }} />}
                                  onClick={() => handleOpenEdit(store)}
                                  sx={{ backgroundColor: "#24d164", color: "#fff", borderRadius: "10px", px: 2, textTransform: "none", fontWeight: "700", boxShadow: "0 4px 12px rgba(36,209,100,0.2)", "&:hover": { backgroundColor: "#1eb856" } }}
                                >
                                  Edit
                                </Button>
                              </Tooltip>

                              <Tooltip title="View Inventory / Items">
                                <Button
                                  variant="contained"
                                  startIcon={<ShoppingBagIcon sx={{ fontSize: "16px !important" }} />}
                                  sx={{ backgroundColor: "#1b2559", color: "#fff", borderRadius: "10px", px: 2, textTransform: "none", fontWeight: "700", boxShadow: "0 4px 12px rgba(27,37,89,0.2)", "&:hover": { backgroundColor: "#111a40" } }}
                                >
                                  Items
                                </Button>
                              </Tooltip>

                              <Tooltip title={store.status === "Active" ? "Restrict Store Access" : "Grant Store Access"}>
                                <Button
                                  variant="contained"
                                  startIcon={store.status === "Active" ? <LockOpenIcon sx={{ fontSize: "16px !important" }} /> : <LockIcon sx={{ fontSize: "16px !important" }} />}
                                  onClick={() => toggleStatus(store.id, store.status)}
                                  sx={{ backgroundColor: "#ffb800", color: "#fff", borderRadius: "10px", px: 2, textTransform: "none", fontWeight: "700", boxShadow: "0 4px 12px rgba(255,184,0,0.2)", "&:hover": { backgroundColor: "#e6a600" } }}
                                >
                                  {store.status === "Active" ? "Block" : "Unblock"}
                                </Button>
                              </Tooltip>

                              <Tooltip title="Permanently Remove Store">
                                <Button
                                  variant="contained"
                                  startIcon={<DeleteIcon sx={{ fontSize: "16px !important" }} />}
                                  onClick={() => handleDelete(store.id, store.name)}
                                  sx={{ backgroundColor: "#ff4d49", color: "#fff", borderRadius: "10px", px: 2, textTransform: "none", fontWeight: "700", boxShadow: "0 4px 12px rgba(255,77,73,0.2)", "&:hover": { backgroundColor: "#e04340" } }}
                                >
                                  Delete
                                </Button>
                              </Tooltip>
                            </Stack>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add / Edit Store Modal */}
      <Modal open={addEditOpen} onClose={handleCloseAddEdit}>
        <Box sx={modalStyle}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight="700" color="#1b2559">
              {isEditing ? "Edit Store" : "Add New Store"}
            </Typography>
            <IconButton onClick={handleCloseAddEdit} size="small" sx={{ color: "#a3aed0" }}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Divider sx={{ mb: 3 }} />

          <Stack spacing={2.5}>
            {/* Store Image */}
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 0.5 }}>Store Image (It Should Be Less Than 1000 KB)</Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button variant="outlined" component="label" size="small" sx={{ borderRadius: "8px", textTransform: "none", borderColor: "#d1d5db" }}>
                  Choose file
                  <input type="file" accept="image/*" hidden onChange={handleImageChange("storeImage", "storeImagePreview")} />
                </Button>
                {formData.storeImagePreview
                  ? <Avatar src={formData.storeImagePreview} sx={{ width: 48, height: 48, borderRadius: "8px" }} />
                  : <Typography variant="caption" color="textSecondary">No file chosen</Typography>}
              </Stack>
            </Box>

            {/* Row: Store Name + Employee Name */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth size="small" label="Store Name *" value={formData.name} onChange={handleFieldChange("name")} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth size="small" label="Employee Name" value={formData.employeeName} onChange={handleFieldChange("employeeName")} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
              </Grid>
            </Grid>

            {/* Row: Store Number + Admin Share */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth size="small" label="Store Number" value={formData.storeNumber} onChange={handleFieldChange("storeNumber")} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth size="small" label="Admin Share (%)" type="number" value={formData.adminShare} onChange={handleFieldChange("adminShare")} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
              </Grid>
            </Grid>

            {/* Row: Email + Password */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth size="small" label="Email" type="email" value={formData.email} onChange={handleFieldChange("email")} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth size="small" label="Password" type="password" value={formData.password} onChange={handleFieldChange("password")} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
              </Grid>
            </Grid>

            {/* Row: ID Type + ID Number */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Select ID</InputLabel>
                  <Select value={formData.idType} label="Select ID" onChange={handleFieldChange("idType")} sx={{ borderRadius: "10px" }}>
                    {ID_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth size="small" label="ID Number" value={formData.idNumber} onChange={handleFieldChange("idNumber")} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
              </Grid>
            </Grid>

            {/* ID Image */}
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 0.5 }}>ID Image (It Should Be Less Than 1000 KB)</Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button variant="outlined" component="label" size="small" sx={{ borderRadius: "8px", textTransform: "none", borderColor: "#d1d5db" }}>
                  Choose file
                  <input type="file" accept="image/*" hidden onChange={handleImageChange("idImage", "idImagePreview")} />
                </Button>
                {formData.idImagePreview
                  ? <Avatar src={formData.idImagePreview} sx={{ width: 48, height: 48, borderRadius: "8px" }} />
                  : <Typography variant="caption" color="textSecondary">No file chosen</Typography>}
              </Stack>
            </Box>

            {/* Row: City + Delivery Range */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth size="small" label="City" value={formData.city} onChange={handleFieldChange("city")} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth size="small" label="Delivery Range (KM)" type="number" value={formData.deliveryRange} onChange={handleFieldChange("deliveryRange")} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
              </Grid>
            </Grid>

            {/* Store Address */}
            <TextField fullWidth size="small" label="Store Address" placeholder="Enter a location" value={formData.address} onChange={handleFieldChange("address")} multiline rows={2} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />

            {/* Orders Per Time Slot */}
            <TextField fullWidth size="small" label="Orders Per Time Slot" type="number" value={formData.ordersPerSlot} onChange={handleFieldChange("ordersPerSlot")} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />

            {/* Time Slot */}
            <Typography variant="body2" fontWeight="700" color="#1b2559">Time Slot</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField fullWidth size="small" label="Start Time" type="time" value={formData.startTime} onChange={handleFieldChange("startTime")} InputLabelProps={{ shrink: true }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth size="small" label="End Time" type="time" value={formData.endTime} onChange={handleFieldChange("endTime")} InputLabelProps={{ shrink: true }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth size="small" label="Slot Interval" type="number" placeholder="e.g. 30" value={formData.slotInterval} onChange={handleFieldChange("slotInterval")} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }} />
              </Grid>
            </Grid>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mt: 3 }} justifyContent="flex-end">
            <Button onClick={handleCloseAddEdit} sx={{ borderRadius: "10px", textTransform: "none", fontWeight: "600", color: "#475467" }}>Cancel</Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}
              sx={{ backgroundColor: "#4318ff", "&:hover": { backgroundColor: "#3311cc" }, borderRadius: "10px", textTransform: "none", fontWeight: "700", boxShadow: "0 4px 12px rgba(67,24,255,0.3)" }}>
              {isEditing ? "Update Store" : "Add Store"}
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Store Details Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth sx={{ "& .MuiDialog-paper": { borderRadius: "16px" } }}>
        <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "700", color: "#1b2559" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <span>{selectedStore?.name} Store Profile</span>
            <Typography component="span" sx={{ color: selectedStore?.status === "Active" ? "#24d164" : "#ffb800", fontWeight: "700" }}>
              ( {selectedStore?.status || "Active"} )
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: "#a3aed0" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 0 }}>
          {selectedStore && (
            <Box>
              <Box sx={{ p: 3, backgroundColor: "#fafbfc", borderBottom: "1px solid #f1f1f1" }}>
                {[
                  { label: "Store Name", value: selectedStore.name },
                  { label: "Owner Name", value: selectedStore.owner },
                  { label: "Contact", value: selectedStore.phone },
                  { label: "Email", value: selectedStore.email },
                  { label: "Time Slot", value: selectedStore.time || "06:00 - 09:00" },
                  { label: "Address", value: selectedStore.address },
                  { label: "Orders Per Time Slot", value: selectedStore.ordersPerSlot },
                  { label: "Admin Share", value: selectedStore.adminShare ? `${selectedStore.adminShare} %` : "N/A" },
                ].map(({ label, value }) => (
                  <Typography key={label} variant="body2" sx={{ mb: 1, color: "#1b2559" }}>
                    <Box component="span" fontWeight="700">{label} : </Box>{value || "N/A"}
                  </Typography>
                ))}
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f4f7fe" }}>
                      <TableCell sx={{ fontWeight: "700", color: "#1b2559" }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: "700", color: "#1b2559" }}>ID number</TableCell>
                      <TableCell sx={{ fontWeight: "700", color: "#1b2559" }}>ID photo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[{ type: selectedStore.idType || "Aadhar Card", number: selectedStore.aadhaar || "N/A", photo: selectedStore.aadhaarPhoto || null }].map((doc, i) => (
                      <TableRow key={i}>
                        <TableCell sx={{ color: "#475467" }}>{doc.type}</TableCell>
                        <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>{doc.number}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => doc.photo && window.open(doc.photo, "_blank")}
                            sx={{ borderRadius: "8px", textTransform: "none", fontSize: "12px", borderColor: "#d1d5db", color: "#475467" }}
                          >
                            see ID photo
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={handleClose}
                  variant="contained"
                  sx={{ backgroundColor: "#ff4d49", "&:hover": { backgroundColor: "#e64440" }, borderRadius: "8px", textTransform: "none", fontWeight: "700", px: 4 }}
                >
                  Close
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

    </Box>
  );
};

export default StoresList;
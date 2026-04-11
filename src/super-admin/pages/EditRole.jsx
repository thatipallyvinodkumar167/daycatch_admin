import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import BadgeIcon from "@mui/icons-material/Badge";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import BarChartIcon from "@mui/icons-material/BarChart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import MapIcon from "@mui/icons-material/Map";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentsIcon from "@mui/icons-material/Payments";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import PagesIcon from "@mui/icons-material/Pages";
import FeedbackIcon from "@mui/icons-material/Feedback";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SettingsIcon from "@mui/icons-material/Settings";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate, useParams } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const PERMISSION_GROUPS = [
  {
    group: "Core Management",
    color: "#4318ff",
    bg: "#f0edff",
    items: [
      { key: "Dashboard", icon: <DashboardIcon fontSize="small" /> },
      { key: "Users", icon: <PeopleIcon fontSize="small" /> },
      { key: "Reports", icon: <BarChartIcon fontSize="small" /> },
    ],
  },
  {
    group: "Inventory & Sales",
    color: "#00b69b",
    bg: "#e6f9f6",
    items: [
      { key: "Category", icon: <CategoryIcon fontSize="small" /> },
      { key: "Product", icon: <InventoryIcon fontSize="small" /> },
      { key: "Orders", icon: <ShoppingCartIcon fontSize="small" /> },
    ],
  },
  {
    group: "Operations",
    color: "#ff9500",
    bg: "#fff4e5",
    items: [
      { key: "Store", icon: <StoreIcon fontSize="small" /> },
      { key: "Delivery Boy", icon: <DeliveryDiningIcon fontSize="small" /> },
      { key: "Area", icon: <MapIcon fontSize="small" /> },
    ],
  },
  {
    group: "Financials",
    color: "#2d60ff",
    bg: "#e8eeff",
    items: [
      { key: "Tax", icon: <ReceiptLongIcon fontSize="small" /> },
      { key: "Id", icon: <BadgeIcon fontSize="small" /> },
      { key: "Payout", icon: <PaymentsIcon fontSize="small" /> },
    ],
  },
  {
    group: "Promotions",
    color: "#e85d04",
    bg: "#fff1eb",
    items: [
      { key: "Rewards", icon: <EmojiEventsIcon fontSize="small" /> },
      { key: "Membership", icon: <CardMembershipIcon fontSize="small" /> },
    ],
  },
  {
    group: "Communications",
    color: "#7928ca",
    bg: "#f5eeff",
    items: [
      { key: "Notification", icon: <NotificationsIcon fontSize="small" /> },
    ],
  },
  {
    group: "Support & Pages",
    color: "#0070f3",
    bg: "#e5f1ff",
    items: [
      { key: "Callback", icon: <SupportAgentIcon fontSize="small" /> },
      { key: "Feedback", icon: <FeedbackIcon fontSize="small" /> },
      { key: "Pages", icon: <PagesIcon fontSize="small" /> },
    ],
  },
  {
    group: "System Settings",
    color: "#475467",
    bg: "#f2f4f7",
    items: [
      { key: "Settings", icon: <SettingsIcon fontSize="small" /> },
      { key: "Cancelling Reasons", icon: <CancelIcon fontSize="small" /> },
    ],
  },
];

const ALL_KEYS = PERMISSION_GROUPS.flatMap(g => g.items.map(i => i.key));
const permissionFieldByLabel = {
  Dashboard: "dashboard",
  Users: "users",
  Reports: "reports",
  Category: "category",
  Product: "product",
  Orders: "orders",
  Store: "store",
  "Delivery Boy": "delivery_boy",
  Area: "area",
  Tax: "tax",
  Id: "id",
  Payout: "payout",
  Rewards: "rewards",
  Membership: "membership",
  Notification: "notification",
  Callback: "callback",
  Feedback: "feedback",
  Pages: "pages",
  Settings: "settings",
  "Cancelling Reasons": "reason",
};

const EditRole = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [roleName, setRoleName] = useState("");
  const [selected, setSelected] = useState({});

  useEffect(() => {
    const fetchRoleData = async () => {
        try {
            const response = await genericApi.getOne("roles", id);
            const role = response.data;
            if (role) {
                setRoleName(role.role_name || role.name || "");
                const nextSelected = {};
                ALL_KEYS.forEach((key) => {
                  const field = permissionFieldByLabel[key];
                  nextSelected[key] = Boolean(role?.[field]);
                });
                if (role.permissions && typeof role.permissions === "object") {
                  Object.assign(nextSelected, role.permissions);
                }
                setSelected(nextSelected);
            }
        } catch (error) {
            console.error("Error fetching role data:", error);
            alert("Failed to load role details.");
        }
    };

    fetchRoleData();
  }, [id]);

  const toggle = (key) => {
    setSelected(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleGroup = (group) => {
    const keys = group.items.map(i => i.key);
    const allOn = keys.every(k => selected[k]);
    const update = {};
    keys.forEach(k => { update[k] = !allOn; });
    setSelected(prev => ({ ...prev, ...update }));
  };

  const selectAll = () => {
    const all = {};
    ALL_KEYS.forEach(k => { all[k] = true; });
    setSelected(all);
  };

  const clearAll = () => setSelected({});

  const enabledCount = Object.values(selected).filter(Boolean).length;

  const handleSubmit = async () => {
    if (!roleName.trim()) { alert("Please enter a role name."); return; }
    try {
      const permissions = {};
      ALL_KEYS.forEach(k => { permissions[k] = !!selected[k]; });
      
      const payload = { role_name: roleName.trim() };
      ALL_KEYS.forEach((key) => {
        const field = permissionFieldByLabel[key];
        if (field) {
          payload[field] = permissions[key] ? 1 : 0;
        }
      });
      
      await genericApi.update("roles", id, payload);
      alert("Role updated successfully!");
      navigate("/roles");
    } catch (error) {
      console.error("Error updating role:", error.response?.data || error.message);
      const detail = error.response?.data?.message || error.message;
      alert(`Failed to update role: ${detail}`);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton
          onClick={() => navigate("/roles")}
          sx={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight="700" color="#2b3674">Edit Role</Typography>
          <Typography variant="body2" color="textSecondary">
            Modify access permissions for the {roleName || "selected"} role.
          </Typography>
        </Box>
      </Box>

      {/* Role Name Card */}
      <Paper sx={{ p: 3, borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="700" color="#1b2559" sx={{ mb: 2 }}>
          Role Information
        </Typography>
        <TextField
          fullWidth
          size="small"
          label="Role Name"
          placeholder="e.g. Content Manager"
          value={roleName}
          onChange={e => setRoleName(e.target.value)}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" }, maxWidth: 500 }}
        />
      </Paper>

      {/* Permissions Card */}
      <Paper sx={{ p: 3, borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="700" color="#1b2559">
              Enable Sections
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {enabledCount} of {ALL_KEYS.length} permissions enabled
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              onClick={selectAll}
              sx={{ borderRadius: "8px", textTransform: "none", fontWeight: "600", color: "#4318ff", border: "1px solid #e0e7ff", backgroundColor: "#f0edff" }}
            >
              Select All
            </Button>
            <Button
              size="small"
              onClick={clearAll}
              sx={{ borderRadius: "8px", textTransform: "none", fontWeight: "600", color: "#ff4d49", border: "1px solid #ffe0e0", backgroundColor: "#fff5f5" }}
            >
              Clear All
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={2}>
          {PERMISSION_GROUPS.map((group) => {
            const allOn = group.items.every(i => selected[i.key]);
            const someOn = group.items.some(i => selected[i.key]);
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={group.group}>
                <Paper
                  variant="outlined"
                  sx={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: someOn ? `1.5px solid ${group.color}` : "1.5px solid #e0e5f2",
                    transition: "all 0.2s",
                  }}
                >
                  {/* Group Header */}
                  <Box
                    onClick={() => toggleGroup(group)}
                    sx={{
                      px: 2, py: 1.5,
                      backgroundColor: someOn ? group.bg : "#fafbfc",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid #f1f1f1",
                      "&:hover": { backgroundColor: group.bg },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <Typography variant="body2" fontWeight="700" color={someOn ? group.color : "#475467"}>
                      {group.group}
                    </Typography>
                    <Chip
                      label={allOn ? "All" : someOn ? `${group.items.filter(i => selected[i.key]).length}/${group.items.length}` : "None"}
                      size="small"
                      sx={{
                        backgroundColor: someOn ? group.color : "#e0e5f2",
                        color: someOn ? "#fff" : "#a3aed0",
                        fontWeight: "700",
                        fontSize: "10px",
                        height: "20px",
                      }}
                    />
                  </Box>

                  {/* Permission Items */}
                  <Box sx={{ p: 1.5 }}>
                    <Stack spacing={0.5}>
                      {group.items.map(item => (
                        <Box
                          key={item.key}
                          onClick={() => toggle(item.key)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            px: 1.5,
                            py: 1,
                            borderRadius: "10px",
                            cursor: "pointer",
                            backgroundColor: selected[item.key] ? group.bg : "transparent",
                            border: selected[item.key] ? `1px solid ${group.color}30` : "1px solid transparent",
                            transition: "all 0.15s",
                            "&:hover": { backgroundColor: group.bg },
                          }}
                        >
                          <Box sx={{ color: selected[item.key] ? group.color : "#a3aed0", display: "flex", alignItems: "center", transition: "color 0.15s" }}>
                            {item.icon}
                          </Box>
                          <Typography
                            variant="body2"
                            fontWeight={selected[item.key] ? "700" : "500"}
                            color={selected[item.key] ? group.color : "#475467"}
                            sx={{ flex: 1, transition: "all 0.15s" }}
                          >
                            {item.key}
                          </Typography>
                          <Box
                            sx={{
                              width: 16, height: 16,
                              borderRadius: "4px",
                              border: selected[item.key] ? `2px solid ${group.color}` : "2px solid #d1d5db",
                              backgroundColor: selected[item.key] ? group.color : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "all 0.15s",
                              flexShrink: 0,
                            }}
                          >
                            {selected[item.key] && (
                              <Box component="span" sx={{ color: "#fff", fontSize: "10px", fontWeight: "900", lineHeight: 1 }}>✓</Box>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Actions */}
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#4318ff",
            "&:hover": { backgroundColor: "#3311cc" },
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "700",
            px: 5, py: 1.5,
            boxShadow: "0 4px 12px rgba(67,24,255,0.3)",
          }}
        >
          Update Role
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/roles")}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "700",
            px: 4,
            borderColor: "#e0e5f2",
            color: "#1b2559",
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

export default EditRole;



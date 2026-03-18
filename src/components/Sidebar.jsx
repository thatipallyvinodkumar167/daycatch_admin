import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  alpha,
  Typography
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import BadgeIcon from "@mui/icons-material/Badge";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentsIcon from "@mui/icons-material/Payments";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SettingsIcon from "@mui/icons-material/Settings";

import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import DescriptionIcon from "@mui/icons-material/Description";
import FeedbackIcon from "@mui/icons-material/Feedback";
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useLocation } from "react-router-dom";

const drawerWidth = 260; // Slightly wider for better breathing room

function Sidebar({ open }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const handleToggle = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const isChildActive = (paths) => paths.some(path => location.pathname === path);

  React.useEffect(() => {
    const path = location.pathname;
    const groups = {
      subAdmin: ["/roles", "/sub-admin"],
      reports: ["/item-requirement", "/sales-report", "/tax-reports", "/reports"],
      users: ["/user-data", "/wallet-history"],
      sendNotifications: ["/push-notification", "/store-notification", "/driver-notification"],
      listNotifications: ["/user-notifications", "/store-notifications", "/driver-notifications"],
      category: ["/categories", "/sub-category"],
      products: ["/products", "/store-products", "/trending-search", "/bulk-upload-products"],
      area: ["/cities", "/areas", "/bulk-upload-areas"],
      stores: ["/stores-list", "/store-earnings", "/store-approval"],
      orders: ["/rejected-by-store", "/all-orders", "/pending-orders", "/cancelled-orders", "/ongoing-orders", "/out-of-delivery-orders", "/payment-failed-orders", "/completed-orders", "/day-wise-orders", "/missed-orders"],
      payout: ["/payout-requests", "/payout-validation"],
      rewards: ["/rewards-list", "/redeem-value"],
      delivery: ["/delivery-boy-list", "/delivery-boy-incentive"],
      pages: ["/about-us", "/terms-conditions"],
      feedback: ["/user-feedback", "/store-feedback", "/delivery-boy-feedback"],
      callback: ["/user-callback-request", "/store-callback-request", "/delivery-boy-callback-request"]
    };

    const foundGroup = Object.keys(groups).find(key => groups[key].includes(path));
    if (foundGroup) {
      setOpenMenu(foundGroup);
    }
  }, [location.pathname]);

  const getActiveStyles = (pathOrName, childPaths = []) => {
    const isPath = typeof pathOrName === "string" && pathOrName.startsWith("/");
    const currentPath = location.pathname;
    
    let isActive = isPath ? currentPath === pathOrName : isChildActive(childPaths);
    let isExpanded = !isPath && openMenu === pathOrName;

    const primaryColor = theme.palette.primary.main;

    return {
      margin: "4px 12px",
      borderRadius: "12px",
      minHeight: "48px",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      
      // Background and Hover
      backgroundColor: isActive ? alpha(primaryColor, 0.1) : "transparent",
      "&:hover": {
        backgroundColor: isActive ? alpha(primaryColor, 0.15) : "rgba(255, 255, 255, 0.05)",
        "& .MuiListItemIcon-root": {
          color: primaryColor,
          transform: "translateX(2px)"
        }
      },

      // Accent Bar
      "&::before": {
        content: '""',
        position: "absolute",
        left: "-12px",
        top: "20%",
        bottom: "20%",
        width: "4px",
        borderRadius: "0 4px 4px 0",
        backgroundColor: primaryColor,
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.3s ease",
        boxShadow: `0 0 10px ${primaryColor}`
      },

      // Elements
      "& .MuiListItemIcon-root": {
        color: isActive ? primaryColor : "rgba(255, 255, 255, 0.7)",
        minWidth: "40px",
        transition: "all 0.3s ease"
      },
      "& .MuiListItemText-root": {
        "& .MuiTypography-root": {
          color: isActive ? "#fff" : "rgba(255, 255, 255, 0.7)",
          fontWeight: isActive ? 600 : 500,
          fontSize: "0.875rem",
          letterSpacing: "0.01em"
        }
      }
    };
  };

  const subItemStyles = (path) => {
    const isActive = location.pathname === path;
    const primaryColor = theme.palette.primary.main;

    return {
      pl: 7,
      py: 1,
      minHeight: "40px",
      margin: "2px 12px",
      borderRadius: "10px",
      transition: "all 0.2s ease",
      backgroundColor: isActive ? alpha(primaryColor, 0.08) : "transparent",
      "& .MuiListItemText-root .MuiTypography-root": {
        fontSize: "0.8125rem",
        color: isActive ? primaryColor : "rgba(255, 255, 255, 0.5)",
        fontWeight: isActive ? 600 : 400
      },
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        "& .MuiListItemText-root .MuiTypography-root": {
          color: "#fff"
        }
      }
    };
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          mt: "64px",
          backgroundColor: "#111827", // Modern Midnight Navy/Gray
          borderRight: "1px solid rgba(255, 255, 255, 0.05)",
          color: "#fff",
          overflowY: "auto",
          boxShadow: "4px 0 24px rgba(0,0,0,0.5)",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }
      }}
    >
      <List sx={{ px: 0, py: 2, pb: 12 }}>
        
        {/* SECTION: CORE */}
        <Typography variant="overline" sx={{ px: 4, py: 1, color: "rgba(255,255,255,0.3)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.1em" }}>
          Core Management
        </Typography>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/")} sx={getActiveStyles("/")}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleToggle("subAdmin")} sx={getActiveStyles("subAdmin", ["/roles", "/sub-admin"])}>
            <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
            <ListItemText primary="Sub-Admin Management" />
            {openMenu === "subAdmin" ? <ExpandLess sx={{ fontSize: 18, color: "rgba(255,255,255,0.3)" }} /> : <ExpandMore sx={{ fontSize: 18, color: "rgba(255,255,255,0.3)" }} />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openMenu === "subAdmin"} timeout="auto">
          <List disablePadding>
            <ListItemButton sx={subItemStyles("/roles")} onClick={() => navigate("/roles")}><ListItemText primary="Roles" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/sub-admin")} onClick={() => navigate("/sub-admin")}><ListItemText primary="Sub Admin List" /></ListItemButton>
          </List>
        </Collapse>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleToggle("users")} sx={getActiveStyles("users", ["/user-data", "/wallet-history"])}>
            <ListItemIcon><ManageAccountsIcon /></ListItemIcon>
            <ListItemText primary="Users Management" />
            {openMenu === "users" ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openMenu === "users"} timeout="auto">
          <List disablePadding>
            <ListItemButton sx={subItemStyles("/user-data")} onClick={() => navigate("/user-data")}><ListItemText primary="User Data" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/wallet-history")} onClick={() => navigate("/wallet-history")}><ListItemText primary="Wallet History" /></ListItemButton>
          </List>
        </Collapse>

        {/* SECTION: COMMERCE */}
        <Typography variant="overline" sx={{ px: 4, py: 1, mt: 2, display: "block", color: "rgba(255,255,255,0.3)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.1em" }}>
          Inventory & Sales
        </Typography>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleToggle("category")} sx={getActiveStyles("category", ["/categories", "/sub-category"])}>
            <ListItemIcon><CategoryIcon /></ListItemIcon>
            <ListItemText primary="Category Management" />
            {openMenu === "category" ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openMenu === "category"} timeout="auto">
          <List disablePadding>
            <ListItemButton sx={subItemStyles("/categories")} onClick={() => navigate("/categories")}><ListItemText primary="Parent Category" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/sub-category")} onClick={() => navigate("/sub-category")}><ListItemText primary="Sub Category" /></ListItemButton>
          </List>
        </Collapse>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleToggle("products")} sx={getActiveStyles("products", ["/products", "/store-products"])}>
            <ListItemIcon><InventoryIcon /></ListItemIcon>
            <ListItemText primary="Product Catalog" />
            {openMenu === "products" ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openMenu === "products"} timeout="auto">
          <List disablePadding>
            <ListItemButton sx={subItemStyles("/products")} onClick={() => navigate("/products")}><ListItemText primary="Admin Products" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/store-products")} onClick={() => navigate("/store-products")}><ListItemText primary="Store Products" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/trending-search")} onClick={() => navigate("/trending-search")}><ListItemText primary="Trending Search" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/bulk-upload-products")} onClick={() => navigate("/bulk-upload-products")}><ListItemText primary="Bulk Upload" /></ListItemButton>
          </List>
        </Collapse>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleToggle("orders")} sx={getActiveStyles("orders", ["/all-orders", "/pending-orders"])}>
            <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
            <ListItemText primary="Order Management" />
            {openMenu === "orders" ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openMenu === "orders"} timeout="auto">
          <List disablePadding>
            <ListItemButton sx={subItemStyles("/rejected-by-store")} onClick={() => navigate("/rejected-by-store")}><ListItemText primary="Rejected By Store" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/all-orders")} onClick={() => navigate("/all-orders")}><ListItemText primary="All Orders" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/pending-orders")} onClick={() => navigate("/pending-orders")}><ListItemText primary="Pending Orders" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/cancelled-orders")} onClick={() => navigate("/cancelled-orders")}><ListItemText primary="Cancel Orders" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/ongoing-orders")} onClick={() => navigate("/ongoing-orders")}><ListItemText primary="Ongoing Orders" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/out-of-delivery-orders")} onClick={() => navigate("/out-of-delivery-orders")}><ListItemText primary="Out for Delivery" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/payment-failed-orders")} onClick={() => navigate("/payment-failed-orders")}><ListItemText primary="Payment Failed" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/completed-orders")} onClick={() => navigate("/completed-orders")}><ListItemText primary="Completed Orders" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/day-wise-orders")} onClick={() => navigate("/day-wise-orders")}><ListItemText primary="Day Wise Orders" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/missed-orders")} onClick={() => navigate("/missed-orders")}><ListItemText primary="Missed Orders" /></ListItemButton>
          </List>
        </Collapse>

        {/* SECTION: OPERATIONS */}
        <Typography variant="overline" sx={{ px: 4, py: 1, mt: 2, display: "block", color: "rgba(255,255,255,0.3)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.1em" }}>
          Operations & Logistics
        </Typography>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/taxes")} sx={getActiveStyles("/taxes")}>
            <ListItemIcon><LocalOfferIcon /></ListItemIcon>
            <ListItemText primary="Taxes" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleToggle("area")} sx={getActiveStyles("area", ["/cities", "/areas"])}>
            <ListItemIcon><LocationOnIcon /></ListItemIcon>
            <ListItemText primary="Area Management" />
            {openMenu === "area" ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openMenu === "area"} timeout="auto">
          <List disablePadding>
            <ListItemButton sx={subItemStyles("/cities")} onClick={() => navigate("/cities")}><ListItemText primary="Cities" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/areas")} onClick={() => navigate("/areas")}><ListItemText primary="Area/Society" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/bulk-upload-areas")} onClick={() => navigate("/bulk-upload-areas")}><ListItemText primary="Bulk Upload" /></ListItemButton>
          </List>
        </Collapse>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleToggle("stores")} sx={getActiveStyles("stores", ["/stores-list"])}>
            <ListItemIcon><StoreIcon /></ListItemIcon>
            <ListItemText primary="Store Management" />
            {openMenu === "stores" ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openMenu === "stores"} timeout="auto">
          <List disablePadding>
            <ListItemButton sx={subItemStyles("/stores-list")} onClick={() => navigate("/stores-list")}><ListItemText primary="Store List" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/store-earnings")} onClick={() => navigate("/store-earnings")}><ListItemText primary="Store Earnings" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/store-approval")} onClick={() => navigate("/store-approval")}><ListItemText primary="Store Approval" /></ListItemButton>
          </List>
        </Collapse>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleToggle("delivery")} sx={getActiveStyles("delivery", ["/delivery-boy-list"])}>
            <ListItemIcon><DeliveryDiningIcon /></ListItemIcon>
            <ListItemText primary="Delivery Boy" />
            {openMenu === "delivery" ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openMenu === "delivery"} timeout="auto">
          <List disablePadding>
            <ListItemButton sx={subItemStyles("/delivery-boy-list")} onClick={() => navigate("/delivery-boy-list")}><ListItemText primary="Delivery Boy List" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/delivery-boy-incentive")} onClick={() => navigate("/delivery-boy-incentive")}><ListItemText primary="Incentive History" /></ListItemButton>
          </List>
        </Collapse>

        {/* SECTION: FINANCIALS */}
        <Typography variant="overline" sx={{ px: 4, py: 1, mt: 2, display: "block", color: "rgba(255,255,255,0.3)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.1em" }}>
          Financials & Rewards
        </Typography>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleToggle("payout")} sx={getActiveStyles("payout", ["/payout-requests"])}>
            <ListItemIcon><PaymentsIcon /></ListItemIcon>
            <ListItemText primary="Payouts" />
            {openMenu === "payout" ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openMenu === "payout"} timeout="auto">
          <List disablePadding>
            <ListItemButton sx={subItemStyles("/payout-requests")} onClick={() => navigate("/payout-requests")}><ListItemText primary="Payout Requests" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/payout-validation")} onClick={() => navigate("/payout-validation")}><ListItemText primary="Payout Validation" /></ListItemButton>
          </List>
        </Collapse>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleToggle("rewards")} sx={getActiveStyles("rewards", ["/rewards-list"])}>
            <ListItemIcon><EmojiEventsIcon /></ListItemIcon>
            <ListItemText primary="Rewards" />
            {openMenu === "rewards" ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openMenu === "rewards"} timeout="auto">
          <List disablePadding>
            <ListItemButton sx={subItemStyles("/rewards-list")} onClick={() => navigate("/rewards-list")}><ListItemText primary="Rewards List" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/redeem-value")} onClick={() => navigate("/redeem-value")}><ListItemText primary="Redeem Value" /></ListItemButton>
          </List>
        </Collapse>

        {/* SECTION: COMMUNICATION */}
        <Typography variant="overline" sx={{ px: 4, py: 1, mt: 2, display: "block", color: "rgba(255,255,255,0.3)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.1em" }}>
          Communication
        </Typography>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleToggle("sendNotifications")} sx={getActiveStyles("sendNotifications", ["/push-notification"])}>
            <ListItemIcon><NotificationsIcon /></ListItemIcon>
            <ListItemText primary="Send Notifications" />
            {openMenu === "sendNotifications" ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openMenu === "sendNotifications"} timeout="auto">
          <List disablePadding>
            <ListItemButton sx={subItemStyles("/users-notification")} onClick={() => navigate("/users-notification")}><ListItemText primary="User Notification" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/store-notification")} onClick={() => navigate("/store-notification")}><ListItemText primary="Store Notification" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/driver-notification")} onClick={() => navigate("/driver-notification")}><ListItemText primary="Driver Notification" /></ListItemButton>
          </List>
        </Collapse>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleToggle("feedback")} sx={getActiveStyles("feedback", ["/user-feedback"])}>
            <ListItemIcon><FeedbackIcon /></ListItemIcon>
            <ListItemText primary="Feedback" />
            {openMenu === "feedback" ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openMenu === "feedback"} timeout="auto">
          <List disablePadding>
            <ListItemButton sx={subItemStyles("/user-feedback")} onClick={() => navigate("/user-feedback")}><ListItemText primary="User Feedback" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/store-feedback")} onClick={() => navigate("/store-feedback")}><ListItemText primary="Store Feedback" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/delivery-boy-feedback")} onClick={() => navigate("/delivery-boy-feedback")}><ListItemText primary="Delivery Feedback" /></ListItemButton>
          </List>
        </Collapse>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleToggle("callback")} sx={getActiveStyles("callback", ["/user-callback-request"])}>
            <ListItemIcon><PhoneCallbackIcon /></ListItemIcon>
            <ListItemText primary="Callback Requests" />
            {openMenu === "callback" ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openMenu === "callback"} timeout="auto">
          <List disablePadding>
            <ListItemButton sx={subItemStyles("/user-callback-request")} onClick={() => navigate("/user-callback-request")}><ListItemText primary="User Callback" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/store-callback-request")} onClick={() => navigate("/store-callback-request")}><ListItemText primary="Store Callback" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/delivery-boy-callback-request")} onClick={() => navigate("/delivery-boy-callback-request")}><ListItemText primary="Delivery Callback" /></ListItemButton>
          </List>
        </Collapse>

        {/* SECTION: SYSTEM */}
        <Typography variant="overline" sx={{ px: 4, py: 1, mt: 2, display: "block", color: "rgba(255,255,255,0.3)", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.1em" }}>
          System & Settings
        </Typography>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleToggle("reports")} sx={getActiveStyles("reports", ["/sales-report"])}>
            <ListItemIcon><AssessmentIcon /></ListItemIcon>
            <ListItemText primary="Reports & Analytics" />
            {openMenu === "reports" ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openMenu === "reports"} timeout="auto">
          <List disablePadding>
            <ListItemButton sx={subItemStyles("/item-requirement")} onClick={() => navigate("/item-requirement")}><ListItemText primary="Item Requirement" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/sales-report")} onClick={() => navigate("/sales-report")}><ListItemText primary="Sales Report" /></ListItemButton>
            <ListItemButton sx={subItemStyles("/tax-reports")} onClick={() => navigate("/tax-reports")}><ListItemText primary="Tax Reports" /></ListItemButton>
          </List>
        </Collapse>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/membership-plain")} sx={getActiveStyles("/membership-plain")}>
            <ListItemIcon><CardMembershipIcon /></ListItemIcon>
            <ListItemText primary="Membership Plans" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/settings")} sx={getActiveStyles("/settings")}>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Platform Settings" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/cancelling-reasons")} sx={getActiveStyles("/cancelling-reasons")}>
            <ListItemIcon><FormatListBulletedIcon /></ListItemIcon>
            <ListItemText primary="Cancel Reasons" />
          </ListItemButton>
        </ListItem>

      </List>
    </Drawer>
  );
}

export default Sidebar;
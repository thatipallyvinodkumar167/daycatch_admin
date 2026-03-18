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
  alpha
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

const drawerWidth = 240;

function Sidebar({ open }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const handleToggle = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // Helper to check if any child of a group is currently active
  const isChildActive = (paths) => paths.some(path => location.pathname === path);

  // Sync openMenu with route on load/change
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

  const activeMenu = (pathOrName, childPaths = []) => {
    const isPath = typeof pathOrName === "string" && pathOrName.startsWith("/");
    const currentPath = location.pathname;
    
    let isActive = false;
    
    if (isPath) {
      // It's a direct link (Dashboard, Taxes, or a sub-item)
      isActive = currentPath === pathOrName;
    } else {
      // It's a parent group (Orders, Users Management, etc.)
      // Active if it's currently expanded OR if the current URL belongs to one of its children
      isActive = openMenu === pathOrName || isChildActive(childPaths);
    }
  
    return {
      borderLeft: isActive ? `4px solid ${theme.palette.primary.main}` : "4px solid transparent",
      backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.1) : "transparent",
      color: "#fff",
      borderRadius: "0 12px 12px 0",
      mx: 0,
      ml: 0,
      paddingLeft: "16px",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "& .MuiListItemIcon-root": {
        color: isActive ? theme.palette.primary.main : "#fff",
        minWidth: "42px",
        transition: "color 0.3s ease"
      },
      "& .MuiListItemText-root": {
        color: isActive ? theme.palette.primary.main : "#fff",
        fontWeight: isActive ? 700 : 500
      },
      "&:hover": {
        backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.15) : "rgba(255,255,255,0.05)",
        transform: isActive ? "none" : "translateX(4px)"
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
      backgroundColor: "#333333",
      color: "#fff",
      overflowY: "auto",

      /* Hide scrollbar (Chrome, Safari) */
      "&::-webkit-scrollbar": {
        display: "none"
      },

      /* Hide scrollbar (Firefox) */
      scrollbarWidth: "none",

      /* Hide scrollbar (IE, Edge) */
      msOverflowStyle: "none"
    },

    "& .MuiListItemText-primary": {
      fontSize: "13px"
    }
  }}
>
      <List sx={{ pb: 10 }}>

        {/* Dashboard */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/") }  sx={activeMenu("/")}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>   


        {/* Sub Admin Management */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleToggle("subAdmin")} sx={activeMenu("subAdmin", ["/roles", "/sub-admin"])}>
            <ListItemIcon>
              <AdminPanelSettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Sub-Admin Management" />
            {openMenu === "subAdmin" ? <ExpandLess sx={{ color: openMenu === "subAdmin" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>

        <Collapse in={openMenu === "subAdmin"} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>

            <ListItemButton
              sx={{ pl: 6, ...activeMenu("/roles") }}
              onClick={() => navigate("/roles")}
            >
              <ListItemText primary="Roles" />
            </ListItemButton>

            <ListItemButton
              sx={{ pl: 6, ...activeMenu("/sub-admin") }}
              onClick={() => navigate("/sub-admin")}
            >
              <ListItemText primary="Sub Admin" />
            </ListItemButton>

          </List>
        </Collapse>

           {/* Taxes */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/taxes")} sx={activeMenu("/taxes")}>
            <ListItemIcon>
              <LocalOfferIcon />
            </ListItemIcon>
            <ListItemText primary="Taxes" />
          </ListItemButton>
        </ListItem>

           {/* ID`s */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/id")} sx={activeMenu("/id")}>
            <ListItemIcon>
              <BadgeIcon  />
            </ListItemIcon>
            <ListItemText primary="ID`s" />
          </ListItemButton>
        </ListItem>

           {/* Membership */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/membership-plain")} sx={activeMenu("/membership-plain")}>
            <ListItemIcon>
              <CardMembershipIcon  />
            </ListItemIcon>
            <ListItemText primary="Membership Plain" />
          </ListItemButton>
        </ListItem>

        {/* Reports Dropdown */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleToggle("reports")} sx={activeMenu("reports", ["/item-requirement", "/sales-report", "/tax-reports", "/reports"])}>
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Reports" />
            {openMenu === "reports" ? <ExpandLess sx={{ color: openMenu === "reports" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>

        <Collapse in={openMenu === "reports"} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>

            <ListItemButton
              sx={{ pl: 6, ...activeMenu("/item-requirement") }}
              onClick={() => navigate("/item-requirement")}
            >
              <ListItemText primary="Item Requirement (Day-Wise)" />
            </ListItemButton>

            <ListItemButton
              sx={{ pl: 6, ...activeMenu("/sales-report") }}
              onClick={() => navigate("/sales-report")}
            >
              <ListItemText primary="Item Sales Report (Last 30 Days)" />
            </ListItemButton>

            <ListItemButton
              sx={{ pl: 6, ...activeMenu("/tax-reports") }}
              onClick={() => navigate("/tax-reports")}
            >
              <ListItemText primary="Tax Reports" />
            </ListItemButton>

            <ListItemButton
              sx={{ pl: 6, ...activeMenu("/reports") }}
              onClick={() => navigate("/reports")}
            >
              <ListItemText primary="Reports" />
            </ListItemButton>

          </List>
        </Collapse>


        {/* Users Management */}
        <ListItem disablePadding>
  <ListItemButton onClick={() => handleToggle("users")} sx={activeMenu("users", ["/user-data", "/wallet-history"])}>
    <ListItemIcon>
      <ManageAccountsIcon />
    </ListItemIcon>
    <ListItemText primary="Users Management" />
    {openMenu === "users" ? <ExpandLess sx={{ color: openMenu === "users" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
  </ListItemButton>
</ListItem>

<Collapse in={openMenu === "users"} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/user-data") }} onClick={() => navigate("/user-data")}>
      <ListItemText primary="User Data" />
    </ListItemButton>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/wallet-history") }} onClick={() => navigate("/wallet-history")}>
      <ListItemText primary="Wallet Recharge History" />
    </ListItemButton>
  </List>

</Collapse>

       {/* Send Notification */}
<ListItem disablePadding>
  <ListItemButton onClick={() => handleToggle("sendNotifications")} sx={activeMenu("sendNotifications", ["/push-notification", "/store-notification", "/driver-notification"])}>
    <ListItemIcon>
      <NotificationsIcon  />
    </ListItemIcon>
    <ListItemText primary="Send Notification" />
    {openMenu === "sendNotifications" ? <ExpandLess sx={{ color: openMenu === "sendNotifications" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
  </ListItemButton>
</ListItem>

<Collapse in={openMenu === "sendNotifications"} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/users-notification") }} onClick={() => navigate("/users-notification")}>
      <ListItemText primary="Send Notification to User" />
    </ListItemButton>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/store-notification") }} onClick={() => navigate("/store-notification")}>
      <ListItemText primary="Send Notification to Store" />
    </ListItemButton>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/driver-notification") }} onClick={() => navigate("/driver-notification")}>
      <ListItemText primary="Send Notification to Driver" />
    </ListItemButton>

  </List>

</Collapse>


       {/* List Notification */}
<ListItem disablePadding>
  <ListItemButton onClick={() => handleToggle("listNotifications")} sx={activeMenu("listNotifications", ["/user-notifications", "/store-notifications", "/driver-notifications"])}>
    <ListItemIcon>
      <FormatListBulletedIcon  />
    </ListItemIcon>
    <ListItemText primary="List Notification" />
    {openMenu === "listNotifications" ? <ExpandLess sx={{ color: openMenu === "listNotifications" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
  </ListItemButton>
</ListItem>

<Collapse in={openMenu === "listNotifications"} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/user-notifications") }} onClick={() => navigate("/user-notifications")}>
      <ListItemText primary="User Notification" />
    </ListItemButton>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/store-notifications") }} onClick={() => navigate("/store-notifications")}>
      <ListItemText primary="Store Notification" />
    </ListItemButton>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/driver-notifications") }} onClick={() => navigate("/driver-notifications")}>
      <ListItemText primary=" Driver Notification" />
    </ListItemButton>

  </List>

</Collapse>

{/* Category Management */}
<ListItem disablePadding>
  <ListItemButton onClick={() => handleToggle("category")} sx={activeMenu("category", ["/categories", "/sub-category"])}>
    <ListItemIcon>
      <CategoryIcon  />
    </ListItemIcon>
    <ListItemText primary="Category Menagement" />
    { openMenu === "category" ? <ExpandLess sx={{ color: openMenu === "category" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
  </ListItemButton>
</ListItem>

<Collapse in={openMenu === "category"} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/categories") }} onClick={() => navigate("/categories")}>
      <ListItemText primary="Parent Category" />
    </ListItemButton>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/sub-category") }} onClick={() => navigate("/sub-category")}>
      <ListItemText primary="Sub Category" />
    </ListItemButton>
  </List>

</Collapse>


{/* Product Catalog */}
<ListItem disablePadding>
  <ListItemButton onClick={() => handleToggle("products")} sx={activeMenu("products", ["/products"])}>
    <ListItemIcon>
      <InventoryIcon  />
    </ListItemIcon>
    <ListItemText primary="Product Catalog" />
    { openMenu === "products" ? <ExpandLess sx={{ color: openMenu === "products" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
  </ListItemButton>
</ListItem>

<Collapse in={openMenu === "products"} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/products") }} onClick={() => navigate("/products")}>
      <ListItemText primary="Admin products" />
    </ListItemButton>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/store-products") }} onClick={() => navigate("/products")}>
      <ListItemText primary="Store products" />
    </ListItemButton>
    <ListItemButton sx={{ pl: 6, ...activeMenu("/trending-search") }} onClick={() => navigate("/products")}>
      <ListItemText primary="Trending Search" />
    </ListItemButton>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/bulk-upload-products") }} onClick={() => navigate("/products")}>
      <ListItemText primary="Bulk Upload" />
    </ListItemButton>
  </List>

</Collapse>

{/* Area Management */}
<ListItem disablePadding>
  <ListItemButton onClick={() => handleToggle("area")} sx={activeMenu("area", ["/cities", "/areas"])}>
    <ListItemIcon>
      <LocationOnIcon  />
    </ListItemIcon>
    <ListItemText primary="Area Management" />
    { openMenu === "area" ? <ExpandLess sx={{ color: openMenu === "area" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
  </ListItemButton>
</ListItem>

<Collapse in={openMenu === "area"} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/cities") }} onClick={() => navigate("/cities")}>
      <ListItemText primary="Cities" />
    </ListItemButton>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/areas") }} onClick={() => navigate("/areas")}>
      <ListItemText primary="Area/Society" />
    </ListItemButton>
    <ListItemButton sx={{ pl: 6, ...activeMenu("/bulk-upload-areas") }} onClick={() => navigate("/bulk-upload-areas")}>
      <ListItemText primary="Bluk Upload" />
    </ListItemButton>
  </List>

</Collapse>

{/* Store Management */}
<ListItem disablePadding>
  <ListItemButton onClick={() => handleToggle("stores")} sx={activeMenu("stores", ["/stores-list", "/store-earnings", "/store-approval"])}>
    <ListItemIcon>
      <StoreIcon  />
    </ListItemIcon>
    <ListItemText primary="Store Management" />
    { openMenu === "stores" ? <ExpandLess sx={{ color: openMenu === "stores" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
  </ListItemButton>
</ListItem>

<Collapse in={openMenu === "stores"} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/stores-list") }} onClick={() => navigate("/stores-list")}>
      <ListItemText primary="Store List" />
    </ListItemButton>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/store-earnings") }} onClick={() => navigate("/store-earnings")}>
      <ListItemText primary="Store Earning/Payments" />
    </ListItemButton>
    <ListItemButton sx={{ pl: 6, ...activeMenu("/store-approval") }} onClick={() => navigate("/store-approval")}>
      <ListItemText primary="Store Approval" />
    </ListItemButton>
  </List>

</Collapse>




{/* Order Management */}
<ListItem disablePadding>
  <ListItemButton onClick={() => handleToggle("orders")} sx={activeMenu("orders", ["/rejected-by-store", "/all-orders", "/pending-orders", "/cancelled-orders", "/ongoing-orders", "/out-of-delivery-orders", "/payment-failed-orders", "/completed-orders", "/day-wise-orders", "/missed-orders"])}>
    <ListItemIcon>
      <ShoppingCartIcon  />
    </ListItemIcon>
    <ListItemText primary="Order Management" />
    { openMenu === "orders" ? <ExpandLess sx={{ color: openMenu === "orders" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
  </ListItemButton>
</ListItem>

<Collapse in={openMenu === "orders"} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/rejected-by-store") }} onClick={() => navigate("/rejected-by-store")}>
      <ListItemText primary="Rejected By Store" />
    </ListItemButton>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/all-orders") }} onClick={() => navigate("/all-orders")}>
      <ListItemText primary="All Orders" />
    </ListItemButton>
    <ListItemButton sx={{ pl: 6, ...activeMenu("/pending-orders") }} onClick={() => navigate("/pending-orders")}>
      <ListItemText primary="Pending Orders" />
    </ListItemButton>
    <ListItemButton sx={{ pl: 6, ...activeMenu("/cancelled-orders") }} onClick={() => navigate("/cancelled-orders")}>
      <ListItemText primary="Cancel Orders" />
    </ListItemButton>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/ongoing-orders") }} onClick={() => navigate("/ongoing-orders")}>
      <ListItemText primary="Ongoing Orders" />
    </ListItemButton>
    <ListItemButton sx={{ pl: 6, ...activeMenu("/out-oF-delivery-orders") }} onClick={() => navigate("/out-oF-delivery-orders")}>
      <ListItemText primary="Out for Delivery Orders" />
    </ListItemButton>
    <ListItemButton sx={{ pl: 6, ...activeMenu("/payment-failed-orders") }} onClick={() => navigate("/payment-failed-orders")}>
      <ListItemText primary="Payment Failed Orders" />
    </ListItemButton>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/completed-orders") }} onClick={() => navigate("/completed-orders")}>
      <ListItemText primary="Completed Orders" />
    </ListItemButton>
    <ListItemButton sx={{ pl: 6, ...activeMenu("/day-wise-orders") }} onClick={() => navigate("/day-wise-orders")}>
      <ListItemText primary="Day Wise Orders" />
    </ListItemButton>
   
    <ListItemButton sx={{ pl: 6, ...activeMenu("/missed-orders") }} onClick={() => navigate("/missed-orders")}>
      <ListItemText primary="Missed Orders" />
    </ListItemButton>
  </List>
</Collapse>

{/* Payout */}
<ListItem disablePadding>
  <ListItemButton onClick={() => handleToggle("payout")} sx={activeMenu("payout", ["/payout-requests", "/payout-validation"])}>
    <ListItemIcon>
      <PaymentsIcon  />
    </ListItemIcon>
    <ListItemText primary="Payout" />
    { openMenu === "payout" ? <ExpandLess sx={{ color: openMenu === "payout" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
  </ListItemButton>
</ListItem>

<Collapse in={openMenu === "payout"} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/payout-requests") }} onClick={() => navigate("/payout-requests")}>
      <ListItemText primary="Payout Requests" />
    </ListItemButton>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/payout-validation") }} onClick={() => navigate("/payout-validation")}>
      <ListItemText primary="Payout Validation" />
    </ListItemButton>
  
  </List>
</Collapse>

{/* Rewards */}
<ListItem disablePadding>
  <ListItemButton onClick={() => handleToggle("rewards")} sx={activeMenu("rewards", ["/rewards-list", "/redeem-value"])}>
    <ListItemIcon>
      <EmojiEventsIcon  />
    </ListItemIcon>
    <ListItemText primary="Rewards" />
    { openMenu === "rewards" ? <ExpandLess sx={{ color: openMenu === "rewards" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
  </ListItemButton>
</ListItem>

<Collapse in={openMenu === "rewards"} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/rewards-list") }} onClick={() => navigate("/rewards-list")}>
      <ListItemText primary="rewards" />
    </ListItemButton>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/redeem-value") }} onClick={() => navigate("/redeem-value")}>
      <ListItemText primary="Redeem Value" />
    </ListItemButton>
  
  </List>
</Collapse>

{/* Delivery Boy */}
<ListItem disablePadding>
  <ListItemButton onClick={() => handleToggle("delivery")} sx={activeMenu("delivery", ["/delivery-boy-list", "/delivery-boy-incentive"])}>
    <ListItemIcon>
      <DeliveryDiningIcon  />
    </ListItemIcon>
    <ListItemText primary="Delivery Boy" />
    { openMenu === "delivery" ? <ExpandLess sx={{ color: openMenu === "delivery" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
  </ListItemButton>
</ListItem>

<Collapse in={openMenu === "delivery"} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/delivery-boy-list") }} onClick={() => navigate("/delivery-boy-list")}>
      <ListItemText primary="Delivery Boy" />
    </ListItemButton>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/delivery-boy-incentive") }} onClick={() => navigate("/delivery-boy-incentive")}>
      <ListItemText primary="Delivery Boy Incentive" />
    </ListItemButton>
  
  </List>
</Collapse>

{/* Pages */}
<ListItem disablePadding>
  <ListItemButton onClick={() => handleToggle("pages")} sx={activeMenu("pages", ["/about-us", "/terms-conditions"])}>
    <ListItemIcon>
      <DescriptionIcon  />
    </ListItemIcon>
    <ListItemText primary="Pages" />
    { openMenu === "pages" ? <ExpandLess sx={{ color: openMenu === "pages" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
  </ListItemButton>
</ListItem>

<Collapse in={openMenu === "pages"} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/about-us") }} onClick={() => navigate("/about-us")}>
      <ListItemText primary="About Us" />
    </ListItemButton>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/terms-conditions") }} onClick={() => navigate("/terms-conditions")}>
      <ListItemText primary="Terms & Conditions" />
    </ListItemButton>
  
  </List>
</Collapse>

{/* Feedback  */}
<ListItem disablePadding>
  <ListItemButton onClick={() => handleToggle("feedback")} sx={activeMenu("feedback", ["/user-feedback", "/store-feedback", "/delivery-boy-feedback"])}>
    <ListItemIcon>
      <FeedbackIcon  />
    </ListItemIcon>
    <ListItemText primary="Feedback" />
    { openMenu === "feedback" ? <ExpandLess sx={{ color: openMenu === "feedback" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
  </ListItemButton>
</ListItem>

<Collapse in={openMenu === "feedback"} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>

  <ListItemButton sx={{ pl: 6, ...activeMenu("/user-feedback") }} onClick={() => navigate("/user-feedback")}>
      <ListItemText primary=" User Feedback" />
    </ListItemButton>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/store-feedback") }} onClick={() => navigate("/store-feedback")}>
      <ListItemText primary="Store Feedback" />
    </ListItemButton>
     <ListItemButton sx={{ pl: 6, ...activeMenu("/delivery-boy-feedback") }} onClick={() => navigate("/delivery-boy-feedback")}>
      <ListItemText primary="Delivery Boy Feedback" />
    </ListItemButton>
  
  </List>
</Collapse>


{/* Callback Request */}
<ListItem disablePadding>
  <ListItemButton onClick={() => handleToggle("callback")} sx={activeMenu("callback", ["/user-callback-request", "/store-callback-request", "/delivery-boy-callback-request"])}>
    <ListItemIcon>
      <PhoneCallbackIcon  />
    </ListItemIcon>
    <ListItemText primary="Callback Request" />
    { openMenu === "callback" ? <ExpandLess sx={{ color: openMenu === "callback" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
  </ListItemButton>
</ListItem>

<Collapse in={openMenu === "callback"} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/user-callback-request") }} onClick={() => navigate("/user-callback-request")}>
      <ListItemText primary=" User Callback Request" />
    </ListItemButton>

    <ListItemButton sx={{ pl: 6, ...activeMenu("/store-callback-request") }} onClick={() => navigate("/store-callback-request")}>
      <ListItemText primary="Store Callback Request" />
    </ListItemButton>
     <ListItemButton sx={{ pl: 6, ...activeMenu("/delivery-boy-callback-request") }} onClick={() => navigate("/delivery-boy-callback-request")}>
      <ListItemText primary="Delivery Boy Callback Request" />
    </ListItemButton>
  
  </List>
</Collapse>

        {/* Settings Section */}
        <ListItem disablePadding sx={{ mt: 2, px: 2 }}>
          <ListItemText 
            primary="Settings" 
            primaryTypographyProps={{ 
              sx: { 
                fontSize: "12px", 
                fontWeight: "bold", 
                color: "rgba(255,255,255,0.5)", 
                textTransform: "uppercase" 
              } 
            }} 
          />
        </ListItem>

        {/* Settings */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/settings")} sx={activeMenu("/settings")}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>

        {/* Cancelling Reasons */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/cancelling-reasons")} sx={activeMenu("/cancelling-reasons")}>
            <ListItemIcon>
              <FormatListBulletedIcon />
            </ListItemIcon>
            <ListItemText primary="Cancelling Reasons" />
          </ListItemButton>
        </ListItem>




      </List>
    </Drawer>
  );
}

export default Sidebar;
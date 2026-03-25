import React, { useMemo, useRef, useState } from "react";
import {
  Alert,
  alpha,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  AccountBalance as AccountBalanceIcon,
  ArrowForward as ArrowIcon,
  Campaign as CampaignIcon,
  CheckCircle as CheckIcon,
  Close as CloseIcon,
  CloudUpload as BrowseGalleryIcon,
  DirectionsCar as DirectionsCarIcon,
  Hub as HubIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Map as MapIcon,
  Save as SaveIcon,
  Shield as ShieldIcon,
  Sms as SmsIcon,
} from "@mui/icons-material";

const BRAND_RED = "#4318ff";
const BRAND_RED_LIGHT = "#7551ff";
const BRAND_DARK = "#1b2559";
const BRAND_TEXT_MUTED = "#707eae";
const BRAND_BORDER = "#e0e5f2";
const BRAND_CANVAS = "#f4f7fe";
const ORDER_PANEL_SX = {
  borderRadius: "24px",
  border: `1px solid ${BRAND_BORDER}`,
  boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
  bgcolor: "#fff",
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState("global");
  const [open, setOpen] = useState(false);
  const [showSmsEdit, setShowSmsEdit] = useState(false);
  const [activeGateway, setActiveGateway] = useState("Easebuzz");
  const pageMaxWidth = "1540px";

  const [settings, setSettings] = useState({
    appName: "Day Catch",
    countryCode: "+91",
    phoneLength: "10",
    lastLocation: "Save",
    footerText: "Day Catch © 2024",
    liveChat: "OFF",
    currencyName: "Indian Rupee(For Razorpay)",
    currencySign: "₹",
    referralFor: "1st Order Completion",
    minReferral: "50",
    maxReferral: "500",
    firebaseOtp: true,
    firebaseIso: "INR",
    userFcm: "",
    vendorFcm: "",
    driverFcm: "",
    gateway: "Easebuzz",
    easebuzzActive: "Yes",
    merchantKey: "M687WP7COD",
    saltKey: "ITAH6YPZV6",
    environment: "Production",
    mapStatus: "Google Map ON",
    mapType: "Google Map",
    googleMapKey: "AlzaSyDohjoZfMMTF8YR90v3HhBBLAt4-ZX9uF0",
    mapboxKey: "",
    driverIncentive: "10",
    androidLink: "https://play.google.com/store/apps/details?id=in.daycatch&pli=1",
    iosLink: "https://apps.apple.com/in/app/day-catch/id6757214863",
    imageStorage: "Same Server",
    noticeStatus: "Active",
    noticeText: "Every Saturday Orders will be Delivered On Sunday Between 6 AM to 9 AM...",
    siteLogo: null,
    favicon: null,
    razorpayActive: "No",
    razorpayKeyId: "",
    razorpayKeySecret: "",
    stripeActive: "No",
    stripePublishableKey: "",
    stripeSecretKey: "",
    paystackActive: "No",
    paystackPublicKey: "",
    paystackSecretKey: "",
    smsGateway: "OFF",
    smsBearerToken: "",
    smsSenderId: "",
    smsPrincipalEntityId: "",
    smsDltTemplateId: "",
    smsChainValue: "",
  });

  const menuItems = useMemo(
    () => [
      { id: "global", label: "Core Architecture", icon: <HubIcon fontSize="small" /> },
      { id: "sms", label: "Communications Hub", icon: <SmsIcon fontSize="small" /> },
      { id: "fcm", label: "Identity Protocols", icon: <ShieldIcon fontSize="small" /> },
      { id: "payment", label: "Financial Engine", icon: <AccountBalanceIcon fontSize="small" /> },
      { id: "map", label: "Geo Parameters", icon: <MapIcon fontSize="small" /> },
      { id: "incentive", label: "Logistics Boost", icon: <DirectionsCarIcon fontSize="small" /> },
      { id: "link", label: "App Link Distribution", icon: <LinkIcon fontSize="small" /> },
      { id: "image", label: "Asset Storage", icon: <ImageIcon fontSize="small" /> },
      { id: "notice", label: "Global Notice", icon: <CampaignIcon fontSize="small" /> },
    ],
    []
  );

  const activeMenu = menuItems.find((item) => item.id === activeTab) || menuItems[0];

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    if (field === "gateway") {
      setActiveGateway(value);
    }
  };

  const handleFileChange = (field, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings((prev) => ({ ...prev, [field]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const StyledTextField = ({ label, value, field, type = "text", placeholder, multiline = false, rows = 1, helper }) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" fontWeight="800" color={BRAND_DARK} sx={{ mb: 1, ml: 0.5 }}>
        {label}
      </Typography>
      <TextField
        fullWidth
        type={type}
        placeholder={placeholder}
        multiline={multiline}
        rows={rows}
        value={value}
        onChange={(e) => handleInputChange(field, e.target.value)}
        InputProps={{
          sx: {
            borderRadius: "14px",
            backgroundColor: "#fcfdff",
            fontSize: "14px",
            fontWeight: 700,
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: BRAND_BORDER },
            "&:hover fieldset": { borderColor: alpha(BRAND_RED, 0.65) },
            "&.Mui-focused fieldset": { borderColor: BRAND_RED },
          },
        }}
      />
      {helper && (
        <Typography variant="caption" color={BRAND_TEXT_MUTED} sx={{ ml: 1, mt: 0.5, fontWeight: 700 }}>
          {helper}
        </Typography>
      )}
    </Box>
  );

  const StyledSelect = ({ label, value, field, options }) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" fontWeight="800" color={BRAND_DARK} sx={{ mb: 1, ml: 0.5 }}>
        {label}
      </Typography>
      <FormControl fullWidth size="small">
        <Select
          value={value}
          onChange={(e) => handleInputChange(field, e.target.value)}
          sx={{
            borderRadius: "14px",
            backgroundColor: "#fcfdff",
            fontSize: "14px",
            fontWeight: 700,
            py: 0.35,
            "& .MuiOutlinedInput-notchedOutline": { borderColor: BRAND_BORDER },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha(BRAND_RED, 0.65) },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: BRAND_RED },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option} sx={{ fontWeight: 800, fontSize: "14px" }}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  const ImageUploadBox = ({ label, value, field }) => {
    const inputRef = useRef(null);

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight="800" color={BRAND_DARK} sx={{ mb: 1, ml: 0.5 }}>
          {label}
        </Typography>
        <input type="file" hidden ref={inputRef} accept="image/*" onChange={(e) => handleFileChange(field, e.target.files[0])} />
        <Box
          onClick={() => inputRef.current?.click()}
          sx={{
            p: 4,
            border: `2px dashed ${BRAND_BORDER}`,
            borderRadius: "18px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: "#fcfdff",
            transition: "0.2s",
            "&:hover": { borderColor: BRAND_RED, bgcolor: alpha(BRAND_RED, 0.03) },
          }}
        >
          {value ? (
            <img src={value} alt={label} style={{ maxHeight: "80px", maxWidth: "100%", objectFit: "contain", borderRadius: "8px" }} />
          ) : (
            <>
              <BrowseGalleryIcon sx={{ color: BRAND_RED, fontSize: 32, mb: 1 }} />
              <Typography variant="body2" fontWeight="800" color={BRAND_DARK}>
                Upload {label}
              </Typography>
            </>
          )}
        </Box>
      </Box>
    );
  };

  const SectionCard = ({ title, subtitle, icon: Icon, children, action }) => (
    <Paper
      sx={{
        p: { xs: 3, md: 4 },
        ...ORDER_PANEL_SX,
        height: "100%",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ p: 1.5, borderRadius: "14px", bgcolor: alpha(BRAND_RED, 0.08), color: BRAND_RED }}>
            <Icon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight="900" color={BRAND_DARK}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color={BRAND_TEXT_MUTED} fontWeight="700" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
        {action}
      </Stack>
      {children}
    </Paper>
  );

  const renderPaymentFields = () => {
    if (activeGateway === "Easebuzz") {
      return (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}><StyledSelect label="Node Status" value={settings.easebuzzActive} field="easebuzzActive" options={["Yes", "No"]} /></Grid>
          <Grid item xs={12} md={6}><StyledTextField label="Public Merchant Key" value={settings.merchantKey} field="merchantKey" /></Grid>
          <Grid item xs={12} md={6}><StyledTextField label="Secure Salt Key" value={settings.saltKey} field="saltKey" type="password" /></Grid>
          <Grid item xs={12} md={6}><StyledSelect label="Operational Environment" value={settings.environment} field="environment" options={["Production", "Sandbox"]} /></Grid>
        </Grid>
      );
    }

    if (activeGateway === "Razorpay") {
      return (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}><StyledSelect label="Node Status" value={settings.razorpayActive} field="razorpayActive" options={["Yes", "No"]} /></Grid>
          <Grid item xs={12} md={6}><StyledTextField label="Public Key ID" value={settings.razorpayKeyId} field="razorpayKeyId" /></Grid>
          <Grid item xs={12} md={6}><StyledTextField label="Secure Secret Key" value={settings.razorpayKeySecret} field="razorpayKeySecret" type="password" /></Grid>
        </Grid>
      );
    }

    if (activeGateway === "Stripe") {
      return (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}><StyledSelect label="Node Status" value={settings.stripeActive} field="stripeActive" options={["Yes", "No"]} /></Grid>
          <Grid item xs={12} md={6}><StyledTextField label="Publishable Key" value={settings.stripePublishableKey} field="stripePublishableKey" /></Grid>
          <Grid item xs={12} md={6}><StyledTextField label="Secret Key" value={settings.stripeSecretKey} field="stripeSecretKey" type="password" /></Grid>
        </Grid>
      );
    }

    return (
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}><StyledSelect label="Node Status" value={settings.paystackActive} field="paystackActive" options={["Yes", "No"]} /></Grid>
        <Grid item xs={12} md={6}><StyledTextField label="Public Key" value={settings.paystackPublicKey} field="paystackPublicKey" /></Grid>
        <Grid item xs={12} md={6}><StyledTextField label="Secret Key" value={settings.paystackSecretKey} field="paystackSecretKey" type="password" /></Grid>
      </Grid>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "global":
        return (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <SectionCard title="System Architecture" subtitle="Core platform configurations and localization parameters." icon={HubIcon}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}><StyledTextField label="Platform Handle" value={settings.appName} field="appName" placeholder="e.g. Day Catch" /></Grid>
                  <Grid item xs={12} md={6}><StyledTextField label="Country ISO Code" value={settings.countryCode} field="countryCode" placeholder="+91" /></Grid>
                  <Grid item xs={12} md={6}><StyledTextField label="Verification Digits" value={settings.phoneLength} field="phoneLength" placeholder="10" /></Grid>
                  <Grid item xs={12} md={6}><StyledSelect label="Session Continuity" value={settings.lastLocation} field="lastLocation" options={["Save", "Clear"]} /></Grid>
                  <Grid item xs={12} md={6}><ImageUploadBox label="Site Branding (Logo)" value={settings.siteLogo} field="siteLogo" /></Grid>
                  <Grid item xs={12} md={6}><ImageUploadBox label="Favicon" value={settings.favicon} field="favicon" /></Grid>
                  <Grid item xs={12} md={6}><StyledTextField label="Public Footer" value={settings.footerText} field="footerText" multiline rows={2} /></Grid>
                  <Grid item xs={12} md={6}><StyledSelect label="Direct Messaging (Live Chat)" value={settings.liveChat} field="liveChat" options={["OFF", "ON"]} /></Grid>
                </Grid>
              </SectionCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <SectionCard title="Currency Node" subtitle="Define primary monetary nomenclature." icon={AccountBalanceIcon}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}><StyledSelect label="Legal Currency Name" value={settings.currencyName} field="currencyName" options={["Indian Rupee(For Razorpay)", "U.S. Dollar", "Euro", "Australian Dollar"]} /></Grid>
                  <Grid item xs={12} md={6}><StyledTextField label="Monetary Symbol" value={settings.currencySign} field="currencySign" placeholder="Rs." /></Grid>
                </Grid>
              </SectionCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <SectionCard title="Referral Ecosystem" subtitle="Incentivizing community growth through referrals." icon={CampaignIcon}>
                <Grid container spacing={4}>
                  <Grid item xs={12}><StyledTextField label="Referral Action Trigger" value={settings.referralFor} field="referralFor" placeholder="e.g. First successful order" /></Grid>
                  <Grid item xs={12} md={6}><StyledTextField label="Minimum Reward (Rs.)" value={settings.minReferral} field="minReferral" type="number" /></Grid>
                  <Grid item xs={12} md={6}><StyledTextField label="Maximum Cap (Rs.)" value={settings.maxReferral} field="maxReferral" type="number" /></Grid>
                </Grid>
              </SectionCard>
            </Grid>
          </Grid>
        );

      case "sms":
        return (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <SectionCard
                title="Communications Hub"
                subtitle="Configure outreach gateways and OTP verification nodes."
                icon={SmsIcon}
                action={
                  <Button
                    variant="contained"
                    onClick={() => setShowSmsEdit(true)}
                    sx={{
                      bgcolor: "#1b2559",
                      borderRadius: "14px",
                      fontWeight: 900,
                      px: 4,
                      py: 1.5,
                      boxShadow: "0 10px 20px rgba(27, 37, 89, 0.2)",
                      "&:hover": { bgcolor: "#111c44" },
                    }}
                  >
                    Configure Gateway
                  </Button>
                }
              >
                <Paper sx={{ p: 4, bgcolor: "#fafbff", borderRadius: "20px", border: `1px solid ${BRAND_BORDER}`, boxShadow: "none" }}>
                  <Typography variant="h6" fontWeight="900" color={BRAND_DARK}>
                    Outreach Gateway
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: settings.smsGateway === "OFF" ? BRAND_RED : "#2e7d32" }} />
                    <Typography variant="body2" fontWeight="800" color={BRAND_TEXT_MUTED}>
                      PRIMARY NODE: {settings.smsGateway}
                    </Typography>
                  </Stack>
                </Paper>
              </SectionCard>
            </Grid>
            <Grid item xs={12}>
              <SectionCard title="Firebase Integration (OTP)" subtitle="Cloud verification nodes for MFA." icon={ShieldIcon}>
            <Paper sx={{ p: 4, bgcolor: "#fafbff", borderRadius: "20px", border: `1px solid ${BRAND_BORDER}`, boxShadow: "none" }}>
                  <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="900" color={BRAND_DARK}>
                        Activate Cloud OTP
                      </Typography>
                      <Typography variant="body2" fontWeight="700" color={BRAND_TEXT_MUTED}>
                        Use Firebase cloud nodes to handle mobile verification threads.
                      </Typography>
                    </Box>
                    <Switch
                      checked={settings.firebaseOtp}
                      onChange={(e) => handleInputChange("firebaseOtp", e.target.checked)}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": { color: BRAND_RED },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: BRAND_RED_LIGHT },
                      }}
                    />
                  </Stack>
                  <StyledTextField label="Regional ISO Protocol" value={settings.firebaseIso} field="firebaseIso" placeholder="INR" />
                </Paper>
              </SectionCard>
            </Grid>
          </Grid>
        );

      case "fcm":
        return (
          <SectionCard title="Identity Protocols" subtitle="Neural keys required for synchronized cloud notifications." icon={ShieldIcon}>
            <Stack spacing={4}>
              <StyledTextField label="User Endpoint Server Key" value={settings.userFcm} field="userFcm" multiline rows={3} helper="Primary key for Customer Native App synchronization." />
              <StyledTextField label="Partner / Store Endpoint Key" value={settings.vendorFcm} field="vendorFcm" multiline rows={3} helper="Cloud key for Store Sub-Admin terminal links." />
              <StyledTextField label="Driver Intelligence Key" value={settings.driverFcm} field="driverFcm" multiline rows={3} helper="Logistical sync key for Delivery Partner nodes." />
            </Stack>
          </SectionCard>
        );

      case "payment":
        return (
          <SectionCard title="Financial Engine" subtitle="Configure high-performance financial switches." icon={AccountBalanceIcon}>
            <Paper sx={{ p: 4, borderRadius: "20px", border: `1px solid ${BRAND_BORDER}`, mb: 4, boxShadow: "none", bgcolor: "#fafbff" }}>
              <StyledSelect label="Select Primary Active Gateway" value={settings.gateway} field="gateway" options={["Razorpay", "Stripe", "Paystack", "Easebuzz"]} />
              <Button
                variant="contained"
                endIcon={<ArrowIcon />}
                onClick={() => setOpen(true)}
                sx={{ bgcolor: "#1b2559", borderRadius: "14px", fontWeight: 900, px: 5, py: 1.8, "&:hover": { bgcolor: "#111c44" } }}
              >
                Update Engine Node
              </Button>
            </Paper>

            <Box sx={{ bgcolor: "#fafbff", p: 4, borderRadius: "20px", border: `1px solid ${BRAND_BORDER}` }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                <AccountBalanceIcon sx={{ color: BRAND_RED }} />
                <Typography variant="h5" fontWeight="900" color={BRAND_DARK}>
                  {activeGateway} Configuration
                </Typography>
              </Stack>
              {renderPaymentFields()}
            </Box>
          </SectionCard>
        );

      case "map":
        return (
          <SectionCard title="Geo Parameters" subtitle="Spatial intelligence and global positioning nodes." icon={MapIcon}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}><StyledSelect label="Map Status" value={settings.mapStatus} field="mapStatus" options={["Google Map ON", "Google Map OFF"]} /></Grid>
              <Grid item xs={12} md={6}><StyledSelect label="Map Type" value={settings.mapType} field="mapType" options={["Google Map", "Mapbox"]} /></Grid>
              <Grid item xs={12} md={6}><StyledTextField label="Google Map Key" value={settings.googleMapKey} field="googleMapKey" multiline rows={3} /></Grid>
              <Grid item xs={12} md={6}><StyledTextField label="Mapbox Key" value={settings.mapboxKey} field="mapboxKey" multiline rows={3} /></Grid>
            </Grid>
          </SectionCard>
        );

      case "incentive":
        return (
          <SectionCard title="Logistics Boost" subtitle="Standard rewards per successful delivery mission." icon={DirectionsCarIcon}>
            <Paper sx={{ p: 4, borderRadius: "24px", border: `1px solid ${BRAND_BORDER}`, display: "flex", alignItems: "center", gap: 4, boxShadow: "none" }}>
              <Box sx={{ p: 3, borderRadius: "24px", bgcolor: alpha(BRAND_RED, 0.08), color: BRAND_RED }}>
                <DirectionsCarIcon fontSize="large" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <StyledTextField label="Base Incentive (Rs.)" value={settings.driverIncentive} field="driverIncentive" type="number" helper="Flat fee calculated per completed order signature." />
              </Box>
            </Paper>
          </SectionCard>
        );

      case "link":
        return (
          <SectionCard title="App Link Distribution" subtitle="Public install links shared across Android and iOS user journeys." icon={LinkIcon}>
            <Grid container spacing={4}>
              <Grid item xs={12}><StyledTextField label="Android App Link" value={settings.androidLink} field="androidLink" multiline rows={3} /></Grid>
              <Grid item xs={12}><StyledTextField label="iOS App Link" value={settings.iosLink} field="iosLink" multiline rows={3} /></Grid>
            </Grid>
          </SectionCard>
        );

      case "image":
        return (
          <SectionCard title="Asset Storage" subtitle="Choose where uploaded visual assets are retained." icon={ImageIcon}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}><StyledSelect label="Image Storage Node" value={settings.imageStorage} field="imageStorage" options={["Same Server", "Cloudinary", "AWS S3"]} /></Grid>
            </Grid>
          </SectionCard>
        );

      case "notice":
        return (
          <SectionCard title="Global Notice" subtitle="Broadcast urgent messages across all platform endpoints." icon={CampaignIcon}>
            <Paper sx={{ p: 4, borderRadius: "20px", border: `1px solid ${BRAND_BORDER}`, boxShadow: "none", bgcolor: "#fafbff" }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}><StyledSelect label="Transmission Status" value={settings.noticeStatus} field="noticeStatus" options={["Active", "Inactive"]} /></Grid>
                <Grid item xs={12}><StyledTextField label="Broadcast Message Payload" value={settings.noticeText} field="noticeText" multiline rows={6} placeholder="Enter message to display on all apps..." /></Grid>
              </Grid>
            </Paper>
          </SectionCard>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: BRAND_CANVAS, minHeight: "100vh" }}>
      <Box sx={{ maxWidth: pageMaxWidth, mx: "auto" }}>
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
              Settings
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 500 }}>
              Manage super-admin settings with the same clean workspace language used in order history.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => setOpen(true)}
            sx={{
              backgroundColor: "#1b2559",
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              boxShadow: "0 10px 20px rgba(27, 37, 89, 0.2)",
              "&:hover": { backgroundColor: "#111c44" },
            }}
          >
            Save Settings
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: "ACTIVE MODULE", value: activeMenu.label, icon: activeMenu.icon, color: "#4318ff", bg: "#eef2ff" },
            { label: "PAYMENT GATEWAY", value: settings.gateway, icon: <AccountBalanceIcon />, color: "#ffb800", bg: "#fff9e6" },
            { label: "LIVE CHAT", value: settings.liveChat, icon: <SmsIcon />, color: "#24d164", bg: "#e6f9ed" },
            { label: "MAP ENGINE", value: settings.mapType, icon: <MapIcon />, color: "#ff4d49", bg: "#fff1f0" },
          ].map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <Paper sx={{ p: 2.5, borderRadius: "20px", display: "flex", alignItems: "center", gap: 2, border: "1px solid #e0e5f2" }}>
                <Avatar sx={{ bgcolor: stat.bg, color: stat.color, width: 48, height: 48, borderRadius: "12px" }}>
                  {stat.icon}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ letterSpacing: "0.5px" }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h6" fontWeight="800" color="#1b2559" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {stat.value}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper
          sx={{
            p: 2,
            mb: 3,
            borderRadius: "20px",
            border: "1px solid #e0e5f2",
            bgcolor: "#fff",
            boxShadow: "0 10px 24px rgba(17, 28, 68, 0.04)",
          }}
        >
          <Stack direction={{ xs: "column", lg: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "stretch", lg: "center" }}>
            <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap" }}>
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <Button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    startIcon={item.icon}
                    variant={isActive ? "contained" : "text"}
                    sx={{
                      textTransform: "none",
                      borderRadius: "12px",
                      fontWeight: 800,
                      px: 2.25,
                      py: 1.1,
                      color: isActive ? "#fff" : "#2b3674",
                      bgcolor: isActive ? "#4318ff" : "transparent",
                      border: isActive ? "none" : "1px solid #e0e5f2",
                      "&:hover": {
                        bgcolor: isActive ? "#3311cc" : "#eef2ff",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
            <Typography variant="body2" color="#a3aed0" fontWeight="800" sx={{ px: 1 }}>
              Update this settings group without changing the rest of the platform configuration.
            </Typography>
          </Stack>
        </Paper>

        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            ...ORDER_PANEL_SX,
            minHeight: "720px",
          }}
        >
          {renderContent()}
        </Paper>
      </Box>

      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" sx={{ borderRadius: "16px", fontWeight: 900, fontSize: "14px", boxShadow: "0 15px 35px rgba(0,0,0,0.12)", px: 3, py: 1.75 }}>
          Global sync successful. System parameters updated.
        </Alert>
      </Snackbar>

      <Dialog open={showSmsEdit} onClose={() => setShowSmsEdit(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: "28px", p: 1 } }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" fontWeight="900" color={BRAND_DARK}>
            SMS Gateway Protocol
          </Typography>
          <IconButton onClick={() => setShowSmsEdit(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <Alert severity="warning" sx={{ mb: 4, borderRadius: "16px", fontWeight: 700 }}>
            Modifying these keys will affect all mobile verification OTPs immediately.
          </Alert>
          <StyledTextField label="Bearer Security Token" value={settings.smsBearerToken} field="smsBearerToken" />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><StyledTextField label="Sender ID" value={settings.smsSenderId} field="smsSenderId" /></Grid>
            <Grid item xs={12} md={6}><StyledTextField label="DLT ID" value={settings.smsDltTemplateId} field="smsDltTemplateId" /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button fullWidth variant="contained" onClick={() => setShowSmsEdit(false)} sx={{ bgcolor: "#1b2559", borderRadius: "16px", py: 1.8, fontWeight: 900, "&:hover": { bgcolor: "#111c44" } }}>
            Update Gateway
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;

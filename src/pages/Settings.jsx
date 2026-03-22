import React, { useState, useRef, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Grid,
  Switch,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  MenuItem,
  Select,
  FormControl,
  FormControlLabel,
  Radio,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  alpha,
  Avatar
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Settings as SettingsIcon,
  Sms as SmsIcon,
  Key as KeyIcon,
  Payment as PaymentIcon,
  Map as MapIcon,
  DirectionsCar as DirectionsCarIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Campaign as CampaignIcon,
  CloudUpload as BrowseGalleryIcon,
  Hub as HubIcon,
  Shield as ShieldIcon,
  AccountBalance as AccountBalanceIcon,
  AutoGraph as AutoGraphIcon,
  Done as DoneIcon
} from "@mui/icons-material";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("global");
  const [open, setOpen] = useState(false);
  const [activeGateway, setActiveGateway] = useState("Easebuzz");
  const indigoPrimary = "#4318ff";

  const [settings, setSettings] = useState({
    appName: "", countryCode: "", phoneLength: "", lastLocation: "Save", footerText: "", liveChat: "OFF",
    currencyName: "", currencySign: "", referralFor: "", minReferral: "", maxReferral: "",
    firebaseOtp: false, firebaseIso: "INR",
    userFcm: "", vendorFcm: "", driverFcm: "",
    gateway: "Easebuzz", easebuzzActive: "Yes", merchantKey: "M687WP7COD", saltKey: "ITAH6YPZV6", environment: "Production",
    mapStatus: "Google Map ON", mapType: "Google Map", googleMapKey: "AlzaSyDohjoZfMMTF8YR90v3HhBBLAt4-ZX9uF0", mapboxKey: "",
    driverIncentive: "10", 
    androidLink: "https://play.google.com/store/apps/details?id=in.daycatch&pli=1", 
    iosLink: "https://apps.apple.com/in/app/day-catch/id6757214863", 
    imageStorage: "Same Server",
    noticeStatus: "Active", 
    noticeText: "Every Saturday Orders will be Delivered On Sunday Between 6 AM to 9 AM...", 
    siteLogo: null, favicon: null,
    razorpayActive: "No", razorpayKeyId: "", razorpayKeySecret: "",
    stripeActive: "No", stripePublishableKey: "", stripeSecretKey: "",
    paystackActive: "No", paystackPublicKey: "", paystackSecretKey: "",
    smsGateway: "OFF", smsBearerToken: "", smsSenderId: "", smsPrincipalEntityId: "", smsDltTemplateId: "", smsChainValue: ""
  });

  const [showSmsEdit, setShowSmsEdit] = useState(false);
  const [showMapEdit, setShowMapEdit] = useState(false);

  const menuItems = [
    { id: "global", label: "Core Hub", icon: <HubIcon sx={{ fontSize: 18 }} /> },
    { id: "sms", label: "Communications", icon: <SmsIcon sx={{ fontSize: 18 }} /> },
    { id: "fcm", label: "Identity Keys", icon: <ShieldIcon sx={{ fontSize: 18 }} /> },
    { id: "payment", label: "Payments Hub", icon: <AccountBalanceIcon sx={{ fontSize: 18 }} /> },
    { id: "map", label: "Geo Parameters", icon: <MapIcon sx={{ fontSize: 18 }} /> },
    { id: "incentive", label: "Incentives", icon: <DirectionsCarIcon sx={{ fontSize: 18 }} /> },
    { id: "link", label: "Market Links", icon: <LinkIcon sx={{ fontSize: 18 }} /> },
    { id: "image", label: "Storage Ops", icon: <ImageIcon sx={{ fontSize: 18 }} /> },
    { id: "notice", label: "Broadcast", icon: <CampaignIcon sx={{ fontSize: 18 }} /> },
  ];

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    if (field === "gateway") { setActiveGateway(value); }
  };
  const handleFileChange = (field, file) => { if (file) { const reader = new FileReader(); reader.onloadend = () => setSettings(prev => ({ ...prev, [field]: reader.result })); reader.readAsDataURL(file); } };
  const handleUpdateGateway = () => { setActiveGateway(settings.gateway); setOpen(true); };

  const SectionTitle = ({ children, subtitle }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-0.5px" }}>{children}</Typography>
      {subtitle && <Typography variant="caption" color="#a3aed0" fontWeight="700" sx={{ display: "block", fontSize: "10px" }}>{subtitle}</Typography>}
      <Divider sx={{ mt: 1, borderColor: "#f1f4f9" }} />
    </Box>
  );

  const StyledTextField = ({ label, value, field, type = "text", placeholder, multiline = false, rows = 1 }) => (
    <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" fontWeight="900" color="#1b2559" sx={{ mb: 0.5, display: "block", textTransform: "uppercase", fontSize: "9px" }}>{label}</Typography>
        <TextField fullWidth size="small" type={type} placeholder={placeholder} multiline={multiline} rows={rows} value={value} onChange={(e) => handleInputChange(field, e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#fcfdff", fontSize: "12px", fontWeight: "600" } }} />
    </Box>
  );

  const StyledSelect = ({ label, value, field, options }) => (
    <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" fontWeight="900" color="#1b2559" sx={{ mb: 0.5, display: "block", textTransform: "uppercase", fontSize: "9px" }}>{label}</Typography>
        <FormControl fullWidth size="small">
            <Select value={value} onChange={(e) => handleInputChange(field, e.target.value)} sx={{ borderRadius: "10px", backgroundColor: "#fcfdff", fontSize: "12px", fontWeight: "600" }}>
                {options.map(opt => <MenuItem key={opt} value={opt} sx={{ fontWeight: 700, fontSize: "12px" }}>{opt}</MenuItem>)}
            </Select>
        </FormControl>
    </Box>
  );

  const ImageUploadBox = ({ label, value, field }) => {
    const inputRef = useRef(null);
    return (
        <Box sx={{ mb: 1.5 }}>
            <Typography variant="caption" fontWeight="900" color="#1b2559" sx={{ mb: 0.5, display: "block", textTransform: "uppercase", fontSize: "9px" }}>{label}</Typography>
            <input type="file" hidden ref={inputRef} accept="image/*" onChange={(e) => handleFileChange(field, e.target.files[0])} />
            <Box onClick={() => inputRef.current.click()} sx={{ p: 2, border: "2px dashed #e0e5f2", borderRadius: "14px", textAlign: "center", cursor: "pointer", backgroundColor: "#fcfdff", height: "70px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                {value ? <img src={value} alt={label} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", borderRadius: "8px" }} /> : <><BrowseGalleryIcon sx={{ color: indigoPrimary, fontSize: 18 }} /><Typography variant="caption" fontWeight="900" color="#1b2559">LINK</Typography></>}
            </Box>
        </Box>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "global":
        return (
          <Box>
            <SectionTitle subtitle="Core identity markers for Day Catch.">App Identity & Localization</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}><StyledTextField label="App Name" value={settings.appName} field="appName" /></Grid>
              <Grid item xs={12} md={6}><StyledTextField label="Country Code" value={settings.countryCode} field="countryCode" /></Grid>
              <Grid item xs={12} md={6}><StyledTextField label="Phone Number Length" value={settings.phoneLength} field="phoneLength" /></Grid>
              <Grid item xs={12} md={6}><StyledSelect label="Last Location in App" value={settings.lastLocation} field="lastLocation" options={["Save", "Clear"]} /></Grid>
              <Grid item xs={12} md={6}><ImageUploadBox label="Site Logo" value={settings.siteLogo} field="siteLogo" /></Grid>
              <Grid item xs={12} md={6}><ImageUploadBox label="Favicon" value={settings.favicon} field="favicon" /></Grid>
              <Grid item xs={12} md={6}><StyledTextField label="Footer Text" value={settings.footerText} field="footerText" /></Grid>
              <Grid item xs={12} md={6}><StyledSelect label="Live Chat Between User-Vendor/store" value={settings.liveChat} field="liveChat" options={["OFF", "ON"]} /></Grid>
            </Grid>
            <Box sx={{ mt: 5 }}>
                <SectionTitle subtitle="Monetary nomenclature.">Currency</SectionTitle>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}><StyledSelect label="Currency Name" value={settings.currencyName} field="currencyName" options={["Indian Rupee(For Razorpay)", "U.S. Dollar", "Euro", "Australian Dollar"]} /></Grid>
                    <Grid item xs={12} md={6}><StyledTextField label="Currency Sign" value={settings.currencySign} field="currencySign" /></Grid>
                </Grid>
            </Box>
            <Box sx={{ mt: 5 }}>
                <SectionTitle subtitle="Incentivizing growth.">Referral Points</SectionTitle>
                <Grid container spacing={3}>
                    <Grid item xs={12}><StyledTextField label="Referral For" value={settings.referralFor} field="referralFor" /></Grid>
                    <Grid item xs={12} md={6}><StyledTextField label="min amount" value={settings.minReferral} field="minReferral" type="number" /></Grid>
                    <Grid item xs={12} md={6}><StyledTextField label="max amount" value={settings.maxReferral} field="maxReferral" type="number" /></Grid>
                </Grid>
            </Box>
          </Box>
        );
      case "sms":
        return (
            <Box>
                <SectionTitle subtitle="Gateway routing nodes.">SMS from</SectionTitle>
                <Box sx={{ p: 2.5, bgcolor: alpha(indigoPrimary, 0.05), borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Box><Typography variant="body2" fontWeight="900" color="#1b2559">SMS Gateway</Typography><Typography variant="caption" fontWeight="800" color={settings.smsGateway === "OFF" ? "#ff4d49" : "#00d26a"}>GATEWAY: {settings.smsGateway}</Typography></Box>
                    <Button size="small" variant="contained" onClick={() => setShowSmsEdit(true)} sx={{ bgcolor: indigoPrimary, borderRadius: "10px", fontWeight: 900 }}>Edit SMS Gateway</Button>
                </Box>
                <Dialog open={showSmsEdit} onClose={() => setShowSmsEdit(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: "24px" } }}>
                    <DialogTitle sx={{ p: 2, display:"flex", justifyContent:"space-between" }}><Typography fontWeight="900">Edit SMS Gateway</Typography><IconButton onClick={()=>setShowSmsEdit(false)} size="small"><CloseIcon /></IconButton></DialogTitle>
                    <DialogContent dividers>
                        <Box sx={{ py: 2, mb: 3, display: "flex", justifyContent: "space-around", bgcolor: "#f8faff", borderRadius: "16px", p: 2 }}>
                            {["Msg91", "GoExperts OTP", "OFF"].map(opt => (
                                <Box key={opt} sx={{ display:"flex", alignItems:"center" }}>
                                    <Radio checked={settings.smsGateway === opt} onChange={()=>handleInputChange("smsGateway", opt)} size="small" />
                                    <Typography fontWeight="900" fontSize="13px">{opt}</Typography>
                                </Box>
                            ))}
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12}><StyledTextField label="Bearer Token" value={settings.smsBearerToken} field="smsBearerToken" /></Grid>
                            <Grid item xs={6}><StyledTextField label="Sender ID" value={settings.smsSenderId} field="smsSenderId" /></Grid>
                            <Grid item xs={6}><StyledTextField label="Principal Entity ID" value={settings.smsPrincipalEntityId} field="smsPrincipalEntityId" /></Grid>
                            <Grid item xs={6}><StyledTextField label="DLT Template ID" value={settings.smsDltTemplateId} field="smsDltTemplateId" /></Grid>
                            <Grid item xs={6}><StyledTextField label="Chain Value" value={settings.smsChainValue} field="smsChainValue" /></Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, gap: 2 }}><Button fullWidth variant="contained" onClick={()=>setShowSmsEdit(false)} sx={{ bgcolor: indigoPrimary, borderRadius: "10px" }}>{settings.smsGateway} ON</Button></DialogActions>
                </Dialog>
                <Box sx={{ mt: 5 }}><SectionTitle subtitle="Cloud verification nodes.">Firebase for OTP</SectionTitle>
                    <Paper sx={{ p: 3, bgcolor: "#f4f7fe", borderRadius: "16px", border: "1px solid #e0e5f2", boxShadow: "none" }}>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <Switch checked={settings.firebaseOtp} onChange={(e) => handleInputChange("firebaseOtp", e.target.checked)} size="small" />
                            <Box><Typography variant="caption" fontWeight="900" color="#1b2559" fontSize="11px">Firebase for OTP</Typography><Typography variant="caption" fontWeight="700" color="#a3aed0" fontSize="10px">Toggle this switch element on for Firebase for OTP</Typography></Box>
                        </Stack>
                        <StyledTextField label="Firebase ISO(used for firebase otp)" value={settings.firebaseIso} field="firebaseIso" />
                    </Paper>
                </Box>
            </Box>
        );
      case "fcm":
          return (
              <Box>
                  <SectionTitle subtitle="Neural sync keys.">Identity Keys (FCM)</SectionTitle>
                  <StyledTextField label="User App FCM Server Key" value={settings.userFcm} field="userFcm" multiline rows={2} />
                  <StyledTextField label="Vendor/Store App FCM Server Key" value={settings.vendorFcm} field="vendorFcm" multiline rows={2} />
                  <StyledTextField label="Driver App FCM Server Key" value={settings.driverFcm} field="driverFcm" multiline rows={2} />
              </Box>
          );
      case "payment":
          return (
              <Box>
                  <SectionTitle subtitle="Tactical payment node.">Payment Hub</SectionTitle>
                  <Paper sx={{ p: 3, borderRadius: "16px", border: "1px solid #e0e5f2", mb: 4, boxShadow: "none" }}>
                      <StyledSelect label="Choose One Payment Gateways" value={settings.gateway} field="gateway" options={["Razorpay", "Stripe", "Paystack", "Easebuzz"]} />
                      <Button variant="contained" onClick={handleUpdateGateway} sx={{ bgcolor: indigoPrimary, borderRadius: "10px", fontWeight: 900 }}>Set Protocol</Button>
                  </Paper>
                  {activeGateway === "Easebuzz" && (
                    <Box><SectionTitle>Easebuzz Node</SectionTitle><Grid container spacing={3}><Grid item xs={12} md={6}><StyledSelect label="Easebuzz Active" value={settings.easebuzzActive} field="easebuzzActive" options={["Yes", "No"]} /></Grid><Grid item xs={12} md={6}><StyledTextField label="Merchant Key" value={settings.merchantKey} field="merchantKey" /></Grid><Grid item xs={12} md={6}><StyledTextField label="Salt Key" value={settings.saltKey} field="saltKey" /></Grid><Grid item xs={12} md={6}><StyledSelect label="Environment" value={settings.environment} field="environment" options={["Production", "Sandbox"]} /></Grid></Grid></Box>
                  )}
                  {activeGateway === "Razorpay" && (
                    <Box><SectionTitle>Razorpay Node</SectionTitle><Grid container spacing={3}><Grid item xs={12} md={6}><StyledSelect label="Razorpay Active" value={settings.razorpayActive} field="razorpayActive" options={["Yes", "No"]} /></Grid><Grid item xs={12} md={6}><StyledTextField label="Key ID" value={settings.razorpayKeyId} field="razorpayKeyId" /></Grid><Grid item xs={12} md={6}><StyledTextField label="Key Secret" value={settings.razorpayKeySecret} field="razorpayKeySecret" /></Grid></Grid></Box>
                  )}
                  {activeGateway === "Stripe" && (
                    <Box><SectionTitle>Stripe Node</SectionTitle><Grid container spacing={3}><Grid item xs={12} md={6}><StyledSelect label="Stripe Active" value={settings.stripeActive} field="stripeActive" options={["Yes", "No"]} /></Grid><Grid item xs={12} md={6}><StyledTextField label="Publishable Key" value={settings.stripePublishableKey} field="stripePublishableKey" /></Grid><Grid item xs={12} md={6}><StyledTextField label="Secret Key" value={settings.stripeSecretKey} field="stripeSecretKey" /></Grid></Grid></Box>
                  )}
              </Box>
          );
      case "map":
          return (
              <Box>
                  <SectionTitle subtitle="Global positioning nodes.">Geo Parameters</SectionTitle>
                  <Box sx={{ p: 4, bgcolor: "#111c44", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
                      <Box><Typography variant="body2" fontWeight="900" color="#fff">{settings.mapStatus}</Typography><Typography variant="caption" sx={{ opacity:0.7 }}>PROPELLER: {settings.mapType}</Typography></Box>
                      <Button size="small" variant="contained" onClick={()=>setShowMapEdit(true)} sx={{ bgcolor:"#fff", color:"#111c44", borderRadius: "10px", px: 3, fontWeight:900 }}>Edit Map Setup</Button>
                  </Box>
                  <Dialog open={showMapEdit} onClose={()=>setShowMapEdit(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius:"24px" } }}>
                      <DialogTitle sx={{ p:2, display:"flex", justifyContent:"space-between" }}><Typography fontWeight="900">Edit Map Settings</Typography><IconButton onClick={()=>setShowMapEdit(false)} size="small"><CloseIcon /></IconButton></DialogTitle>
                      <DialogContent dividers>
                        <Box sx={{ py: 2, mb: 3, display: "flex", justifyContent: "space-around", bgcolor: "#f8faff", borderRadius: "16px", p: 2 }}>
                            {["Mapbox", "Google Map"].map(opt => (
                                <Box key={opt} sx={{ display:"flex", alignItems:"center" }}><Radio checked={settings.mapType === opt} onChange={()=>handleInputChange("mapType", opt)} size="small"/><Typography fontWeight="900" fontSize="13px" color="#1b2559">{opt}</Typography></Box>
                            ))}
                        </Box>
                        <StyledTextField label={settings.mapType === "Google Map" ? "Google map" : "Mapbox Token"} value={settings.mapType === "Google Map" ? settings.googleMapKey : settings.mapboxKey} field={settings.mapType === "Google Map" ? "googleMapKey" : "mapboxKey"} />
                      </DialogContent>
                      <DialogActions sx={{ p: 3, gap: 2 }}>
                          <Button fullWidth variant="contained" onClick={()=>{handleInputChange("mapStatus", `${settings.mapType} ON`); setShowMapEdit(false);}} sx={{ bgcolor: indigoPrimary, borderRadius: "10px", py: 1.5, fontWeight: 900 }}>{settings.mapType} ON</Button>
                          <Button variant="outlined" onClick={()=>setShowMapEdit(false)} sx={{ borderColor: "#e0e5f2", color: "#707eae", borderRadius: "10px", py: 1.5, fontWeight: 900, minWidth: "120px" }}>Close</Button>
                      </DialogActions>
                  </Dialog>
              </Box>
          );
      case "incentive":
          return (
            <Box>
                <SectionTitle subtitle="Base rewards.">Driver Incentive (Rs)</SectionTitle>
                <StyledTextField label="Driver Incentive Per Order" value={settings.driverIncentive} field="driverIncentive" type="number" />
            </Box>
          );
      case "link":
          return (
            <Box>
                <SectionTitle subtitle="Market distribution.">App Link</SectionTitle>
                <StyledTextField label="Android App Link" value={settings.androidLink} field="androidLink" multiline rows={2} />
                <StyledTextField label="IOS App Link" value={settings.iosLink} field="iosLink" multiline rows={2} />
            </Box>
          );
      case "image":
          return (<Box><SectionTitle subtitle="Asset hosting.">Storage Ops</SectionTitle><StyledSelect label="Protocol Provider" value={settings.imageStorage} field="imageStorage" options={["Same Server", "AWS S3", "Digital Ocean"]} /></Box>);
      case "notice":
          return (
            <Box>
                <SectionTitle subtitle="Platform broadcast.">App Notice</SectionTitle>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}><StyledSelect label="Status" value={settings.noticeStatus} field="noticeStatus" options={["Active", "Inactive"]} /></Grid>
                    <Grid item xs={12}><StyledTextField label="Notice" value={settings.noticeText} field="noticeText" multiline rows={4} /></Grid>
                </Grid>
            </Box>
          );
      default: return null;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box><Typography variant="h6" fontWeight="900" color="#1b2559">Command Hub</Typography><Typography variant="caption" color="#a3aed0" fontWeight="800">Operational Sync Portal</Typography></Box>
        <Button variant="contained" startIcon={<SaveIcon sx={{ fontSize: 16 }} />} onClick={() => setOpen(true)} sx={{ backgroundColor: indigoPrimary, borderRadius: "10px", px: 4, fontWeight: "900", fontSize: "13px" }}>Commit Sync</Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3.2}>
            <Paper sx={{ borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid #e0e5f2", p: 0.8, bgcolor: "#fff" }}>
                <List dense sx={{ p: 0 }}>
                    {menuItems.map((item) => (
                        <ListItem button key={item.id} onClick={() => setActiveTab(item.id)}
                            sx={{ borderRadius: "14px", mb: 0.2, py: 1.5, px: 1, bgcolor: activeTab === item.id ? indigoPrimary : "transparent", color: activeTab === item.id ? "white" : "#707eae", transition: "0.2s",
                                "& .MuiListItemIcon-root": { color: "inherit", minWidth: 28 },
                                "&:hover": { bgcolor: activeTab === item.id ? indigoPrimary : alpha(indigoPrimary, 0.05) },
                            }}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={<Typography fontWeight="900" sx={{ fontSize: "11px", whiteSpace: "nowrap", letterSpacing: "-0.5px" }}>{item.label}</Typography>} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Grid>
        <Grid item xs={12} md={8.8}>
            <Paper sx={{ p: 4, borderRadius: "28px", border: "1px solid #e0e5f2", bgcolor: "#fff", minHeight: "650px" }}>{renderContent()}</Paper>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity="success" sx={{ borderRadius: "10px", fontWeight: "900", fontSize: "12px" }}>Nodes Synchronized Successfully.</Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
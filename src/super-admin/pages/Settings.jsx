import React, { useState, useRef } from "react";
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
  Radio,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  alpha,
  Tooltip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Sms as SmsIcon,
  Map as MapIcon,
  DirectionsCar as DirectionsCarIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Campaign as CampaignIcon,
  CloudUpload as BrowseGalleryIcon,
  Hub as HubIcon,
  Shield as ShieldIcon,
  AccountBalance as AccountBalanceIcon,
  ArrowForward as ArrowIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon
} from "@mui/icons-material";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("global");
  const [open, setOpen] = useState(false);
  const [activeGateway, setActiveGateway] = useState("Easebuzz");
  const indigoPrimary = "#4318ff";

  const [settings, setSettings] = useState({
    appName: "Day Catch", countryCode: "+91", phoneLength: "10", lastLocation: "Save", footerText: "Day Catch © 2024", liveChat: "OFF",
    currencyName: "Indian Rupee(For Razorpay)", currencySign: "₹", referralFor: "1st Order Completion", minReferral: "50", maxReferral: "500",
    firebaseOtp: true, firebaseIso: "INR",
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
    { id: "global", label: "Core Architecture", icon: <HubIcon fontSize="small" /> },
    { id: "sms", label: "Communications Hub", icon: <SmsIcon fontSize="small" /> },
    { id: "fcm", label: "Identity Protocols", icon: <ShieldIcon fontSize="small" /> },
    { id: "payment", label: "Financial Engine", icon: <AccountBalanceIcon fontSize="small" /> },
    { id: "map", label: "Geo Parameters", icon: <MapIcon fontSize="small" /> },
    { id: "incentive", label: "Logistics Boost", icon: <DirectionsCarIcon fontSize="small" /> },
    { id: "link", label: "App Link Distribution", icon: <LinkIcon fontSize="small" /> },
    { id: "image", label: "Asset Storage", icon: <ImageIcon fontSize="small" /> },
    { id: "notice", label: "Global Notice", icon: <CampaignIcon fontSize="small" /> },
  ];

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    if (field === "gateway") { setActiveGateway(value); }
  };

  const handleFileChange = (field, file) => { 
    if (file) { 
      const reader = new FileReader(); 
      reader.onloadend = () => setSettings(prev => ({ ...prev, [field]: reader.result })); 
      reader.readAsDataURL(file); 
    } 
  };

  const SectionTitle = ({ children, subtitle }) => (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h4" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1.5px" }}>{children}</Typography>
      {subtitle && <Typography variant="body1" color="#a3aed0" fontWeight="700" sx={{ display: "block", mt: 0.5 }}>{subtitle}</Typography>}
      <Divider sx={{ mt: 3, borderColor: "#f1f4f9" }} />
    </Box>
  );

  const StyledTextField = ({ label, value, field, type = "text", placeholder, multiline = false, rows = 1, helper }) => (
    <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1.2, ml: 0.5 }}>{label}</Typography>
        <TextField 
          fullWidth 
          type={type} 
          placeholder={placeholder} 
          multiline={multiline} 
          rows={rows} 
          value={value} 
          onChange={(e) => handleInputChange(field, e.target.value)}
          InputProps={{ sx: { borderRadius: "16px", backgroundColor: "#fcfdff", fontSize: "14px", fontWeight: "700" } }}
          sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#e0e5f2" } } }} 
        />
        {helper && <Typography variant="caption" color="#a3aed0" sx={{ ml: 1, mt: 0.5, fontWeight: 700 }}>{helper}</Typography>}
    </Box>
  );

  const StyledSelect = ({ label, value, field, options }) => (
    <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1.2, ml: 0.5 }}>{label}</Typography>
        <FormControl fullWidth size="small">
            <Select value={value} onChange={(e) => handleInputChange(field, e.target.value)} sx={{ borderRadius: "16px", backgroundColor: "#fcfdff", fontSize: "14px", fontWeight: "700", py: 0.5 }}>
                {options.map(opt => <MenuItem key={opt} value={opt} sx={{ fontWeight: 800, fontSize: "14px" }}>{opt}</MenuItem>)}
            </Select>
        </FormControl>
    </Box>
  );

  const ImageUploadBox = ({ label, value, field }) => {
    const inputRef = useRef(null);
    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1.2, ml: 0.5 }}>{label}</Typography>
            <input type="file" hidden ref={inputRef} accept="image/*" onChange={(e) => handleFileChange(field, e.target.files[0])} />
            <Box onClick={() => inputRef.current.click()} sx={{ p: 4, border: "2px dashed #e0e5f2", borderRadius: "18px", textAlign: "center", cursor: "pointer", backgroundColor: "#fcfdff", transition: "0.2s", "&:hover": { borderColor: indigoPrimary, bgcolor: alpha(indigoPrimary, 0.02) } }}>
                {value ? <img src={value} alt={label} style={{ maxHeight: "80px", maxWidth: "100%", objectFit: "contain", borderRadius: "8px" }} /> : <><BrowseGalleryIcon sx={{ color: indigoPrimary, fontSize: 32, mb: 1 }} /><Typography variant="body2" fontWeight="800" color="#1b2559">Upload {label}</Typography></>}
            </Box>
        </Box>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "global":
        return (
          <Box>
            <SectionTitle subtitle="Core platform configurations and localization parameters.">System Architecture</SectionTitle>
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
            <Box sx={{ mt: 8 }}>
                <SectionTitle subtitle="Define primary monetary nomenclature.">Currency Node</SectionTitle>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}><StyledSelect label="Legal Currency Name" value={settings.currencyName} field="currencyName" options={["Indian Rupee(For Razorpay)", "U.S. Dollar", "Euro", "Australian Dollar"]} /></Grid>
                    <Grid item xs={12} md={6}><StyledTextField label="Monetary Symbol" value={settings.currencySign} field="currencySign" placeholder="₹" /></Grid>
                </Grid>
            </Box>
            <Box sx={{ mt: 8 }}>
                <SectionTitle subtitle="Incentivizing community growth through referrals.">Referral Ecosystem</SectionTitle>
                <Grid container spacing={4}>
                    <Grid item xs={12}><StyledTextField label="Referral Action Trigger" value={settings.referralFor} field="referralFor" placeholder="e.g. First successful order" /></Grid>
                    <Grid item xs={12} md={6}><StyledTextField label="Minimum Reward (₹)" value={settings.minReferral} field="minReferral" type="number" /></Grid>
                    <Grid item xs={12} md={6}><StyledTextField label="Maximum Cap (₹)" value={settings.maxReferral} field="maxReferral" type="number" /></Grid>
                </Grid>
            </Box>
          </Box>
        );
      case "sms":
        return (
            <Box>
                <SectionTitle subtitle="Configure outreach gateways and OTP verification nodes.">Communications Portal</SectionTitle>
                <Paper sx={{ p: 4, bgcolor: alpha(indigoPrimary, 0.04), borderRadius: "24px", border: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", mb: 5, boxShadow: "none" }}>
                    <Box>
                        <Typography variant="h6" fontWeight="900" color="#1b2559">Outreach Gateway</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                           <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: settings.smsGateway === "OFF" ? "#ee5d50" : "#05cd99" }} />
                           <Typography variant="body2" fontWeight="800" color="#707eae">PRIMARY NODE: {settings.smsGateway}</Typography>
                        </Stack>
                    </Box>
                    <Button variant="contained" onClick={() => setShowSmsEdit(true)} sx={{ bgcolor: indigoPrimary, borderRadius: "14px", fontWeight: 900, px: 4, py: 1.5, boxShadow: "0 10px 20px rgba(67,24,255,0.2)" }}>Configure Gateway</Button>
                </Paper>

                <Box sx={{ mt: 5 }}><SectionTitle subtitle="Cloud verification nodes for MFA.">Firebase Integration (OTP)</SectionTitle>
                    <Paper sx={{ p: 4, bgcolor: "#fff", borderRadius: "24px", border: "1px solid #e0e5f2", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
                        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4 }}>
                            <Box sx={{ flex: 1 }}>
                               <Typography variant="subtitle1" fontWeight="900" color="#1b2559">Activate Cloud OTP</Typography>
                               <Typography variant="body2" fontWeight="700" color="#a3aed0">Use Firebase cloud nodes to handle mobile verification threads.</Typography>
                            </Box>
                            <Switch checked={settings.firebaseOtp} onChange={(e) => handleInputChange("firebaseOtp", e.target.checked)} sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#05cd99" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#05cd99" } }} />
                        </Stack>
                        <StyledTextField label="Regional ISO Protocol" value={settings.firebaseIso} field="firebaseIso" placeholder="INR" />
                    </Paper>
                </Box>
            </Box>
        );
      case "fcm":
          return (
              <Box>
                  <SectionTitle subtitle="Neural keys required for synchronized cloud notifications.">Push Identity Protocols</SectionTitle>
                  <Stack spacing={4}>
                      <StyledTextField label="User Endpoint Server Key" value={settings.userFcm} field="userFcm" multiline rows={3} helper="Primary key for Customer Native App synchronization." />
                      <StyledTextField label="Partner / Store Endpoint Key" value={settings.vendorFcm} field="vendorFcm" multiline rows={3} helper="Cloud key for Store Sub-Admin terminal links." />
                      <StyledTextField label="Driver Intelligence Key" value={settings.driverFcm} field="driverFcm" multiline rows={3} helper="Logistical sync key for Delivery Partner nodes." />
                  </Stack>
              </Box>
          );
      case "payment":
          return (
              <Box>
                  <SectionTitle subtitle="Configure high-performance financial switches.">Financial Ecosystem</SectionTitle>
                  <Paper sx={{ p: 4, borderRadius: "24px", border: "1px solid #e0e5f2", mb: 8, boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
                      <StyledSelect label="Select Primary Active Gateway" value={settings.gateway} field="gateway" options={["Razorpay", "Stripe", "Paystack", "Easebuzz"]} />
                      <Button variant="contained" endIcon={<ArrowIcon />} onClick={() => setOpen(true)} sx={{ bgcolor: indigoPrimary, borderRadius: "14px", fontWeight: 900, px: 5, py: 1.8 }}>Update Engine Node</Button>
                  </Paper>
                  
                  <Box sx={{ bgcolor: alpha(indigoPrimary, 0.02), p: 5, borderRadius: "32px", border: "1px solid #eef2f6" }}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                         <AccountBalanceIcon sx={{ color: indigoPrimary }} />
                         <Typography variant="h5" fontWeight="900" color="#1b2559">{activeGateway} Configuration</Typography>
                      </Stack>
                      {activeGateway === "Easebuzz" && (
                        <Grid container spacing={4}>
                           <Grid item xs={12} md={6}><StyledSelect label="Node Status" value={settings.easebuzzActive} field="easebuzzActive" options={["Yes", "No"]} /></Grid>
                           <Grid item xs={12} md={6}><StyledTextField label="Public Merchant Key" value={settings.merchantKey} field="merchantKey" /></Grid>
                           <Grid item xs={12} md={6}><StyledTextField label="Secure Salt Key" value={settings.saltKey} field="saltKey" type="password" /></Grid>
                           <Grid item xs={12} md={6}><StyledSelect label="Operational Environment" value={settings.environment} field="environment" options={["Production", "Sandbox"]} /></Grid>
                        </Grid>
                      )}
                      {activeGateway === "Razorpay" && (
                        <Grid container spacing={4}>
                           <Grid item xs={12} md={6}><StyledSelect label="Node Status" value={settings.razorpayActive} field="razorpayActive" options={["Yes", "No"]} /></Grid>
                           <Grid item xs={12} md={6}><StyledTextField label="Public Key ID" value={settings.razorpayKeyId} field="razorpayKeyId" /></Grid>
                           <Grid item xs={12} md={6}><StyledTextField label="Secure Secret Key" value={settings.razorpayKeySecret} field="razorpayKeySecret" type="password" /></Grid>
                        </Grid>
                      )}
                  </Box>
              </Box>
          );
      case "map":
          return (
              <Box>
                  <SectionTitle subtitle="Spatial intelligence and global positioning nodes.">Geo Parameters</SectionTitle>
                  <Paper sx={{ p: 5, bgcolor: "#111c44", borderRadius: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff", boxShadow: "0 20px 50px rgba(17,28,68,0.25)" }}>
                      <Stack spacing={0.5}>
                          <Typography variant="h5" fontWeight="900">{settings.mapStatus}</Typography>
                          <Typography variant="body2" sx={{ opacity: 0.7, fontWeight: 700 }}>ACTIVE PROPELLER: {settings.mapType.toUpperCase()}</Typography>
                      </Stack>
                      <Button variant="contained" onClick={() => setShowMapEdit(true)} sx={{ bgcolor: "#fff", color: "#111c44", borderRadius: "14px", px: 5, py: 1.8, fontWeight: 900, "&:hover": { bgcolor: alpha("#fff", 0.9) } }}>Re-calibrate Map</Button>
                  </Paper>
              </Box>
          );
      case "incentive":
          return (
            <Box>
                <SectionTitle subtitle="Standard rewards per successful delivery mission.">Logistic Incentives</SectionTitle>
                <Paper sx={{ p: 5, borderRadius: "32px", border: "1px solid #e0e5f2", display: "flex", alignItems: "center", gap: 5 }}>
                    <Box sx={{ p: 3, borderRadius: "24px", bgcolor: alpha("#05cd99", 0.1), color: "#05cd99" }}><DirectionsCarIcon fontSize="large" /></Box>
                    <Box sx={{ flex: 1 }}><StyledTextField label="Base Incentive (₹)" value={settings.driverIncentive} field="driverIncentive" type="number" helper="Flat fee calculated per completed order signature." /></Box>
                </Paper>
            </Box>
          );
      case "notice":
          return (
            <Box>
                <SectionTitle subtitle="Broadcast urgent messages across all platform endpoints.">Global Multi-Node Broadcast</SectionTitle>
                <Paper sx={{ p: 5, borderRadius: "32px", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.02)" }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}><StyledSelect label="Transmission Status" value={settings.noticeStatus} field="noticeStatus" options={["Active", "Inactive"]} /></Grid>
                        <Grid item xs={12}><StyledTextField label="Broadcast Message Payload" value={settings.noticeText} field="noticeText" multiline rows={6} placeholder="Enter message to display on all apps..." /></Grid>
                    </Grid>
                </Paper>
            </Box>
          );
      default: return null;
    }
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 6, display: "flex", justifyContent: "space-between", alignItems: "flex-end", maxWidth: "1600px", mx: "auto" }}>
        <Box>
           <Typography variant="h2" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-2px", mb: 0.5 }}>System Command Hub</Typography>
           <Typography variant="h6" color="#a3aed0" fontWeight="700">Synchronize global operational parameters and cloud nodes.</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<SaveIcon />} 
          onClick={() => setOpen(true)} 
          sx={{ backgroundColor: indigoPrimary, borderRadius: "18px", px: 6, py: 2, fontWeight: 900, fontSize: "16px", boxShadow: "0 15px 35px rgba(67,24,255,0.25)" }}
        >
          Commit Global Sync
        </Button>
      </Box>

      <Grid container spacing={4} sx={{ maxWidth: "1600px", mx: "auto" }}>
        <Grid item xs={12} md={4} lg={3}>
            <Paper sx={{ borderRadius: "32px", boxShadow: "0 15px 45px rgba(0,0,0,0.03)", border: "1px solid #e0e5f2", p: 1.5, bgcolor: "#fff", position: "sticky", top: "100px" }}>
                <List dense sx={{ p: 0 }}>
                    {menuItems.map((item) => (
                        <ListItem 
                            button 
                            key={item.id} 
                            onClick={() => setActiveTab(item.id)}
                            sx={{ 
                                borderRadius: "20px", 
                                mb: 0.5, 
                                py: 2, 
                                px: 2, 
                                bgcolor: activeTab === item.id ? indigoPrimary : "transparent", 
                                color: activeTab === item.id ? "white" : "#707eae", 
                                transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                "& .MuiListItemIcon-root": { color: "inherit", minWidth: 40 },
                                "&:hover": { bgcolor: activeTab === item.id ? indigoPrimary : alpha(indigoPrimary, 0.05), transform: "translateX(5px)" },
                            }}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={<Typography fontWeight="900" sx={{ fontSize: "13px", letterSpacing: "-0.2px" }}>{item.label}</Typography>} />
                            {activeTab === item.id && <ArrowIcon sx={{ fontSize: 16, opacity: 0.7 }} />}
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Grid>
        <Grid item xs={12} md={8} lg={9}>
            <Paper sx={{ p: 6, borderRadius: "40px", border: "1px solid #e0e5f2", bgcolor: "#fff", minHeight: "750px", boxShadow: "0 10px 40px rgba(0,0,0,0.01)" }}>
               {renderContent()}
            </Paper>
        </Grid>
      </Grid>

      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" sx={{ borderRadius: "16px", fontWeight: "900", fontSize: "14px", boxShadow: "0 15px 35px rgba(0,0,0,0.15)", px: 4, py: 2 }}>Global Sync Successful. System parameters updated globally.</Alert>
      </Snackbar>

      {/* Re-using Dialog implementations from previous version for brevity but with updated styles */}
      <Dialog open={showSmsEdit} onClose={()=>setShowSmsEdit(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius:"32px", p: 2 } }}>
           <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h5" fontWeight="900">SMS Gateway Protocol</Typography>
              <IconButton onClick={()=>setShowSmsEdit(false)}><CloseIcon /></IconButton>
           </DialogTitle>
           <DialogContent sx={{ py: 3 }}>
               <Alert severity="warning" sx={{ mb: 4, borderRadius: "16px", fontWeight: 700 }}>Modifying these keys will affect all mobile verification OTPs immediately.</Alert>
               <StyledTextField label="Bearer Security Token" value={settings.smsBearerToken} field="smsBearerToken" />
               <Grid container spacing={2}>
                  <Grid item xs={6}><StyledTextField label="Sender ID" value={settings.smsSenderId} field="smsSenderId" /></Grid>
                  <Grid item xs={6}><StyledTextField label="DLT ID" value={settings.smsDltTemplateId} field="smsDltTemplateId" /></Grid>
               </Grid>
           </DialogContent>
           <DialogActions sx={{ p: 3 }}><Button fullWidth variant="contained" onClick={()=>setShowSmsEdit(false)} sx={{ bgcolor: indigoPrimary, borderRadius: "16px", py: 2, fontWeight: 900 }}>Update Gateway</Button></DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;

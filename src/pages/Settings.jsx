import React, { useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Grid,
  Divider,
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";
import SmsIcon from "@mui/icons-material/Sms";
import KeyIcon from "@mui/icons-material/Key";
import PaymentIcon from "@mui/icons-material/Payment";
import MapIcon from "@mui/icons-material/Map";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LinkIcon from "@mui/icons-material/Link";
import ImageIcon from "@mui/icons-material/Image";
import CampaignIcon from "@mui/icons-material/Campaign";
import BrowseGalleryIcon from "@mui/icons-material/BrowseGallery";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("global");
  const [open, setOpen] = useState(false);
  const [activeGateway, setActiveGateway] = useState("Easebuzz");

  const handleSave = () => {
    // In a real app, you would call your API here
    setOpen(true);
  };

  const handleUpdateGateway = () => {
    setActiveGateway(settings.gateway);
    setOpen(true);
  };

  const [settings, setSettings] = useState({
    // Global
    appName: "",
    countryCode: "",
    phoneLength: "",
    lastLocation: "Save",
    footerText: "",
    liveChat: "OFF",
    // Currency
    currencyName: "",
    currencySign: "",
    // Referral
    referralFor: "",
    minReferral: "",
    maxReferral: "",
    // SMS
    firebaseOtp: false,
    firebaseIso: "",
    // FCM
    userFcm: "",
    vendorFcm: "",
    driverFcm: "",
    // Payment
    gateway: "Easebuzz",
    easebuzzActive: "Yes",
    merchantKey: "",
    saltKey: "",
    environment: "Sandbox",
    // Map
    mapStatus: "Google Map Off",
    mapType: "Google Map",
    googleMapKey: "",
    mapboxKey: "",
    // Incentive
    driverIncentive: "",
    // App Links
    androidLink: "",
    iosLink: "",
    // Image Store
    imageStorage: "Same Server",
    // Notice
    noticeStatus: "Inactive",
    noticeText: "",
    siteLogo: null,
    favicon: null,
    // Razorpay
    razorpayActive: "No",
    razorpayKeyId: "",
    razorpayKeySecret: "",
    // Stripe
    stripeActive: "No",
    stripePublishableKey: "",
    stripeSecretKey: "",
    // Paystack
    paystackActive: "No",
    paystackPublicKey: "",
    paystackSecretKey: "",
    // SMS Gateway
    smsGateway: "OFF",
    smsBearerToken: "",
    smsSenderId: "",
    smsPrincipalEntityId: "",
    smsDltTemplateId: "",
    smsChainValue: ""
  });

  const [showSmsEdit, setShowSmsEdit] = useState(false);
  const [showMapEdit, setShowMapEdit] = useState(false);

  const menuItems = [
    { id: "global", label: "Global Settings", icon: <SettingsIcon /> },
    { id: "sms", label: "SMS/OTP Settings", icon: <SmsIcon /> },
    { id: "fcm", label: "FCM Keys", icon: <KeyIcon /> },
    { id: "payment", label: "Payment Mode", icon: <PaymentIcon /> },
    { id: "map", label: "Map Settings", icon: <MapIcon /> },
    { id: "incentive", label: "Driver Incentive(Per Order)", icon: <DirectionsCarIcon /> },
    { id: "link", label: "App Link", icon: <LinkIcon /> },
    { id: "image", label: "Images Store", icon: <ImageIcon /> },
    { id: "notice", label: "App Notice", icon: <CampaignIcon /> },
  ];

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const SectionTitle = ({ children }) => (
    <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3, pb: 1, borderBottom: "1px solid #f1f1f1" }}>
      {children}
    </Typography>
  );

  const StyledTextField = ({ label, value, field, type = "text", placeholder, multiline = false, rows = 1 }) => (
    <Box sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>{label}</Typography>
        <TextField
            fullWidth
            size="small"
            type={type}
            placeholder={placeholder}
            multiline={multiline}
            rows={rows}
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            sx={{ 
                "& .MuiOutlinedInput-root": { 
                    borderRadius: "12px", 
                    backgroundColor: "#fff",
                    "& fieldset": { borderColor: "#e9edf7" },
                    "&:hover fieldset": { borderColor: "#2d60ff" }
                } 
            }}
        />
    </Box>
  );

  const StyledSelect = ({ label, value, field, options }) => (
    <Box sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>{label}</Typography>
        <FormControl fullWidth size="small">
            <Select
                value={value}
                onChange={(e) => handleInputChange(field, e.target.value)}
                sx={{ 
                    borderRadius: "12px", 
                    backgroundColor: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e9edf7" }
                }}
            >
                {options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </Select>
        </FormControl>
    </Box>
  );

  const ImageUploadBox = ({ label, value, field }) => {
    const inputRef = React.useRef(null);
    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>{label}</Typography>
            <input 
                type="file" 
                hidden 
                ref={inputRef} 
                accept="image/*"
                onChange={(e) => handleFileChange(field, e.target.files[0])}
            />
            <Box 
                onClick={() => inputRef.current.click()}
                sx={{ 
                    p: 3, 
                    border: "1px dashed #e9edf7", 
                    borderRadius: "16px", 
                    textAlign: "center", 
                    cursor: "pointer",
                    backgroundColor: "#fff",
                    transition: "all 0.2s",
                    "&:hover": { borderColor: "#2d60ff", backgroundColor: "#f4f7fe" },
                    height: "120px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden"
                }}
            >
                {value ? (
                    <img src={value} alt={label} style={{ maxHeight: "100%", maxWidth: "100%", borderRadius: "8px" }} />
                ) : (
                    <>
                        <BrowseGalleryIcon sx={{ fontSize: 40, color: "#2d60ff", mb: 1 }} />
                        <Typography variant="body2" fontWeight="600" color="#a3aed0">Browse Image</Typography>
                    </>
                )}
            </Box>
        </Box>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "global":
        return (
          <Box>
            <SectionTitle>App Name | Site Logo | Favicon | Country Code</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <StyledTextField label="App Name" value={settings.appName} field="appName" />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField label="Country Code" value={settings.countryCode} field="countryCode" />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField label="Phone Number Length" value={settings.phoneLength} field="phoneLength" />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledSelect label="Last Location in App" value={settings.lastLocation} field="lastLocation" options={["Save", "Clear"]} />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <ImageUploadBox label="Site Logo" value={settings.siteLogo} field="siteLogo" />
              </Grid>
              <Grid item xs={12} md={6}>
                <ImageUploadBox label="Favicon" value={settings.favicon} field="favicon" />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <StyledTextField label="Footer Text" value={settings.footerText} field="footerText" />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledSelect label="Live Chat Between User-Vendor/store" value={settings.liveChat} field="liveChat" options={["OFF", "ON"]} />
              </Grid>
            </Grid>
            <Button variant="contained" onClick={handleSave} sx={{ mt: 2, bgcolor: "#2d60ff", borderRadius: "10px", px: 4, textTransform: "none" }}>Update</Button>

            <Box sx={{ mt: 4 }}>
                <SectionTitle>Currency</SectionTitle>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <StyledSelect 
                            label="Currency Name" 
                            value={settings.currencyName} 
                            field="currencyName" 
                            options={[
                                "U.S. Dollar",
                                "Indian Rupee(For Razorpay)",
                                "Australian Dollar",
                                "Brazilian Real",
                                "Canadian Dollar",
                                "Czech Koruna",
                                "Danish Krone",
                                "Euro",
                                "Hong Kong Dollar",
                                "Hungarian Forint",
                                "Israeli New Sheqel",
                                "Japanese Yen"
                            ]} 
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <StyledTextField label="Currency Sign" value={settings.currencySign} field="currencySign" />
                    </Grid>
                </Grid>
                <Button variant="contained" onClick={handleSave} sx={{ mt: 1, bgcolor: "#2d60ff", borderRadius: "10px", px: 4, textTransform: "none" }}>Submit</Button>
            </Box>

            <Box sx={{ mt: 5 }}>
                <SectionTitle>Referral Points</SectionTitle>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <StyledTextField label="Referral For" value={settings.referralFor} field="referralFor" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <StyledTextField label="min amount :" value={settings.minReferral} field="minReferral" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <StyledTextField label="max amount :" value={settings.maxReferral} field="maxReferral" />
                    </Grid>
                </Grid>
                <Button variant="contained" onClick={handleSave} sx={{ mt: 1, bgcolor: "#2d60ff", borderRadius: "10px", px: 4, textTransform: "none" }}>Update</Button>
            </Box>
          </Box>
        );
      case "sms":
        return (
            <Box>
                <SectionTitle>SMS from</SectionTitle>
                <Box sx={{ p: 3, border: "1px solid #f1f1f1", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ width: 10, height: 10, bgcolor: "#05cd99", borderRadius: "50%" }} />
                        <Typography fontWeight="700" color="#1b2559">SMS Gateway</Typography>
                    </Stack>
                    <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => setShowSmsEdit(true)}
                        sx={{ color: "#1b2559", borderColor: "#f1f1f1" }}
                    >
                        Edit
                    </Button>
                </Box>

                <Dialog 
                    open={showSmsEdit} 
                    onClose={() => setShowSmsEdit(false)}
                    fullWidth
                    maxWidth="sm"
                    PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
                >
                    <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography fontWeight="700" color="#1b2559">Edit SMS Gateway</Typography>
                        <IconButton onClick={() => setShowSmsEdit(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers sx={{ borderBottom: "none" }}>
                        <Box sx={{ py: 2, mb: 4, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                            {["Msg91", "GoExperts OTP", "OFF"].map((option) => (
                                <Box key={option} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Radio 
                                        checked={settings.smsGateway === option} 
                                        onChange={() => handleInputChange("smsGateway", option)} 
                                        sx={{ 
                                            color: "#e9edf7", 
                                            "&.Mui-checked": { color: "#2d60ff" },
                                            "& .MuiSvgIcon-root": { fontSize: 28 } 
                                        }} 
                                    />
                                    <Typography fontWeight="700" color="#1b2559" variant="h6">{option}</Typography>
                                </Box>
                            ))}
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <StyledTextField label="Bearer Token" value={settings.smsBearerToken} field="smsBearerToken" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledTextField label="Sender ID" value={settings.smsSenderId} field="smsSenderId" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledTextField label="Principal Entity ID" value={settings.smsPrincipalEntityId} field="smsPrincipalEntityId" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledTextField label="DLT Template ID" value={settings.smsDltTemplateId} field="smsDltTemplateId" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledTextField label="Chain Value" value={settings.smsChainValue} field="smsChainValue" />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, justifyContent: "center", gap: 2 }}>
                        <Button 
                            variant="contained" 
                            onClick={() => { handleSave(); setShowSmsEdit(false); }} 
                            sx={{ 
                                bgcolor: "#2d60ff", 
                                borderRadius: "10px", 
                                px: 4, 
                                py: 1.2,
                                textTransform: "none",
                                fontWeight: "700" 
                            }}
                        >
                            {settings.smsGateway} ON
                        </Button>
                        <Button 
                            variant="outlined" 
                            onClick={() => setShowSmsEdit(false)}
                            sx={{ 
                                borderRadius: "10px", 
                                px: 4, 
                                color: "#1b2559", 
                                borderColor: "#e9edf7",
                                textTransform: "none" 
                            }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                <SectionTitle>Firebase for OTP</SectionTitle>
                <Paper sx={{ p: 3, bgcolor: "#f4f7fe", borderRadius: "16px", border: "none", boxShadow: "none" }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                        <Switch checked={settings.firebaseOtp} onChange={(e) => handleInputChange("firebaseOtp", e.target.checked)} />
                        <Typography variant="body2" fontWeight="600" color="#1b2559">Toggle this switch element on for Firebase for OTP</Typography>
                    </Stack>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <StyledTextField label="Firebase ISO(used for firebase otp)" value={settings.firebaseIso} field="firebaseIso" />
                        </Grid>
                    </Grid>
                    <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "#2d60ff", borderRadius: "10px", px: 4, textTransform: "none" }}>Update</Button>
                </Paper>
            </Box>
        );
      case "fcm":
        return (
            <Box>
                <SectionTitle>FCM Server Key</SectionTitle>
                <StyledTextField label="User App FCM Server Key" value={settings.userFcm} field="userFcm" />
                <StyledTextField label="Vendor/Store App FCM Server Key" value={settings.vendorFcm} field="vendorFcm" />
                <StyledTextField label="Driver App FCM Server Key" value={settings.driverFcm} field="driverFcm" />
                <Button variant="contained" onClick={handleSave} sx={{ mt: 2, bgcolor: "#2d60ff", borderRadius: "10px", px: 4, textTransform: "none" }}>Update</Button>
            </Box>
        );
      case "payment":
        return (
            <Box>
                <SectionTitle>Payment Gateways</SectionTitle>
                <Paper sx={{ p: 4, border: "1px solid #f1f1f1", borderRadius: "20px", mb: 4, boxShadow: "none" }}>
                    <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 2 }}>Choose One Payment Gateways</Typography>
                    <Box sx={{ p: 3, border: "1px solid #f1f1f1", borderRadius: "12px", mb: 3 }}>
                        <StyledSelect label="Choose One" value={settings.gateway} field="gateway" options={["Razorpay", "Stripe", "Paystack", "Easebuzz"]} />
                        <Button variant="contained" onClick={handleUpdateGateway} sx={{ bgcolor: "#2d60ff", borderRadius: "10px", px: 4, textTransform: "none" }}>Update</Button>
                    </Box>
                </Paper>

                {activeGateway === "Easebuzz" && (
                <Box>
                    <SectionTitle>Easebuzz</SectionTitle>
                    <Paper sx={{ p: 4, border: "1px solid #f1f1f1", borderRadius: "20px", boxShadow: "none" }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <StyledSelect label="Easebuzz Active" value={settings.easebuzzActive} field="easebuzzActive" options={["Yes", "No"]} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledTextField label="Merchant Key" value={settings.merchantKey} field="merchantKey" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledTextField label="Salt Key" value={settings.saltKey} field="saltKey" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledSelect label="Environment" value={settings.environment} field="environment" options={["Production", "Test"]} />
                            </Grid>
                        </Grid>
                        <Button variant="contained" onClick={handleSave} sx={{ mt: 2, bgcolor: "#2d60ff", borderRadius: "10px", px: 4, textTransform: "none" }}>Update</Button>
                    </Paper>
                </Box>
                )}

                {activeGateway === "Razorpay" && (
                <Box>
                    <SectionTitle>Razorpay</SectionTitle>
                    <Paper sx={{ p: 4, border: "1px solid #f1f1f1", borderRadius: "20px", boxShadow: "none" }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <StyledSelect label="Razorpay Active" value={settings.razorpayActive} field="razorpayActive" options={["Yes", "No"]} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledTextField label="Key ID" value={settings.razorpayKeyId} field="razorpayKeyId" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledTextField label="Key Secret" value={settings.razorpayKeySecret} field="razorpayKeySecret" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledSelect label="Environment" value={settings.environment} field="environment" options={["Production", "Test"]} />
                            </Grid>
                        </Grid>
                        <Button variant="contained" onClick={handleSave} sx={{ mt: 2, bgcolor: "#2d60ff", borderRadius: "10px", px: 4, textTransform: "none" }}>Update Razorpay</Button>
                    </Paper>
                </Box>
                )}

                {activeGateway === "Stripe" && (
                <Box>
                    <SectionTitle>Stripe</SectionTitle>
                    <Paper sx={{ p: 4, border: "1px solid #f1f1f1", borderRadius: "20px", boxShadow: "none" }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <StyledSelect label="Stripe Active" value={settings.stripeActive} field="stripeActive" options={["Yes", "No"]} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledTextField label="Publishable Key" value={settings.stripePublishableKey} field="stripePublishableKey" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledTextField label="Secret Key" value={settings.stripeSecretKey} field="stripeSecretKey" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledSelect label="Environment" value={settings.environment} field="environment" options={["Production", "Test"]} />
                            </Grid>
                        </Grid>
                        <Button variant="contained" onClick={handleSave} sx={{ mt: 2, bgcolor: "#2d60ff", borderRadius: "10px", px: 4, textTransform: "none" }}>Update Stripe</Button>
                    </Paper>
                </Box>
                )}

                {activeGateway === "Paystack" && (
                <Box>
                    <SectionTitle>Paystack</SectionTitle>
                    <Paper sx={{ p: 4, border: "1px solid #f1f1f1", borderRadius: "20px", boxShadow: "none" }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <StyledSelect label="Paystack Active" value={settings.paystackActive} field="paystackActive" options={["Yes", "No"]} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledTextField label="Public Key" value={settings.paystackPublicKey} field="paystackPublicKey" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledTextField label="Secret Key" value={settings.paystackSecretKey} field="paystackSecretKey" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledSelect label="Environment" value={settings.environment} field="environment" options={["Production", "Test"]} />
                            </Grid>
                        </Grid>
                        <Button variant="contained" onClick={handleSave} sx={{ mt: 2, bgcolor: "#2d60ff", borderRadius: "10px", px: 4, textTransform: "none" }}>Update Paystack</Button>
                    </Paper>
                </Box>
                )}
            </Box>
        );
      case "map":
        return (
            <Box>
                <SectionTitle>Map Gateway</SectionTitle>
                <Box sx={{ p: 3, border: "1px solid #f1f1f1", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <MapIcon sx={{ color: "#2d60ff" }} />
                        <Typography fontWeight="700" color="#1b2559">{settings.mapStatus}</Typography>
                        <Box sx={{ width: 10, height: 10, bgcolor: settings.mapStatus.includes("Off") ? "#ff4d49" : "#05cd99", borderRadius: "50%" }} />
                    </Stack>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setShowMapEdit(true)}
                        sx={{ color: "#1b2559", borderColor: "#f1f1f1" }}
                    >
                        Edit
                    </Button>
                </Box>

                <Dialog
                    open={showMapEdit}
                    onClose={() => setShowMapEdit(false)}
                    fullWidth
                    maxWidth="sm"
                    PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
                >
                    <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography fontWeight="700" color="#1b2559">Edit Map Settings</Typography>
                        <IconButton onClick={() => setShowMapEdit(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers sx={{ borderBottom: "none" }}>
                        <Box sx={{ py: 2, mb: 4, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                            {["Mapbox", "Google Map"].map((option) => (
                                <Box key={option} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Radio
                                        checked={settings.mapType === option}
                                        onChange={() => handleInputChange("mapType", option)}
                                        sx={{
                                            color: "#e9edf7",
                                            "&.Mui-checked": { color: "#2d60ff" },
                                            "& .MuiSvgIcon-root": { fontSize: 28 }
                                        }}
                                    />
                                    <Typography fontWeight="700" color="#1b2559" variant="h6">{option}</Typography>
                                </Box>
                            ))}
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {settings.mapType === "Google Map" ? (
                                    <StyledTextField
                                        label="Google map"
                                        value={settings.googleMapKey}
                                        field="googleMapKey"
                                        placeholder="Enter Google Map API Key"
                                    />
                                ) : (
                                    <StyledTextField
                                        label="Mapbox key"
                                        value={settings.mapboxKey}
                                        field="mapboxKey"
                                        placeholder="Enter Mapbox Access Token"
                                    />
                                )}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, justifyContent: "center", gap: 2 }}>
                        <Button
                            variant="contained"
                            onClick={() => {
                                handleInputChange("mapStatus", `${settings.mapType} On`);
                                handleSave();
                                setShowMapEdit(false);
                            }}
                            sx={{
                                bgcolor: "#2d60ff",
                                borderRadius: "10px",
                                px: 4,
                                py: 1.2,
                                textTransform: "none",
                                fontWeight: "700"
                            }}
                        >
                            {settings.mapType} ON
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => setShowMapEdit(false)}
                            sx={{
                                borderRadius: "10px",
                                px: 4,
                                color: "#1b2559",
                                borderColor: "#e9edf7",
                                textTransform: "none"
                            }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        );
      case "incentive":
        return (
            <Box>
                <SectionTitle>Driver Incentive (Rs)</SectionTitle>
                <Paper sx={{ p: 4, border: "1px solid #f1f1f1", borderRadius: "20px", boxShadow: "none" }}>
                    <StyledTextField label="Driver Incentive Per Order" value={settings.driverIncentive} field="driverIncentive" type="number" />
                    <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "#2d60ff", borderRadius: "10px", px: 4, textTransform: "none" }}>Update</Button>
                </Paper>
            </Box>
        );
      case "link":
        return (
            <Box>
                <SectionTitle>App Link</SectionTitle>
                <Paper sx={{ p: 4, border: "1px solid #f1f1f1", borderRadius: "20px", boxShadow: "none" }}>
                    <StyledTextField label="Android App Link" value={settings.androidLink} field="androidLink" multiline rows={3} />
                    <StyledTextField label="IOS App Link" value={settings.iosLink} field="iosLink" multiline rows={3} />
                    <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "#2d60ff", borderRadius: "10px", px: 4, textTransform: "none" }}>Update</Button>
                </Paper>
            </Box>
        );
      case "image":
        return (
            <Box>
                <SectionTitle>Images Space</SectionTitle>
                <Paper sx={{ p: 4, border: "1px solid #f1f1f1", borderRadius: "20px", boxShadow: "none" }}>
                    <StyledSelect label="Image Storage Hosting" value={settings.imageStorage} field="imageStorage" options={["Same Server", "AWS", "Digital Ocean"]} />
                    <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "#2d60ff", borderRadius: "10px", px: 4, textTransform: "none" }}>Update</Button>
                </Paper>
            </Box>
        );
      case "notice":
        return (
            <Box>
                <SectionTitle>App Notice</SectionTitle>
                <Paper sx={{ p: 4, border: "1px solid #f1f1f1", borderRadius: "20px", boxShadow: "none" }}>
                    <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 2 }}>Status</Typography>
                    <Stack direction="row" spacing={4} sx={{ mb: 3 }}>
                        <FormControlLabel 
                            control={<Radio checked={settings.noticeStatus === "Active"} onChange={() => handleInputChange("noticeStatus", "Active")} />} 
                            label={<Typography variant="body2" fontWeight="600">Active</Typography>} 
                        />
                        <FormControlLabel 
                            control={<Radio checked={settings.noticeStatus === "Inactive"} onChange={() => handleInputChange("noticeStatus", "Inactive")} />} 
                            label={<Typography variant="body2" fontWeight="600">Inactive</Typography>} 
                        />
                    </Stack>
                    <StyledTextField label="Notice" value={settings.noticeText} field="noticeText" multiline rows={4} />
                    <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "#2d60ff", borderRadius: "10px", px: 4, textTransform: "none" }}>Update</Button>
                </Paper>
            </Box>
        );
      default:
        return <Typography variant="h6" color="textSecondary" align="center" sx={{ py: 10 }}>This section is coming soon...</Typography>;
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 6, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674">Settings Management</Typography>
            <Typography variant="h6" color="#707eae" fontWeight="500">Configure your system preferences and integrations.</Typography>
        </Box>
        <Button 
            variant="contained" 
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{ 
                backgroundColor: "#2d60ff", 
                borderRadius: "12px",
                textTransform: "none",
                px: 3,
                py: 1.5,
                fontWeight: "700",
                boxShadow: "0 4px 12px rgba(45, 96, 255, 0.2)",
                "&:hover": { backgroundColor: "#2046cc" }
            }}
        >
            Save All Changes
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Main Content Area */}
        <Grid item xs={12} md={9}>
            <Paper sx={{ p: 5, borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "none", minHeight: "600px" }}>
                {renderContent()}
            </Paper>
        </Grid>

        {/* Right Sidebar Menu */}
        <Grid item xs={12} md={3}>
            <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "none" }}>
                <Box sx={{ p: 3, bgcolor: "#2d60ff", color: "white" }}>
                    <Typography variant="h6" fontWeight="700">Settings Menu</Typography>
                </Box>
                <List sx={{ p: 1 }}>
                    {menuItems.map((item) => (
                        <ListItem 
                            button 
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            sx={{ 
                                borderRadius: "14px", 
                                mb: 1,
                                bgcolor: activeTab === item.id ? "#f4f7fe" : "transparent",
                                color: activeTab === item.id ? "#2d60ff" : "#707eae",
                                "&:hover": { bgcolor: "#f4f7fe", color: "#2d60ff" }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: activeTab === item.id ? "#2d60ff" : "#707eae" }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={<Typography fontWeight="700" variant="body2">{item.label}</Typography>} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Grid>
      </Grid>

      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: "100%", borderRadius: "12px", fontWeight: "600", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          Settings updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
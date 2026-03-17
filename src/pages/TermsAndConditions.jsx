import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TermsAndConditions = () => {
  const [content, setContent] = useState(`
    <h2>Terms & Conditions</h2>
    
    <h3>1. Use of the Website and Services</h3>
    <p>You agree to use this website and our services only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else’s use and enjoyment of the website.</p>
    <p>You may not:</p>
    <ul>
      <li>Use the site in any way that causes, or may cause, damage to the website or impair the availability or accessibility of the website.</li>
      <li>Use the site to copy, store, host, transmit, send, use, publish, or distribute any material that consists of (or is linked to) any malicious software.</li>
    </ul>

    <h3>2. Intellectual Property Rights</h3>
    <p>All content on the site, including but not limited to text, graphics, logos, images, software, and trademarks, is the property of <strong>VN AQUA RAS PRIVATE LIMITED</strong> or its content suppliers and is protected by intellectual property laws.</p>
    <p>You may not reproduce, duplicate, copy, sell, resell, or exploit any portion of the site or services without express written permission from us.</p>

    <h3>3. User Accounts</h3>
    <p>If any part of the website requires you to register or create an account:</p>
    <ul>
      <li>You must provide accurate, current, and complete information.</li>
      <li>You are responsible for maintaining the confidentiality of your account and password.</li>
      <li>You agree to accept responsibility for all activities that occur under your account.</li>
    </ul>
    <p>We reserve the right to suspend or terminate accounts at our discretion.</p>

    <h3>4. Limitation of Liability</h3>
    <p>To the fullest extent permitted by law, <strong>VN AQUA RAS PRIVATE LIMITED</strong> shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of or inability to use our website or services.</p>
    <p>This includes, but is not limited to, damages for errors, omissions, interruptions, defects, delays, or computer viruses.</p>

    <h3>5. Indemnification</h3>
    <p>You agree to indemnify, defend, and hold harmless <strong>VN AQUA RAS PRIVATE LIMITED</strong>, its directors, officers, employees, affiliates, agents, and licensors from and against all losses, liabilities, expenses, damages, and costs, including reasonable legal fees, resulting from any violation of these Terms or any activity related to your account.</p>

    <h3>6. Privacy Policy</h3>
    <p>Use of our website and services is also governed by our <strong>Privacy Policy</strong>, which can be found at <a href="https://daycatch.in/privacy-policy/">https://daycatch.in/privacy-policy/</a>.</p>

    <h3>7. Changes to the Terms</h3>
    <p>We reserve the right to modify or replace these Terms at any time. We will indicate the date of the most recent changes at the top of this page. Your continued use of the site or services after changes are made signifies your acceptance of those changes.</p>

    <h3>8. Governing Law</h3>
    <p>These Terms shall be governed and construed in accordance with the laws of Telangana, without regard to its conflict of law principles. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Telangana, India.</p>

    <h3>9. Termination</h3>
    <p>We reserve the right to suspend or terminate your access to our website and services, at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or us.</p>

    <h3>10. Contact Us</h3>
    <p>If you have any questions or concerns about these Terms and Conditions, please contact us:</p>
    <p><strong>VN AQUA RAS PRIVATE LIMITED</strong></p>
    <p><strong>Address:</strong> VN AQUA RAS PRIVATE LIMITED, Near Fish and Chips Restaurant, Shop No 1, 2 Ongole Highway, Penumudi road, Repalle 522265</p>
    <p><strong>Email:</strong> info@daycatch.in</p>
    <p><strong>Phone:</strong> +919492500929</p>
  `);

  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = () => {
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      alert("Terms & Conditions updated successfully!");
      console.log("Updated content:", content);
    }, 1000);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
    ],
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Page Heading */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Here is your admin panel.
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        {/* Card Header */}
        <Box 
          sx={{ 
            p: 3, 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            borderBottom: "1px solid #f1f1f1"
          }}
        >
          <Typography variant="h6" fontWeight="600" color="#1b2559">
            Terms & Conditions
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleUpdate}
            disabled={isUpdating}
            sx={{ 
              backgroundColor: "#2d60ff", 
              "&:hover": { backgroundColor: "#2046cc" },
              borderRadius: "8px",
              textTransform: "none",
              px: 4,
              fontWeight: "600"
            }}
          >
            {isUpdating ? <CircularProgress size={24} color="inherit" /> : "Update Content"}
          </Button>
        </Box>

        {/* Editor Area */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ 
            "& .ql-container": { 
              borderRadius: "0 0 8px 8px",
              minHeight: "400px",
              fontSize: "16px",
              color: "#1b2559"
            },
            "& .ql-toolbar": {
              borderRadius: "8px 8px 0 0",
              backgroundColor: "#f8f9fa"
            }
          }}>
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent} 
              modules={modules}
            />
          </Box>
        </Box>

      </Paper>
    </Box>
  );
};

export default TermsAndConditions;

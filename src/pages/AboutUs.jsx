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

const AboutUs = () => {
  const [content, setContent] = useState(`
    <h2>The Daycatch Story</h2>
    <p>Welcome to Daycatch, where our story is deeply rooted in a profound respect for the ocean and an unwavering commitment to bringing its freshest treasures directly to your home. We’re more than just a seafood provider; we are a bridge between the vibrant marine world and your kitchen, dedicated to delivering an unparalleled culinary experience.</p>
    <p>Our journey began with a simple, yet powerful, realization: that truly exceptional seafood, caught with integrity and delivered with care, was becoming increasingly rare. We saw a gap where quality was often compromised by lengthy supply chains and impersonal transactions. We envisioned a different way – a way to honor the ocean’s bounty, support responsible practices, and connect people directly with the pure, unadulterated taste of the sea. This vision blossomed into Daycatch.</p>
    
    <hr>
    
    <h3>Our Promise: Uncompromising Freshness, Every Single Day</h3>
    <p>At Daycatch, freshness isn’t just a claim; it’s our foundational promise. We believe that the true flavor of seafood shines brightest when it’s caught and delivered with meticulous speed and care. Our process is designed to maximize this freshness:</p>
    
    <p><strong>Direct Sourcing:</strong> We bypass intermediaries, partnering directly with a select network of trusted local fishermen. These are individuals and families who have dedicated their lives to the sea, understanding its rhythms and respecting its limits. This direct relationship ensures we receive the catch at its absolute peak.</p>
    <p><strong>Immediate Care:</strong> From the moment it leaves the water, every piece of seafood is handled with utmost care. It’s immediately packed on ice, meticulously sorted, and swiftly transported to our state-of-the-art facility. This rapid, unbroken cold chain is crucial to preserving the delicate texture and robust flavors you expect.</p>
    <p><strong>Expert Selection:</strong> Before anything leaves our doors, our experienced team conducts rigorous quality checks. We look for the vibrant colors, firm textures, and fresh aromas that are hallmarks of superior seafood. Only the best makes it into a Daycatch box.</p>
    
    <h3>Our Selection: A Taste of the Ocean's Best</h3>
    <p>Dive into the exquisite variety that Daycatch proudly offers. Each item in our selection is chosen not just for its popularity, but for its exceptional quality and flavor profile:</p>
    <ul>
      <li><strong>Vibrant Prawns:</strong> Indulge in our plump, juicy prawns. Their naturally sweet taste and satisfying snap make them ideal for stir-fries, pasta dishes, or simply grilled with a squeeze of lemon. They are a true crowd-pleaser and a testament to the ocean’s generous offerings.</li>
      <li><strong>Rich & Flavorful Crabs:</strong> For those seeking a truly decadent experience, our crabs are a must-try. Bursting with sweet, tender meat, they promise an unforgettable culinary adventure, whether steamed, boiled, or incorporated into your favorite seafood recipes.</li>
      <li><strong>Delicate White Pomfret:</strong> Experience the refined taste of our White Pomfret. Celebrated for its fine texture and distinct, delightful flavor, it’s a prized fish perfect for sophisticated dishes, often enjoyed whole to truly savor its essence.</li>
    </ul>
    
    <h3>Our Commitment: Sustainability & Community</h3>
    <p>Beyond freshness and flavor, Daycatch is deeply committed to the health of our oceans and the well-being of our fishing communities. We believe that responsible sourcing is not just good practice, but a moral imperative.</p>
    <p><strong>Sustainable Practices:</strong> We actively support and engage with fishermen who employ sustainable fishing methods, minimizing environmental impact and protecting marine ecosystems for future generations. We prioritize catches that are in season and from healthy stocks.</p>
    <p><strong>Supporting Local Livelihoods:</strong> By partnering directly with local fishermen, we contribute to the economic vitality of coastal communities. We value their expertise, hard work, and the heritage they represent, fostering relationships built on trust and mutual respect.</p>
    <p><strong>Traceability:</strong> We strive for transparency in our sourcing, so you can feel confident about where your seafood comes from and how it reached your plate.</p>
    
    <p><em>"With every Daycatch purchase, you’re not just enjoying premium seafood; you’re also contributing to a more sustainable future for our oceans and supporting the dedicated hands that bring this incredible bounty to us all."</em></p>
    
    <h3>Experience the Daycatch Difference</h3>
    <p>We invite you to experience the true taste of the ocean, delivered with integrity and passion. At Daycatch, every order is more than just a transaction – it’s an invitation to savor the freshest flavors, explore new culinary horizons, and connect with the story of the sea.</p>
    <p>Thank you for choosing Daycatch. We look forward to being your trusted source for the finest seafood, day after day.</p>
  `);

  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = () => {
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      alert("About Us content updated successfully!");
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
            About Us
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

export default AboutUs;

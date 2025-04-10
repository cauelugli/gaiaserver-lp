import { Box } from "@mui/material";

import Features from "./components/large/Features";
import Footer from "./components/large/Footer";
import Hero from "./components/large/Hero";
import LogoCollection from "./components/large/LogoCollection";
import Navbar from "./components/large/Navbar";
import Pricing from "./components/large/Pricing";
import Testimonials from "./components/large/Testimonials";

function App() {
  return (
    <Box sx={{ textAlign: "center", marginTop: 4 }}>
      <Navbar />
      <Hero />
      <LogoCollection />
      <Features />
      <Testimonials />
      <Pricing />
      <Footer />
    </Box>
  );
}

export default App;

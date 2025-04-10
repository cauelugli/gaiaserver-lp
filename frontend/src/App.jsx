import { Box } from "@mui/material";

import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import LogoCollection from "./components/LogoCollection";
import Navbar from "./components/Navbar";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";

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

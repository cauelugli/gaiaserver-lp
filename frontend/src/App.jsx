import { Box } from "@mui/material";

import Features from "./components/large/Features";
import Footer from "./components/large/Footer";
import Hero from "./components/large/Hero";
import Navbar from "./components/large/Navbar";
import Register from "./components/large/Register";

function App() {
  return (
    <Box sx={{ textAlign: "center", marginTop: -1 }}>
      <Navbar />
      <Hero />
      {/* <LogoCollection /> */}
      <Features />
      {/* <Testimonials /> */}
      {/* <Pricing /> */}
      <Register />
      <Footer />
    </Box>
  );
}

export default App;

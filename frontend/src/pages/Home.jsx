import Navbar from "../components/layout/Navbar";
import Hero from "../components/common/Hero";
import Features from "../components/common/Features";
import HowItWorks from "../components/common/HowItWorks";
import Footer from "../components/layout/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </>
  );
}

export default Home;
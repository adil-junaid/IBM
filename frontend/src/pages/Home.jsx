import MainLayout from "../layouts/MainLayout";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";

const Home = () => {
  return (
    <MainLayout>
      <Hero />
      <Features />
      <HowItWorks />
    </MainLayout>
  );
};

export default Home;
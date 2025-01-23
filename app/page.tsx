import FeaturesSection from "@/app/components/home/FeaturesSection";
import HeroSection from "./components/home/HeroSection";
import ContactUs from "./components/home/ContactUs";
import FeaturedRecipes from "./components/home/FeaturedRecipes";
import Testimonials from "./components/home/Testimonials";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Family Recipe Vault | Home",
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <FeaturedRecipes />
      <Testimonials />
      <ContactUs />
    </>
  );
}

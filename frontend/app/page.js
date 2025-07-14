import ListingSection from "@/components/ListingSection";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import GallerySection from "@/components/GallerySection";


export default async function Home() {


  return (
    <div className="px-4 md:px-0">
      {/* HeroImage Section */}
      <HeroSection />

      {/* Listing Section */}
      <ListingSection />

      {/* Gallery Section */}
      <GallerySection/>

      {/* Features Section */}
      <FeaturesSection/>
    </div>
  );
}

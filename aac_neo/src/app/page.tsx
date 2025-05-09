import HeroSection from "@/shared/components/HeroSection";
import QualityInsightsSection from "@/shared/components/QualityInsightsSection";

export const metadata = {
  description: 'AAC Neo Platform - Quality Insights',
};

export default function Home() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Features Section */}
      <QualityInsightsSection />
    </div>
  );
}

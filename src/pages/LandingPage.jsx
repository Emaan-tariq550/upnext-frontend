import Hero from '../components/landing/Hero';
import HowFameWorksSection from '../components/landing/HowFameWorksSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import BusinessesSection from '../components/landing/BusinessesSection';
import EventsSection from '../components/landing/EventsSection';
import TrendingTickerSection from '../components/landing/TrendingTickerSection';
import AwardsSection from '../components/landing/AwardsSection';
import ScreenshotsSection from '../components/landing/ScreenshotsSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FaqSection from '../components/landing/FaqSection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowFameWorksSection />
      <FeaturesSection />
      <BusinessesSection />
      <EventsSection />
      <TrendingTickerSection />
      <AwardsSection />
      <ScreenshotsSection />
      <TestimonialsSection />
      <FaqSection />
      <Footer />
    </>
  );
}
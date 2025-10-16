import LandingHero from "@/components/LandingHero";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import ThemeToggle from "@/components/ThemeToggle";
import { Leaf } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">NutriAI</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>
      
      <div className="pt-16">
        <LandingHero />
        <HowItWorksSection />
        <FeaturesSection />
        <CTASection />
      </div>
      
      <footer className="py-8 px-4 border-t bg-muted/30">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2025 NutriAI. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

import OnboardingForm from "@/components/OnboardingForm";
import ThemeToggle from "@/components/ThemeToggle";
import { Leaf } from "lucide-react";
import { Link } from "wouter";

export default function Onboarding() {
  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 hover-elevate px-2 py-1 rounded-lg" data-testid="link-home">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">NutriAI</span>
            </a>
          </Link>
          <ThemeToggle />
        </div>
      </nav>
      
      <div className="pt-16">
        <OnboardingForm />
      </div>
    </div>
  );
}

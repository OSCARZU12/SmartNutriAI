import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/Healthy_meal_prep_hero_cbd03f76.png";

export default function LandingHero() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Tu Plan de Nutrición Personalizado con IA
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Obtén un plan de dieta completamente personalizado generado por inteligencia artificial, 
          diseñado específicamente para tus objetivos, preferencias y estilo de vida.
        </p>
        <Link href="/onboarding">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover-elevate active-elevate-2 text-lg px-8 py-6"
            data-testid="button-start-journey"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Comenzar Mi Transformación
          </Button>
        </Link>
      </div>
    </section>
  );
}

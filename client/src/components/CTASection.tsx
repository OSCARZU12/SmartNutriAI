import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function CTASection() {
  return (
    <section className="py-20 px-4 bg-primary">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
          Comienza Tu Viaje Hacia Una Mejor Salud
        </h2>
        <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          Únete a miles de personas que ya han transformado su alimentación y su vida con NutriAI
        </p>
        <Link href="/onboarding">
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6 hover-elevate active-elevate-2"
            data-testid="button-cta-start"
          >
            Crear Mi Plan Gratis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

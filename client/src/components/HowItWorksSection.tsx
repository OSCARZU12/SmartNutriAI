import { Card } from "@/components/ui/card";
import { FileText, Sparkles, Calendar } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Completa Tu Perfil",
    description: "Comparte tus datos personales, objetivos de salud y preferencias alimentarias.",
    step: "1"
  },
  {
    icon: Sparkles,
    title: "IA Genera Tu Plan",
    description: "Nuestra inteligencia artificial crea un plan de nutrición completamente personalizado.",
    step: "2"
  },
  {
    icon: Calendar,
    title: "Sigue Tu Plan",
    description: "Recibe recetas detalladas, listas de compras y seguimiento de progreso.",
    step: "3"
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Cómo Funciona
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          En solo 3 simples pasos, obtén un plan de nutrición diseñado específicamente para ti
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <Card key={step.step} className="p-8 hover-elevate transition-all duration-200" data-testid={`card-step-${step.step}`}>
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">{step.step}</span>
                  </div>
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

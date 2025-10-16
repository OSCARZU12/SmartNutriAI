import { Card } from "@/components/ui/card";
import { Brain, ShoppingCart, TrendingUp, Users, Utensils, Clock } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "IA Personalizada",
    description: "Planes de nutrición generados por inteligencia artificial basados en tus necesidades únicas."
  },
  {
    icon: Utensils,
    title: "Recetas Detalladas",
    description: "Recetas paso a paso con información nutricional completa y macronutrientes."
  },
  {
    icon: ShoppingCart,
    title: "Lista de Compras",
    description: "Lista automática de ingredientes organizados por categoría para facilitar tus compras."
  },
  {
    icon: TrendingUp,
    title: "Seguimiento de Progreso",
    description: "Monitorea tu progreso con gráficas y estadísticas detalladas de tu evolución."
  },
  {
    icon: Users,
    title: "Adaptable a Ti",
    description: "Compatible con dietas veganas, vegetarianas, keto, paleo y restricciones alimentarias."
  },
  {
    icon: Clock,
    title: "Planes Flexibles",
    description: "Elige entre planes semanales o mensuales que se adaptan a tu estilo de vida."
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Características Principales
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Todo lo que necesitas para alcanzar tus objetivos de salud y nutrición
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx} className="p-6 hover-elevate transition-all duration-200" data-testid={`card-feature-${idx}`}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

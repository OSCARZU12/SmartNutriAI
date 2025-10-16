import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const meals = [
  {
    time: "08:00",
    name: "Desayuno Energético",
    description: "Avena con frutas y nueces",
    calories: 450,
    macros: { protein: 15, carbs: 65, fat: 12 }
  },
  {
    time: "13:00",
    name: "Almuerzo Balanceado",
    description: "Pechuga de pollo con quinoa y vegetales",
    calories: 650,
    macros: { protein: 45, carbs: 55, fat: 18 }
  },
  {
    time: "16:00",
    name: "Snack Saludable",
    description: "Yogurt griego con almendras",
    calories: 200,
    macros: { protein: 12, carbs: 18, fat: 8 }
  },
  {
    time: "20:00",
    name: "Cena Ligera",
    description: "Salmón al horno con ensalada verde",
    calories: 550,
    macros: { protein: 40, carbs: 25, fat: 28 }
  }
];

export default function TodaysMeals() {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Comidas de Hoy</h3>
      <div className="space-y-4">
        {meals.map((meal, idx) => (
          <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover-elevate" data-testid={`card-meal-${idx}`}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[60px]">
              <Clock className="h-4 w-4" />
              {meal.time}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">{meal.name}</h4>
              <p className="text-sm text-muted-foreground mb-2">{meal.description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="font-mono text-xs">{meal.calories} cal</Badge>
                <Badge variant="outline" className="font-mono text-xs">P: {meal.macros.protein}g</Badge>
                <Badge variant="outline" className="font-mono text-xs">C: {meal.macros.carbs}g</Badge>
                <Badge variant="outline" className="font-mono text-xs">G: {meal.macros.fat}g</Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon" data-testid={`button-meal-info-${idx}`}>
              <Info className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

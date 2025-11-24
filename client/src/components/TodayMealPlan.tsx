import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";

export default function TodayMealPlan() {
  const [todayMeals, setTodayMeals] = useState<any>(null);
  const [currentDay, setCurrentDay] = useState("");

  useEffect(() => {
    // Obtener el día actual
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const today = new Date();
    const dayName = days[today.getDay()];
    setCurrentDay(dayName);

    // Obtener el plan del localStorage
    const dietPlanStr = localStorage.getItem('user_diet_plan');
    
    if (dietPlanStr) {
      try {
        const dietPlan = JSON.parse(dietPlanStr);
        
        // Si es texto plano de Gemini, extraer las comidas del día actual
        if (typeof dietPlan === 'string') {
          const meals = extractTodayMeals(dietPlan, dayName);
          setTodayMeals(meals);
        } 
        // Si es objeto estructurado
        else if (dietPlan.weekPlan && dietPlan.weekPlan[dayName]) {
          setTodayMeals(dietPlan.weekPlan[dayName]);
        }
        // Si el objeto tiene rawText
        else if (dietPlan.rawText) {
          const meals = extractTodayMeals(dietPlan.rawText, dayName);
          setTodayMeals(meals);
        }
      } catch (error) {
        console.error('Error al parsear el plan:', error);
      }
    }
  }, []);

  // Función para extraer las comidas del día actual del texto de Gemini
  const extractTodayMeals = (planText: string, dayName: string) => {
    // Calcular qué día del plan corresponde a hoy
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = domingo, 1 = lunes, etc.
    
    // Ajustar para que lunes sea día 1
    let dayNumber = dayOfWeek === 0 ? 7 : dayOfWeek;
    
    // Buscar el patrón "Día X" en el texto (más flexible)
    const dayPattern = new RegExp(`Día\\s*${dayNumber}[\\s\\S]*?(?=Día\\s*${dayNumber + 1}|Día\\s*${dayNumber + 2}|Consejos Adicionales|$)`, 'i');
    const match = planText.match(dayPattern);
    
    if (!match) {
      // Intentar con el primer día como fallback
      const firstDayMatch = planText.match(/Día\s*1[\s\S]*?(?=Día\s*2|Consejos Adicionales|$)/i);
      if (firstDayMatch) {
        return extractMealsFromSection(firstDayMatch[0]);
      }
      return null;
    }

    return extractMealsFromSection(match[0]);
  };

  const extractMealsFromSection = (daySection: string) => {
    const meals: any = {};

    // Extraer Desayuno
    const desayunoMatch = daySection.match(/Desayuno\s*\(~?(\d+)\s*kcal\)(.*?)(?=Almuerzo|Cena|Día|$)/is);
    if (desayunoMatch) {
      meals.desayuno = {
        nombre: "Desayuno",
        calorias: parseInt(desayunoMatch[1]),
        descripcion: desayunoMatch[2].trim().substring(0, 500)
      };
    }

    // Extraer Almuerzo (mostrar como "Comida")
    const almuerzoMatch = daySection.match(/Almuerzo\s*\(~?(\d+)\s*kcal\)(.*?)(?=Cena|Día|$)/is);
    if (almuerzoMatch) {
      meals.almuerzo = {
        nombre: "Comida",
        calorias: parseInt(almuerzoMatch[1]),
        descripcion: almuerzoMatch[2].trim().substring(0, 500)
      };
    }

    // Extraer Cena
    const cenaMatch = daySection.match(/Cena\s*\(~?(\d+)\s*kcal\)(.*?)(?=Día|$)/is);
    if (cenaMatch) {
      meals.cena = {
        nombre: "Cena",
        calorias: parseInt(cenaMatch[1]),
        descripcion: cenaMatch[2].trim().substring(0, 500)
      };
    }

    return Object.keys(meals).length > 0 ? meals : null;
  };

  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getMealIcon = (mealType: string) => {
    if (mealType === 'desayuno') return '☕';
    if (mealType === 'almuerzo') return '🍴';
    if (mealType === 'cena') return '🍽';
    return '🍽';
  };

  const getMealTime = (mealType: string) => {
    if (mealType === 'desayuno') return '7:00 - 9:00 AM';
    if (mealType === 'almuerzo') return '1:00 - 3:00 PM';
    if (mealType === 'cena') return '7:00 - 9:00 PM';
    return '';
  };

  if (!todayMeals) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hay plan para hoy</h3>
          <p className="text-sm text-muted-foreground">
            Completa el onboarding para generar tu plan nutricional
          </p>
        </div>
      </Card>
    );
  }

  const totalCalories = Object.values(todayMeals).reduce((sum: number, meal: any) => {
    return sum + (meal.calorias || 0);
  }, 0);

  return (
    <div className="space-y-4">
      {/* Header con fecha */}
      <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold capitalize">{formatDate()}</h2>
            <p className="text-sm text-muted-foreground mt-1">Tu plan de comidas para hoy</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{totalCalories}</div>
            <div className="text-xs text-muted-foreground">kcal totales</div>
          </div>
        </div>
      </Card>

      {/* Comidas del día */}
      {Object.entries(todayMeals).map(([mealType, meal]: [string, any]) => (
        <Card key={mealType} className="p-6 hover-elevate">
          <div className="flex items-start gap-4">
            <div className="text-4xl">{getMealIcon(mealType)}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold capitalize">{meal.nombre || mealType}</h3>
                <Badge variant="secondary" className="font-mono">
                  {meal.calorias} kcal
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Clock className="h-4 w-4" />
                <span>{getMealTime(mealType)}</span>
              </div>

              <div className="text-sm text-muted-foreground leading-relaxed">
                {meal.descripcion ? (
                  <div className="space-y-1">
                    {meal.descripcion.split('\n').map((line: string, idx: number) => {
                      const trimmed = line.trim();
                      if (!trimmed) return null;
                      return (
                        <p key={idx} className="ml-4">
                          {trimmed.startsWith('-') || trimmed.startsWith('•') 
                            ? `• ${trimmed.substring(1).trim()}`
                            : trimmed
                          }
                        </p>
                      );
                    })}
                  </div>
                ) : (
                  <p>No hay detalles disponibles</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { TrendingUp, Calendar, Flame, User } from "lucide-react";

interface DashboardStatsProps {
  userData: any;
  dietPlan: any;
}

export default function DashboardStats({ userData, dietPlan }: DashboardStatsProps) {

  const currentWeight = userData?.weight ? parseFloat(userData.weight).toFixed(1) : 'N/A';

  // Extraer datos reales del plan
  const planData = dietPlan?.plan_nutricional || dietPlan;
  const targetCalories = planData?.total_calorias_diarias_aprox || dietPlan?.targetCalories || 0;
  const planDuration = userData?.duration || 'N/A';

  // Calcular promedio de calorías reales del plan (si difiere del objetivo)
  let avgPlanCalories = 0;
  if (planData?.dias) {
    const total = planData.dias.reduce((acc: number, day: any) => {
      const dayCals = day.comidas.reduce((c: number, m: any) => c + (m.calorias_aprox || 0), 0);
      return acc + dayCals;
    }, 0);
    avgPlanCalories = Math.round(total / planData.dias.length);
  }

  const stats = [
    {
      icon: User, label: "Peso Actual",
      value: `${currentWeight} kg`,
      change: "Objetivo: " + (userData?.goal === 'lose' ? 'Bajar' : userData?.goal === 'gain' ? 'Subir' : 'Mantener'),
      positive: true
    },
    {
      icon: Calendar, label: "Duración Plan",
      value: `${planDuration}`,
      change: "Días planificados",
      positive: true
    },
    {
      icon: Flame, label: "Calorías Promedio",
      value: (avgPlanCalories || targetCalories).toLocaleString(),
      change: "kcal / día",
      positive: true
    },
    {
      icon: TrendingUp, label: "Estado del Plan",
      value: "Activo",
      change: "Generado por IA",
      positive: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <Card key={idx} className="p-6" data-testid={`card-stat-${idx}`}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold font-mono" data-testid={`text-stat-value-${idx}`}>{stat.value}</p>
              </div>
            </div>
            <div
              className={`text-sm font-medium ${stat.positive ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}
              data-testid={`text-stat-change-${idx}`}
            >
              {stat.change}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
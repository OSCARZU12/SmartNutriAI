import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar, Flame, User } from "lucide-react";

// Definición de tipos para las props (si usas TypeScript)
interface UserData { weight: string; goal: string; }
interface DietPlan { targetCalories: number; }
interface DashboardStatsProps { userData: UserData | null; dietPlan: DietPlan | null; }

export default function DashboardStats({ userData, dietPlan }: DashboardStatsProps) {

    const currentWeight = userData?.weight ? parseFloat(userData.weight).toFixed(1) : 'N/A';
    const targetCalories = dietPlan?.targetCalories || 0;

    // Simulación de datos (deberían venir de otro lado o ser calculados)
    const simulatedWeightChange = '-2.5 kg';
    const simulatedDaysActive = '14';
    const consumedCalories = 500;
    const remainingCalories = targetCalories > consumedCalories ? targetCalories - consumedCalories : 0;

    const stats = [
      {
        icon: User, label: "Peso Actual",
        value: `${currentWeight} kg`, // DATO DINÁMICO
        change: simulatedWeightChange,
        positive: true
      },
      {
        icon: Calendar, label: "Días Activos",
        value: simulatedDaysActive,
        change: "+7 días",
        positive: true
      },
      {
        icon: Flame, label: "Calorías Objetivo",
        value: targetCalories.toLocaleString(), // DATO DINÁMICO
        change: `${remainingCalories.toLocaleString()} restantes`,
        positive: remainingCalories > 0
      },
      {
        icon: TrendingUp, label: "Progreso General",
        value: "65%",
        change: "+15%",
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
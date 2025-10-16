import { Card } from "@/components/ui/card";
import { TrendingUp, Target, Calendar, Flame } from "lucide-react";

const stats = [
  { icon: Target, label: "Peso Actual", value: "70 kg", change: "-2.5 kg", positive: true },
  { icon: Calendar, label: "Días Activos", value: "14", change: "+7 días", positive: true },
  { icon: Flame, label: "Calorías Hoy", value: "1,850", change: "150 restantes", positive: false },
  { icon: TrendingUp, label: "Progreso", value: "65%", change: "+15%", positive: true }
];

export default function DashboardStats() {
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
            <div className={`text-sm font-medium ${stat.positive ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
              {stat.change}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

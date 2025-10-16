import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "Proteínas", value: 30, color: "hsl(var(--chart-2))" },
  { name: "Carbohidratos", value: 45, color: "hsl(var(--chart-3))" },
  { name: "Grasas", value: 25, color: "hsl(var(--chart-1))" }
];

export default function MacroChart() {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Distribución de Macronutrientes</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {data.map((item, idx) => (
          <div key={idx} className="text-center">
            <div className="font-mono text-lg font-semibold" data-testid={`text-macro-${idx}`}>{item.value}%</div>
            <div className="text-xs text-muted-foreground">{item.name}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

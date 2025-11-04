// src/components/MacroChart.tsx

import { Card } from "@/components/ui/card";
// 👈 Importaciones clave de Recharts:
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#2563EB', '#FBBF24', '#10B981']; // Azul, Amarillo, Verde

export default function MacroChart({ dietPlan }) {

    // 1. Obtener y formatear los macros objetivo o usar un valor por defecto
    const targetMacros = dietPlan?.targetMacros || { protein: '33%', carbs: '33%', fat: '20%' };

    const data = [
      { name: 'Proteínas', value: parseInt(targetMacros.protein), color: COLORS[0] },
      { name: 'Carbohidratos', value: parseInt(targetMacros.carbs), color: COLORS[1] },
      { name: 'Grasas', value: parseInt(targetMacros.fat), color: COLORS[2] },
    ].filter(item => item.value > 0); // Filtra cualquier valor que sea 0

    return (
        <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Distribución de Macronutrientes</h3>

            {/* 👈 CONTENEDOR DEL GRÁFICO 👈 */}
            <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            labelLine={false}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            wrapperStyle={{ paddingTop: '10px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Display de porcentaje debajo del gráfico (si quieres mantener los números fuera del gráfico) */}
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                {data.map(item => (
                    <div key={item.name}>
                        <p className="font-bold text-lg" style={{ color: item.color }}>{item.value}%</p>
                        <p className="text-xs text-muted-foreground">{item.name}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
}
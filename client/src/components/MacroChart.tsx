import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#3b82f6', '#eab308', '#ef4444']; // Blue-500, Yellow-500, Red-500

interface MacroChartProps {
    dietPlan: any;
}

export default function MacroChart({ dietPlan }: MacroChartProps) {
    // 1. Calcular macros reales sumando todas las comidas del plan
    const calculateRealMacros = () => {
        const planData = dietPlan?.plan_nutricional || dietPlan;

        if (!planData || !planData.dias) {
            // Fallback a objetivos si no hay datos de días, o valores por defecto
            const target = dietPlan?.targetMacros || { protein: '33%', carbs: '33%', fat: '33%' };
            return [
                { name: 'Proteínas', value: parseInt(target.protein) || 33, color: COLORS[0] },
                { name: 'Carbohidratos', value: parseInt(target.carbs) || 33, color: COLORS[1] },
                { name: 'Grasas', value: parseInt(target.fat) || 33, color: COLORS[2] },
            ];
        }

        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;

        planData.dias.forEach((day: any) => {
            day.comidas.forEach((meal: any) => {
                if (meal.macros_aprox) {
                    totalProtein += parseInt(String(meal.macros_aprox.proteina).replace(/\D/g, '') || '0');
                    totalCarbs += parseInt(String(meal.macros_aprox.carbs).replace(/\D/g, '') || '0');
                    totalFat += parseInt(String(meal.macros_aprox.grasas).replace(/\D/g, '') || '0');
                }
            });
        });

        // Evitar división por cero
        const totalGrams = totalProtein + totalCarbs + totalFat;
        if (totalGrams === 0) return [];

        // Calcular calorías aproximadas de cada macro para el porcentaje (4-4-9 kcal/g)
        const calProtein = totalProtein * 4;
        const calCarbs = totalCarbs * 4;
        const calFat = totalFat * 9;
        const totalCal = calProtein + calCarbs + calFat;

        return [
            { name: 'Proteínas', value: Math.round((calProtein / totalCal) * 100), grams: Math.round(totalProtein / planData.dias.length), color: COLORS[0] },
            { name: 'Carbohidratos', value: Math.round((calCarbs / totalCal) * 100), grams: Math.round(totalCarbs / planData.dias.length), color: COLORS[1] },
            { name: 'Grasas', value: Math.round((calFat / totalCal) * 100), grams: Math.round(totalFat / planData.dias.length), color: COLORS[2] },
        ];
    };

    const data = calculateRealMacros();

    return (
        <Card className="p-6 flex flex-col h-full">
            <h3 className="text-xl font-semibold mb-2">Distribución de Macros</h3>
            <p className="text-sm text-muted-foreground mb-6">Promedio diario basado en tu plan</p>

            <div className="flex-1 min-h-[200px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={4}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number, name: string, props: any) => [`${value}% (${props.payload.grams}g/día)`, name]}
                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Texto central (opcional, visualmente atractivo) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                    <div className="text-center">
                        <span className="text-3xl font-bold text-primary">100%</span>
                        <p className="text-xs text-muted-foreground">Calorías</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 text-center border-t pt-4">
                {data.map((item) => (
                    <div key={item.name} className="flex flex-col items-center">
                        <span className="text-2xl font-bold" style={{ color: item.color }}>{item.value}%</span>
                        <span className="text-xs text-muted-foreground font-medium">{item.name}</span>
                        <span className="text-xs text-gray-400">~{item.grams}g</span>
                    </div>
                ))}
            </div>
        </Card>
    );
}
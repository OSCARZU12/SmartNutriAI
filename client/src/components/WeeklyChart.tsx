import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WeeklyChartProps {
    dietPlan: any;
}

export default function WeeklyChart({ dietPlan }: WeeklyChartProps) {
    // 1. Preparar datos
    const planData = dietPlan?.plan_nutricional || dietPlan;

    if (!planData || !planData.dias) {
        return (
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Análisis Semanal</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No hay datos suficientes para mostrar la gráfica.
                </CardContent>
            </Card>
        );
    }

    // 2. Transformar datos para Recharts
    const data = planData.dias.map((day: any) => {
        // Calcular totales por día
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;

        day.comidas.forEach((meal: any) => {
            totalCalories += meal.calorias_aprox || 0;

            // Parsear macros (ej: "30g" -> 30)
            const parseMacro = (val: string) => parseInt(val?.replace(/\D/g, '') || '0');

            if (meal.macros_aprox) {
                totalProtein += parseMacro(meal.macros_aprox.proteina);
                totalCarbs += parseMacro(meal.macros_aprox.carbs);
                totalFat += parseMacro(meal.macros_aprox.grasas);
            }
        });

        return {
            name: `Día ${day.dia}`,
            calorias: totalCalories,
            proteina: totalProtein,
            carbs: totalCarbs,
            grasas: totalFat
        };
    });

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Gráfico de Calorías */}
            <Card>
                <CardHeader>
                    <CardTitle>Calorías Diarias</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="calorias" fill="#10B981" radius={[4, 4, 0, 0]} name="Calorías (kcal)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Gráfico de Macros Apilados */}
            <Card>
                <CardHeader>
                    <CardTitle>Distribución de Macros (g)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Legend />
                                <Bar dataKey="proteina" stackId="a" fill="#2563EB" name="Proteína" />
                                <Bar dataKey="carbs" stackId="a" fill="#FBBF24" name="Carbs" />
                                <Bar dataKey="grasas" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} name="Grasas" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

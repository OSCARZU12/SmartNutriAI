import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Download, Copy, Check, Calendar, Utensils, Info, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

// --- Interfaces del Nuevo Esquema JSON ---

interface Macros {
  proteina: string;
  carbs: string;
  grasas: string;
}

interface Meal {
  tipo: string;
  nombre_plato: string;
  descripcion: string;
  ingredientes: string[];
  calorias_aprox: number;
  macros_aprox: Macros;
}

interface DayPlan {
  dia: number;
  titulo: string;
  comidas: Meal[];
}

interface NutritionalPlanData {
  resumen_objetivo: string;
  total_calorias_diarias_aprox: number;
  dias: DayPlan[];
  recomendaciones_generales: string[];
  lista_compras_sugerida: string[];
}

interface GeminiPlanViewProps {
  plan: { plan_nutricional: NutritionalPlanData } | NutritionalPlanData; // Soporta con o sin wrapper
  userData?: any;
}

export default function GeminiPlanView({ plan, userData }: GeminiPlanViewProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Normalizar la estructura del plan (por si viene con o sin el wrapper "plan_nutricional")
  const planData: NutritionalPlanData = plan && 'plan_nutricional' in plan
    ? (plan as any).plan_nutricional
    : plan;

  if (!planData || !planData.dias) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Info className="mx-auto h-10 w-10 mb-4 opacity-50" />
        <p>No hay datos de plan nutricional válidos para mostrar.</p>
        <div className="text-xs mt-2 opacity-50 font-mono text-left bg-muted p-2 rounded overflow-auto max-h-32">
          DEBUG: {JSON.stringify(plan, null, 2)}
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    const textToCopy = JSON.stringify(planData, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast({
      title: "JSON Copiado",
      description: "La estructura del plan se ha copiado al portapapeles.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = 20;

      // Header
      pdf.setFillColor(34, 139, 34); // Verde
      pdf.rect(0, 0, pageWidth, 40, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.text("PLAN NUTRICIONAL", pageWidth / 2, 20, { align: 'center' });
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text("Personalizado con IA", pageWidth / 2, 30, { align: 'center' });

      yPosition = 50;
      pdf.setTextColor(0, 0, 0);

      // Resumen
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Objetivo:", margin, yPosition);
      pdf.setFont("helvetica", "normal");
      pdf.text(planData.resumen_objetivo || "N/A", margin + 30, yPosition);
      yPosition += 10;

      pdf.setFont("helvetica", "bold");
      pdf.text("Calorías Diarias:", margin, yPosition);
      pdf.setFont("helvetica", "normal");
      pdf.text(`${planData.total_calorias_diarias_aprox} kcal`, margin + 45, yPosition);
      yPosition += 15;

      // Iterar días
      planData.dias.forEach((dia) => {
        if (yPosition > 250) { pdf.addPage(); yPosition = 20; }

        pdf.setFillColor(240, 240, 240);
        pdf.rect(margin, yPosition, pageWidth - (margin * 2), 10, 'F');
        pdf.setFont("helvetica", "bold");
        pdf.text(dia.titulo, margin + 5, yPosition + 7);
        yPosition += 15;

        dia.comidas.forEach((comida) => {
          if (yPosition > 270) { pdf.addPage(); yPosition = 20; }
          pdf.setFont("helvetica", "bold");
          pdf.text(`${comida.tipo}: ${comida.nombre_plato}`, margin + 5, yPosition);
          yPosition += 6;

          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(10);
          const descLines = pdf.splitTextToSize(comida.descripcion, pageWidth - (margin * 2) - 10);
          pdf.text(descLines, margin + 10, yPosition);
          yPosition += (descLines.length * 5) + 5;
        });
        yPosition += 5;
      });

      pdf.save('plan-nutricional.pdf');
      toast({ title: "Plan descargado", description: "Tu PDF está listo" });
    } catch (error) {
      console.error('Error PDF:', error);
      toast({ title: "Error", description: "No se pudo generar el PDF", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 border-primary/10 shadow-lg">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Tu Plan Nutricional</h2>
              <p className="text-sm text-muted-foreground">{planData.resumen_objetivo}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="bg-secondary/20 px-3 py-1 rounded-md text-sm font-medium text-secondary-foreground flex items-center">
              🔥 {planData.total_calorias_diarias_aprox} kcal/día
            </div>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              JSON
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        <Tabs defaultValue={`day-${planData.dias[0]?.dia}`} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto mb-6 h-auto p-1 flex-wrap bg-muted/50">
            {planData.dias.map((day) => (
              <TabsTrigger
                key={day.dia}
                value={`day-${day.dia}`}
                className="min-w-[100px] data-[state=active]:bg-green-500/15 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-400 data-[state=active]:backdrop-blur-md data-[state=active]:border data-[state=active]:border-green-500/20 data-[state=active]:shadow-sm transition-all"
              >
                Día {day.dia}
              </TabsTrigger>
            ))}
            <TabsTrigger value="recommendations" className="min-w-[100px]">
              Recomendaciones
            </TabsTrigger>
          </TabsList>

          {planData.dias.map((day) => (
            <TabsContent key={day.dia} value={`day-${day.dia}`} className="space-y-4 animate-in fade-in-50">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-bold">{day.titulo}</h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {day.comidas.map((meal, idx) => (
                  <Card key={idx} className="overflow-hidden hover:shadow-md transition-shadow border-muted">
                    <CardHeader className="bg-muted/30 pb-3 pt-4">
                      <CardTitle className="text-base font-bold flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Utensils className="h-4 w-4 text-primary" />
                          {meal.tipo}
                        </span>
                        <span className="text-xs font-normal bg-background px-2 py-1 rounded-full border">
                          {meal.calorias_aprox} kcal
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 text-sm space-y-3">
                      <div>
                        <p className="font-semibold text-foreground mb-1">{meal.nombre_plato}</p>
                        <p className="text-muted-foreground leading-relaxed text-xs">{meal.descripcion}</p>
                      </div>

                      <div className="bg-muted/20 p-2 rounded text-xs space-y-1">
                        <p><span className="font-medium">Ingredientes:</span> {meal.ingredientes.join(", ")}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-1 text-center text-xs pt-2 border-t">
                        <div>
                          <span className="block font-bold text-primary">{meal.macros_aprox.proteina}</span>
                          <span className="text-[10px] text-muted-foreground">Prot</span>
                        </div>
                        <div>
                          <span className="block font-bold text-primary">{meal.macros_aprox.carbs}</span>
                          <span className="text-[10px] text-muted-foreground">Carbs</span>
                        </div>
                        <div>
                          <span className="block font-bold text-primary">{meal.macros_aprox.grasas}</span>
                          <span className="text-[10px] text-muted-foreground">Grasas</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}

          <TabsContent value="recommendations" className="space-y-6 animate-in fade-in-50">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  Recomendaciones Generales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {planData.recomendaciones_generales.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      <span>
                        {rec.split(/(\*\*.*?\*\*)/).map((part, index) =>
                          part.startsWith('**') && part.endsWith('**') ? (
                            <strong key={index} className="font-semibold text-foreground">
                              {part.slice(2, -2)}
                            </strong>
                          ) : (
                            part
                          )
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

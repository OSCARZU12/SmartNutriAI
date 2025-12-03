import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Download, Copy, Check, Calendar, Utensils } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface GeminiPlanViewProps {
  planText: string;
  userData?: any;
}

interface Meal {
  title: string;
  content: string[];
}

interface DayPlan {
  id: string;
  title: string;
  meals: Meal[];
}

export default function GeminiPlanView({ planText, userData }: GeminiPlanViewProps) {
  const [copied, setCopied] = useState(false);
  const [parsedPlan, setParsedPlan] = useState<DayPlan[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (planText) {
      setParsedPlan(parsePlanText(planText));
    }
  }, [planText]);

  const parsePlanText = (text: string): DayPlan[] => {
    const days: DayPlan[] = [];
    const lines = text.split('\n');
    let currentDay: DayPlan | null = null;
    let currentMeal: Meal | null = null;
    let capturingRecommendations = false;
    const recommendationsLines: string[] = [];

    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      // 1. Detectar inicio de Recomendaciones (o Consejos, Tips, Notas)
      if (trimmedLine.match(/(Recomendaciones|Consejos|Tips|Notas)/i) && !capturingRecommendations) {
        capturingRecommendations = true;
        // Cerrar comida actual si existe
        if (currentMeal && currentDay) {
          currentDay.meals.push(currentMeal);
          currentMeal = null;
        }
        return; // No agregar la línea del título "Recomendaciones" al contenido
      }

      // 2. Si estamos en modo recomendaciones, guardar todo aquí
      if (capturingRecommendations) {
        recommendationsLines.push(line);
        return;
      }

      // 3. Detectar Día
      if (trimmedLine.match(/^Día \d+/i)) {
        if (currentMeal && currentDay) {
          currentDay.meals.push(currentMeal);
          currentMeal = null;
        }
        if (currentDay) {
          days.push(currentDay);
        }
        currentDay = {
          id: `day-${days.length + 1}`,
          title: trimmedLine,
          meals: []
        };
      }
      // 4. Detectar Comida
      else if (trimmedLine.match(/^\s*(Desayuno|Almuerzo|Comida|Cena|Snack|Merienda)/i)) {
        if (currentMeal && currentDay) {
          currentDay.meals.push(currentMeal);
        }
        currentMeal = {
          title: trimmedLine,
          content: []
        };
      }
      // 5. Contenido de la comida
      else if (currentMeal) {
        currentMeal.content.push(trimmedLine);
      }
    });

    // Push del último día y comida (si no se cerraron antes)
    if (currentMeal && currentDay) {
      currentDay.meals.push(currentMeal);
    }
    if (currentDay) {
      days.push(currentDay);
    }

    // Agregar tab de recomendaciones si existen
    if (recommendationsLines.length > 0) {
      days.push({
        id: 'recommendations',
        title: 'Recomendaciones',
        meals: [{
          title: 'Tips y Consejos Clave',
          content: recommendationsLines
        }]
      });
    }

    return days;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(planText);
    setCopied(true);
    toast({
      title: "Plan copiado",
      description: "El plan completo ha sido copiado al portapapeles",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - (margin * 2);
      let yPosition = 20;

      // Colores
      const primaryColor = [34, 139, 34]; // Verde
      const secondaryColor = [70, 130, 180]; // Azul
      const grayColor = [100, 100, 100];
      const lightGray = [240, 240, 240];

      // Función para verificar espacio y agregar página
      const checkPageBreak = (spaceNeeded: number = 20) => {
        if (yPosition + spaceNeeded > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
          return true;
        }
        return false;
      };

      // Header con fondo de color
      pdf.setFillColor(...primaryColor);
      pdf.rect(0, 0, pageWidth, 40, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.text("PLAN NUTRICIONAL", pageWidth / 2, 20, { align: 'center' });
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text("Personalizado con IA", pageWidth / 2, 30, { align: 'center' });

      yPosition = 50;

      // Información del usuario en tarjeta
      if (userData) {
        checkPageBreak(80);

        // Fondo de la tarjeta
        pdf.setFillColor(...lightGray);
        pdf.roundedRect(margin, yPosition, maxWidth, 70, 3, 3, 'F');

        yPosition += 8;
        pdf.setTextColor(...primaryColor);
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("DATOS PERSONALES", margin + 5, yPosition);

        yPosition += 8;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");

        // Columna izquierda
        const col1X = margin + 5;
        const col2X = pageWidth / 2 + 5;
        let tempY = yPosition;

        pdf.text(`Edad: ${userData.age} años`, col1X, tempY);
        pdf.text(`Peso: ${userData.weight} kg`, col2X, tempY);
        tempY += 6;

        pdf.text(`Género: ${userData.gender === 'male' ? 'Masculino' : userData.gender === 'female' ? 'Femenino' : 'Otro'}`, col1X, tempY);
        pdf.text(`Altura: ${userData.height} cm`, col2X, tempY);
        tempY += 6;

        pdf.text(`Actividad: ${userData.activityLevel}`, col1X, tempY);
        pdf.text(`Objetivo: ${userData.goal}`, col2X, tempY);
        tempY += 6;

        pdf.text(`Dieta: ${userData.dietType}`, col1X, tempY);
        pdf.text(`Duración: ${userData.duration}`, col2X, tempY);
        tempY += 6;

        if (userData.allergies && userData.allergies.length > 0) {
          pdf.setTextColor(220, 53, 69);
          pdf.text(`Restricciones: ${userData.allergies.join(', ')}`, col1X, tempY);
        }

        yPosition = tempY + 10;
      }

      // Separador
      yPosition += 5;
      pdf.setDrawColor(...primaryColor);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      // Plan nutricional
      pdf.setTextColor(...secondaryColor);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("TU PLAN NUTRICIONAL", margin, yPosition);
      yPosition += 10;

      pdf.setTextColor(0, 0, 0);
      const planLines = planText.split('\n');

      planLines.forEach((line) => {
        if (line.trim()) {
          checkPageBreak();

          // Días de la semana
          if (line.match(/^Día \d+/i)) {
            yPosition += 5;
            checkPageBreak(15);
            pdf.setFillColor(...primaryColor);
            pdf.roundedRect(margin, yPosition - 5, maxWidth, 10, 2, 2, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(12);
            pdf.setFont("helvetica", "bold");
            pdf.text(line, margin + 5, yPosition);
            yPosition += 8;
            pdf.setTextColor(0, 0, 0);
          }
          // Comidas (Desayuno, Almuerzo, Comida, Cena, Snack, Merienda)
          else if (line.match(/^\s*(Desayuno|Almuerzo|Comida|Cena|Snack|Merienda)/i)) {
            yPosition += 3;
            pdf.setTextColor(...secondaryColor);
            pdf.setFontSize(11);
            pdf.setFont("helvetica", "bold");
            pdf.text(line.trim(), margin + 3, yPosition);
            yPosition += 6;
            pdf.setTextColor(0, 0, 0);
          }
          // Items con viñetas
          else if (line.match(/^\s+[-•]/)) {
            pdf.setFontSize(9);
            pdf.setFont("helvetica", "normal");
            const cleanLine = line.trim().replace(/^[-•]\s*/, '');
            const lines = pdf.splitTextToSize(`• ${cleanLine}`, maxWidth - 10);
            lines.forEach((l: string) => {
              checkPageBreak();
              pdf.text(l, margin + 8, yPosition);
              yPosition += 4;
            });
          }
          // Consejos numerados
          else if (line.match(/^\d+\.\s+/)) {
            yPosition += 2;
            pdf.setTextColor(...grayColor);
            pdf.setFontSize(10);
            pdf.setFont("helvetica", "bold");
            const lines = pdf.splitTextToSize(line.trim(), maxWidth - 5);
            lines.forEach((l: string) => {
              checkPageBreak();
              pdf.text(l, margin + 3, yPosition);
              yPosition += 5;
            });
            pdf.setTextColor(0, 0, 0);
          }
          // Texto normal
          else {
            pdf.setFontSize(9);
            pdf.setFont("helvetica", "normal");
            const lines = pdf.splitTextToSize(line.trim(), maxWidth - 5);
            lines.forEach((l: string) => {
              checkPageBreak();
              pdf.text(l, margin + 3, yPosition);
              yPosition += 4.5;
            });
          }
        }
      });

      // Footer en todas las páginas
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(...grayColor);
        pdf.setFont("helvetica", "italic");
        pdf.text(`SmartNutriAI - Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        pdf.text(`Generado el ${new Date().toLocaleDateString('es-ES')}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      }

      // Guardar PDF
      pdf.save('plan-nutricional-smartnutriai.pdf');

      toast({
        title: "Plan descargado",
        description: "Tu PDF personalizado está listo",
      });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el PDF",
        variant: "destructive",
      });
    }
  };

  // Fallback: Formatear el texto para mejor visualización (si el parsing falla o es vista simple)
  const formatPlanFallback = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.includes('---') || line.match(/^[A-Z\u00C0-\u017F\s]+:$/)) {
        return <div key={index} className="border-b-2 border-primary/20 pb-2 mb-4" />;
      }
      if (line.match(/^Día \d+/i)) {
        return <h3 key={index} className="text-xl font-bold text-primary mt-6 mb-3 flex items-center gap-2">📅 {line}</h3>;
      }
      if (line.match(/^\s*(Desayuno|Almuerzo|Comida|Cena|Snack|Merienda)/i)) {
        return <h4 key={index} className="text-lg font-semibold text-foreground mt-4 mb-2 ml-4">{line.trim()}</h4>;
      }
      if (line.match(/^\s+[-•]\s/) || line.match(/^\s+\d+\./)) {
        return <p key={index} className="text-muted-foreground ml-8 mb-1">{line.trim()}</p>;
      }
      if (line.match(/^\d+\.\s+/)) {
        return <p key={index} className="text-foreground font-medium mt-3 mb-2">{line.trim()}</p>;
      }
      if (line.trim()) {
        return <p key={index} className="text-muted-foreground mb-2 leading-relaxed">{line}</p>;
      }
      return <br key={index} />;
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Tu Plan Nutricional Personalizado</h2>
              <p className="text-sm text-muted-foreground">Generado por IA con Gemini</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copiado" : "Copiar"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </Button>
          </div>
        </div>

        {parsedPlan.length > 0 ? (
          <Tabs defaultValue={parsedPlan[0]?.id} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto mb-6 h-auto p-1 flex-wrap">
              {parsedPlan.map((day) => (
                <TabsTrigger key={day.id} value={day.id} className="min-w-[80px]">
                  {day.title.replace(':', '')}
                </TabsTrigger>
              ))}
            </TabsList>

            {parsedPlan.map((day) => (
              <TabsContent key={day.id} value={day.id} className="space-y-4 animate-in fade-in-50">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">{day.title}</h3>
                </div>

                <div className={`grid gap-4 ${day.id === 'recommendations' ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
                  {day.meals.map((meal, idx) => (
                    <Card key={idx} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="bg-muted/30 pb-3">
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                          <Utensils className="h-4 w-4 text-muted-foreground" />
                          {meal.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4 text-sm space-y-2">
                        {meal.content.map((line, i) => (
                          <p key={i} className="text-muted-foreground leading-relaxed">
                            {line}
                          </p>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {formatPlanFallback(planText)}
          </div>
        )}
      </Card>
    </div>
  );
}

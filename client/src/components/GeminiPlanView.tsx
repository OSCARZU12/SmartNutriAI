import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Download, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface GeminiPlanViewProps {
  planText: string;
  userData?: any;
}

export default function GeminiPlanView({ planText, userData }: GeminiPlanViewProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(planText);
    setCopied(true);
    toast({
      title: "Plan copiado",
      description: "El plan ha sido copiado al portapapeles",
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
          if (line.match(/^Día \d+$/)) {
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
          // Comidas (Desayuno, Almuerzo, Cena)
          else if (line.match(/^\s+(Desayuno|Almuerzo|Cena)/)) {
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

  // Formatear el texto para mejor visualización
  const formatPlan = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Títulos principales (con emojis o ----)
      if (line.includes('---') || line.match(/^[A-Z\u00C0-\u017F\s]+:$/)) {
        return <div key={index} className="border-b-2 border-primary/20 pb-2 mb-4" />;
      }

      // Días de la semana
      if (line.match(/^Día \d+$/)) {
        return (
          <h3 key={index} className="text-xl font-bold text-primary mt-6 mb-3 flex items-center gap-2">
            📅 {line}
          </h3>
        );
      }

      // Comidas (Desayuno, Almuerzo, Cena)
      if (line.match(/^\s+(Desayuno|Almuerzo|Cena)/)) {
        return (
          <h4 key={index} className="text-lg font-semibold text-foreground mt-4 mb-2 ml-4">
            {line.trim()}
          </h4>
        );
      }

      // Items de comida (con guiones o números)
      if (line.match(/^\s+[-•]\s/) || line.match(/^\s+\d+\./)) {
        return (
          <p key={index} className="text-muted-foreground ml-8 mb-1">
            {line.trim()}
          </p>
        );
      }

      // Consejos numerados
      if (line.match(/^\d+\.\s+/)) {
        return (
          <p key={index} className="text-foreground font-medium mt-3 mb-2">
            {line.trim()}
          </p>
        );
      }

      // Texto normal
      if (line.trim()) {
        return (
          <p key={index} className="text-muted-foreground mb-2 leading-relaxed">
            {line}
          </p>
        );
      }

      return <br key={index} />;
    });
  };

  return (
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

      <div className="prose prose-sm max-w-none dark:prose-invert">
        {formatPlan(planText)}
      </div>
    </Card>
  );
}

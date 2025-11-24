import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Download, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface GeminiPlanViewProps {
  planText: string;
}

export default function GeminiPlanView({ planText }: GeminiPlanViewProps) {
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
    const blob = new Blob([planText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mi-plan-nutricional.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Plan descargado",
      description: "El archivo se ha descargado correctamente",
    });
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

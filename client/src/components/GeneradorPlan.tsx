import { useState } from "react";
import { useGenerarPlan } from "@/hooks/useGenerarPlan";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function GeneradorPlan() {
  const { mutate, isPending, data } = useGenerarPlan();
  const { toast } = useToast();

  const handleGenerar = () => {
    mutate(
      {
        edad: 25,
        peso: 70,
        altura: 175,
        objetivo: "perder peso",
        restricciones: ["vegetariano"],
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Plan generado",
            description: "Tu plan ha sido creado exitosamente",
          });
          console.log("Plan recibido:", data);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleGenerar} disabled={isPending}>
        {isPending ? "Generando..." : "Generar Plan"}
      </Button>

      {data && (
        <div className="p-4 border rounded">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

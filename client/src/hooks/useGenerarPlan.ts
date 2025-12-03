import { useMutation } from "@tanstack/react-query";

interface DatosUsuario {
  edad?: number;
  peso?: number;
  altura?: number;
  objetivo?: string;
  restricciones?: string[];
  // Agrega los campos que tu backend espera
}

interface RespuestaPlan {
  plan?: any;
  mensaje?: string;
  // Ajusta según lo que devuelve tu backend
}

async function generarPlan(datos: DatosUsuario): Promise<RespuestaPlan> {
  const response = await fetch("/api/plan/generar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    throw new Error("Error al generar el plan");
  }

  return response.json();
}

export function useGenerarPlan() {
  return useMutation({
    mutationFn: generarPlan,
  });
}

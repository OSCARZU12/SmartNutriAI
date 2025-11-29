import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@supabase/supabase-js";

// Configurar cliente de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export function GeneradorPlan() {
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [planGenerado, setPlanGenerado] = useState<string | null>(null);

  // 1. Estado para los inputs del formulario
  const [formData, setFormData] = useState({
    edad: "",
    peso: "",
    altura: "",
    genero: "masculino",
    actividad: "moderada",
    objetivo: "mejorar_salud",
    tipo_dieta: "omnivora",
    restricciones: ""
  });

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 2. Función principal: Guardar Perfil -> Generar Plan
  const handleGuardarYGenerar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPlanGenerado(null);

    try {
      // A. Obtener el token de usuario
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: "Error", description: "No estás autenticado", variant: "destructive" });
        return;
      }
      const token = session.access_token;
      const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

      // B. Preparar datos del perfil según la API
      const profileData = {
        edad: Number(formData.edad),
        genero: formData.genero,
        peso: Number(formData.peso),
        altura: Number(formData.altura),
        actividad: formData.actividad,
        objetivo: formData.objetivo,
        tipo_dieta: formData.tipo_dieta,
        alergias: [],
        restricciones: formData.restricciones
      };

      // --- PASO 1: GUARDAR PERFIL (POST /api/profile) ---
      console.log("Guardando perfil...");
      const resProfile = await fetch(`${API_URL}/api/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const dataProfile = await resProfile.json();
      
      if (!dataProfile.success) {
        throw new Error(dataProfile.error || "Error al guardar perfil");
      }

      // --- PASO 2: GENERAR PLAN (POST /api/plan/generar) ---
      console.log("Generando plan con IA...");
      const resPlan = await fetch(`${API_URL}/api/plan/generar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          duracion: "1 semana",
          prompt_adicional: formData.restricciones
        })
      });

      const dataPlan = await resPlan.json();

      if (!dataPlan.success) {
        throw new Error(dataPlan.error || "Error al generar plan");
      }

      // ¡ÉXITO!
      setPlanGenerado(dataPlan.plan.contenido);
      toast({
        title: "¡Éxito!",
        description: "Tu plan nutricional ha sido creado y guardado.",
      });

    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto p-4">
      
      {/* --- FORMULARIO --- */}
      <form onSubmit={handleGuardarYGenerar} className="space-y-4 border p-4 rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-bold mb-4">Generar Nuevo Plan</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Edad</label>
            <input name="edad" type="number" required className="border p-2 rounded w-full" 
              value={formData.edad} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium">Peso (kg)</label>
            <input name="peso" type="number" required className="border p-2 rounded w-full" 
              value={formData.peso} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium">Altura (cm)</label>
            <input name="altura" type="number" required className="border p-2 rounded w-full" 
              value={formData.altura} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium">Género</label>
            <select name="genero" className="border p-2 rounded w-full" value={formData.genero} onChange={handleChange}>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium">Nivel de Actividad</label>
           <select name="actividad" className="border p-2 rounded w-full" value={formData.actividad} onChange={handleChange}>
              <option value="sedentaria">Sedentario</option>
              <option value="ligera">Ligero</option>
              <option value="moderada">Moderado</option>
              <option value="intensa">Activo</option>
              <option value="muy_intensa">Muy Activo</option>
           </select>
        </div>

        <div>
           <label className="block text-sm font-medium">Objetivo</label>
           <select name="objetivo" className="border p-2 rounded w-full" value={formData.objetivo} onChange={handleChange}>
              <option value="perder_peso">Perder peso</option>
              <option value="mantener_peso">Mantener peso</option>
              <option value="ganar_masa_muscular">Ganar músculo</option>
              <option value="mejorar_salud">Mejorar salud</option>
           </select>
        </div>

        <div>
           <label className="block text-sm font-medium">Restricciones / Notas</label>
           <input name="restricciones" type="text" placeholder="Ej: No como pescado, soy vegetariano..." 
             className="border p-2 rounded w-full" 
             value={formData.restricciones} onChange={handleChange} />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Procesando con IA..." : "Guardar Perfil y Generar Plan"}
        </Button>
      </form>

      {/* --- RESULTADO --- */}
      {planGenerado && (
        <div className="mt-8 p-6 border rounded-lg bg-gray-50 shadow">
          <h3 className="text-lg font-bold mb-2">Tu Plan Nutricional:</h3>
          <div className="whitespace-pre-wrap font-mono text-sm">
            {planGenerado}
          </div>
        </div>
      )}
    </div>
  );
}
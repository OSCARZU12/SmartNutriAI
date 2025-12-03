import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { User, Save, RefreshCw, Download, Trash2, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { API_BASE_URL } from "@/lib/config";

export default function ProfileSettings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    targetWeight: "",
    activityLevel: "",
    goal: "",
    dietType: "",
    allergies: [] as string[],
    mealsPerDay: "3",
    exerciseDays: "3",
    exerciseType: "",
    motivation: "",
    duration: ""
  });

  useEffect(() => {
    const profileData = localStorage.getItem('user_profile');
    if (profileData) {
      const data = JSON.parse(profileData);
      setFormData({
        name: data.name || "",
        age: data.age || "",
        gender: data.gender || "",
        weight: data.weight || "",
        height: data.height || "",
        targetWeight: data.targetWeight || "",
        activityLevel: data.activityLevel || "",
        goal: data.goal || "",
        dietType: data.dietType || "",
        allergies: data.allergies || [],
        mealsPerDay: data.mealsPerDay || "3",
        exerciseDays: data.exerciseDays || "3",
        exerciseType: data.exerciseType || "",
        motivation: data.motivation || "",
        duration: data.duration || ""
      });
    }
  }, []);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAllergy = (allergy: string) => {
    const current = formData.allergies;
    if (current.includes(allergy)) {
      updateField("allergies", current.filter(a => a !== allergy));
    } else {
      updateField("allergies", [...current, allergy]);
    }
  };

  const calculateIMC = () => {
    if (!formData.weight || !formData.height) return null;
    const heightInMeters = parseFloat(formData.height) / 100;
    const imc = parseFloat(formData.weight) / (heightInMeters * heightInMeters);
    return imc.toFixed(1);
  };

  const handleSave = () => {
    const profileData = {
      ...formData,
      completedOnboarding: true,
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem('user_profile', JSON.stringify(profileData));

    toast({
      title: "Perfil actualizado",
      description: "Tus cambios han sido guardados correctamente",
    });
  };

  const handleRegeneratePlan = async () => {
    toast({
      title: "Regenerando plan...",
      description: "Esto puede tardar unos segundos",
    });

    try {
      const userData = {
        edad: parseInt(formData.age),
        genero: formData.gender === 'male' ? 'Masculino' : formData.gender === 'female' ? 'Femenino' : 'Otro',
        peso: parseFloat(formData.weight),
        altura: parseFloat(formData.height),
        actividad: formData.activityLevel,
        objetivo: formData.goal,
        tipo_dieta: formData.dietType,
        alergias: formData.allergies,
        restricciones: "",
        duracion: formData.duration
      };

      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/plan/generar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Error al generar el plan');
      }

      const result = await response.json();
      localStorage.setItem('user_diet_plan', JSON.stringify(result.plan));

      toast({
        title: "Plan regenerado",
        description: "Tu nuevo plan nutricional está listo",
      });

      setTimeout(() => setLocation('/dashboard'), 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo regenerar el plan. Verifica que el backend esté corriendo.",
        variant: "destructive",
      });
    }
  };

  const handleExportData = () => {
    const allData = {
      profile: formData,
      weightHistory: JSON.parse(localStorage.getItem('weight_history') || '[]'),
      dietPlan: JSON.parse(localStorage.getItem('user_diet_plan') || '{}'),
      achievements: JSON.parse(localStorage.getItem('achievements') || '[]'),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mis-datos-smartnutriai.json';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Datos exportados",
      description: "Tus datos han sido descargados correctamente",
    });
  };

  const handleDeleteAccount = () => {
    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      localStorage.clear();
      toast({
        title: "Cuenta eliminada",
        description: "Tus datos han sido eliminados",
      });
      setTimeout(() => setLocation('/'), 1000);
    }
  };

  const imc = calculateIMC();

  return (
    <div className="space-y-6">
      {/* Información Personal */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Información Personal</h3>
            <p className="text-sm text-muted-foreground">Datos básicos de tu perfil</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nombre Completo</Label>
            <Input
              id="name"
              placeholder="Juan Pérez"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="age">Edad</Label>
            <Input
              id="age"
              type="number"
              placeholder="25"
              value={formData.age}
              onChange={(e) => updateField("age", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="gender">Género</Label>
            <Select value={formData.gender} onValueChange={(v) => updateField("gender", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Masculino</SelectItem>
                <SelectItem value="female">Femenino</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Datos Físicos */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Datos Físicos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="weight">Peso Actual (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="70"
              value={formData.weight}
              onChange={(e) => updateField("weight", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="height">Altura (cm)</Label>
            <Input
              id="height"
              type="number"
              placeholder="170"
              value={formData.height}
              onChange={(e) => updateField("height", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="targetWeight">Peso Objetivo (kg)</Label>
            <Input
              id="targetWeight"
              type="number"
              step="0.1"
              placeholder="65"
              value={formData.targetWeight}
              onChange={(e) => updateField("targetWeight", e.target.value)}
            />
          </div>
        </div>

        {imc && (
          <div className="mt-4 p-4 bg-primary/5 rounded-lg">
            <p className="text-sm text-muted-foreground">Tu IMC actual es:</p>
            <p className="text-2xl font-bold text-primary">{imc}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {parseFloat(imc) < 18.5 ? 'Bajo peso' :
                parseFloat(imc) < 25 ? 'Peso normal' :
                  parseFloat(imc) < 30 ? 'Sobrepeso' : 'Obesidad'}
            </p>
          </div>
        )}
      </Card>

      {/* Preferencias de Dieta */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Preferencias de Dieta</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dietType">Tipo de Dieta</Label>
            <Select value={formData.dietType} onValueChange={(v) => updateField("dietType", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balanced">Balanceada</SelectItem>
                <SelectItem value="vegetarian">Vegetariana</SelectItem>
                <SelectItem value="vegan">Vegana</SelectItem>
                <SelectItem value="keto">Keto</SelectItem>
                <SelectItem value="paleo">Paleo</SelectItem>
                <SelectItem value="mediterranean">Mediterránea</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="mealsPerDay">Comidas por Día</Label>
            <Select value={formData.mealsPerDay} onValueChange={(v) => updateField("mealsPerDay", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 comidas</SelectItem>
                <SelectItem value="4">4 comidas</SelectItem>
                <SelectItem value="5">5 comidas</SelectItem>
                <SelectItem value="6">6 comidas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Label>Alergias o Restricciones</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {["Lácteos", "Gluten", "Nueces", "Mariscos", "Huevos", "Soja"].map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox
                  id={item}
                  checked={formData.allergies.includes(item)}
                  onCheckedChange={() => toggleAllergy(item)}
                />
                <Label htmlFor={item} className="font-normal cursor-pointer">{item}</Label>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Actividad Física */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Actividad Física</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="activityLevel">Nivel de Actividad</Label>
            <Select value={formData.activityLevel} onValueChange={(v) => updateField("activityLevel", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentario</SelectItem>
                <SelectItem value="light">Ligero (1-3 días/semana)</SelectItem>
                <SelectItem value="moderate">Moderado (3-5 días/semana)</SelectItem>
                <SelectItem value="active">Activo (6-7 días/semana)</SelectItem>
                <SelectItem value="very-active">Muy activo (ejercicio intenso)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="exerciseType">Tipo de Ejercicio</Label>
            <Input
              id="exerciseType"
              placeholder="Ej: Gimnasio, Correr, Yoga"
              value={formData.exerciseType}
              onChange={(e) => updateField("exerciseType", e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Objetivos */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Objetivos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="goal">Objetivo Principal</Label>
            <Select value={formData.goal} onValueChange={(v) => updateField("goal", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose">Perder Peso</SelectItem>
                <SelectItem value="maintain">Mantener Peso</SelectItem>
                <SelectItem value="gain">Ganar Músculo</SelectItem>
                <SelectItem value="health">Mejorar Salud General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="duration">Duración del Plan</Label>
            <Select value={formData.duration} onValueChange={(v) => updateField("duration", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1week">1 Semana</SelectItem>
                <SelectItem value="2weeks">2 Semanas</SelectItem>
                <SelectItem value="1month">1 Mes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="motivation">Motivación Personal (opcional)</Label>
          <Input
            id="motivation"
            placeholder="¿Qué te motiva a alcanzar tus objetivos?"
            value={formData.motivation}
            onChange={(e) => updateField("motivation", e.target.value)}
          />
        </div>
      </Card>

      {/* Acciones */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Acciones</h3>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleSave} className="flex-1 md:flex-none">
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>

          <Button onClick={handleRegeneratePlan} variant="outline" className="flex-1 md:flex-none">
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerar Plan
          </Button>

          <Button onClick={handleExportData} variant="outline" className="flex-1 md:flex-none">
            <Download className="h-4 w-4 mr-2" />
            Exportar Datos
          </Button>
        </div>

        <Separator className="my-6" />

        <div>
          <h4 className="text-sm font-semibold text-destructive mb-2">Zona de Peligro</h4>
          <Button onClick={handleDeleteAccount} variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar Cuenta
          </Button>
        </div>
      </Card>
    </div>
  );
}

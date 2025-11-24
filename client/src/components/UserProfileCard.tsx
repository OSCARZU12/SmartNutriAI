import { Card } from "@/components/ui/card";
import { User, Target, Activity, Utensils, Calendar, AlertCircle } from "lucide-react";

interface UserProfileCardProps {
  userData: any;
}

const ACTIVITY_LABELS = {
  'sedentary': 'Sedentario',
  'light': 'Ligero',
  'moderate': 'Moderado',
  'active': 'Activo',
  'very-active': 'Muy activo'
};

const GOAL_LABELS = {
  'lose': 'Perder Peso',
  'maintain': 'Mantener Peso',
  'gain': 'Ganar Músculo',
  'health': 'Mejorar Salud'
};

const DIET_LABELS = {
  'balanced': 'Balanceada',
  'vegetarian': 'Vegetariana',
  'vegan': 'Vegana',
  'keto': 'Keto',
  'paleo': 'Paleo',
  'mediterranean': 'Mediterránea'
};

const DURATION_LABELS = {
  '1week': '1 Semana',
  '2weeks': '2 Semanas',
  '1month': '1 Mes'
};

export default function UserProfileCard({ userData }: UserProfileCardProps) {
  if (!userData) {
    return null;
  }

  const age = userData.age || userData.edad;
  const weight = userData.weight || userData.peso;
  const height = userData.height || userData.altura;
  const gender = userData.gender || userData.genero;
  const activityLevel = userData.activityLevel || userData.actividad;
  const goal = userData.goal || userData.objetivo;
  const dietType = userData.dietType || userData.tipo_dieta;
  const duration = userData.duration || userData.duracion;
  const allergies = userData.allergies || userData.alergias || [];

  // Calcular IMC
  const heightInMeters = parseFloat(height) / 100;
  const bmi = (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(1);

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Tu Perfil Nutricional</h3>
          <p className="text-sm text-muted-foreground">Información personalizada</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Edad y Género */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Edad</p>
          <p className="text-lg font-semibold">{age} años</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Género</p>
          <p className="text-lg font-semibold capitalize">
            {gender === 'male' ? 'Masculino' : gender === 'female' ? 'Femenino' : gender}
          </p>
        </div>

        {/* Peso y Altura */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Peso</p>
          <p className="text-lg font-semibold">{weight} kg</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Altura</p>
          <p className="text-lg font-semibold">{height} cm</p>
        </div>

        {/* IMC */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">IMC</p>
          <p className="text-lg font-semibold">{bmi}</p>
        </div>

        {/* Actividad */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Actividad
          </p>
          <p className="text-lg font-semibold">{ACTIVITY_LABELS[activityLevel] || activityLevel}</p>
        </div>

        {/* Objetivo */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
            <Target className="h-3 w-3" />
            Objetivo
          </p>
          <p className="text-lg font-semibold">{GOAL_LABELS[goal] || goal}</p>
        </div>

        {/* Tipo de Dieta */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
            <Utensils className="h-3 w-3" />
            Dieta
          </p>
          <p className="text-lg font-semibold">{DIET_LABELS[dietType] || dietType}</p>
        </div>

        {/* Duración */}
        {duration && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Duración
            </p>
            <p className="text-lg font-semibold">{DURATION_LABELS[duration] || duration}</p>
          </div>
        )}

        {/* Alergias */}
        {allergies.length > 0 && (
          <div className="space-y-1 col-span-2 md:col-span-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Restricciones
            </p>
            <div className="flex flex-wrap gap-2">
              {allergies.map((allergy: string) => (
                <span
                  key={allergy}
                  className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs rounded-full"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

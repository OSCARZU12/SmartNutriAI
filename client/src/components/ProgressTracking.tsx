import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { TrendingDown, TrendingUp, Award, Calendar, Activity, Camera, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeightEntry {
  date: string;
  weight: number;
  notes?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  date?: string;
}

export default function ProgressTracking() {
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [currentWeight, setCurrentWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [adherenceData, setAdherenceData] = useState({ completed: 0, total: 0 });

  useEffect(() => {
    // Cargar datos del usuario
    const profileData = localStorage.getItem('user_profile');
    if (profileData) {
      setUserData(JSON.parse(profileData));
    }

    // Cargar historial de peso
    const savedHistory = localStorage.getItem('weight_history');
    if (savedHistory) {
      setWeightHistory(JSON.parse(savedHistory));
    }

    // Cargar logros
    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    } else {
      // Inicializar logros
      const defaultAchievements: Achievement[] = [
        { id: '1', title: 'Primer Día', description: 'Completaste tu primer día del plan', icon: '🎯', unlocked: false },
        { id: '2', title: 'Una Semana', description: '7 días siguiendo el plan', icon: '📅', unlocked: false },
        { id: '3', title: 'Racha de 30 días', description: '30 días consecutivos', icon: '🔥', unlocked: false },
        { id: '4', title: 'Primer Kilo', description: 'Perdiste tu primer kilogramo', icon: '⚖️', unlocked: false },
        { id: '5', title: 'Meta Alcanzada', description: 'Llegaste a tu peso objetivo', icon: '🏆', unlocked: false },
      ];
      setAchievements(defaultAchievements);
    }

    // Cargar adherencia
    const savedAdherence = localStorage.getItem('adherence_data');
    if (savedAdherence) {
      setAdherenceData(JSON.parse(savedAdherence));
    }
  }, []);

  const handleAddWeight = () => {
    if (!currentWeight) return;

    const newEntry: WeightEntry = {
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(currentWeight),
      notes: notes
    };

    const updatedHistory = [...weightHistory, newEntry];
    setWeightHistory(updatedHistory);
    localStorage.setItem('weight_history', JSON.stringify(updatedHistory));

    // Verificar logros
    checkAchievements(updatedHistory);

    setCurrentWeight("");
    setNotes("");
  };

  const checkAchievements = (history: WeightEntry[]) => {
    const updated = [...achievements];
    
    // Primer día
    if (history.length >= 1 && !updated[0].unlocked) {
      updated[0].unlocked = true;
      updated[0].date = new Date().toISOString();
    }

    // Una semana
    if (history.length >= 7 && !updated[1].unlocked) {
      updated[1].unlocked = true;
      updated[1].date = new Date().toISOString();
    }

    // Primer kilo perdido
    if (history.length >= 2 && userData) {
      const initialWeight = parseFloat(userData.weight);
      const latestWeight = history[history.length - 1].weight;
      if (initialWeight - latestWeight >= 1 && !updated[3].unlocked) {
        updated[3].unlocked = true;
        updated[3].date = new Date().toISOString();
      }
    }

    setAchievements(updated);
    localStorage.setItem('achievements', JSON.stringify(updated));
  };

  const calculateIMC = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getWeightTrend = () => {
    if (weightHistory.length < 2) return null;
    const first = weightHistory[0].weight;
    const last = weightHistory[weightHistory.length - 1].weight;
    const diff = last - first;
    return {
      value: Math.abs(diff).toFixed(1),
      isLoss: diff < 0
    };
  };

  const chartData = weightHistory.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
    peso: entry.weight
  }));

  // Usar el último peso registrado o el peso del perfil
  const currentWeightValue = weightHistory.length > 0 
    ? weightHistory[weightHistory.length - 1].weight 
    : userData ? parseFloat(userData.weight) : null;

  const currentIMC = currentWeightValue && userData
    ? calculateIMC(currentWeightValue, parseFloat(userData.height))
    : null;

  const adherencePercentage = adherenceData.total > 0
    ? Math.round((adherenceData.completed / adherenceData.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Peso Actual</p>
              <p className="text-3xl font-bold">
                {currentWeightValue ? `${currentWeightValue} kg` : '-'}
              </p>
              {userData && weightHistory.length === 0 && (
                <p className="text-xs text-muted-foreground mt-1">Peso inicial del perfil</p>
              )}
            </div>
            {getWeightTrend() && (
              <div className={`flex items-center gap-1 ${getWeightTrend()!.isLoss ? 'text-green-600' : 'text-red-600'}`}>
                {getWeightTrend()!.isLoss ? <TrendingDown className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
                <span className="font-semibold">{getWeightTrend()!.value} kg</span>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div>
            <p className="text-sm text-muted-foreground">IMC Actual</p>
            <p className="text-3xl font-bold">{currentIMC || '-'}</p>
            {currentIMC && (
              <p className="text-xs text-muted-foreground mt-1">
                {parseFloat(currentIMC) < 18.5 ? 'Bajo peso' :
                 parseFloat(currentIMC) < 25 ? 'Normal' :
                 parseFloat(currentIMC) < 30 ? 'Sobrepeso' : 'Obesidad'}
              </p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div>
            <p className="text-sm text-muted-foreground">Adherencia al Plan</p>
            <p className="text-3xl font-bold">{adherencePercentage}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${adherencePercentage}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Gráfica de Peso */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Evolución del Peso</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="peso" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Registra tu peso para ver la gráfica de evolución
          </div>
        )}
      </Card>

      {/* Registro de Peso */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Registrar Peso</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="70.5"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Input
              id="notes"
              placeholder="¿Cómo te sientes hoy?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={handleAddWeight} className="mt-4" disabled={!currentWeight}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Registro
        </Button>
      </Card>

      {/* Logros */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award className="h-5 w-5" />
          Logros Desbloqueados
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 ${
                achievement.unlocked
                  ? 'bg-primary/5 border-primary'
                  : 'bg-muted/50 border-muted opacity-50'
              }`}
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <h4 className="font-semibold">{achievement.title}</h4>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
              {achievement.unlocked && achievement.date && (
                <Badge variant="secondary" className="mt-2">
                  {new Date(achievement.date).toLocaleDateString('es-ES')}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Historial de Registros */}
      {weightHistory.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Historial de Registros</h3>
          <div className="space-y-3">
            {[...weightHistory].reverse().slice(0, 10).map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{entry.weight} kg</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                {entry.notes && (
                  <p className="text-sm text-muted-foreground italic">{entry.notes}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

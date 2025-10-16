import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

const TOTAL_STEPS = 5;

export default function OnboardingForm() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "",
    activityLevel: "",
    goal: "",
    dietType: "",
    allergies: [] as string[],
    duration: ""
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      setLocation("/dashboard");
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Progress value={progress} className="mb-4" data-testid="progress-onboarding" />
          <p className="text-sm text-muted-foreground text-center">
            Paso {currentStep} de {TOTAL_STEPS}
          </p>
        </div>

        <Card className="p-8 md:p-12">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Información Personal</h2>
                <p className="text-muted-foreground">Cuéntanos un poco sobre ti</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="age">Edad</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => updateField("age", e.target.value)}
                    data-testid="input-age"
                  />
                </div>
                
                <div>
                  <Label htmlFor="gender">Género</Label>
                  <RadioGroup value={formData.gender} onValueChange={(v) => updateField("gender", v)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" data-testid="radio-male" />
                      <Label htmlFor="male" className="font-normal cursor-pointer">Masculino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" data-testid="radio-female" />
                      <Label htmlFor="female" className="font-normal cursor-pointer">Femenino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" data-testid="radio-other" />
                      <Label htmlFor="other" className="font-normal cursor-pointer">Otro</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Medidas Físicas</h2>
                <p className="text-muted-foreground">Necesitamos tus medidas para calcular tus necesidades calóricas</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={formData.weight}
                    onChange={(e) => updateField("weight", e.target.value)}
                    data-testid="input-weight"
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
                    data-testid="input-height"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Actividad y Objetivos</h2>
                <p className="text-muted-foreground">Cuéntanos sobre tu estilo de vida y metas</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="activity">Nivel de Actividad</Label>
                  <Select value={formData.activityLevel} onValueChange={(v) => updateField("activityLevel", v)}>
                    <SelectTrigger data-testid="select-activity">
                      <SelectValue placeholder="Selecciona tu nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentario (poco o ningún ejercicio)</SelectItem>
                      <SelectItem value="light">Ligero (ejercicio 1-3 días/semana)</SelectItem>
                      <SelectItem value="moderate">Moderado (ejercicio 3-5 días/semana)</SelectItem>
                      <SelectItem value="active">Activo (ejercicio 6-7 días/semana)</SelectItem>
                      <SelectItem value="very-active">Muy activo (ejercicio intenso diario)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="goal">Objetivo Principal</Label>
                  <Select value={formData.goal} onValueChange={(v) => updateField("goal", v)}>
                    <SelectTrigger data-testid="select-goal">
                      <SelectValue placeholder="¿Qué quieres lograr?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lose">Perder Peso</SelectItem>
                      <SelectItem value="maintain">Mantener Peso</SelectItem>
                      <SelectItem value="gain">Ganar Músculo</SelectItem>
                      <SelectItem value="health">Mejorar Salud General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Preferencias Dietéticas</h2>
                <p className="text-muted-foreground">Personaliza tu plan según tus preferencias</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="diet">Tipo de Dieta</Label>
                  <Select value={formData.dietType} onValueChange={(v) => updateField("dietType", v)}>
                    <SelectTrigger data-testid="select-diet">
                      <SelectValue placeholder="Selecciona tu dieta" />
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
                  <Label>Alergias o Restricciones</Label>
                  <div className="space-y-2 mt-2">
                    {["Lácteos", "Gluten", "Nueces", "Mariscos", "Huevos"].map((item) => (
                      <div key={item} className="flex items-center space-x-2">
                        <Checkbox
                          id={item}
                          checked={formData.allergies.includes(item)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateField("allergies", [...formData.allergies, item]);
                            } else {
                              updateField("allergies", formData.allergies.filter(a => a !== item));
                            }
                          }}
                          data-testid={`checkbox-${item.toLowerCase()}`}
                        />
                        <Label htmlFor={item} className="font-normal cursor-pointer">{item}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Duración del Plan</h2>
                <p className="text-muted-foreground">¿Por cuánto tiempo quieres tu plan de nutrición?</p>
              </div>
              
              <RadioGroup value={formData.duration} onValueChange={(v) => updateField("duration", v)}>
                <Card className="p-4 hover-elevate cursor-pointer" data-testid="card-duration-1week">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1week" id="1week" />
                    <Label htmlFor="1week" className="font-normal cursor-pointer flex-1">
                      <div className="font-semibold">1 Semana</div>
                      <div className="text-sm text-muted-foreground">Perfecto para probar</div>
                    </Label>
                  </div>
                </Card>
                
                <Card className="p-4 hover-elevate cursor-pointer" data-testid="card-duration-2weeks">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2weeks" id="2weeks" />
                    <Label htmlFor="2weeks" className="font-normal cursor-pointer flex-1">
                      <div className="font-semibold">2 Semanas</div>
                      <div className="text-sm text-muted-foreground">Recomendado para comenzar</div>
                    </Label>
                  </div>
                </Card>
                
                <Card className="p-4 hover-elevate cursor-pointer" data-testid="card-duration-1month">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1month" id="1month" />
                    <Label htmlFor="1month" className="font-normal cursor-pointer flex-1">
                      <div className="font-semibold">1 Mes</div>
                      <div className="text-sm text-muted-foreground">Mejor para resultados sostenibles</div>
                    </Label>
                  </div>
                </Card>
              </RadioGroup>
            </div>
          )}

          <div className="flex justify-between mt-8 gap-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              data-testid="button-previous"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
            
            <Button
              onClick={nextStep}
              data-testid="button-next"
            >
              {currentStep === TOTAL_STEPS ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generar Mi Plan
                </>
              ) : (
                <>
                  Siguiente
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

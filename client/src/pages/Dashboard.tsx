import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { Home, Calendar, ShoppingCart, User, TrendingUp, Utensils, Loader2, LogOut, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import DashboardStats from "@/components/DashboardStats";
import MacroChart from "@/components/MacroChart";
import WeeklyChart from "@/components/WeeklyChart";
import TodayMealPlan from "@/components/TodayMealPlan";
import SmartShoppingList from "@/components/SmartShoppingList";
import ProgressTracking from "@/components/ProgressTracking";
import ProfileSettings from "@/components/ProfileSettings";
import GeminiPlanView from "@/components/GeminiPlanView";
import UserProfileCard from "@/components/UserProfileCard";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { API_BASE_URL } from "@/lib/config";

// MAPPINGS Y STUBS
const GOAL_MAPPING: any = {
  'lose': 'Pérdida de Peso', 'maintain': 'Mantenimiento',
  'gain': 'Ganancia Muscular', 'health': 'Mejorar Salud General'
};

const menuItems = [
  { title: "Dashboard", icon: Home, id: "dashboard" },
  { title: "Plan de Comidas", icon: Calendar, id: "meals" },
  { title: "Lista de Compras", icon: ShoppingCart, id: "shopping" },
  { title: "Progreso", icon: TrendingUp, id: "progress" },
  { title: "Perfil", icon: User, id: "profile" }
];

function AppSidebar({ activeItem, setActiveItem }: { activeItem: string, setActiveItem: (id: string) => void }) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 px-2 py-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Utensils className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">SmartNutriAI</span>
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeItem === item.id}
                    onClick={() => setActiveItem(item.id)}
                    data-testid={`sidebar-${item.id}`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [userData, setUserData] = useState<any>(null);
  const [dietPlan, setDietPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  // 🌟 LECTURA DE DATOS AL INICIO 🌟
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 1. Cargar perfil (primero local, luego podríamos validar con backend)
        const profileData = localStorage.getItem('user_profile');
        if (profileData) {
          setUserData(JSON.parse(profileData));
        }

        // 2. Cargar plan activo desde el BACKEND
        const token = localStorage.getItem('access_token');
        if (token) {
          const response = await fetch(`${API_BASE_URL}/api/plan/activo`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            console.log("🔍 Plan Activo recuperado:", data);
            // Adaptar la respuesta del backend al formato que espera el frontend
            // El backend devuelve { plan: { ... } } o directamente el objeto del plan
            const planToSet = data.plan || data;
            setDietPlan(planToSet);
            // Actualizar caché local por si acaso
            localStorage.setItem('user_diet_plan', JSON.stringify(planToSet));
          } else {
            console.log("⚠️ No se encontró plan activo o error en backend:", response.status);
            // Fallback: intentar leer de localStorage si el backend falla
            const localDiet = localStorage.getItem('user_diet_plan');
            if (localDiet) setDietPlan(JSON.parse(localDiet));
          }
        }
      } catch (error) {
        console.error("❌ Error al cargar datos iniciales:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [setLocation]);

  // 🌟 FUNCIÓN CLAVE: Cerrar Sesión 🌟
  const handleLogout = () => {
    // Solo redirigir a la landing, sin borrar datos
    // Los datos se mantienen en localStorage para la próxima sesión
    alert('Sesión cerrada exitosamente.');
    setLocation('/'); // Redirige a la Landing Page
  };

  const handleGenerateNewPlan = async () => {
    if (!userData) return;

    setIsLoading(true);
    try {
      const requestData = {
        edad: parseInt(userData.age),
        genero: userData.gender === 'male' ? 'Masculino' : userData.gender === 'female' ? 'Femenino' : 'Otro',
        peso: parseFloat(userData.weight),
        altura: parseFloat(userData.height),
        actividad: userData.activityLevel,
        objetivo: userData.goal,
        tipo_dieta: userData.dietType,
        alergias: userData.allergies || [],
        restricciones: "",
        duracion: userData.duration
      };

      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/plan/generar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Error al generar el plan');
      }

      const result = await response.json();
      console.log("🔍 API Response:", result); // DEBUG LOG

      // Misma lógica robusta que en useEffect
      const planToSet = result.plan || result;
      console.log("🔍 Plan Data to Set:", planToSet); // DEBUG LOG

      localStorage.setItem('user_diet_plan', JSON.stringify(planToSet));
      setDietPlan(planToSet);

      alert('¡Nuevo plan generado exitosamente! Redirigiendo a tu plan...');
      setActivePage('meals'); // Cambiar a la pestaña de comidas para ver el resultado
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar el plan. Verifica que el backend esté corriendo.');
    } finally {
      setIsLoading(false);
    }
  };

  // 🌟 VISTAS DEL DASHBOARD (Movidas dentro para acceder al estado) 🌟
  const MealPlanView = () => {
    // Helper para extraer el objeto JSON del plan, venga de donde venga
    const getPlanObject = (plan: any) => {
      if (!plan) return null;
      // Caso 1: Ya es el objeto estructurado (ideal)
      if (plan.plan_nutricional) return plan;
      // Caso 2: Está anidado en contenido_plan o contenido
      if (plan.contenido_plan && typeof plan.contenido_plan === 'object') return plan.contenido_plan;
      if (plan.contenido && typeof plan.contenido === 'object') return plan.contenido;
      // Caso 3: Es un string JSON (intentar parsear)
      if (typeof plan === 'string') {
        try { return JSON.parse(plan); } catch (e) { return null; }
      }
      // Caso 4: Propiedades anidadas son strings JSON
      if (typeof plan.contenido_plan === 'string') {
        try { return JSON.parse(plan.contenido_plan); } catch (e) { return null; }
      }
      return plan; // Intentar devolver lo que hay
    };

    const planData = getPlanObject(dietPlan);

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Plan de Comidas</h2>
          <p className="text-muted-foreground">Tu plan nutricional completo generado por IA</p>
        </div>
        {planData ? (
          <GeminiPlanView plan={planData} userData={userData} />
        ) : (
          <TodayMealPlan />
        )}
      </div>
    );
  };

  const ShoppingListView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Lista de Compras</h2>
        <p className="text-muted-foreground">Ingredientes extraídos de tu plan nutricional</p>
      </div>
      <SmartShoppingList plan={dietPlan} />
    </div>
  );

  const ProgressView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Seguimiento de Progreso</h2>
        <p className="text-muted-foreground">Monitorea tu evolución y logros</p>
      </div>
      <ProgressTracking />
    </div>
  );

  const ProfileView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Configuración de Perfil</h2>
        <p className="text-muted-foreground">Administra tu información personal y preferencias</p>
      </div>
      <ProfileSettings />
    </div>
  );

  const DashboardOverview = () => {
    // Detectar si el plan viene de Gemini (es texto) o es estructurado
    const isTextOnlyPlan = typeof dietPlan === 'string' || (dietPlan && typeof dietPlan === 'object' && ('contenido_plan' in dietPlan || 'contenido' in dietPlan));

    // Obtener nombre del usuario
    const userName = userData?.name || 'de vuelta';

    let descriptionContent;
    if (userData && dietPlan) {
      const userGoal = GOAL_MAPPING[userData.goal] || userData.goal;

      if (isTextOnlyPlan) {
        descriptionContent = (
          <p className="text-muted-foreground">
            <span className="font-semibold">Meta:</span> {userGoal} |
            <span className="font-semibold"> Plan generado por IA</span>
          </p>
        );
      } else {
        descriptionContent = (
          <p className="text-muted-foreground">
            <span className="font-semibold">Meta:</span> {userGoal} |
            <span className="font-semibold"> Calorías objetivo:</span> {dietPlan.targetCalories} kcal |
            <span className="font-semibold"> Enfoque:</span> {dietPlan.dietFocus}
          </p>
        );
      }
    } else {
      descriptionContent = <p className="text-muted-foreground">Tu plan está cargando. Si esto tarda, por favor completa el Onboarding.</p>;
    }

    return (
      <>
        <div className="flex items-center justify-between gap-4 flex-wrap pb-6 border-b">
          <div>
            <h1 className="text-3xl font-bold mb-1">¡Bienvenido {userName}!</h1>
            {descriptionContent}
          </div>
          <Button
            data-testid="button-generate-new-plan"
            className="bg-primary hover:bg-primary/90"
            disabled={!userData || isLoading}
            onClick={handleGenerateNewPlan}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? 'Generando...' : 'Generar Nuevo Plan con IA'}
          </Button>
        </div>

        <div className="space-y-6 pt-6">
          {/* Tarjeta de perfil del usuario - siempre visible */}
          <UserProfileCard userData={userData} />

          {/* Mostrar estadísticas y gráficas */}
          <DashboardStats userData={userData} dietPlan={dietPlan} />

          {/* Gráficas Principales */}
          <div className="space-y-6">
            <WeeklyChart dietPlan={dietPlan} />

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <MacroChart dietPlan={dietPlan} />
              </div>
              {/* Espacio para futuros widgets */}
            </div>
          </div>
        </div>
      </>
    );
  };

  const ContentMap: any = {
    dashboard: { component: DashboardOverview, title: "Dashboard", description: "Resumen nutricional diario" },
    meals: { component: MealPlanView, title: "Plan de Comidas", description: "Gestión de tu calendario de comidas" },
    shopping: { component: ShoppingListView, title: "Lista de Compras", description: "Artículos necesarios para tu plan" },
    progress: { component: ProgressView, title: "Progreso", description: "Seguimiento de tus metas y métricas" },
    profile: { component: ProfileView, title: "Perfil", description: "Configuración y datos personales" }
  };

  const CurrentContent = ContentMap[activePage].component;
  const currentTitle = ContentMap[activePage].title;
  const currentDescription = ContentMap[activePage].description;

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-xl font-medium">
        <Loader2 className="h-6 w-6 mr-3 animate-spin text-primary" />
        Cargando tu perfil nutricional...
      </div>
    );
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background">

        <AppSidebar activeItem={activePage} setActiveItem={setActivePage} />

        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-20 flex items-center justify-between p-4 border-b bg-card shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold">{currentTitle}</h1>
                <p className="text-sm text-muted-foreground">{currentDescription}</p>
              </div>
            </div>

            {/* 🌟 BOTÓN DE CERRAR SESIÓN 🌟 */}
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={handleLogout} className="text-sm">
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              <CurrentContent />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { Home, Calendar, ShoppingCart, User, TrendingUp, Utensils, Loader2, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import DashboardStats from "@/components/DashboardStats";
import MacroChart from "@/components/MacroChart";
import TodaysMeals from "@/components/TodaysMeals";
import MealPlanCalendar from "@/components/MealPlanCalendar";
import ShoppingList from "@/components/ShoppingList";
import GeminiPlanView from "@/components/GeminiPlanView";
import UserProfileCard from "@/components/UserProfileCard";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useLocation } from "wouter";

// MAPPINGS Y STUBS
const GOAL_MAPPING = {
    'lose': 'Pérdida de Peso', 'maintain': 'Mantenimiento',
    'gain': 'Ganancia Muscular', 'health': 'Mejorar Salud General'
};
const MealPlanView = () => (
    <div className="p-4 sm:p-6 bg-card rounded-xl shadow-lg border">
        <h2 className="text-2xl font-bold mb-4">🍽️ Planificador Semanal de Comidas</h2>
        <p className="text-muted-foreground mb-6">Arrastra y suelta comidas para planificar tu semana.</p>
        <MealPlanCalendar />
        <Button className="mt-4 w-full">Guardar y Sincronizar Plan</Button>
    </div>
);
const ShoppingListView = () => (
    <div className="p-4 sm:p-6 bg-card rounded-xl shadow-lg border">
        <h2 className="text-2xl font-bold mb-4">🛒 Lista de Compras Inteligente</h2>
        <ShoppingList />
        <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline">Exportar a CSV</Button>
        </div>
    </div>
);
const ProgressView = () => (
    <div className="p-4 sm:p-6 bg-card rounded-xl shadow-lg border min-h-[500px]">
        <h2 className="text-2xl font-bold mb-4">📈 Seguimiento de Progreso</h2>
        <div className="w-full h-80 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-lg">
            [Gráficos de Progreso Aquí]
        </div>
    </div>
);
const ProfileView = () => (
    <div className="p-4 sm:p-6 bg-card rounded-xl shadow-lg border min-h-[500px]">
        <h2 className="text-2xl font-bold mb-4">👤 Configuración de Perfil</h2>
        <Button className="mt-4">Guardar Cambios</Button>
    </div>
);
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
  const [userData, setUserData] = useState(null);
  const [dietPlan, setDietPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  // 🌟 LECTURA DE DATOS AL INICIO 🌟
  useEffect(() => {
    const profileData = localStorage.getItem('user_profile');
    const dietData = localStorage.getItem('user_diet_plan');

    if (profileData) {
        setUserData(JSON.parse(profileData));
    }

    if (dietData) {
        setDietPlan(JSON.parse(dietData));
    }

    setIsLoading(false);
  }, [setLocation]);

  // 🌟 FUNCIÓN CLAVE: Cerrar Sesión 🌟
  const handleLogout = () => {
    localStorage.removeItem('auth_token'); // Borra el token que valida la sesión
    localStorage.removeItem('user_profile'); // Borra los datos del perfil
    localStorage.removeItem('user_diet_plan'); // Borra la dieta
    alert('Sesión cerrada exitosamente.');
    setLocation('/'); // Redirige a la Landing Page
  };

  const DashboardOverview = () => {
    // Detectar si el plan viene de Gemini (es texto) o es estructurado
    const isTextOnlyPlan = typeof dietPlan === 'string';
    const hasRawText = dietPlan && typeof dietPlan === 'object' && 'rawText' in dietPlan;
    
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
                <h1 className="text-3xl font-bold mb-1">¡Bienvenido de vuelta!</h1>
                {descriptionContent}
            </div>
            <Button data-testid="button-generate-new-plan" className="bg-primary hover:bg-primary/90" disabled={!userData}>
                <Sparkles className="mr-2 h-4 w-4" />
                Generar Nuevo Plan con IA
            </Button>
        </div>

        <div className="space-y-6 pt-6">
            {/* Tarjeta de perfil del usuario - siempre visible */}
            <UserProfileCard userData={userData} />

            {/* Si es solo texto, mostrar solo el plan de Gemini */}
            {isTextOnlyPlan ? (
                <GeminiPlanView planText={dietPlan} />
            ) : (
                <>
                    {/* Mostrar estadísticas y gráficas */}
                    <DashboardStats userData={userData} dietPlan={dietPlan} />

                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <TodaysMeals dietPlan={dietPlan} />
                            {/* Si tiene texto de Gemini, mostrarlo también */}
                            {hasRawText && <GeminiPlanView planText={dietPlan.rawText} />}
                        </div>
                        <div className="space-y-6">
                            <MacroChart dietPlan={dietPlan} />
                            <ShoppingList userData={userData} />
                        </div>
                    </div>
                </>
            )}
        </div>
        </>
    );
  };

  const ContentMap = {
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
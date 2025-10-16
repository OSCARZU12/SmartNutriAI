import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { Home, Calendar, ShoppingCart, User, TrendingUp, Utensils } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import DashboardStats from "@/components/DashboardStats";
import MacroChart from "@/components/MacroChart";
import TodaysMeals from "@/components/TodaysMeals";
import MealPlanCalendar from "@/components/MealPlanCalendar";
import ShoppingList from "@/components/ShoppingList";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const menuItems = [
  { title: "Dashboard", icon: Home, id: "dashboard" },
  { title: "Plan de Comidas", icon: Calendar, id: "meals" },
  { title: "Lista de Compras", icon: ShoppingCart, id: "shopping" },
  { title: "Progreso", icon: TrendingUp, id: "progress" },
  { title: "Perfil", icon: User, id: "profile" }
];

function AppSidebar() {
  const [activeItem, setActiveItem] = useState("dashboard");

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Utensils className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">NutriAI</span>
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
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
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
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-3xl font-bold mb-2">¡Bienvenido de vuelta!</h1>
                  <p className="text-muted-foreground">Aquí está tu resumen nutricional de hoy</p>
                </div>
                <Button data-testid="button-generate-new-plan">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generar Nuevo Plan
                </Button>
              </div>
              
              <DashboardStats />
              
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <TodaysMeals />
                  <MealPlanCalendar />
                </div>
                
                <div className="space-y-6">
                  <MacroChart />
                  <ShoppingList />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

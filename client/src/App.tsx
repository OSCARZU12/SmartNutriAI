import { Switch, Route } from "wouter";
// Se asume que tu alias funciona para las librerías
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// PÁGINAS ORIGINALES
import Landing from "@/pages/Landing";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";

// NUEVAS PÁGINAS DE AUTENTICACIÓN
import Login from "@/pages/Login";
import Register from "@/pages/Register";

function Router() {
  return (
    <Switch>
      {/* 1. RUTAS DE AUTENTICACIÓN */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      {/* 2. RUTAS DE LA APLICACIÓN PRINCIPAL */}
      <Route path="/" component={Landing} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/dashboard" component={Dashboard} />

      {/* 3. RUTA 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
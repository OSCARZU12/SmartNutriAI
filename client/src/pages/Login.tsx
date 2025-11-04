import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LogIn } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError('Por favor, ingresa tu email y contraseña.');
      setLoading(false);
      return;
    }

    // =========================================================
    // SIMULACIÓN: LÓGICA DE REDIRECCIÓN CONDICIONAL
    // =========================================================
    setTimeout(() => {
        setLoading(false);

        // 1. Simular que el inicio de sesión fue exitoso (guardar token)
        localStorage.setItem('auth_token', 'simulated_jwt_token_123');
        alert('¡Inicio de sesión exitoso (Simulado)! Redirigiendo...');

        // 2. 🌟 VERIFICAR SI EL ONBOARDING ESTÁ COMPLETO 🌟
        const userProfile = localStorage.getItem('user_profile');

        if (userProfile) {
            // Si tiene perfil, ir al Dashboard (ya tiene datos)
            setLocation('/dashboard');
        } else {
            // Si NO tiene perfil, ir al Onboarding (necesita ingresar sus datos)
            setLocation('/onboarding');
        }

    }, 1500); // Espera 1.5 segundos
    // =========================================================
  };

  return (
    // Fondo oscuro y degradado suave para un look moderno
    <div className="flex items-center justify-center min-h-screen
                    bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950
                    text-gray-100 p-4">

      {/* Card con diseño moderno y minimalista */}
      <Card className="w-full max-w-sm p-6 sm:p-8
                       bg-gray-800 border-none rounded-2xl
                       shadow-[0_10px_30px_rgba(0,0,0,0.5),_0_0_0_1px_rgba(255,255,255,0.05)]
                       hover:shadow-[0_15px_40px_rgba(0,0,0,0.7),_0_0_0_1px_rgba(255,255,255,0.1)]
                       transition-all duration-300">

        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-2">
             <LogIn className="w-8 h-8 text-green-400" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-green-400">
            Bienvenido
          </CardTitle>
          <CardDescription className="text-gray-400 mt-1">
            Tu portal de salud y nutrición te espera.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-5">
            {error && (
              <p className="text-sm font-medium text-red-400 bg-red-900/40 p-3 rounded-lg border border-red-700">
                {error}
              </p>
            )}

            <div className="grid gap-3">
              <Label htmlFor="login-email" className="text-gray-300">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="nombre@ejemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-green-500 focus:border-green-500 transition duration-200"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="login-password" className="text-gray-300">Contraseña</Label>
              <Input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-green-500 focus:border-green-500 transition duration-200"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-6">
            <Button
              type="submit"
              className="w-full text-lg py-3 font-semibold
                         bg-green-500 hover:bg-green-400 text-gray-900
                         rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              disabled={loading}
            >
              {loading ? 'Accediendo...' : 'Acceder '}
            </Button>

            <Link href="/register">
                <a className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200 underline-offset-4 hover:underline">
                  ¿No tienes cuenta? Regístrate aquí
                </a>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
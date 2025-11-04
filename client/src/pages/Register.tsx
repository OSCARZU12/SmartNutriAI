import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserPlus } from 'lucide-react';
import { Link } from 'wouter';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación básica
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    // TODO: Aquí iría la llamada a tu API de Node.js (carpeta 'server')
    // para enviar los datos de registro.

    // Simulación de registro exitoso:
    setTimeout(() => {
        setLoading(false);
        if (email && password) {
            // En una aplicación real, aquí podrías mostrar una notificación.
            alert('¡Registro exitoso! Por favor, inicia sesión.');
            window.location.href = '/login'; // Redirigir al login
        } else {
            setError('Por favor, completa todos los campos.');
        }
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md shadow-2xl rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold flex items-center justify-center">
            <UserPlus className="w-6 h-6 mr-2 text-secondary" />
            Crear Cuenta
          </CardTitle>
          <CardDescription>
            Regístrate y comienza tu plan personalizado con SmartNutriAI.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            {error && (
              <p className="text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/50 p-3 rounded-lg border border-red-200">
                {error}
              </p>
            )}
            <div className="grid gap-2">
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="mial@ejemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reg-password">Contraseña</Label>
              <Input
                id="reg-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full text-lg py-6 hover-elevate bg-secondary text-secondary-foreground hover:bg-secondary/90"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarme'}
            </Button>
            <Link href="/login">
                <a className="text-sm text-primary hover:text-primary/80 transition-colors">
                    ¿Ya tienes cuenta? Inicia sesión
                </a>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
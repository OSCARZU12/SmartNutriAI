import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Sparkles, Leaf } from "lucide-react";
import { Link, useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import ThemeToggle from "@/components/ThemeToggle";

// Importa los componentes de tu landing page
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection"; // 👈 Importación CLAVE

// Importa la imagen de tu LandingHero
import heroImage from "@assets/generated_images/Healthy_meal_prep_hero_cbd03f76.png";


export default function Landing() {
    const [, setLocation] = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Verifica la autenticación al cargar
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    // Lógica principal para ambos botones CTA
    const handleStartTransformation = () => {
        if (isAuthenticated) {
            // Si está autenticado, verifica si ya completó el Onboarding
            const hasProfile = localStorage.getItem('user_profile');
            if (hasProfile) {
                setLocation('/dashboard');
            } else {
                setLocation('/onboarding');
            }
        } else {
            // Si NO está autenticado, lo lleva a Iniciar Sesión para forzar el acceso
            setLocation('/login');
        }
    };

    return (
        <div className="min-h-screen">

            {/* HEADER con botones de acceso condicionales */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo/Nombre */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <Leaf className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-xl">SmartNutriAI</span>
                    </div>

                    {/* BOTONES DE ACCESO */}
                    <div className="flex items-center space-x-4">
                        {!isAuthenticated && (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" className="hidden sm:inline-flex">
                                        <LogIn className="w-4 h-4 mr-2" />
                                        Iniciar Sesión
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="default">
                                        Registrarse
                                    </Button>
                                </Link>
                            </>
                        )}
                        {isAuthenticated && (
                            <Link href="/dashboard">
                                <Button variant="default">
                                    Ir al Dashboard
                                </Button>
                            </Link>
                        )}
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            <div className="pt-16">
                {/* HERO SECTION (Diseño atractivo) */}
                <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${heroImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />

                    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Tu Plan de Nutrición Personalizado con IA
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Obtén un plan de dieta completamente personalizado generado por inteligencia artificial,
                            diseñado específicamente para tus objetivos, preferencias y estilo de vida.
                        </p>

                        {/* 🌟 BOTÓN PRINCIPAL: USA LA FUNCIÓN handleStartTransformation 🌟 */}
                        <Button
                            size="lg"
                            onClick={handleStartTransformation}
                            className="bg-primary text-primary-foreground hover-elevate active-elevate-2 text-lg px-8 py-6"
                            data-testid="button-start-journey"
                        >
                            <Sparkles className="mr-2 h-5 w-5" />
                            {isAuthenticated ? 'Continuar mi Transformación' : 'Comenzar Mi Transformación'}
                        </Button>
                        {!isAuthenticated && (
                            <p className="mt-4 text-sm text-white/70">
                                *Inicia sesión o regístrate para comenzar tu viaje.
                            </p>
                        )}
                    </div>
                </section>
                {/* Fin del Hero Section */}

                {/* Secciones restantes */}
                <HowItWorksSection />
                <FeaturesSection />

                {/* 🌟 CTA Section: Pasamos la lógica al componente 🌟 */}
                <CTASection
                    isAuthenticated={isAuthenticated}
                    onStartTransformation={handleStartTransformation}
                />
            </div>

            <footer className="py-8 px-4 border-t bg-muted/30">
                <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
                    <p>&copy; 2025 NutriAI. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
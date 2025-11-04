import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
    isAuthenticated: boolean;
    onStartTransformation: () => void;
}

export default function CTASection({ isAuthenticated, onStartTransformation }: CTASectionProps) {

    // El texto del botón cambia dependiendo del estado de autenticación
    const buttonText = isAuthenticated ? "Continuar Mi Plan" : "Crear Mi Plan Gratis";

    return (
        <section className="py-20 bg-green-600 text-white text-center">
            <div className="max-w-4xl mx-auto px-4">

                <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                    Comienza Tu Viaje Hacia Una Mejor Salud
                </h2>

                <p className="text-xl mb-10 text-white/90">
                    Únete a miles de personas que han transformado su alimentación y su vida con NutriAI
                </p>

                {/* 🌟 APLICAR LA FUNCIÓN DE REDIRECCIÓN AL BOTÓN 🌟 */}
                <Button
                    onClick={onStartTransformation}
                    size="lg"
                    className="bg-white text-green-700 hover:bg-gray-100 text-xl font-semibold px-10 py-7 shadow-lg"
                    data-testid="button-cta-start"
                >
                    {buttonText} <ArrowRight className="h-5 w-5 ml-3" />
                </Button>
            </div>
        </section>
    );
}
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { ShoppingCart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShoppingItem {
  name: string;
  quantity?: string;
}

interface ShoppingCategory {
  name: string;
  items: ShoppingItem[];
}

interface SmartShoppingListProps {
  plan?: any;
}

export default function SmartShoppingList({ plan }: SmartShoppingListProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<ShoppingCategory[]>([]);

  useEffect(() => {
    // 1. Intentar usar el plan pasado por props
    let activePlan = plan;

    // 2. Si no hay props, intentar leer de localStorage
    if (!activePlan) {
      const storedPlan = localStorage.getItem('user_diet_plan');
      if (storedPlan) {
        try {
          activePlan = JSON.parse(storedPlan);
        } catch (e) {
          console.error("Error parsing stored plan", e);
        }
      }
    }

    if (activePlan) {
      processPlan(activePlan);
    }
  }, [plan]);

  const processPlan = (dietPlan: any) => {
    // Normalizar estructura (puede venir con o sin wrapper 'plan_nutricional')
    const planData = dietPlan.plan_nutricional || dietPlan;

    // ESTRATEGIA 1: Usar lista pre-generada por IA (JSON Estructurado)
    if (planData.lista_compras_sugerida && Array.isArray(planData.lista_compras_sugerida)) {
      console.log("🛒 Usando lista de compras estructurada del JSON");
      const categorized = categorizeItems(planData.lista_compras_sugerida);
      setCategories(categorized);
      return;
    }

    // ESTRATEGIA 2: Fallback a parsing de texto (Legacy)
    console.log("⚠️ No se encontró lista estructurada, usando parsing de texto legacy");
    const planText = typeof dietPlan === 'string' ? dietPlan : (dietPlan.rawText || '');
    if (planText) {
      const extracted = extractIngredientsFromText(planText);
      setCategories(extracted);
    }
  };

  const categorizeItems = (items: string[]): ShoppingCategory[] => {
    const categories: { [key: string]: Set<string> } = {
      'Proteínas': new Set(),
      'Frutas y Verduras': new Set(),
      'Granos y Cereales': new Set(),
      'Lácteos': new Set(),
      'Otros': new Set()
    };

    items.forEach(item => {
      const cleanItem = item.trim();
      if (!cleanItem) return;

      const lowerItem = cleanItem.toLowerCase();
      let categorized = false;

      // Lógica de categorización simple basada en palabras clave
      if (['pollo', 'carne', 'pescado', 'huevo', 'atún', 'pavo', 'res', 'cerdo', 'salmón'].some(k => lowerItem.includes(k))) {
        categories['Proteínas'].add(cleanItem);
        categorized = true;
      } else if (['manzana', 'banana', 'plátano', 'fresa', 'fruta', 'verdura', 'lechuga', 'tomate', 'cebolla', 'zanahoria', 'espinaca'].some(k => lowerItem.includes(k))) {
        categories['Frutas y Verduras'].add(cleanItem);
        categorized = true;
      } else if (['arroz', 'pan', 'avena', 'pasta', 'quinoa', 'cereal', 'tortilla'].some(k => lowerItem.includes(k))) {
        categories['Granos y Cereales'].add(cleanItem);
        categorized = true;
      } else if (['leche', 'yogur', 'queso', 'mantequilla'].some(k => lowerItem.includes(k))) {
        categories['Lácteos'].add(cleanItem);
        categorized = true;
      }

      if (!categorized) {
        categories['Otros'].add(cleanItem);
      }
    });

    return Object.entries(categories)
      .filter(([_, items]) => items.size > 0)
      .map(([name, items]) => ({
        name,
        items: Array.from(items).map(i => ({ name: i }))
      }));
  };

  const extractIngredientsFromText = (planText: string): ShoppingCategory[] => {
    // ... (Lógica anterior de parsing de texto, simplificada o reutilizada si se desea)
    // Para mantener compatibilidad, reutilizamos la lógica de categorización pero extrayendo líneas primero
    const lines = planText.split('\n');
    const potentialItems: string[] = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.match(/\d+\s*(g|kg|ml|l|taza|cucharada|rebanada|unidad)/i) || trimmed.match(/^\s*[-•]\s+/)) {
        potentialItems.push(trimmed.replace(/^\s*[-•]\s+/, '').replace(/\(.*?\)/g, '').trim());
      }
    });

    return categorizeItems(potentialItems);
  };

  const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const toggleItem = (item: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(item)) {
      newChecked.delete(item);
    } else {
      newChecked.add(item);
    }
    setCheckedItems(newChecked);
  };

  const handleExport = () => {
    let text = "LISTA DE COMPRAS - SmartNutriAI\n\n";

    categories.forEach(category => {
      text += `${category.name}:\n`;
      category.items.forEach(item => {
        const checked = checkedItems.has(item.name) ? '✓' : '☐';
        text += `  ${checked} ${item.name}\n`;
      });
      text += '\n';
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lista-de-compras.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (categories.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hay lista de compras</h3>
          <p className="text-sm text-muted-foreground">
            Genera tu plan nutricional para ver los ingredientes necesarios
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <h3 className="font-semibold">Lista de Compras</h3>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Exportar Lista
        </Button>
      </div>

      <div className="space-y-6">
        {categories.map((category, catIdx) => (
          <div key={catIdx}>
            <h4 className="font-medium text-sm text-muted-foreground mb-3">{category.name}</h4>
            <div className="space-y-2">
              {category.items.map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-center space-x-2">
                  <Checkbox
                    id={`item-${catIdx}-${itemIdx}`}
                    checked={checkedItems.has(item.name)}
                    onCheckedChange={() => toggleItem(item.name)}
                  />
                  <label
                    htmlFor={`item-${catIdx}-${itemIdx}`}
                    className={`flex-1 text-sm cursor-pointer ${checkedItems.has(item.name) ? "line-through text-muted-foreground" : ""
                      }`}
                  >
                    {item.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

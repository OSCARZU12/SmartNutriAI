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

export default function SmartShoppingList() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<ShoppingCategory[]>([]);

  useEffect(() => {
    const dietPlanStr = localStorage.getItem('user_diet_plan');
    
    if (dietPlanStr) {
      try {
        const dietPlan = JSON.parse(dietPlanStr);
        const planText = typeof dietPlan === 'string' ? dietPlan : dietPlan.rawText || '';
        
        if (planText) {
          const extractedItems = extractIngredientsFromPlan(planText);
          setCategories(extractedItems);
        }
      } catch (error) {
        console.error('Error al extraer ingredientes:', error);
      }
    }
  }, []);

  const extractIngredientsFromPlan = (planText: string): ShoppingCategory[] => {
    const ingredients: { [key: string]: Set<string> } = {
      'Proteínas': new Set(),
      'Frutas y Verduras': new Set(),
      'Granos y Cereales': new Set(),
      'Lácteos': new Set(),
      'Otros': new Set()
    };

    // Palabras clave para categorizar
    const proteinas = ['pollo', 'pechuga', 'ternera', 'carne', 'pescado', 'salmón', 'bacalao', 'atún', 'pavo', 'huevo', 'lentejas', 'garbanzos', 'frijoles'];
    const frutas = ['plátano', 'banana', 'manzana', 'fresas', 'arándanos', 'frutos rojos', 'mango', 'naranja', 'limón', 'aguacate', 'frutos del bosque'];
    const verduras = ['espinacas', 'lechuga', 'tomate', 'pepino', 'zanahoria', 'brócoli', 'coliflor', 'calabacín', 'pimiento', 'cebolla', 'apio', 'espárragos', 'judías verdes', 'batata', 'patata'];
    const granos = ['avena', 'quinoa', 'arroz', 'pan', 'tortilla', 'cuscús', 'pasta', 'cereal'];
    const lacteos = ['leche', 'yogurt', 'queso'];

    // Extraer líneas que parecen ingredientes (tienen números o medidas)
    const lines = planText.split('\n');
    
    lines.forEach(line => {
      const trimmed = line.trim().toLowerCase();
      
      // Buscar líneas que tengan cantidades (números seguidos de g, kg, ml, taza, etc.)
      if (trimmed.match(/\d+\s*(g|kg|ml|l|taza|cucharada|rebanada|unidad)/i) || 
          trimmed.match(/^\s*[-•]\s+/)) {
        
        let ingredient = trimmed
          .replace(/^\s*[-•]\s+/, '')
          .replace(/\(.*?\)/g, '')
          .trim();

        if (ingredient.length < 5 || ingredient.length > 100) return;

        // Categorizar
        let categorized = false;
        
        proteinas.forEach(p => {
          if (ingredient.includes(p)) {
            ingredients['Proteínas'].add(capitalizeFirst(ingredient));
            categorized = true;
          }
        });
        
        if (!categorized) {
          frutas.forEach(f => {
            if (ingredient.includes(f)) {
              ingredients['Frutas y Verduras'].add(capitalizeFirst(ingredient));
              categorized = true;
            }
          });
        }
        
        if (!categorized) {
          verduras.forEach(v => {
            if (ingredient.includes(v)) {
              ingredients['Frutas y Verduras'].add(capitalizeFirst(ingredient));
              categorized = true;
            }
          });
        }
        
        if (!categorized) {
          granos.forEach(g => {
            if (ingredient.includes(g)) {
              ingredients['Granos y Cereales'].add(capitalizeFirst(ingredient));
              categorized = true;
            }
          });
        }
        
        if (!categorized) {
          lacteos.forEach(l => {
            if (ingredient.includes(l)) {
              ingredients['Lácteos'].add(capitalizeFirst(ingredient));
              categorized = true;
            }
          });
        }
        
        if (!categorized && ingredient.length > 10) {
          ingredients['Otros'].add(capitalizeFirst(ingredient));
        }
      }
    });

    // Convertir a formato de categorías
    return Object.entries(ingredients)
      .filter(([_, items]) => items.size > 0)
      .map(([name, items]) => ({
        name,
        items: Array.from(items).map(item => ({ name: item }))
      }));
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
                    className={`flex-1 text-sm cursor-pointer ${
                      checkedItems.has(item.name) ? "line-through text-muted-foreground" : ""
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

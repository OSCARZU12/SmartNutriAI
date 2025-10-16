import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  {
    name: "Proteínas",
    items: ["Pechuga de pollo (500g)", "Salmón fresco (300g)", "Huevos (12 unidades)", "Yogurt griego (500g)"]
  },
  {
    name: "Frutas y Verduras",
    items: ["Espinacas (1 bolsa)", "Tomates cherry (250g)", "Aguacate (3 unidades)", "Plátanos (6 unidades)", "Manzanas (4 unidades)"]
  },
  {
    name: "Granos y Cereales",
    items: ["Quinoa (500g)", "Avena (1 kg)", "Pan integral (1 paquete)", "Arroz integral (1 kg)"]
  },
  {
    name: "Otros",
    items: ["Aceite de oliva", "Almendras (200g)", "Miel", "Especias variadas"]
  }
];

export default function ShoppingList() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (item: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(item)) {
      newChecked.delete(item);
    } else {
      newChecked.add(item);
    }
    setCheckedItems(newChecked);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <h3 className="font-semibold">Lista de Compras</h3>
        <Button variant="outline" size="sm" data-testid="button-export-list">
          <ShoppingCart className="mr-2 h-4 w-4" />
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
                    checked={checkedItems.has(item)}
                    onCheckedChange={() => toggleItem(item)}
                    data-testid={`checkbox-item-${catIdx}-${itemIdx}`}
                  />
                  <label
                    htmlFor={`item-${catIdx}-${itemIdx}`}
                    className={`flex-1 text-sm cursor-pointer ${
                      checkedItems.has(item) ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {item}
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

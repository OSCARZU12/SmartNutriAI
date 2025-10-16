import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const mockWeekData = [
  { day: "Lun", date: 15, calories: 1850, status: "completed" },
  { day: "Mar", date: 16, calories: 1920, status: "completed" },
  { day: "Mié", date: 17, calories: 1800, status: "completed" },
  { day: "Jue", date: 18, calories: 1850, status: "today" },
  { day: "Vie", date: 19, calories: 1900, status: "upcoming" },
  { day: "Sáb", date: 20, calories: 1850, status: "upcoming" },
  { day: "Dom", date: 21, calories: 1800, status: "upcoming" }
];

export default function MealPlanCalendar() {
  const [weekOffset, setWeekOffset] = useState(0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <h3 className="font-semibold">Plan Semanal</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setWeekOffset(prev => prev - 1)} data-testid="button-week-prev">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[100px] text-center">Semana Actual</span>
          <Button variant="outline" size="icon" onClick={() => setWeekOffset(prev => prev + 1)} data-testid="button-week-next">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {mockWeekData.map((day, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg text-center cursor-pointer transition-all ${
              day.status === "today"
                ? "bg-primary text-primary-foreground"
                : day.status === "completed"
                ? "bg-muted hover-elevate"
                : "bg-background border hover-elevate"
            }`}
            data-testid={`calendar-day-${idx}`}
          >
            <div className="text-xs font-medium mb-1">{day.day}</div>
            <div className="text-lg font-bold font-mono mb-1">{day.date}</div>
            <Badge variant={day.status === "today" ? "secondary" : "outline"} className="text-xs font-mono">
              {day.calories}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

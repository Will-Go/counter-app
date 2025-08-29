"use client";

import { useState } from "react";
import { Minus, Plus, Edit3, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Counter } from "@/types/counter";

interface CounterCardProps {
  counter: Counter;
  onUpdate: (id: string, updates: Partial<Counter>) => void;
  onDelete: (id: string) => void;
}

export function CounterCard({ counter, onUpdate, onDelete }: CounterCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(counter.name);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: counter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleNameSave = () => {
    if (editName.trim()) {
      onUpdate(counter.id, { name: editName.trim() });
    } else {
      setEditName(counter.name);
    }
    setIsEditing(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameSave();
    } else if (e.key === "Escape") {
      setEditName(counter.name);
      setIsEditing(false);
    }
  };

  const increment = () => {
    onUpdate(counter.id, { count: counter.count + 1 });
  };

  const decrement = () => {
    onUpdate(counter.id, { count: counter.count - 1 });
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(counter.id);
    }, 300); // Match the transition duration
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`w-full max-w-md mx-auto bg-card/60 border-border backdrop-blur-sm z-40 relative transition-all duration-300 ease-out ${
        isDragging ? "opacity-50 shadow-2xl z-50" : ""
      } ${
        isDeleting ? "opacity-0 scale-95 transform" : "opacity-100 scale-100"
      }`}
    >
      <div
        className="absolute top-1 sm:top-2 left-1 sm:left-2 p-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-3 w-3 sm:h-4 sm:w-4" />
      </div>
      <CardContent className="p-4 sm:p-6 group">
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          {isEditing ? (
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={handleNameKeyDown}
              className="text-center font-medium text-base sm:text-lg bg-background border-border focus:border-primary"
              autoFocus
            />
          ) : (
            <div
              className=" relative flex items-center gap-1 sm:gap-2 cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              <h3 className="text-base sm:text-lg font-medium hover:text-primary transition-colors">
                {counter.name}
              </h3>
              <Edit3 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity" />
            </div>
          )}

          <div className="flex items-center space-x-4 sm:space-x-6">
            <Button
              variant="outline"
              size="icon"
              onClick={decrement}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-border hover:border-primary hover:bg-primary/10"
            >
              <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <div className="text-3xl sm:text-4xl font-bold min-w-[60px] sm:min-w-[80px] text-center">
              {counter.count}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={increment}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-border hover:border-primary hover:bg-primary/10"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-muted-foreground hover:text-destructive text-xs sm:text-sm"
            disabled={isDeleting}
          >
            Borrar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

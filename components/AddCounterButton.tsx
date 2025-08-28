"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddCounterButtonProps {
  onAdd: () => void;
}

export function AddCounterButton({ onAdd }: AddCounterButtonProps) {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50!">
      <Button
        onClick={onAdd}
        size="lg"
        className="group rounded-full h-14 w-14 shadow-lg z-50! bg-accent-500/60! backdrop-blur-sm  text-white hover:shadow-xl transition-all duration-200   hover:scale-125"
      >
        <Plus className="h-6 w-6 group-hover:scale-125" />
      </Button>
    </div>
  );
}

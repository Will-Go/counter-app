"use client";

import { useCallback, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useLocalStorage } from "@/hooks/localStorage";
import { CounterCard } from "@/components/CounterCard";
import { AddCounterButton } from "@/components/AddCounterButton";
import { Counter } from "@/types/counter";
import {
  Edit3,
  Loader2,
  RotateCcw,
  Trash2,
  Download,
  Sun,
  Moon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog";
import { exportCountersToPDF } from "@/lib/pdfExport";

export default function Home() {
  const {
    value: counters,
    setValue: setCounters,
    loading,
  } = useLocalStorage<Counter[]>("counters", []);

  const { value: title, setValue: setTitle } = useLocalStorage<string>(
    "app-title",
    "Counter X"
  );

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState("");

  const { value: isDarkMode, setValue: setIsDarkMode } =
    useLocalStorage<boolean>("theme-dark", true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addCounter = useCallback(() => {
    const currentCounters = counters || [];
    const newCounter: Counter = {
      id: uuidv4(),
      name: `Contador ${currentCounters.length + 1}`,
      count: 0,
    };
    setCounters([...currentCounters, newCounter]);
  }, [counters, setCounters]);

  const updateCounter = useCallback(
    (id: string, updates: Partial<Counter>) => {
      const currentCounters = counters || [];
      const updatedCounters = currentCounters.map((counter) =>
        counter.id === id ? { ...counter, ...updates } : counter
      );
      setCounters(updatedCounters);
    },
    [counters, setCounters]
  );

  const deleteCounter = useCallback(
    (id: string) => {
      const currentCounters = counters || [];
      const filteredCounters = currentCounters.filter(
        (counter) => counter.id !== id
      );
      setCounters(filteredCounters);
    },
    [counters, setCounters]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        const currentCounters = counters || [];
        const oldIndex = currentCounters.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = currentCounters.findIndex(
          (item) => item.id === over?.id
        );

        setCounters(arrayMove(currentCounters, oldIndex, newIndex));
      }
    },
    [counters, setCounters]
  );

  const handleTitleEdit = () => {
    setEditTitleValue(title || "Titulo");
    setIsEditingTitle(true);
  };

  const handleTitleSave = () => {
    if (editTitleValue.trim()) {
      setTitle(editTitleValue.trim());
    } else {
      setEditTitleValue(title || "Titulo");
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSave();
    } else if (e.key === "Escape") {
      setEditTitleValue(title || "Counter X");
      setIsEditingTitle(false);
    }
  };

  const resetAllCounts = useCallback(() => {
    const currentCounters = counters || [];
    const resetCounters = currentCounters.map((counter) => ({
      ...counter,
      count: 0,
    }));
    setCounters(resetCounters);
  }, [counters, setCounters]);

  const removeAllCounters = useCallback(() => {
    setCounters([]);
  }, [setCounters]);

  const handleExportPDF = useCallback(async () => {
    if (!counters || counters.length === 0) return;

    const result = await exportCountersToPDF(counters, title || "Counter X");
    if (!result.success) {
      console.error("Failed to export PDF:", result.error);
    }
  }, [counters, title]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(!isDarkMode);
  }, [isDarkMode, setIsDarkMode]);

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [isDarkMode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background p-4 pb-24">
      {/* Animated background */}
      <div className="bg-accent-800 animate-pulse absolute -top-6 left-1/2 h-[300px] w-[300px] -translate-x-1/2 translate-y-1/2 transform rounded-full opacity-30 blur-[500px] sm:h-[600px] sm:w-[600px] sm:blur-[150px] md:h-[300px] md:w-[650px]" />

      <div className="max-w-4xl mx-auto z-50!">
        {/* Theme Toggle */}
        <div>
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm border-border hover:bg-accent hover:text-accent-foreground"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 mr-2" />
            ) : (
              <Moon className="h-4 w-4 mr-2" />
            )}
            <span className="text-sm">
              {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
            </span>
          </Button>
        </div>

        <header className="text-center py-4 mb-12">
          {isEditingTitle ? (
            <Input
              value={editTitleValue}
              onChange={(e) => setEditTitleValue(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={handleTitleKeyDown}
              className="text-center text-4xl sm:text-6xl font-bold bg-transparent border-none ring-0 rounded-none h-fit text-foreground max-w-sm sm:max-w-2xl mx-auto mb-2"
              autoFocus
            />
          ) : (
            <div
              className="group relative inline-flex items-center gap-2 sm:gap-3 cursor-pointer mb-2"
              onClick={handleTitleEdit}
            >
              <h1 className="text-4xl sm:text-6xl font-bold text-foreground hover:text-primary transition-colors">
                {title || "Titulo"}
              </h1>
              <Edit3 className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
          )}
          <p className="text-muted-foreground">
            Administra tus cuentas con facilidad
          </p>

          {/* Action buttons */}
          {counters && counters.length > 0 && (
            <div className=" md:fixed bottom-4 mt-4 right-2 sm:right-4 flex  flex-col gap-2 z-50 fade-in transition-all duration-300">
              <Button
                onClick={handleExportPDF}
                variant="outline"
                size="sm"
                className="bg-background/80 w-full min-w-[140px] sm:min-w-[160px] backdrop-blur-sm border-border hover:bg-gold-500 hover:text-gold-900"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Exportar PDF</span>
              </Button>
              <ConfirmationDialog
                title="Reiniciar Contadores"
                content="¿Estás seguro de que quieres reiniciar todos los contadores a 0? Esta acción no se puede deshacer."
                confirmText="Reiniciar"
                cancelText="Cancelar"
                isDanger={false}
                onConfirm={resetAllCounts}
                onCancel={() => {}}
                className="w-full!"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-background/80 w-full min-w-[140px] sm:min-w-[160px] backdrop-blur-sm border-border hover:bg-accent hover:text-accent-foreground"
                >
                  <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">Reiniciar</span>
                </Button>
              </ConfirmationDialog>
              <ConfirmationDialog
                title="Borrar Todo"
                content="¿Estás seguro de que quieres eliminar todos los contadores? Esta acción no se puede deshacer."
                confirmText="Borrar Todo"
                cancelText="Cancelar"
                isDanger={true}
                onConfirm={removeAllCounters}
                onCancel={() => {}}
                className="w-full!"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-background/80 w-full min-w-[140px] sm:min-w-[160px] backdrop-blur-sm border-border hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">
                    Borrar Todo{" "}
                    {counters.length > 0 ? `(${counters.length})` : ""}
                  </span>
                </Button>
              </ConfirmationDialog>
            </div>
          )}
        </header>

        {counters && counters.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={counters.map((counter) => counter.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {counters.map((counter) => (
                  <CounterCard
                    key={counter.id}
                    counter={counter}
                    onUpdate={updateCounter}
                    onDelete={deleteCounter}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Aún no hay cuentas</p>
            <p className="text-sm text-muted-foreground">
              Haz clic en el botón + para agregar tu primera cuenta
            </p>
          </div>
        )}
      </div>

      <AddCounterButton onAdd={addCounter} />

      {/* Copyright */}
      <div className="fixed bottom-4 left-2 sm:left-4 z-40">
        <p className="text-xs text-muted-foreground/60">
          {" "}
          &copy; {new Date().getFullYear()}
        </p>
        <p className="text-xs text-muted-foreground/60">made by Will-go</p>
      </div>
    </div>
  );
}

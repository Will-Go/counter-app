import { Button } from "@/components/ui/button";
import {
  Dialog as DialogRoot,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface DialogProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  submitText?: string;
  cancelText?: string;
  width?: "xs" | "sm" | "md" | "lg" | "xl" | "4xl";
  isDanger?: boolean; // true for positive (e.g., save), false for negative (e.g., delete)
  className?: string; // Optional className for additional styling
}

export default function Dialog({
  title,
  description,
  children,
  open,
  setOpen,
  onSubmit,
  onCancel,
  submitText = "Aceptar",
  cancelText = "Cancelar",
  width = "md",
  isDanger = false, // true for positive (e.g., save), false for negative (e.g., delete)
  className,
}: DialogProps) {
  const widthClasses = {
    xs: "sm:max-w-xs",
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "4xl": "sm:max-w-4xl",
  };

  return (
    <DialogRoot open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          "max-h-[98vh] flex flex-col ",
          widthClasses[width],
          className
        )}
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle
            className={isDanger ? "text-destructive" : "text-secondary-500"}
          >
            {title}
          </DialogTitle>

          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          {children}
        </div>
        {(onSubmit || onCancel) && (
          <DialogFooter className="flex-shrink-0 mt-4">
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                className={cn(
                  "min-w-[100px]",
                  isDanger
                    ? "border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive hover:text-destructive focus:ring-destructive/20"
                    : "hover:bg-accent"
                )}
              >
                {cancelText}
              </Button>
            )}
            {onSubmit && (
              <Button
                variant={isDanger ? "destructive" : "default"}
                type="submit"
                onClick={onSubmit}
                className={cn("min-w-[100px]")}
              >
                {submitText}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </DialogRoot>
  );
}

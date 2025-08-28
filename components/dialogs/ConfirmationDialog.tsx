"use client";

import React, { ElementType, useEffect, useState } from "react";

import Dialog from "./Dialog";
import { cn } from "@/lib/utils";

interface ConfirmationDialogProps<T extends ElementType = "span"> {
  title: string;
  content: string;
  confirmText: string;
  cancelText: string;
  isDanger?: boolean; // true for positive (e.g., save), false for negative (e.g., delete)
  disabled?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
  isOpen?: boolean | null; // THIS IS TO MAKE THIS COMPONENT TRIGGERABLE,
  as?: T;
  className?: string;
}

const ConfirmationDialog = <T extends ElementType = "span">({
  title,
  content,
  confirmText,
  cancelText,
  isDanger = false, // true for positive (e.g., save), false for negative (e.g., delete)
  disabled = false,
  onConfirm,
  onCancel,
  children,
  isOpen = null,
  as,
  className,
}: ConfirmationDialogProps<T>) => {
  const Component = as ?? "span";
  const [open, setOpen] = useState(false);

  const handleClickOpen = (e: React.MouseEvent) => {
    if (disabled || isOpen !== null) return;

    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    if (disabled) return;
    onCancel();
    if (isOpen !== null) return;
    setOpen(false);
  };

  const handleConfirm = () => {
    onConfirm();
    if (isOpen !== null) return;
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (isOpen !== null) return; // Don't control state if externally controlled

    if (!newOpen) {
      handleClose();
    } else {
      setOpen(newOpen);
    }
  };

  useEffect(() => {
    if (isOpen === null) return;
    setOpen(isOpen);
  }, [isOpen]);

  const effectiveOpen = isOpen !== null ? isOpen : open;

  return (
    <>
      <Component
        className={cn("cursor-pointer", className)}
        onClick={handleClickOpen}
      >
        {children}
      </Component>
      <Dialog
        open={effectiveOpen}
        setOpen={handleOpenChange}
        title={title}
        description={content}
        onSubmit={handleConfirm}
        onCancel={handleClose}
        submitText={confirmText}
        cancelText={cancelText}
        width="sm"
        isDanger={isDanger}
      />
    </>
  );
};

export default ConfirmationDialog;

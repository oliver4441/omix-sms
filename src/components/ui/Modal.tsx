"use client";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showClose?: boolean;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[95vw] max-h-[90vh]",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showClose = true,
}: ModalProps) {
  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div
            className={cn(
              "relative w-full glass rounded-2xl glow-sm overflow-hidden",
              sizeClasses[size]
            )}
          >
            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                {title && (
                  <h2 className="text-lg font-semibold text-white">{title}</h2>
                )}
                {showClose && (
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-gray-400 hover:text-gray-200 transition-all ml-auto"
                  >
                    <Icon name="X" className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
          </div>
        </div>
      ) : null;
}

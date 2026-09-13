"use client";

import React, { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

type DialogSize = "sm" | "md" | "lg" | "xl";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: DialogSize;
  /** Render without the standard title bar (the caller supplies its own header). */
  bare?: boolean;
  variant?: "default" | "fullscreen";
}

const SIZE_CLASS: Record<DialogSize, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

const supportsClosedBy = () =>
  typeof HTMLDialogElement !== "undefined" && "closedBy" in HTMLDialogElement.prototype;

/**
 * Modal built on the native <dialog> element: opened with showModal() so it sits
 * in the top layer, traps focus, closes on Esc / platform back gestures, and
 * light-dismisses on backdrop click (closedby="any", with a click fallback for
 * browsers that don't support it yet).
 */
export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  bare = false,
  variant = "default",
}) => {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => onCloseRef.current();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (supportsClosedBy() || e.target !== e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const inside =
      rect.top <= e.clientY && e.clientY <= rect.bottom && rect.left <= e.clientX && e.clientX <= rect.right;
    if (!inside) e.currentTarget.close();
  };

  return (
    <dialog
      ref={ref}
      {...{ closedby: "any" }}
      data-variant={variant}
      aria-labelledby={bare ? undefined : titleId}
      aria-label={bare && typeof title === "string" ? title : undefined}
      aria-describedby={description ? descId : undefined}
      onClick={handleBackdropClick}
      className={`ui-dialog ${variant === "default" ? SIZE_CLASS[size] : ""}`}
    >
      {open && (
        <>
          {!bare && (
            <header className="flex items-start justify-between gap-4 border-b border-hairline px-6 py-4">
              <div className="min-w-0">
                <h2 id={titleId} className="text-base font-semibold text-ink">
                  {title}
                </h2>
                {description && (
                  <p id={descId} className="mt-0.5 text-sm text-muted">
                    {description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => ref.current?.close()}
                className="-mr-2 shrink-0 rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-ink cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </header>
          )}
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          {footer && <footer className="border-t border-hairline px-6 py-4">{footer}</footer>}
        </>
      )}
    </dialog>
  );
};

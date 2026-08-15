import { forwardRef, type TextareaHTMLAttributes } from "react";
import clsx from "clsx";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs text-text/70">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          rows={3}
          className={clsx(
            "w-full resize-none rounded-md border border-divider bg-surface px-2.5 py-1.5 text-sm text-text placeholder:text-text/40 outline-none hover:border-text/45 focus-visible:border-accent",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

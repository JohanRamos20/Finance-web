import { forwardRef, type InputHTMLAttributes } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs text-text/70">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            "min-h-9 w-full rounded-md border border-divider bg-surface px-2.5 py-1.5 text-sm text-text placeholder:text-text/40 outline-none hover:border-text/45 focus-visible:border-accent",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = "Input";

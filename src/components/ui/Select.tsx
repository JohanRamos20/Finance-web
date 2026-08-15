import { forwardRef, type SelectHTMLAttributes } from "react";
import clsx from "clsx";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, className, id, children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs text-text/70">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={clsx(
            "min-h-9 w-full rounded-md border border-divider bg-surface px-2.5 py-1.5 text-sm text-text outline-none hover:border-text/45 focus-visible:border-accent",
            className,
          )}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  },
);

Select.displayName = "Select";

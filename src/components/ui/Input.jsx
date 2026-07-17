import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="mb-1.5 block text-sm text-upnext-muted">{label}</label>}
      <input
        ref={ref}
        className={`w-full rounded-xl border bg-upnext-surface px-4 py-3 text-upnext-text outline-none transition-colors placeholder:text-upnext-muted focus:border-upnext-primary ${
          error ? 'border-red-500' : 'border-upnext-border'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
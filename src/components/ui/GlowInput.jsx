// GlowInput.jsx
import { forwardRef, useState } from 'react';

const GlowInput = forwardRef(({ error, className = '', ...props }, ref) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="w-full">
      <div
        className="rounded-xl p-[1px] transition-all duration-300"
        style={{
          background: focused
            ? 'linear-gradient(90deg, #a78bfa, #fbbf24, #a78bfa)'
            : 'rgba(255,255,255,0.08)',
          boxShadow: focused ? '0 0 20px rgba(167,139,250,0.35)' : 'none',
        }}
      >
        <input
          ref={ref}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full rounded-xl bg-black/40 px-4 py-3 text-upnext-text outline-none placeholder:text-upnext-muted ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
});

GlowInput.displayName = 'GlowInput';
export default GlowInput;
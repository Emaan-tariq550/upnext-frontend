import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRopePhysics } from '../../hooks/useRopePhysics';

export default function Lamp({ isLit, onPull }) {
  const { ropeRef, swingIdle, handlePointerDown, handlePointerMove, handlePointerUp } = useRopePhysics({
    onPulled: onPull,
  });

  useEffect(() => {
    swingIdle();
  }, [swingIdle]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Cable from ceiling */}
      <div className="h-24 w-px bg-neutral-700" />

      {/* Lamp fixture */}
      <motion.div
        animate={{ rotate: isLit ? [0, 2, -2, 0] : 0 }}
        transition={{ repeat: isLit ? Infinity : 0, duration: 4, ease: 'easeInOut' }}
        style={{ transformOrigin: 'top center' }}
        className="relative"
      >
        <div className="h-3 w-3 rounded-full bg-neutral-600" />
        <div
          className={`relative -mt-1 h-16 w-24 rounded-b-full transition-colors duration-700 ${
            isLit ? 'bg-amber-100' : 'bg-neutral-800'
          }`}
          style={{
            boxShadow: isLit
              ? '0 0 120px 60px rgba(251,191,36,0.35), 0 0 300px 150px rgba(251,191,36,0.15)'
              : 'none',
          }}
        />
        {isLit && (
          <div
            className="absolute left-1/2 top-full h-[80vh] w-[60vw] -translate-x-1/2 opacity-90"
            style={{
              background:
                'radial-gradient(ellipse at top, rgba(251,191,36,0.25) 0%, transparent 65%)',
            }}
          />
        )}
      </motion.div>

      {/* Pull rope */}
      {!isLit && (
        <div
          ref={ropeRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="mt-1 flex cursor-grab flex-col items-center active:cursor-grabbing"
          style={{ touchAction: 'none' }}
        >
          <div className="h-32 w-px bg-neutral-600" />
          <div className="h-4 w-4 rounded-full bg-neutral-500" />
        </div>
      )}
    </div>
  );
}
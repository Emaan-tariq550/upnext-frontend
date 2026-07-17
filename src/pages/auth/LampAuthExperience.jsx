import { useState } from 'react';
import { motion } from 'framer-motion';
import Lamp from '../../components/auth/Lamp';
import DustParticles from '../../components/auth/DustParticles';
import AuthFormCard from '../../components/auth/AuthFormCard';

export default function LampAuthExperience() {
  const [isLit, setIsLit] = useState(false);
  const [mode, setMode] = useState('login');

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {/* Room ambient reveal */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          background: isLit
            ? 'radial-gradient(ellipse at center 30%, rgba(30,25,15,0.9) 0%, #000 70%)'
            : '#000',
        }}
        transition={{ duration: 1.2 }}
      />

      <DustParticles visible={isLit} />

      <div className="relative z-10 flex flex-col items-center gap-10 px-4">
        <Lamp isLit={isLit} onPull={() => setIsLit(true)} />

        {!isLit && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-sm text-neutral-500"
          >
            Pull the rope
          </motion.p>
        )}

        <AuthFormCard isLit={isLit} mode={mode} setMode={setMode} />
      </div>
    </div>
  );
}
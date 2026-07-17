import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

export default function AnimatedCounter({ value = 0, duration = 1 }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest).toLocaleString());
  const prevValue = useRef(value);

  useEffect(() => {
    const controls = animate(motionValue, value, { duration, ease: 'easeOut' });
    prevValue.current = value;
    return controls.stop;
  }, [value, duration, motionValue]);

  return <motion.span>{rounded}</motion.span>;
}
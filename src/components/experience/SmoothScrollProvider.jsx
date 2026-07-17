import { useEffect, useRef } from 'react';
import { initLenis, destroyLenis } from '../../lib/lenis';

export default function SmoothScrollProvider({ children }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return undefined;
    initialized.current = true;

    initLenis();

    return () => {
      destroyLenis();
      initialized.current = false;
    };
  }, []);

  return children;
}
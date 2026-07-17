import Lenis from 'lenis';
import gsap from 'gsap';

let lenisInstance = null;
let rafCallback = null;

export function initLenis() {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  rafCallback = (time) => {
    if (lenisInstance) {
      lenisInstance.raf(time * 1000);
    }
  };

  gsap.ticker.add(rafCallback);
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function destroyLenis() {
  if (rafCallback) {
    gsap.ticker.remove(rafCallback);
    rafCallback = null;
  }

  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

export function getLenis() {
  return lenisInstance;
}
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import AuroraBackground from '../experience/AuroraBackground';
import ParticleField from '../experience/ParticleField';

export default function Hero() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const chars = titleRef.current.querySelectorAll('.char');
    gsap.fromTo(
      chars,
      { y: 80, opacity: 0, rotateX: -90 },
      { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.03, ease: 'power4.out', delay: 0.3 }
    );

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      gsap.to(containerRef.current, { x, y, duration: 1, ease: 'power2.out' });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const titleText = 'UPNEXT';

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <AuroraBackground />
      <ParticleField />

      <div ref={containerRef} className="relative z-10 flex flex-col items-center px-4 text-center">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-full border border-upnext-border bg-upnext-surface/60 px-4 py-1.5 text-sm text-upnext-muted backdrop-blur-md"
        >
          The multiplayer fame game has arrived
        </motion.span>

        <h1
          ref={titleRef}
          className="font-display text-[18vw] font-black leading-none tracking-tight text-upnext-text md:text-[12vw]"
          style={{ perspective: 800 }}
        >
          {titleText.split('').map((char, i) => (
            <span
              key={i}
              className="char inline-block bg-gradient-to-b from-white via-white to-upnext-primary-glow bg-clip-text text-transparent"
              style={{ textShadow: '0 0 80px rgba(167,139,250,0.4)' }}
            >
              {char}
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-6 max-w-xl text-lg text-upnext-muted md:text-xl"
        >
          Become The Name Everyone Knows.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-10 flex gap-4"
        >
          <Link
            to="/enter"
            data-cursor-hover
            className="group flex items-center gap-2 rounded-full bg-upnext-primary px-8 py-4 font-semibold text-black transition-transform hover:scale-105"
          >
            Enter The Game
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
          
          {/* FIXED HERE: Yahan <a> tag lagaya hai jo pehle missing tha */}
          <a
            href="#features"
            data-cursor-hover
            className="rounded-full border border-upnext-border px-8 py-4 font-semibold text-upnext-text backdrop-blur-md transition-colors hover:bg-upnext-surface"
          >
            Explore
          </a>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 text-upnext-muted"
      >
        <div className="h-10 w-6 rounded-full border-2 border-upnext-border">
          <div className="mx-auto mt-2 h-2 w-1 rounded-full bg-upnext-primary" />
        </div>
      </motion.div>
    </section>
  );
}
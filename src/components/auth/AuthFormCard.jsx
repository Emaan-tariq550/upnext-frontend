import { AnimatePresence, motion } from 'framer-motion';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 40, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.6 },
  },
};

const formSwitchVariants = {
  enter: { opacity: 0, rotateY: 90, scale: 0.95 },
  center: { opacity: 1, rotateY: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, rotateY: -90, scale: 0.95, transition: { duration: 0.35, ease: 'easeIn' } },
};

export default function AuthFormCard({ isLit, mode, setMode }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate={isLit ? 'visible' : 'hidden'}
      className="relative z-20 w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
      style={{ perspective: 1000 }}
    >
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-upnext-primary-glow">UPNEXT</h1>
        <p className="mt-1 text-sm text-upnext-muted">
          {mode === 'login' ? 'The room remembers you.' : 'Step into the light.'}
        </p>
      </div>

      <div style={{ transformStyle: 'preserve-3d' }}>
        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            <motion.div key="login" variants={formSwitchVariants} initial="enter" animate="center" exit="exit">
              <LoginForm />
            </motion.div>
          ) : (
            <motion.div key="signup" variants={formSwitchVariants} initial="enter" animate="center" exit="exit">
              <SignupForm />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        data-cursor-hover
        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
        className="mt-6 w-full text-center text-sm text-upnext-muted transition-colors hover:text-upnext-primary"
      >
        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <span className="font-medium text-upnext-primary">{mode === 'login' ? 'Sign up' : 'Log in'}</span>
      </button>
    </motion.div>
  );
}
import { create } from 'zustand';

const useCelebrationStore = create((set) => ({
  activeCelebration: null,

  celebrate: (payload) => {
    set({ activeCelebration: { ...payload, id: Date.now() } });
    setTimeout(() => set({ activeCelebration: null }), 2500);
  },
}));

export default useCelebrationStore;
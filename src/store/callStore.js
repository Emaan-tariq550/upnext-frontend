import { create } from 'zustand';

const useCallStore = create((set) => ({
  incomingCall: null,

  setIncomingCall: (call) => set({ incomingCall: call }),
  clearIncomingCall: () => set({ incomingCall: null }),
}));

export default useCallStore;
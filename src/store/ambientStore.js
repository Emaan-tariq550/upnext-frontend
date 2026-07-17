import { create } from 'zustand';

const STORAGE_KEY = 'upnext_ambient_prefs';

function loadPrefs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { weather: null, soundEnabled: false };
  } catch {
    return { weather: null, soundEnabled: false };
  }
}

const useAmbientStore = create((set, get) => ({
  weather: loadPrefs().weather,
  soundEnabled: loadPrefs().soundEnabled,

  setWeather: (weather) => {
    set({ weather });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...loadPrefs(), weather }));
  },

  toggleSound: () => {
    const next = !get().soundEnabled;
    set({ soundEnabled: next });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...loadPrefs(), soundEnabled: next }));
  },
}));

export default useAmbientStore;
import GlassCard from '../ui/GlassCard';
import useAmbientStore from '../../store/ambientStore';

const WEATHER_OPTIONS = [
  { key: null, label: 'None' },
  { key: 'rain', label: 'Rain' },
  { key: 'snow', label: 'Snow' },
  { key: 'fireflies', label: 'Fireflies' },
];

export default function AmbientSettings() {
  const weather = useAmbientStore((s) => s.weather);
  const setWeather = useAmbientStore((s) => s.setWeather);
  const soundEnabled = useAmbientStore((s) => s.soundEnabled);
  const toggleSound = useAmbientStore((s) => s.toggleSound);

  return (
    <GlassCard>
      <h2 className="mb-4 font-semibold">Ambient Experience</h2>

      <p className="mb-2 text-sm text-upnext-muted">Background effect</p>
      <div className="mb-6 flex flex-wrap gap-2">
        {WEATHER_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            data-cursor-hover
            onClick={() => setWeather(opt.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              weather === opt.key ? 'bg-upnext-primary text-black' : 'border border-upnext-border text-upnext-muted hover:text-upnext-text'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-upnext-muted">Ambient sound</p>
        <button
          data-cursor-hover
          onClick={toggleSound}
          className={`h-6 w-11 rounded-full p-1 transition-colors ${soundEnabled ? 'bg-upnext-primary' : 'bg-upnext-border'}`}
        >
          <div
            className={`h-4 w-4 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-5' : 'translate-x-0'}`}
          />
        </button>
      </div>
    </GlassCard>
  );
}
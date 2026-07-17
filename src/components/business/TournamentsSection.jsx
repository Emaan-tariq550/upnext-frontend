import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiPlus, FiUsers, FiCalendar } from 'react-icons/fi';
import GlassCard from '../ui/GlassCard';
import GlowButton from '../ui/GlowButton';
import { tournamentApi } from '../../api/tournamentApi';
import CreateTournamentModal from './CreateTournamentModal';

const STATUS_COLORS = {
  upcoming: 'bg-blue-500/20 text-blue-400',
  ongoing: 'bg-green-500/20 text-green-400',
  completed: 'bg-upnext-border text-upnext-muted',
  cancelled: 'bg-red-500/20 text-red-400',
};

export default function TournamentsSection({ businessId, canManage }) {
  const [showCreate, setShowCreate] = useState(false);

  const { data: tournaments, isLoading } = useQuery({
    queryKey: ['businessTournaments', businessId],
    queryFn: () => tournamentApi.listByBusiness(businessId).then((r) => r.data.data),
  });

  return (
    <GlassCard>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Tournaments</h2>
        {canManage && (
          <button
            onClick={() => setShowCreate(true)}
            data-cursor-hover
            className="flex items-center gap-1.5 text-sm text-upnext-primary hover:text-upnext-primary-dark"
          >
            <FiPlus className="h-4 w-4" /> New Tournament
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-upnext-muted">Loading tournaments...</p>
      ) : tournaments?.length === 0 ? (
        <p className="text-sm text-upnext-muted">Abhi koi tournament nahi hai.</p>
      ) : (
        <div className="space-y-3">
          {tournaments?.map((t) => (
            <Link
              key={t._id}
              to={`/tournaments/${t._id}`}
              data-cursor-hover
              className="flex items-center justify-between rounded-xl bg-white/5 p-4 hover:bg-white/10 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[t.status]}`}>
                    {t.status}
                  </span>
                  <h3 className="font-medium">{t.title}</h3>
                </div>
                <p className="mt-1 text-xs text-upnext-muted">{t.game}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-upnext-muted">
                <span className="flex items-center gap-1">
                  <FiUsers /> {t.participants?.length ?? 0}/{t.maxParticipants}
                </span>
                <span className="flex items-center gap-1">
                  <FiCalendar /> {new Date(t.startTime).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <CreateTournamentModal open={showCreate} onClose={() => setShowCreate(false)} businessId={businessId} />
    </GlassCard>
  );
}
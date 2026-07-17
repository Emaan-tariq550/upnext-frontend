import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  FiUserPlus, 
  FiUserCheck, 
  FiZap, 
  FiEdit2, 
  FiCalendar, 
  FiLink, 
  FiMessageSquare 
} from 'react-icons/fi';
import { FiUserPlus as FiFriendAdd } from 'react-icons/fi';
import GlassCard from '../components/ui/GlassCard';
import Skeleton from '../components/ui/Skeleton';
import AvatarUploader from '../components/ui/AvatarUploader';
import CoverUploader from '../components/ui/CoverUploader';
import { userApi } from '../api/userApi';
import { followApi, friendApi } from '../api/socialApi';
import { chatApi } from '../api/chatApi';
import useAuthStore from '../store/authStore';

export default function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate(); // FIX: Component ke andar standard react-router pattern me move kiya
  const currentUser = useAuthStore((s) => s.user);
  const targetId = userId || currentUser?._id;
  const queryClient = useQueryClient();
  const isOwnProfile = targetId === currentUser?._id;

  // 1. Core Profile Query
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', targetId],
    queryFn: () => userApi.getProfile(targetId).then((r) => r.data.data),
    enabled: !!targetId,
  });

  // 2. Social Status Query
  const { data: followStatus } = useQuery({
    queryKey: ['followStatus', targetId],
    queryFn: () => followApi.checkStatus(targetId).then((r) => r.data.data),
    enabled: !!targetId && !isOwnProfile,
  });

  // 3. Social & Engagement Mutations
  const followMutation = useMutation({
    mutationFn: () => (followStatus?.isFollowing ? followApi.unfollow(targetId) : followApi.follow(targetId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followStatus', targetId] });
      queryClient.invalidateQueries({ queryKey: ['profile', targetId] });
      toast.success(followStatus?.isFollowing ? 'Unfollowed' : 'Following now');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Action failed'),
  });

  const friendRequestMutation = useMutation({
    mutationFn: () => friendApi.sendRequest(targetId),
    onSuccess: () => toast.success('Friend request sent'),
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to send request'),
  });

  const messageMutation = useMutation({
    mutationFn: () => chatApi.startPrivate(targetId),
    onSuccess: (res) => {
      navigate('/messages', { state: { conversationId: res.data.data._id } });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to start conversation'),
  });

  // Early Loading State Layout
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard className="relative overflow-hidden">
          {/* Cover Section */}
          {isOwnProfile ? (
            <CoverUploader />
          ) : (
            profile?.coverUrl && (
              <div className="h-40 w-full overflow-hidden rounded-2xl sm:h-56">
                <img src={profile.coverUrl} className="h-full w-full object-cover" alt="" />
              </div>
            )
          )}

          {/* Identity Block */}
          <div className="relative flex flex-col gap-6 pt-8 sm:flex-row sm:items-end">
            {isOwnProfile ? (
              <AvatarUploader />
            ) : (
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-upnext-primary/40 bg-upnext-primary/20">
                {profile?.avatarUrl && <img src={profile.avatarUrl} className="h-full w-full object-cover" alt="" />}
              </div>
            )}

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-bold">{profile?.displayName}</h1>
                {profile?.role === 'verified' && (
                  <span className="rounded-full bg-upnext-primary/20 px-2 py-0.5 text-xs font-bold text-upnext-primary">✓ Verified</span>
                )}
              </div>
              <p className="text-sm text-upnext-muted">@{profile?.username}</p>

              {profile?.bio ? (
                <p className="mt-3 max-w-md text-sm text-upnext-text">{profile.bio}</p>
              ) : (
                <p className="mt-3 max-w-md text-sm italic text-upnext-muted">
                  {isOwnProfile ? "You haven't written a bio yet." : 'No bio yet.'}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-upnext-muted">
                {memberSince && (
                  <span className="flex items-center gap-1.5">
                    <FiCalendar className="h-3.5 w-3.5" /> Joined {memberSince}
                  </span>
                )}
                {profile?.country && <span>{profile.country}</span>}
              </div>

              {profile?.socialLinks?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {profile.socialLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor-hover
                      className="flex items-center gap-1 text-xs text-upnext-primary hover:underline"
                    >
                      <FiLink className="h-3 w-3" /> {link.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Actions Panel: Conditionally renders Edit Controls or Full Social Action Grid */}
            {isOwnProfile ? (
              <Link
                to="/settings"
                data-cursor-hover
                className="flex items-center gap-2 self-start rounded-xl border border-upnext-border px-5 py-2.5 text-sm font-medium hover:bg-white/5"
              >
                <FiEdit2 className="h-4 w-4" /> Edit Profile
              </Link>
            ) : (
              /* ADDED: Clean, wrapping action button alignment container */
              <div className="flex flex-wrap gap-2 self-start">
                <button
                  data-cursor-hover
                  onClick={() => followMutation.mutate()}
                  disabled={followMutation.isPending}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium transition-colors ${
                    followStatus?.isFollowing
                      ? 'border border-upnext-border text-upnext-text hover:bg-white/5'
                      : 'bg-upnext-primary text-black hover:bg-upnext-primary-dark'
                  }`}
                >
                  {followStatus?.isFollowing ? <FiUserCheck /> : <FiUserPlus />}
                  {followStatus?.isFollowing ? 'Following' : 'Follow'}
                </button>

                <button
                  data-cursor-hover
                  onClick={() => friendRequestMutation.mutate()}
                  disabled={friendRequestMutation.isPending}
                  className="flex items-center gap-2 rounded-xl border border-upnext-border px-5 py-2.5 font-medium hover:bg-white/5"
                >
                  <FiFriendAdd /> Add Friend
                </button>

                <button
                  data-cursor-hover
                  onClick={() => messageMutation.mutate()}
                  disabled={messageMutation.isPending}
                  className="flex items-center gap-2 rounded-xl border border-upnext-border px-5 py-2.5 font-medium hover:bg-white/5"
                >
                  <FiMessageSquare /> Message
                </button>
              </div>
            )}
          </div>

          {/* Performance Counter Stats Row */}
          <div className="relative mt-8 grid grid-cols-4 gap-4 border-t border-upnext-border pt-6">
            <StatItem icon={FiZap} label="Fame" value={profile?.fameScore} />
            <StatItem label="Followers" value={profile?.followersCount} />
            <StatItem label="Following" value={profile?.followingCount} />
            <StatItem label="Level" value={profile?.level} />
          </div>
        </GlassCard>
      </motion.div>

      {/* Gamification Badges Track */}
      {profile?.badges?.length > 0 && (
        <GlassCard>
          <h2 className="mb-4 font-semibold">Badges</h2>
          <div className="flex flex-wrap gap-3">
            {profile.badges.map((badge) => (
              <div key={badge._id} className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                {badge.iconUrl && <img src={badge.iconUrl} className="h-5 w-5" alt="" />}
                <span className="text-sm">{badge.name}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}

function StatItem({ icon: Icon, label, value }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1">
        {Icon && <Icon className="h-4 w-4 text-upnext-gold" />}
        <p className="font-display text-xl font-bold">{value ?? 0}</p>
      </div>
      <p className="text-xs text-upnext-muted">{label}</p>
    </div>
  );
}
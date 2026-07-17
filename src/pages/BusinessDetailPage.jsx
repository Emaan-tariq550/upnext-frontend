import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiStar, FiUsers, FiDollarSign, FiCheckCircle, FiEdit2, FiDollarSign as FiAddRevenue } from 'react-icons/fi';
import GlassCard from '../components/ui/GlassCard';
import Skeleton from '../components/ui/Skeleton';
import GlowButton from '../components/ui/GlowButton';
import BusinessMediaUploader from '../components/business/BusinessMediaUploader';
import EditBusinessModal from '../components/business/EditBusinessModal';
import AddRevenueModal from '../components/business/AddRevenueModal';
import { businessApi } from '../api/businessApi';
import useAuthStore from '../store/authStore';
import BusinessPostsSection from '../components/business/BusinessPostsSection';
import TournamentsSection from '../components/business/TournamentsSection';

// Naye Imports
import MenuSection from '../components/business/MenuSection';
import CreateMenuItemModal from '../components/business/CreateMenuItemModal';
import OrdersBoard from '../components/business/OrdersBoard';
import ClassScheduleSection from '../components/business/ClassScheduleSection';
import ArcadeSection from '../components/business/ArcadeSection';
import NewsSection from '../components/business/NewsSection';
import StudioSessionsSection from '../components/business/StudioSessionsSection'; 
import TrackShowcaseSection from '../components/business/TrackShowcaseSection';   
import PhotoBookingsSection from '../components/business/PhotoBookingsSection'; 
import PortfolioGallery from '../components/business/PortfolioGallery';         
import EventRequestsSection from '../components/business/EventRequestsSection'; 
import ProductCatalog from '../components/business/ProductCatalog';
import CollectionsSection from '../components/business/CollectionsSection';
import JobBoard from '../components/business/JobBoard';
import ProjectShowcaseSection from '../components/business/ProjectShowcaseSection';
import ServicePackagesSection from '../components/business/ServicePackagesSection';
import CaseStudiesSection from '../components/business/CaseStudiesSection';

export default function BusinessDetailPage() {
  const { businessId } = useParams();
  const currentUser = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  // Dialog / Modal Visibility States
  const [showEdit, setShowEdit] = useState(false);
  const [showRevenue, setShowRevenue] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);

  const { data: business, isLoading } = useQuery({
    queryKey: ['business', businessId],
    queryFn: () => businessApi.getById(businessId).then((r) => r.data.data),
  });

  const { register, handleSubmit, reset } = useForm();

  const followMutation = useMutation({
    mutationFn: () => businessApi.follow(businessId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', businessId] });
      toast.success('Following this business');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Action failed'),
  });

  const reviewMutation = useMutation({
    mutationFn: (payload) => businessApi.addReview(businessId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', businessId] });
      toast.success('Review submitted');
      reset();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Review failed'),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-56" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  const isOwner = business?.owner?._id === currentUser?._id;
  const isEmployee = business?.employees?.some((e) => e.user._id === currentUser?._id);
  
  // Centralized management flag for all business features
  const canManage = isOwner || isEmployee;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard className="relative overflow-hidden">
          {/* Business Cover Layer */}
          {isOwner && (
            <BusinessMediaUploader businessId={businessId} type="cover" currentUrl={business?.coverUrl} />
          )}
          
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(circle at top right, rgba(167,139,250,0.25), transparent 60%)' }}
          />
          
          <div className="relative flex items-start gap-5 pt-4">
            {/* Business Logo Section */}
            {isOwner ? (
              <BusinessMediaUploader businessId={businessId} type="logo" currentUrl={business?.logoUrl} />
            ) : (
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-upnext-primary/20">
                {business?.logoUrl && <img src={business.logoUrl} className="h-full w-full object-cover" alt="" />}
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold">{business?.name}</h1>
                {business?.isVerified && <FiCheckCircle className="text-upnext-primary" />}
              </div>
              <p className="text-sm capitalize text-upnext-muted">{business?.type?.replace(/_/g, ' ')}</p>
              <p className="mt-2 max-w-lg text-sm text-upnext-text">{business?.description}</p>
            </div>

            {/* Context Actions Row */}
            {isOwner ? (
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowEdit(true)} 
                  data-cursor-hover 
                  className="flex items-center gap-2 rounded-xl border border-upnext-border px-4 py-2.5 text-sm hover:bg-white/5 transition-colors"
                >
                  <FiEdit2 /> Edit
                </button>
                <button 
                  onClick={() => setShowRevenue(true)} 
                  data-cursor-hover 
                  className="flex items-center gap-2 rounded-xl bg-upnext-primary px-4 py-2.5 text-sm font-medium text-black hover:bg-upnext-primary-dark transition-colors"
                >
                  <FiAddRevenue /> Add Revenue
                </button>
              </div>
            ) : (
              <GlowButton onClick={() => followMutation.mutate()} isLoading={followMutation.isPending}>
                Follow
              </GlowButton>
            )}
          </div>

          <div className="relative mt-6 grid grid-cols-3 gap-4 border-t border-upnext-border pt-6 sm:grid-cols-4">
            <StatBlock icon={FiUsers} label="Followers" value={business?.followersCount} />
            <StatBlock icon={FiStar} label="Rating" value={business?.averageRating?.toFixed(1)} />
            <StatBlock icon={FiDollarSign} label="Revenue" value={business?.revenue?.toLocaleString()} />
            <StatBlock label="Reviews" value={business?.reviewsCount} />
          </div>
        </GlassCard>
      </motion.div>

      {/* Employees Section */}
      <GlassCard>
        <h2 className="mb-4 font-semibold">Employees</h2>
        <div className="flex flex-wrap gap-3">
          {business?.employees?.map((emp) => (
            <div key={emp.user._id} className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
              <div className="h-7 w-7 overflow-hidden rounded-full bg-upnext-primary/20">
                {emp.user.avatarUrl && <img src={emp.user.avatarUrl} className="h-full w-full object-cover" alt="" />}
              </div>
              <span className="text-sm">{emp.user.displayName}</span>
              <span className="text-xs capitalize text-upnext-muted">({emp.role})</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Music Studio Section */}
      {business?.type === 'music_studio' && (
        <>
          <StudioSessionsSection businessId={businessId} canManage={canManage} />
          <TrackShowcaseSection businessId={businessId} canManage={canManage} />
        </>
      )}

      {/* Photography Studio Section */}
      {business?.type === 'photography_studio' && (
        <>
          <PortfolioGallery businessId={businessId} canManage={canManage} />
          <PhotoBookingsSection businessId={businessId} canManage={canManage} />
        </>
      )}

      {/* Event Company Section */}
      {business?.type === 'event_company' && (
        <EventRequestsSection businessId={businessId} canManage={canManage} />
      )}

      {/* Fitness Club Section */}
      {business?.type === 'fitness_club' && (
        <ClassScheduleSection businessId={businessId} canManage={canManage} />
      )}

      {/* Arcade Section */}
      {business?.type === 'arcade' && (
        <ArcadeSection businessId={businessId} canManage={canManage} />
      )}

      {/* News Channel Section */}
      {business?.type === 'news_channel' && (
        <NewsSection businessId={businessId} canManage={canManage} />
      )}

      {/* Fashion Brand Section */}
      {business?.type === 'fashion_brand' && (
        <>
          <CollectionsSection businessId={businessId} canManage={canManage} />
          <ProductCatalog businessId={businessId} canManage={canManage} />
        </>
      )}

      {/* Tech Startup Section */}
      {business?.type === 'tech_startup' && (
        <>
          <JobBoard businessId={businessId} canManage={canManage} />
          <ProjectShowcaseSection businessId={businessId} canManage={canManage} />
        </>
      )}

      {/* Digital Agency Section */}
      {business?.type === 'digital_agency' && (
        <>
          <ServicePackagesSection businessId={businessId} canManage={canManage} />
          <CaseStudiesSection businessId={businessId} canManage={canManage} />
        </>
      )}

      {/* Cafe/Restaurant Section */}
      {['cafe', 'restaurant'].includes(business?.type) && (
        <>
          {canManage && (
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddItem(true)}
                data-cursor-hover
                className="flex items-center gap-1.5 text-sm text-upnext-primary hover:text-upnext-primary-dark"
              >
                + Add Menu Item
              </button>
            </div>
          )}
          <MenuSection businessId={businessId} />
          {canManage && <OrdersBoard businessId={businessId} />}
          <CreateMenuItemModal open={showAddItem} onClose={() => setShowAddItem(false)} businessId={businessId} />
        </>
      )}

      {/* Tournaments Section */}
      {business?.type === 'gaming_arena' && (
        <TournamentsSection businessId={businessId} canManage={canManage} />
      )}

      {/* Business Posts Section */}
      <BusinessPostsSection businessId={businessId} canPost={canManage} />

      {/* Guest Feedbacks Forms Section */}
      {!isOwner && (
        <GlassCard>
          <h2 className="mb-4 font-semibold">Leave a Review</h2>
          <form onSubmit={handleSubmit((d) => reviewMutation.mutate({ ...d, rating: Number(d.rating) }))} className="space-y-4">
            <select
              className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none focus:border-upnext-primary"
              {...register('rating', { required: true })}
            >
              <option value="">Rating</option>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{'⭐'.repeat(r)}</option>
              ))}
            </select>
            <textarea
              placeholder="Share your experience..."
              rows={3}
              className="w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
              {...register('comment')}
            />
            <GlowButton type="submit" isLoading={reviewMutation.isPending}>
              Submit Review
            </GlowButton>
          </form>
        </GlassCard>
      )}

      {/* Verified Reviews Block */}
      {business?.reviews?.length > 0 && (
        <GlassCard>
          <h2 className="mb-4 font-semibold">Reviews</h2>
          <div className="space-y-3">
            {business.reviews.map((rev, i) => (
              <div key={i} className="rounded-xl bg-white/5 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{'⭐'.repeat(rev.rating)}</span>
                </div>
                {rev.comment && <p className="mt-1 text-sm text-upnext-muted">{rev.comment}</p>}
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Overlay Dialog Modules */}
      <EditBusinessModal open={showEdit} onClose={() => setShowEdit(false)} business={business} />
      <AddRevenueModal open={showRevenue} onClose={() => setShowRevenue(false)} businessId={businessId} />
    </div>
  );
}

function StatBlock({ icon, label, value }) {
  const Icon = icon;
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1">
        {Icon && <Icon className="h-4 w-4 text-upnext-gold" />}
        <p className="font-display text-lg font-bold">{value ?? 0}</p>
      </div>
      <p className="text-xs text-upnext-muted">{label}</p>
    </div>
  );
}
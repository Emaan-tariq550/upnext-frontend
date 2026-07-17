import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPlus, FiBriefcase, FiStar, FiSearch } from 'react-icons/fi';
import GlassCard from '../components/ui/GlassCard';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import GlowInput from '../components/ui/GlowInput';
import CreateBusinessModal from '../components/business/CreateBusinessModal';
import { businessApi } from '../api/businessApi';
import { useInfiniteListQuery } from '../hooks/useInfiniteListQuery'; // Added from snippet

export default function BusinessesPage() {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  // Swapped standard useQuery with your useInfiniteListQuery snippet safely
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteListQuery(
    ['businesses-infinite', search],
    ({ page, limit }) => businessApi.list({ search, page, limit }).then((r) => r.data)
  );

  // Flattening the pages structure safely
  const allItems = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Businesses</h1>
          <p className="text-sm text-upnext-muted">Build your empire, one milestone at a time.</p>
        </div>
        <button
          data-cursor-hover
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-xl bg-upnext-primary px-5 py-2.5 font-medium text-black hover:bg-upnext-primary-dark"
        >
          <FiPlus /> New Business
        </button>
      </div>

      <div className="relative max-w-md">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-upnext-muted" />
        <GlowInput
          placeholder="Search businesses..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : allItems.length ? ( // Using flattened 'allItems' instead of 'data'
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allItems.map((biz, i) => (
            <motion.div
              key={biz._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/businesses/${biz._id}`} data-cursor-hover>
                <GlassCard className="h-full">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-upnext-primary/15">
                      {biz.logoUrl ? (
                        <img src={biz.logoUrl} className="h-full w-full rounded-xl object-cover" alt="" />
                      ) : (
                        <FiBriefcase className="text-upnext-primary" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{biz.name}</p>
                      <p className="truncate text-xs capitalize text-upnext-muted">
                        {biz.type.replace(/_/g, ' ')}
                      </p>
                    </div>
                    {biz.isVerified && <span className="rounded-full bg-upnext-primary/20 px-2 py-0.5 text-[10px] font-bold text-upnext-primary">✓</span>}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-upnext-border pt-4 text-sm">
                    <span className="flex items-center gap-1 text-upnext-muted">
                      <FiStar className="h-3.5 w-3.5 text-upnext-gold" />
                      {biz.averageRating?.toFixed(1) ?? '0.0'}
                    </span>
                    <span className="text-upnext-muted">{biz.followersCount ?? 0} followers</span>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}

          {/* At the bottom of the grid snippet integrated correctly here */}
          {hasNextPage && (
            <button 
              onClick={() => fetchNextPage()} 
              disabled={isFetchingNextPage} 
              className="col-span-full rounded-xl border border-upnext-border py-3 text-sm text-upnext-muted hover:bg-white/5"
            >
              {isFetchingNextPage ? 'Loading...' : 'Load More'}
            </button>
          )}
        </div>
      ) : (
        <EmptyState
          icon={FiBriefcase}
          title="No businesses found"
          subtitle="Start your own — cafes, studios, startups, and more."
          action={
            <button
              onClick={() => setShowCreate(true)}
              className="rounded-xl bg-upnext-primary px-5 py-2.5 font-medium text-black"
            >
              Create Your First Business
            </button>
          }
        />
      )}

      <CreateBusinessModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
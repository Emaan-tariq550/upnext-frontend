import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPlus, FiEye, FiHeart, FiMessageCircle, FiZap } from 'react-icons/fi';
import GlassCard from '../ui/GlassCard';
import { newsApi } from '../../api/newsApi';
import PublishArticleModal from './PublishArticleModal';

const CATEGORIES = ['all', 'general', 'sports', 'entertainment', 'tech', 'business', 'community', 'gaming'];

export default function NewsSection({ businessId, canManage }) {
  const [showPublish, setShowPublish] = useState(false);
  const [category, setCategory] = useState('all');

  const { data: articles, isLoading } = useQuery({
    queryKey: ['newsArticles', businessId, category],
    queryFn: () => newsApi.listByBusiness(businessId, category === 'all' ? undefined : category).then((r) => r.data.data),
  });

  return (
    <GlassCard>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Articles</h2>
        {canManage && (
          <button onClick={() => setShowPublish(true)} data-cursor-hover className="flex items-center gap-1.5 text-sm text-upnext-primary hover:text-upnext-primary-dark">
            <FiPlus className="h-4 w-4" /> Publish
          </button>
        )}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            data-cursor-hover
            className={`rounded-full px-3 py-1 text-xs capitalize transition-colors ${
              category === c ? 'bg-upnext-primary text-black' : 'bg-white/5 text-upnext-muted hover:bg-white/10'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-upnext-muted">Loading articles...</p>
      ) : articles?.length === 0 ? (
        <p className="text-sm text-upnext-muted">Is category mein koi article nahi.</p>
      ) : (
        <div className="space-y-3">
          {articles?.map((article, idx) => (
            <motion.div
              key={article._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={`/news/${article._id}`}
                data-cursor-hover
                className="flex gap-3 rounded-xl border border-upnext-border bg-white/5 p-3 hover:bg-white/10 transition-colors"
              >
                {article.coverImageUrl && (
                  <img src={article.coverImageUrl} className="h-20 w-20 shrink-0 rounded-lg object-cover" alt="" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {article.isBreaking && (
                      <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400">
                        <FiZap className="h-2.5 w-2.5" /> BREAKING
                      </span>
                    )}
                    <span className="text-[10px] uppercase tracking-wider text-upnext-muted">{article.category}</span>
                  </div>
                  <p className="mt-1 truncate font-medium">{article.headline}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-upnext-muted">{article.body}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-upnext-muted">
                    <span className="flex items-center gap-1"><FiEye className="h-3 w-3" /> {article.views ?? 0}</span>
                    <span className="flex items-center gap-1"><FiHeart className="h-3 w-3" /> {article.likes?.length ?? 0}</span>
                    <span className="flex items-center gap-1"><FiMessageCircle className="h-3 w-3" /> {article.commentsCount ?? 0}</span>
                    <span className="ml-auto">{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      <PublishArticleModal open={showPublish} onClose={() => setShowPublish(false)} businessId={businessId} />
    </GlassCard>
  );
}
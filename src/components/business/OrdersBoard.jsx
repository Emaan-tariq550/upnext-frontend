import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiClock, FiPackage, FiCheckCircle } from 'react-icons/fi';
import GlassCard from '../ui/GlassCard';
import { orderApi } from '../../api/orderApi';
import { useSocket } from '../../hooks/useSocket';

const COLUMNS = [
  { status: 'pending', label: 'New', icon: FiClock, color: 'text-blue-400' },
  { status: 'preparing', label: 'Preparing', icon: FiPackage, color: 'text-amber-400' },
  { status: 'ready', label: 'Ready', icon: FiCheckCircle, color: 'text-green-400' },
];

const NEXT_STATUS = { pending: 'preparing', preparing: 'ready', ready: 'completed' };

export default function OrdersBoard({ businessId }) {
  const socket = useSocket();
  const queryClient = useQueryClient();

  const { data: orders } = useQuery({
    queryKey: ['businessOrders', businessId],
    queryFn: () => orderApi.listByBusiness(businessId).then((r) => r.data.data),
    refetchInterval: 20000,
  });

  useEffect(() => {
    if (!socket) return undefined;

    const handleNewOrder = (order) => {
      if (order.business !== businessId && order.business?._id !== businessId) return;
      queryClient.invalidateQueries({ queryKey: ['businessOrders', businessId] });
      toast.success(`New order from ${order.customer?.displayName || 'a customer'}! 🛎️`);
    };

    socket.on('order:new', handleNewOrder);
    return () => socket.off('order:new', handleNewOrder);
  }, [socket, businessId, queryClient]);

  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }) => orderApi.updateStatus(orderId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['businessOrders', businessId] }),
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  });

  const activeOrders = (orders || []).filter((o) => ['pending', 'preparing', 'ready'].includes(o.status));

  return (
    <GlassCard>
      <h2 className="mb-5 font-semibold">Live Orders</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {COLUMNS.map((col) => {
          const Icon = col.icon;
          const columnOrders = activeOrders.filter((o) => o.status === col.status);

          return (
            <div key={col.status} className="rounded-xl border border-upnext-border bg-black/20 p-3">
              <div className="mb-3 flex items-center gap-2">
                <Icon className={`h-4 w-4 ${col.color}`} />
                <h3 className="text-sm font-medium">{col.label}</h3>
                <span className="ml-auto text-xs text-upnext-muted">{columnOrders.length}</span>
              </div>

              <div className="space-y-2">
                <AnimatePresence>
                  {columnOrders.map((order) => (
                    <motion.div
                      key={order._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="cursor-pointer rounded-lg bg-white/5 p-3 hover:bg-white/10"
                      onClick={() => statusMutation.mutate({ orderId: order._id, status: NEXT_STATUS[order.status] })}
                      data-cursor-hover
                    >
                      <p className="text-xs font-medium text-upnext-primary">{order.customer?.displayName}</p>
                      <div className="mt-1.5 space-y-0.5">
                        {order.items.map((it, i) => (
                          <p key={i} className="text-xs text-upnext-muted">
                            {it.quantity}× {it.name}
                          </p>
                        ))}
                      </div>
                      {order.notes && <p className="mt-1.5 text-xs italic text-upnext-muted">"{order.notes}"</p>}
                      <p className="mt-2 text-xs font-semibold">Rs. {order.totalAmount}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {columnOrders.length === 0 && (
                  <p className="py-4 text-center text-xs text-upnext-muted">Khaali hai</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiMinus, FiShoppingBag, FiX, FiCoffee } from 'react-icons/fi';
import GlassCard from '../ui/GlassCard';
import GlowButton from '../ui/GlowButton';
import { menuApi } from '../../api/menuApi';
import { orderApi } from '../../api/orderApi';

export default function MenuSection({ businessId }) {
  const queryClient = useQueryClient();
  const [cart, setCart] = useState({}); // { menuItemId: quantity }
  const [cartOpen, setCartOpen] = useState(false);
  const [notes, setNotes] = useState('');

  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['menu', businessId],
    queryFn: () => menuApi.listByBusiness(businessId).then((r) => r.data.data),
  });

  const grouped = useMemo(() => {
    if (!menuItems) return {};
    return menuItems.reduce((acc, item) => {
      const cat = item.category || 'General';
      acc[cat] = acc[cat] || [];
      acc[cat].push(item);
      return acc;
    }, {});
  }, [menuItems]);

  const cartItems = useMemo(() => {
    if (!menuItems) return [];
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => ({ item: menuItems.find((m) => m._id === id), qty }))
      .filter((c) => c.item);
  }, [cart, menuItems]);

  const total = cartItems.reduce((sum, c) => sum + c.item.price * c.qty, 0);
  const cartCount = cartItems.reduce((sum, c) => sum + c.qty, 0);

  const adjustQty = (itemId, delta) => {
    setCart((prev) => {
      const next = Math.max(0, (prev[itemId] || 0) + delta);
      return { ...prev, [itemId]: next };
    });
  };

  const placeOrderMutation = useMutation({
    mutationFn: () =>
      orderApi.place({
        businessId,
        items: cartItems.map((c) => ({ menuItemId: c.item._id, quantity: c.qty })),
        notes,
      }),
    onSuccess: () => {
      toast.success('Order placed! 🎉');
      setCart({});
      setNotes('');
      setCartOpen(false);
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Order failed'),
  });

  if (isLoading) {
    return (
      <GlassCard>
        <p className="text-sm text-upnext-muted">Menu load ho raha hai...</p>
      </GlassCard>
    );
  }

  return (
    <>
      <GlassCard className="relative overflow-visible">
        <div className="mb-5 flex items-center gap-2">
          <FiCoffee className="h-5 w-5 text-upnext-primary" />
          <h2 className="font-semibold">Menu</h2>
        </div>

        {Object.keys(grouped).length === 0 && (
          <p className="text-sm text-upnext-muted">Abhi menu available nahi hai.</p>
        )}

        <div className="space-y-8">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-upnext-muted">{category}</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {items.map((item, idx) => {
                  const qty = cart[item._id] || 0;
                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                      className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                        item.isAvailable
                          ? 'border-upnext-border bg-white/5'
                          : 'border-upnext-border bg-white/[0.02] opacity-50'
                      }`}
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-black/40">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} className="h-full w-full object-cover" alt="" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <FiCoffee className="text-upnext-muted" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.name}</p>
                        {item.description && (
                          <p className="truncate text-xs text-upnext-muted">{item.description}</p>
                        )}
                        <p className="mt-1 text-sm font-semibold text-upnext-primary">Rs. {item.price}</p>
                      </div>

                      {item.isAvailable ? (
                        qty === 0 ? (
                          <button
                            data-cursor-hover
                            onClick={() => adjustQty(item._id, 1)}
                            className="rounded-full bg-upnext-primary p-2 text-black transition-transform hover:scale-105 active:scale-95"
                          >
                            <FiPlus className="h-4 w-4" />
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-1 py-1">
                            <button
                              data-cursor-hover
                              onClick={() => adjustQty(item._id, -1)}
                              className="rounded-full p-1.5 hover:bg-white/10"
                            >
                              <FiMinus className="h-3.5 w-3.5" />
                            </button>
                            <motion.span
                              key={qty}
                              initial={{ scale: 1.3 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                              className="w-4 text-center text-sm font-medium"
                            >
                              {qty}
                            </motion.span>
                            <button
                              data-cursor-hover
                              onClick={() => adjustQty(item._id, 1)}
                              className="rounded-full p-1.5 hover:bg-white/10"
                            >
                              <FiPlus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )
                      ) : (
                        <span className="text-xs text-upnext-muted">Sold out</span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Floating cart button */}
      <AnimatePresence>
        {cartCount > 0 && !cartOpen && (
          <motion.button
            data-cursor-hover
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setCartOpen(true)}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-upnext-primary px-5 py-3.5 font-medium text-black shadow-2xl shadow-upnext-primary/30"
          >
            <FiShoppingBag className="h-4 w-4" />
            {cartCount} item{cartCount > 1 ? 's' : ''} · Rs. {total}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cart drawer */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 flex items-end justify-end bg-black/70 backdrop-blur-sm sm:items-stretch"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-full max-w-sm flex-col border-l border-upnext-border bg-upnext-surface p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">Your Order</h2>
                <button data-cursor-hover onClick={() => setCartOpen(false)} className="rounded-lg p-1.5 hover:bg-white/10">
                  <FiX />
                </button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto">
                {cartItems.map((c) => (
                  <div key={c.item._id} className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                    <div>
                      <p className="text-sm font-medium">{c.item.name}</p>
                      <p className="text-xs text-upnext-muted">Rs. {c.item.price} × {c.qty}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button data-cursor-hover onClick={() => adjustQty(c.item._id, -1)} className="rounded-full p-1.5 hover:bg-white/10">
                        <FiMinus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-4 text-center text-sm">{c.qty}</span>
                      <button data-cursor-hover onClick={() => adjustQty(c.item._id, 1)} className="rounded-full p-1.5 hover:bg-white/10">
                        <FiPlus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {cartItems.length === 0 && <p className="text-sm text-upnext-muted">Cart khaali hai.</p>}
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special instructions (optional)"
                rows={2}
                className="mt-4 w-full rounded-xl border border-upnext-border bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-upnext-muted focus:border-upnext-primary"
              />

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-upnext-muted">Total</span>
                <span className="font-display text-lg font-bold">Rs. {total}</span>
              </div>

              <GlowButton
                className="mt-4 w-full"
                onClick={() => placeOrderMutation.mutate()}
                isLoading={placeOrderMutation.isPending}
                disabled={cartItems.length === 0}
              >
                Place Order
              </GlowButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
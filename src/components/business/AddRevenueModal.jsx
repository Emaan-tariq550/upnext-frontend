import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import GlowInput from '../ui/GlowInput';
import GlowButton from '../ui/GlowButton';
import { businessApi } from '../../api/businessApi';

export default function AddRevenueModal({ open, onClose, businessId }) {
  const [amount, setAmount] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => businessApi.addRevenue(businessId, Number(amount)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', businessId] });
      toast.success('Revenue recorded');
      setAmount('');
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  return (
    <Modal open={open} onClose={onClose} title="Record Revenue">
      <p className="mb-3 text-xs text-upnext-muted">
        This simulates a sale/order for your business — used for milestones, popularity, and leaderboard ranking.
      </p>
      <GlowInput type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <GlowButton onClick={() => mutation.mutate()} isLoading={mutation.isPending} className="mt-4 w-full">
        Add Revenue
      </GlowButton>
    </Modal>
  );
}
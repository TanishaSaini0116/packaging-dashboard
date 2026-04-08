import { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Plus, Search, Trash2, Edit, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useMockupStore from '../store/mockupStore';
import useAuthStore from '../store/authStore';
import useOrderStore from '../store/orderStore';
import Loader from '../components/Loader';
import ConfettiEffect from '../components/ConfettiEffect';
import toast from 'react-hot-toast';

const CATEGORIES = ['All assets', 'Packaging', 'Bottles', 'Apparel', 'Beverage', 'Other'];

const Mockups = () => {
  const { mockups, getMockups, deleteMockup, loading } = useMockupStore();
  const { createOrder } = useOrderStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [category, setCategory] = useState('All assets');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [orderModal, setOrderModal] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
  getMockups({
    category: category !== 'All assets' ? category : '',
    search,
    sort
  });
}, [category, search, sort, getMockups]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this mockup?')) return;
    const result = await deleteMockup(id);
    if (result.success) toast.success('Mockup deleted!');
  };

  const handleOrder = async () => {
    const result = await createOrder({
      mockupId: orderModal._id,
      quantity,
      notes
    });
    if (result.success) {
      setConfetti(true);
      setOrderModal(null);
      toast.success('Order placed! 🎉');
      setTimeout(() => setConfetti(false), 3000);
    } else {
      toast.error('Order failed!');
    }
  };

  if (loading && mockups.length === 0) return <Loader />;

  return (
    <div className="animate-fade-in">
      <ConfettiEffect trigger={confetti} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Mockups</h1>
          <p className="text-white/40 mt-1">Manage your uploaded mockups</p>
        </div>
        {user?.role === 'designer' && (
          <Motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/upload')}
            className="flex items-center gap-2 gradient-bg text-white px-4 py-2 rounded-xl"
          >
            <Plus className="w-4 h-4" />
            New Mockup
          </Motion.button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
                category === cat
                  ? 'bg-primary-600 text-white'
                  : 'glass text-white/60 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white text-sm placeholder-white/20 focus:border-primary-500 transition-all"
            />
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="bg-[#1a1a2e] border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
          >
            <option value="">Recently Edited</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {mockups.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <Package className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/40">No mockups found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockups.map((mockup, i) => (
            <Motion.div
              key={mockup._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl overflow-hidden card-hover"
            >
              <div className="relative">
                <img src={mockup.imageUrl} alt={mockup.title} className="w-full h-44 object-cover" />
                <span className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
                  {mockup.category}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium text-sm">{mockup.title}</h3>
                    <p className="text-white/40 text-xs mt-0.5 line-clamp-1">{mockup.description}</p>
                  </div>
                  <span className="text-primary-400 font-bold text-sm">${mockup.price}</span>
                </div>
                <div className="flex gap-2">
                  {user?.role === 'designer' ? (
                    <>
                      <button
                        onClick={() => navigate('/upload')}
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white text-xs transition-all"
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(mockup._id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/30 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => { setOrderModal(mockup); setQuantity(1); setNotes(''); }}
                      className="w-full gradient-bg py-2 rounded-lg text-white text-xs font-medium"
                    >
                      Place Order
                    </button>
                  )}
                </div>
              </div>
            </Motion.div>
          ))}

          {/* Create New Card - Designer only */}
          {user?.role === 'designer' && (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => navigate('/upload')}
              className="glass rounded-2xl border-2 border-dashed border-white/10 hover:border-primary-500/50 flex flex-col items-center justify-center p-8 cursor-pointer card-hover min-h-[200px]"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-600/20 flex items-center justify-center mb-3">
                <Plus className="w-6 h-6 text-primary-400" />
              </div>
              <p className="text-white font-medium text-sm">Create New</p>
              <p className="text-white/30 text-xs mt-1 text-center">Start with a blank canvas or import a 3D model</p>
            </Motion.div>
          )}
        </div>
      )}

      {/* Order Modal */}
      {orderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-white text-lg font-bold mb-4">Place Order</h2>
            <div className="flex gap-4 mb-4">
              <img src={orderModal.imageUrl} alt={orderModal.title} className="w-20 h-20 rounded-xl object-cover" />
              <div>
                <h3 className="text-white font-medium">{orderModal.title}</h3>
                <p className="text-primary-400 font-bold">${orderModal.price}</p>
                <p className="text-white/40 text-xs mt-1">{orderModal.category}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Any special requirements..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 resize-none"
                />
              </div>
              <div className="glass rounded-xl p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Total Price</span>
                  <span className="text-white font-bold">${(orderModal.price * quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setOrderModal(null)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white transition-all"
              >
                Cancel
              </button>
              <Motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOrder}
                className="flex-1 gradient-bg py-3 rounded-xl text-white font-semibold"
              >
                Confirm Order 🎉
              </Motion.button>
            </div>
          </Motion.div>
        </div>
      )}
    </div>
  );
};

export default Mockups;
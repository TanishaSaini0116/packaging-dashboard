import { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Package, RefreshCw } from 'lucide-react';
import useOrderStore from '../store/orderStore';
import useAuthStore from '../store/authStore';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const STATUS_ICONS = {
  pending: Clock,
  confirmed: RefreshCw,
  completed: CheckCircle,
  cancelled: XCircle,
};

const Orders = () => {
  const { orders, getOrders, updateOrderStatus, loading } = useOrderStore();
  const { user } = useAuthStore();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getOrders();
    const interval = setInterval(getOrders, 10000);
    return () => clearInterval(interval);
  }, [getOrders]);

  const handleStatusUpdate = async (id, status) => {
    const result = await updateOrderStatus(id, status);
    if (result.success) {
      toast.success(`Order ${status}! ✅`);
    }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading && orders.length === 0) return <Loader />;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-white/40 mt-1">
            {user?.role === 'designer' ? 'Manage incoming orders' : 'Track your orders'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-white/30 text-xs">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          Live updates every 10s
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-1.5 rounded-lg text-sm transition-all capitalize ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'glass text-white/60 hover:text-white'
            }`}
          >
            {status} {status === 'all' ? `(${orders.length})` : `(${orders.filter(o => o.status === status).length})`}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <Package className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/40">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order, i) => {
            const StatusIcon = STATUS_ICONS[order.status] || Clock;
            return (
              <Motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-6 card-hover"
              >
                <div className="flex items-start gap-4">
                  {order.mockup?.imageUrl && (
                    <img
                      src={order.mockup.imageUrl}
                      alt={order.mockup.title}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-white font-semibold">{order.mockup?.title}</h3>
                        <p className="text-white/40 text-sm mt-0.5">
                          {user?.role === 'designer' ? `Client: ${order.client?.name}` : `Designer: ${order.mockup?.designer?.name || 'Designer'}`}
                        </p>
                        {order.notes && (
                          <p className="text-white/30 text-xs mt-1 italic">"{order.notes}"</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-white font-bold">${order.totalPrice}</p>
                        <p className="text-white/40 text-xs">Qty: {order.quantity}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs border capitalize ${STATUS_COLORS[order.status]}`}>
                        <StatusIcon className="w-3 h-3" />
                        {order.status}
                      </span>

                      <div className="flex items-center gap-2">
                        <p className="text-white/30 text-xs">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>

                        {/* Designer status update buttons */}
                        {user?.role === 'designer' && order.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusUpdate(order._id, 'confirmed')}
                              className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-lg text-xs hover:bg-blue-600/40 transition-all"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                              className="px-3 py-1 bg-red-600/20 border border-red-500/30 text-red-400 rounded-lg text-xs hover:bg-red-600/40 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                        {user?.role === 'designer' && order.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'completed')}
                            className="px-3 py-1 bg-green-600/20 border border-green-500/30 text-green-400 rounded-lg text-xs hover:bg-green-600/40 transition-all"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Status Timeline */}
                    {order.statusHistory && order.statusHistory.length > 1 && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <div className="flex gap-2 flex-wrap">
                          {order.statusHistory.map((h, idx) => (
                            <span key={idx} className="text-white/20 text-xs capitalize">
                              {h.status} {idx < order.statusHistory.length - 1 ? '→' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
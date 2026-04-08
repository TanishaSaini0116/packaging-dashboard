import { useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Clock, CheckCircle, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useOrderStore from '../store/orderStore';
import useMockupStore from '../store/mockupStore';
import Loader from '../components/Loader';

// ✅ CLEAN FIX (no ESLint issue)
const StatCard = ({ title, value, subtitle, icon, color, delay }) => {
  const Icon = icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-2xl p-6 card-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-white/40 text-sm uppercase tracking-wider">{title}</p>
        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value ?? 0}</p>
      {subtitle && <p className="text-white/40 text-xs mt-1">{subtitle}</p>}
    </motion.div>
  );
};

const Dashboard = () => {
  const { user } = useAuthStore();
  const { stats, getStats, loading } = useOrderStore();
  const { mockups, getMockups } = useMockupStore();
  const navigate = useNavigate();

  // ✅ FIXED dependency warning
  useEffect(() => {
    getStats();
    getMockups();
  }, [getStats, getMockups]);

  if (loading && !stats) return <Loader />;

  const isDesigner = user?.role === 'designer';

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Performance Overview</h1>
          <p className="text-white/40 mt-1">
            Track your packaging assets and supply chain status in real-time.
          </p>
        </div>

        {isDesigner && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/upload')}
            className="flex items-center gap-2 glass border border-primary-500/30 text-white px-4 py-2 rounded-xl hover:bg-primary-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Mockup
          </motion.button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isDesigner ? (
          <>
            <StatCard title="Total Mockups" value={stats?.totalMockups} icon={Package} color="bg-primary-600" delay={0} />
            <StatCard title="Orders Received" value={stats?.ordersReceived} icon={ShoppingCart} color="bg-blue-600" delay={0.1} />
            <StatCard title="Pending Orders" value={stats?.pendingOrders} icon={Clock} color="bg-amber-600" delay={0.2} />
            <StatCard title="Completed Orders" value={stats?.completedOrders} icon={CheckCircle} color="bg-green-600" delay={0.3} />
          </>
        ) : (
          <>
            <StatCard title="Total Orders" value={stats?.totalOrders} icon={ShoppingCart} color="bg-primary-600" delay={0} />
            <StatCard title="Pending Orders" value={stats?.pendingOrders} icon={Clock} color="bg-amber-600" delay={0.1} />
            <StatCard title="Completed" value={stats?.completedOrders} icon={CheckCircle} color="bg-green-600" delay={0.2} />
            <StatCard title="Total Spent" value={`$${stats?.totalSpent || 0}`} icon={TrendingUp} color="bg-purple-600" delay={0.3} />
          </>
        )}
      </div>

      {/* Mockups */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Recent Mockups</h2>

        {mockups.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Package className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40">No mockups yet</p>

            {isDesigner && (
              <button
                onClick={() => navigate('/upload')}
                className="mt-4 gradient-bg px-6 py-2 rounded-xl text-white text-sm"
              >
                Upload First Mockup
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockups.slice(0, 4).map((mockup, i) => (
              <motion.div
                key={mockup._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => navigate('/mockups')}
              >
                <img
                  src={mockup.imageUrl}
                  alt={mockup.title}
                  className="w-full h-40 object-cover"
                />

                <div className="p-4">
                  <p className="text-white text-sm font-medium">{mockup.title}</p>
                  <p className="text-white/30 text-xs">${mockup.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
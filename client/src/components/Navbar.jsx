import { useState, useEffect } from 'react';
import { Bell, Search, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import API from '../utils/axios';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // ✅ Fetch Notifications (inside effect-safe function)
  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const { data } = await API.get('/auth/notifications');
        if (isMounted) {
          setNotifications(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    // Initial fetch
    fetchNotifications();

    // Polling every 10 sec
    const interval = setInterval(fetchNotifications, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <div className="h-16 glass-dark border-b border-white/10 flex items-center px-6 gap-4">
      
      {/* 🔍 Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          placeholder="Search orders, mockups..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder-white/30 text-sm focus:border-primary-500 transition-all"
        />
      </div>

      <div className="flex items-center gap-3">

        {/* 🔔 Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all relative"
          >
            <Bell className="w-4 h-4" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 rounded-full text-xs text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 glass-dark border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
              
              <div className="p-4 border-b border-white/10">
                <h3 className="text-white font-semibold">Notifications</h3>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-white/40 text-sm p-4 text-center">
                    No notifications yet
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`p-4 border-b border-white/5 hover:bg-white/5 transition-all ${
                        !n.read ? 'bg-primary-600/10' : ''
                      }`}
                    >
                      <p className="text-white/80 text-sm">{n.message}</p>
                      <p className="text-white/30 text-xs mt-1">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* 👤 User Info */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-white text-sm font-medium">
              {user?.name}
            </p>
            <p className="text-white/40 text-xs capitalize">
              {user?.role}
            </p>
          </div>

          <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* 🚪 Logout */}
        <button
          onClick={handleLogout}
          className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-red-400 transition-all"
        >
          <LogOut className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};

export default Navbar;
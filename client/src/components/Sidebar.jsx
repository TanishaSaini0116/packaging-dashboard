import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Image, 
  Upload, 
  ShoppingCart, 
  User,
  Zap
} from 'lucide-react';
import useAuthStore from '../store/authStore';

const Sidebar = () => {
  const { user } = useAuthStore();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/mockups', icon: Image, label: 'Mockups' },
    ...(user?.role === 'designer' ? [{ path: '/upload', icon: Upload, label: 'Upload' }] : []),
    { path: '/orders', icon: ShoppingCart, label: 'Orders' },
  ];

  return (
    <div className="w-64 h-full glass-dark flex flex-col border-r border-white/10">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">PackageHub</h1>
            <p className="text-white/40 text-xs capitalize">{user?.role} Plan</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        <NavLink
          to="/profile"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
        >
          <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-white text-sm font-medium">{user?.name}</p>
            <p className="text-white/40 text-xs">{user?.email}</p>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
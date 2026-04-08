import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const ProtectedRoute = () => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen bg-[#0f0f13] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;
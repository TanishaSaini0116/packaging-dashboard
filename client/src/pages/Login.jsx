import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['designer', 'client']),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'designer' }
  });

  const selectedRole = useWatch({
    control,
    name: 'role',
  });

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      toast.success(`Welcome back! 👋`);
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-3xl p-8 relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-white/40 mt-1">Enter your details to access your workspace</p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-white/5 rounded-xl p-1 mb-6">
          {['designer', 'client'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setValue('role', role)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                selectedRole === role
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                {...register('email')}
                type="email"
                placeholder="name@company.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/20 focus:border-primary-500 transition-all"
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-white/60 text-xs uppercase tracking-wider mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white placeholder-white/20 focus:border-primary-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full gradient-bg py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login →'}
          </motion.button>
        </form>

        <p className="text-center text-white/40 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-500 hover:text-primary-400 font-medium">
            Create Account
          </Link>
        </p>

        <div className="flex items-center justify-center gap-4 mt-4">
          <span className="flex items-center gap-1 text-xs text-white/20">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            System Online
          </span>
          <span className="flex items-center gap-1 text-xs text-white/20">
            🔒 Secured Access
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
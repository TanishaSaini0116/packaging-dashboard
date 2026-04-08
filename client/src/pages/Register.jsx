import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Mail, Lock, User, Zap } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['designer', 'client']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const Register = () => {
  const [agreed, setAgreed] = useState(false);
  const { register: registerUser, loading } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'designer' },
  });

  // ✅ FIXED useWatch (with defaultValue)
  const selectedRole = useWatch({
    control,
    name: 'role',
    defaultValue: 'designer',
  });

  const onSubmit = async (data) => {
    if (!agreed) return toast.error('Please agree to terms!');

    const result = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    });

    if (result.success) {
      toast.success('Account created! 🎉');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-3xl p-8 relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-white/40 mt-1">Join the PackageHub ecosystem today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Name */}
          <div>
            <label className="text-white/60 text-xs mb-2 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                {...register('name')}
                type="text"
                placeholder="John Doe"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white"
              />
            </div>
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-white/60 text-xs mb-2 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                {...register('email')}
                type="email"
                placeholder="john@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white"
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                {...register('password')}
                type="password"
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
              />
              {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
            </div>

            <div>
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="Confirm"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Role */}
          <div className="grid grid-cols-2 gap-3">
            {['designer', 'client'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setValue('role', role)}
                className={`py-3 rounded-xl ${
                  selectedRole === role
                    ? 'bg-primary-600 text-white'
                    : 'bg-white/5 text-white/40'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className="text-white/40 text-xs">Agree to terms</span>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full gradient-bg py-3 rounded-xl text-white"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </motion.button>

        </form>

        <p className="text-center text-white/40 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
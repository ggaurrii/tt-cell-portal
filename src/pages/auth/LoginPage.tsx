import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { Button, Input } from '@/components/ui';
import toast from 'react-hot-toast';
import { UserRole } from '@/types';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>('student');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const success = await login(data.email, data.password, role);
    setLoading(false);
    if (success) {
      toast.success('Login successful!');
      navigate(role === 'admin' ? '/admin' : '/student');
    } else {
      toast.error('Invalid email or password');
    }
  };

  const fillDemo = (r: UserRole) => {
    setRole(r);
    setValue('email', r === 'admin' ? 'admin@ttcell.in' : 'student@ttcell.in');
    setValue('password', r === 'admin' ? 'admin123' : 'student123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <Link to="/" className="flex items-center gap-2 text-military-green">
                <FiArrowLeft /> Back to Home
              </Link>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-military-dark">Welcome Back</h2>
              <p className="text-gray-500 text-sm mt-1">Sign in to access your portal</p>
            </div>

            {/* Role Toggle */}
            <div className="flex bg-surface-subtle rounded-xl p-1 mb-8 gap-1">
              {(['student', 'admin'] as UserRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${role === r ? 'bg-military-green text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  {r === 'admin' ? '👤 Admin Login' : '🎓 Student Login'}
                </button>
              ))}
            </div>

            {/* Demo credentials hint */}
            <div className="bg-military-green/5 border border-military-green/20 rounded-xl p-3 mb-6">
              <p className="text-xs font-semibold text-military-green mb-2">Demo Credentials:</p>
              <div className="flex gap-2">
                <button onClick={() => fillDemo('admin')} className="text-xs bg-military-green text-white px-2.5 py-1.5 rounded-lg hover:bg-military-light transition-colors">Fill Admin</button>
                <button onClick={() => fillDemo('student')} className="text-xs bg-gold text-military-dark px-2.5 py-1.5 rounded-lg hover:bg-gold-light transition-colors">Fill Student</button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                placeholder={role === 'admin' ? 'admin@ttcell.in' : 'student@ttcell.in'}
                leftIcon={<FiMail className="w-4 h-4" />}
                error={errors.email?.message}
                {...register('email')}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-400' : 'border-surface-border focus:border-military-green'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-military-green/20 transition-colors`}
                    {...register('password')}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded accent-military-green" {...register('rememberMe')} />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-military-green font-semibold hover:underline">Forgot Password?</a>
              </div>

              <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full justify-center">
                Sign In to Portal
              </Button>
            </form>

            <p className="text-center text-xs text-gray-500 mt-6">
              Having trouble? Contact{' '}
              <a href="mailto:ttcell@509abw.in" className="text-military-green font-semibold">ttcell@509abw.in</a>
            </p>
          </div>
        </motion.div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShield, FiArrowLeft, FiHome } from 'react-icons/fi';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface-muted flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <div className="w-24 h-24 bg-military-green/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">🔍</span>
        </div>
        <h1 className="text-6xl font-extrabold text-military-dark mb-3">404</h1>
        <h2 className="text-xl font-bold text-gray-700 mb-3">Page Not Found</h2>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/">
            <button className="btn-outline flex items-center gap-2"><FiArrowLeft /> Go Back</button>
          </Link>
          <Link to="/">
            <button className="btn-primary flex items-center gap-2"><FiHome /> Home</button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-surface-muted flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <FiShield className="w-12 h-12 text-red-400" />
        </div>
        <h1 className="text-6xl font-extrabold text-red-500 mb-3">403</h1>
        <h2 className="text-xl font-bold text-gray-700 mb-3">Access Denied</h2>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">You don't have permission to access this page. Please contact your administrator if you believe this is an error.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/login">
            <button className="btn-primary">Return to Login</button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-military-dark flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
          <FiShield className="w-8 h-8 text-military-dark" />
        </div>
        <p className="text-white font-bold text-lg">TT CELL</p>
        <p className="text-white/50 text-sm mt-1 mb-6">509 Army Base Workshop</p>
        <div className="flex justify-center gap-1.5">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

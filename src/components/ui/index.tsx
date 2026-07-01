import React from 'react';
import { motion } from 'framer-motion';

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, className = '', disabled, ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-military-green text-white hover:bg-military-light shadow-sm hover:shadow-md',
    gold: 'bg-gold text-military-dark hover:bg-gold-light shadow-sm hover:shadow-md',
    outline: 'border-2 border-military-green text-military-green hover:bg-military-green hover:text-white',
    ghost: 'text-military-green hover:bg-surface-subtle',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-7 py-3 text-base rounded-xl',
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center gap-2 font-semibold transition-all duration-200 ${variants[variant]} ${sizes[size]} ${disabled || isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      disabled={disabled || isLoading}
      {...(props as any)}
    >
      {isLoading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </motion.button>
  );
}

// Badge
interface BadgeProps {
  color?: 'green' | 'gold' | 'red' | 'gray' | 'blue' | 'orange';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ color = 'gray', children, className = '' }: BadgeProps) {
  const colors = {
    green: 'bg-green-100 text-green-800',
    gold: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-700',
    blue: 'bg-blue-100 text-blue-800',
    orange: 'bg-orange-100 text-orange-800',
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color]} ${className}`}>{children}</span>;
}

// Avatar
interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ name, src, size = 'md', className = '' }: AvatarProps) {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-xl' };
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  if (src) return <img src={src} alt={name} className={`rounded-full object-cover ${sizes[size]} ${className}`} />;
  return (
    <div className={`rounded-full bg-military-green text-white flex items-center justify-center font-semibold flex-shrink-0 ${sizes[size]} ${className}`}>
      {initials}
    </div>
  );
}

// Card
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className = '', hover, padding = 'md' }: CardProps) {
  const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };
  return (
    <div className={`bg-white rounded-2xl shadow-card border border-surface-border ${paddings[padding]} ${hover ? 'hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300' : ''} ${className}`}>
      {children}
    </div>
  );
}

// Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({ label, error, leftIcon, rightIcon, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        {leftIcon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{leftIcon}</div>}
        <input
          className={`w-full ${leftIcon ? 'pl-10' : 'pl-4'} ${rightIcon ? 'pr-10' : 'pr-4'} py-3 border ${error ? 'border-red-400 focus:ring-red-200 focus:border-red-500' : 'border-surface-border focus:border-military-green focus:ring-military-green/20'} rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors bg-white ${className}`}
          {...props}
        />
        {rightIcon && <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">{rightIcon}</div>}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

// Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <select className={`w-full px-4 py-3 border ${error ? 'border-red-400' : 'border-surface-border focus:border-military-green'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-military-green/20 transition-colors bg-white appearance-none ${className}`} {...props}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

// Stat Card
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
  iconBg?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, iconBg = 'bg-military-green/10' }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-military-dark mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${trend.positive ? 'text-green-600' : 'text-red-500'}`}>
              <span>{trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="text-gray-400 font-normal">vs last month</span>
            </div>
          )}
        </div>
        <div className={`${iconBg} p-3 rounded-xl text-military-green`}>{icon}</div>
      </div>
    </Card>
  );
}

// Modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-surface-border">
          <h2 className="text-lg font-bold text-military-dark">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-subtle text-gray-500 hover:text-gray-700 transition-colors">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
}

// Skeleton
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

// Empty State
export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-surface-subtle rounded-2xl flex items-center justify-center mb-4 text-3xl">📭</div>
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mt-1 max-w-xs">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// Progress Bar
export function ProgressBar({ value, max = 100, color = 'green', showLabel = true }: { value: number; max?: number; color?: 'green' | 'gold' | 'red' | 'blue'; showLabel?: boolean }) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  const colors = { green: 'bg-military-green', gold: 'bg-gold', red: 'bg-red-500', blue: 'bg-blue-500' };
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-surface-subtle rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className={`h-full rounded-full ${colors[color]}`} />
      </div>
      {showLabel && <span className="text-xs font-semibold text-gray-600 w-8 text-right">{pct}%</span>}
    </div>
  );
}

// Table
export function Table({ headers, rows, onRowClick }: { headers: string[]; rows: React.ReactNode[][]; onRowClick?: (index: number) => void }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-border">
            {headers.map((h, i) => <th key={i} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} onClick={() => onRowClick?.(i)} className={`border-b border-surface-border/50 ${onRowClick ? 'cursor-pointer hover:bg-surface-subtle' : ''} transition-colors`}>
              {row.map((cell, j) => <td key={j} className="py-3.5 px-4">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

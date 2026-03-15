import { useAuth } from 'nauth-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../lib/constants';
import { User, Calendar, Mail, Shield, Activity } from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();

  const quickLinks = [
    {
      icon: <User className="w-5 h-5" />,
      title: 'View Profile',
      description: 'Manage your account information',
      to: ROUTES.PROFILE,
      color: 'text-cyan-400',
      bg: 'from-cyan-500/10 to-blue-500/10',
    }
  ];

  const userStats = [
    {
      icon: <Mail className="w-4 h-4" />,
      label: 'Email',
      value: user?.email || 'N/A',
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: 'Member Since',
      value: user?.createAt
        ? new Date(user.createAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'N/A',
    },
    {
      icon: <Shield className="w-4 h-4" />,
      label: 'Account Status',
      value: 'Active',
    },
    {
      icon: <Activity className="w-4 h-4" />,
      label: 'User ID',
      value: user?.userId ? String(user.userId).substring(0, 8) + '...' : 'N/A',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-violet-500/5" />
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">
            Welcome back, {user?.name || user?.email}!
          </h1>
          <p className="text-muted-foreground text-sm">Manage your account and explore all features</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {userStats.map((stat, index) => (
          <div
            key={index}
            className="bg-card rounded-xl p-4 border border-border hover:border-cyan-500/20 transition-colors"
          >
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="text-muted-foreground">{stat.icon}</span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-sm font-semibold text-foreground truncate">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className="group bg-card rounded-xl p-5 border border-border hover:border-cyan-500/30 transition-all"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${link.bg} border border-border flex items-center justify-center ${link.color} mb-3 group-hover:scale-105 transition-transform`}>
                {link.icon}
              </div>
              <h3 className="text-sm font-semibold mb-1 text-foreground group-hover:text-cyan-400 transition-colors">{link.title}</h3>
              <p className="text-xs text-muted-foreground">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Account Information</h2>
        <div className="divide-y divide-border">
          {[
            { label: 'Full Name', value: user?.name || 'Not set' },
            { label: 'Email Address', value: user?.email },
            { label: 'Account Status', value: 'Active', badge: true },
            { label: 'User ID', value: user?.userId || 'N/A', mono: true },
          ].map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3.5 gap-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.label}</span>
              {item.badge ? (
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center w-fit">
                  {item.value}
                </span>
              ) : (
                <span className={`text-sm font-medium text-foreground ${item.mono ? 'font-mono text-xs' : ''}`}>
                  {item.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

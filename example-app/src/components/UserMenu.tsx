import { useAuth } from 'nauth-react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { ROUTES } from '../lib/constants';

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  if (!user) return null;

  return (
    <div className="relative group">
      <button className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-secondary transition-colors">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
          {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium hidden md:block text-foreground">
          {user.name || user.email}
        </span>
      </button>

      <div className="absolute right-0 mt-1.5 w-56 bg-card rounded-xl shadow-xl shadow-black/20 border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="px-4 pt-4 pb-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
        </div>

        <div className="py-1.5">
          <Link
            to={ROUTES.PROFILE}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
        </div>

        <div className="border-t border-border p-1.5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

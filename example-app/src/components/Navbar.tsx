import { Link } from 'react-router-dom';
import { useAuth } from 'nauth-react';
import { APP_NAME, ROUTES } from '../lib/constants';
import { UserMenu } from './UserMenu';
import { LayoutDashboard, Tag, FolderTree, Newspaper, ChevronDown, FileText } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function Navbar() {
  const { isAuthenticated } = useAuth();
  const [newsMenuOpen, setNewsMenuOpen] = useState(false);
  const newsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (newsMenuRef.current && !newsMenuRef.current.contains(event.target as Node)) {
        setNewsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-1">
            <Link to={ROUTES.HOME} className="flex items-center gap-2.5 mr-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <Newspaper className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                {APP_NAME}
              </span>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to={ROUTES.DASHBOARD}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <div className="relative" ref={newsMenuRef}>
                  <button
                    onClick={() => setNewsMenuOpen(!newsMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Newspaper className="w-4 h-4" />
                    News
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${newsMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {newsMenuOpen && (
                    <div className="absolute top-full left-0 mt-1.5 w-48 bg-card border border-border rounded-xl shadow-xl shadow-black/20 py-1.5 z-50 animate-slide-down">
                      <Link
                        to={ROUTES.ARTICLES}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        onClick={() => setNewsMenuOpen(false)}
                      >
                        <FileText className="w-4 h-4" />
                        Articles
                      </Link>
                      <Link
                        to={ROUTES.CATEGORIES}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        onClick={() => setNewsMenuOpen(false)}
                      >
                        <FolderTree className="w-4 h-4" />
                        Categories
                      </Link>
                      <Link
                        to={ROUTES.TAGS}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        onClick={() => setNewsMenuOpen(false)}
                      >
                        <Tag className="w-4 h-4" />
                        Tags
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to={ROUTES.LOGIN}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Login
                </Link>
                <button
                  disabled
                  className="px-4 py-2 text-sm font-medium bg-secondary text-muted-foreground rounded-lg cursor-not-allowed opacity-50"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

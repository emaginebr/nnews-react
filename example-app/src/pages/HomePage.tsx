import { Link } from 'react-router-dom';
import { useAuth } from 'nauth-react';
import { ROUTES, APP_NAME, APP_DESCRIPTION } from '../lib/constants';
import { Users, CheckCircle, Sparkles, Newspaper, Tag, ArrowRight } from 'lucide-react';

export function HomePage() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: 'AI-Powered Content',
      description: 'Create and update articles using ChatGPT and DALL-E 3 for automatic content and image generation',
      accent: 'from-cyan-400/20 to-blue-500/20 border-cyan-500/20',
      iconColor: 'text-cyan-400',
    },
    {
      icon: <Newspaper className="w-5 h-5" />,
      title: 'Article Management',
      description: 'Complete CRUD operations for articles with rich text editing and categorization',
      accent: 'from-violet-400/20 to-purple-500/20 border-violet-500/20',
      iconColor: 'text-violet-400',
    },
    {
      icon: <Tag className="w-5 h-5" />,
      title: 'Tags & Categories',
      description: 'Organize content with automatic tag creation and hierarchical categories',
      accent: 'from-amber-400/20 to-orange-500/20 border-amber-500/20',
      iconColor: 'text-amber-400',
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Multi-tenant & RBAC',
      description: 'Multi-tenant support with role-based access control and secure authentication',
      accent: 'from-emerald-400/20 to-green-500/20 border-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Hero */}
      <div className="text-center py-16 md:py-24">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border text-xs font-medium text-muted-foreground mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          React Component Library
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-5 text-foreground leading-[1.1]">
          {APP_NAME}
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          {APP_DESCRIPTION}
        </p>

        <div className="flex gap-3 justify-center">
          {isAuthenticated ? (
            <Link
              to={ROUTES.DASHBOARD}
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all font-medium shadow-lg shadow-cyan-500/20"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <>
              <button
                disabled
                className="px-6 py-3 bg-secondary text-muted-foreground rounded-xl cursor-not-allowed opacity-50 font-medium"
              >
                Get Started
              </button>
              <Link
                to={ROUTES.LOGIN}
                className="px-6 py-3 bg-card text-foreground border border-border rounded-xl hover:bg-secondary transition-colors font-medium"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-4 mb-20">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`group p-6 bg-gradient-to-br ${feature.accent} rounded-xl border border-border hover:border-opacity-50 transition-all`}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className={`w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center ${feature.iconColor} mb-4`}>
              {feature.icon}
            </div>
            <h3 className="text-base font-semibold mb-2 text-foreground">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Tech Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-10 text-center mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5" />
        <div className="relative">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Powered by AI & Modern Tech</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {['ChatGPT Integration', 'DALL-E 3 Images', 'TypeScript & React'].map((item) => (
              <div key={item} className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          {!isAuthenticated && (
            <button
              disabled
              className="inline-block px-6 py-3 bg-secondary text-muted-foreground rounded-xl cursor-not-allowed opacity-50 font-medium"
            >
              Create Your Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

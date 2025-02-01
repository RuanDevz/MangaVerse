import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { cn } from '../lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { AuthModal } from './AuthModal';
import { SearchBar } from './SearchBar';
import { useAuthStore } from '../store/authStore';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const { user, signOut } = useAuthStore();

  const navItems = [
    { icon: Icons.Home, label: 'Home', href: '/' },
    { icon: Icons.TrendingUp, label: 'Popular', href: '/popular' },
    { icon: Icons.BookOpen, label: 'Latest', href: '/latest' },
    { icon: Icons.Heart, label: 'Favorites', href: '/favorites' },
  ];

  if (user?.role === 'admin') {
    navItems.push({
      icon: Icons.User,
      label: 'Admin',
      href: '/admin',
    });
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Icons.BookOpen className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold dark:text-white">MangaVerse</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <SearchBar />
              <ThemeToggle />

              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/subscription"
                    className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                  >
                    {user.subscription?.type
                      ? `${user.subscription.type} Plan`
                      : 'Subscribe'}
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <Icons.LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Sign In
                </button>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2"
              >
                <Icons.Menu className="w-6 h-6 dark:text-white" />
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={cn(
              'md:hidden',
              isMenuOpen ? 'block' : 'hidden'
            )}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
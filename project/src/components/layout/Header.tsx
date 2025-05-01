import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Menu, X, Sun, Moon, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';

const Header = () => {
  const { user, logout, isAuthenticated, hasPermission } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-500 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300';
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <MapPin className="h-6 w-6 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">MapMaster</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`${isActive('/')} hover:text-blue-500 transition-colors font-medium`}
            >
              Home
            </Link>
            <Link
              to="/map"
              className={`${isActive('/map')} hover:text-blue-500 transition-colors font-medium`}
            >
              Map
            </Link>
            {isAuthenticated && (
              <Link
                to="/profile"
                className={`${isActive('/profile')} hover:text-blue-500 transition-colors font-medium`}
              >
                My Profile
              </Link>
            )}
            {isAuthenticated && hasPermission('user:manage') && (
              <Link
                to="/admin"
                className={`${isActive('/admin')} hover:text-blue-500 transition-colors font-medium`}
              >
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* User controls */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      {user?.role === 'admin' ? (
                        <>
                          <Shield className="h-3 w-3 mr-1 text-blue-500" />
                          Admin
                        </>
                      ) : (
                        <>
                          <User className="h-3 w-3 mr-1 text-green-500" />
                          User
                        </>
                      )}
                    </span>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  icon={<LogOut className="h-4 w-4" />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile navigation menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-4 pb-4">
              <Link
                to="/"
                className={`${isActive('/')} hover:text-blue-500 transition-colors font-medium`}
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                to="/map"
                className={`${isActive('/map')} hover:text-blue-500 transition-colors font-medium`}
                onClick={closeMenu}
              >
                Map
              </Link>
              {isAuthenticated && (
                <Link
                  to="/profile"
                  className={`${isActive('/profile')} hover:text-blue-500 transition-colors font-medium`}
                  onClick={closeMenu}
                >
                  My Profile
                </Link>
              )}
              {isAuthenticated && hasPermission('user:manage') && (
                <Link
                  to="/admin"
                  className={`${isActive('/admin')} hover:text-blue-500 transition-colors font-medium`}
                  onClick={closeMenu}
                >
                  Admin Dashboard
                </Link>
              )}
            </nav>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={toggleTheme}
                className="flex items-center px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-5 w-5 text-yellow-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5 text-gray-700 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                  </>
                )}
              </button>

              {isAuthenticated ? (
                <div className="mt-4">
                  <div className="flex items-center mb-3">
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        {user?.role === 'admin' ? (
                          <>
                            <Shield className="h-3 w-3 mr-1 text-blue-500" />
                            Admin
                          </>
                        ) : (
                          <>
                            <User className="h-3 w-3 mr-1 text-green-500" />
                            User
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    icon={<LogOut className="h-4 w-4" />}
                    onClick={handleLogout}
                    className="w-full justify-center mt-2"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 mt-4">
                  <Link to="/login" onClick={closeMenu}>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={closeMenu}>
                    <Button variant="primary" className="w-full">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
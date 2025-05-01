import { MapPin, Github, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <MapPin className="h-6 w-6 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">MapMaster</span>
            </Link>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Your interactive mapping platform for creating and sharing landmarks and routes.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-500 hover:text-blue-500 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Platform</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/map" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  Interactive Map
                </Link>
              </li>
              <li>
                <Link to="/landmarks" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  Landmarks
                </Link>
              </li>
              <li>
                <Link to="/routes" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  Routes
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/help" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  Tutorials
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            &copy; {currentYear} MapMaster. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
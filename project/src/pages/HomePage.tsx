import { Link } from 'react-router-dom';
import { MapPin, Map, Users, Shield, Sun, Moon } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <PageLayout>
      {/* Hero section */}
      <section className="relative bg-gradient-to-br from-blue-500 to-blue-700 text-white">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/355887/pexels-photo-355887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Create, Share, and Explore Interactive Maps
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              A powerful platform for creating custom maps with landmarks and routes that you can share with others.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/map">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore Maps
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/register">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                    Sign Up Free
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Powerful Features
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-transform hover:scale-105">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Custom Landmarks</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create personalized landmarks with detailed information, categories, and custom styles to mark important locations.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-transform hover:scale-105">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-lg flex items-center justify-center mb-4">
                <Map className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Interactive Routes</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Design custom routes with multiple points, color-coding, and distance calculations for trips, hikes, or city tours.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-transform hover:scale-105">
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">User Collaboration</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Share your maps with others and collaborate on projects with fine-grained permission controls.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-transform hover:scale-105">
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Role-Based Access</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Secure your map data with role-based access control, ensuring only authorized users can view or edit content.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-transform hover:scale-105">
              <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300 rounded-lg flex items-center justify-center mb-4">
                <Sun className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Light Mode</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enjoy a clean, bright interface during the day with our carefully designed light theme that's easy on the eyes.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-transform hover:scale-105">
              <div className="h-12 w-12 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg flex items-center justify-center mb-4">
                <Moon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Dark Mode</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Switch to our sleek dark mode for comfortable night-time viewing and reduced eye strain in low-light environments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Create Account</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sign up for a free account to start creating your own custom maps.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Add Content</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create landmarks and routes on the interactive map with our easy-to-use tools.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Share & Explore</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Share your maps with others or explore maps created by the community.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/map">
              <Button size="lg">
                Try It Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to create your custom maps?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of users who are already creating amazing interactive maps with our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/map">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Explore Maps
              </Button>
            </Link>
            {!isAuthenticated ? (
              <Link to="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                  Sign Up Free
                </Button>
              </Link>
            ) : (
              <Link to="/profile">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                  Go to Profile
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default HomePage;
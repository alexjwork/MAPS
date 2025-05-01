import { BrowserRouter as Router } from 'react-router-dom';
import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  // Set the page title
  useEffect(() => {
    document.title = 'MapMaster - Interactive Map Platform';
  }, []);

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
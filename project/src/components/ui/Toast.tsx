import { X } from 'lucide-react';
import { ToastType } from '../../context/ToastContext';
import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
  const [visible, setVisible] = useState(false);

  // Handle animations
  useEffect(() => {
    setVisible(true);
    
    return () => {
      setVisible(false);
    };
  }, []);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 border-green-500';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 border-red-500';
      case 'warning':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100 border-amber-500';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 border-blue-500';
    }
  };

  return (
    <div
      className={`${getToastStyles()} px-4 py-3 rounded-lg shadow-md max-w-md border-l-4 flex items-center justify-between transform transition-all duration-300 ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
    >
      <span className="font-medium">{message}</span>
      <button 
        onClick={onClose}
        className="ml-4 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
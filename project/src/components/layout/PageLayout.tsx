import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface PageLayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const PageLayout = ({ children, hideFooter = false }: PageLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-800">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default PageLayout;
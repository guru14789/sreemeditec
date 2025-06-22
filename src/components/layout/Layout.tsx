
import { ReactNode } from 'react';


interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-1">
        {children}
      </main>
      
    </div>
  );
};

export default Layout;

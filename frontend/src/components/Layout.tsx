
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import SystemProgressStatus from './SystemProgressStatus';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-ajh-darker flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Componente de progresso para desenvolvimento */}
      <SystemProgressStatus />
    </div>
  );
};

export default Layout;

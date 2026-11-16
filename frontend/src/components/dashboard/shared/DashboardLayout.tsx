import React from 'react';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-ambient-pattern flex flex-col md:flex-row overflow-hidden font-sans relative">
            {children}
        </div>
    );
};
export default DashboardLayout;

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 max-w-[100vw] overflow-hidden">
            <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
            <div className="flex-1 flex flex-col min-w-0">
                <Header isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="p-3 sm:p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

import { Outlet } from 'react-router-dom';
import LabSidebar from '../components/layout/LabSidebar'; // Correct path to components/layout

export default function LabLayout() {
    return (
        <div className="flex h-screen bg-gray-100">
            <LabSidebar />
            <div className="flex-1 ml-64 overflow-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

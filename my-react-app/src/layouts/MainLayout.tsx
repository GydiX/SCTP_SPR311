import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import MusicPlayer from "../components/MusicPlayer";
import AddTrackForm from "../components/AddTrackForm";
import Sidebar from "../components/Sidebar";
import SpotifyHeader from "../components/SpotifyHeader";

const MainLayout: React.FC = () => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [showAddTrackForm, setShowAddTrackForm] = useState(false);
    const [tracksReloadKey, setTracksReloadKey] = useState(0);
    const [justAddedTrackId, setJustAddedTrackId] = useState<string | undefined>(undefined);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const location = useLocation();

    const handleTrackChange = (index: number) => {
        setCurrentTrackIndex(index);
    };

    const handleTrackAdded = (newTrack: any) => {
        console.log('Новий трек додано:', newTrack);
        // Оновити список треків у програвачі
        setTracksReloadKey(prev => prev + 1);
        setJustAddedTrackId(newTrack?.id);
    };

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    // Закривати модалку при зміні маршруту
    useEffect(() => {
        if (showAddTrackForm) {
            setShowAddTrackForm(false);
        }
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex bg-black text-white">
            {/* Sidebar */}
            <Sidebar isCollapsed={isSidebarCollapsed} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <SpotifyHeader 
                    onToggleSidebar={toggleSidebar}
                    isSidebarCollapsed={isSidebarCollapsed}
                />

                {/* Main Content */}
                <main className="flex-1 bg-gradient-to-b from-gray-900 to-black overflow-y-auto">
                    <div className="p-6 pb-24">
                        <Outlet />
                    </div>
                </main>

                {/* Music Player */}
                <MusicPlayer 
                    currentTrackIndex={currentTrackIndex}
                    onTrackChange={handleTrackChange}
                    reloadKey={tracksReloadKey}
                    desiredTrackId={justAddedTrackId}
                />
            </div>

            {/* Add Track Form Modal */}
            {showAddTrackForm && (
                <AddTrackForm
                    onTrackAdded={handleTrackAdded}
                    onClose={() => setShowAddTrackForm(false)}
                />
            )}
        </div>
    );
};

export default MainLayout;
import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import MusicPlayer from "../components/MusicPlayer";
import AddTrackForm from "../components/AddTrackForm";

const MainLayout: React.FC = () => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [showAddTrackForm, setShowAddTrackForm] = useState(false);

    const handleTrackChange = (index: number) => {
        setCurrentTrackIndex(index);
    };

    const handleTrackAdded = (newTrack: any) => {
        console.log('Новий трек додано:', newTrack);
        // Тут можна додати логіку для оновлення списку треків
    };

    return (
        <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
            {/* Header */}
            <header className="bg-white dark:bg-neutral-800 shadow-sm border-b border-black/10 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <Link to="/" className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
                        Наш магазин
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-md mx-8">
                        <SearchBar />
                    </div>

                    <nav className="flex items-center gap-4">
                        <button
                            onClick={() => setShowAddTrackForm(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                        >
                            + Додати трек
                        </button>
                        <Link
                            to="/login"
                            className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                        >
                            Вхід
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 pb-24">
                <Outlet />
            </main>

            {/* Music Player */}
            <MusicPlayer 
                currentTrackIndex={currentTrackIndex}
                onTrackChange={handleTrackChange}
            />

            {/* Add Track Form Modal */}
            {showAddTrackForm && (
                <AddTrackForm
                    onTrackAdded={handleTrackAdded}
                    onClose={() => setShowAddTrackForm(false)}
                />
            )}

            {/* Footer */}
            <footer className="bg-white dark:bg-neutral-800 border-t border-black/10 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-neutral-500 dark:text-neutral-400 text-center">
                    © {new Date().getFullYear()} MyApp. Усі права захищені.
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
    return (
        <div className="w-full">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-4">Добро пожаловать в MusicApp</h1>
                <p className="text-xl text-gray-400">Відкрийте світ музики разом з нами</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Link to="/search" className="spotify-card p-6 group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🔍</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">
                                Пошук музики
                            </h3>
                            <p className="text-gray-400 text-sm">Знайдіть свої улюблені треки</p>
                        </div>
                    </div>
                </Link>

                <Link to="/playlists" className="spotify-card p-6 group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-2xl">📋</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                                Плейлисти
                            </h3>
                            <p className="text-gray-400 text-sm">Створюйте та керуйте плейлистами</p>
                        </div>
                    </div>
                </Link>

                <Link to="/users" className="spotify-card p-6 group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-2xl">👥</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                                Користувачі
                            </h3>
                            <p className="text-gray-400 text-sm">Переглядайте користувачів системи</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recent Activity */}
            <div className="spotify-card p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Остання активність</h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-sm">🎵</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-medium">Новий трек додано</p>
                            <p className="text-gray-400 text-sm">2 години тому</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-sm">📋</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-medium">Створено новий плейлист</p>
                            <p className="text-gray-400 text-sm">1 день тому</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-sm">👤</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-medium">Новий користувач зареєстрований</p>
                            <p className="text-gray-400 text-sm">3 дні тому</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="spotify-card p-6 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">1,234</div>
                    <div className="text-gray-400">Треків</div>
                </div>
                
                <div className="spotify-card p-6 text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">56</div>
                    <div className="text-gray-400">Плейлистів</div>
                </div>
                
                <div className="spotify-card p-6 text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">89</div>
                    <div className="text-gray-400">Користувачів</div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;

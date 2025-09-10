import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isCollapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false }) => {
  const location = useLocation();

  const navigationItems = [
    { name: 'Головна', path: '/', icon: '🏠' },
    { name: 'Пошук', path: '/search', icon: '🔍' },
    { name: 'Плейлисти', path: '/playlists', icon: '📋' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`bg-black text-white h-full flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Logo */}
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-lg">M</span>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold">MusicApp</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>

        {/* Playlists Section */}
        {!isCollapsed && (
          <div className="mt-8">
            <div className="px-3 py-2">
              <button className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                <span className="text-lg">➕</span>
                <span className="text-sm font-medium">Створити плейлист</span>
              </button>
            </div>
            
            <div className="px-3 py-2">
              <button className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                <span className="text-lg">❤️</span>
                <span className="text-sm font-medium">Улюблені треки</span>
              </button>
            </div>
          </div>
        )}

        {/* Additional Options */}
        {!isCollapsed && (
          <div className="mt-4">
            <Link
              to="/users"
              className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/users')
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="text-lg">👥</span>
              <span>Користувачі</span>
            </Link>
          </div>
        )}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-gray-800">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800 transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Користувач</p>
              <p className="text-xs text-gray-400 truncate">Профіль</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mx-auto">
            <span className="text-sm">👤</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

interface SpotifyHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

const SpotifyHeader: React.FC<SpotifyHeaderProps> = ({ 
  onToggleSidebar, 
  isSidebarCollapsed = false 
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigationButtons = [
    { name: 'Назад', icon: '←', action: () => window.history.back() },
    { name: 'Вперед', icon: '→', action: () => window.history.forward() },
  ];

  return (
    <header className="bg-black bg-opacity-80 backdrop-blur-md border-b border-gray-800">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left Section - Navigation Buttons */}
        <div className="flex items-center space-x-2">
          {navigationButtons.map((button, index) => (
            <button
              key={index}
              onClick={button.action}
              className="w-8 h-8 bg-black bg-opacity-70 rounded-full flex items-center justify-center text-white hover:bg-opacity-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title={button.name}
            >
              <span className="text-sm">{button.icon}</span>
            </button>
          ))}
          
          {/* Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className="w-8 h-8 bg-black bg-opacity-70 rounded-full flex items-center justify-center text-white hover:bg-opacity-100 transition-all duration-200 ml-2"
            title={isSidebarCollapsed ? 'Розгорнути меню' : 'Згорнути меню'}
          >
            <span className="text-sm">☰</span>
          </button>
        </div>

        {/* Center Section - Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <SearchBar />
        </div>

        {/* Right Section - User Menu */}
        <div className="flex items-center space-x-4">
          {/* Add Track Button */}
          <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
            + Додати трек
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 bg-black bg-opacity-70 hover:bg-opacity-100 rounded-full p-1 transition-all duration-200"
            >
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
              <span className="text-white text-sm font-medium hidden sm:block">Користувач</span>
              <span className="text-white text-sm">▼</span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg border border-gray-700 z-50">
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Профіль
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Налаштування
                  </Link>
                  <hr className="my-1 border-gray-700" />
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                    onClick={() => {
                      setShowUserMenu(false);
                      // Handle logout
                    }}
                  >
                    Вийти
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SpotifyHeader;


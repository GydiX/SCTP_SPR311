import React from "react";
import { Outlet, Link } from "react-router-dom";

const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
            {/* Header */}
            <header className="bg-white dark:bg-neutral-800 shadow-sm border-b border-black/10 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <Link to="/" className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
                        Наш магазин
                    </Link>

                    <nav className="flex items-center gap-4">
                        {/*<Link*/}
                        {/*    to="/"*/}
                        {/*    className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"*/}
                        {/*>*/}
                        {/*    Користувачі*/}
                        {/*</Link>*/}
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
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
                <Outlet />
            </main>

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

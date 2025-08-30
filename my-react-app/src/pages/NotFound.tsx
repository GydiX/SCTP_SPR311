import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900 text-center px-4">
            <h1 className="text-6xl font-bold text-neutral-800 dark:text-neutral-100">404</h1>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
                Сторінку не знайдено.
            </p>
            <Link
                to="/"
                className="mt-6 inline-block rounded-2xl bg-blue-600 px-6 py-3 text-white font-medium shadow hover:bg-blue-700 transition"
            >
                На головну
            </Link>
        </div>
    );
};

export default NotFound;

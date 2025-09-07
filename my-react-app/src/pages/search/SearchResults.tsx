import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import EnvConfig from '../../config/env';
import type { ITrack, ISearchResults } from './types';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<ISearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      searchTracks(query);
    }
  }, [query]);

  const searchTracks = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${EnvConfig.API_URL}/api/tracks/search`, {
        params: { q: searchQuery }
      });
      setResults(response.data);
    } catch (err) {
      setError('Помилка при пошуку треків');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Пошук треків...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600 dark:text-neutral-400">Введіть запит для пошуку</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Результати пошуку для "{query}"
        </h1>
        {results && (
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Знайдено {results.total} треків
          </p>
        )}
      </div>

      {results && results.tracks.length > 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left align-middle">
              <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 font-semibold">#</th>
                  <th className="px-5 py-3 font-semibold">Трек</th>
                  <th className="px-5 py-3 font-semibold">Альбом</th>
                  <th className="px-5 py-3 font-semibold">Тривалість</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {results.tracks.map((track: ITrack, index: number) => (
                  <tr key={track.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800">
                    <td className="px-5 py-4 text-neutral-500 dark:text-neutral-400">
                      {index + 1}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {track.imageUrl && (
                          <img
                            src={track.imageUrl}
                            alt={track.title}
                            className="h-10 w-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-neutral-100">
                            {track.title}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {track.artist}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-neutral-600 dark:text-neutral-300">
                      {track.album}
                    </td>
                    <td className="px-5 py-4 text-neutral-500 dark:text-neutral-400">
                      {formatDuration(track.duration)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : results && results.tracks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-600 dark:text-neutral-400">
            Треків не знайдено. Спробуйте інший запит.
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default SearchResults;
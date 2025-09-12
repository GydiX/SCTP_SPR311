import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import EnvConfig from '../../config/env';
import type { ITrack, ISearchResults } from './types';
import AddTrackForm from '../../components/AddTrackForm';
import { trackService } from '../../services/trackService';
import { spotifyService, type SpotifyTrackItem } from '../../services/spotifyService';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<ISearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [spotifyItems, setSpotifyItems] = useState<SpotifyTrackItem[] | null>(null);
  const [spotifyError, setSpotifyError] = useState<string | null>(null);
  const [spotifyLoading, setSpotifyLoading] = useState(false);

  useEffect(() => {
    if (query) {
      searchTracks(query);
    }
  }, [query]);

  const searchTracks = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${EnvConfig.API_URL || 'http://localhost:5264'}/api/tracks/search`, {
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

  useEffect(() => {
    const searchSpotify = async () => {
      if (!query) {
        setSpotifyItems(null);
        return;
      }
      setSpotifyLoading(true);
      setSpotifyError(null);
      try {
        const items = await spotifyService.searchTracks(query);
        setSpotifyItems(items);
      } catch (e) {
        setSpotifyError('Помилка при пошуку у Spotify');
        setSpotifyItems(null);
      } finally {
        setSpotifyLoading(false);
      }
    };
    searchSpotify();
  }, [query]);

  const handleSeedTracks = async () => {
    try {
      setActionMessage(null);
      await trackService.seedTracks();
      if (query) {
        await searchTracks(query);
      }
      setActionMessage('Тестові треки додано.');
    } catch (e) {
      setActionMessage('Не вдалося додати тестові треки.');
    }
  };

  const handleDeleteAll = async () => {
    try {
      setActionMessage(null);
      await trackService.deleteAllTracks();
      if (query) {
        await searchTracks(query);
      } else {
        setResults({ tracks: [], total: 0, query: '' });
      }
      setActionMessage('Всі треки видалено.');
    } catch (e) {
      setActionMessage('Не вдалося видалити треки.');
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
        <div className="mt-3 flex gap-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Додати трек
          </button>
          <button
            onClick={handleSeedTracks}
            className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white"
          >
            Додати демо-треки
          </button>
          <button
            onClick={handleDeleteAll}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Видалити всі треки
          </button>
        </div>
        {actionMessage && (
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{actionMessage}</p>
        )}
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
                  <th className="px-5 py-3 font-semibold"></th>
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
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => window.dispatchEvent(new CustomEvent('app:play-track', { detail: { id: track.id } }))}
                        className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        ▶️ Пуск
                      </button>
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

      {/* Spotify results */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Результати Spotify</h2>
        {spotifyLoading && (
          <p className="text-neutral-500">Пошук у Spotify...</p>
        )}
        {spotifyError && (
          <p className="text-red-500">{spotifyError}</p>
        )}
        {spotifyItems && spotifyItems.length > 0 && (
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left align-middle">
                <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3 font-semibold">#</th>
                    <th className="px-5 py-3 font-semibold">Трек</th>
                    <th className="px-5 py-3 font-semibold">Альбом</th>
                    <th className="px-5 py-3 font-semibold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                  {spotifyItems.map((t, idx) => (
                    <tr key={t.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800">
                      <td className="px-5 py-4 text-neutral-500 dark:text-neutral-400">{idx + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {t.album?.images?.[0]?.url && (
                            <img src={t.album.images[0].url} alt={t.name} className="h-10 w-10 rounded object-cover" />
                          )}
                          <div>
                            <div className="font-medium text-neutral-900 dark:text-neutral-100">{t.name}</div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">
                              {t.artists?.map(a => a.name).join(', ')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-neutral-600 dark:text-neutral-300">{t.album?.name}</td>
                      <td className="px-5 py-4 text-right">
                        {t.preview_url ? (
                          <audio controls src={t.preview_url} className="h-8" />
                        ) : (
                          <span className="text-xs text-neutral-500">нема прев'ю</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showAddForm && (
        <AddTrackForm
          onClose={() => setShowAddForm(false)}
          onTrackAdded={() => {
            setShowAddForm(false);
            if (query) {
              searchTracks(query);
            }
          }}
        />
      )}
    </div>
  );
};

export default SearchResults;
import React, { useState, useRef, useEffect } from 'react';
import { trackService } from '../services/trackService';
import type { Track } from '../services/trackService';

// Використовуємо Track з trackService

interface MusicPlayerProps {
  tracks?: Track[];
  currentTrackIndex?: number;
  onTrackChange?: (index: number) => void;
  reloadKey?: number;
  desiredTrackId?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  tracks = [], 
  currentTrackIndex = 0, 
  onTrackChange,
  reloadKey,
  desiredTrackId
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const userPausedRef = useRef<boolean>(false);

  // Завантаження треків з API
  const [apiTracks, setApiTracks] = useState<Track[]>([]);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const tracks = await trackService.getAllTracks();
        setApiTracks(tracks);
      } catch (error) {
        console.error('Помилка при завантаженні треків:', error);
      }
    };

    loadTracks();
  }, [reloadKey]);

  // Після завантаження треків — якщо задано потрібний трек, переключитися на нього і відтворити
  useEffect(() => {
    if (!desiredTrackId) return;
    const tracksToUse = tracks.length > 0 ? tracks : (apiTracks.length > 0 ? apiTracks : []);
    if (tracksToUse.length === 0) return;
    const index = tracksToUse.findIndex(t => t.id === desiredTrackId);
    if (index >= 0) {
      onTrackChange?.(index);
      // Дати React змінити трек, потім спробувати автопрогравання
      setTimeout(() => {
        if (!userPausedRef.current && audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      }, 50);
    }
  }, [desiredTrackId, apiTracks, tracks]);

  // Демо треки для тестування (якщо API недоступний)
  const demoTracks: Track[] = [
    {
      id: '1',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      album: 'A Night at the Opera',
      duration: 355,
      imageUrl: 'https://via.placeholder.com/60x60/1db954/ffffff?text=Q',
    },
    {
      id: '2',
      title: 'Imagine',
      artist: 'John Lennon',
      album: 'Imagine',
      duration: 183,
      imageUrl: 'https://via.placeholder.com/60x60/1db954/ffffff?text=JL',
    },
    {
      id: '3',
      title: 'Hotel California',
      artist: 'Eagles',
      album: 'Hotel California',
      duration: 391,
      imageUrl: 'https://via.placeholder.com/60x60/1db954/ffffff?text=E',
    }
  ];

  const currentTracks = tracks.length > 0 ? tracks : (apiTracks.length > 0 ? apiTracks : demoTracks);
  const currentTrack = currentTracks[currentTrackIndex] || currentTracks[0];

  // Оновлення часу відтворення
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleAudioPlay = () => { setIsPlaying(true); userPausedRef.current = false; };
    const handleAudioPause = () => { setIsPlaying(false); userPausedRef.current = true; };
    const handleAudioEnded = () => { setIsPlaying(false); };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('play', handleAudioPlay);
    audio.addEventListener('pause', handleAudioPause);
    audio.addEventListener('ended', handleAudioEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('play', handleAudioPlay);
      audio.removeEventListener('pause', handleAudioPause);
      audio.removeEventListener('ended', handleAudioEnded);
    };
  }, []);

  // Обробка зміни треку
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex, currentTrack]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      userPausedRef.current = false;
      audio.play().catch(() => {});
    } else {
      userPausedRef.current = true;
      audio.pause();
    }
    // isPlaying will be synced by audio 'play'/'pause' event listeners
  };

  const handlePrevious = () => {
    const newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : currentTracks.length - 1;
    onTrackChange?.(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentTrackIndex < currentTracks.length - 1 ? currentTrackIndex + 1 : 0;
    onTrackChange?.(newIndex);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-700 px-4 py-3 music-player">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Поточний трек */}
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          {currentTrack?.imageUrl && (
            <img
              src={currentTrack.imageUrl}
              alt={currentTrack.title}
              className="w-14 h-14 rounded object-cover track-cover"
            />
          )}
          <div className="min-w-0 flex-1">
            <h4 className="text-white text-sm font-medium truncate">
              {currentTrack?.title || 'Немає треку'}
            </h4>
            <p className="text-neutral-400 text-xs truncate">
              {currentTrack?.artist || 'Невідомий виконавець'}
            </p>
          </div>
        </div>

        {/* Центральні контроли */}
        <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
          {/* Кнопки навігації */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrevious}
              className="text-neutral-400 hover:text-white transition-colors music-player-controls"
              title="Попередній трек"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
              </svg>
            </button>

            <button
              onClick={togglePlayPause}
              className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform play-button"
              title={isPlaying ? 'Пауза' : 'Відтворення'}
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            <button
              onClick={handleNext}
              className="text-neutral-400 hover:text-white transition-colors music-player-controls"
              title="Наступний трек"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
              </svg>
            </button>
          </div>

          {/* Прогрес-бар */}
          <div className="flex items-center space-x-2 w-full">
            <span className="text-xs text-neutral-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleProgressChange}
              className="flex-1 h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer music-player-progress"
              style={{
                '--progress': `${(currentTime / duration) * 100}%`
              } as React.CSSProperties}
            />
            <span className="text-xs text-neutral-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Контроль гучності */}
        <div className="flex items-center space-x-2 min-w-0 flex-1 justify-end">
          <svg className="w-4 h-4 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer music-player-volume"
          />
        </div>

        {/* Прихований audio елемент */}
        <audio
          ref={audioRef}
          preload="metadata"
          onEnded={handleNext}
        >
          <source src={currentTrack?.previewUrl} type="audio/mpeg" />
          Ваш браузер не підтримує аудіо елемент.
        </audio>
      </div>

    </div>
  );
};

export default MusicPlayer;

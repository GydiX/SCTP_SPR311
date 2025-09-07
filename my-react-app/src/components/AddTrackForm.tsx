import React, { useState } from 'react';

interface TrackFormData {
  title: string;
  artist: string;
  album: string;
  duration: number;
  imageUrl: string;
  previewUrl: string;
}

interface AddTrackFormProps {
  onTrackAdded?: (track: any) => void;
  onClose?: () => void;
}

const AddTrackForm: React.FC<AddTrackFormProps> = ({ onTrackAdded, onClose }) => {
  const [formData, setFormData] = useState<TrackFormData>({
    title: '',
    artist: '',
    album: '',
    duration: 0,
    imageUrl: '',
    previewUrl: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof TrackFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TrackFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Назва треку обов\'язкова';
    }

    if (!formData.artist.trim()) {
      newErrors.artist = 'Виконавець обов\'язковий';
    }

    if (!formData.album.trim()) {
      newErrors.album = 'Альбом обов\'язковий';
    }

    if (formData.duration <= 0) {
      newErrors.duration = 'Тривалість повинна бути більше 0';
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Неправильний формат URL';
    }

    if (formData.previewUrl && !isValidUrl(formData.previewUrl)) {
      newErrors.previewUrl = 'Неправильний формат URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 0 : value
    }));

    // Очистити помилку при зміні поля
    if (errors[name as keyof TrackFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5264/api/tracks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка при створенні треку');
      }

      const newTrack = await response.json();
      onTrackAdded?.(newTrack);
      
      // Очистити форму
      setFormData({
        title: '',
        artist: '',
        album: '',
        duration: 0,
        imageUrl: '',
        previewUrl: ''
      });

      onClose?.();
    } catch (error) {
      console.error('Помилка при створенні треку:', error);
      alert('Помилка при створенні треку. Спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Додати новий трек
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Назва треку *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.title ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
              } bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white`}
              placeholder="Введіть назву треку"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Виконавець *
            </label>
            <input
              type="text"
              name="artist"
              value={formData.artist}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.artist ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
              } bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white`}
              placeholder="Введіть ім'я виконавця"
            />
            {errors.artist && (
              <p className="text-red-500 text-xs mt-1">{errors.artist}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Альбом *
            </label>
            <input
              type="text"
              name="album"
              value={formData.album}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.album ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
              } bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white`}
              placeholder="Введіть назву альбому"
            />
            {errors.album && (
              <p className="text-red-500 text-xs mt-1">{errors.album}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Тривалість (секунди) *
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              min="1"
              max="3600"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.duration ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
              } bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white`}
              placeholder="Введіть тривалість в секундах"
            />
            {formData.duration > 0 && (
              <p className="text-sm text-neutral-500 mt-1">
                {formatDuration(formData.duration)}
              </p>
            )}
            {errors.duration && (
              <p className="text-red-500 text-xs mt-1">{errors.duration}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              URL зображення
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.imageUrl ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
              } bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.imageUrl && (
              <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              URL прев'ю (аудіо)
            </label>
            <input
              type="url"
              name="previewUrl"
              value={formData.previewUrl}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.previewUrl ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
              } bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white`}
              placeholder="https://example.com/preview.mp3"
            />
            {errors.previewUrl && (
              <p className="text-red-500 text-xs mt-1">{errors.previewUrl}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white transition-colors"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Додавання...' : 'Додати трек'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTrackForm;

const API_BASE_URL = 'http://localhost:5264/api/tracks';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  imageUrl?: string;
  previewUrl?: string;
}

export interface CreateTrackData {
  title: string;
  artist: string;
  album: string;
  duration: number;
  imageUrl?: string;
  previewUrl?: string;
}

export interface SearchResults {
  tracks: Track[];
  total: number;
  query: string;
}

class TrackService {
  async searchTracks(query: string): Promise<SearchResults> {
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Помилка при пошуку треків');
    }
    
    return response.json();
  }

  async getAllTracks(): Promise<Track[]> {
    const response = await fetch(`${API_BASE_URL}/all`);
    
    if (!response.ok) {
      throw new Error('Помилка при завантаженні треків');
    }
    
    return response.json();
  }

  async getTrackById(id: string): Promise<Track> {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Трек не знайдено');
      }
      throw new Error('Помилка при завантаженні треку');
    }
    
    return response.json();
  }

  async createTrack(trackData: CreateTrackData): Promise<Track> {
    const response = await fetch(`${API_BASE_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trackData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Помилка при створенні треку');
    }
    
    return response.json();
  }

  async updateTrack(id: string, trackData: CreateTrackData): Promise<Track> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trackData),
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Трек не знайдено');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Помилка при оновленні треку');
    }
    
    return response.json();
  }

  async deleteTrack(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Трек не знайдено');
      }
      throw new Error('Помилка при видаленні треку');
    }
  }

  async seedTracks(): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/seed`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Помилка при додаванні тестових треків');
    }
    
    return response.text();
  }
}

export const trackService = new TrackService();

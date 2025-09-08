import EnvConfig from '../config/env';

const API_BASE = `${EnvConfig.API_URL || 'http://localhost:5264'}/api/spotify`;

export interface SpotifyTrackItem {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images?: { url: string }[] };
  preview_url?: string;
  duration_ms?: number;
}

export interface SpotifySearchResponse {
  tracks: { items: SpotifyTrackItem[] };
}

export const spotifyService = {
  async searchTracks(query: string): Promise<SpotifyTrackItem[]> {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&type=track&limit=10`);
    if (!res.ok) throw new Error('Spotify search failed');
    const data: SpotifySearchResponse = await res.json();
    return data.tracks?.items || [];
  },

  async getTrack(id: string): Promise<SpotifyTrackItem> {
    const res = await fetch(`${API_BASE}/tracks/${id}`);
    if (!res.ok) throw new Error('Spotify get track failed');
    return res.json();
  }
};



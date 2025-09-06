import type { Playlist, Track } from "../types/playlists";
import EnvConfig from "../config/env";

const API_BASE_URL = EnvConfig.API_URL;

interface ApiPlaylist {
    id: number;
    name: string;
    userId: number;
    createdAt: string;
    updatedAt?: string;
    tracks: ApiTrack[];
}

interface ApiTrack {
    id: number;
    trackId: string;
    title: string;
    artist?: string;
    durationMs?: number;
    addedAt: string;
}

interface CreatePlaylistRequest {
    name: string;
}

interface AddTrackRequest {
    trackId: string;
    title: string;
    artist?: string;
    durationMs?: number;
}

interface UpdatePlaylistRequest {
    name: string;
}

function convertApiPlaylistToPlaylist(apiPlaylist: ApiPlaylist): Playlist {
    return {
        id: apiPlaylist.id.toString(),
        name: apiPlaylist.name,
        tracks: apiPlaylist.tracks.map(convertApiTrackToTrack),
        createdAt: apiPlaylist.createdAt
    };
}

function convertApiTrackToTrack(apiTrack: ApiTrack): Track {
    return {
        id: apiTrack.trackId,
        title: apiTrack.title,
        artist: apiTrack.artist,
        durationMs: apiTrack.durationMs
    };
}

async function makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

export async function listPlaylists(): Promise<Playlist[]> {
    const apiPlaylists = await makeRequest<ApiPlaylist[]>('/api/playlists');
    return apiPlaylists.map(convertApiPlaylistToPlaylist);
}

export async function getPlaylist(id: string): Promise<Playlist> {
    const apiPlaylist = await makeRequest<ApiPlaylist>(`/api/playlists/${id}`);
    return convertApiPlaylistToPlaylist(apiPlaylist);
}

export async function createPlaylist(name: string): Promise<Playlist> {
    const request: CreatePlaylistRequest = { name };
    const apiPlaylist = await makeRequest<ApiPlaylist>('/api/playlists', {
        method: 'POST',
        body: JSON.stringify(request),
    });
    return convertApiPlaylistToPlaylist(apiPlaylist);
}

export async function updatePlaylist(id: string, name: string): Promise<void> {
    const request: UpdatePlaylistRequest = { name };
    await makeRequest(`/api/playlists/${id}`, {
        method: 'PUT',
        body: JSON.stringify(request),
    });
}

export async function deletePlaylist(id: string): Promise<void> {
    await makeRequest(`/api/playlists/${id}`, {
        method: 'DELETE',
    });
}

export async function addTrackToPlaylist(playlistId: string, track: Track): Promise<void> {
    const request: AddTrackRequest = {
        trackId: track.id,
        title: track.title,
        artist: track.artist,
        durationMs: track.durationMs,
    };
    await makeRequest(`/api/playlists/${playlistId}/tracks`, {
        method: 'POST',
        body: JSON.stringify(request),
    });
}

export async function removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<void> {
    await makeRequest(`/api/playlists/${playlistId}/tracks/${trackId}`, {
        method: 'DELETE',
    });
}

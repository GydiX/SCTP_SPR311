import {Playlist, Track} from "../types/playlists";

const STORAGE_KEY = "app.playlists";

function loadAll(): Playlist[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as Playlist[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveAll(playlists: Playlist[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
}

export function listPlaylists(): Playlist[] {
    return loadAll();
}

export function createPlaylist(name: string): Playlist {
    const playlists = loadAll();
    const playlist: Playlist = {
        id: crypto.randomUUID(),
        name,
        tracks: [],
        createdAt: new Date().toISOString()
    };
    playlists.push(playlist);
    saveAll(playlists);
    return playlist;
}

export function addTrackToPlaylist(playlistId: string, track: Track): void {
    const playlists = loadAll();
    const idx = playlists.findIndex(p => p.id === playlistId);
    if (idx === -1) return;
    const exists = playlists[idx].tracks.some(t => t.id === track.id);
    if (!exists) {
        playlists[idx].tracks.push(track);
        saveAll(playlists);
    }
}

export function removeTrackFromPlaylist(playlistId: string, trackId: string): void {
    const playlists = loadAll();
    const idx = playlists.findIndex(p => p.id === playlistId);
    if (idx === -1) return;
    playlists[idx].tracks = playlists[idx].tracks.filter(t => t.id !== trackId);
    saveAll(playlists);
}



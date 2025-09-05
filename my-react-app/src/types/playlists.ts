export type Track = {
    id: string;
    title: string;
    artist?: string;
    durationMs?: number;
};

export type Playlist = {
    id: string;
    name: string;
    tracks: Track[];
    createdAt: string; // ISO string
};



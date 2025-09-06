import * as React from "react";
import type {Playlist, Track} from "../types/playlists";
import {addTrackToPlaylist, listPlaylists} from "../services/playlistsApi";

type Props = {
    track: Track;
    onAdded?: () => void;
};

const AddToPlaylist: React.FC<Props> = ({ track, onAdded }) => {
    const [playlists, setPlaylists] = React.useState<Playlist[]>([]);
    const [selectedId, setSelectedId] = React.useState<string>("");

    React.useEffect(() => {
        loadPlaylists();
    }, []);

    const loadPlaylists = async () => {
        try {
            const playlistsData = await listPlaylists();
            setPlaylists(playlistsData);
        } catch (error) {
            console.error('Failed to load playlists:', error);
        }
    };

    const handleAdd = async () => {
        if (!selectedId) return;
        try {
            await addTrackToPlaylist(selectedId, track);
            onAdded?.();
        } catch (error) {
            console.error('Failed to add track to playlist:', error);
        }
    };

    if (playlists.length === 0) return <span>Create a playlist first</span>;

    return (
        <div style={{display: "flex", gap: 8, alignItems: "center"}}>
            <select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                <option value="" disabled>Select playlist</option>
                {playlists.map(p => (
                    <option value={p.id} key={p.id}>{p.name}</option>
                ))}
            </select>
            <button onClick={handleAdd}>Add</button>
        </div>
    );
};

export default AddToPlaylist;



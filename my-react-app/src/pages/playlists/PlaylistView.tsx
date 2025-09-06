import * as React from "react";
import {useParams} from "react-router-dom";
import type {Playlist, Track} from "../../types/playlists";
import {listPlaylists, removeTrackFromPlaylist} from "../../services/playlistsLocal";

const PlaylistView: React.FC = () => {
    const { id } = useParams();
    const [playlist, setPlaylist] = React.useState<Playlist | null>(null);

    React.useEffect(() => {
        const all = listPlaylists();
        const found = all.find(p => p.id === id);
        setPlaylist(found ?? null);
    }, [id]);

    const handleRemove = (trackId: string) => {
        if (!playlist) return;
        removeTrackFromPlaylist(playlist.id, trackId);
        const all = listPlaylists();
        const found = all.find(p => p.id === playlist.id) || null;
        setPlaylist(found);
    };

    if (!playlist) return <div style={{padding: 16}}>Playlist not found</div>;

    return (
        <div style={{padding: 16}}>
            <h2>{playlist.name}</h2>
            {playlist.tracks.length === 0 ? (
                <p>No tracks yet.</p>
            ) : (
                <ul style={{listStyle: "none", padding: 0}}>
                    {playlist.tracks.map((t: Track) => (
                        <li key={t.id} style={{padding: 8, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <div>
                                <div style={{fontWeight: 600}}>{t.title}</div>
                                {t.artist && <div style={{fontSize: 12, color: "#666"}}>{t.artist}</div>}
                            </div>
                            <button onClick={() => handleRemove(t.id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PlaylistView;



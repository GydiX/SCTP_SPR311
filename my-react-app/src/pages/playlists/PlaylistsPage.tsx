import * as React from "react";
import type {Playlist} from "../../types/playlists";
import {createPlaylist, listPlaylists} from "../../services/playlistsLocal";
import {Link} from "react-router-dom";

const PlaylistsPage: React.FC = () => {
    const [playlists, setPlaylists] = React.useState<Playlist[]>([]);
    const [newName, setNewName] = React.useState("");

    React.useEffect(() => {
        setPlaylists(listPlaylists());
    }, []);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;
        const created = createPlaylist(newName.trim());
        setPlaylists(prev => [...prev, created]);
        setNewName("");
    };

    return (
        <div style={{padding: 16}}>
            <h2>Playlists</h2>

            <form onSubmit={handleCreate} style={{margin: "12px 0", display: "flex", gap: 8}}>
                <input
                    placeholder="New playlist name"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    style={{padding: 8, flex: 1}}
                />
                <button type="submit">Create</button>
            </form>

            {playlists.length === 0 ? (
                <p>No playlists yet. Create one above.</p>
            ) : (
                <ul style={{listStyle: "none", padding: 0}}>
                    {playlists.map(p => (
                        <li key={p.id} style={{padding: 8, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <div>
                                <div style={{fontWeight: 600}}>{p.name}</div>
                                <div style={{fontSize: 12, color: "#666"}}>{p.tracks.length} tracks</div>
                            </div>
                            <Link to={`/playlists/${p.id}`}>Open</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PlaylistsPage;



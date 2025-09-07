import * as React from "react";
import type {Playlist} from "../../types/playlists";
import {createPlaylist, listPlaylists} from "../../services/playlistsLocal";
import {deletePlaylist} from "../../services/playlistsApi";
import {Link} from "react-router-dom";

const PlaylistsPage: React.FC = () => {
    const [playlists, setPlaylists] = React.useState<Playlist[]>([]);
    const [newName, setNewName] = React.useState("");

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

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;
        try {
            const created = await createPlaylist(newName.trim());
            setPlaylists(prev => [...prev, created]);
            setNewName("");
        } catch (error) {
            console.error('Failed to create playlist:', error);
        }
    };

    const handleDelete = async (playlistId: string) => {
        try {
            await deletePlaylist(playlistId);
            setPlaylists(prev => prev.filter(p => p.id !== playlistId));
        } catch (error) {
            console.error('Failed to delete playlist:', error);
        }
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
                            <div style={{display: "flex", gap: 8, alignItems: "center"}}>
                                <Link to={`/playlists/${p.id}`}>Open</Link>
                                <button 
                                    onClick={() => handleDelete(p.id)}
                                    style={{padding: "4px 8px", fontSize: "12px", color: "#dc3545", border: "1px solid #dc3545", background: "white", cursor: "pointer"}}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PlaylistsPage;



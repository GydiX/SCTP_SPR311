import * as React from "react";
import type {Playlist} from "../../types/playlists";
import {createPlaylist, listPlaylists, deletePlaylist} from "../../services/playlistsApi";
import {Link, useNavigate} from "react-router-dom";

const PlaylistsPage: React.FC = () => {
    const [playlists, setPlaylists] = React.useState<Playlist[]>([]);
    const [newName, setNewName] = React.useState("");
    const [status, setStatus] = React.useState<string>("");
    const [submitting, setSubmitting] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        loadPlaylists();
    }, []);

    const loadPlaylists = async () => {
        try {
            const playlistsData = await listPlaylists();
            setPlaylists(playlistsData);
        } catch (error) {
            console.error('Failed to load playlists:', error);
            setStatus('Не вдалося завантажити плейлисти');
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;
        setSubmitting(true);
        setStatus("");
        try {
            const created = await createPlaylist(newName.trim());
            setPlaylists(prev => [...prev, created]);
            setNewName("");
            setStatus('Плейлист створено');
            // Перейти до сторінки щойно створеного плейлиста
            navigate(`/playlists/${created.id}`);
        } catch (error: any) {
            console.error('Failed to create playlist:', error);
            setStatus(typeof error?.message === 'string' ? error.message : 'Не вдалося створити плейлист. Увійдіть у систему.');
        } finally {
            setSubmitting(false);
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
            <h2>Плейлисти</h2>

            <form onSubmit={handleCreate} style={{margin: "12px 0", display: "flex", gap: 8}}>
                <input
                    placeholder="Назва нового плейлиста"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    style={{padding: 8, flex: 1}}
                />
                <button type="submit" disabled={!newName.trim() || submitting}>{submitting ? 'Створення...' : 'Створити'}</button>
            </form>

            {status && (
                <div style={{marginBottom: 12, color: '#999'}}>{status}</div>
            )}

            {playlists.length === 0 ? (
                <p>Плейлистів ще немає. Створіть перший вище.</p>
            ) : (
                <ul style={{listStyle: "none", padding: 0}}>
                    {playlists.map(p => (
                        <li key={p.id} style={{padding: 8, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <div>
                                <div style={{fontWeight: 600}}>{p.name}</div>
                                <div style={{fontSize: 12, color: "#666"}}>{p.tracks.length} треків</div>
                            </div>
                            <div style={{display: "flex", gap: 8, alignItems: "center"}}>
                                <Link to={`/playlists/${p.id}`}>Відкрити</Link>
                                <button 
                                    onClick={() => handleDelete(p.id)}
                                    style={{padding: "4px 8px", fontSize: "12px", color: "#dc3545", border: "1px solid #dc3545", background: "white", cursor: "pointer"}}
                                >
                                    Видалити
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



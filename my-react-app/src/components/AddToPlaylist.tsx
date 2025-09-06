import * as React from "react";
import {Playlist, Track} from "../types/playlists";
import {addTrackToPlaylist, listPlaylists} from "../services/playlistsLocal";

type Props = {
    track: Track;
    onAdded?: () => void;
};

const AddToPlaylist: React.FC<Props> = ({ track, onAdded }) => {
    const [playlists, setPlaylists] = React.useState<Playlist[]>([]);
    const [selectedId, setSelectedId] = React.useState<string>("");

    React.useEffect(() => {
        setPlaylists(listPlaylists());
    }, []);

    const handleAdd = () => {
        if (!selectedId) return;
        addTrackToPlaylist(selectedId, track);
        onAdded?.();
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



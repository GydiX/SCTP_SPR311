import type {IUserRowProps} from "./typs.ts";
import * as React from "react";
import EnvConfig from "../../config/env.ts";
import {Link} from "react-router-dom";


const UserRow: React.FC<IUserRowProps> = ({user, initials}) => {
    return (
        <tr key={user.id} className="hover:bg-gray-800 transition-colors">
            <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">{user.id}</td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-700 overflow-hidden grid place-items-center text-sm font-medium">
                        {user.image ? (
                            <img
                                className="h-full w-full object-cover"
                                src={user.image.startsWith("http") ? user.image : `${EnvConfig.API_URL}/images/${user.image}`}
                                alt={user.fullName}
                                onError={(e) => {
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.style.display = "none";
                                }}
                            />
                        ) : (
                            <span className="text-white">{initials(user.fullName)}</span>
                        )}
                    </div>
                    <div>
                        <div className="font-medium leading-tight text-white">{user.fullName}</div>
                        <div className="text-xs text-gray-400">#{String(user.id).padStart(4, "0")}</div>
                    </div>
                </div>
            </td>

            <td className="px-6 py-4 text-sm text-gray-300">{user.email}</td>

            <td className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                    {user.roles.map((r, i) => (
                        <span
                            key={i}
                            className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700"
                        >
                            {r}
                        </span>
                    ))}
                </div>
            </td>

            <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                    <Link to={`/user/${user.id}`}
                        className="spotify-button px-3 py-1.5 text-xs font-medium"
                    >
                        Редагувати
                    </Link>
                    <button
                        className="spotify-button-secondary px-3 py-1.5 text-xs font-medium"
                        onClick={() => alert(`Delete user ${user.id}`)}
                    >
                        Видалити
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default UserRow;
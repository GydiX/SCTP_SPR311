import type {IUserRowProps} from "./typs.ts";
import * as React from "react";
import EnvConfig from "../../config/env.ts";
import {Link} from "react-router-dom";


const UserRow: React.FC<IUserRowProps> = ({user, initials}) => {
    return (
        <tr key={user.id} className="hover:bg-neutral-50/80 dark:hover:bg-white/5">
            <td className="px-5 py-4 text-sm text-neutral-600 dark:text-neutral-300 whitespace-nowrap">{user.id}</td>
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div
                        className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden grid place-items-center text-sm font-medium">
                        {user.image ? (
// If you store only file names, swap to your CDN/base path below
                            <img
                                className="h-full w-full object-cover"
                                src={user.image.startsWith("http") ? user.image : `${EnvConfig.API_URL}/images/${user.image}`}
                                alt={user.fullName}
                                onError={(e) => {
// graceful fallback to initials if image fails
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.style.display = "none";
                                }}
                            />
                        ) : (
                            <span>{initials(user.fullName)}</span>
                        )}
                    </div>
                    <div>
                        <div className="font-medium leading-tight">{user.fullName}</div>
                        <div
                            className="text-xs text-neutral-500">#{String(user.id).padStart(4, "0")}</div>
                    </div>
                </div>
            </td>

            <td className="px-5 py-4 text-sm text-neutral-700 dark:text-neutral-200">{user.email}</td>

            <td className="px-5 py-4">
                <div className="flex flex-wrap gap-2">
                    {user.roles.map((r, i) => (
                        <span
                            key={i}
                            className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-black/5 dark:border-white/10"
                        >
                            {r}
                        </span>
                    ))}
                </div>
            </td>


            <td className="px-5 py-4">
                <div className="flex justify-end gap-2">
                    <Link to={`/user/${user.id}`}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-900 text-white hover:opacity-90 dark:bg-white dark:text-neutral-900"
                        // onClick={() => alert(`Edit user ${user.id}`)}
                    >
                        Редагувати
                    </Link>
                    <button
                        className="px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
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
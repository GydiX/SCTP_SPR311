import * as React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import type {IUserItem} from "./typs.ts";
import UserRow from "./UserRow.tsx";
import EnvConfig from "../../config/env.ts";

const UsersList: React.FC = () => {

    // console.log("env url", EnvConfig.API_URL)
    const urlGet = `${EnvConfig.API_URL}/api/users/list`;

    const [users, setUsers] = useState<IUserItem[]>([])

    useEffect(() => {
        axios.get(urlGet)
            .then(resp => {
                console.log("axios result ", resp);
                setUsers(resp.data);
            })
            .catch(error => {
                console.log("axios error", error);
            })
        console.log("Working useEffect", urlGet);
    }, []);

    // ---- Helpers ----
    const initials = (name: string) =>
        name
            .split(" ")
            .filter(Boolean)
            .map((n) => n[0]?.toUpperCase())
            .slice(0, 2)
            .join("");

    return (
        <>
            <div className="w-full">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Користувачі</h1>
                    <p className="text-gray-400">{users.length} користувачів</p>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <div className="spotify-card overflow-hidden">
                        {/* Table Header */}
                        <div className="px-6 py-4 border-b border-gray-800">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-white">Список користувачів</h2>
                                <div className="text-sm text-gray-400">{users.length} запис(ів)</div>
                            </div>
                        </div>


                        {/* Table container with horizontal scroll on small screens */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left align-middle">
                                <thead className="bg-gray-800 text-gray-300 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">ID</th>
                                    <th className="px-6 py-4 font-semibold">Користувач</th>
                                    <th className="px-6 py-4 font-semibold">Email</th>
                                    <th className="px-6 py-4 font-semibold">Ролі</th>
                                    <th className="px-6 py-4 font-semibold text-right">Дії</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                {users.map((u) => (
                                    <UserRow user={u} key={u.id} initials={initials} />
                                ))}
                                </tbody>
                            </table>
                        </div>


                    </div>
                </div>

                {/* Mobile-friendly stacked view (shown only <sm) */}
                <div className="md:hidden space-y-4">
                    {users.map((u) => (
                        <div key={u.id} className="spotify-card p-4">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-gray-700 overflow-hidden grid place-items-center text-sm font-medium">
                                    {u.image ? (
                                        <img
                                            className="h-full w-full object-cover"
                                            src={u.image.startsWith("http") ? u.image : `/images/${u.image}`}
                                            alt={u.fullName}
                                            onError={(e) => {
                                                const target = e.currentTarget as HTMLImageElement;
                                                target.style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <span className="text-white">{initials(u.fullName)}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-white">{u.fullName}</div>
                                    <div className="text-xs text-gray-400">{u.email}</div>
                                </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {u.roles.map((r, i) => (
                                    <span
                                        key={i}
                                        className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700"
                                    >
                                        {r}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    className="spotify-button px-4 py-2 text-xs font-medium"
                                    onClick={() => alert(`Edit user ${u.id}`)}
                                >
                                    Редагувати
                                </button>
                                <button
                                    className="spotify-button-secondary px-4 py-2 text-xs font-medium"
                                    onClick={() => alert(`Delete user ${u.id}`)}
                                >
                                    Видалити
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </>
    )
}

export default UsersList;
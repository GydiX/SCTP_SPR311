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
                {/* Блок даного коду завжди скиритий, але якщо екран більший sm або рівний sm*/}
                <div className="hidden md:block overflow-x-auto">
                    <div
                        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden">
                        {/* Header */}
                        <div
                            className="flex items-center justify-between gap-3 px-5 py-4 border-b border-black/10 dark:border-white/10">
                            <h2 className="text-lg font-semibold">Користувачі</h2>
                            <div className="text-sm text-neutral-500">{users.length} запис(ів)</div>
                        </div>


                        {/* Table container with horizontal scroll on small screens */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left align-middle">
                                <thead
                                    className="bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">ID</th>
                                    <th className="px-5 py-3 font-semibold">Користувач</th>
                                    <th className="px-5 py-3 font-semibold">Email</th>
                                    <th className="px-5 py-3 font-semibold">Ролі</th>
                                    <th className="px-5 py-3 font-semibold text-right">Дії</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                                {users.map((u) => (
                                    <UserRow user={u} initials={initials} />
                                ))}
                                </tbody>

                            </table>
                        </div>


                    </div>
                </div>

                {/* Mobile-friendly stacked view (shown only <sm) */}
                <div className="md:hidden mt-4 space-y-3">
                    {users.map((u) => (
                        <div key={u.id}
                             className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm ring-1 ring-black/5 p-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden grid place-items-center text-sm font-medium">
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
                                        <span>{initials(u.fullName)}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium">{u.fullName}</div>
                                    <div className="text-xs text-neutral-500">{u.email}</div>
                                </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {u.roles.map((r, i) => (
                                    <span
                                        key={i}
                                        className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-black/5 dark:border-white/10"
                                    >
                                        {r}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-3 flex justify-end gap-2">
                                <button
                                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-900 text-white hover:opacity-90 dark:bg-white dark:text-neutral-900"
                                    onClick={() => alert(`Edit user ${u.id}`)}
                                >
                                    Редагувати
                                </button>
                                <button
                                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
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
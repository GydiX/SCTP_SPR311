import {useGoogleLogin} from "@react-oauth/google";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EnvConfig from "../../config/env";

const Login : React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const API_URL = EnvConfig.API_URL || "http://localhost:5264";

    const loginByGoogle = useGoogleLogin({
        onSuccess: async tokenResponse => {
            try {
                const res = await fetch(`${API_URL}/api/Account/google-login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ token: tokenResponse.access_token })
                });
                if (!res.ok) {
                    const msg = await res.text();
                    throw new Error(msg || "Google login failed");
                }
                const data = await res.json();
                localStorage.setItem("auth_token", data.token);
                navigate("/");
            } catch (err) {
                console.error(err);
                alert("Помилка входу через Google");
            }
        },
        onError: () => {
            alert("Google авторизацію скасовано або сталася помилка");
        }
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        try {
            setSubmitting(true);
            const res = await fetch(`${API_URL}/api/Account/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Login failed");
            }
            const data = await res.json();
            localStorage.setItem("auth_token", data.token);
            navigate("/");
        } catch (err) {
            console.error(err);
            alert("Невірна пошта або пароль");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow">
            <h1 className="text-3xl font-bold text-center mb-5 mt-4">
                Вхід
            </h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Пошта"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="border rounded px-3 py-2"
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="border rounded px-3 py-2"
                    required
                />
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white py-2 rounded font-semibold disabled:opacity-50"
                >
                    {submitting ? "Вхід..." : "Увійти"}
                </button>
            </form>
            <div className="mt-8 flex justify-center">
                <button
                    onClick={() => loginByGoogle()}
                    className="bg-red-500 text-white py-2 px-4 rounded font-semibold"
                >
                    Sign in with Google 🚀
                </button>
            </div>
        </div>
    );
}

export default Login
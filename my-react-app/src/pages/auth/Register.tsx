import { useGoogleLogin } from "@react-oauth/google";
import * as React from "react";
import { useState } from "react";

const Register: React.FC = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const registerByGoogle = useGoogleLogin({
        onSuccess: tokenResponse => {
            console.log("Get Google token", tokenResponse.access_token);
        },
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        // Тут можна додати запит до API для реєстрації
        console.log("FirstName:", firstName, "LastName:", lastName, "Email:", email, "Password:", password);
    };

    return (
        <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow">
            <h1 className="text-3xl font-bold text-center mb-5 mt-4">
                Реєстрація
            </h1>
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Ім'я"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="border rounded px-3 py-2"
                    required
                />
                <input
                    type="text"
                    placeholder="Прізвище"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="border rounded px-3 py-2"
                    required
                />
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
                    className="bg-green-600 text-white py-2 rounded font-semibold"
                >
                    Зареєструватися
                </button>
            </form>
            <div className="mt-8 flex justify-center">
                <button
                    onClick={() => registerByGoogle()}
                    className="bg-red-500 text-white py-2 px-4 rounded font-semibold"
                >
                    Sign up with Google 🚀
                </button>
            </div>
        </div>
    );
}

export default Register;
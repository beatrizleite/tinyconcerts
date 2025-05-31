import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth(); // << novo

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Credenciais inválidas");

            const data = await res.json();
            console.log("Token recebido do backend:", data.token);

            login(data.access_token);
            localStorage.setItem("user_id", data.id);
            localStorage.setItem("username", data.username);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };
    return (
        <div className="min-h-screen bg-gray-800 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-red-900 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl" />
                <div className="relative px-4 py-10 bg-gray-600 shadow-lg sm:rounded-3xl sm:p-20 text-white">
                    <div className="text-center pb-6">
                        <h1 className="text-3xl">Login</h1>
                        <p className="text-gray-100">Access your account</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <input
                            className="shadow mb-4 border border-white rounded w-full py-2 px-3 text-gray-200"
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                        />
                        <input
                            className="shadow mb-4 border border-white rounded w-full py-2 px-3 text-gray-200"
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                        />

                        {error && <p className="text-red-200 mb-2">{error}</p>}

                        <div className="flex justify-between">
                            <button
                                type="submit"
                                className="!bg-black hover:!border-red-500 text-white font-bold py-2 px-4 rounded"
                            >
                                Login
                            </button>
                            <button
                                type="reset"
                                className="!bg-black hover:!border-red-500 text-white font-bold py-2 px-4 rounded"
                                onClick={() => setForm({ username: "", password: "" })}
                            >
                                Clean
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

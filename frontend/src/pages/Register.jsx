import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    fname: "",
    lname: "",
    birthday: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        if (res.status === 409) throw new Error("Username ou email já existe");
        throw new Error("Erro ao registar");
      }

      await res.json();
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl" />
        <div className="relative px-4 py-10 bg-indigo-400 shadow-lg sm:rounded-3xl sm:p-20 text-white">
          <div className="text-center pb-6">
            <h1 className="text-3xl">Registar</h1>
            <p className="text-gray-100">Cria a tua conta para começar</p>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              className="shadow mb-3 border rounded w-full py-2 px-3 text-gray-700"
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
            />
            <input
              className="shadow mb-3 border rounded w-full py-2 px-3 text-gray-700"
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            <input
              className="shadow mb-3 border rounded w-full py-2 px-3 text-gray-700"
              type="text"
              name="fname"
              placeholder="Primeiro Nome"
              value={form.fname}
              onChange={handleChange}
            />
            <input
              className="shadow mb-3 border rounded w-full py-2 px-3 text-gray-700"
              type="text"
              name="lname"
              placeholder="Último Nome"
              value={form.lname}
              onChange={handleChange}
            />
            <input
              className="shadow mb-3 border rounded w-full py-2 px-3 text-gray-700"
              type="date"
              name="birthday"
              placeholder="Data de nascimento"
              value={form.birthday}
              onChange={handleChange}
            />
            <input
              className="shadow mb-4 border rounded w-full py-2 px-3 text-gray-700"
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              >
                Registar
              </button>
              <button
                type="reset"
                onClick={() =>
                  setForm({
                    username: "",
                    email: "",
                    password: "",
                    fname: "",
                    lname: "",
                    birthday: "",
                  })
                }
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              >
                Limpar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

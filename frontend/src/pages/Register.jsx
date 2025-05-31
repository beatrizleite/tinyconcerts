import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Register({ onSuccess }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    fname: "",
    lname: "",
    birthday: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
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
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Create Account
        </h2>
        <p className="text-gray-400 text-sm">
          Join us and start your journey today
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              First Name
            </label>
            <input
              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 
                         focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500
                         transition-all duration-200 backdrop-blur-sm
                         placeholder-gray-500 text-white
                         hover:border-gray-600"
              type="text"
              name="fname"
              placeholder="Enter first name"
              value={form.fname}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Last Name
            </label>
            <input
              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 
                         focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500
                         transition-all duration-200 backdrop-blur-sm
                         placeholder-gray-500 text-white
                         hover:border-gray-600"
              type="text"
              name="lname"
              placeholder="Enter last name"
              value={form.lname}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 
                         focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500
                         transition-all duration-200 backdrop-blur-sm
                         placeholder-gray-500 text-white
                         hover:border-gray-600"
              type="text"
              name="username"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 
                         focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500
                         transition-all duration-200 backdrop-blur-sm
                         placeholder-gray-500 text-white
                         hover:border-gray-600"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Birthday
            </label>
            <input
              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 
                         focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500
                         transition-all duration-200 backdrop-blur-sm
                         placeholder-gray-500 text-white
                         hover:border-gray-600"
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 pr-12
                           focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500
                           transition-all duration-200 backdrop-blur-sm
                           placeholder-gray-500 text-white
                           hover:border-gray-600"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 w-12 flex items-center justify-center
                           text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm text-center font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
                       text-white font-semibold py-3 px-4 rounded-lg 
                       transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg
                       focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-gray-900
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Create Account
          </button>
          
          <button
            type="button"
            className="w-full bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600
                       text-gray-300 hover:text-white font-medium py-3 px-4 rounded-lg 
                       transition-all duration-200 transform hover:scale-[1.02]
                       focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
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
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [liked, setLiked] = useState([]);

  let userId = localStorage.getItem("user_id");

  if (!userId && token) {
    try {
      const payload = token.split(".")[1];
      if (payload) {
        const decoded = JSON.parse(atob(payload));
        userId = decoded.sub || decoded.id;
      }
    } catch (err) {
      console.warn("Token inválido:", err);
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user?user_id=${userId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

        const data = await res.json();
        setUserData(data);

        const fakeVideos = [
          {
            id: 1,
            title: "Vídeo A",
            thumbnail: "https://placehold.co/320x180",
            views: 1500,
            uploaded: "2024-05-01",
          },
          {
            id: 2,
            title: "Vídeo B",
            thumbnail: "https://placehold.co/320x180",
            views: 980,
            uploaded: "2024-05-15",
          },
        ];
        setFavorites(fakeVideos);
        setLiked(fakeVideos.slice(1));
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
      }
    };

    if (userId && token) fetchUserData();
  }, [userId, token]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!res.ok) throw new Error("Erro ao atualizar perfil");
      setMessage("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      setMessage("Erro ao atualizar perfil.");
    }
  };

  if (!userData) return <p className="text-white text-center mt-10">A carregar perfil...</p>;

  return (
    <div className="min-h-screen bg-gray-900 py-10 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Coluna esquerda - Formulário de perfil */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-8 py-10 bg-gray-800 shadow-lg sm:rounded-3xl sm:p-10 text-white z-10">
            <h1 className="text-3xl font-bold text-center mb-6">Perfil</h1>
            <p className="text-center text-gray-300 mb-6">Atualiza os teus dados</p>
            <form onSubmit={handleSave} className="space-y-4">
              <input name="username" value={userData.username} onChange={handleChange}
                placeholder="Username"
                className="w-full p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input name="email" value={userData.email} onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input name="fname" value={userData.fname} onChange={handleChange}
                placeholder="Primeiro nome"
                className="w-full p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input name="lname" value={userData.lname} onChange={handleChange}
                placeholder="Último nome"
                className="w-full p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input name="birthday" value={userData.birthday?.split("T")[0]} onChange={handleChange}
                type="date"
                className="w-full p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <div className="flex justify-between pt-4">
                <button type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                  Guardar
                </button>
                <button type="reset"
                  onClick={() => setUserData({ ...userData })}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                  Cancelar
                </button>
              </div>
            </form>
            {message && <p className="mt-4 text-sm text-center">{message}</p>}
          </div>
        </div>

        {/* Coluna direita - Área reservada aos vídeos */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-8 py-10 bg-gray-800 shadow-lg sm:rounded-3xl sm:p-10 text-white z-10">
            <h2 className="text-2xl font-bold mb-4 text-center">Área de Vídeos</h2>
            <p className="text-gray-300 text-center mb-6">
              Em breve poderás gerir aqui os teus vídeos favoritos e os que recebeste likes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favorites.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
              {favorites.length === 0 && (
                <p className="text-gray-400">Sem favoritos ainda.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoCard({ video }) {
  return (
    <div className="bg-gray-700 rounded-lg shadow p-3">
      <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover rounded mb-2" />
      <h4 className="text-white font-semibold">{video.title}</h4>
      <p className="text-sm text-gray-300">{video.views} views</p>
      <p className="text-sm text-gray-400">{video.uploaded}</p>
    </div>
  );
}

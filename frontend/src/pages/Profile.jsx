/* import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [importFile, setImportFile] = useState(null);

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
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
      }
    };

    const fetchFavoritesAndLikes = async () => {
      try {
        const [favRes, likeRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/favorite/user`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/like/user`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const favData = await favRes.json();
        const likeData = await likeRes.json();

        setFavorites(favData.favorites || []);
        setLikedVideos(likeData.likes || []);
      } catch (err) {
        console.error("Erro ao buscar favoritos ou likes:", err);
      }
    };

    if (userId && token) {
      fetchUserData();
      fetchFavoritesAndLikes();
    }
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

  const handleImportFileChange = (e) => {
    setImportFile(e.target.files[0]);
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();

    if (!importFile) {
      alert("Por favor, escolhe um ficheiro CSV ou Excel.");
      return;
    }

    const formData = new FormData();
    formData.append("file", importFile);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/video/import`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Importação bem sucedida! Foram importados ${data.created_video_ids.length} vídeos.`);
      } else {
        alert(`Falha na importação: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao importar o ficheiro.");
    }
  };

  if (!userData) return <p className="text-white text-center mt-10">A carregar perfil...</p>;

  const handleClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-10 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

        <div className="px-8 py-10 bg-gray-800 shadow-lg sm:rounded-3xl sm:p-10 text-white">
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

        <div className="px-8 py-10 bg-gray-800 shadow-lg sm:rounded-3xl sm:p-10 text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Área de Vídeos</h2>

          <h2 className="text-lg font-semibold mb-2">Favoritos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {favorites.length > 0 ? (
              favorites.map((video) => (
                <VideoCard key={video.video_id} video={video} onClick={() => handleClick(video.video_id)} />
              ))
            ) : (
              <p className="text-gray-400">Sem favoritos ainda.</p>
            )}
          </div>

          <h2 className="text-lg font-semibold mb-2">Vídeos com Likes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {likedVideos.length > 0 ? (
              likedVideos.map((video) => (
                <VideoCard key={video.id} video={video} onClick={handleClick} />
              ))
            ) : (
              <p className="text-gray-400">Sem likes ainda.</p>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">Importar vídeos (CSV/Excel)</h3>
            <form onSubmit={handleImportSubmit} className="flex flex-col gap-2">
              <input
                type="file"
                accept=".csv, .xlsx"
                onChange={handleImportFileChange}
                className="p-2 bg-gray-700 rounded focus:outline-none"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                Carregar
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

function VideoCard({ video, onClick }) {
  return (
    <div
      onClick={() => onClick(video.video_id)}  // aqui
      className="bg-gray-700 rounded-lg shadow p-3 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform"
    >
      <img src={video.image_320_180} alt={video.title} className="w-full h-40 object-cover rounded mb-2" />
      <h4 className="text-white font-semibold">{video.title}</h4>
      <p className="text-sm text-gray-300">{video.views ?? 'N/A'} views</p>
      <p className="text-sm text-gray-400">{video.uploaded}</p>
    </div>
  );
}


 */

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");

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
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
      }
    };

    const fetchFavoritesAndLikes = async () => {
      try {
        const [favRes, likeRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/favorite/user`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/like/user`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const favData = await favRes.json();
        const likeData = await likeRes.json();
        setFavorites(favData.favorites || []);
        setLikedVideos(likeData.likes || []);
      } catch (err) {
        console.error("Erro ao buscar favoritos ou likes:", err);
      }
    };

    if (userId && token) {
      fetchUserData();
      fetchFavoritesAndLikes();
    }
  }, [userId, token]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user?user_id=${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }, body: JSON.stringify(userData),
      });
      if (!res.ok) throw new Error("Erro ao atualizar perfil");
      setMessage("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      setMessage("Erro ao atualizar perfil.");
    }
  };

  if (!userData) return <p className="text-white text-center mt-10">A carregar perfil...</p>;

  const handleClick = (videoId) => navigate(`/video/${videoId}`);

 return (
  <div className="min-h-screen bg-[#1e1e1e] py-10 px-6 sm:px-12 text-white">
    <div className="max-w-6xl mx-auto mb-8">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-xl shadow-xl p-6 text-center">
        <h1 className="text-4xl font-bold mb-1">User Profile</h1>
        <p className="text-gray-200 text-sm">Manage your personal info, favorites and liked videos.</p>
      </div>
    </div>

    <div className="max-w-6xl mx-auto bg-gray-800 rounded-xl shadow-xl p-6">
      <div className="flex gap-6 flex-col md:flex-row">
        <div className="md:w-1/4 flex flex-col gap-2">
          <button onClick={() => setActiveTab("profile")} className={`py-2 px-4 rounded font-semibold transition ${activeTab === "profile" ? "bg-[#e63946] shadow-md" : "bg-gray-700 hover:bg-gray-600"}`}>Profile</button>
          <button onClick={() => setActiveTab("favorites")} className={`py-2 px-4 rounded font-semibold transition ${activeTab === "favorites" ? "bg-[#e63946] shadow-md" : "bg-gray-700 hover:bg-gray-600"}`}>Favorites</button>
          <button onClick={() => setActiveTab("likes")} className={`py-2 px-4 rounded font-semibold transition ${activeTab === "likes" ? "bg-[#e63946] shadow-md" : "bg-gray-700 hover:bg-gray-600"}`}>Likes</button>
        </div>

        <div className="md:w-3/4">
          {activeTab === "profile" && (
            <form onSubmit={handleSave} className="space-y-4">
              <h2 className="text-2xl font-semibold text-white-400 border-b border-gray-600 pb-2 mb-4">Update Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="username" value={userData.username} onChange={handleChange} placeholder="Username" className="w-full p-3 rounded bg-gray-700" />
                <input name="email" value={userData.email} onChange={handleChange} placeholder="Email" className="w-full p-3 rounded bg-gray-700" />
                <input name="fname" value={userData.fname} onChange={handleChange} placeholder="First Name" className="w-full p-3 rounded bg-gray-700" />
                <input name="lname" value={userData.lname} onChange={handleChange} placeholder="Last Name" className="w-full p-3 rounded bg-gray-700" />
                <input name="birthday" type="date" value={userData.birthday?.split("T")[0]} onChange={handleChange} className="w-full p-3 rounded bg-gray-700" />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button type="reset" onClick={() => setUserData({ ...userData })} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded shadow">Cancel</button>
                <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded shadow">Save</button>
              </div>
              {message && <p className="text-center text-sm text-green-400 mt-4">{message}</p>}
            </form>
          )}

          {activeTab === "favorites" && (
            <div>
              <h2 className="text-2xl font-semibold text-white-400 border-b border-gray-600 pb-2 mb-4">Favorites</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.length > 0 ? favorites.map(video => (
                  <VideoCard key={video.video_id} video={video} onClick={() => handleClick(video.video_id)} />
                )) : <p className="text-gray-400">No favorites yet.</p>}
              </div>
            </div>
          )}

          {activeTab === "likes" && (
            <div>
              <h2 className="text-2xl font-semibold text-white-400 border-b border-gray-600 pb-2 mb-4">Liked Videos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {likedVideos.length > 0 ? likedVideos.map(video => (
                  <VideoCard key={video.id} video={video} onClick={() => handleClick(video.video_id)} />
                )) : <p className="text-gray-400">No likes yet.</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}
function VideoCard({ video, onClick }) {
  return (
    <div onClick={onClick} className="bg-gray-700 rounded-xl overflow-hidden shadow-md cursor-pointer transform hover:scale-105 transition duration-300">
      <img src={video.image_320_180} alt={video.title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h4 className="text-white font-semibold truncate">{video.title}</h4>
        <p className="text-sm text-gray-300">{video.views ?? 'N/A'} views</p>
        <p className="text-sm text-gray-400">{video.uploaded}</p>
      </div>
    </div>
  );
}

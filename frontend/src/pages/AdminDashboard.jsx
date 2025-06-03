import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const VIDEOS_PER_PAGE = 8;

export default function AdminDashboard() {
  const { token } = useAuth();
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalVideos, setTotalVideos] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchVideos = async (page = 1) => {
    try {
      const query = keyword.trim()
        ? `/api/video/search?q=${encodeURIComponent(keyword)}&page=${page}&per_page=${VIDEOS_PER_PAGE}`
        : `/api/video/all?page=${page}&per_page=${VIDEOS_PER_PAGE}`;

      const res = await fetch(`${API_URL}${query}`);
      if (!res.ok) throw new Error("Erro ao buscar vídeos");
      const data = await res.json();
      setVideos(data.results);
      setTotalVideos(data.total);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar vídeos.");
    }
  };

  useEffect(() => {
    fetchVideos(currentPage);
  }, [currentPage, keyword]);

  const openModal = (video = null) => {
    setEditingVideo(video);
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingVideo(null);
    setModalOpen(false);
  };
const handleDelete = async (id) => {
  if (!confirm("Tens a certeza que queres apagar este vídeo?")) return;

  try {
    const res = await fetch(`${API_URL}/api/video?video_id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 404) {
      toast.warning("Vídeo não encontrado ou já foi apagado.");
      return;
    }

    if (!res.ok) throw new Error();

    toast.success("Vídeo apagado com sucesso");

    // Ajustar a página atual se for necessário
    const isLastVideoOnPage = videos.length === 1 && currentPage > 1;
    const nextPage = isLastVideoOnPage ? currentPage - 1 : currentPage;
    setCurrentPage(nextPage); // Atualiza o estado
    fetchVideos(nextPage);    // Atualiza a listagem

  } catch {
    toast.error("Erro ao apagar vídeo");
  }
};


  const totalPages = Math.ceil(totalVideos / VIDEOS_PER_PAGE);

  function getPageNumbers(current, total) {
    const pages = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current <= 4) {
        for (let i = 2; i <= 5; i++) pages.push(i);
        pages.push("...");
      } else if (current >= total - 3) {
        pages.push("...");
        for (let i = total - 4; i < total; i++) pages.push(i);
      } else {
        pages.push("...");
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push("...");
      }
      pages.push(total);
    }
    return pages;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Administração de Vídeos</h1>
        <button
          onClick={() => openModal()}
          className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700"
        >
          + Adicionar vídeo
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setCurrentPage(1);
          setKeyword(searchInput.trim());
        }}
        className="mb-6 flex gap-2"
      >
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by title or description..."
          className="px-3 py-2 rounded bg-gray-700 text-white w-64"
        />
        <button type="submit" className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700">
          Pesquisar
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-all"
          >
            <img src={video.image_320_180} alt={video.title} className="w-full h-40 object-cover rounded mb-2" />
            <h3 className="text-xl font-semibold mb-1">{video.title}</h3>
            <p className="text-xs text-gray-400 mb-2">{video.published_at?.split("T")[0]}</p>
            <div className="flex gap-2">
              <button
                onClick={() => openModal(video)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-3 py-1 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(video.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {getPageNumbers(currentPage, totalPages).map((page, idx) =>
            page === "..." ? (
              <span key={`ellipsis-${idx}`} className="px-3 py-1 text-gray-400 select-none">...</span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded cursor-pointer ${
                  currentPage === page
                    ? "bg-red-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-red-700"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>
      )}

      {modalOpen && (
        <VideoModal
          video={editingVideo}
          onClose={closeModal}
          onRefresh={() => fetchVideos(currentPage)}
          token={token}
        />
      )}
    </div>
  );
}

function VideoModal({ video, onClose, onRefresh, token }) {
  const [form, setForm] = useState({
    title: video?.title || "",
    description: video?.description || "",
    video_link: video?.video_link || "",
    image_320_180: video?.image_320_180 || "",
    published_at: video?.published_at?.split("T")[0] || "",
    category: video?.category || "",
    owner: video?.owner || "",
    owner_url: video?.owner_url || "",
  });

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = video ? "PUT" : "POST";
    const body = video ? { ...form, id: video.id } : form;

    try {
      const res = await fetch(`${API_URL}/api/video`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      toast.success(video ? "Vídeo atualizado!" : "Vídeo criado!");
      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao guardar vídeo");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start pt-20 z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-white text-xl font-bold"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">
          {video ? "Editar vídeo" : "Novo vídeo"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="title" placeholder="Título" value={form.title} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded" />
          <input name="video_link" placeholder="Link do vídeo" value={form.video_link} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded" />
          <input name="image_320_180" placeholder="URL da imagem" value={form.image_320_180} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded" />
          <input name="owner" placeholder="Autor" value={form.owner} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded" />
          <input name="owner_url" placeholder="URL do autor" value={form.owner_url} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded" />
          <input type="date" name="published_at" value={form.published_at} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded" />
          <textarea name="description" placeholder="Descrição" value={form.description} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded" />
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded">
            {video ? "Atualizar" : "Criar"}
          </button>
        </form>
      </div>
    </div>
  );
}

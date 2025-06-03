import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const VIDEOS_PER_PAGE = 12;

export default function AdminDashboard() {
    const { token } = useAuth();
    const [videos, setVideos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalVideos, setTotalVideos] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [keyword, setKeyword] = useState("");
    const importRef = useRef();
    const [importFile, setImportFile] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchVideos(currentPage);
    }, [currentPage, keyword]);

    const fetchVideos = async (page = 1) => {
        try {
            const query = keyword.trim()
                ? `/api/video/search?q=${encodeURIComponent(keyword)}&page=${page}&per_page=${VIDEOS_PER_PAGE}`
                : `/api/video/all?page=${page}&per_page=${VIDEOS_PER_PAGE}`;
            const res = await fetch(`${API_URL}${query}`);
            if (!res.ok) throw new Error("Failed to fetch videos");
            const data = await res.json();
            setVideos(data.results);
            setTotalVideos(data.total);
        } catch (err) {
            console.error(err);
            toast.error("Error loading videos.");
        }
    };

    const openModal = (video = null) => {
        setEditingVideo(video);
        setModalOpen(true);
    };

    const closeModal = () => {
        setEditingVideo(null);
        setModalOpen(false);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this video?")) return;
        try {
            const res = await fetch(`${API_URL}/api/video?video_id=${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.status === 404) {
                toast.warning("Video not found or already deleted.");
                return;
            }
            if (!res.ok) throw new Error();
            toast.success("Video deleted successfully");
            const isLastVideoOnPage = videos.length === 1 && currentPage > 1;
            const nextPage = isLastVideoOnPage ? currentPage - 1 : currentPage;
            setCurrentPage(nextPage);
            fetchVideos(nextPage);
        } catch {
            toast.error("Error deleting video");
        }
    };

    const handleImportFileChange = (e) => {
        setImportFile(e.target.files[0]);
    };

    const handleImportSubmit = async (e) => {
        e.preventDefault();
        if (!importFile) {
            toast.error("Please select a CSV or Excel file.");
            return;
        }
        const formData = new FormData();
        formData.append("file", importFile);
        try {
            const res = await fetch(`${API_URL}/api/video/import`, {
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(`Imported ${data.created_video_ids.length} videos.`);
                fetchVideos(currentPage);
                closeModal();
            } else {
                toast.error(`Error: ${data.error}`);
            }
        } catch (err) {
            console.error(err);
            toast.error("Error importing file.");
        }
    };

    const totalPages = Math.ceil(totalVideos / VIDEOS_PER_PAGE);
    const getPageNumbers = (current, total) => {
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
    };

    return (
        <div className="min-h-screen bg-[#1e1e1e] py-10 px-6 sm:px-12 text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Video Administration</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded shadow"
                >
                    + Add Video
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
                <button type="submit" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded shadow">
                    Search
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
                                className={`px-3 py-1 rounded cursor-pointer ${currentPage === page
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
                <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center">
                    <VideoModal
                        video={editingVideo}
                        onClose={closeModal}
                        onRefresh={() => fetchVideos(currentPage)}
                        token={token}
                        importRef={importRef}
                        importFile={importFile}
                        handleImportFileChange={handleImportFileChange}
                        handleImportSubmit={handleImportSubmit}
                    />
                </div>
            )}
        </div>
    );
}

function VideoModal({ video, onClose, onRefresh, token, importRef, importFile, handleImportFileChange, handleImportSubmit }) {
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

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

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
            toast.success(video ? "Video updated!" : "Video created!");
            onRefresh();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Error saving video");
        }
    };

    return (
        <div className="bg-gray-900 p-8 rounded-xl w-full max-w-lg relative shadow-lg">
            <button onClick={onClose} className="absolute top-4 right-6 text-white text-xl font-bold">×</button>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
                {video ? "Edit Video" : "Create New Video"}
            </h2>

            {!video && (
                <>
                    <form onSubmit={handleImportSubmit} className="mb-4">
                        <label className="block text-sm font-medium mb-1">Import from CSV</label>
                        <input
                            ref={importRef}
                            type="file"
                            accept=".csv, .xlsx"
                            onChange={handleImportFileChange}
                            className="w-full p-2 bg-gray-700 text-white rounded"
                        />
                        <button
                            type="submit"
                            className="mt-3 w-full bg-green-600 hover:bg-green-700 py-2 rounded"
                        >
                            Import Videos
                        </button>
                    </form>

                    <div className="text-center text-sm text-gray-400 my-4">— or —</div>
                </>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input name="title" value={form.title} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Video Link</label>
                    <input name="video_link" value={form.video_link} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Image URL</label>
                    <input name="image_320_180" value={form.image_320_180} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Author</label>
                    <input name="owner" value={form.owner} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Author URL</label>
                    <input name="owner_url" value={form.owner_url} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Published At</label>
                    <input type="date" name="published_at" value={form.published_at} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded" />
                </div>
                <button type="submit" className="mt-3 w-full bg-green-600 hover:bg-green-700 py-2 rounded">
                    {video ? "Update" : "Create"}
                </button>
            </form>
        </div>
    );
}

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getRandomVideos = () => api.get('/api/video/random').then(res => res.data);
export const getMostLikedVideos = () => api.get('/api/video/most-liked').then(res => res.data);
export const getMostRecentVideos = () => api.get('/api/video/most-recent').then(res => res.data);

export default api;

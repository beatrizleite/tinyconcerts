import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Videos from './pages/Videos';
import Playlists from './pages/Playlists';
import CreatePlaylist from './pages/CreatePlaylist';
import PlaylistDetail from './pages/PlaylistDetail';
import About from './pages/About';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Modal from './components/ui/Modal'
import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext';
import VideoView from './pages/VideoView';
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './pages/AdminDashboard';

function AppContent() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const { role } = useAuth();

  return (
    <div className='App w-full h-full absolute'>
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
      />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/videos' element={<Videos />} />
        <Route path='/playlists' element={<Playlists />} />
        <Route path='/about' element={<About />} />
        <Route path='/video/:id' element={<VideoView />} />

        <Route path="/admin" element={
            role === 1 ? 
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
            :
            <Navigate to="/" replace />
          }
        />

        <Route path='/createplaylist' element={
          <ProtectedRoute>
            <CreatePlaylist />
          </ProtectedRoute>
        } />
        <Route path='/playlist' element={
              <ProtectedRoute>
                <PlaylistDetail />
              </ProtectedRoute>
            } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
      <Modal isOpen={showLogin} onClose={() => setShowLogin(false)}>
        <Login onSuccess={() => setShowLogin(false)} />
      </Modal>
      <Modal isOpen={showRegister} onClose={() => setShowRegister(false)}>
        <Register onSuccess={() => setShowRegister(false)} />
      </Modal>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

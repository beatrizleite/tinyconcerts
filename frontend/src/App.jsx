import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Videos from './pages/Videos';
import Playlists from './pages/Playlists';
import About from './pages/About';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Modal from './components/ui/Modal'
import { useState } from 'react'
import { AuthProvider } from './context/AuthContext';
import VideoView from './pages/VideoView';
function App() {

  const [isLoggedIn] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  return (
    <AuthProvider>
      <Router>
        <div className='App w-full h-full absolute'>
          <Navbar
            onLoginClick={() => setShowLogin(true)}
            onRegisterClick={() => setShowRegister(true)}
          />
          <Routes>
            <Route path='/' element={<Home />} />{ }
            <Route path="/" element={<Home />} />
            <Route path='/videos' element={<Videos />} />
            <Route path='/playlists' element={<Playlists />} />
            <Route path='/about' element={<About />} />
            <Route path="/video/:id" element={<VideoView />} />

            <Route path="/profile"
              element={
                isLoggedIn ? <Profile /> : <Navigate to="/" replace />
              }
            />
          </Routes>
          <Modal isOpen={showLogin} onClose={() => setShowLogin(false)}>
            <Login onSuccess={() => setShowLogin(false)} />
          </Modal>
          <Modal isOpen={showRegister} onClose={() => setShowRegister(false)}>
              <Register onSuccess={() => setShowRegister(false)} />
          </Modal>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

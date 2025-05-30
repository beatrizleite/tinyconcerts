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
import { useState } from 'react'
import { AuthProvider } from './context/AuthContext';
import VideoView from './pages/VideoView';
function App() {

  const [isLoggedIn] = useState(true);

  return (
    <AuthProvider>
      <Router>
        <div className='App w-full h-full absolute'>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />{ }
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

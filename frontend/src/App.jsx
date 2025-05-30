import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Videos from './pages/Videos';
import Playlists from './pages/Playlists';
import About from './pages/About';
import Profile from './pages/Profile';

import { useState } from 'react'

function App() {
  
  const [isLoggedIn] = useState(true);

  return (
    <Router>
        <div className='App w-full h-full absolute'>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/videos' element={<Videos />} />
            <Route path='/playlists' element={<Playlists />} />
            <Route path='/about' element={<About />} />
            <Route path="/profile" 
              element={
                isLoggedIn ? <Profile /> : <Navigate to="/" replace />
              } 
            />
          </Routes>
        </div>
    </Router>
  )
}

export default App

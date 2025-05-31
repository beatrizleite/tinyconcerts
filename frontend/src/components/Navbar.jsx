import logo from '../assets/logo.png'
import SearchInput from './ui/Search'
import { useState } from 'react'
import { User, Menu, ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from "../context/AuthContext";
import { useEffect } from 'react';


export default function Navbar({ onLoginClick, onRegisterClick }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)
    const location = useLocation()
    const isLoggedIn = false
    const { isAuthenticated, logout } = useAuth();

    const isActive = (path) => location.pathname === path
    
useEffect(() => {
  setIsDropdownOpen(false);
}, [location.pathname]);
    return (
        <header className="relative z-50 flex justify-between items-center !text-white py-5 px-8 md:px-12 bg-gray-950 drop-shadow-md">
            <Link to='/' className='!text-white hover:!text-white'>
                <img src={logo} alt="Logo" className='h-10 hover:scale-105 transition-all' />
            </Link>
            <ul className='hidden xl:flex items-center gap-12 font-semibold text-base'>
                <li>
                    <Link to='/' className={`p-3 hover:bg-red-500 !text-white hover:!text-white rounded-md transition-all cursor-pointer block ${isActive('/') ? 'bg-red-500' : ''}`}>
                        Home
                    </Link>
                </li>
                <li>
                    <Link to='/videos' className={`p-3 hover:bg-red-500 !text-white hover:!text-white rounded-md transition-all cursor-pointer block ${isActive('/videos') ? 'bg-red-500' : ''}`}>
                        Videos
                    </Link>
                </li>
                <li>
                    <Link to='/playlists' className={`p-3 hover:bg-red-500 !text-white hover:!text-white rounded-md transition-all cursor-pointer block ${isActive('/playlists') ? 'bg-red-500' : ''}`}>
                        Playlists
                    </Link>
                </li>
                <li>
                    <Link to='/about' className={`p-3 hover:bg-red-500 !text-white hover:!text-white rounded-md transition-all cursor-pointer block ${isActive('/about') ? 'bg-red-500' : ''}`}>
                        About
                    </Link>
                </li>
            </ul>
            <div className='flex items-center gap-4'>
                <SearchInput className='hidden xl:block' />
                <div className='hidden xl:block relative'>
                    <div onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className='w-10 h-10 rounded-full bg-gray-800 p-2 border-transparent hover:border-red-500 hover:bg-gray-700 transition-colors cursor-pointer'>
                        <User className='!text-white' />
                    </div>
                    {isDropdownOpen && (
                        <div className='absolute right-0 top-12 bg-gray-800 !text-white rounded-md shadow-lg w-48'>
                            <ul className='p-2'>
                                {isAuthenticated  ? (
                                    <>
                                        <li>
                                            <Link to='/profile' className='block px-4 py-2 hover:bg-red-500 !text-white hover:!text-white rounded-md cursor-pointer'>
                                                Profile
                                            </Link>
                                        </li>
                                        <li className='px-4 py-2 hover:bg-red-500 rounded-md cursor-pointer'>Settings</li>
                                        <li onClick={logout} className="px-4 py-2 hover:bg-red-500 rounded-md cursor-pointer">
                                            Logout
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li onClick={onLoginClick} className='px-4 py-2 hover:bg-red-500 rounded-md cursor-pointer'>
                                            Login
                                        </li>
                                        <li onClick={onRegisterClick} className='px-4 py-2 hover:bg-red-500 rounded-md cursor-pointer'>
                                            Sign Up
                                        </li>

                                    </>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <Menu className='xl:hidden block text-5xl cursor-pointer'
                onClick={() => setIsMenuOpen(!isMenuOpen)} />
            <div
                className={`absolute xl:hidden top-20 left-0 w-full bg-gray-900 
          flex flex-col items-center font-semibold text-base transform 
          transition-transform ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                style={{ transition: "transform 0.3s ease, opacity 0.3s ease" }}
            >
                <li className='list-none w-full text-center'>
                    <Link to='/' className={`block p-3 hover:bg-red-500 !text-white hover:!text-white rounded-md transition-all cursor-pointer ${isActive('/') ? 'bg-red-500' : ''}`}>
                        Home
                    </Link>
                </li>
                <li className='list-none w-full text-center'>
                    <Link to='/videos' className={`block p-3 hover:bg-red-500 !text-white hover:!text-white rounded-md transition-all cursor-pointer ${isActive('/videos') ? 'bg-red-500' : ''}`}>
                        Videos
                    </Link>
                </li>
                <li className='list-none w-full text-center'>
                    <Link to='/playlists' className={`block p-3 hover:bg-red-500 !text-white hover:!text-white rounded-md transition-all cursor-pointer ${isActive('/playlists') ? 'bg-red-500' : ''}`}>
                        Playlists
                    </Link>
                </li>
                <li className='list-none w-full text-center'>
                    <Link to='/about' className={`block p-3 hover:bg-red-500 !text-white hover:!text-white rounded-md transition-all cursor-pointer ${isActive('/about') ? 'bg-red-500' : ''}`}>
                        About
                    </Link>
                </li>
                <li onClick={() => setIsSubMenuOpen(!isSubMenuOpen)} className='list-none w-full text-center p-3 hover:bg-red-500 rounded-md transition-all cursor-pointer flex justify-center items-center gap-2'>
                    Account
                    <ChevronRight
                        size={16}
                        className={`transition-transform ${isSubMenuOpen ? 'rotate-90' : ''}`} />
                </li>
                {isSubMenuOpen && (
                    <ul className='w-full text-center bg-gray-800 rounded-md shadow-lg mt-1'>
                        {isLoggedIn ? (
                            <>
                                <li>
                                    <Link to='/profile' className='block p-2 hover:bg-red-500 !text-white hover:!text-white rounded-md cursor-pointer'>
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link className='block p-2 !text-white hover:bg-red-500 rounded-md cursor-pointer' to='/logout'>
                                        Logout
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li onClick={onLoginClick} className='px-4 py-2 hover:bg-red-500 rounded-md cursor-pointer'>
                                    Login
                                </li>
                                <li onClick={onRegisterClick} className='px-4 py-2 hover:bg-red-500 rounded-md cursor-pointer'>
                                    Sign Up
                                </li>
                            </>
                        )}
                    </ul>
                )}
                <div className="w-11/12 my-2">
                    <SearchInput />
                </div>
            </div>
        </header>
    )
}
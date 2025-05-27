import logo from '../assets/logo.png'
import SearchInput from './ui/Search'
import { useState } from 'react'
import { User, Menu, ChevronRight } from 'lucide-react'

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)

    return (
        <header className='flex justify-between items-center text-white py-5 px-8 md:px-12 bg-gray-950 drop-shadow-md'> 
            <a href='/'>
                <img src={logo} alt="Logo" className='h-10 hover:scale-105 transition-all'/>
            </a>
            <ul className='hidden xl:flex items-center gap-12 font-semibold text-base'>
                <li className='p-3 hover:bg-red-500 text-white rounded-md transition-all cursor-pointer'>Home</li>
                <li className='p-3 hover:bg-red-500 text-white rounded-md transition-all cursor-pointer'>Videos</li>
                <li className='p-3 hover:bg-red-500 text-white rounded-md transition-all cursor-pointer'>Playlists</li>
                <li className='p-3 hover:bg-red-500 text-white rounded-md transition-all cursor-pointer'>About</li>
            </ul>

            <div className='flex items-center gap-4'>
                <SearchInput className='hidden xl:block'/>

                <div className='hidden xl:block relative'>
                    <div onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className='w-10 h-10 rounded-full rounded-full bg-gray-800 p-2 border-transparent hover:border-red-500 hover:bg-gray-700 transition-colors cursor-pointer'>
                        <User className='text-white'/>
                    </div>

                    {isDropdownOpen && (
                        <div className='absolute right-0 top-12 bg-gray-800 text-white rounded-md shadow-lg w-48'>
                            <ul className='p-2'>
                                <li className='px-4 py-2 hover:bg-red-500 rounded-md cursor-pointer'>Profile</li>
                                <li className='px-4 py-2 hover:bg-red-500 rounded-md cursor-pointer'>Settings</li>
                                <li className='px-4 py-2 hover:bg-red-500 rounded-md cursor-pointer'>Logout</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <Menu className='xl:hidden block text-5xl cursor-pointer'
            onClick={() => setIsMenuOpen(!isMenuOpen)}/>
            <div
        className={`absolute xl:hidden top-20 left-0 w-full bg-gray-900 
          flex flex-col items-center font-semibold text-base transform 
          transition-transform ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ transition: "transform 0.3s ease, opacity 0.3s ease" }}
      >
        <li className='list-none w-full text-center p-3 hover:bg-red-500 rounded-md transition-all cursor-pointer'>Home</li>
        <li className='list-none w-full text-center p-3 hover:bg-red-500 rounded-md transition-all cursor-pointer'>Videos</li>
        <li className='list-none w-full text-center p-3 hover:bg-red-500 rounded-md transition-all cursor-pointer'>Playlists</li>
        <li className='list-none w-full text-center p-3 hover:bg-red-500 rounded-md transition-all cursor-pointer'>About</li>
        <li onClick={() => setIsSubMenuOpen(!isSubMenuOpen)} className='list-none w-full text-center p-3 hover:bg-red-500 rounded-md transition-all cursor-pointer flex justify-center items-center gap-2'>
            Account
            <ChevronRight 
            size={16}
            className={`transition-transform ${isSubMenuOpen ? 'rotate-90' : ''}`} />
        </li>
        {isSubMenuOpen && (
        <ul className='w-full text-center bg-gray-800 rounded-md shadow-lg mt-1'>
            <li className='p-2 hover:bg-red-500 rounded-md cursor-pointer'>Login</li>
            <li className='p-2 hover:bg-red-500 rounded-md cursor-pointer'>Sign Up</li>
        </ul>
        )}
        <div className="w-11/12 my-2">
            <SearchInput />
        </div>
        </div>
        </header>
    )
}

import { Search } from 'lucide-react';

export default function SearchInput({ className = ''}) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <Search className="absolute left-3 text-gray-500 top-1/2 transform -translate-y-1/2 hidden xl:block" />

        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-2 py-2 rounded-xl border-1
          border-white focus:bg-gray-800 focus:outline-red-500"
        />
    </div>
    )
}
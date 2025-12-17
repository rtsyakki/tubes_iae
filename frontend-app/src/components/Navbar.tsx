import Link from 'next/link';
import { Menu, User, Globe } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-[#FF385C] text-2xl font-bold">Smart Laundry</span>
                        </Link>
                    </div>

                    {/* Middle Navigation */}
                    <div className="hidden md:flex space-x-8">
                        <Link href="/" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                            Home
                        </Link>
                        <button className="text-gray-900 border-b-2 border-black px-3 py-2 text-sm font-medium">
                            Services
                        </button>
                        <Link href="/track" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                            Track Order
                        </Link>
                    </div>

                    {/* Right Menu */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-sm font-medium text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-full cursor-pointer transition">
                            Join as Partner
                        </div>
                        <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                            <Globe size={18} />
                        </div>

                        <div className="flex items-center gap-2 border border-gray-300 rounded-full p-1 pl-3 hover:shadow-md transition cursor-pointer relative group">
                            <Menu size={18} />
                            <div className="bg-gray-500 rounded-full p-1 text-white">
                                <User size={18} fill="white" />
                            </div>

                            {/* Dropdown Menu */}
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-[0_6px_20px_rgba(0,0,0,0.12)] py-2 hidden group-hover:block border border-gray-100">
                                <Link href="/login" className="block px-4 py-2 hover:bg-gray-50 text-sm font-semibold text-gray-900">
                                    Log in
                                </Link>
                                <Link href="/register" className="block px-4 py-2 hover:bg-gray-50 text-sm text-gray-500">
                                    Sign up
                                </Link>
                                <div className="border-t border-gray-200 my-2"></div>
                                <Link href="/host" className="block px-4 py-2 hover:bg-gray-50 text-sm text-gray-500">
                                    Laundry your home
                                </Link>
                                <div className="block px-4 py-2 hover:bg-gray-50 text-sm text-gray-500">
                                    Help Center
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

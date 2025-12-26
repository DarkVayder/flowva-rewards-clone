import { NavLink } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

import {
  FaHome,
  FaCompass,
  FaBook,
  FaLayerGroup,
  FaCreditCard,
  FaGift,
  FaCog,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { HiOutlineSparkles } from "react-icons/hi2";
import { BiSupport } from 'react-icons/bi';
import { VscFeedback } from 'react-icons/vsc';
import logo from '../assets/logo.png';

const staticLinks = [
  { label: 'Home', icon: FaHome },
  { label: 'Discover', icon: FaCompass },
  { label: 'Library', icon: FaBook },
  { label: 'Tech Stack', icon: FaLayerGroup },
  { label: 'Subscriptions', icon: FaCreditCard },
];

export default function Sidebar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [_hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setMenuOpen(false);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const renderLinks = () => (
    <>
      {staticLinks.map(({ label, icon: Icon }) => (
        <div
          key={label}
          className="group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 cursor-not-allowed overflow-hidden transition-all duration-300"
          onMouseEnter={() => setHoveredLink(label)}
          onMouseLeave={() => setHoveredLink(null)}
        >
          <div className="absolute inset-0 bg-linear-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
          <Icon className="relative z-10 text-lg transition-transform duration-300 group-hover:scale-110" />
          <span className="relative z-10">{label}</span>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-linear-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Soon
          </div>
        </div>
      ))}

      <NavLink
        to="/rewards"
        onClick={closeMobile}
        className={({ isActive }) =>
          `group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold overflow-hidden transition-all duration-300 ${
            isActive
              ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
              : 'text-gray-700 hover:text-purple-700'
          }`
        }
        onMouseEnter={() => setHoveredLink('Rewards')}
        onMouseLeave={() => setHoveredLink(null)}
      >
        {({ isActive }) => (
          <>
            <div className={`absolute inset-0 bg-linear-to-r from-purple-50 to-pink-50 opacity-0 transition-opacity duration-300 ${!isActive && 'group-hover:opacity-100'}`} />
            <FaGift className={`relative z-10 text-lg transition-all duration-300 ${isActive ? 'animate-bounce' : 'group-hover:scale-110'}`} />
            <span className="relative z-10">Rewards Hub</span>
            {isActive && (
              <HiOutlineSparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-300 animate-pulse" />
            )}
          </>
        )}
      </NavLink>

      <div className="group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 cursor-not-allowed overflow-hidden transition-all duration-300">
        <div className="absolute inset-0 bg-linear-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
        <FaCog className="relative z-10 text-lg transition-transform duration-300 group-hover:rotate-90" />
        <span className="relative z-10">Settings</span>
      </div>
    </>
  );

  const renderUser = () => (
    <div className="relative border-t border-gray-100 p-4 shrink-0 bg-linear-to-br from-gray-50 to-white">
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="w-full flex items-center gap-3 text-left hover:bg-white p-3 rounded-xl transition-all duration-300 hover:shadow-md group cursor-pointer"
      >
        <div className="relative">
          <FaUserCircle className="text-4xl text-purple-500 transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        </div>
        <div className="flex-1 text-sm leading-tight">
          <p className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
            {user?.user_metadata?.full_name || 'User'}
          </p>
          <p className="text-xs text-gray-500 truncate max-w-40">
            {user?.email}
          </p>
        </div>
        <div className={`transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`}>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {menuOpen && (
        <div className="absolute bottom-full mb-3 left-4 right-4 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-slideUp">
          <div className="bg-linear-to-r from-purple-500 to-pink-500 h-1" />
          <button className="w-full flex items-center gap-3 px-5 py-4 text-sm text-gray-700 hover:bg-linear-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 group cursor-pointer">
            <VscFeedback className="text-lg text-purple-600 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-medium">Feedback</span>
          </button>
          <div className="h-px bg-gray-100 mx-4" />
          <button className="w-full flex items-center gap-3 px-5 py-4 text-sm text-gray-700 hover:bg-linear-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 group cursor-pointer">
            <BiSupport className="text-lg text-blue-600 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-medium">Support</span>
          </button>
          <div className="h-px bg-gray-100 mx-4" />
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center gap-3 px-5 py-4 text-sm text-red-600 hover:bg-linear-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 group font-medium cursor-pointer"
          >
            <FaSignOutAlt className="text-lg group-hover:scale-110 transition-transform duration-300 cursor-pointer" />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
        onClick={() => setMobileOpen((v) => !v)}
      >
        {mobileOpen ? (
          <FaTimes size={20} className="text-gray-700" />
        ) : (
          <FaBars size={20} className="text-gray-700" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-72 bg-linear-to-b from-white via-gray-50 to-white border-r border-gray-200 flex flex-col transform transition-all duration-500 ease-out z-40 shadow-xl md:shadow-none
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-6 py-6 shrink-0 border-b border-gray-100 bg-white">
          <div className="relative group">
            <img 
              src={logo} 
              alt="Flowva" 
              className="h-16 w-auto transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="absolute -inset-2 bg-linear-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent">
          <nav className="px-4 py-6 space-y-2">{renderLinks()}</nav>
          {user && renderUser()}
        </div>

        <div className="h-1 bg-linear-to-r from-purple-500 via-pink-500 to-purple-500" />
      </aside>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={closeMobile}
        />
      )}
      <style>
        {`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        `}
      </style>
    </>
  );
}
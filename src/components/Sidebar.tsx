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
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 opacity-70 cursor-not-allowed"
        >
          <Icon />
          {label}
        </div>
      ))}

      <NavLink
        to="/rewards"
        onClick={closeMobile}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-semibold ${
            isActive
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`
        }
      >
        <FaGift />
        Rewards Hub
      </NavLink>

      <div className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 opacity-70 cursor-not-allowed">
        <FaCog />
        Settings
      </div>
    </>
  );

  const renderUser = () => (
    <div className="relative border-t p-4 shrink-0">
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="w-full flex items-center gap-3 text-left hover:bg-gray-50 p-2 rounded-lg"
      >
        <FaUserCircle className="text-3xl text-gray-400" />
        <div className="text-sm leading-tight">
          <p className="font-medium text-gray-700">
            {user?.user_metadata?.full_name || 'User'}
          </p>
          <p className="text-xs text-gray-500 truncate max-w-[10rem]">
            {user?.email}
          </p>
        </div>
      </button>

      {menuOpen && (
        <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border rounded-xl shadow-lg z-50">
          <button className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50">
            <VscFeedback />
            Feedback
          </button>
          <button className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50">
            <BiSupport />
            Support
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
          >
            <FaSignOutAlt />
            Sign out
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow"
        onClick={() => setMobileOpen((v) => !v)}
      >
        {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white border-r flex flex-col transform transition-transform duration-300 z-40
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-6 py-5 shrink-0">
          <img src={logo} alt="Flowva" className="h-16 w-auto" />
        </div>

        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <nav className="px-3 space-y-1">{renderLinks()}</nav>
          {user && renderUser()}
        </div>
      </aside>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={closeMobile}
        />
      )}
    </>
  );
}
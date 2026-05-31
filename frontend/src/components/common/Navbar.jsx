import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LogOut, User, LayoutDashboard, ShoppingBag,
  Heart, Package, ChevronDown, Trash2, Store, ShoppingCart
} from 'lucide-react';
import { toast } from 'sonner';

// ── Avatar helper ─────────────────────────────────────────────────────────────

const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

// ── Menu items per role ───────────────────────────────────────────────────────

const getMenuItems = (role) => {
  const common = [
    { icon: <User size={15} />,          label: 'My Profile',   to: '/profile' },
    { icon: <LayoutDashboard size={15} />, label: 'Dashboard',  to: `/${role}/dashboard` },
  ];

  if (role === 'customer') return [
    ...common,
    { icon: <ShoppingCart size={15} />, label: 'My Cart',        to: '/cart'           },
    { icon: <ShoppingBag size={15} />, label: 'Current Orders',  to: '/current-orders'  },
    { icon: <Package size={15} />,     label: 'Previous Orders', to: '/previous-orders' },
    { icon: <Heart size={15} />,       label: 'Wishlist',        to: '/wishlist'        },
  ];

  if (role === 'artisan') return [
    ...common,
    { icon: <Store size={15} />,       label: 'My Products',  to: '/artisan/products' },
    { icon: <Package size={15} />,     label: 'My Orders',    to: '/artisan/orders'   },
  ];

  if (role === 'admin') return [
    ...common,
    { icon: <Package size={15} />,     label: 'Pending Requests', to: '/admin/pending' },
  ];

  return common;
};

// ── Component ─────────────────────────────────────────────────────────────────

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged Out Successfully');
    navigate('/login');
    setOpen(false);
  };

  const menuItems = isAuthenticated ? getMenuItems(user?.role) : [];

  return (
    <nav className="sticky top-0 z-50 bg-[#FFF9F3]/95 backdrop-blur-md border-b border-[#E7D5C7]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">

          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <h1 className="text-3xl font-bold text-[#A44A32] tracking-wide">
              CraftStory
            </h1>
          </Link>

          {/* CENTER NAV */}
          <div className="hidden md:flex items-center gap-10">
            <Link to="/about" className="text-[#6B3E2E] hover:text-[#C96A4A] transition font-medium">
              About
            </Link>

            {!isAuthenticated && (
              <>
                <Link to="/login" className="text-[#6B3E2E] hover:text-[#C96A4A] transition font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full bg-[#C96A4A] hover:bg-[#A44A32] text-white transition-all shadow-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* RIGHT — authenticated */}
          {isAuthenticated && (
            <div className="relative" ref={dropdownRef}>

              {/* Trigger button */}
              <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#F5E6D3] transition"
              >
                {/* Avatar */}
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border-2 border-[#C96A4A]"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#C96A4A] flex items-center justify-center text-white text-sm font-bold">
                    {getInitials(user?.name)}
                  </div>
                )}
                <span className="hidden md:block text-[#6B3E2E] font-medium max-w-[100px] truncate">
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-[#6B3E2E] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-[20px] shadow-2xl border border-[#E7D5C7] py-2 overflow-hidden">

                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-[#F5E6D3]">
                    <p className="font-semibold text-[#6B3E2E] truncate">{user?.name}</p>
                    <p className="text-xs text-[#6B3E2E]/60 truncate capitalize">{user?.role}</p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    {menuItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#6B3E2E] hover:bg-[#FFF9F3] hover:text-[#C96A4A] transition"
                      >
                        <span className="text-[#C96A4A]">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="border-t border-[#F5E6D3] py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[#6B3E2E] hover:bg-[#FFF9F3] hover:text-[#C96A4A] transition"
                    >
                      <LogOut size={15} className="text-[#C96A4A]" />
                      Sign Out
                    </button>
                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                    >
                      <Trash2 size={15} />
                      Delete Account
                    </Link>
                  </div>

                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;

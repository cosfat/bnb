"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-blue-600">Zafer Home</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {currentUser?.isAdmin && (
                <Link 
                  href="/houses" 
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Evler
                </Link>
              )}
              <Link 
                href="/expenses" 
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Giderler
              </Link>
              <Link 
                href="/reservations" 
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Rezervasyonlar
              </Link>
              {currentUser?.isAdmin && (
                <>
                  <Link 
                    href="/categories" 
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    Kategoriler
                  </Link>
                  <Link 
                    href="/settings" 
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    Ayarlar
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Mobil menü butonu */}
          <div className="flex items-center sm:hidden">
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Menüyü aç</span>
              {/* Hamburger icon */}
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
          
          {currentUser && (
            <div className="hidden sm:flex items-center">
              {currentUser.isAdmin && <span className="ml-2 text-xs text-white bg-blue-600 px-2 py-1 rounded-full">Admin</span>}
              <button
                onClick={logout}
                className="ml-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
              >
                Çıkış Yap
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobil menü */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            {currentUser?.isAdmin && (
              <Link 
                href="/houses" 
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Evler
              </Link>
            )}
            <Link 
              href="/expenses" 
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Giderler
            </Link>
            <Link 
              href="/reservations" 
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Rezervasyonlar
            </Link>
            {currentUser?.isAdmin && (
              <>
                <Link 
                  href="/categories" 
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Kategoriler
                </Link>
                <Link 
                  href="/settings" 
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Ayarlar
                </Link>
              </>
            )}
            {currentUser && (
              <button
                onClick={logout}
                className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-600 hover:bg-gray-50 hover:border-red-300 hover:text-red-800"
              >
                Çıkış Yap
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 
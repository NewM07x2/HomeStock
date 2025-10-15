"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header(){
  const [open, setOpen] = useState(false)

  return (
    <header className="flex-shrink-0 fixed top-0 left-0 right-0 z-10">
      <nav className="bg-gray-800 w-screen">
        <div className="flex items-center justify-between pl-4 pr-4 h-14">
          <div className="flex items-center">
            <Link href="/" className="text-gray-300 mr-4">Home</Link>
            {/* Desktop links: show when viewport >= 1000px */}
            <div className="hidden" style={{display:'none'}} data-desktop>
              {/* placeholder for CSS media query to show */}
            </div>
          </div>

          {/* hamburger for mobile */}
          <button aria-label="menu" className="mobile-only text-gray-300" onClick={() => setOpen(true)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop links container (will be shown by CSS when viewport >= 1000px) */}
          <div className="desktop-links hidden space-x-4">
            <Link href="/type-script" className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded">TypeScript</Link>
            <Link href="/blog-page" className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded">Blog</Link>
            <Link href="/contact-page" className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded">Contact</Link>
            <Link href="/modal-page" className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded">Modal</Link>
            <Link href="/reducer-page" className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded">Reducer</Link>
            <Link href="/redux-page" className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded">Redux</Link>
            <Link href="/api" className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded">API</Link>
            <Link href="/graphql" className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded">Graphql</Link>
          </div>
        </div>
      </nav>

      {/* Slide-over menu for mobile */}
      <div className={`fixed inset-y-0 left-0 z-20 transform ${open ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out w-64 bg-white shadow`}>
        <div className="p-4 border-b flex items-center justify-between">
          <div className="text-lg font-semibold">Menu</div>
          <button aria-label="close" onClick={() => setOpen(false)} className="text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            <li><Link href="/" className="block">Home</Link></li>
            <li><Link href="/type-script" className="block">TypeScript</Link></li>
            <li><Link href="/blog-page" className="block">Blog</Link></li>
            <li><Link href="/contact-page" className="block">Contact</Link></li>
            <li><Link href="/modal-page" className="block">Modal</Link></li>
            <li><Link href="/reducer-page" className="block">Reducer</Link></li>
            <li><Link href="/redux-page" className="block">Redux</Link></li>
            <li><Link href="/api" className="block">API</Link></li>
            <li><Link href="/graphql" className="block">Graphql</Link></li>
          </ul>
        </div>
      </div>

      {/* background overlay when menu open */}
      {open && <div className="fixed inset-0 bg-black bg-opacity-30 z-10" onClick={() => setOpen(false)} />}

      <style jsx>{`
        @media (min-width: 1000px) {
          .desktop-links { display: flex !important }
          .mobile-only { display: none !important }
        }
        @media (max-width: 999px) {
          .desktop-links { display: none !important }
          .mobile-only { display: inline-flex !important }
        }
      `}</style>
    </header>
  )
}

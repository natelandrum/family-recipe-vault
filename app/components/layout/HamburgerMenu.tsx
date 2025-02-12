'use client'

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import MenuBook from "@mui/icons-material/MenuBook";


export const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="lg:hidden">
      <Image
        src="/hamburger-icon.png"
        alt="menu"
        width={32}
        height={32}
        className="cursor-pointer"
        onClick={toggleMenu}
      />
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform 
                ${isOpen ? 'translate-x-0' : 'translate-x-full'} 
                transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex justify-end p-4">
          <Image
            src="/close-icon.png"
            alt="close menu"
            width={22}
            height={22}
            className="cursor-pointer"
            onClick={toggleMenu}
          />
        </div>
        <div className="flex flex-col space-y-4 p-4">
          <Link href="/" className="text-black text-2xl hover:text-[var(--color-accent)] nav-text" onClick={toggleMenu}>
            Home
          </Link>
          <Link href="/about" className="text-black text-2xl hover:text-[var(--color-accent)] nav-text" onClick={toggleMenu}>
            About
          </Link>
          <Link href="/recipes" className="text-black text-2xl hover:text-[var(--color-accent)] nav-text" onClick={toggleMenu}>
            Recipes
          </Link>
          <Link href="/meal-plan" className="text-black hover:text-[var(--color-accent)] nav-text">
            <MenuBook /> Plan
          </Link>
          {session ? (
            <>
              <Link href="/profile" className="text-black hover:text-[var(--color-accent)] nav-text" onClick={toggleMenu}>
                {session?.user?.name}
              </Link>
              <button className="bg-[var(--color-dark)] hover:bg-[var(--color-accent)] text-white py-1 px-4 rounded-lg" onClick={() => { signOut(); toggleMenu(); }}>
                Sign Out
              </button>
            </>
          ) : (
            <button type='button' className="bg-[var(--color-dark)] hover:bg-[var(--color-accent)] text-white nav-text py-1 px-4 rounded-lg" onClick={() => { signIn(); toggleMenu(); }}>
              Sign In
            </button>
          )}
        </div>
      </div>
      {isOpen && (
        <div className='fixed inset-0 bg-black opacity-50 lg:hidden z-40' onClick={toggleMenu}></div>
      )}
    </div>
  );
};
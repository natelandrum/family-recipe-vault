'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from "next/image";

function AuthButton() {
    const { data: session } = useSession();
    if (session) {
        return (
          <>
            <Link href="/profile" className="text-2xl nav-text">
              {session?.user?.name}
            </Link>
            <br />
            <button className="text-2xl bg-[var(--color-dark)] text-white nav-text" onClick={() => signOut()}>
              Sign Out
            </button>
          </>
        );
    }
    return (
      <button type='button' className="text-2xl hover:text-[var(--color-dark)] nav-text" onClick={() => signIn()}>
        Sign In
      </button>
    );
}

export default function NavMenu() {
    const [isOpen, setIsOpen] = useState(false); 

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="bg-white shadow-md py-4">
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center">
                  <Image
                    src="/logo.png" 
                    alt="Family Recipe Vault Logo"
                    width={40}  
                    height={40} 
                  />
                  <Link href="/" className="font-bold text-3xl p-4 nav-text">
                      Family Recipe Vault
                  </Link>
                </div>


                <button 
                  className="md:hidden text-3xl"
                  onClick={toggleMenu}
                >
                  {isOpen ? '×' : '☰'} 
                </button>

                <div className={`flex md:flex-row flex-col md:space-x-6 space-y-4 ${isOpen ? 'block' : 'hidden'} md:block`}>
                    <Link href="/" className="text-2xl hover:text-[var(--color-dark)] nav-text">
                        Home
                    </Link>
                    <Link href="/about" className="text-2xl hover:text-[var(--color-dark)] nav-text">
                        About
                    </Link>
                    <AuthButton />
                </div>
            </div>
        </nav>
    );
}
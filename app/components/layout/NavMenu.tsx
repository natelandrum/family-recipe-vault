'use client';

import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from "next/image";
import { HamburgerMenu } from './HamburgerMenu';
import MenuBook from "@mui/icons-material/MenuBook";

function AuthButton() {
    const { data: session } = useSession();
    if (session) {
        return (
          <>
            <Link
              href="/profile"
              className="text-black hover:text-[var(--color-accent)] nav-text"
            >
              {session?.user?.name}
            </Link>
            <br />
            <button
              className="text-1xl bg-[var(--color-dark)] hover:bg-[var(--color-accent)] nav-text text-white px-4 rounded-lg"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </>
        );
    }
    return (
      <button
        type="button"
        className="text-1xl bg-[var(--color-dark)] hover:bg-[var(--color-accent)] nav-text text-white px-4 rounded-lg"
        onClick={() => signIn()}
      >
        Sign In
      </button>
    );
}

export default function NavMenu() {
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
            <Link
              href="/"
              className="font-bold text-black sm:text-3xl md:text-3xl p-4 nav-text"
            >
              Family Recipe Vault
            </Link>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/"
              className="text-black hover:text-[var(--color-accent)] nav-text"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-black hover:text-[var(--color-accent)] nav-text"
            >
              About
            </Link>
            <Link
              href="/recipes"
              className="text-black hover:text-[var(--color-accent)] nav-text"
            >
              Recipes
            </Link>
            <Link
              href="/meal-plan"
              className="text-black hover:text-[var(--color-accent)] nav-text"
            >
              <MenuBook /> Plan
            </Link>
            <AuthButton />
          </div>
          <HamburgerMenu />
        </div>
      </nav>
    );
}

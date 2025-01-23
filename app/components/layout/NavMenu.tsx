'use client';

import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

function AuthButton() {
    const { data: session } = useSession();
    if (session) {
        return (
          <>
            <Link href="/profile" className="text-red-500">
              {session?.user?.name}
            </Link>
            <br />
            <button className="text-red-500" onClick={() => signOut()}>
              Sign Out
            </button>
          </>
        );
    }
    return (
      <button type='button' className="text-red-500" onClick={() => signIn()}>
        Sign In
      </button>
    );
}

export default function NavMenu() {
    return (
        <nav className="bg-white shadow-md py-4">
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="text-red-500 font-bold text-xl">
                    Family Recipe Vault
                </Link>
                <div className="flex space-x-4">
                    <Link href="/" className="text-red-500">
                        Home
                    </Link>
                    <Link href="/about" className="text-red-500">
                        About
                    </Link>
                    <AuthButton />
                </div>
            </div>
        </nav>
    );
}
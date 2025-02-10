import Link from "next/link";

export default function Footer() {
    return (
      <footer className="bg-[var(--color-dark)] text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Family Recipe Vault. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
          <Link href="/privacy-policy" className="hover:text-[var(--color-primary)]">Privacy Policy </Link>
          <Link href="/terms-of-service" className="hover:text-[var(--color-primary)]">Terms of Service </Link>
          <Link href="/contact" className="hover:text-[var(--color-primary)]">Contact Us </Link>
          </div>
        </div>
      </footer>
    );
  }
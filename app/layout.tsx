import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "@/app/components/layout/SessionProvider";
import NavMenu from "@/app/components/layout/NavMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "Family Recipe Vault | %s",
    default: "Family Recipe Vault",
  },
  description:
    "Secure, organize, and share your cherished family recipes with ease. Keep traditions alive for generations to come.",
  metadataBase: new URL("https://family-recipe-vault.vercel.app"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider session={session}>
            <NavMenu />
            {children}
        </SessionProvider>
      </body>
    </html>
  );
}

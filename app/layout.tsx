import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Amplify Dashboard',
  description: 'AI System Orchestration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-zinc-950" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen text-zinc-100`} suppressHydrationWarning>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}

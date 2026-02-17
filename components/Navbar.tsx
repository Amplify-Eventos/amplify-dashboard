import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center font-bold text-white group-hover:scale-110 transition-transform">
                A
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-100 group-hover:text-white transition-colors">
                AMPLIFY
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              <NavLink href="/tasks">Tasks</NavLink>
              <NavLink href="/agents">Agents</NavLink>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-widest">System Status</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-medium text-emerald-500">OPTIMAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all"
    >
      {children}
    </Link>
  );
}

import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Map, Ambulance, History, Siren } from 'lucide-react';
import clsx from 'clsx';

export default function Layout() {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Dispatch Map', path: '/map', icon: Map },
    { name: 'Fleet Status', path: '/fleet', icon: Ambulance },
    { name: 'Incident History', path: '/incidents', icon: History },
  ];

  return (
    <div className="flex h-screen bg-gray-100 text-slate-800 font-sans">

      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Siren className="w-8 h-8 text-red-600 mr-2" />
          <span className="text-xl font-bold text-slate-900 tracking-tight">ResQ</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-red-50 text-red-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t text-xs text-gray-400 text-center">
          &copy; 2025 ResQ Systems
        </div>
      </aside>


      <main className="flex-1 ml-64 overflow-y-auto">

        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-700">Medical Dispatch Console</h2>
            <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">Operator: <strong>Admin</strong></span>
                <div className="w-8 h-8 rounded-full bg-slate-200"></div>
            </div>
        </header>

  
        <div className="p-8">
            <Outlet />
        </div>
      </main>
    </div>
  );
}
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PrachayLogo from './PrachayLogo';
import {
  LayoutDashboard,
  FilePlus,
  FileStack,
  ClipboardCheck,
  Files,
  LogOut,
  User,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

const NAV_BY_ROLE = {
  employee: [
    { to: '/employee', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/employee/create', label: 'Create Voucher', icon: FilePlus },
    { to: '/employee/vouchers', label: 'My Vouchers', icon: FileStack },
  ],
  director: [
    { to: '/director', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/director/pending', label: 'Pending Approvals', icon: ClipboardCheck },
    { to: '/director/vouchers', label: 'All Vouchers', icon: Files },
  ],
  accounts: [
    { to: '/accounts', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/accounts/vouchers', label: 'All Vouchers', icon: Files },
  ],
};

const ROLE_CONFIG = {
  employee: { label: 'Employee Portal', color: 'bg-blue-100 text-[#1d5b96] border-blue-200' },
  director: { label: 'Director Approval Hub', color: 'bg-amber-100 text-[#d97706] border-amber-200' },
  accounts: { label: 'Accounts & Disbursement', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = NAV_BY_ROLE[user?.role] || [];
  const roleCfg = ROLE_CONFIG[user?.role] || ROLE_CONFIG.employee;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-amber-100 selection:text-amber-900 print:bg-white print:block">
      {/* Light Corporate Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col shrink-0 shadow-sm z-20 print:hidden">
        <div className="p-6 border-b border-slate-100">
          <Link to="/" className="block">
            <PrachayLogo className="h-9" />
          </Link>
        </div>

        {/* Role Badge Header */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/60 flex items-center justify-between">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${roleCfg.color}`}>
            {roleCfg.label}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1d5b96] text-white shadow-md shadow-blue-900/10'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#1d5b96] text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 py-2 rounded-xl transition-all"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 overflow-y-auto print:overflow-visible">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 print:p-0 print:max-w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, Search, MessageCircle, User, LogOut, ShieldAlert, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function DashboardLayout() {
  const { user, profile, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { label: "Discovery", icon: Search, path: "/discovery" },
    { label: "Messages", icon: MessageCircle, path: "/chat" },
    { label: "Profile", icon: User, path: "/profile" },
  ];

  if (profile?.role === 'admin') {
    navItems.push({ label: "Admin", icon: ShieldAlert, path: "/admin" });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between">
        <Link to="/discovery" className="flex items-center gap-2">
          <div className="p-1.5 bg-violet-600 rounded-lg">
            <Unlock className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Unlocked Love</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => signOut()}>
          <LogOut className="w-5 h-5 text-gray-500" />
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Desktop */}
        <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col shrink-0">
          <div className="p-6">
            <Link to="/discovery" className="flex items-center gap-2">
              <div className="p-1.5 bg-violet-600 rounded-lg">
                <Unlock className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Unlocked Love</span>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    isActive
                      ? "bg-violet-50 text-violet-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-violet-600" : "text-gray-400"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-3 py-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center overflow-hidden">
                {profile?.photos?.[0] ? (
                  <img src={profile.photos[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-violet-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {profile?.name || "Member"}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-red-600 hover:border-red-100"
              onClick={() => signOut()}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative bg-gray-50">
          <div className="max-w-5xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 h-16 flex items-center justify-between z-50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center flex-1"
              >
                <Icon className={`w-6 h-6 ${isActive ? "text-violet-600" : "text-gray-400"}`} />
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 w-1 h-1 bg-violet-600 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User, LogOut, MessageSquare, Heart, Settings, Shield, Unlock } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdmin = user?.email?.endsWith('@admin.unlockedlove.com');

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || location.pathname !== '/' ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 py-3 shadow-md" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95 duration-200">
          <div className="flex items-center gap-2">
            <motion.div 
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="bg-violet-600 p-2 rounded-xl shadow-lg shadow-violet-200"
            >
              <Unlock className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Unlocked<span className="text-violet-600">Love</span>
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          {user ? (
            <>
              <Link to="/discovery" className="hover:text-violet-600 transition-colors flex items-center gap-2">
                <Heart className="w-4 h-4" /> Discover
              </Link>
              <Link to="/chat" className="hover:text-violet-600 transition-colors flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Chat
              </Link>
              {isAdmin && (
                <Link to="/admin" className="hover:text-violet-600 transition-colors flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Admin
                </Link>
              )}
            </>
          ) : (
            ["how-it-works", "features", "safety"].map((item) => (
              <a 
                key={item}
                href={`/#${item}`} 
                className="hover:text-violet-600 transition-colors capitalize"
              >
                {item.replace(/-/g, ' ')}
              </a>
            ))
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full focus-visible:ring-violet-600">
                  <Avatar className="h-10 w-10 border-2 border-violet-100">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-violet-100 text-violet-600 font-bold">
                      {user.email?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/chat')}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Messages</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                variant="ghost" 
                className="hidden sm:inline-flex text-gray-600 hover:text-violet-600 font-medium"
                onClick={() => navigate('/login')}
              >
                Log in
              </Button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6 shadow-lg shadow-violet-200 font-semibold"
                  onClick={() => navigate('/signup')}
                >
                  Join Free
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
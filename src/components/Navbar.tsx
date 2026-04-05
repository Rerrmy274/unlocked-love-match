import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 py-3 shadow-md" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95 duration-200">
          <img 
            src="/images/logo.png" 
            alt="PataMpoa" 
            className="h-10 md:h-12 w-auto object-contain"
            onError={(e) => {
              // Fallback to stylized text if logo fails to load
              e.currentTarget.style.display = 'none';
              const fallback = document.getElementById('navbar-logo-fallback');
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
          <div id="navbar-logo-fallback" className="hidden flex items-center gap-2">
            <motion.div 
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="bg-violet-600 p-1.5 rounded-lg shadow-sm"
            >
              <span className="text-white font-bold text-xs">PM</span>
            </motion.div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              PataMpoa<span className="text-violet-600">.</span>
            </span>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          {["how-it-works", "features", "safety"].map((item) => (
            <motion.a 
              key={item}
              href={`#${item}`} 
              whileHover={{ y: -2 }}
              className="hover:text-violet-600 transition-colors capitalize"
            >
              {item.replace(/-/g, ' ')}
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden sm:inline-flex text-gray-600 hover:text-violet-600">
            Log in
          </Button>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6 shadow-lg shadow-violet-200">
              Join Free
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
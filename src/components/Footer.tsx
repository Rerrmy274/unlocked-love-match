import { Heart, Instagram, Twitter, Facebook, Mail, Unlock } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-violet-600 p-1.5 rounded-lg"
              >
                <Unlock className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                Unlocked<span className="text-violet-600">Love</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              The first truly free dating platform for Nairobi. We're on a mission to bring people together without paywalls.
            </p>
            <div className="flex items-center gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <motion.a 
                  key={i}
                  href="#" 
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-violet-600 transition-colors shadow-sm"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 font-mono text-sm uppercase tracking-wider text-violet-600">Product</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              {["How it works", "Features", "Safety", "Success Stories"].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="hover:text-violet-600 transition-colors font-medium">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 font-mono text-sm uppercase tracking-wider text-violet-600">Legal</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              {["Terms of Service", "Privacy Policy", "Cookie Policy", "Safety Tips"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-violet-600 transition-colors font-medium">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 font-mono text-sm uppercase tracking-wider text-violet-600">Contact</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li className="flex items-center gap-2 font-medium">
                <Mail className="w-4 h-4 text-violet-600" />
                <span>hello@unlockedlove.africa</span>
              </li>
              <li className="font-medium text-gray-400">Nairobi, Kenya</li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-400 font-medium">
            &copy; {new Date().getFullYear()} Unlocked Love. All rights reserved.
          </p>
          <motion.p 
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-[10px] text-gray-400 uppercase tracking-widest max-w-xs text-center md:text-right font-bold"
          >
            Nairobi's Free Dating Revolution
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
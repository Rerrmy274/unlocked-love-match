import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();
  
  const handleJoin = () => {
    navigate("/signup");
  };

  return (
    <section className="relative pt-12 pb-20 md:pt-32 md:pb-32 overflow-hidden bg-gradient-to-b from-violet-50/50 to-white">
      {/* Background Decorative Elements with Infinite Motion */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
          x: [0, 20, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-3xl -z-10" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, -10, 0],
          x: [0, -30, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-sky-100/40 rounded-full blur-3xl -z-10" 
      />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col space-y-8"
          >
            <motion.div 
              animate={{ 
                boxShadow: ["0 0 0px rgba(139, 92, 246, 0)", "0 0 20px rgba(139, 92, 246, 0.3)", "0 0 0px rgba(139, 92, 246, 0)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Free Messaging Forever</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
              Unlock Real <br />
              <span className="text-violet-600 italic">Connections</span> <br />
              Without Paying.
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed">
              No hidden paywalls. No limits on swipes. Just you and the people you want to meet on Unlocked Love.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button 
                  onClick={handleJoin}
                  className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white h-14 px-10 text-lg rounded-full shadow-xl shadow-violet-200 transition-all duration-300 font-bold"
                >
                  Join Free Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto h-14 px-10 text-lg rounded-full border-2 border-violet-100 text-violet-700 hover:bg-violet-50 transition-all duration-300 font-medium"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See How It Works
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4 text-sm font-medium text-gray-500">
              <div className="flex items-center gap-2">
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2.5 h-2.5 bg-green-500 rounded-full" 
                />
                <span>1,240 Online Now</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                <span>450 New Matches Today</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-full max-w-[500px]"
            >
              <img 
                src="https://storage.googleapis.com/dala-prod-public-storage/attachments/0883fc6e-7eaa-453d-874a-a178a18b4390/1775363213337_image__1_-removebg-preview.png" 
                alt="Beautiful smiling woman" 
                className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(139,92,246,0.3)]"
              />
            </motion.div>
            
            {/* Floating Heart Cards */}
            <motion.div
              animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
              className="absolute top-1/4 left-0 bg-white p-4 rounded-2xl shadow-xl border border-violet-100 flex items-center gap-3 z-20"
            >
              <div className="bg-red-50 p-2 rounded-lg">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">New Match!</p>
                <p className="text-sm font-bold text-gray-900">Sarah liked you</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
import { motion } from "framer-motion";
import { ShieldAlert, Fingerprint, Flag, UserCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Safety() {
  const handleJoin = () => {
    toast.success("Ready to join safely!", {
      description: "Our moderation team is active 24/7.",
    });
  };

  return (
    <section id="safety" className="py-24 bg-gray-900 text-white overflow-hidden relative">
      {/* Background glow with motion */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[120px] -z-10" 
      />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <motion.div 
              animate={{ 
                x: [0, 5, 0],
                borderColor: ["rgba(167, 139, 250, 0.2)", "rgba(167, 139, 250, 0.6)", "rgba(167, 139, 250, 0.2)"]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-flex items-center gap-2 bg-violet-500/20 text-violet-300 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-transparent"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Safety First</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Your Safety <br />
              Comes First
            </h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-xl">
              We actively block fake profiles and moderate chats using AI and human review. Report anyone instantly. Your privacy is protected with industry-standard encryption.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {[
                { icon: <UserCheck className="w-5 h-5 text-violet-400" />, title: "Human Review", desc: "Every profile is checked by our team." },
                { icon: <Flag className="w-5 h-5 text-violet-400" />, title: "One-Tap Report", desc: "Report suspicious behavior instantly." },
                { icon: <Fingerprint className="w-5 h-5 text-violet-400" />, title: "Private Data", desc: "Your info is never shared or sold." },
                { icon: <ShieldAlert className="w-5 h-5 text-violet-400" />, title: "Zero Tolerance", desc: "Immediate bans for harassment." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    className="bg-violet-500/20 p-2 rounded-lg group-hover:bg-violet-500/30 transition-colors"
                  >
                    {item.icon}
                  </motion.div>
                  <div>
                    <h4 className="font-bold mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button 
              onClick={handleJoin}
              className="bg-violet-600 hover:bg-violet-700 text-white h-14 px-10 text-lg rounded-full shadow-xl shadow-violet-900/20 transition-all duration-300"
            >
              Join Free Now
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="bg-violet-600 rounded-[40px] p-8 md:p-12 relative z-10 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center overflow-hidden border-2 border-white/40 shadow-inner">
                  <img 
                    src="https://storage.googleapis.com/dala-prod-public-storage/attachments/0883fc6e-7eaa-453d-874a-a178a18b4390/1775362767485_image__2_.jpg" 
                    alt="Anita M. - Verified User" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center -mt-12 -mr-12 relative z-20 border border-white/30"
                >
                  <ShieldCheck className="w-6 h-6 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-bold pt-4">Safe Connections</h3>
                <p className="text-violet-100 italic">
                  "I was hesitant about online dating, but the verification process here made me feel much more comfortable meeting new people in the city."
                </p>
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <p className="text-sm font-bold">Anita M.</p>
                    <p className="text-[10px] text-violet-200 uppercase tracking-widest font-semibold">Verified User • Nairobi</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Additional floating safety badge */}
            <motion.div 
              animate={{ 
                y: [0, -10, 0],
                x: [0, 5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
              className="absolute -top-6 -right-6 bg-green-500 text-white p-3 rounded-2xl shadow-xl flex items-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-bold">100% Encrypted</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
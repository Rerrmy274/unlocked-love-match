import { motion } from "framer-motion";
import { MessageCircle, Zap, ShieldCheck, MapPin, Sparkles, Lock, TrendingUp, Eye, LayoutDashboard } from "lucide-react";

const features = [
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Free Messaging",
    benefit: "Talk to anyone you match with, no payment required"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Real-Time Chat",
    benefit: "Instant messaging like WhatsApp"
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Verified Profiles",
    benefit: "Reduce fake accounts, build trust"
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Location Discovery",
    benefit: "Meet people nearby"
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Smart Matching",
    benefit: "Only see profiles relevant to you"
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Safe & Secure",
    benefit: "Block/report users, secure data"
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Boost Feature",
    benefit: "Optional paid profile visibility boost"
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "Profile Privacy",
    benefit: "Control who sees you anytime"
  },
  {
    icon: <LayoutDashboard className="w-6 h-6" />,
    title: "Simple Design",
    benefit: "No clutter, easy navigation"
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Features & Benefits</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need for a better dating experience, built with user satisfaction first.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                className="bg-violet-100 text-violet-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-violet-600 group-hover:text-white transition-colors"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.benefit}
              </p>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-0 rounded-[40px] bg-violet-600 text-white overflow-hidden relative min-h-[400px] flex items-stretch shadow-2xl"
        >
          <motion.div 
            animate={{ 
              background: [
                "radial-gradient(circle at 100% 0%, rgba(255,255,255,0.2) 0%, transparent 50%)",
                "radial-gradient(circle at 0% 100%, rgba(255,255,255,0.2) 0%, transparent 50%)",
                "radial-gradient(circle at 100% 0%, rgba(255,255,255,0.2) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute inset-0 z-10" 
          />
          
          <div className="grid md:grid-cols-2 w-full">
            <div className="p-8 md:p-16 flex flex-col justify-center relative z-20">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Be among the first 100 users in Nairobi to join.
              </h3>
              <p className="text-violet-100 mb-8 max-w-md text-lg leading-relaxed">
                Early users get a permanent "Founding Member" badge on their profile and 100% free messaging forever.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
                >
                  <ShieldCheck className="w-5 h-5 text-green-300" />
                  <span className="text-sm font-medium">Verified only</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
                >
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium">Free Messaging</span>
                </motion.div>
              </div>
            </div>
            
            <div className="relative h-[300px] md:h-auto overflow-hidden">
              <motion.img 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                src="https://storage.googleapis.com/dala-prod-public-storage/attachments/0883fc6e-7eaa-453d-874a-a178a18b4390/1775362767483_image__3_.jpg" 
                alt="Founding Member concept" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-violet-600/20 to-violet-600 hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-violet-600 via-transparent to-transparent md:hidden" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
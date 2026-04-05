import { motion } from "framer-motion";
import { Lock, EyeOff, Wallet, XCircle } from "lucide-react";

const pains = [
  {
    icon: <Wallet className="w-6 h-6 text-red-500" />,
    title: "Everything is behind a paywall",
    description: "Want to see who liked you? Pay. Want to message first? Pay. It never ends."
  },
  {
    icon: <EyeOff className="w-6 h-6 text-red-500" />,
    title: "Likes are invisible",
    description: "You get notifications for likes you can never see unless you upgrade to Premium."
  },
  {
    icon: <Lock className="w-6 h-6 text-red-500" />,
    title: "You swipe... then can't message",
    description: "Finally get a match, but the app limits your free chats to only 2 per day."
  }
];

export function ProblemSection() {
  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why Users Hate Existing Platforms
          </h2>
          <p className="text-lg text-gray-600">
            Dating shouldn't feel like a subscription service. We've all experienced the frustration of modern dating apps.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {pains.map((pain, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group h-full"
            >
              <motion.div 
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"
              >
                <XCircle className="w-24 h-24 text-red-600" />
              </motion.div>
              <div className="bg-red-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 relative z-10">
                {pain.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 relative z-10">{pain.title}</h3>
              <p className="text-gray-600 leading-relaxed relative z-10">
                {pain.description}
              </p>
            </motion.div>
          ))}
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 rounded-3xl overflow-hidden shadow-xl border-4 border-white relative group min-h-[300px]"
          >
            <motion.img 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              src="https://storage.googleapis.com/dala-prod-public-storage/attachments/0883fc6e-7eaa-453d-874a-a178a18b4390/1775362767488_image.jpg" 
              alt="Intimate portrait illustrating locked content" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 to-transparent flex flex-col justify-end p-6">
              <div className="flex items-center gap-2 text-white mb-2">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Lock className="w-4 h-4" />
                </motion.div>
                <span className="text-xs font-bold uppercase tracking-wider">Locked Feature</span>
              </div>
              <p className="text-white text-sm font-medium">Don't let paywalls block your chance at a real connection.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
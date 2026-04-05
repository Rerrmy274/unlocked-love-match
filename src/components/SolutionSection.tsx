import { motion } from "framer-motion";
import { CheckCircle2, MessageSquare, Zap, ShieldCheck, Heart } from "lucide-react";

const benefits = [
  "Free messaging after matching",
  "No hidden upgrades or subscriptions",
  "Real-time chat with live notifications",
  "Verified users only",
  "Simple, clean interface"
];

export function SolutionSection() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-violet-600 aspect-square flex items-center justify-center group"
            >
               <img 
                src="https://storage.googleapis.com/dala-prod-public-storage/attachments/0883fc6e-7eaa-453d-874a-a178a18b4390/1775362767485_image__2_.jpg" 
                alt="Happy verified user smiling" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-violet-900/40 to-transparent" />
              
              {/* Overlay Animation elements */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md rounded-full p-8"
              >
                <Heart className="w-16 h-16 text-white fill-white" />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Finally, Dating <br />
              <span className="text-violet-600">Without Paywalls</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We built this platform for one reason: to help people connect without their wallets getting in the way.
            </p>
            
            <ul className="space-y-4">
              {benefits.map((benefit, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    className="bg-green-100 p-1 rounded-full"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </motion.div>
                  <span className="text-gray-800 font-medium">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-sky-50 p-4 rounded-2xl"
              >
                <MessageSquare className="w-6 h-6 text-sky-600 mb-2" />
                <h4 className="font-bold text-gray-900">Real-Time</h4>
                <p className="text-xs text-gray-600">Instant delivery</p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-violet-50 p-4 rounded-2xl"
              >
                <ShieldCheck className="w-6 h-6 text-violet-600 mb-2" />
                <h4 className="font-bold text-gray-900">Verified</h4>
                <p className="text-xs text-gray-600">No fake bots</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
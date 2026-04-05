import { motion } from "framer-motion";
import { UserPlus, Search, MessageSquareHeart, TrendingUp } from "lucide-react";

const steps = [
  {
    title: "Create your profile",
    description: "Include your avatar, bio, and location. It takes under 2 minutes.",
    icon: <UserPlus className="w-8 h-8 text-white" />,
    color: "bg-violet-600"
  },
  {
    title: "Browse people nearby",
    description: "Filter by age and distance to find exactly who you're looking for.",
    icon: <Search className="w-8 h-8 text-white" />,
    color: "bg-sky-500"
  },
  {
    title: "Match & chat instantly",
    description: "Message your matches for free. No limits, no restrictions.",
    icon: <MessageSquareHeart className="w-8 h-8 text-white" />,
    color: "bg-purple-500"
  },
  {
    title: "Optional Boost",
    description: "Get seen by more people with our only paid feature (totally optional).",
    icon: <TrendingUp className="w-8 h-8 text-white" />,
    color: "bg-gray-800"
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We've simplified the process to get you from swiping to meeting as fast as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative mb-16">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-1/4 left-[15%] right-[15%] h-0.5 bg-gray-100 -z-10" />
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 relative`}
              >
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-white border-4 border-gray-50 text-gray-900 rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                {step.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto rounded-[40px] overflow-hidden shadow-2xl relative group h-[400px]"
        >
          <motion.img 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            src="https://storage.googleapis.com/dala-prod-public-storage/attachments/0883fc6e-7eaa-453d-874a-a178a18b4390/1775362767482_image__4_.jpg" 
            alt="Woman in green lingerie" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-violet-900/60 to-transparent flex items-center p-12">
            <div className="max-w-xs text-white">
              <motion.h4 
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-3xl font-bold mb-2"
              >
                Real Content.
              </motion.h4>
              <p className="text-violet-100">Genuine connections start with authentic sharing.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Decorative */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-sky-50 rounded-full blur-3xl -z-10" 
      />
    </section>
  );
}
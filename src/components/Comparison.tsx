import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const rows = [
  { feature: "Free Messaging", us: true, competitors: false },
  { feature: "See Who Liked You", us: "❌ (Wait for match)", competitors: "❌ (Locked)" },
  { feature: "Verified Profiles", us: true, competitors: "❌ / Paid" },
  { feature: "Simple UI", us: true, competitors: false },
];

export function Comparison() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">How We Compare</h2>
          <p className="text-gray-600">We're built for connection, not subscriptions.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 overflow-hidden rounded-3xl border border-gray-100 shadow-xl bg-white"
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-6 text-lg font-bold text-gray-900">Feature</th>
                  <th className="p-6 text-lg font-bold text-violet-600 text-center whitespace-nowrap">Unlocked Love</th>
                  <th className="p-6 text-lg font-bold text-gray-400 text-center">Others</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-6 font-medium text-gray-700">{row.feature}</td>
                    <td className="p-6 text-center">
                      {typeof row.us === "boolean" ? (
                        row.us ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }}>
                            <Check className="w-6 h-6 text-green-500 mx-auto" />
                          </motion.div>
                        ) : (
                          <X className="w-6 h-6 text-red-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm font-semibold text-gray-600">{row.us}</span>
                      )}
                    </td>
                    <td className="p-6 text-center">
                      {typeof row.competitors === "boolean" ? (
                        row.competitors ? (
                          <Check className="w-6 h-6 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-6 h-6 text-red-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm font-semibold text-gray-400">{row.competitors}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-violet-50 p-6 text-center">
              <motion.p 
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-violet-700 font-bold italic"
              >
                "We’re built for connection, not subscriptions."
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hidden lg:block relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl border-4 border-white"
          >
            <motion.img 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              src="https://storage.googleapis.com/dala-prod-public-storage/attachments/0883fc6e-7eaa-453d-874a-a178a18b4390/1775362767480_image__5_.jpg" 
              alt="Woman in black lingerie near window" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-violet-900/60 to-transparent flex flex-col justify-end p-8">
              <p className="text-white font-bold text-xl italic leading-tight">
                "Join the thousands making real connections today."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
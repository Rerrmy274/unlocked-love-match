import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { SolutionSection } from "@/components/SolutionSection";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { Comparison } from "@/components/Comparison";
import { Safety } from "@/components/Safety";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-violet-100 selection:text-violet-900">
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Hero />
            <ProblemSection />
            <SolutionSection />
            <HowItWorks />
            <Features />
            <Comparison />
            <Safety />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <Toaster position="top-center" expand={true} richColors />
    </div>
  );
}

export default App;
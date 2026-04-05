import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { SolutionSection } from "@/components/SolutionSection";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { Comparison } from "@/components/Comparison";
import { Safety } from "@/components/Safety";
import { motion } from "framer-motion";
import { useEffect } from "react";

export function LandingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Unlocked Love | Nairobi's Free Dating Revolution";
  }, []);

  return (
    <motion.div
      key="landing-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col"
    >
      <Hero />
      <div id="problem"><ProblemSection /></div>
      <div id="solution"><SolutionSection /></div>
      <div id="how-it-works"><HowItWorks /></div>
      <div id="features"><Features /></div>
      <div id="comparison"><Comparison /></div>
      <div id="safety"><Safety /></div>
    </motion.div>
  );
}
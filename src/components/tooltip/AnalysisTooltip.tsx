import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalysisTooltipProps {
  showTooltip: boolean;
}

export const AnalysisTooltip: React.FC<AnalysisTooltipProps> = ({ showTooltip }) => {
  return (
    <AnimatePresence>
      {showTooltip && (
        <motion.img
          src="/assets/analysis/analysis_tts.svg"
          alt="Tooltip"
          className="fixed right-[60px] bottom-[70px] pointer-events-none z-[100]"
          initial={{ x: "0%", y: "0%" }}
          animate={{
            y: ["0%", "5%", "0%"],
          }}
          exit={{ 
            opacity: 0,
            y: "0%",
            transition: { duration: 0.3 }
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeOut",
          }}
        />
      )}
    </AnimatePresence>
  );
};
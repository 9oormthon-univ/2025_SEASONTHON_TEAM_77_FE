import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SoundTooltipProps {
  showTooltip: boolean;
}

export const SoundTooltip: React.FC<SoundTooltipProps> = ({ showTooltip }) => {
  return (
    <AnimatePresence>
      {showTooltip && (
        <motion.img
          src="/assets/tooltip.svg"
          alt="Tooltip"
          className="absolute top-[54px] right-4 pointer-events-none z-[100]"
          initial={{ x: "0%", y: "0%" }}
          animate={{
            y: ["0%", "-10%", "0%"],
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
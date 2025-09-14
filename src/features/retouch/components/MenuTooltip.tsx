import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuTooltipProps {
  showTooltip: boolean;
}

export const MenuTooltip: React.FC<MenuTooltipProps> = ({ showTooltip }) => {
  return (
    <AnimatePresence>
      {showTooltip && (
        <motion.img
          src="/src/assets/menu_guide.png"
          alt="Tooltip"
          className="fixed top-[54px] right-4 pointer-events-none z-[100]"
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
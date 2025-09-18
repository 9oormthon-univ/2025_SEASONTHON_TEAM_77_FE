import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import NavigationButtons from '../buttons/NavigationButtons';
import { useTTSPlayer } from '../../hooks/useTTSPlayer';

interface StepOverlayProps {
  title: string;
  description: string;
  stepProgress?: string; // "1/3" 형태
  onNext?: () => void;
  onPrev?: () => void;
  showPrev?: boolean;
  height?: string;
  className?: string;
}

const StepOverlay: React.FC<StepOverlayProps> = ({
  title,
  description,
  stepProgress,
  onNext,
  onPrev,
  showPrev = true,
  height = "h-[202px]",
  className = "fixed bottom-0 left-0 w-full bg-[rgba(17,17,17,0.80)] z-40 py-[10px] px-6"
}) => {
  const { playTTS } = useTTSPlayer();

  // description이 변경될 때마다 TTS 재생
  useEffect(() => {
    if (description) {
      playTTS(description);
    }
  }, [description, playTTS]);
  return (
    <motion.div
      className={`${height} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="flex flex-col items-start justify-center w-[327px]">
        <div className="flex flex-row justify-between w-full items-center">
          <h1 
            className="text-3xl text-[#FFC845] mb-2"
            style={{
              fontFamily: 'Pretendard',
              fontWeight: '600',
              lineHeight: '140%',
            }}
          >
            {title}
          </h1>
          {stepProgress && (
            <p className="text-base text-white font-light">{stepProgress}</p>
          )}
        </div>
        <h4 
          className="text-lg text-white"
          style={{
            fontFamily: 'Pretendard',
            fontWeight: '600',
            lineHeight: '140%',
          }}
        >
          {description}
        </h4>
      </div>
      
      <NavigationButtons
        onPrev={showPrev ? onPrev : undefined}
        onNext={onNext}
        showPrev={showPrev}
      />
    </motion.div>
  );
};

export default StepOverlay;

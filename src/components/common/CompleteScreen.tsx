import React from 'react';
import { motion } from 'framer-motion';
import ActionButton from '../buttons/ActionButton';

interface CompleteScreenProps {
  title: string;
  subtitle?: string;
  onRestart?: () => void;
  onNext?: () => void;
  onConfirm?: () => void;
  restartLabel?: string;
  nextLabel?: string;
  confirmLabel?: string;
  characterImage?: string;
  isLastLesson?: boolean; // 마지막 학습인지 여부
}

const CompleteScreen: React.FC<CompleteScreenProps> = ({ 
  title,
  subtitle,
  onRestart,
  onNext,
  onConfirm,
  restartLabel = "처음으로",
  nextLabel = "학습 이어하기",
  confirmLabel = "확인",
  characterImage = '/src/assets/character/3.png',
  isLastLesson = false
}) => {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col w-full h-screen items-center justify-center z-20"
      style={{
        background: 'linear-gradient(180deg, #FFEFC8 0%, #F3F3F3 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div 
        className="w-60 h-60 mt-28"
        style={{
          backgroundImage: `url(${characterImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>
      
      <h3 
        className="text-[26px] mb-20 text-center text-black font-semibold leading-[140%]"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      
      {subtitle && (
        <p className="text-base text-center text-[#666666] mb-4">
          {subtitle}
        </p>
      )}
      
      <div className="flex items-center justify-center mt-20 gap-2">
        {isLastLesson ? (
          // 마지막 학습인 경우 확인 버튼만
          <ActionButton
            onClick={onConfirm!}
            variant="primary"
            size="lg"
            className="w-[327px] mt-10"
          >
            {confirmLabel}
          </ActionButton>
        ) : (
          // 일반 학습인 경우 처음으로 + 학습 이어하기 버튼
          <>
            {onRestart && (
              <ActionButton
                onClick={onRestart}
                variant="outline"
                size="md"
              >
                {restartLabel}
              </ActionButton>
            )}
            {onNext && (
              <ActionButton
                onClick={onNext}
                variant="primary"
                size="md"
              >
                {nextLabel}
              </ActionButton>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default CompleteScreen;

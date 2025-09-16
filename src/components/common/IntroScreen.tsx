import React from 'react';
import { motion } from 'framer-motion';
import cursor from '../../assets/cursor.gif';
import { useLocation } from 'react-router-dom';

interface IntroScreenProps {
  title: string;
  subtitle?: string;
  onStart: () => void;
  characterImage?: string;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ 
  title, 
  subtitle, 
  onStart, 
  characterImage = '/src/assets/character/4.png' 
}) => {
  const location = useLocation();

  if (location.pathname === "/order-analysis") {
    characterImage = "/src/assets/analysis.png";
  }
  return (
    <motion.div
      className="absolute inset-0 flex flex-col w-full h-screen items-center justify-center z-20 cursor-pointer"
      style={{
        background: 'linear-gradient(180deg, #FFEFC8 0%, #F3F3F3 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onStart}
    >
      <div 
        className="w-[254px] h-[254px] mb-3 mt-10"
        style={{
          backgroundImage: `url(${characterImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>
      
      <h3 
        className="text-[26px] mb-[97px] text-center text-black font-semibold leading-[140%]"
        style={{
          fontFamily: 'Pretendard',
          fontWeight: '600',
        }}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      
      <p 
        className="text-base text-center text-[#9A9A9A]"
        style={{
          fontFamily: 'Pretendard',
          fontWeight: '400',
          lineHeight: '160%',
          letterSpacing: '-0.4px',
        }}
      >
        {subtitle || "화면을 터치하면 학습이 시작돼요"}
      </p>
      
      <img 
        src={cursor} 
        alt="cursor" 
        className="absolute top-[610px] right-[59px] w-[58px] h-[58px] cursor-pointer" 
      />
    </motion.div>
  );
};

export default IntroScreen;

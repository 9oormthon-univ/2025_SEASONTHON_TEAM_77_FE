import { motion } from 'framer-motion';

export default function IntroTouchScreen({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col w-full h-screen items-center z-20 cursor-pointer"
      style={{ background: 'linear-gradient(180deg, #FFEFC8 0%, #F3F3F3 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onNext}
    >
      <div
        className="w-[254px] h-[254px] mt-[206px]"
        style={{
          backgroundImage: 'url(/src/assets/character/4.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div>
        <h3 className="text-[26px] mt-6 text-center text-black font-bold leading-[140%]">
          주어진 주문서 대로<br />
          키오스크에서 주문해주세요
        </h3>
        <div className="text-center pt-[90px] mb-12 text-base font-normal text-[#9A9A9A]">
          화면을 터치하면 학습이 시작돼요
        </div>
      </div>
      <img
        src="/src/assets/circle_icon.png"
        alt="circle"
        className="w-[58px] h-[58px] absolute right-[59px] bottom-[7px]"
      />
    </motion.div>
  );
}

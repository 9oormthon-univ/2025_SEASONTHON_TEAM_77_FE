import { motion } from 'framer-motion';

export default function ReviewSplash() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col w-full h-screen items-center justify-center z-20"
      style={{ background: 'linear-gradient(180deg, #FFEFC8 0%, #F3F3F3 100%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div
        className="w-[240px] h-[240px] mt-28"
        style={{
          backgroundImage: 'url(/src/assets/character/6.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <h3 className="text-xl mb-6 text-center text_black font-semibold leading-[140%]">
        주문이 완료되었어요
      </h3>
      <p className="text-base mb-20 text-center text-black font-medium leading-[160%]">
        메뉴가 준비 중이니,<br />
        잠시만 기다려 주세요
      </p>
    </motion.div>
  );
}

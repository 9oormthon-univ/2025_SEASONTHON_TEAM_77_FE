import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HeaderBar from '../../../components/HeaderBar';
import KioskFrame, { type Category } from './KioskFrame';
import { CategorySteps } from './CategoryData';
import { itemsByCategory } from './KioskItems';

const CategoryExplain: React.FC = () => {
  const [page, setPage] = useState<'intro' | 'kiosk' | 'complete'>('intro');
  const [step, setStep] = useState<number | null>(null); // 0~4
  const navigate = useNavigate();

const stepToCategory = (step: number | null): Category | null => {
  if (step === null) return null;
  if (step === 0) return null; // 1단계는 강제 없음(원하면 '커피'로 바꿀 수 있음)
  const map: Category[] = ['커피', '음료', '디저트', '푸드'];
  return map[step - 1] ?? null;
};

  // 키오스크 진입 시 0단계부터 시작
  useEffect(() => {
    if (page === 'kiosk') setStep(0);
    else setStep(null);
  }, [page]);

  const handleNext = () => {
    if (step === null) return;
    if (step < CategorySteps.length - 1) {
      setStep(step + 1);
    } else {
      setPage('complete');
    }
  };

  return (
    <div className="relative w-full h-screen">
      <HeaderBar title="티치맵" backTo="/teachmap" />

      {/* 시작 화면 */}
      <AnimatePresence>
        {page === 'intro' && (
          <motion.div
            className="absolute inset-0 flex flex-col w-full h-screen items-center justify-center z-20"
            style={{ background: 'linear-gradient(180deg, #FFEFC8 0%, #F3F3F3 100%)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div
              className="w-[323px] h-[323px]"
              style={{
                backgroundImage: 'url(/src/assets/character/4.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <h3 className="text-xl mb-6 text-center text-black font-semibold leading-[140%]">
              너무 잘 따라오고 계시네요!
            </h3>
            <p className="text-base mb-20 text-center text-black font-medium leading-[160%] tracking-[-0.4px]">
              이번에는 내가 주문하려는 메뉴가 어디있는지<br />
              찾고나서 담아볼거에요.
            </p>
            <button
              onClick={() => setPage('kiosk')}
              className="w-[327px] h-[52px] py-4 bg-[#FFC845] mt-3 flex items-center justify-center text-black rounded-full hover:scale-105 transition-all duration-300"
            >
              시작하기
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 키오스크 화면 */}
      {page === 'kiosk' && (
        <>
        <KioskFrame
          itemsByCategory={itemsByCategory}
          forcedActiveCategory={stepToCategory(step)}
          disableTabClicks={step !== null && step !== 0}
        />

          {/* 하단 반투명 오버레이 */}
          <AnimatePresence>
            {step !== null && (
              <motion.div
                key={step}
                className={`fixed bottom-0 left-0 w-full ${
                    step === 0 ? 'h-[630px]' : 'h-[153px]'
                } bg-[rgba(17,17,17,0.80)] z-40 p-6`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="flex flex-col items-start justify-center w-[85%]">
                  <h1 className="text-2xl text-[#FFC845] mb-2 font-semibold leading-[140%]">
                    {`${step + 1}. ${CategorySteps[step].title}`}
                  </h1>
                  <p className="text-sm text-white font-medium leading-[140%]">
                    {CategorySteps[step].description}
                  </p>
                </div>

                {/* 다음 버튼 */}
                <button
                  onClick={handleNext}
                  className="absolute -translate-y-1/2 right-[22px] w-8 h-8"
                  style={{
                    top: step === 0 ? '12%' : '50%',
                    backgroundImage: 'url(/src/assets/next.svg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                  aria-label="다음"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* 완료 화면 */}
      <AnimatePresence>
        {page === 'complete' && (
          <motion.div
            className="absolute inset-0 flex flex-col w-full h-screen items-center justify-center z-20"
            style={{ background: 'linear-gradient(180deg, #FFEFC8 0%, #F3F3F3 100%)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div
              className="w-[240px] h-[240px] mt-28"
              style={{
                backgroundImage: 'url(/src/assets/character/5.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <h3 className="text-xl mb-20 text-center text-black font-semibold leading-[140%]">
              카테고리에 대한<br />모든 학습을 완료했어요!
            </h3>
            <div className="flex items-center justify-center mt-20 gap-2">
              <button
                onClick={() => setPage('intro')}
                className="w-[159px] h-[52px] py-4 bg-[#F6F6F6] flex items-center justify-center text-black rounded-full hover:scale-105 transition-all duration-300"
              >
                첫 화면으로
              </button>
              <button
                onClick={() => navigate('/teachmap/kioskmenuorder')}
                className="w-[159px] h-[52px] py-4 bg-[#FFC845] flex items-center justify-center text-black rounded-full hover:scale-105 transition-all duration-300"
              >
                학습 이어하기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryExplain;

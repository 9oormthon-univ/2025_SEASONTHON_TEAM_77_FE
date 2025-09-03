import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { structureSteps } from './StructureData';
import HeaderBar from '../../../components/HeaderBar';

const LearnStructure: React.FC = () => {
  const [page, setPage] = useState<'intro' | 'kiosk' | 'complete'>('intro');
  const [step, setStep] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (page === 'kiosk') {
      const timer = setTimeout(() => setShowModal(true), 500);
      return () => clearTimeout(timer);
    }
  }, [page]);

  const handleNextStep = () => {
    if (step === null) return;
    if (step < structureSteps.length - 1) {
      setStep(step + 1);
    } else {
      setStep(null);
      setPage('complete');
    }
  };

  return (
    <div className="relative w-full h-screen">
      <HeaderBar title="티치맵" backTo="/teachmap" />
      <AnimatePresence>
        {page === 'intro' && (
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
              className="w-96 h-96"
              style={{
                backgroundImage: 'url(/src/assets/character/1.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            ></div>
            <h3 
              className="text-xl mb-6 text-center text-black"
              style={{
                fontFamily: 'Pretendard',
                fontWeight: '600',
                lineHeight: '140%',
              }}
            >
              안녕하세요 티코예요!
            </h3>
            <p 
              className="text-base mb-20 text-center text-black"
              style={{
                fontFamily: 'Pretendard',
                fontWeight: '500',
                lineHeight: '160%',
                letterSpacing: '-0.4px',
              }}
            >
              저와 함께 키오스크 전체 구성에 대해 알아볼까요?<br />
              저만 따라오세요.
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

      {page === 'kiosk' && (
        <div className="absolute inset-0 w-full h-[797px] bg-[#F6F5F4]">
          <div className="relative flex flex-col items-center justify-center">
            <img src="/src/assets/kiosk_initial.svg" alt="kiosk_bg" className="w-[319px] h-[569px] mt-[67px]" />
            <div className="flex justify-center items-center gap-11 px-13 mt-4">
              {/* 영수증 출력기 */}
              <div className="w-[133px] h-[125px] bg-[#F9F9F9] rounded-lg border-2 border-gray-300 flex items-start justify-center py-[27px] px-[14px]">
                <div className="w-3/4 h-2 bg-black rounded-full" />
              </div>

              <div className="flex flex-col gap-3">
                {/* 바코드 인식기 */}
                <div className="w-[93px] h-[57px] bg-black rounded-lg flex items-center justify-center border-2 border-gray-300">
                  <div className="w-[63px] h-[39px] bg-[#f9f9f9] rounded flex items-center justify-center">
                    <div className="w-3 h-3 bg-black rounded-full opacity-80 blur-[0.5px]" />
                  </div>
                </div>

                {/* 카드 리더기 */}
                <div className="w-[93px] h-[57px] bg-black rounded-lg flex items-center justify-center border-2 border-gray-300">
                  <div className="w-3/4 h-1 bg-[#747474] rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {step !== null && (
              <>
                {/* 반투명 배경 */}
                <motion.div
                  className="fixed bottom-0 left-0 w-full h-[153px] bg-[rgba(17,17,17,0.80)] z-40 p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  >
                    <div className="flex flex-col items-start justify-center w-4/5">
                      <h1 
                        className="text-3xl text-[#FFC845] mb-2"
                        style={{
                          fontFamily: 'Pretendard',
                          fontWeight: '600',
                          lineHeight: '140%',
                        }}
                      >
                        {`${step + 1}. ${structureSteps[step].title}`}
                      </h1>
                      <h4 className="text-base text-white"
                        style={{
                          fontFamily: 'Pretendard',
                          fontWeight: '600',
                          lineHeight: '140%',
                        }}>
                          {structureSteps[step]?.description}
                      </h4>
                    </div>
                  <button
                    onClick={handleNextStep}
                    className="absolute top-1/2 right-10"
                    style={{
                      backgroundImage: 'url(/src/assets/next.svg)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      width: '32px',
                      height: '32px',
                    }}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showModal && step === null && (
              <>
                <motion.div
                  className="fixed inset-0 bg-[rgba(17,17,17,0.80)] z-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />

                <motion.div
                  className="fixed flex flex-col items-center justify-center w-[312px] h-[380px] z-50 bg-white rounded-lg py-8 text-center"
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
                  initial={{ 
                    x: '-50%',
                    y: '100%',
                  }}
                  animate={{ 
                    x: '-50%',
                    y: '-50%',
                  }}
                  exit={{ 
                    x: '-50%',
                    y: '100%',
                  }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                >
                  <img
                    src="/src/assets/card.png"
                    alt="카드 결제"
                    className="mx-auto w-[128px] h-[108px] mb-7"
                  />
                  <h4 className="text-lg text-black mb-5"
                    style={{
                      fontFamily: 'Pretendard',
                      fontWeight: '600',
                      lineHeight: '140%',
                    }}
                  >
                    키오스크는 카드 전용 결제 기기입니다.
                  </h4>
                  <p className="text-sm text-[#444444] mb-9"
                    style={{
                      fontFamily: 'Pretendard',
                      fontWeight: '500',
                      lineHeight: '160%',
                      letterSpacing: '-0.4px',
                    }}
                  >
                    현금으로 결제하신다면,<br />
                    카운터 직원에게 주문해 주세요.
                  </p>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setStep(0);
                    }}
                    className="w-[278px] h-[52px] py-4 bg-[#FFC845] mt-3 flex items-center justify-center text-center text-black rounded-full hover:scale-105 transition-all duration-300"
                  >
                    확인
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}
      <AnimatePresence>
        {page === 'complete' && (
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
              className="w-64 h-64 mt-28"
              style={{
                backgroundImage: 'url(/src/assets/character/3.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            ></div>
            <h3 
              className="text-xl mb-20 text-center text-black"
              style={{
                fontFamily: 'Pretendard',
                fontWeight: '600',
                lineHeight: '140%',
              }}
            >
              키오스크 전체 구성에 대해<br />
              모든 학습을 완료했어요!
            </h3>
            <div className="flex items-center justify-center mt-20 gap-2">
              <button
                onClick={() => setPage('intro')}
                className="w-[159px] h-[52px] py-4 bg-[#F6F6F6] flex items-center justify-center text-black rounded-full hover:scale-105 transition-all duration-300"
              >
                첫 화면으로
              </button>
              <button
                onClick={() => navigate('/teachmap')}
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

export default LearnStructure;
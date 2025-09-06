import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { structureSteps } from './StructureData';
import HeaderBar from '../../../components/HeaderBar';
import { kioskAPI } from '../../../shared/api';
import cursor from '../../../assets/cursor.gif';

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

  useEffect(() => {
    if (page === 'complete') {
      const completeLesson = async () => {
        try {
          await kioskAPI.completeStep('1'); // 키오스크 전체 구성 stepId
          console.log('학습 완료 API 호출 성공');
        } catch (error) {
          console.error('학습 완료 API 호출 실패:', error);
        }
      };
      
      completeLesson();
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

  const handlePrevStep = () => {
    if (step === null) return;
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <HeaderBar title="티치맵" backTo="/teachmap" />
      <AnimatePresence>
        {page === 'intro' && (
          <motion.div
            key="step-intro-overlay"
            className="absolute inset-0 flex flex-col w-full h-screen items-center justify-center z-20"
            style={{
              background: 'linear-gradient(180deg, #FFEFC8 0%, #F3F3F3 100%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPage('kiosk')}
          >
            <div 
              className="w-[254px] h-[254px] mb-3 mt-10"
              style={{
                backgroundImage: 'url(/src/assets/character/4.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            ></div>
            <h3 
              className="text-2xl mb-[97px] font-bold text-center text-black"
              style={{
                fontFamily: 'Pretendard',
                fontWeight: '600',
                lineHeight: '140%',
              }}
            >
              안녕하세요 티코예요!<br />
              키오스크 구성을 알아볼까요?
            </h3>
            <p 
              className="text-base text-center text-[#9A9A9A]"
              style={{
                fontFamily: 'Pretendard',
                fontWeight: '400',
                lineHeight: '160%',
                letterSpacing: '-0.4px',
              }}
            >
              화면을 터치하면 학습이 시작돼요
            </p>
            <img src={cursor} alt="cursor" className="absolute top-[610px] right-[59px] w-[58px] h-[58px] cursor-pointer" />
          </motion.div>
        )}
      </AnimatePresence>

      {page === 'kiosk' && (
        <div className="absolute inset-0 w-full h-[797px] bg-[#F6F5F4]">
          <div className="relative flex flex-col items-center justify-center">
            <img src="/src/assets/kiosk_initial.svg" alt="kiosk_bg" className="w-[319px] h-[569px] mt-[67px]" />
            <div className="flex justify-center items-center gap-11 px-13 mt-4">
              {/* 영수증 출력기 */}
              <div 
                onClick={handleNextStep}
                className={`w-[133px] h-[125px] bg-[#F9F9F9] rounded-lg border-2 border-gray-300 flex items-start justify-center py-[27px] px-[14px] ${
                  step === 4 ? "z-50 cursor-pointer" : "z-20"
                }`}
              >
                <div className="w-3/4 h-2 bg-black rounded-full" />
              </div>

              <div className="flex flex-col gap-3">
                {/* 바코드 인식기 */}
                <div 
                  onClick={handleNextStep}
                  className={`w-[93px] h-[57px] bg-black rounded-lg flex items-center justify-center border-2 border-gray-300 ${
                    step === 3 ? "z-50 cursor-pointer" : "z-20"
                  }`}
                >
                  <div className="w-[63px] h-[39px] bg-[#f9f9f9] rounded flex items-center justify-center">
                    <div className="w-3 h-3 bg-black rounded-full opacity-80 blur-[0.5px]" />
                  </div>
                </div>

                {/* 카드 리더기 */}
                <div 
                  onClick={handleNextStep}
                  className={`w-[93px] h-[57px] bg-black rounded-lg flex items-center justify-center border-2 border-gray-300 ${
                    step === 1 || step === 2 ? "z-50 cursor-pointer" : "z-20"
                  }`}
                >
                  <div className="w-3/4 h-1 bg-[#747474] rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {step !== null && step === 0 && (
              <>
                {/* 반투명 배경 */}
                <motion.div
                  key="step-0-overlay"
                  className="fixed bottom-0 left-0 w-full h-[202px] bg-[rgba(17,17,17,0.80)] z-30 py-[10px] px-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  >
                    <div className="flex flex-col items-start justify-center w-[327px]">
                      <h1 
                        className="text-3xl text-[#FFC845] mb-2"
                        style={{
                          fontFamily: 'Pretendard',
                          fontWeight: '600',
                          lineHeight: '140%',
                        }}
                      >
                        1. 키오스크 화면
                      </h1>
                      <h4 className="text-lg text-white"
                        style={{
                          fontFamily: 'Pretendard',
                          fontWeight: '600',
                          lineHeight: '140%',
                        }}>
                          이 화면에서, 어떤 메뉴가 있는지 확인하고
                          자신의 원하는 메뉴를 담을 수 있습니다.
                      </h4>
                    </div>
                    <div className="flex flex-row gap-6 w-full items-center justify-center mt-6">
                      <button
                        onClick={handleNextStep}
                        style={{
                          backgroundImage: 'url(/src/assets/next.svg)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          width: '43px',
                          height: '42px',
                        }}
                      />
                    </div>
                </motion.div>
              </>
            )}
            {step !== null && step > 0 && (
              <>
                <motion.div
                  key="step-other-overlay"
                  className="fixed inset-0 w-full h-screen bg-[rgba(17,17,17,0.80)] z-30 p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </>
              )}
              {/* 흰색 원 배경 + 텍스트 */}
              {step === 1 && (
                <div 
                  key="step-1-overlay"
                  className="absolute top-[505px] left-[24px] w-[327px] h-[272px] flex flex-col items-start justify-start z-40">
                  <img src="/src/assets/reader.png" alt="reader" className="absolute -top-[315px] left-1/2 -translate-x-1/2 w-[276px] h-[276px]" />
                  <div className="flex flex-row justify-between w-full items-center">
                    <h1 
                      className="text-3xl text-[#FFC845] mb-2"
                      style={{
                        fontFamily: 'Pretendard',
                        fontWeight: '600',
                        lineHeight: '140%',
                      }}
                    >
                      2. 카드 리더기
                    </h1>
                    <p className="text-base text-white font-light">1/1</p>
                  </div>
                  <h4 className="text-lg text-white"
                    style={{
                      fontFamily: 'Pretendard',
                      fontWeight: '600',
                      lineHeight: '140%',
                    }}>
                      모든 메뉴를 선택한 뒤 결제를 해야 할 때
                      카드를 꽂아 결제하는 부분이에요.
                  </h4>
                  <div className="flex flex-row gap-6 w-full items-center justify-center mt-6">
                    <button
                      onClick={handlePrevStep}
                      style={{
                        backgroundImage: 'url(/src/assets/prev.svg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        width: '43px',
                        height: '42px',
                      }}
                    />
                    <button
                      onClick={handleNextStep}
                      style={{
                        backgroundImage: 'url(/src/assets/next.svg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        width: '43px',
                        height: '42px',
                      }}
                    />
                  </div>
                  <div className="absolute top-[205px] left-[179px] w-[148px] h-[81px] bg-[#D9D9D9] rounded-full z-40"/>
                </div>
              )}

              {step === 2 && (
                <div 
                  key="step-2-overlay"
                  className="absolute top-[505px] left-[24px] w-[327px] h-[272px] flex flex-col items-start justify-start z-40">
                  <img src="/src/assets/reader.png" alt="reader" className="absolute -top-[315px] left-1/2 -translate-x-1/2 w-[276px] h-[276px]" />
                  <div className="flex flex-row justify-between w-full items-center">
                    <h1 
                      className="text-3xl text-[#FFC845] mb-2"
                      style={{
                        fontFamily: 'Pretendard',
                        fontWeight: '600',
                        lineHeight: '140%',
                      }}
                    >
                      2. 카드 리더기
                    </h1>
                    <p className="text-base text-white font-light">1/2</p>
                  </div>
                  <h4 className="text-lg text-white"
                    style={{
                      fontFamily: 'Pretendard',
                      fontWeight: '600',
                      lineHeight: '140%',
                    }}>
                      카드에서 딸깍 소리가 날 때까지 안쪽으로
                      잘 밀어 넣어주세요!
                  </h4>
                  <div className="flex flex-row gap-6 w-full items-center justify-center mt-6">
                    <button
                      onClick={handlePrevStep}
                      style={{
                        backgroundImage: 'url(/src/assets/prev.svg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        width: '43px',
                        height: '42px',
                      }}
                    />
                    <button
                      onClick={handleNextStep}
                      style={{
                        backgroundImage: 'url(/src/assets/next.svg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        width: '43px',
                        height: '42px',
                      }}
                    />
                  </div>
                  <div className="absolute top-[205px] left-[179px] w-[148px] h-[81px] bg-[#D9D9D9] rounded-full z-40"/>
                </div>
              )}
              {step === 3 && (
                <div 
                  key="step-3-overlay"
                  className="absolute top-[435px] left-[24px] w-[327px] h-[272px] flex flex-col items-start justify-start z-40">
                  <img src="/src/assets/barcode.png" alt="barcode" className="absolute -top-[315px] left-1/2 -translate-x-1/2 w-[276px] h-[276px]" />
                  <h1 
                    className="text-3xl text-[#FFC845] mb-2"
                    style={{
                      fontFamily: 'Pretendard',
                      fontWeight: '600',
                      lineHeight: '140%',
                    }}
                  >
                    3. 바코드 인식기
                  </h1>
                  <h4 className="text-lg text-white"
                    style={{
                      fontFamily: 'Pretendard',
                      fontWeight: '600',
                      lineHeight: '140%',
                    }}>
                      쿠폰으로 결제를 원할 때 핸드폰에 뜨는
                      바코드(쿠폰) 화면을 이곳에 갖다댑니다.
                  </h4>
                  <div className="flex flex-row gap-6 w-full items-center justify-center mt-6">
                    <button
                      onClick={handlePrevStep}
                      style={{
                        backgroundImage: 'url(/src/assets/prev.svg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        width: '43px',
                        height: '42px',
                      }}
                    />
                    <button
                      onClick={handleNextStep}
                      style={{
                        backgroundImage: 'url(/src/assets/next.svg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        width: '43px',
                        height: '42px',
                      }}
                    />
                  </div>
                  <div className="absolute top-[205px] left-[179px] w-[148px] h-[81px] bg-[#D9D9D9] rounded-full z-40"/>
                </div>
              )}
              {step === 4 && (
                <div 
                  key="step-4-overlay"
                  className="absolute top-[435px] left-[24px] w-[327px] h-[272px] flex flex-col items-start justify-start z-40">
                  <img src="/src/assets/barcode.png" alt="barcode" className="absolute -top-[315px] left-1/2 -translate-x-1/2 w-[276px] h-[276px]" />
                  <h1 
                    className="text-3xl text-[#FFC845] mb-2"
                    style={{
                      fontFamily: 'Pretendard',
                      fontWeight: '600',
                      lineHeight: '140%',
                    }}
                  >
                    4. 영수증 출력기
                  </h1>
                  <h4 className="text-lg text-white"
                    style={{
                      fontFamily: 'Pretendard',
                      fontWeight: '600',
                      lineHeight: '140%',
                    }}>
                      영수증이나 주문 번호를 받을 때 이 곳에서
                      용지가 나옵니다! 챙겨서 자신의 주문번호를
                      확인해주세요!
                  </h4>
                  
                  <div className="flex flex-row gap-6 w-full items-center justify-center mt-6">
                    <button
                      onClick={handlePrevStep}
                      style={{
                        backgroundImage: 'url(/src/assets/prev.svg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        width: '43px',
                        height: '42px',
                      }}
                    />
                    <button
                      onClick={handleNextStep}
                      style={{
                        backgroundImage: 'url(/src/assets/next.svg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        width: '43px',
                        height: '42px',
                      }}
                    />
                  </div>
                  <div className="absolute top-[190px] left-[6px] w-[180px] h-[180px] bg-[#D9D9D9] rounded-full z-40"/>
                </div>
              )}
          </AnimatePresence>

          <AnimatePresence>
            {showModal && step === null && (
              <>
                <motion.div
                  key="modal-overlay"
                  className="fixed inset-0 bg-[rgba(17,17,17,0.80)] z-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />

                <motion.div
                  key="modal-content"
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
                    className="w-[278px] h-[52px] py-4 bg-[#FFC845] flex items-center justify-center text-center text-black rounded-full hover:scale-105 transition-all duration-300"
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
            key="step-complete-overlay"
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
                backgroundImage: 'url(/src/assets/character/3.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            ></div>
            <h3 
              className="text-[26px] mb-20 text-center text-black font-semibold leading-[140%]">
              키오스크 전체 구성에 대해<br />
              모든 학습을 완료했어요!
            </h3>
            <div className="flex items-center justify-center mt-20 gap-2">
              <button
                onClick={() => setPage('intro')}
                className="w-[159px] h-[52px] py-4 font-semibold bg-[#F6F6F6] flex items-center justify-center text-black rounded-full hover:scale-105 transition-all duration-300 border border-[#ffc845]"
              >
                처음으로
              </button>
              <button
                onClick={() => navigate('/teachmap/kioskorder')}
                className="w-[159px] h-[52px] py-4 font-semibold bg-[#FFC845] flex items-center justify-center text-black rounded-full hover:scale-105 transition-all duration-300"
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

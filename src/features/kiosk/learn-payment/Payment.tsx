import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { paymentSteps } from './PaymentData';
import HeaderBar from '../../../components/HeaderBar';
import PointInput from './PointInput';
import { kioskAPI } from '../../../shared/api';
import cursor from '../../../assets/cursor.gif';

const Payment: React.FC = () => {
  const [page, setPage] = useState<'intro' | 'kiosk' | 'complete'>('intro');
  const [step, setStep] = useState<number>(0);
  const [substep, setSubstep] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 3) {
      setShowModal(true);
    }
  }, [step]);

  useEffect(() => {
    if (page === 'complete') {
      const completeLesson = async () => {
        try {
          await kioskAPI.completeStep('6');
          console.log('학습 완료 API 호출 성공');
        } catch (error) {
          console.error('학습 완료 API 호출 실패:', error);
        }
      };
      
      completeLesson();
    }
  }, [page]);

  const currentStepData = paymentSteps[step];
  const currentSubstepText = currentStepData?.substeps?.[substep]?.description || '';

  const handleNextStep = () => {
    if (!currentStepData) return;

    if (substep < currentStepData.substeps.length - 1) {
      setSubstep((prev) => prev + 1);
    } else {
      if (step < paymentSteps.length - 1) {
        setStep((prev) => prev + 1);
        setSubstep(0);
      } else {
        setPage('complete');
      }
    }
  };

  const handlePrevStep = () => {
    if (substep > 0) {
      setSubstep(substep - 1);
    } else if (step > 0) {
      setStep(step - 1);
      // 이전 step의 마지막 substep으로 이동
      const prevStepData = paymentSteps[step - 1];
      setSubstep(prevStepData.substeps.length - 1);
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
            onClick={() => {
              setPage('kiosk');
              setStep(0);
            }}
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
              className="text-2xl mb-[97px] text-center text-black"
              style={{
                fontFamily: 'Pretendard',
                fontWeight: '600',
                lineHeight: '140%',
              }}
            >
              메뉴를 다 담았으면,<br />
              결제를 해볼까요?
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
            <>
              {step === 0 && (
                <div 
                  className="flex flex-col items-center justify-start w-[319px] h-[569px] mt-[67px] px-[16px] border-2 border-gray-300 bg-black bg-opacity-30"
                  style={{
                    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.04)',
                    borderRadius: '36px',
                  }}
                >
                  <div className="text-xl font-bold text-[#111111] text-center mt-[38px]">
                    주문 내역을 확인하고<br />
                    <span className="text-[#FFC845]">결제하기</span>를 누르세요
                  </div>
                  <div className="absolute top-[152px] left-1/2 z-50 transform -translate-x-1/2">
                    <PointInput 
                      onSkip={() => setStep((prev) => prev + 1)} 
                      onCollect={() => setSubstep((prev) => prev + 1)} 
                    />
                  </div>
                  <div className="mt-[381px] w-[315px] h-[94px] rounded-b-[34px] bg-[#444444] text-white px-4 pt-3 pb-[82px] shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                    <div className="mb-3 flex w-full max-w-[320px] items-center justify-center text-[13px]">
                        <div className="flex flex-1 justify-between px-4">
                        <span className="opacity-90">총수량</span>
                        <span className="opacity-90">3개</span>
                        </div>
                        <div className="w-px h-4 bg-gray-300 opacity-60" />
                        <div className="flex flex-1 justify-between px-4">
                        <span className="opacity-90">합계</span>
                        <span className="font-medium">11,400원</span>
                        </div>
                    </div>
                  </div>
                </div>
              )}
              {step === 1 && (
                <div 
                  className="flex flex-col items-center justify-start w-[319px] h-[569px] mt-[67px] pt-[60px] px-[16px] border-2 border-gray-300 bg-white"
                  style={{
                    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.04)',
                    borderRadius: '36px',
                  }}
                >
                  <div className="text-center mb-7">
                    <p className="text-[#FFC845] text-xl">결제 수단을</p>
                    <p className="text-black text-xl mt-1">선택해 주세요</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* 카드/삼성페이 */}
                    <div
                      className={`w-[133px] h-[78px] rounded-[16px] flex flex-col items-center justify-center transition-all ${
                        substep === 1 ? "bg-[#FFEEC5]" : "bg-[#F6F5F4]"
                      }`}
                    >
                      <img src="/src/assets/payment/card.png" className="w-[40px] h-[40px]" />
                      <p className="text-sm text-black">카드/삼성페이</p>
                    </div>

                    {/* 기프티콘 */}
                    <div
                      className={`w-[133px] h-[78px] rounded-[16px] flex flex-col items-center justify-center transition-all ${
                        substep === 2 ? "bg-[#FFEEC5]" : "bg-[#F6F5F4]"
                      }`}
                    >
                      <img src="/src/assets/payment/gift.png" className="w-[30px] h-[30px] mb-1" />
                      <p className="text-sm text-black">기프티콘</p>
                    </div>

                    {/* 네이버페이 */}
                    <div
                      className={`w-[133px] h-[78px] rounded-[16px] flex flex-col items-center justify-center transition-all ${
                        substep === 3 ? "bg-[#FFEEC5]" : "bg-[#F6F5F4]"
                      }`}
                    >
                      <img src="/src/assets/payment/naver.svg" className="w-[53px] h-[20px] mb-[10px]" />
                      <p className="text-sm text-black">네이버페이</p>
                    </div>

                    {/* 카카오페이 */}
                    <div
                      className={`w-[133px] h-[78px] rounded-[16px] flex flex-col items-center justify-center transition-all ${
                        substep === 3 ? "bg-[#FFEEC5]" : "bg-[#F6F5F4]"
                      }`}
                    >
                      <img src="/src/assets/payment/kakao.png" className="w-[53px] h-[22px] mb-2" />
                      <p className="text-sm text-black">카카오페이</p>
                    </div>
                  </div>
                  <div className="mt-[111px] w-[315px] h-[147px] rounded-b-[34px] bg-[#444444] text-white px-4 pt-3 pb-[82px] shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                    <div className="flex flex-col w-full items-center justify-center">
                        <div className="w-full flex flex-1 justify-between text-xs mb-2">
                          <span className="opacity-90">주문금액</span>
                          <span className="opacity-90">11,400원</span>
                        </div>
                        <div className="w-full flex flex-1 justify-between text-xs mb-2">
                          <span className="opacity-90">할인금액</span>
                          <span className="opacity-90">0원</span>
                        </div>
                        <div className="w-full flex flex-1 justify-between text-base font-medium mb-4">
                          <span className="opacity-90">총 결제금액</span>
                          <span className="font-medium">11,400원</span>
                        </div>
                    </div>
                    <button className="w-full bg-[#FFC845] py-[6px] rounded-full text-black text-sm">결제 취소</button>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div 
                  className="flex flex-col items-center justify-center w-[319px] h-[569px] mt-[67px] py-[132px] px-[16px] border-2 border-gray-300 bg-white"
                  style={{
                    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.04)',
                    borderRadius: '36px',
                  }}
                >
                  <div className="text-center mb-5">
                    <p className="text-[#FFC845] text-xl">신용카드를</p>
                    <p className="text-black text-xl mt-1">투입구에 꽂아주세요</p>
                  </div>
                  <p className="text-sm text-black mb-10">결제 오류 시 마그네틱을 아래로 향하게 긁어주세요.</p>
                  <img src="/src/assets/payment/group.svg" className="w-[30px] h-[30px] mb-10" />
                  <img src="/src/assets/payment/pay.svg" className="w-[127px] h-[100px]" />
                </div>
              )}
              {step === 3 && (
                <div 
                  className="flex flex-col items-center justify-center w-[319px] h-[569px] mt-[67px] py-[132px] px-[16px] border-2 border-gray-300 bg-black bg-opacity-30"
                  style={{
                    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.04)',
                    borderRadius: '36px',
                  }}
                >
                  <div className="text-center mb-5">
                    <p className="text-[#FFC845] text-xl">신용카드를</p>
                    <p className="text-black text-xl mt-1">투입구에 꽂아주세요</p>
                  </div>
                  <p className="text-sm text-black mb-10">결제 오류 시 마그네틱을 아래로 향하게 긁어주세요.</p>
                  <img src="/src/assets/payment/group.svg" className="w-[30px] h-[30px] mb-10" />
                  <img src="/src/assets/payment/pay.svg" className="w-[127px] h-[100px]" />
                </div>
              )}
              {step === 4 &&  (
                <div 
                  className="flex flex-col items-center justify-center w-[319px] h-[569px] mt-[67px] py-[132px] px-[16px] border-2 border-gray-300 bg-white"
                  style={{
                    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.04)',
                    borderRadius: '36px',
                  }}
                >
                  <div className="text-center mb-7">
                    <p className="text-black text-xl">주문이 완료되었습니다!</p>
                  </div>
                  <div className="text-center mb-7">
                    <p className="text-[#ffc845] text-sm">주문번호</p>
                    <p className="text-[#ffc845] text-[64px]">712</p>
                  </div>
                  <p className="text-sm text-black mb-10 text-center">신용카드를 뽑은 후<br />
                  출력된 영수증을 받아가세요.</p>
                  <img src="/src/assets/payment/receipt.svg" className="w-[184px] h-[173px]" />
                </div>
              )}
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
            </>

            
          </div>

          <AnimatePresence>
            {step !== null && (
              <>
                {/* 반투명 배경 */}
                <motion.div
                  className="fixed bottom-0 left-0 w-full h-[192px] bg-[rgba(17,17,17,0.80)] z-40 py-[10px] px-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  >
                    <div className="flex flex-col items-start justify-center w-[327px]">
                      <div className="flex flex-row justify-between w-full items-center">
                        <h1 
                          className="text-3xl text-[#FFC845] mb-1"
                          style={{
                            fontFamily: 'Pretendard',
                            fontWeight: '600',
                            lineHeight: '140%',
                          }}
                        >
                          {`${paymentSteps[step].title}`}
                        </h1>
                        {currentStepData.substeps.length > 1 && (
                          <p className="text-base text-white font-light">{substep + 1}/{currentStepData.substeps.length}</p>
                        )}
                      </div>
                      <h4 className="text-lg text-white"
                        style={{
                          fontFamily: 'Pretendard',
                          fontWeight: '600',
                          lineHeight: '140%',
                        }}>
                          {currentSubstepText}
                      </h4>
                    </div>
                    <div className="absolute bottom-[10px] flex flex-row gap-6 w-[327px] items-center justify-center mt-6">
                        {(step !== 0 || substep !== 0) && (
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
                        )}
                        <button
                          onClick={handleNextStep}
                          style={{
                            backgroundImage: 'url(/src/assets/next.svg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            width: '42px',
                            height: '42px',
                          }}
                        />
                    </div>
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
              className="w-60 h-60 mt-28"
              style={{
                backgroundImage: 'url(/src/assets/character/3.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            ></div>
            <h3 className="text-[26px] mb-20 text-center text-black font-semibold leading-[140%]">
              모든 학습을 다 마무리 했어요
            </h3>
            <div className="flex items-center justify-center mt-20 gap-2">
              <button
                onClick={() => navigate('/')}
                className="w-[327px] h-[52px] py-4 bg-[#FFC845] mt-10 flex items-center justify-center text-black rounded-full hover:scale-105 transition-all duration-300"
              >
                확인
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 w-full h-screen bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-[16px] px-5 py-7 w-[80%] max-w-[300px] text-center">
            <p className="text-lg font-semibold mb-6">영수증을 출력하시겠어요?</p>
            <div className="flex justify-between gap-2">
              <button
                className="flex-1 bg-[#FFD845] text-base text-black py-2 rounded-full rounded-[36px]"
                onClick={() => {
                  setShowModal(false);
                  handleNextStep();
                }}
              >
                예 
              </button>
              <button
                className="flex-1 bg-[#ececec] text-base text-black py-2 rounded-full rounded-[36px]"
                onClick={() => setShowModal(false)}
              >
                  아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;

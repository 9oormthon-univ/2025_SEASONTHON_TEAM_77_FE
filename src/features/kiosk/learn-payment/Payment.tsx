import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { paymentSteps } from './PaymentData';
import HeaderBar from '../../../components/HeaderBar';
import PointInput from './PointInput';

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
              className="w-72 h-72 mb-10 mt-10"
              style={{
                backgroundImage: 'url(/src/assets/character/4.png)',
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
              거의 다 마무리되었어요.
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
              원하는 메뉴를 모두 담았으면, <br />
              이제는 결제를 하러 가볼까요?
            </p>
            <button
              onClick={() => {
                setPage('kiosk');
                setStep(0);
              }}
              className="w-[327px] h-[52px] py-4 bg-[#FFC845] mt-10 flex items-center justify-center text-black rounded-full hover:scale-105 transition-all duration-300"
            >
              시작하기
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {page === 'kiosk' && (
        <div className="absolute inset-0 w-full h-[797px] bg-[#F6F5F4]">
          <div className="relative flex flex-col items-center justify-center">
            <>
              {step === 0 && (
                <div 
                  className="flex flex-col items-center justify-center w-[319px] h-[569px] mt-[67px] py-[132px] px-[16px] border-2 border-gray-300 bg-black-300"
                  style={{
                    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.04)',
                    borderRadius: '36px',
                  }}
                >
                  <PointInput onSkip={() => setStep((prev) => prev + 1)} onCollect={() => setSubstep((prev) => prev + 1)} />
                </div>
              )}
              {step === 1 && (
                <div 
                  className="flex flex-col items-center justify-center w-[319px] h-[569px] mt-[67px] py-[132px] px-[16px] border-2 border-gray-300 bg-white"
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
                  {/* <div 
                    className="flex flex-end bottom-0 left-0 w-full h-[147px] bg-[#444444] px-[20px]"
                    style={{
                      borderRadius: '0 0 34px 34px',
                    }}
                  >
                    <div className="w-full text-right text-white mt-3 mb-3 gap-1">
                      <div className="flex justify-between text-xs"><span>주문 금액</span><span>11,400원</span></div>
                      <div className="flex justify-between text-xs"><span>할인 금액</span><span>0원</span></div>
                      <div className="flex justify-between text-base font-semibold mt-1"><span>총 결제금액</span><span>11,400원</span></div>
                    </div>

                    <button className="w-full bg-[#FFC845] py-2 rounded-full mb-4 text-black">결제 취소</button>
                  </div> */}
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
                        {`${paymentSteps[step].title}`}
                      </h1>
                      <h4 className="text-base text-white"
                        style={{
                          fontFamily: 'Pretendard',
                          fontWeight: '600',
                          lineHeight: '140%',
                        }}>
                          {currentSubstepText}
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
            <h3 
              className="text-xl mb-20 text-center text-black"
              style={{
                fontFamily: 'Pretendard',
                fontWeight: '600',
                lineHeight: '140%',
              }}
            >
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
                onClick={() => void 0}
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
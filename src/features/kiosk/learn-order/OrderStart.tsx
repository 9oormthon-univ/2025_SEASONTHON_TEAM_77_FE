import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { orderStartSteps } from './OrderStartData';
import HeaderBar from '../../../components/HeaderBar';

const OrderStart: React.FC = () => {
  const [page, setPage] = useState<'intro' | 'kiosk' | 'complete'>('intro');
  const [step, setStep] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<'매장' | '포장' | null>(null);
  const navigate = useNavigate();

  const handleNextStep = () => {
    if (step === null) return;
    if (step < orderStartSteps.length - 1) {
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
              className="w-72 h-72 mb-10 mt-10"
              style={{
                backgroundImage: 'url(/src/assets/character/2.png)',
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
              학습이 도움이 되셨나요?
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
              자! 이제 직접 키오스크 화면에서<br />
              주문을 해 볼 차례에요.
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
            {step === 0 && (
              <>
                <img src="/src/assets/kiosk_initial.svg" alt="kiosk_bg" className="w-[319px] h-[569px] mt-[67px]" onClick={() => setStep(1)} />
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
            )}

            {step === 1 && (
              <>
                <div 
                  className="flex flex-col items-center justify-center w-[319px] h-[569px] mt-[67px] py-[132px] px-[16px] border-2 border-gray-300 bg-white"
                  style={{
                    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.04)',
                    borderRadius: '36px',
                  }}
                >
                  <h3 className="text-xl text-black text-center mb-9"
                    style={{
                      fontFamily: 'Pretendard',
                      fontWeight: '600',
                      lineHeight: '140%',
                    }}
                  >주문 방법을 선택해 주세요</h3>
                  <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => setSelectedOption('매장')}
                    className={`w-[135px] h-[206px] py-10 px-8 flex flex-col items-center justify-center rounded-lg border-1 border-[#ECECEC] ${
                      selectedOption === '매장' ? 'bg-[#FFEEC5]' : 'bg-white'
                    }`}
                    style={{
                      border: '1px solid #ECECEC',
                      boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="59" height="58" viewBox="0 0 59 58" fill="none">
                      <path d="M52.75 32.2088V49.667H55.3333V54.8337H3.66665V49.667H6.24998V32.2088C4.65961 31.1473 3.35591 29.7096 2.4546 28.0232C1.55329 26.3369 1.08226 24.4541 1.08331 22.542C1.08331 20.4056 1.66198 18.3467 2.71856 16.5926L9.72456 4.45866C9.95129 4.06595 10.2774 3.73984 10.6701 3.51311C11.0628 3.28638 11.5083 3.167 11.9617 3.16699H47.0408C47.4943 3.167 47.9397 3.28638 48.3324 3.51311C48.7251 3.73984 49.0513 4.06595 49.278 4.45866L56.2582 16.5538C57.7993 19.1136 58.2946 22.1688 57.6413 25.0844C56.9879 27.9999 55.2361 30.5515 52.75 32.2088ZM47.5833 34.0947C45.8071 34.2939 44.0089 34.0806 42.3286 33.4712C40.6483 32.8618 39.1314 31.8729 37.8958 30.5813C36.8114 31.7156 35.5083 32.6183 34.0653 33.2351C32.6223 33.8518 31.0693 34.1697 29.5 34.1696C27.9311 34.1703 26.3783 33.8533 24.9353 33.2374C23.4923 32.6216 22.189 31.7198 21.1041 30.5865C19.8684 31.8776 18.3513 32.866 16.671 33.4749C14.9908 34.0839 13.1927 34.2968 11.4166 34.0972V49.667H47.5833V34.0972V34.0947ZM13.4549 8.33366L7.16965 19.2172C6.55889 20.7263 6.54056 22.4103 7.11832 23.9323C7.69608 25.4543 8.82732 26.7019 10.2856 27.4255C11.7439 28.1491 13.4217 28.2953 14.9831 27.8348C16.5446 27.3743 17.8746 26.341 18.7068 24.9419C19.5722 22.7797 22.6335 22.7797 23.5015 24.9419C23.9802 26.1417 24.8076 27.1703 25.8769 27.8949C26.9462 28.6196 28.2083 29.0069 29.5 29.0069C30.7917 29.0069 32.0537 28.6196 33.123 27.8949C34.1924 27.1703 35.0198 26.1417 35.4985 24.9419C36.3639 22.7797 39.4252 22.7797 40.2932 24.9419C40.6284 25.7672 41.1307 26.5141 41.7686 27.1359C42.4064 27.7576 43.166 28.2407 43.9995 28.5548C44.8331 28.8688 45.7226 29.007 46.6121 28.9608C47.5017 28.9145 48.372 28.6847 49.1685 28.2858C49.9649 27.887 50.6703 27.3277 51.2401 26.6431C51.81 25.9585 52.2321 25.1635 52.48 24.3079C52.7278 23.4523 52.7959 22.5547 52.6801 21.6715C52.5643 20.7884 52.2671 19.9387 51.8071 19.1759L45.5425 8.33366H13.4575H13.4549Z" fill="#444444"/>
                    </svg>
                    <h3 className="text-xl text-[#444444] text-center mt-2"
                      style={{
                        fontFamily: 'Pretendard',
                        fontWeight: '600',
                        lineHeight: '140%',
                      }}
                    >매장</h3>
                    <h3 className="text-sm text-[#444444] text-center mt-2"
                      style={{
                        fontFamily: 'Pretendard',
                        fontWeight: '500',
                        lineHeight: '140%',
                      }}
                    >To Order</h3>
                  </button>

                  <button
                    onClick={() => setSelectedOption('포장')}
                    className={`w-[135px] h-[206px] py-10 px-8 flex flex-col items-center justify-center rounded-lg ${
                      selectedOption === '포장' ? 'bg-[#FFEEC5]' : 'bg-white'
                    }`}
                    style={{
                      border: '1px solid #ECECEC',
                      boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="59" height="58" viewBox="0 0 59 58" fill="none">
                      <g clip-path="url(#clip0_2372_81)">
                      <path d="M17.4166 12.0837V4.83366C17.4166 4.19272 17.6713 3.57803 18.1245 3.12482C18.5777 2.6716 19.1924 2.41699 19.8333 2.41699H39.1666C39.8076 2.41699 40.4223 2.6716 40.8755 3.12482C41.3287 3.57803 41.5833 4.19272 41.5833 4.83366V12.0837H51.25C51.8909 12.0837 52.5056 12.3383 52.9588 12.7915C53.412 13.2447 53.6666 13.8594 53.6666 14.5003V48.3337C53.6666 48.9746 53.412 49.5893 52.9588 50.0425C52.5056 50.4957 51.8909 50.7503 51.25 50.7503H7.74998C7.10904 50.7503 6.49435 50.4957 6.04114 50.0425C5.58793 49.5893 5.33331 48.9746 5.33331 48.3337V14.5003C5.33331 13.8594 5.58793 13.2447 6.04114 12.7915C6.49435 12.3383 7.10904 12.0837 7.74998 12.0837H17.4166ZM36.75 16.917H22.25V45.917H36.75V16.917ZM17.4166 16.917H10.1666V45.917H17.4166V16.917ZM41.5833 16.917V45.917H48.8333V16.917H41.5833ZM22.25 7.25033V12.0837H36.75V7.25033H22.25Z" fill="#444444"/>
                      </g>
                      <defs>
                      <clipPath id="clip0_2372_81">
                      <rect width="58" height="58" fill="white" transform="translate(0.5)"/>
                      </clipPath>
                      </defs>
                    </svg>
                    <h3 className="text-xl text-[#444444] text-center mt-2"
                      style={{
                        fontFamily: 'Pretendard',
                        fontWeight: '600',
                        lineHeight: '140%',
                      }}
                    >포장</h3>
                    <h3 className="text-sm text-[#444444] text-center mt-2"
                      style={{
                        fontFamily: 'Pretendard',
                        fontWeight: '500',
                        lineHeight: '140%',
                      }}
                    >To Go</h3>
                  </button>
                  </div>
                </div>
              </>
            )}
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
                        {`${step + 1}. ${orderStartSteps[step].title}`}
                      </h1>
                      <h4 className="text-base text-white"
                        style={{
                          fontFamily: 'Pretendard',
                          fontWeight: '600',
                          lineHeight: '140%',
                        }}>
                          {orderStartSteps[step]?.description}
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
              주문 시작 화면에 대해<br />
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

export default OrderStart;
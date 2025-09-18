import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HeaderBar from '../../../components/HeaderBar';
import KioskFrame from './KioskFrame';
import { OrderCheckSteps } from './OrderCheckData';
import { kioskAPI } from '../../../shared/api';
import IntroScreen from '../../../components/teachmap/IntroScreen';
import CompleteScreen from '../../../components/teachmap/CompleteScreen';
import StepOverlay from '../../../components/teachmap/StepOverlay';
import { SoundTooltip } from '../../../components/tooltip/SoundTooltip';

const OrderCheck: React.FC = () => {
  const [page, setPage] = useState<'intro' | 'kiosk' | 'complete'>('intro');
  const [step, setStep] = useState<number | 'final-kiosk' | null>(null);
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  // 키오스크 진입 시 0단계부터 시작
  useEffect(() => {
    if (page === 'kiosk') {
      setShowTooltip(true);

      const timer1 = setTimeout(() => {
        setShowTooltip(false);
      }, 10000);

      const timer2 = setTimeout(() => setStep(0), 300); // 300ms 지연
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [page]);

  useEffect(() => {
    if (page === 'complete') {
      const completeLesson = async () => {
        try {
          await kioskAPI.completeStep('5');
          console.log('학습 완료 API 호출 성공');
        } catch (error) {
          console.error('학습 완료 API 호출 실패:', error);
        }
      };
      
      completeLesson();
    }
  }, [page]);


  const handleNext = () => {
    if (step === null) return;
    if (typeof step === 'number' && step < OrderCheckSteps.length - 1) {
      setStep(step + 1);
    } else {
      // 마지막 설명 후 final-kiosk 화면
      setStep('final-kiosk');
    }
  };

  const handleBefore = () => {
    if (step === null) return;
    if (typeof step === 'number' && step > 0) {
      setStep(step - 1);
    }
  };

  // final-kiosk 상태면 2초 뒤 complete로 전환
  useEffect(() => {
    if (step === 'final-kiosk') {
      const t = setTimeout(() => setPage('complete'), 2000);
      return () => clearTimeout(t);
    }
  }, [step]);

  const bottomTotals = (() => {
    if (step === 2) return { qty: 4, sum: 15000 }; // 3번째 설명 화면
    if (step === 3) return { qty: 2, sum:  7200 }; // 4번째 설명 화면
    return { qty: 3, sum: 11400 };                 // 나머지 화면(현재 값 유지)
  })();

  return (
    <div className="relative w-full h-screen">
      <HeaderBar title="티치맵" backTo="/teachmap" />
      <SoundTooltip showTooltip={showTooltip} />

      {/* 시작 화면 */}
      <AnimatePresence>
        {page === 'intro' && (
          <IntroScreen
            title="마지막으로 주문 확인을<br />해볼까요?"
            onStart={() => setPage('kiosk')}
          />
        )}
      </AnimatePresence>

      {/* 키오스크 화면 */}
      {page === 'kiosk' && (
        <>
        <KioskFrame disableTabClicks>
        {/* final-kiosk에서도 주문표를 항상 렌더 */}
        <div className="flex h-full flex-col">
            {/* 상단 주문표 카드 */}
            <div className="pt-6">
            <div className="text-[20px] font-bold text-[#111111] text-center">
                주문 내역을 확인하고<br />
                <span className="text-[#FFC845]">결제하기</span>를 누르세요
            </div>

            {/* 테이블 헤더 */}
            <div className="mt-6 mx-1 grid grid-cols-[1fr,56px,70px] text-[14px] font-semibold text-[#000000] bg-[#F6F5F4] rounded-lg px-[52px] py-2">
                <div>메뉴</div>
                <div className="text-right">수량</div>
                <div className="text-right">금액</div>
            </div>

            {/* 주문 항목들 */}
            <div className="mt-3 mx-[20px] space-y-3 text-[14px] text-[#000000] font-medium">
                {/* 아메리카노 */}
                <div className="grid grid-cols-[1fr,62px,67px,24px] items-center">
                <div className="truncate pr-2">아이스아메리카노</div>
                <div className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#444444] text-white text-[12px] flex items-center justify-center">−</span>
                    <span>1</span>
                    <span className="w-5 h-5 rounded-full bg-[#444444] text-white text-[12px] flex items-center justify-center">＋</span>
                </div>
                <div className="text-right">3,600원</div>
                <button aria-label="닫기" className="items-center justify-center ml-1">
                    <img src="/assets/cancel_icon.png" alt="닫기" className="w-5 h-5 filter brightness-[3]" />
                </button>
                </div>
                <div className="mt-2 h-px bg-[#F0F0F0]" />

                {/* 아이스티 — step === 2면 수량 2 */}
                <div className="grid grid-cols-[1fr,62px,67px,24px] items-center">
                <div className="truncate pr-2">아이스티</div>
                <div className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#444] text-white text-[12px] flex items-center justify-center">−</span>
                    <span>{step === 2 ? 2 : 1}</span>
                    <span className="w-5 h-5 rounded-full bg-[#444] text-white text-[12px] flex items-center justify-center">＋</span>
                </div>
                <div className="text-right">{step === 2 ? '7,200원' : '3,600원'}</div>
                <button aria-label="닫기" className="items-center justify-center ml-1">
                    <img src="/assets/cancel_icon.png" alt="닫기" className="w-5 h-5 filter brightness-[3]" />
                </button>
                </div>
                <div className="mt-2 h-px bg-[#F0F0F0]" />

                {/* 초코쿠키 — step === 3에서는 숨김 */}
                {step !== 3 && (
                <>
                    <div className="grid grid-cols-[1fr,62px,67px,24px] items-center">
                    <div className="truncate pr-2">초코쿠키</div>
                    <div className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#444] text-white text-[12px] flex items-center justify-center">−</span>
                        <span>1</span>
                        <span className="w-5 h-5 rounded-full bg-[#444] text-white text-[12px] flex items-center justify-center">＋</span>
                    </div>
                    <div className="text-right">4,200원</div>
                    <button aria-label="닫기" className="items-center justify-center ml-1">
                        <img src="/assets/cancel_icon.png" alt="닫기" className="w-5 h-5 filter brightness-[3]" />
                    </button>
                    </div>
                    <div className="mt-2 h-px bg-[#F0F0F0]" />
                </>
                )}
            </div>
            </div>

            {/* 하단 합계/버튼 바 */}
            <div className="mt-auto rounded-b-[34px] bg-[#444444] text-white px-4 pt-3 pb-4 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
            <div className="mb-3 flex w-full max-w-[320px] items-center justify-center text-[13px]">
                <div className="flex flex-1 justify-between px-4">
                <span className="opacity-90">총수량</span>
                <span className="opacity-90">{bottomTotals.qty}개</span>
                </div>
                <div className="w-px h-4 bg-gray-300 opacity-60" />
                <div className="flex flex-1 justify-between px-4">
                <span className="opacity-90">합계</span>
                <span className="font-medium">{bottomTotals.sum.toLocaleString()}원</span>
                </div>
            </div>
            <div className="flex items-center gap-[10px]">
                <button className="flex-1 h-[34px] rounded-[32px] bg-white text-black text-[14px] font-medium">
                이전
                </button>
                <button className="flex-[1] h-[34px] rounded-[32px] bg-[#FFC845] text-black text-[14px] font-medium">
                결제하기
                </button>
            </div>
            </div>
        </div>
        </KioskFrame>

          {/* 설명 오버레이 */}
          <AnimatePresence>
            {typeof step === 'number' && (
              <StepOverlay
                title={`${OrderCheckSteps[step].title === '주문 확인' ? 1 : 2}. ${OrderCheckSteps[step].title}`}
                description={OrderCheckSteps[step].description}
                stepProgress={
                  OrderCheckSteps[step].title === '주문 확인' ? `${step + 1}/2` :
                  OrderCheckSteps[step].title === '수량 변경' ? `${step - 1}/2` : undefined
                }
                onNext={handleNext}
                onPrev={step > 0 ? handleBefore : undefined}
                showPrev={step > 0}
                className="fixed bottom-0 left-0 w-full bg-[rgba(17,17,17,0.80)] z-40 py-[10px] px-[20px]"
              />
            )}
          </AnimatePresence>
        </>
      )}

      {/* 완료 화면 */}
      <AnimatePresence>
        {page === 'complete' && (
          <CompleteScreen
            title="주문 메뉴 확인에 대한<br />모든 학습을 완료했어요!"
            onRestart={() => setPage('intro')}
            onNext={() => navigate('/teachmap/kioskpayment')}
            characterImage="/assets/character/5.png"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderCheck;

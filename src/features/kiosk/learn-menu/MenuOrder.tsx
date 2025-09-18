import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HeaderBar from '../../../components/HeaderBar';
import KioskFrame, { type Category } from './KioskFrame';
import { LearnMenuFlow } from './LearnMenuFlow';
import { itemsByCategory } from './KioskItems';
import { kioskAPI } from '../../../shared/api';
import IntroScreen from '../../../components/teachmap/IntroScreen';
import CompleteScreen from '../../../components/teachmap/CompleteScreen';
import NavigationButtons from '../../../components/buttons/NavigationButtons';
import { useTTSPlayer } from '../../../hooks/useTTSPlayer';
import { SoundTooltip } from '../../../components/tooltip/SoundTooltip';

// 설명 단계별 탭 고정
const stepToCategory = (step: number | null): Category | null => {
  if (step === null) return null;
  if (step <= 8) return '커피';
  if (step <= 14) return '음료';
  return '디저트';
};

type Phase = 'intro' | 'kiosk' | 'complete';
type KioskPhase = 'modal' | 'flow';

// g{group}-{type}-{nn} 형식 파서 (예: g1-kiosk-03)
const parseStepId = (id: string | undefined) => {
  if (!id) return { group: null as number | null, stepNo: null as number | null };
  const m = id.match(/^g(\d+)-(?:kiosk|explain)-(\d+)$/);
  if (!m) return { group: null, stepNo: null };
  return { group: Number(m[1]), stepNo: Number(m[2]) };
};

// 규칙에 따른 하이라이트/모달 대상 메뉴명 결정
const getHighlightTarget = (id?: string) => {
  const { group, stepNo } = parseStepId(id);
  if (group == null || stepNo == null) return null;

  // 이름은 itemsByCategory에 있는 실제 카드명과 일치/포함되어야 함
  if (group === 1 && stepNo >= 3 && stepNo <= 9) return '아이스 아메리카노';
  if (group === 2 && stepNo >= 3 && stepNo <= 5) return '복숭아 아이스티';
  if (group === 3 && stepNo === 4) return '초코 쿠키';
  return null;
};

const getModalTarget = (id?: string) => {
  const { group, stepNo } = parseStepId(id);
  if (group == null || stepNo == null) return null;
  if (group === 1 && stepNo >= 4 && stepNo <= 9) return '아이스 아메리카노';
  if (group === 2 && stepNo >= 4 && stepNo <= 5) return '복숭아 아이스티';
  // group 3: 없음
  return null;
};

const MenuOrder: React.FC = () => {
  const [page, setPage] = useState<Phase>('intro');
  const [kioskPhase, setKioskPhase] = useState<KioskPhase>('modal');
  const [step, setStep] = useState<number | null>(null);
  const navigate = useNavigate();
  const { playTTS } = useTTSPlayer();
  const [showTooltip, setShowTooltip] = useState(false);

  // 시작하기 → 모달
  const enterKiosk = () => {
    setPage('kiosk');
    setKioskPhase('modal');
    setStep(null);
  };

  // 모달 닫기 → 플로우 시작
  const closeKioskModal = () => {
    setKioskPhase('flow');
    setStep(0);
  };

  // 다음 단계
  const nextStep = useCallback(() => {
    if (step === null) return;
    if (step < LearnMenuFlow.length - 1) {
      setStep(step + 1);
    } else {
      setStep(null);
      setPage('complete');
    }
  }, [step]);

  const current = step !== null ? LearnMenuFlow[step] : null;

  useEffect(() => {
    if (kioskPhase === 'flow' && current?.type === 'explain' && current?.description) {
      playTTS(current.description);
    }
  }, [kioskPhase, current?.description, current?.type, playTTS]);

  useEffect(() => {
    if (kioskPhase === 'flow') {
      setShowTooltip(true);
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [kioskPhase]);

  // 현재 그룹 내에서의 진행상황 계산
  const getGroupProgress = () => {
    if (!current?.group || current.type !== 'explain') return null;
    
    const currentGroup = current.group;
    const groupSteps = LearnMenuFlow.filter(s => s.group === currentGroup && s.type === 'explain');
    const currentIndex = groupSteps.findIndex(s => s.id === current.id);
    
    return {
      current: currentIndex + 1,
      total: groupSteps.length
    };
  };

  const groupProgress = getGroupProgress();

  // kiosk 단계 자동 진행(2초)
  useEffect(() => {
    if (kioskPhase === 'flow' && current?.type === 'kiosk') {
      const t = setTimeout(() => nextStep(), 2000);
      return () => clearTimeout(t);
    }
  }, [kioskPhase, current?.type, step, nextStep]); // step이 바뀔 때마다 새 타이머

  useEffect(() => {
    if (page === 'complete') {
      const completeLesson = async () => {
        try {
          await kioskAPI.completeStep('4');
          console.log('학습 완료 API 호출 성공');
        } catch (error) {
          console.error('학습 완료 API 호출 실패:', error);
        }
      };
      
      completeLesson();
    }
  }, [page]);


  const forcedTotals = current?.ui?.totals ?? null;
  const highlightTarget = current?.ui?.highlightIncludes ?? getHighlightTarget(current?.id);
  const modalTarget     = current?.ui?.optionModalForIncludes ?? getModalTarget(current?.id);

  // 이전 단계
  const prevStep = () => {
    if (step === null) return;
    if (step > 0) {
      setStep(step - 1);
    } else {
      // 첫 단계에서 '이전' → 모달로 복귀
      setKioskPhase('modal');
      setStep(null);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <HeaderBar title="티치맵" backTo="/teachmap" />
      <SoundTooltip showTooltip={showTooltip} />
      
      {/* 시작 화면 */}
      <AnimatePresence>
        {page === 'intro' && (
          <IntroScreen
            title="이번에는 직접 키오스크<br />화면에서 주문해볼거에요"
            onStart={enterKiosk}
          />
        )}
      </AnimatePresence>

      {/* 키오스크 화면 */}
      {page === 'kiosk' && (
        <>
          <KioskFrame
            itemsByCategory={itemsByCategory}
            forcedActiveCategory={current?.ui?.tab ?? stepToCategory(step)}
            disableTabClicks={false}
            highlightItemIncludes={highlightTarget}
            optionModalForIncludes={modalTarget}
            currentStepId={current?.id ?? null}
            forcedTotals={forcedTotals}
            forceScroll={current?.ui?.scrollTo ?? null}
          />

          {/* 주문 리스트 모달 */}
          <AnimatePresence>
            {kioskPhase === 'modal' && (
              <>
                <motion.div
                  className="fixed inset-0 bg-[rgba(17,17,17,0.80)] z-40"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                />
                <motion.div
                  className="fixed flex flex-col items-center justify-center w-[312px] h-[412px] z-50 bg-white rounded-lg py-8 text-center"
                  style={{ top: '50%', left: '50%' }}
                  initial={{ x: '-50%', y: '100%' }}
                  animate={{ x: '-50%', y: '-50%' }}
                  exit={{ x: '-50%', y: '100%' }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                >
                  <img
                    src="/assets/common/menu.png"
                    alt="주문 리스트"
                    className="mx-auto w-[120px] h-[120px] mb-7"
                  />
                  <h4 className="text-lg text-black mb-5 font-bold leading-[140%]">
                    다음 메뉴를 주문하는 방법을<br />
                    학습할거에요
                  </h4>
                  <ul className="text-base text-[#444444] mb-[35px] font-normal leading-[160%] tracking-[-0.4px] text-left">
                    <li>• 아이스아메리카노 1잔</li>
                    <li>• 아이스티 1잔</li>
                    <li>• 초코쿠키 1개</li>
                  </ul>
                  <button
                    onClick={closeKioskModal}
                    className="w-[278px] h-[52px] py-4 bg-[#FFC845] text-black rounded-full hover:scale-105 transition-all duration-300"
                  >
                    확인
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* 설명 단계 */}
          <AnimatePresence mode="wait">
            {kioskPhase === 'flow' && step !== null && current?.type === 'explain' && (
              <motion.div
                key={step}
                className="fixed bottom-0 left-0 w-full h-[182px] bg-black/80 z-40 py-[10px] px-[20px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col items-start justify-start w-[327px] h-[182px]">
                  <div className="flex flex-row justify-between w-full items-center">
                    <h1 className="text-3xl text-[#FFC845] mb-1 font-semibold leading-[140%]">
                      {/* group 번호 붙이기 */}
                      {current.group ? `${current.group}. ${current.title}` : current.title}
                    </h1>
                    {groupProgress && groupProgress.total > 1 && (
                      <p className="text-base text-white font-light">{groupProgress.current}/{groupProgress.total}</p>
                    )}
                  </div>
                  <p className="text-lg text-white font-medium leading-[140%]">
                    {current.description}
                  </p>
                </div>
              </motion.div>
            )}
              {/* 키오스크 단계 */}
            {kioskPhase === 'flow' && step !== null && current?.type === 'kiosk' && (
              <motion.div key={step} className="absolute inset-0 z-30" />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {/* 하단 고정 이전/다음 버튼 (가운데 정렬) */}
            {page === 'kiosk' && kioskPhase === 'flow' && step !== null && current?.type === 'explain' && (
              <motion.div
                key={`nav-${current?.id ?? step}`}
                className="fixed inset-x-0 bottom-[10px] z-50 flex justify-center gap-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.18 }}
              >
                <NavigationButtons
                  onPrev={prevStep}
                  onNext={nextStep}
                  prevIcon="/assets/common/before.png"
                  className="flex justify-center gap-6"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* 완료 화면 */}
      <AnimatePresence>
        {page === 'complete' && (
          <CompleteScreen
            title="메뉴 주문하기에 대한<br />모든 학습을 완료했어요!"
            onRestart={() => setPage('intro')}
            onNext={() => navigate('/teachmap/kioskordercheck')}
            characterImage="/assets/character/5.png"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuOrder;

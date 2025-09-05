import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HeaderBar from '../../../components/HeaderBar';
import KioskFrame, { type Category } from './KioskFrame';
import { LearnMenuFlow } from './LearnMenuFlow';
import { itemsByCategory } from './KioskItems';

// 설명 단계별 탭 고정
const stepToCategory = (step: number | null): Category | null => {
  if (step === null) return null;
  if (step <= 8) return '커피';     // 아아 플로우
  if (step <= 14) return '음료';    // 아이스티
  return '디저트';                  // 초코쿠키
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
  // 커피: '아이스 아메리카노', 음료: '복숭아 아이스티', 디저트: '초코쿠키'(아이템에 추가 필요)
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
  const nextStep = () => {
    if (step === null) return;
    if (step < LearnMenuFlow.length - 1) {
      setStep(step + 1);
    } else {
      setStep(null);
      setPage('complete');
    }
  };

  const current = step !== null ? LearnMenuFlow[step] : null;

  // kiosk 단계 자동 진행(2초)
  useEffect(() => {
    if (kioskPhase === 'flow' && current?.type === 'kiosk') {
      const t = setTimeout(() => nextStep(), 2000);
      return () => clearTimeout(t);
    }
  }, [kioskPhase, current?.type, step]); // step이 바뀔 때마다 새 타이머

  // current = LearnMenuFlow[step]
  const forcedTotals = current?.ui?.totals ?? null;
  // 이미 쓰던 하이라이트/모달도 ui에 있으면 우선 사용
  const highlightTarget = current?.ui?.highlightIncludes ?? getHighlightTarget(current?.id);
  const modalTarget     = current?.ui?.optionModalForIncludes ?? getModalTarget(current?.id);

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
              className="w-96 h-96"
              style={{
                backgroundImage: 'url(/src/assets/character/4.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <h3 className="text-xl mb-6 text-center text-black font-semibold">감이 좀 잡히시나요?</h3>
            <p className="text-base mb-20 text-center text-black font-medium leading-[160%]">
              자! 이번에는 직접 키오스크 화면에서<br />주문을 해 볼 차례에요.
            </p>
            <button
              onClick={enterKiosk}
              className="w-[327px] h-[52px] py-4 bg-[#FFC845] text-black rounded-full hover:scale-105 transition-all duration-300"
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
                  className="fixed flex flex-col items-center justify-center w-[312px] h-[380px] z-50 bg-white rounded-lg py-8 text-center"
                  style={{ top: '50%', left: '50%' }}
                  initial={{ x: '-50%', y: '100%' }}
                  animate={{ x: '-50%', y: '-50%' }}
                  exit={{ x: '-50%', y: '100%' }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                >
                  <img
                    src="/src/assets/menu.png"
                    alt="주문 리스트"
                    className="mx-auto w-[120px] h-[120px] mb-7"
                  />
                  <h4 className="text-lg text-black mb-5 font-semibold leading-[140%]">
                    자! 주문해야 하는 메뉴 리스트에요
                  </h4>
                  <ul className="text-sm text-[#444444] mb-9 font-medium leading-[160%] tracking-[-0.4px] text-left">
                    <li>• 아이스아메리카노 1잔</li>
                    <li>• 아이스티 1잔</li>
                    <li>• 초코쿠키 1개</li>
                  </ul>
                  <button
                    onClick={closeKioskModal}
                    className="w-[278px] h-[52px] py-4 bg-[#FFC845] mt-3 text-black rounded-full hover:scale-105 transition-all duration-300"
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
                className="fixed bottom-0 left-0 w-full h-[153px] bg-black/80 z-40 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col items-start justify-center w-[85%]">
                  <h1 className="text-2xl text-[#FFC845] mb-2 font-semibold leading-[140%]">
                    {/* group 번호 붙이기 */}
                    {current.group ? `${current.group}. ${current.title}` : current.title}
                  </h1>
                  <p className="text-sm text-white font-medium leading-[140%]">
                    {current.description}
                  </p>
                </div>
                <button
                  onClick={nextStep}
                  className="absolute -translate-y-1/2 right-[22px] w-8 h-8"
                  style={{
                    top: '50%',
                    backgroundImage: 'url(/src/assets/next.svg)',
                    backgroundSize: 'cover',
                  }}
                  aria-label="다음"
                />
              </motion.div>
            )}

            {/* 키오스크 단계 */}
            {kioskPhase === 'flow' && step !== null && current?.type === 'kiosk' && (
              <motion.div
                key={step}
                className="absolute inset-0 z-30"
                // 필요하면 클릭 즉시 이동도 사용 가능:
                // onClick={nextStep}
              />
            )}
          </AnimatePresence>
        </>
      )}

      {/* 완료 화면 */}
      <AnimatePresence>
        {page === 'complete' && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            style={{ background: 'linear-gradient(180deg, #FFEFC8 0%, #F3F3F3 100%)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div
              className="w-64 h-64 mt-28"
              style={{
                backgroundImage: 'url(/src/assets/character/5.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <h3 className="text-xl mb-20 text-center text-black font-semibold leading-[140%]">
              메뉴 주문하기에 대한<br />모든 학습을 완료했어요!
            </h3>
            <div className="flex items-center justify-center mt-20 gap-2">
              <button
                onClick={() => setPage('intro')}
                className="w-[159px] h-[52px] bg-[#F6F6F6] text-black rounded-full hover:scale-105 transition-all duration-300"
              >
                첫 화면으로
              </button>
              <button
                onClick={() => navigate('/teachmap')}
                className="w-[159px] h-[52px] bg-[#FFC845] text-black rounded-full hover:scale-105 transition-all duration-300"
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

export default MenuOrder;

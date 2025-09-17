import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HeaderBar from '../../../components/HeaderBar';
import KioskFrame, { type Category } from './KioskFrame';
import { CategorySteps } from './CategoryData';
import { itemsByCategory } from './KioskItems';
import { kioskAPI } from '../../../shared/api';
import IntroScreen from '../../../components/common/IntroScreen';
import CompleteScreen from '../../../components/common/CompleteScreen';
import StepOverlay from '../../../components/common/StepOverlay';
import { SoundTooltip } from '../../../components/common/SoundTooltip';

const CategoryExplain: React.FC = () => {
  const [page, setPage] = useState<'intro' | 'kiosk' | 'complete'>('intro');
  const [step, setStep] = useState<number | null>(null); // 0~4
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

const stepToCategory = (step: number | null): Category | null => {
  if (step === null) return null;
  if (step === 0) return null; // 1단계는 강제 없음(원하면 '커피'로 바꿀 수 있음)
  const map: Category[] = ['커피', '음료', '디저트', '푸드'];
  return map[step - 1] ?? null;
};

  // 키오스크 진입 시 0단계부터 시작
  useEffect(() => {
    if (page === 'kiosk') {
      setStep(0);
      setShowTooltip(true);
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 10000);

      return () => clearTimeout(timer);
    } else {
      setStep(null);
    }
  }, [page]);

  useEffect(() => {
    if (page === 'complete') {
      const completeLesson = async () => {
        try {
          await kioskAPI.completeStep('3');
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
    if (step < CategorySteps.length - 1) {
      setStep(step + 1);
    } else {
      setPage('complete');
    }
  };

  const handleBefore = () => {
    if (step === null) return;
    if (step < CategorySteps.length - 1) {
      setStep(step - 1);
    } else {
      setPage('complete');
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
            title="카테고리마다 어떤 메뉴가<br />있는지 알아볼게요"
            onStart={() => setPage('kiosk')}
          />
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
              <StepOverlay
                title={`${step + 1}. ${CategorySteps[step].title}`}
                description={CategorySteps[step].description}
                onNext={handleNext}
                onPrev={handleBefore}
                className="fixed bottom-0 left-0 w-full bg-[rgba(17,17,17,0.80)] z-40 py-[10px] px-[18px]"
              />
            )}
          </AnimatePresence>
        </>
      )}

      {/* 완료 화면 */}
      <AnimatePresence>
        {page === 'complete' && (
          <CompleteScreen
            title="카테고리에 대한<br />모든 학습을 완료했어요!"
            onRestart={() => setPage('intro')}
            onNext={() => navigate('/teachmap/kioskmenuorder')}
            characterImage="/assets/character/5.png"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryExplain;

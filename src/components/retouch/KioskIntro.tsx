import { AnimatePresence, motion } from 'framer-motion';
import KioskFrame from '../../features/kiosk/learn-menu/KioskFrame';

type Props = {
  totals: { qty: number; sum: number };
  introPhase: 'bg1' | 'modal' | 'bg2' | 'select';
  setIntroPhase: (p: 'bg1' | 'modal' | 'bg2' | 'select') => void;
  testTitle: string;
  testLoading: boolean;
  testError: string | null;
  selectedOption: '매장' | '포장' | null;
  onSelectProceed: (opt: '매장' | '포장') => void;
  onBgClick: () => void;
};

export default function KioskIntro({
  totals,
  introPhase,
  setIntroPhase,
  testTitle,
  testLoading,
  testError,
  selectedOption,
  onSelectProceed,
  onBgClick,
}: Props) {
  return (
    <>
      <KioskFrame disableTabClicks forcedTotals={totals}>
        {introPhase === 'select' ? (
          <div 
            className="flex flex-col items-center justify-center w-[315px] h-[565px] py-[131px] border-2 border-gray-300 bg-white"
            style={{ boxShadow: '0 2px 4px 0 rgba(0,0,0,0.04)', borderRadius: '34px' }}
          >
            <h3 className="text-xl text-black text-center mb-9" style={{ fontFamily: 'Pretendard', fontWeight: 600, lineHeight: '140%' }}>
              주문 방법을 선택해 주세요
            </h3>

            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => onSelectProceed('매장')}
                className={`w-[135px] h-[206px] py-10 px-8 flex flex-col items-center justify-center rounded-lg border-1 border-[#ECECEC] ${
                  selectedOption === '매장' ? 'bg-[#FFEEC5]' : 'bg-white'
                }`}
                style={{ border: '1px solid #ECECEC', boxShadow: '0 2px 4px 0 rgba(0,0,0,0.04)' }}
              >
                <img
                  src="/assets/store.png"
                  alt="store"
                  width={59}
                  height={58}
                  className="inline-block"
                />
                <h3 className="text-xl text-[#444444] text-center mt-2" style={{ fontFamily: 'Pretendard', fontWeight: 600, lineHeight: '140%' }}>매장</h3>
                <h3 className="text-sm text-[#444444] text-center mt-2" style={{ fontFamily: 'Pretendard', fontWeight: 500, lineHeight: '140%' }}>To Order</h3>
              </button>

              <button
                onClick={() => onSelectProceed('포장')}
                className={`w-[135px] h-[206px] py-10 px-8 flex flex-col items-center justify-center rounded-lg ${
                  selectedOption === '포장' ? 'bg-[#FFEEC5]' : 'bg-white'
                }`}
                style={{ border: '1px solid #ECECEC', boxShadow: '0 2px 4px 0 rgba(0,0,0,0.04)' }}
              >
                <img
                  src="/assets/to_go.png"
                  alt="store"
                  width={59}
                  height={58}
                  className="inline-block"
                />
                <h3 className="text-xl text-[#444444] text-center mt-2" style={{ fontFamily: 'Pretendard', fontWeight: 600, lineHeight: '140%' }}>포장</h3>
                <h3 className="text-sm text-[#444444] text-center mt-2" style={{ fontFamily: 'Pretendard', fontWeight: 500, lineHeight: '140%' }}>To Go</h3>
              </button>
            </div>
          </div>
        ) : (
          <img
            src="/assets/kiosk_initial.svg"
            alt="kiosk_bg"
            className="w-[319px] h-[574.5px] -mt-[2.5px] object-cover select-none cursor-pointer"
            onClick={introPhase !== 'modal' ? onBgClick : undefined}
          />
        )}
      </KioskFrame>

      <AnimatePresence>
        {introPhase === 'modal' && (
          <>
            <motion.div
              className="fixed inset-0 bg-[rgba(17,17,17,0.80)] z-40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed flex flex-col items-center justify-center w-[312px] h-[317px] z-50 bg-white rounded-lg px-[17px] py-5 text-center"
              style={{ top: '50%', left: '50%' }}
              initial={{ x: '-50%', y: '100%' }}
              animate={{ x: '-50%', y: '-50%' }}
              exit={{ x: '-50%', y: '100%' }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              <img src="/assets/menu.png" alt="주문 리스트" className="mx-auto w-[120px] h-[120px] mb-4" />
              <h4 className="text-lg text-black mb-5 font-semibold leading-[140%]">매장 식사</h4>
              <ul className="text-sm text-[#444444] mb-5 font-medium leading-[160%] text-left">
                {testLoading && <li>• 불러오는 중...</li>}
                {testError && <li>• {testError}</li>}
                {!testLoading && !testError && (<li>• {testTitle || '주문 목록이 없습니다.'}</li>)}
              </ul>
              <button
                onClick={() => setIntroPhase('bg2')}
                className="w-[278px] h-[52px] py-4 bg-[#FFC845] text-black rounded-full hover:scale-105 transition-all duration-300"
              >
                확인
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

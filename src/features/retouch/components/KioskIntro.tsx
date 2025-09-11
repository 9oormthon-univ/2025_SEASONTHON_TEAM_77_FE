import { AnimatePresence, motion } from 'framer-motion';
import KioskFrame from '../../kiosk/learn-menu/KioskFrame';

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
            className="flex flex-col items-center justify-center w-[317px] h-[567px] py-[131px] -pr-4 px-[16px] border-2 border-gray-300 bg-white"
            style={{ boxShadow: '0 2px 4px 0 rgba(0,0,0,0.04)', borderRadius: '36px' }}
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
                <svg xmlns="http://www.w3.org/2000/svg" width="59" height="58" viewBox="0 0 59 58" fill="none">
                  <path d="M52.75 32.2088V49.667H55.3333V54.8337H3.66665V49.667H6.24998V32.2088C4.65961 31.1473 3.35591 29.7096 2.4546 28.0232C1.55329 26.3369 1.08226 24.4541 1.08331 22.542C1.08331 20.4056 1.66198 18.3467 2.71856 16.5926L9.72456 4.45866C9.95129 4.06595 10.2774 3.73984 10.6701 3.51311C11.0628 3.28638 11.5083 3.167 11.9617 3.16699H47.0408C47.4943 3.167 47.9397 3.28638 48.3324 3.51311C48.7251 3.73984 49.0513 4.06595 49.278 4.45866L56.2582 16.5538C57.7993 19.1136 58.2946 22.1688 57.6413 25.0844C56.9879 27.9999 55.2361 30.5515 52.75 32.2088Z" fill="#444444"/>
                </svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="59" height="58" viewBox="0 0 59 58" fill="none">
                  <path d="M17.4166 12.0837V4.83366C17.4166 4.19272 17.6713 3.57803 18.1245 3.12482C18.5777 2.6716 19.1924 2.41699 19.8333 2.41699H39.1666V12.0837H17.4166Z" fill="#444444"/>
                </svg>
                <h3 className="text-xl text-[#444444] text-center mt-2" style={{ fontFamily: 'Pretendard', fontWeight: 600, lineHeight: '140%' }}>포장</h3>
                <h3 className="text-sm text-[#444444] text-center mt-2" style={{ fontFamily: 'Pretendard', fontWeight: 500, lineHeight: '140%' }}>To Go</h3>
              </button>
            </div>
          </div>
        ) : (
          <img
            src="/src/assets/kiosk_initial.svg"
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
              <img src="/src/assets/menu.png" alt="주문 리스트" className="mx-auto w-[120px] h-[120px] mb-4" />
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

import { AnimatePresence, motion } from 'framer-motion';
import type { KioskItem } from '../../kiosk/learn-menu/KioskFrame';

type Props = {
  item: KioskItem | null;
  modalSize: 'S' | 'M' | 'L';
  setModalSize: (s: 'S' | 'M' | 'L') => void;
  sizePreselectEnabled: boolean;
  setSizePreselectEnabled: (v: boolean) => void;
  modalQty: number;
  setModalQty: (updater: (q: number) => number) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function OptionModal({
  item,
  modalSize,
  setModalSize,
  sizePreselectEnabled,
  setSizePreselectEnabled,
  modalQty,
  setModalQty,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div className="fixed inset-0 bg-[rgba(0,0,0,0.30)] z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            className="fixed z-50 w-[312px] rounded-2xl bg-white px-5 py-6"
            style={{ left: '50%', top: '45%' }}
            initial={{ x: '-50%', y: '-30%', opacity: 0 }}
            animate={{ x: '-50%', y: '-50%', opacity: 1 }}
            exit={{ x: '-50%', y: '-30%', opacity: 0 }}
          >
            <div className="relative">
              <div className="text-[20px] font-semibold text-[#000]">
                {item.name.replace(/^아이스\s*/, '')}
              </div>
              <div className="mt-2 text-[20px] font-semibold text-[#FFC845]">
                {(item.price ?? 0).toLocaleString()}원
              </div>
              <button aria-label="닫기" onClick={onCancel} className="absolute right-0 top-0 w-6 h-6 grid place-items-center">
                <img src="/assets/common/cancel_icon.png" alt="닫기" className="w-6 h-6 opacity-40" />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-[104px,1fr] gap-3 items-start">
              <div className="w-[90px] h-[90px] rounded-2xl bg-[#F6F5F4] grid place-items-center overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="h-[90px] w-[90px] object-contain" />
                ) : (<div className="w-16 h-16 bg-gray-100 rounded" />)}
              </div>

              <div className="flex flex-col">
                <div className="mb-3 flex gap-2">
                  {(['S', 'M', 'L'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => { setModalSize(s); setSizePreselectEnabled(true); }}
                      className={[
                        'px-3 py-2 rounded-2xl text-sm',
                        (sizePreselectEnabled && modalSize === s) ? 'bg-[#FFEEC5] text-[#111]' : 'bg-[#ECECEC] text-[#111]',
                      ].join(' ')}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setModalQty((q) => Math.max(1, q - 1))} className="w-5 h-5 rounded-full bg-[#444] text-white text-[18px] leading-none grid place-items-center">−</button>
                  <span className="text-[14px]">{modalQty}</span>
                  <button onClick={() => setModalQty((q) => q + 1)} className="w-5 h-5 rounded-full bg-[#444] text-white text-[18px] leading-none grid place-items-center">＋</button>
                </div>
              </div>
            </div>

            <div className="mt-8 mb-2 grid grid-cols-2 gap-2">
              <button onClick={onCancel} className="h-[38px] rounded-[36px] bg-[#ECECEC] text-[#000] text-[14px] font-medium">취소</button>
              <button onClick={onConfirm} className="h-[38px] rounded-[36px] bg-[#FFC845] text-[#000] text-[14px] font-medium">선택완료</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

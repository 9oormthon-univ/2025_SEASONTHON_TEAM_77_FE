import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HeaderBar from '../../components/HeaderBar';
import KioskFrame, { type Category, type KioskItem } from '../kiosk/learn-menu/KioskFrame';
import { itemsByCategory } from '../kiosk/learn-menu/KioskItems';

type IntroPhase = 'bg1' | 'modal' | 'bg2';

type CartItem = {
  name: string;
  price: number;
  qty: number;
  size?: 'S' | 'M' | 'L';
};

const Retouch: React.FC = () => {
const [page, setPage] = useState<
  'intro' | 'kioskIntro' | 'kiosk' | 'orderSheet' | 'review' | 'wrongCheck' | 'complete'
>('intro');
  const [introPhase, setIntroPhase] = useState<IntroPhase>('bg1');

  const [highlightName, setHighlightName] = useState<string | null>(null);
  const [pendingModalItem, setPendingModalItem] = useState<KioskItem | null>(null);
  const modalTimerRef = useRef<number | null>(null);

  const [modalSize, setModalSize] = useState<'S' | 'M' | 'L'>('S');
  const [modalQty, setModalQty] = useState<number>(1);

  const [cart, setCart] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (page === 'kioskIntro') {
      setIntroPhase('bg1');
    }
    return () => {
      if (modalTimerRef.current) {
        window.clearTimeout(modalTimerRef.current);
        modalTimerRef.current = null;
      }
    };
  }, [page]);

  const handleIntroBgClick = () => {
    if (introPhase === 'bg1') setIntroPhase('modal');
    else if (introPhase === 'bg2') setPage('kiosk');
  };

  const totals = useMemo(() => {
    let qty = 0;
    let sum = 0;
    for (const it of cart) {
      qty += it.qty;
      sum += (it.price ?? 0) * it.qty;
    }
    return { qty, sum };
  }, [cart]);

  const bottomTotals = totals;

  const handleSelectItem = (item: KioskItem, category: Category) => {
    setHighlightName(item.name);
    if (category === '커피' || category === '음료') {
      if (modalTimerRef.current) window.clearTimeout(modalTimerRef.current);
      modalTimerRef.current = window.setTimeout(() => {
        setPendingModalItem(item);
        setModalSize('S');
        setModalQty(1);
      }, 200) as unknown as number;
    } else {
      addToCart({ name: item.name, price: item.price ?? 0, qty: 1 });
      window.setTimeout(() => setHighlightName(null), 800);
    }
  };

  const addToCart = (ci: CartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (p) => p.name === ci.name && (p.size ?? '') === (ci.size ?? '')
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + ci.qty };
        return copy;
      }
      return [...prev, ci];
    });
  };

  const cancelOptionModal = () => {
    setPendingModalItem(null);
    setHighlightName(null);
  };

  const confirmOptionModal = () => {
    if (!pendingModalItem) return;
    addToCart({
      name: pendingModalItem.name,
      price: pendingModalItem.price ?? 0,
      qty: modalQty,
      size: modalSize,
    });
    setPendingModalItem(null);
    window.setTimeout(() => setHighlightName(null), 600);
  };

  // 주문서 이동: 키오스크 하단의 "주문하기" 클릭 시
  const goOrderSheet = () => {
    if (totals.qty === 0) return; // 빈 장바구니 보호(원하면 토스트 등)
    setPage('orderSheet');
  };

  // 주문서에서 수량 조절/삭제 (간단 동작)
  const changeQty = (idx: number, delta: number) => {
    setCart((prev) => {
      const copy = [...prev];
      const next = Math.max(1, copy[idx].qty + delta);
      copy[idx] = { ...copy[idx], qty: next };
      return copy;
    });
  };
  const removeItem = (idx: number) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  };

  const money = (n: number) => `${n.toLocaleString()}원`;

  useEffect(() => {
    if (page !== 'review') return;
    const t = window.setTimeout(() => setPage('wrongCheck'), 2000);
    return () => window.clearTimeout(t);
    }, [page]);

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
              className="w-[236px] h-[236px]"
              style={{
                backgroundImage: 'url(/src/assets/character/3.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <h3 className="text-xl mb-6 text-center text-black font-semibold leading-[140%]">
              리터치 학습에 오신걸 환영합니다
            </h3>
            <p className="text-base mb-20 text-center text-black font-medium leading-[160%] tracking-[-0.4px]">
              주어진 주문서를 확인하고,<br />
              키오스크에서 그대로 주문해주세요
            </p>
            <button
              onClick={() => setPage('kioskIntro')}
              className="w-[327px] h-[52px] py-4 bg-[#FFC845] mt-3 flex items-center justify-center text-black rounded-full hover:scale-105 transition-all duration-300"
            >
              시작하기
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 키오스크 도입부 */}
      {page === 'kioskIntro' && (
        <>
          <KioskFrame disableTabClicks forcedTotals={totals}>
            <img
              src="/src/assets/kiosk_initial.svg"
              alt="kiosk_bg"
              className="w-[319px] h-[574.5px] -mt-[2.5px] object-cover select-none cursor-pointer"
              onClick={introPhase !== 'modal' ? handleIntroBgClick : undefined}
            />
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
                  <img
                    src="/src/assets/menu.png"
                    alt="주문 리스트"
                    className="mx-auto w-[120px] h-[120px] mb-4"
                  />
                  <h4 className="text-lg text-black mb-5 font-semibold leading-[140%]">
                    매장 식사
                  </h4>
                  <ul className="text-sm text-[#444444] mb-5 font-medium leading-[160%] text-left">
                    <li>• 레몬아메리카노 <span className="text-[#FFC845]">중간 사이즈</span> 1잔</li>
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
      )}

      {/* 실제 키오스크 화면 */}
      {page === 'kiosk' && (
        <>
          <KioskFrame
            itemsByCategory={itemsByCategory}
            disableTabClicks={false}
            onSelectItem={handleSelectItem}
            highlightItemIncludes={highlightName}
            forcedTotals={totals}
            onClickOrder={goOrderSheet}
          />
          {/* 옵션 모달 */}
          <AnimatePresence>
            {pendingModalItem && (
              <>
                <motion.div
                  className="fixed inset-0 bg-[rgba(0,0,0,0.30)] z-40"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                />
                <motion.div
                  className="fixed z-50 w-[312px] rounded-2xl bg-white px-5 py-6"
                  style={{ left: '50%', top: '45%' }}
                  initial={{ x: '-50%', y: '-30%', opacity: 0 }}
                  animate={{ x: '-50%', y: '-50%', opacity: 1 }}
                  exit={{ x: '-50%', y: '-30%', opacity: 0 }}
                >
                  <div className="relative">
                    <div className="text-[20px] font-semibold text-[#000]">
                      {pendingModalItem.name.replace(/^아이스\s*/, '')}
                    </div>
                    <div className="mt-2 text-[20px] font-semibold text-[#FFC845]">
                      {(pendingModalItem.price ?? 0).toLocaleString()}원
                    </div>
                    <button
                      aria-label="닫기"
                      onClick={cancelOptionModal}
                      className="absolute right-0 top-0 w-6 h-6 grid place-items-center"
                    >
                      <img src="/src/assets/cancel_icon.png" alt="닫기" className="w-6 h-6 opacity-40" />
                    </button>
                  </div>

                  <div className="mt-3 grid grid-cols-[104px,1fr] gap-3 items-start">
                    <div className="w-[90px] h-[90px] rounded-2xl bg-[#F6F5F4] grid place-items-center overflow-hidden">
                      {pendingModalItem.imageUrl ? (
                        <img
                          src={pendingModalItem.imageUrl}
                          alt={pendingModalItem.name}
                          className="h-[90px] w-[90px] object-contain"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded" />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="mb-3 flex gap-2">
                        {(['S', 'M', 'L'] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() => setModalSize(s)}
                            className={[
                              'px-3 py-2 rounded-2xl text-sm',
                              modalSize === s ? 'bg-[#FFEEC5] text-[#111]' : 'bg-[#ECECEC] text-[#111]',
                            ].join(' ')}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                          className="w-5 h-5 rounded-full bg-[#444] text-white text-[18px] leading-none grid place-items-center"
                        >
                          −
                        </button>
                        <span className="text-[14px]">{modalQty}</span>
                        <button
                          onClick={() => setModalQty((q) => q + 1)}
                          className="w-5 h-5 rounded-full bg-[#444] text-white text-[18px] leading-none grid place-items-center"
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 mb-2 grid grid-cols-2 gap-2">
                    <button
                      onClick={cancelOptionModal}
                      className="h-[38px] rounded-[36px] bg-[#ECECEC] text-[#000] text-[14px] font-medium"
                    >
                      취소
                    </button>
                    <button
                      onClick={confirmOptionModal}
                      className="h-[38px] rounded-[36px] bg-[#FFC845] text-[#000] text-[14px] font-medium"
                    >
                      선택완료
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}

      {/* 주문서 화면 */}
      {page === 'orderSheet' && (
        <KioskFrame disableTabClicks forcedTotals={totals}>
          <div className="flex h-full flex-col">
            <div className="pt-6">
              <div className="text-[20px] font-bold text-[#111111] text-center">
                주문 내역을 확인하고<br />
                <span className="text-[#FFC845]">결제하기</span>를 누르세요
              </div>

              <div className="mt-6 mx-1 grid grid-cols-[1fr,56px,70px] text-[14px] font-semibold text-[#000000] bg-[#F6F5F4] rounded-lg px-[52px] py-2">
                <div>메뉴</div>
                <div className="text-right">수량</div>
                <div className="text-right">금액</div>
              </div>

              {/* 주문 항목들 (cart 기반 동적 렌더) */}
              <div className="mt-3 mx-[20px] space-y-3 text-[14px] text-[#000000] font-medium">
                {cart.map((ci, idx) => (
                  <React.Fragment key={`${ci.name}-${ci.size ?? 'none'}`}>
                    <div className="grid grid-cols-[1fr,62px,67px,24px] items-center">
                      <div className="truncate pr-2">
                        {ci.name}{ci.size ? ` (${ci.size})` : ''}
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="w-5 h-5 rounded-full bg-[#444] text-white text-[12px] grid place-items-center"
                          onClick={() => changeQty(idx, -1)}
                        >−</button>
                        <span>{ci.qty}</span>
                        <button
                          className="w-5 h-5 rounded-full bg-[#444] text-white text-[12px] grid place-items-center"
                          onClick={() => changeQty(idx, +1)}
                        >＋</button>
                      </div>
                      <div className="text-right">{money(ci.price * ci.qty)}</div>
                      <button
                        aria-label="삭제"
                        className="items-center justify-center ml-1"
                        onClick={() => removeItem(idx)}
                      >
                        <img src="/src/assets/cancel_icon.png" alt="닫기" className="w-5 h-5 filter brightness-[3]" />
                      </button>
                    </div>
                    <div className="mt-2 h-px bg-[#F0F0F0]" />
                  </React.Fragment>
                ))}
                {cart.length === 0 && (
                  <div className="text-center text-[#888] py-6">담은 메뉴가 없습니다.</div>
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
                <button
                className="flex-[1] h-[34px] rounded-[32px] bg-[#FFC845] text-black text-[14px] font-medium"
                onClick={() => setPage('review')}
                >
                결제하기
                </button>
            </div>
            </div>
          </div>
        </KioskFrame>
      )}

      {/* 주문 완료 화면 */}
      <AnimatePresence>
        {page === 'review' && (
          <motion.div
            className="absolute inset-0 flex flex-col w-full h-screen items-center justify-center z-20"
            style={{ background: 'linear-gradient(180deg, #FFEFC8 0%, #F3F3F3 100%)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div
              className="w-[240px] h-[240px] mt-28"
              style={{
                backgroundImage: 'url(/src/assets/character/6.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <h3 className="text-xl mb-6 text-center text-black font-semibold leading-[140%]">
              주문이 완료되었어요
            </h3>
            <p className="text-base mb-20 text-center text-black font-medium leading-[160%]">
              메뉴가 준비 중이니,<br />
              잠시만 기다려 주세요
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    {/* 오답 확인 화면 */}
    <AnimatePresence>
    {page === 'wrongCheck' && (
        <motion.div
        className="absolute inset-0 flex flex-col items-center justify-start pt-10 z-20 bg-[#F6F5F4]"
        >
        {/* 카드 */}
        <div className="w-[320px] mt-8 rounded-2xl bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.04)] px-5 py-8">
            <div className="text-center mb-5">
            <div className="text-[18px] font-bold text-[#111]">너무 잘 하셨어요!</div>
            <div className="text-[18px] font-bold">
                <span className="text-[#FFC845]">정답과 오답</span>을 확인해보세요
            </div>
            </div>
            <div className="mt-2 mb-[30px] h-px bg-[#F0F0F0]" />

            {/* 요약 */}
            <div className="space-y-3 mb-[67px]">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                <img src="/src/assets/check_icon.png" alt="닫기" className="w-6 h-6" />
                <span className="text-[16px] font-bold text-[#111]">정답</span>
                </div>
                <span className="text-[16px] font-bold text-[#111]">2개</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                <img src="/src/assets/warning_icon.png" alt="닫기" className="w-6 h-6" />
                <span className="text-[16px] font-bold text-[#111]">오답</span>
                </div>
                <span className="text-[16px] text-[#111] font-bold">1개</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                <img src="/src/assets/time_icon.png" alt="닫기" className="w-6 h-6" />
                <span className="text-[16px] font-bold text-[#111]">소요시간</span>
                </div>
                <span className="text-[16px] font-bold text-[#111]">5분 17초</span>
            </div>
            </div>

            {/* 상세 표 */}
            <div className="rounded-lg bg-[#F6F5F4] px-[9px] py-[16px]">
            <div className="grid grid-cols-[1.2fr,0.8fr,1fr,0.8fr] text-[13px] font-medium text-[#000000]">
                <div>메뉴명</div>
                <div className="text-center">메뉴 선택</div>
                <div className="text-center">사이즈 선택</div>
                <div className="text-end">수량 선택</div>
            </div>
            <div className="grid grid-cols-[1.2fr,0.8fr,0.9fr,0.9fr] items-center text-[12px] font-normal pt-3">
                <div className="truncate text-[#000000]">레몬아메리카노</div>
                <div className="grid place-items-center">
                <img src="/src/assets/check_icon.png" alt="닫기" className="w-5 h-5" />
                </div>
                <div className="grid place-items-center">
                <img src="/src/assets/warning_icon.png" alt="닫기" className="w-5 h-5" />
                </div>
                <div className="grid place-items-center ml-3">
                <img src="/src/assets/check_icon.png" alt="닫기" className="w-5 h-5" />
                </div>
            </div>
            </div>
        </div>

        {/* 하단 버튼 */}
        <button
            onClick={() => setPage('kiosk')}
            className="mt-[173px] w-[320px] h-[52px] rounded-full bg-[#FFC845] text-black text-[16px] font-semibold"
        >
            오답 풀기
        </button>
        </motion.div>
    )}
    </AnimatePresence>

      {/* 완료 화면 */}
      <AnimatePresence>
        {page === 'complete' && (
          <motion.div
            className="absolute inset-0 flex flex-col w-full h-screen items-center justify-center z-20"
            style={{ background: 'linear-gradient(180deg, #FFEFC8 0%, #F3F3F3 100%)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div
              className="w-[240px] h-[240px] mt-28"
              style={{
                backgroundImage: 'url(/src/assets/character/5.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <h3 className="text-xl mb-6 text-center text-black font-semibold leading-[140%]">
              리터치 학습이 마무리되었어요
            </h3>
            <p className="text-base mb-20 text-center text-black font-medium leading-[160%]">
              다시 풀기 버튼을 누르면,<br />
              문제를 다시 풀어볼 수 있어요
            </p>
            <div className="flex items-center justify-center mt-20 gap-2">
              <button
                onClick={() => navigate('/teachmap')}
                className="w-[159px] h-[52px] py-4 bg-[#F6F6F6] text-black rounded-full hover:scale-105 transition-all duration-300"
              >
                다시 풀기
              </button>
              <button
                onClick={() => setPage('intro')}
                className="w-[159px] h-[52px] py-4 bg-[#FFC845] text-black rounded-full hover:scale-105 transition-all duration-300"
              >
                나가기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Retouch;

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HeaderBar from '../../components/HeaderBar';
import KioskFrame, { type Category, type KioskItem } from '../kiosk/learn-menu/KioskFrame';
import { itemsByCategory } from '../kiosk/learn-menu/KioskItems';
import { fetchRetouchTest, submitRetouchResult, type RetouchResult, type ProductResult, type RetouchTestProduct } from '../../shared/api/retouch';

type IntroPhase = 'bg1' | 'modal' | 'bg2';

type CartItem = {
  productId?: number;
  name: string;
  price: number;
  qty: number;
  size?: 'S' | 'M' | 'L';
  productOptions?: { optionName: string; optionValue: string }[];
};

function evalFlags(p?: ProductResult) {
  if (!p) return { menuOk: false, sizeOk: false, qtyOk: false };

  // 명세서 기준 status: "정답" | "옵션 틀림" | "수량 틀림" | "추가 상품" | "목록에서 빠짐"
  const s = (p.status || '').trim();
  switch (s) {
    case '정답':         return { menuOk: true,  sizeOk: true,  qtyOk: true  };
    case '옵션 틀림':     return { menuOk: true,  sizeOk: false, qtyOk: true  };
    case '수량 틀림':     return { menuOk: true,  sizeOk: true,  qtyOk: false };
    case '추가 상품':     return { menuOk: false, sizeOk: false, qtyOk: false };
    case '목록에서 빠짐': return { menuOk: false, sizeOk: false, qtyOk: false };
    default:
      return {
        menuOk: !!p.correct,
        sizeOk: !!p.correct,
        qtyOk: (p.submittedQuantity ?? NaN) === (p.correctQuantity ?? NaN),
      };
  }
}

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

  const [resultData, setResultData] = useState<RetouchResult | null>(null);
  const [testTitle, setTestTitle] = useState<string>('');
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const TEST_ID = 1;
  const [testId, setTestId] = useState<number | null>(null);
  const [expectedProducts, setExpectedProducts] = useState<RetouchTestProduct[]>([]);
  const [startTs, setStartTs] = useState<number | null>(null);

  // 리트라이 모드(오답 풀기에서 들어왔는지)
  const [isRetry, setIsRetry] = useState<boolean>(false);

  // 오답 리트라이에서 사이즈 미리선택 하이라이트를 끌지 여부
  const [sizePreselectEnabled, setSizePreselectEnabled] = useState<boolean>(true);

  const handleIntroBgClick = () => {
    if (introPhase === 'bg1') {
      setIntroPhase('modal');
    } else if (introPhase === 'bg2') {
      if (!startTs) setStartTs(Date.now());
      setPage('kiosk');
    }
  };

  const handlePay = async () => {
    if (bottomTotals.qty === 0) return;
    if (!testId) {
      console.warn('testId가 없습니다. 테스트를 먼저 불러오세요.');
      return;
    }

    // 경과시간(초) 계산: 시작 시각 없으면 0
    const durationSec =
      startTs ? Math.max(0, Math.round((Date.now() - startTs) / 1000)) : 0;

    const submittedProducts = cart.map((ci) => ({
      productId: ci.productId,
      productName: ci.name,
      quantity: ci.qty,
      productOptions: ci.size
        ? [{ optionName: '사이즈', optionValue: ci.size }]
        : undefined,
    }));

    try {
      const data = await submitRetouchResult({
        testId,
        duration: durationSec,
        submittedProducts,
      });

      setResultData({ ...data, duration: durationSec });

      // 리트라이 모드면 바로 학습완료로 이동(주문내역확인 스킵)
      if (isRetry) {
        setPage('complete');
        setIsRetry(false);
      } else {
        setPage('review');
      }
    } catch (err) {
      console.error(err);
    }
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
        setSizePreselectEnabled(true);
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

    // 이름 정규화: "아이스 " 접두사 제거
    const normalizedName = pendingModalItem.name.replace(/^아이스\s*/, '');

    // expectedProducts에서 productId/옵션 힌트 가져오기(이름 기준)
    const matchedExp = expectedProducts.find(
      (p) => p.productName === normalizedName
    );

    const opts: CartItem['productOptions'] = [];
    if (modalSize) {
      opts.push({ optionName: '사이즈', optionValue: modalSize });
    }

    addToCart({
      productId: matchedExp?.id,
      name: normalizedName,
      price: pendingModalItem.price ?? 0,
      qty: modalQty,
      size: modalSize,
      productOptions: opts,
    });

    setPendingModalItem(null);
    window.setTimeout(() => setHighlightName(null), 600);
  };

  // 주문하기 클릭 시 동작
  const goOrder = () => {
    if (totals.qty === 0) return;
    // 리트라이 모드에서는 주문내역확인 화면을 건너뛰고 바로 제출 → 학습완료로
    if (isRetry) {
      handlePay();
    } else {
      setPage('orderSheet');
    }
  };

  // 주문서에서 수량 조절/삭제
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

  // 결과 요약 계산
  const productResults = resultData?.productResults ?? [];
  const correctCount = productResults.filter(p => p.correct).length;
  const wrongCount = productResults.length > 0 ? productResults.length - correctCount : 0;

  // 소요시간 포맷 (초 → "m분 ss초")
  const fmtDuration = (sec: number | undefined) => {
    if (!sec && sec !== 0) return '-';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}분 ${s.toString().padStart(2, '0')}초`;
  };

  // 단계별 뒤로가기
  const goBack = () => {
    if (page === 'orderSheet') {
      setPage('kiosk');
    } else if (page === 'kiosk') {
      setPage('kioskIntro');
    }
  };

  useEffect(() => {
    if (page !== 'kioskIntro') return;
    let mounted = true;
    (async () => {
      try {
        setTestLoading(true);
        setTestError(null);
        const data = await fetchRetouchTest(TEST_ID);
        if (!mounted) return;
        setTestTitle(data?.title ?? '');
        setTestId(data?.id ?? null); 
        setExpectedProducts(data?.testOrder?.products ?? []);
      } catch (e) {
        if (!mounted) return;
        setTestError('주문 목록을 불러오지 못했어요.');
      } finally {
        if (!mounted) return;
        setTestLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [page]);

  // 이름으로 키오스크 아이템 찾기(음료/커피 중심)
  function findKioskItemByName(name: string): KioskItem | null {
    const normalized = name.replace(/^아이스\s*/, '');
    const coffee = (itemsByCategory?.커피 ?? []).find(i => i.name.replace(/^아이스\s*/, '') === normalized);
    if (coffee) return coffee;
    const drink = (itemsByCategory?.음료 ?? []).find(i => i.name.replace(/^아이스\s*/, '') === normalized);
    if (drink) return drink;
    for (const arr of Object.values(itemsByCategory ?? {})) {
      const list = Array.isArray(arr) ? arr : [];
      const f = list.find(i => i.name.replace(/^아이스\s*/, '') === normalized);
      if (f) return f;
    }
    return null;
  }

  // 오답 풀기 클릭 핸들러
  const handleRetryWrong = () => {
    if (!resultData) { setPage('kiosk'); return; }

    // 첫 번째로 '완전히 정답이 아닌' 문제
    const firstWrong = expectedProducts.find((exp) => {
      const matched = (resultData.productResults ?? []).find(r => r.productName === exp.productName);
      const { menuOk, sizeOk, qtyOk } = evalFlags(matched);
      return !(menuOk && sizeOk && qtyOk);
    });

    // 리트라이 모드 진입 + 장바구니/합계 초기화
    setIsRetry(true);
    setCart([]); // ✅ 장바구니 리셋 → 총수량/합계 초기화

    // 오답이 없으면 그냥 키오스크로
    if (!firstWrong) { setPage('kiosk'); return; }

    const matched = (resultData.productResults ?? []).find(r => r.productName === firstWrong.productName);
    const { menuOk, sizeOk, qtyOk } = evalFlags(matched);

    // 먼저 키오스크 페이지로 이동
    setPage('kiosk');

    // 다음 프레임에 모달 오픈(화면 전환 후)
    setTimeout(() => {
      if (!menuOk) {
        // 메뉴 선택 오답 → 모달 띄우지 않음
        setPendingModalItem(null);
        return;
      }

      // 메뉴는 맞음 → 해당 메뉴 모달 자동 오픈
      const item = findKioskItemByName(firstWrong.productName);
      if (!item) {
        setPendingModalItem(null);
        return;
      }

      // 수량: 맞았으면 정답 수량, 틀리면 1
      const correctQty = firstWrong.quantity ?? 1;
      const qty = qtyOk ? correctQty : 1;

      // 사이즈: 맞았으면 정답, 틀리면 하이라이트 끔
      const expSize = firstWrong.productOptions?.find(o => o.optionName === '사이즈')?.optionValue as ('S'|'M'|'L'|undefined);
      let size: 'S'|'M'|'L' = (expSize ?? 'S') as any;

      setPendingModalItem(item);
      setModalQty(qty);

      if (sizeOk && expSize) {
        setModalSize(expSize as 'S'|'M'|'L');
        setSizePreselectEnabled(true);
      } else {
        setModalSize(size);
        setSizePreselectEnabled(false);
      }
    }, 0);
  };

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
                    {testLoading && <li>• 불러오는 중...</li>}
                    {testError && <li>• {testError}</li>}
                    {!testLoading && !testError && (
                      <li>• {testTitle || '주문 목록이 없습니다.'}</li>
                    )}
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
            onClickOrder={goOrder}
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
                          className="w-5 h-5 rounded-full bg-[#444] text-white text-[12px] grid place-items_center"
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
                <button 
                  className="flex-1 h-[34px] rounded-[32px] bg-white text-black text-[14px] font-medium"
                  onClick={goBack}
                >
                  이전
                </button>
                <button
                  className="flex-[1] h-[34px] rounded-[32px] bg-[#FFC845] text-black text-[14px] font-medium"
                  onClick={handlePay} 
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
            <h3 className="text-xl mb-6 text-center text_black font-semibold leading-[140%]">
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
              {/* 상단 안내 */}
              {wrongCount === 0 ? (
                <div className="text-center mb-5">
                  <div className="text-[18px] font-bold text-[#111]">
                    우와!<br />
                    모든 문제를 다 맞추셨어요
                  </div>
                </div>
              ) : (
                <div className="text-center mb-5">
                  <div className="text-[18px] font-bold text-[#111]">너무 잘 하셨어요!</div>
                  <div className="text-[18px] font-bold">
                    <span className="text-[#FFC845]">정답과 오답을 확인</span>해보세요
                  </div>
                </div>
              )}

              <div className="mt-2 mb-[30px] h-px bg-[#F0F0F0]" />

              {/* 요약 */}
              <div className="space-y-3 mb_[67px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="/src/assets/check_icon.png" alt="정답" className="w-6 h-6" />
                    <span className="text-[16px] font-bold text-[#111]">정답</span>
                  </div>
                  <span className="text-[16px] font-bold text-[#111]">
                    {correctCount}개
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="/src/assets/warning_icon.png" alt="오답" className="w-6 h-6" />
                    <span className="text-[16px] font-bold text-[#111]">오답</span>
                  </div>
                  <span className="text-[16px] text-[#111] font-bold">
                    {wrongCount}개
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="/src/assets/time_icon.png" alt="소요시간" className="w-6 h-6" />
                    <span className="text-[16px] font-bold text-[#111]">소요시간</span>
                  </div>
                  <span className="text-[16px] font-bold text-[#111]">
                    {fmtDuration(resultData?.duration)}
                  </span>
                </div>
              </div>

              {/* 상세 표 */}
              <div className="rounded-lg bg-[#F6F5F4] px-[9px] py-[16px] mt-[67px]">
                <div className="grid grid-cols-[1.2fr,0.8fr,1fr,0.8fr] text-[13px] font-medium text-[#000000]">
                  <div>메뉴명</div>
                  <div className="text-center">메뉴 선택</div>
                  <div className="text-center">사이즈 선택</div>
                  <div className="text-end">수량 선택</div>
                </div>

                {expectedProducts.length === 0 ? (
                  <div className="text-center text-[#777] py-4 text-[12px]">
                    표시할 결과가 없습니다.
                  </div>
                ) : (
                  <>
                    {expectedProducts.map((exp, i) => {
                      const matched: ProductResult | undefined =
                        (resultData?.productResults ?? []).find(r => r.productName === exp.productName);

                      const { menuOk, sizeOk, qtyOk } = evalFlags(matched);

                      return (
                        <div
                          key={`exp-${exp.productName}-${i}`}
                          className="grid grid-cols-[1.2fr,0.8fr,0.9fr,0.9fr] items-center text-[12px] font-normal pt-3"
                        >
                          {/* 메뉴명은 항상 ‘요구한 메뉴명’ */}
                          <div className="truncate text-[#000000]">{exp.productName}</div>

                          {/* 메뉴 선택 */}
                          <div className="grid place-items-center">
                            <img
                              src={menuOk ? '/src/assets/check_icon.png' : '/src/assets/warning_icon.png'}
                              alt={menuOk ? '정답' : '오답'}
                              className="w-5 h-5"
                            />
                          </div>

                          {/* 사이즈 선택 */}
                          <div className="grid place-items-center">
                            <img
                              src={sizeOk ? '/src/assets/check_icon.png' : '/src/assets/warning_icon.png'}
                              alt={sizeOk ? '정답' : '오답'}
                              className="w-5 h-5"
                            />
                          </div>

                          {/* 수량 선택 */}
                          <div className="grid place-items-center ml-3">
                            <img
                              src={qtyOk ? '/src/assets/check_icon.png' : '/src/assets/warning_icon.png'}
                              alt={qtyOk ? '정답' : '오답'}
                              className="w-5 h-5"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            {/* 하단 버튼 */}
            {wrongCount === 0 ? (
              <button
                onClick={() => setPage('complete')}
                className="mt-[173px] w-[320px] h-[52px] rounded-full bg-[#FFC845] text-black text-[16px] font-semibold"
              >
                다음
              </button>
            ) : (
              <button
                onClick={handleRetryWrong}
                className="mt-[173px] w-[320px] h-[52px] rounded-full bg-[#FFC845] text-black text-[16px] font-semibold"
              >
                오답 풀기
              </button>
            )}
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
                className="w-[159px] h-[52px] py-4 bg-[#F6F6F6] border border-[#FFC845] text-black rounded-full hover:scale-105 transition-all duration-300"
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

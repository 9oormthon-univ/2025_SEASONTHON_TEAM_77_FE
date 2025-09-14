import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import HeaderBar from '../../components/HeaderBar';
import KioskFrame, { type Category, type KioskItem } from '../kiosk/learn-menu/KioskFrame';
import { itemsByCategory } from '../kiosk/learn-menu/KioskItems';
import {
  fetchRetouchTest,
  submitRetouchResult,
  type RetouchResult,
  type RetouchTestProduct,
  type RetouchTestProductOption,
  type SubmittedProduct,
  type ProductResult,
} from '../../shared/api/retouch';

import { findKioskItemByName } from './retouchUtils';
import IntroScreen from '../../components/common/IntroScreen';
import KioskIntro from '../retouch/components/KioskIntro';
import ReviewSplash from '../retouch/components/ReviewSplash';
import WrongCheck from '../retouch/components/WrongCheck';
import CompleteScreen from '../../components/common/CompleteScreen';
import OrderSheet from '../retouch/components/OrderSheet';
import OptionModal from '../retouch/components/OptionModal';
import MenuButton from '../retouch/components/MenuButton';

type IntroPhase = 'bg1' | 'modal' | 'bg2' | 'select';

type CartItem = {
  name: string;
  price: number;
  qty: number;
  size?: 'S' | 'M' | 'L';
  productOptions?: { optionName: string; optionValue: string }[];
};

// “아이스 ” 접두사만 제거
const normalizeName = (name: string) => name.replace(/^아이스\s*/, '').trim();

// 옵션 중복 제거(같은 optionName이면 마지막 값 우선)
const mergeAndDedupeOptions = (
  base: RetouchTestProductOption[] = [],
  extra: RetouchTestProductOption[] = []
): RetouchTestProductOption[] => {
  const byName = new Map<string, string>();
  [...base, ...extra].forEach((o) => byName.set(o.optionName, o.optionValue));
  return Array.from(byName.entries()).map(([optionName, optionValue]) => ({ optionName, optionValue }));
};

// 서버 detailedResult에서 안전하게 플래그 추출
const pickFlags = (r?: ProductResult) => ({
  menuOk: r?.detailedResult?.menuSelection ?? false,
  sizeOk: r?.detailedResult?.sizeSelection ?? false,
  qtyOk:  r?.detailedResult?.quantitySelection ?? false,
});

const Retouch: React.FC = () => {
  const [page, setPage] = useState<'intro' | 'kioskIntro' | 'kiosk' | 'orderSheet' | 'review' | 'wrongCheck' | 'complete'>('intro');
  const [introPhase, setIntroPhase] = useState<IntroPhase>('bg1');

  const [highlightName, setHighlightName] = useState<string | null>(null);
  const [pendingModalItem, setPendingModalItem] = useState<KioskItem | null>(null);
  const modalTimerRef = useRef<number | null>(null);

  const [modalSize, setModalSize] = useState<'S' | 'M' | 'L'>('S');
  const [modalQty, setModalQty] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<'매장' | '포장' | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);

  const [resultData, setResultData] = useState<RetouchResult | null>(null);
  const [testTitle, setTestTitle] = useState<string>('');
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [testId, setTestId] = useState<number | null>(null);
  const [expectedProducts, setExpectedProducts] = useState<RetouchTestProduct[]>([]);
  const [startTs, setStartTs] = useState<number | null>(null);

  const [isRetry, setIsRetry] = useState<boolean>(false);
  const [sizePreselectEnabled, setSizePreselectEnabled] = useState<boolean>(true);
  const navigate = useNavigate();

  // URL에서 ?testId= 파라미터 읽기 (없으면 1)
  const initialTestId = (() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const tid = sp.get('testId');
      return tid ? Number(tid) : 1;
    } catch {
      return 1;
    }
  })();

  // kioskIntro 입장 시 페이즈 초기화 & 타이머 정리
  useEffect(() => {
    if (page === 'kioskIntro') setIntroPhase('bg1');
    return () => {
      if (modalTimerRef.current) {
        window.clearTimeout(modalTimerRef.current);
        modalTimerRef.current = null;
      }
    };
  }, [page]);

  const totals = useMemo(() => {
    let qty = 0, sum = 0;
    for (const it of cart) {
      qty += it.qty;
      sum += (it.price ?? 0) * it.qty;
    }
    return { qty, sum };
  }, [cart]);

  const bottomTotals = totals;

  const handleSelectAndProceed = (opt: '매장' | '포장') => {
    setSelectedOption(opt);
    setTimeout(() => {
      if (!startTs) setStartTs(Date.now());
      setPage('kiosk');
    }, 400);
  };

  const handleIntroBgClick = () => {
    if (introPhase === 'bg1') setIntroPhase('modal');
    else if (introPhase === 'bg2') setIntroPhase('select');
  };

  const handleSelectItem = (item: KioskItem, category: Category) => {
    setHighlightName(item.name);
    if (category === '커피' || category === '음료') {
      if (modalTimerRef.current) window.clearTimeout(modalTimerRef.current);
      modalTimerRef.current = window.setTimeout(() => {
        setPendingModalItem(item);
        setModalSize('S');
        setModalQty(1);
        setSizePreselectEnabled(true);
      }, 200); // ⬅️ as unknown as number 제거
    } else {
      // 즉시 담는 메뉴: 이름 최소 정규화 후 담기
      addToCart({
        name: normalizeName(item.name),
        price: item.price ?? 0,
        qty: 1,
        productOptions: [],
      });
      window.setTimeout(() => setHighlightName(null), 800);
    }
  };

  const addToCart = (ci: CartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.name === ci.name && (p.size ?? '') === (ci.size ?? ''));
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
    const normalizedName = normalizeName(pendingModalItem.name);

    const opts: CartItem['productOptions'] = [];
    if (modalSize) {
      opts.push({ optionName: '사이즈', optionValue: modalSize });
    }

    addToCart({
      name: normalizedName,
      price: pendingModalItem.price ?? 0,
      qty: modalQty,
      size: modalSize,
      productOptions: opts,
    });

    setPendingModalItem(null);
    window.setTimeout(() => setHighlightName(null), 600);
  };

  const changeQty = (idx: number, delta: number) => {
    setCart((prev) => {
      const copy = [...prev];
      const next = Math.max(1, copy[idx].qty + delta);
      copy[idx] = { ...copy[idx], qty: next };
      return copy;
    });
  };

  const removeItem = (idx: number) => setCart((prev) => prev.filter((_, i) => i !== idx));

  const goBack = () => {
    if (page === 'orderSheet') setPage('kiosk');
    else if (page === 'kiosk') setPage('kioskIntro');
  };

  // 리뷰 → 2초 후 오답확인
  useEffect(() => {
    if (page !== 'review') return;
    const t = window.setTimeout(() => setPage('wrongCheck'), 2000);
    return () => window.clearTimeout(t);
  }, [page]);

  // 테스트 데이터 로드 (URL의 testId로 호출)
  useEffect(() => {
    if (page !== 'kioskIntro') return;
    let mounted = true;
    (async () => {
      try {
        setTestLoading(true);
        setTestError(null);
        const data = await fetchRetouchTest(initialTestId);
        if (!mounted) return;
        setTestTitle(data?.title ?? '');
        setTestId(data?.id ?? null); // 서버가 내려준 진짜 문제 id 저장
        setExpectedProducts(data?.testOrder?.products ?? []);
      } catch {
        if (!mounted) return;
        setTestError('주문 목록을 불러오지 못했어요.');
      } finally {
        if (!mounted) return;
        setTestLoading(false);
      }
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // 결제(제출)
  const handlePay = async () => {
    if (bottomTotals.qty === 0 || !testId) return;

    const durationSec = startTs ? Math.max(0, Math.round((Date.now() - startTs) / 1000)) : 0;

    // 정답 목록을 이름 기준으로 매핑(정확 일치 우선)
    const byName = new Map(expectedProducts.map((p) => [p.productName, p]));

    // 제출 직전 매핑: productId 부여 + 옵션 중복 제거/보강
    const submittedProducts: SubmittedProduct[] = cart.map((ci) => {
      const normalized = normalizeName(ci.name);
      const matched = byName.get(ci.name) ?? byName.get(normalized);

      // 옵션 합치기: (카트 옵션 + size prop) → 중복 제거 → 온도 기본값 보강
      const sizeOpt: RetouchTestProductOption[] = ci.size
        ? [{ optionName: '사이즈', optionValue: ci.size }]
        : [];
      const merged = mergeAndDedupeOptions(ci.productOptions ?? [], sizeOpt);

      // 온도 필수 보강 (없으면 ICED)
      const hasTemp = merged.some((o) => o.optionName === '온도');
      const finalOptions = hasTemp ? merged : mergeAndDedupeOptions(merged, [{ optionName: '온도', optionValue: 'ICED' }]);

      const base: SubmittedProduct = {
        productName: matched ? matched.productName : normalized,
        quantity: ci.qty,
        productOptions: finalOptions,
      };

      return matched ? { ...base, productId: matched.id } : base;
    });

    // 개발 중에만 디버그
    if (import.meta.env.DEV) {
      console.groupCollapsed('[SUBMIT DEBUG]');
      console.log('testId (from GET):', testId);
      console.table(
        expectedProducts.map((p) => ({
          expId: p.id,
          expName: p.productName,
          expQty: p.quantity,
          expOpts: JSON.stringify(p.productOptions ?? []),
        }))
      );
      console.table(
        submittedProducts.map((s) => ({
          subId: (s as any).productId ?? '(none)',
          subName: s.productName,
          subQty: s.quantity,
          subOpts: JSON.stringify(s.productOptions),
        }))
      );
      console.groupEnd();
    }

    try {
      const data = await submitRetouchResult({ testId, duration: durationSec, submittedProducts });

      if (import.meta.env.DEV) {
        console.table((data.productResults ?? []).map(r => ({
          name: r.productName,
          correctQty: r.correctQuantity,
          submittedQty: r.submittedQuantity,
          menuOk: r.detailedResult?.menuSelection,
          sizeOk: r.detailedResult?.sizeSelection,
          qtyOk:  r.detailedResult?.quantitySelection,
          status: r.status,
        })));
      }

      // 서버 duration을 쓸지, 클라 계산을 쓸지 선택 가능
      setResultData({ ...data, duration: durationSec });

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

  // 오답 풀기
  const handleRetryWrong = () => {
    if (!resultData) { setPage('kiosk'); return; }

    const firstWrong = expectedProducts.find((exp) => {
      const matched = (resultData.productResults ?? []).find((r) => r.productName === exp.productName);
      const { menuOk, sizeOk, qtyOk } = pickFlags(matched);
      return !(menuOk && sizeOk && qtyOk);
    });

    setIsRetry(true);
    setCart([]);

    if (!firstWrong) { setPage('kiosk'); return; }

    const matched = (resultData.productResults ?? []).find((r) => r.productName === firstWrong.productName);
    const { menuOk, sizeOk, qtyOk } = pickFlags(matched);

    setPage('kiosk');

    setTimeout(() => {
      if (!menuOk) { setPendingModalItem(null); return; }

      const item = findKioskItemByName(firstWrong.productName);
      if (!item) { setPendingModalItem(null); return; }

      const correctQty = (firstWrong as any).quantity ?? 1;
      const qty = qtyOk ? correctQty : 1;

      const expSize = firstWrong.productOptions?.find((o) => o.optionName === '사이즈')?.optionValue as ('S'|'M'|'L'|undefined);
      const size: 'S'|'M'|'L' = (expSize ?? 'S') as any;

      setPendingModalItem(item);
      setModalQty(qty);

      if (sizeOk && expSize) {
        setModalSize(expSize);
        setSizePreselectEnabled(true);
      } else {
        setModalSize(size);
        setSizePreselectEnabled(false);
      }
    }, 0);
  };

  return (
    <div className="relative w-full h-screen">
      <HeaderBar title="리터치" backTo="/" />

      {/* 메뉴보기 버튼: kioskIntro~orderSheet 구간에서만 보이게 */}
      {(
        (page === 'kioskIntro' && (introPhase === 'bg2' || introPhase === 'select')) ||
        page === 'kiosk' ||
        page === 'orderSheet'
      ) && (
        <MenuButton onClick={() => setIntroPhase('modal')} />
      )}

      <AnimatePresence>
        {page === 'intro' && (
          <IntroScreen
            title={'주어진 주문서 대로<br/>키오스크에서 주문해주세요'}
            subtitle="화면을 터치하면 학습이 시작돼요"
            onStart={() => setPage('kioskIntro')}
          />
        )}
      </AnimatePresence>

      {/* 키오스크 도입부 */}
      {page === 'kioskIntro' && (
        <KioskIntro
          totals={totals}
          introPhase={introPhase}
          setIntroPhase={setIntroPhase}
          testTitle={testTitle}
          testLoading={testLoading}
          testError={testError}
          selectedOption={selectedOption}
          onSelectProceed={handleSelectAndProceed}
          onBgClick={handleIntroBgClick}
        />
      )}

      {/* 실제 키오스크 */}
      {page === 'kiosk' && (
        <>
          <KioskFrame
            itemsByCategory={itemsByCategory}
            disableTabClicks={false}
            onSelectItem={handleSelectItem}
            highlightItemIncludes={highlightName}
            forcedTotals={totals}
            onClickOrder={() => {
              if (totals.qty === 0) return;
              isRetry ? handlePay() : setPage('orderSheet');
            }}
          />
          <OptionModal
            item={pendingModalItem}
            modalSize={modalSize}
            setModalSize={setModalSize}
            sizePreselectEnabled={sizePreselectEnabled}
            setSizePreselectEnabled={setSizePreselectEnabled}
            modalQty={modalQty}
            setModalQty={setModalQty}
            onCancel={cancelOptionModal}
            onConfirm={confirmOptionModal}
          />
        </>
      )}

      {/* 주문서 */}
      {page === 'orderSheet' && (
        <OrderSheet
          cart={cart}
          bottomTotals={bottomTotals}
          changeQty={changeQty}
          removeItem={removeItem}
          goBack={goBack}
          handlePay={handlePay}
        />
      )}

      {/* 주문 완료 스플래시 → 2초 후 오답확인 */}
      <AnimatePresence>{page === 'review' && <ReviewSplash />}</AnimatePresence>

      {/* 오답 확인 */}
      <AnimatePresence>
        {page === 'wrongCheck' && (
          <WrongCheck
            expectedProducts={expectedProducts}
            resultData={resultData}
            onRetryWrong={handleRetryWrong}
            onGoComplete={() => setPage('complete')}
          />
        )}
      </AnimatePresence>

      {/* 완료 */}
      <AnimatePresence>
        {page === 'complete' && (
          <CompleteScreen
            title={'리터치 학습이<br/>마무리되었어요'}
            subtitle={'다시 풀기 버튼을 누르면,<br/>문제를 다시 풀어볼 수 있어요'}
            onRestart={() => navigate('/teachmap')}
            onNext={() => navigate('/')}
            restartLabel="다시 풀기"
            nextLabel="나가기"
            characterImage="/src/assets/character/5.png"
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {introPhase === 'modal' && (
          <>
            <motion.div
              className="fixed inset-0 bg-[rgba(17,17,17,0.80)] z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
  </div>
  );
};

export default Retouch;

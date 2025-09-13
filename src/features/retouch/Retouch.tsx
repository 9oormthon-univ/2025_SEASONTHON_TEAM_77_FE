import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
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
} from '../../shared/api/retouch';

import { evalFlags, findKioskItemByName } from './retouchUtils';
import IntroTouchScreen from '../retouch/components/IntroTouchScreen';
import KioskIntro from '../retouch/components/KioskIntro';
import ReviewSplash from '../retouch/components/ReviewSplash';
import WrongCheck from '../retouch/components/WrongCheck';
import CompleteScreen from '../retouch/components/CompleteScreen';
import OrderSheet from '../retouch/components/OrderSheet';
import OptionModal from '../retouch/components/OptionModal';

type IntroPhase = 'bg1' | 'modal' | 'bg2' | 'select';

type CartItem = {
  // 제출 직전에 정답 목록과 매칭해서 productId를 붙일 거라 optional
  productId?: number;
  name: string;
  price: number;
  qty: number;
  size?: 'S' | 'M' | 'L';
  productOptions?: { optionName: string; optionValue: string }[];
};

// “아이스 ” 접두사만 제거 (너가 말한 대로 정규화 문제는 아니라서 최소한만)
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
    let qty = 0,
      sum = 0;
    for (const it of cart) {
      qty += it.qty;
      sum += (it.price ?? 0) * it.qty;
    }
    return { qty, sum };
  }, [cart]);
  const bottomTotals = totals;

  const handleIntroBgClick = () => {
    if (introPhase === 'bg1') setIntroPhase('modal');
    else if (introPhase === 'bg2') setIntroPhase('select');
  };

  const handleSelectAndProceed = (opt: '매장' | '포장') => {
    setSelectedOption(opt);
    setTimeout(() => {
      if (!startTs) setStartTs(Date.now());
      setPage('kiosk');
    }, 400);
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
      }, 200) as unknown as number;
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

  const goOrder = () => {
    if (totals.qty === 0) return;
    if (isRetry) {
      handlePay();
    } else {
      setPage('orderSheet');
    }
  };

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
    return () => {
      mounted = false;
    };
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
      const matched =
        byName.get(ci.name) || // 정확히 같은 이름 우선
        byName.get(normalized); // 접두사 제거로도 시도(안전용)

      // 옵션 합치기: (카트 옵션 + size prop) → 중복 제거 → 온도 기본값 보강
      const sizeOpt: RetouchTestProductOption[] = ci.size
        ? [{ optionName: '사이즈', optionValue: ci.size }]
        : [];
      const merged = mergeAndDedupeOptions(ci.productOptions ?? [], sizeOpt);

      // 온도 필수 보강 (없으면 ICED)
      const hasTemp = merged.some((o) => o.optionName === '온도');
      const finalOptions = hasTemp ? merged : mergeAndDedupeOptions(merged, [{ optionName: '온도', optionValue: 'ICED' }]);

      const base: SubmittedProduct = {
        productName: matched ? matched.productName : normalized, // 서버 기준 명칭으로 맞춰주면 가독성↑
        quantity: ci.qty,
        productOptions: finalOptions,
      };

      return matched ? { ...base, productId: matched.id } : base; // 정답에 있는 상품이면 id 포함
    });

    // 🔎 제출 전 콘솔 디버그 (필요 없으면 지워도 됨)
    try {
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
    } catch {}

    try {
      const data = await submitRetouchResult({ testId, duration: durationSec, submittedProducts });
      // handlePay try { ... } 안에서, setResultData 전에:
      console.table((data.productResults ?? []).map(r => ({
        name: r.productName,
        correctQty: r.correctQuantity,
        submittedQty: r.submittedQuantity,
        menuOk: r.detailedResult?.menuSelection,
        sizeOk: r.detailedResult?.sizeSelection,
        qtyOk:  r.detailedResult?.quantitySelection,
        status: r.status,
      })));

      // 서버 채점 duration을 그대로 쓰고 싶으면 data.duration, 아니면 클라이언트 계산값 사용
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
    if (!resultData) {
      setPage('kiosk');
      return;
    }

    const firstWrong = expectedProducts.find((exp) => {
      const matched = (resultData.productResults ?? []).find((r) => r.productName === exp.productName);
      const { menuOk, sizeOk, qtyOk } = evalFlags(matched);
      return !(menuOk && sizeOk && qtyOk);
    });

    setIsRetry(true);
    setCart([]);

    if (!firstWrong) {
      setPage('kiosk');
      return;
    }

    const matched = (resultData.productResults ?? []).find((r) => r.productName === firstWrong.productName);
    const { menuOk, sizeOk, qtyOk } = evalFlags(matched);

    setPage('kiosk');

    setTimeout(() => {
      if (!menuOk) {
        setPendingModalItem(null);
        return;
      }

      const item = findKioskItemByName(firstWrong.productName);
      if (!item) {
        setPendingModalItem(null);
        return;
      }

      const correctQty = (firstWrong as any).quantity ?? 1;
      const qty = qtyOk ? correctQty : 1;

      const expSize = firstWrong.productOptions?.find((o) => o.optionName === '사이즈')?.optionValue as 'S' | 'M' | 'L' | undefined;
      let size: 'S' | 'M' | 'L' = (expSize ?? 'S') as any;

      setPendingModalItem(item);
      setModalQty(qty);

      if (sizeOk && expSize) {
        setModalSize(expSize as 'S' | 'M' | 'L');
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

      {/* 시작 */}
      <AnimatePresence>{page === 'intro' && <IntroTouchScreen onNext={() => setPage('kioskIntro')} />}</AnimatePresence>

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
            onClickOrder={goOrder}
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
      <AnimatePresence>{page === 'complete' && <CompleteScreen />}</AnimatePresence>
    </div>
  );
};

export default Retouch;

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import HeaderBar from '../../components/HeaderBar';
import KioskFrame, { type Category, type KioskItem } from '../kiosk/learn-menu/KioskFrame';
import { itemsByCategory } from '../kiosk/learn-menu/KioskItems';
import { fetchRetouchTest, submitRetouchResult, type RetouchResult, type RetouchTestProduct } from '../../shared/api/retouch';

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
  productId?: number;
  name: string;
  price: number;
  qty: number;
  size?: 'S' | 'M' | 'L';
  productOptions?: { optionName: string; optionValue: string }[];
};

const Retouch: React.FC = () => {
  const [page, setPage] = useState<'intro'|'kioskIntro'|'kiosk'|'orderSheet'|'review'|'wrongCheck'|'complete'>('intro');
  const [introPhase, setIntroPhase] = useState<IntroPhase>('bg1');

  const [highlightName, setHighlightName] = useState<string | null>(null);
  const [pendingModalItem, setPendingModalItem] = useState<KioskItem | null>(null);
  const modalTimerRef = useRef<number | null>(null);

  const [modalSize, setModalSize] = useState<'S'|'M'|'L'>('S');
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

    const normalizedName = pendingModalItem.name.replace(/^아이스\s*/, '');
    const matchedExp = expectedProducts.find((p) => p.productName === normalizedName);

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

  // 테스트 데이터 로드
  useEffect(() => {
    if (page !== 'kioskIntro') return;
    let mounted = true;
    (async () => {
      try {
        setTestLoading(true);
        setTestError(null);
        const data = await fetchRetouchTest(1);
        if (!mounted) return;
        setTestTitle(data?.title ?? '');
        setTestId(data?.id ?? null);
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
  }, [page]);

  // 결제(제출)
  const handlePay = async () => {
    if (bottomTotals.qty === 0 || !testId) return;

    const durationSec = startTs ? Math.max(0, Math.round((Date.now() - startTs) / 1000)) : 0;
    const submittedProducts = cart.map((ci) => ({
      productId: ci.productId,
      productName: ci.name,
      quantity: ci.qty,
      productOptions: [
        ...(ci.size ? [{ optionName: '사이즈', optionValue: ci.size }] : []),
        { optionName: '온도', optionValue: 'ICED' },
      ],
    }));

    try {
      const data = await submitRetouchResult({ testId, duration: durationSec, submittedProducts });
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
      const matched = (resultData.productResults ?? []).find(r => r.productName === exp.productName);
      const { menuOk, sizeOk, qtyOk } = evalFlags(matched);
      return !(menuOk && sizeOk && qtyOk);
    });

    setIsRetry(true);
    setCart([]);

    if (!firstWrong) { setPage('kiosk'); return; }

    const matched = (resultData.productResults ?? []).find(r => r.productName === firstWrong.productName);
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

      const correctQty = firstWrong.quantity ?? 1;
      const qty = qtyOk ? correctQty : 1;

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
      <HeaderBar title="리터치" backTo="/" />

      {/* 시작 */}
      <AnimatePresence>
        {page === 'intro' && <IntroTouchScreen onNext={() => setPage('kioskIntro')} />}
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

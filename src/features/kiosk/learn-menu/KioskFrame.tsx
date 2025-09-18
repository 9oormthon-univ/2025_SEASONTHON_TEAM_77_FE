import React, { useEffect, useMemo, useRef, useState } from 'react'

export const CATEGORIES = ['커피', '음료', '디저트', '푸드'] as const
export type Category = typeof CATEGORIES[number]

export type KioskItem = {
  productId?: number;
  name: string;
  imageUrl?: string;
  price?: number;
};

type KioskFrameProps = {
  className?: string
  children?: React.ReactNode
  forcedActiveCategory?: Category | null
  disableTabClicks?: boolean
  /** 카테고리별 아이템 목록(없으면 스켈레톤만 표시) */
  itemsByCategory?: Partial<Record<Category, KioskItem[]>>
  /** 아이템 클릭 시 부모에게 알림 */
  onSelectItem?: (item: KioskItem, category: Category) => void
  /** 특정 카드만 하이라이트(이름 포함 매칭) */
  highlightItemIncludes?: string | null
  /** 특정 아이템의 옵션 모달을 띄운 상태로 표시(이름 포함 매칭) */
  optionModalForIncludes?: string | null
  currentStepId?: string | null
  forcedTotals?: { qty: number; sum: number } | null;
  forceScroll?: 'top' | 'bottom' | null; 
  onClickOrder?: () => void
}

export default function KioskFrame({
  className,
  children,
  forcedActiveCategory = null,
  disableTabClicks = false,
  itemsByCategory,
  onSelectItem,
  highlightItemIncludes = null,
  optionModalForIncludes = null,
  currentStepId = null,
  forcedTotals = null,
  forceScroll = null,
  onClickOrder,
}: KioskFrameProps) {
  const [category, setCategory] = useState<Category>('커피')
  const listRef = useRef<HTMLDivElement>(null); 
  const activeCategory: Category = (forcedActiveCategory ?? category) as Category

  // forceScroll 힌트가 오면 스크롤 위치를 강제 적용
  useEffect(() => {
    const el = listRef.current;
    if (!el || !forceScroll) return;
    if (forceScroll === 'top') {
      el.scrollTo({ top: 0, behavior: 'auto' });
    } else if (forceScroll === 'bottom') {
      el.scrollTo({ top: el.scrollHeight, behavior: 'auto' });
    }
  }, [forceScroll, activeCategory]); // 탭이 바뀌어도 반영

  // 외부에서 카테고리를 강제 지정하면 동기화
  useEffect(() => {
    if (forcedActiveCategory) setCategory(forcedActiveCategory)
  }, [forcedActiveCategory])

  // 렌더할 목록(없으면 스켈레톤)
  const items = itemsByCategory?.[activeCategory] ?? []

  // 모달에 띄울 아이템(요청된 경우)
  const modalItem = useMemo(() => {
    if (!optionModalForIncludes) return null
    return items.find((it) => it.name.includes(optionModalForIncludes)) ?? null
  }, [items, optionModalForIncludes])

  // 그룹2의 화면 4, 5면 온도 옵션(hot/iced) 숨김
  const hideTempPills =
    !!currentStepId &&
    currentStepId.startsWith('g2-') &&
    (currentStepId.endsWith('-04') || currentStepId.endsWith('-05'));


  return (
    <div className={`absolute inset-0 w-full h-[797px] bg-[#F6F5F4] ${className ?? ''}`}>
      {/* 키오스크 화면 틀 */}
      <div className="relative flex flex-col items-center justify-center">
        <div
          className="rounded-[36px] bg-[#FFFFFF] border-2 border-[#D5D5D5] shadow-[0px_2px_4px_rgba(0,0,0,0.04)] overflow-hidden"
          style={{ marginTop: '67px', width: 319, height: 569 }}
        >
          {/* 실제 메뉴가 들어가는 영역 */}
          <div className="w-full h-full overflow-hidden">
            {children ?? (
              <div className="flex h-full flex-col">
                {/* 상단 카테고리 탭 */}
                <div className="px-[10px]">
                  <div className="flex items-center gap-3 bg-white px-3 pt-8">
                    {CATEGORIES.map((c) => {
                      const active = c === activeCategory
                      return (
                        <button
                          key={c}
                          onClick={() => {
                            if (disableTabClicks) return
                            setCategory(c)
                          }}
                          className={[
                            'text-sm transition-colors',
                            'px-[14px] py-[10px] rounded-[32px] border',
                            active
                              ? 'bg-[#FFC845] border-transparent text-[#111111]'
                              : 'bg-white border-[#ECECEC] text-[#111111]',
                            disableTabClicks ? 'cursor-default' : '',
                          ].join(' ')}
                        >
                          {c}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 스크롤 영역 */}
                <div ref={listRef} className="mt-6 flex-1 overflow-y-auto px-[22px]">
                  <div className="grid grid-cols-2 gap-[9px]">
                    {/* 아이템이 있으면 아이템 렌더, 없으면 스켈레톤 */}
                    {items.length > 0
                      ? items.map((it, i) => {
                        const highlight =
                          !!highlightItemIncludes && it.name === highlightItemIncludes
                          return (
                            <button
                              key={`${it.name}-${i}`}
                              onClick={() => onSelectItem?.(it, activeCategory)}
                              className={[
                                'rounded-[16px] p-[10px] flex flex-col items-center justify-start',
                                'bg-[#F6F5F4]',
                                highlight ? 'bg-[#FFEEC5]' : '',
                              ].join(' ')}
                            >
                              {/* 이미지/텍스트 */}
                              <div className="w-full rounded-[14px] flex items-center justify-center overflow-hidden">
                                {it.imageUrl ? (
                                  <img
                                    src={it.imageUrl}
                                    alt={it.name}
                                    className="w-[112px] h-[112px] object-cover"
                                  />
                                ) : (
                                  <span className="text-[14px] text-[#444444]">{it.name}</span>
                                )}
                              </div>
                              {/* 이름/가격 */}
                              <div className="w-full text-center">
                                <div className="text-[14px] text-[#444444]">{it.name}</div>
                                {typeof it.price === 'number' && (
                                  <div className="mt-1 text-[14px] text-[#444444]">
                                    {it.price.toLocaleString()}원
                                  </div>
                                )}
                              </div>
                            </button>
                          )
                        })
                      : Array.from({ length: 8 }).map((_, i) => (
                          <div
                            key={i}
                            className="rounded-[16px] bg-[#F6F5F4] p-[10px] flex flex-col items-center justify-start"
                          >
                            <div className="w-full aspect-[3/4] rounded-[14px] bg-white/60 flex items-center justify-center">
                              <div className="h-16 w-12 rounded bg-white shadow-inner" />
                            </div>
                            <div className="mt-2 h-10 w-4/5 rounded bg-white/60" />
                            <div className="mt-1 h-4 w-3/5 rounded bg-white/60" />
                          </div>
                        ))}
                  </div>
                </div>

                {/* 하단 합계/버튼 바 */}
                <div className="rounded-b-[34px] bg-[#444444] text-white px-4 pt-3 pb-4 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                  <div className="mb-3 flex w-full max-w-[320px] items-center justify-center text-[13px]">
                    <div className="flex flex-1 justify-between px-4">
                      <span className="opacity-90">총수량</span>
                      <span className="opacity-90">{(forcedTotals?.qty ?? 0)}개</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300 opacity-60" />
                    <div className="flex flex-1 justify-between px-4">
                      <span className="opacity-90">합계</span>
                      <span className="font-medium">{((forcedTotals?.sum ?? 0).toLocaleString())}원</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-[10px]">
                    <button className="flex-1 h-[34px] rounded-[32px] bg-white text-black text-[14px] font-medium">
                      이전
                    </button>
                    <button
                     className="flex-[1] h-[34px] rounded-[32px] bg-[#FFC845] text-black text-[14px] font-medium"
                     onClick={onClickOrder}
                    >
                      주문하기
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 옵션 모달 (요청 시 표시) */}
        {modalItem && (
          <>
            <div className="absolute mt-[67px] bg-black/30 w-[319px] h-[569px] rounded-[36px]"/>
            <div className="absolute px-[20px] py-[30px] left-1/2 top-[200px] -translate-x-1/2 w-[278px] rounded-[16px] bg-white shadow-xl">
              {/* 헤더: 제목/가격 + 닫기 */}
              <div className="relative">
                <div className="text-[20px] font-semibold text-[#000000]">
                  {modalItem.name.replace(/^아이스\s*/, '')}
                </div>
                <div className="mt-2 text-[20px] font-semibold text-[#FFC845]">
                  {(typeof modalItem.price === 'number' ? modalItem.price : 3800).toLocaleString()}원
                </div>
                <button
                  aria-label="닫기"
                  className="absolute right-0 top-0 w-6 h-6 flex items-center justify-center"
                >
                  <img
                    src="/assets/common/cancel_icon.png"
                    alt="닫기"
                    className="w-6 h-6"
                  />
                </button>
              </div>

              {/* 본문: 이미지(좌) + 옵션(우) */}
              <div className="mt-3 grid grid-cols-[104px,1fr] gap-3 items-start">
                {/* 이미지 */}
                <div className="w-[90px] h-[90px] rounded-2xl bg-[#F6F5F4] flex items-center justify-center overflow-hidden">
                  {modalItem.imageUrl ? (
                    <img src={modalItem.imageUrl} alt={modalItem.name} className="h-[90px] w-[90px] object-contain" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded" />
                  )}
                </div>

                {/* 옵션 pill들 */}
                <div className="flex flex-col">
                  {/* hot/iced : 그룹2의 4,5 화면에서는 숨김 */}
                  {!hideTempPills && (
                    <div className="flex gap-2 mb-3">
                      <span className="p-[10px] rounded-2xl bg-[#ECECEC] text-sm text-[#111]">hot</span>
                      <span
                        className={[
                          "p-[10px] rounded-2xl text-sm text-[#111]",
                          currentStepId?.startsWith("g1-") &&
                          ["-06","-07","-08","-09"].some(suffix => currentStepId.includes(suffix))
                            ? "bg-[#FFEEC5]"  // 강조
                            : "bg-[#ECECEC]"
                        ].join(" ")}
                      >
                        iced
                      </span>
                    </div>
                  )}

                  {/* 사이즈 S/M/L */}
                  <div className="flex gap-2">
                    {['S','M','L'].map(s => {
                      const isActiveS =
                        s === 'S' && (
                          // 그룹1 → 08, 09
                          (currentStepId?.startsWith("g1-") &&
                            ["-08","-09"].some(suffix => currentStepId.includes(suffix)))
                          ||
                          // 그룹2 → kiosk-05
                          (currentStepId === "g2-kiosk-05")
                        );
                      return (
                        <span
                          key={s}
                          className={[
                            "px-3 py-2 rounded-2xl text-sm text-[#111]",
                            isActiveS ? "bg-[#FFEEC5]" : "bg-[#ECECEC]"
                          ].join(" ")}
                        >
                          {s}
                        </span>
                      );
                    })}
                  </div>

                  {/* 수량 */}
                  <div className="mt-3 flex items-center justify-start gap-3">
                    <button className="w-5 h-5 rounded-full bg-[#444444] text-white text-[18px] leading-none">−</button>
                    <span className="text-[14px] text-center leading-[22px] text-[#000000]">1</span>
                    <button className="w-5 h-5 rounded-full bg-[#444444] text-white text-[18px] leading-none">＋</button>
                  </div>
                </div>
              </div>
              
              {/* 하단 버튼 */}
              <div className="mt-4 grid grid-cols-2 gap-[9px]">
                <button className="h-[38px] rounded-[36px] bg-[#ECECEC] text-[#000000] text-[14px] font-medium">취소</button>
                <button className="h-[38px] rounded-[36px] bg-[#FFC845] text-[#000000] text-[14px] font-medium">선택완료</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 하단 장치들 */}
      <div className="flex justify-center items-center gap-11 px-13 mt-4">
        {/* 영수증 출력기 */}
        <div className="w-[133px] h-[125px] bg-[#F9F9F9] rounded-lg border-2 border-gray-300 flex items-start justify-center py-[27px] px-[14px]">
          <div className="w-3/4 h-2 bg-black rounded-full" />
        </div>
        <div className="flex flex-col gap-3">
          {/* 바코드 인식기 */}
          <div className="w-[93px] h-[57px] bg-black rounded-lg flex items-center justify-center border-2 border-gray-300">
            <div className="w-[63px] h-[39px] bg-[#f9f9f9] rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-black rounded-full opacity-80 blur-[0.5px]" />
            </div>
          </div>
          {/* 카드 리더기 */}
          <div className="w-[93px] h-[57px] bg-black rounded-lg flex items-center justify-center border-2 border-gray-300">
            <div className="w-3/4 h-1 bg-[#747474] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

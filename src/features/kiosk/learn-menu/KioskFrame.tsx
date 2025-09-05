import React, { useEffect, useState } from 'react'

export const CATEGORIES = ['커피', '음료', '디저트', '푸드'] as const
export type Category = typeof CATEGORIES[number]

/** 간단 아이템 타입 (API 연동 시 name, imageUrl, price 등 확장 가능) */
export type KioskItem = {
  name: string
  imageUrl?: string
  price?: number
}

type KioskFrameProps = {
  className?: string
  children?: React.ReactNode
  forcedActiveCategory?: Category | null
  disableTabClicks?: boolean
  /** 카테고리별 아이템 목록(없으면 스켈레톤만 표시) */
  itemsByCategory?: Partial<Record<Category, KioskItem[]>>
  /** 아이템 클릭 시 부모에게 알림 */
  onSelectItem?: (item: KioskItem, category: Category) => void
}

export default function KioskFrame({
  className,
  children,
  forcedActiveCategory = null,
  disableTabClicks = false,
  itemsByCategory,
  onSelectItem,
}: KioskFrameProps) {
  const [category, setCategory] = useState<Category>('커피')

  // 외부에서 카테고리를 강제 지정하면 동기화
  useEffect(() => {
    if (forcedActiveCategory) setCategory(forcedActiveCategory)
  }, [forcedActiveCategory])

  // 실제 활성 탭(외부 강제값이 우선)
  const activeCategory: Category = (forcedActiveCategory ?? category) as Category

  // 렌더할 목록(없으면 스켈레톤)
  const items = itemsByCategory?.[activeCategory]

  return (
    <div className={`absolute inset-0 w-full h-[797px] bg-[#F6F5F4] ${className ?? ''}`}>
      {/* 키오스크 화면 틀 */}
      <div className="relative flex flex-col items-center justify-center">
        <div
          className="rounded-[36px] bg-[#FFFFFF] border-2 border-[#D5D5D5] shadow-[0px_2px_4px_rgba(0,0,0,0.04)] overflow-hidden"
          style={{ marginTop: '67px', width: 319, height: 569 }}
        >
          {/* ▶ 실제 메뉴가 들어가는 영역 */}
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
                <div className="mt-6 flex-1 overflow-y-auto px-[22px]">
                  <div className="grid grid-cols-2 gap-[9px]">
                    {/* 아이템이 있으면 아이템 렌더, 없으면 스켈레톤 */}
                    {items && items.length > 0
                      ? items.map((it, i) => (
                          <button
                            key={`${it.name}-${i}`}
                            onClick={() => onSelectItem?.(it, activeCategory)}
                            className="rounded-[16px] bg-[#F6F5F4] p-[10px] flex flex-col items-center justify-start"
                          >
                            {/* 이미지 자리(옵션) */}
                            <div className="w-full rounded-[14px] flex items-center justify-center overflow-hidden">
                              {it.imageUrl ? (
                                // 실제 이미지가 있으면 표시
                                <img src={it.imageUrl} alt={it.name} className="w-[112px] h-[112px] object-cover" />
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
                        ))
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
                      <span className="opacity-90">0개</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300 opacity-60" />
                    <div className="flex flex-1 justify-between px-4">
                      <span className="opacity-90">합계</span>
                      <span className="font-medium">0원</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-[10px]">
                    <button className="flex-1 h-[34px] rounded-[32px] bg-white text-black text-[14px] font-medium">
                      이전
                    </button>
                    <button className="flex-[1] h-[34px] rounded-[32px] bg-[#FFC845] text-black text-[14px] font-medium">
                      주문하기
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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

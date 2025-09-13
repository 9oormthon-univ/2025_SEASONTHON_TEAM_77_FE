import React from 'react';
import KioskFrame from '../../kiosk/learn-menu/KioskFrame';
import { money } from '../retouchUtils';

type CartItem = {
  productId?: number;
  name: string;
  price: number;
  qty: number;
  size?: 'S' | 'M' | 'L';
  productOptions?: { optionName: string; optionValue: string }[];
};

type Props = {
  cart: CartItem[];
  bottomTotals: { qty: number; sum: number };
  changeQty: (idx: number, delta: number) => void;
  removeItem: (idx: number) => void;
  goBack: () => void;
  handlePay: () => void;
};

export default function OrderSheet({ cart, bottomTotals, changeQty, removeItem, goBack, handlePay }: Props) {
  return (
    <KioskFrame disableTabClicks forcedTotals={bottomTotals}>
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

          <div className="mt-3 mx-[20px] space-y-3 text-[14px] text-[#000000] font-medium">
            {cart.map((ci, idx) => (
              <React.Fragment key={`${ci.name}-${ci.size ?? 'none'}`}>
                <div className="grid grid-cols-[1fr,62px,67px,24px] items-center">
                  <div className="truncate pr-2">{ci.name}{ci.size ? ` (${ci.size})` : ''}</div>
                  <div className="flex items-center justify-center gap-2">
                    <button className="w-5 h-5 rounded-full bg-[#444] text-white text-[12px] grid place-items-center" onClick={() => changeQty(idx, -1)}>−</button>
                    <span>{ci.qty}</span>
                    <button className="w-5 h-5 rounded-full bg-[#444] text-white text-[12px] grid place-items_center" onClick={() => changeQty(idx, +1)}>＋</button>
                  </div>
                  <div className="text-right">{money(ci.price * ci.qty)}</div>
                  <button aria-label="삭제" className="items-center justify-center ml-1" onClick={() => removeItem(idx)}>
                    <img src="/src/assets/cancel_icon.png" alt="닫기" className="w-5 h-5 filter brightness-[3]" />
                  </button>
                </div>
                <div className="mt-2 h-px bg-[#F0F0F0]" />
              </React.Fragment>
            ))}
            {cart.length === 0 && <div className="text-center text-[#888] py-6">담은 메뉴가 없습니다.</div>}
          </div>
        </div>

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
            <button className="flex-1 h-[34px] rounded-[32px] bg-white text-black text-[14px] font-medium" onClick={goBack}>이전</button>
            <button className="flex-[1] h-[34px] rounded-[32px] bg-[#FFC845] text-black text-[14px] font-medium" onClick={handlePay}>결제하기</button>
          </div>
        </div>
      </div>
    </KioskFrame>
  );
}

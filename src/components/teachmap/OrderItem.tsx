import React from 'react';

interface OrderItemProps {
  name: string;
  quantity: number;
  price: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  canModify?: boolean;
}

const OrderItem: React.FC<OrderItemProps> = ({
  name,
  quantity,
  price,
  onIncrease,
  onDecrease,
  onRemove,
  canModify = true
}) => {
  return (
    <>
      <div className="grid grid-cols-[1fr,62px,67px,24px] items-center">
        <div className="truncate pr-2">{name}</div>
        <div className="flex items-center justify-center gap-2">
          {canModify ? (
            <>
              <button
                onClick={onDecrease}
                className="w-5 h-5 rounded-full bg-[#444444] text-white text-[12px] flex items-center justify-center"
                aria-label="수량 감소"
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                onClick={onIncrease}
                className="w-5 h-5 rounded-full bg-[#444444] text-white text-[12px] flex items-center justify-center"
                aria-label="수량 증가"
              >
                ＋
              </button>
            </>
          ) : (
            <span>{quantity}</span>
          )}
        </div>
        <div className="text-right">{price}</div>
        {canModify && (
          <button 
            onClick={onRemove}
            className="items-center justify-center ml-1"
            aria-label="삭제"
          >
            <img 
              src="/assets/common/cancel_icon.png" 
              alt="닫기" 
              className="w-5 h-5 filter brightness-[3]" 
            />
          </button>
        )}
      </div>
      <div className="mt-2 h-px bg-[#F0F0F0]" />
    </>
  );
};

export default OrderItem;

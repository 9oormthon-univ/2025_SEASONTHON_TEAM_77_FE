import React from 'react';

interface KioskHardwareProps {
  onReceiptClick?: () => void;
  onBarcodeClick?: () => void;
  onCardReaderClick?: () => void;
  receiptClickable?: boolean;
  barcodeClickable?: boolean;
  cardReaderClickable?: boolean;
  className?: string;
}

const KioskHardware: React.FC<KioskHardwareProps> = ({
  onReceiptClick,
  onBarcodeClick,
  onCardReaderClick,
  receiptClickable = false,
  barcodeClickable = false,
  cardReaderClickable = false,
  className = "flex justify-center items-center gap-11 px-13 mt-4"
}) => {
  return (
    <div className={className}>
      {/* 영수증 출력기 */}
      <div 
        onClick={receiptClickable ? onReceiptClick : undefined}
        className={`w-[133px] h-[125px] bg-[#F9F9F9] rounded-lg border-2 border-gray-300 flex items-start justify-center py-[27px] px-[14px] ${
          receiptClickable ? "cursor-pointer z-50" : "z-20"
        }`}
      >
        <div className="w-3/4 h-2 bg-black rounded-full" />
      </div>

      <div className="flex flex-col gap-3">
        {/* 바코드 인식기 */}
        <div 
          onClick={barcodeClickable ? onBarcodeClick : undefined}
          className={`w-[93px] h-[57px] bg-black rounded-lg flex items-center justify-center border-2 border-gray-300 ${
            barcodeClickable ? "cursor-pointer z-50" : "z-20"
          }`}
        >
          <div className="w-[63px] h-[39px] bg-[#f9f9f9] rounded flex items-center justify-center">
            <div className="w-3 h-3 bg-black rounded-full opacity-80 blur-[0.5px]" />
          </div>
        </div>

        {/* 카드 리더기 */}
        <div 
          onClick={cardReaderClickable ? onCardReaderClick : undefined}
          className={`w-[93px] h-[57px] bg-black rounded-lg flex items-center justify-center border-2 border-gray-300 ${
            cardReaderClickable ? "cursor-pointer z-50" : "z-20"
          }`}
        >
          <div className="w-3/4 h-1 bg-[#747474] rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default KioskHardware;

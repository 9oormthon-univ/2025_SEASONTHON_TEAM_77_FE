import React, { useState } from 'react';

const PointInput: React.FC<{
  onSkip: () => void;
  onCollect: () => void;
}> = ({ onSkip, onCollect }) => {
  const [selected, setSelected] = useState<'skip' | 'collect' | null>('collect');

  const handleCollect = () => {
    setSelected('skip');
    setTimeout(() => {
      onCollect(); // substep 증가
    }, 300); // 버튼 색상 보이게 딜레이 줌
  };

  const handleSkip = () => {
    onSkip(); // step 증가
  };

  const [phone, setPhone] = useState('010');

  const formatPhoneNumber = (number: string) => {
    const cleaned = number.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
  };

  const handleNumberClick = (digit: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 11) return;
    const updated = cleaned + digit;
    setPhone(formatPhoneNumber(updated));
  };

  const handleBackspace = () => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length <= 3) return;
    const updated = cleaned.slice(0, -1);
    setPhone(formatPhoneNumber(updated));
  };

  const handleClear = () => {
    setPhone('010');
  };

  const numberPad = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['Clear', '0', '←'],
  ];

  return (
    <div className="flex flex-col items-center justify-center w-[277px] h-[395px] py-[30px] px-[20px] bg-white rounded-2xl">
      <h3 className="text-xl text-black text-center mb-3">
        포인트 적립
      </h3>
      <p className="text-base text-[#FFC845] tracking-wide mb-2">
        {phone}
      </p>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {numberPad.flat().map((label, index) => (
          <button
            key={index}
            onClick={() => {
              if (label === 'Clear') handleClear();
              else if (label === '←') handleBackspace();
              else handleNumberClick(label);
            }}
            className="w-[42px] h-[42px] rounded-full bg-[#F6F5F4] p-[10px]text-xs text-black "
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          className={`px-[20px] py-[10px] rounded-full text-sm transition-colors duration-200 text-black ${
            selected === 'skip' ? 'bg-[#FFC845]' : 'bg-[#ECECEC]'
          }`}
          onClick={handleSkip}
        >
          건너뛰기
        </button>
        <button
          className={`px-[20px] py-[10px] rounded-full text-sm transition-colors duration-200 text-black ${
            selected === 'collect' ? 'bg-[#FFC845]' : 'bg-[#ECECEC]'
          }`}
          onClick={handleCollect}
        >
          적립하기
        </button>
      </div>
    </div>
  );
};

export default PointInput;
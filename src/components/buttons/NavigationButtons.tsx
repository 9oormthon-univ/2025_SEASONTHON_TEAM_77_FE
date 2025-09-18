import React from 'react';

interface NavigationButtonsProps {
  onPrev?: () => void;
  onNext?: () => void;
  showPrev?: boolean;
  showNext?: boolean;
  prevIcon?: string;
  nextIcon?: string;
  className?: string;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrev,
  onNext,
  showPrev = true,
  showNext = true,
  prevIcon = '/assets/common/prev.svg',
  nextIcon = '/assets/common/next.svg',
  className = "absolute bottom-[10px] left-0 flex flex-row gap-6 w-full items-center justify-center"
}) => {
  return (
    <div className={className}>
      {showPrev && onPrev && (
        <button
          onClick={onPrev}
          style={{
            backgroundImage: `url(${prevIcon})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '43px',
            height: '42px',
          }}
          aria-label="이전 단계"
        />
      )}
      {showNext && (
        <button
          onClick={onNext}
          style={{
            backgroundImage: `url(${nextIcon})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '43px',
            height: '42px',
          }}
          aria-label="다음 단계"
        />
      )}
    </div>
  );
};

export default NavigationButtons;

import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderBarProps {
  title: string;
  backTo?: string; // optional, default to -1 (go back)
}

const HeaderBar: React.FC<HeaderBarProps> = ({ title, backTo }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="w-full h-[67px] flex items-center justify-center relative bg-transparent z-50 inline-block">
      <button
        onClick={handleBack}
        className="absolute left-4 h-full flex items-center justify-center"
        aria-label="뒤로가기"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M9.13275 12.8334H23.3334V15.1668H9.13275L15.3907 21.4248L13.7411 23.0744L4.66675 14.0001L13.7411 4.92578L15.3907 6.57545L9.13275 12.8334Z" fill="#111111"/>
        </svg>
      </button>
      <h3 className="text-xl text-black"
        style={{
          fontFamily: 'Pretendard',
          fontWeight: '600',
          lineHeight: '140%',
        }}
      >{title}</h3>
    </header>
  );
};

export default HeaderBar;
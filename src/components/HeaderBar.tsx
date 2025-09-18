import React from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTTS } from '../hooks/useTTS';
import { useTTSPlayer } from '../hooks/useTTSPlayer';

interface HeaderBarProps {
  title: string;
  backTo?: string; // optional, default to -1 (go back)
}

const HeaderBar: React.FC<HeaderBarProps> = ({ title, backTo }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isTTSEnabled, setIsTTSEnabled } = useTTS();
  const { playTTS } = useTTSPlayer();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  const toggleSwitch = () => {
    const newState = !isTTSEnabled;
    setIsTTSEnabled(newState);
    
    if (newState) {
      toast.success('음성 안내가 활성화되었습니다.');
    } else {
      toast('음성 안내가 비활성화되었습니다.');
    }
  };

  const isRetouchPage = location.pathname.startsWith('/retouch');
  const isAnalysisPage = location.pathname.startsWith('/order-analysis');

  return (
    <header className="w-full h-[67px] flex items-center justify-center relative bg-transparent z-50">
      <button
        onClick={handleBack}
        className="absolute left-6 h-full flex items-center justify-center"
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

      {/* 리터치 페이지에서는 TTS 아이콘 숨기기 */}
      {!isRetouchPage && !isAnalysisPage && (
        <button
          onClick={toggleSwitch}
          className="absolute right-4 h-full flex items-center justify-center"
          aria-label="on/off"
        >
          <img
            src={isTTSEnabled ? "/assets/on.png" : "/assets/off.png"}
            alt={isTTSEnabled ? "on" : "off"}
            className="w-7 h-7"
          />
        </button>
      )}
    </header>
  );
};

export default HeaderBar;

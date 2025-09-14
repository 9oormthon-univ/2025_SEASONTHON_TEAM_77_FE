import React from 'react';

interface MenuButtonProps {
  onClick: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed top-4 right-7 flex flex-col items-center z-50">
      {/* 버튼 아이콘 */}
      <button
        onClick={onClick}
        className="w-8 h-8 flex items-center justify-center"
        aria-label="메뉴보기"
      >
        <img
          src="/src/assets/menu_check.png"
          alt="메뉴보기"
          className="w-8 h-8"
        />
      </button>
    </div>
  );
};

export default MenuButton;

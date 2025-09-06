interface AccountSectionProps {
  onLogoutClick: () => void;
}

export default function AccountSection({ onLogoutClick }: AccountSectionProps) {
  return (
    <>
      <label 
        className="w-full block text-base font-normal text-gray-700 text-left mb-2"
        style={{
          fontFamily: 'Pretendard',
        }}
      >
        계정 정보
      </label>
      <div
        className="w-full h-18 bg-white rounded-xl px-6 py-4 cursor-pointer"
        onClick={onLogoutClick}
      >
        <div className="flex justify-between items-center text-base font-medium">
          <span>로그아웃</span>
          <span className="text-xl">›</span>
        </div>
      </div>
    </>
  );
}

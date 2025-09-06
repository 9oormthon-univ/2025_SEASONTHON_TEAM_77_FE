interface ProfileHeaderProps {
  loginId: string | null;
}

export default function ProfileHeader({ loginId }: ProfileHeaderProps) {
  return (
    <>
      <h1 className="text-xl font-bold mb-8">마이페이지</h1>
      
      {/* 프로필 사진 */}
      <div className="w-40 h-40 bg-gray-300 rounded-full mb-4"></div>

      {/* 인사말 */}
      <p className="text-xl font-semibold mb-10">
        안녕하세요 {loginId ?? "사용자"}님
      </p>
    </>
  );
}

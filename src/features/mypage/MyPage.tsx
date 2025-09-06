import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../shared/api";
import NavBar from "../../components/NavBar";
import { ConfirmModal } from "../../components/common/Modal";
import { ProfileHeader, AccountSection } from "../profile/components";

export default function MyPage() {
  const navigate = useNavigate();
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("currentUsername");
    setCurrentUsername(storedUsername);
  }, []);

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
    
      if (!accessToken) {
        alert("로그인 정보가 없습니다.");
        navigate("/login");
        return;
      }

      const data = await authAPI.logout();
  
      console.log("로그아웃 응답:", data); // 확인
      if (data === "로그아웃 완료") {
        localStorage.clear();
        navigate("/login");
      } else {
        alert("로그아웃 실패");
      }
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F4] px-6 py-8 flex flex-col items-center">
      <ProfileHeader currentUsername={currentUsername} />
      <AccountSection onLogoutClick={() => setShowModal(true)} />
      
      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleLogout}
        title="로그아웃 하시겠어요?"
      />
      
      <NavBar />
    </div>
  );
}
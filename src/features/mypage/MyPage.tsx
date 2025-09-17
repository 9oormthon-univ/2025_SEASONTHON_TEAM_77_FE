import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { authAPI } from "../../shared/api";
import NavBar from "../../components/NavBar";
import ConfirmModal from "../../components/common/ConfirmModal";
import ProfileHeader from "../profile/components/ProfileHeader";
import AccountSection from "../profile/components/AccountSection";

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
        toast.error("로그인 정보가 없습니다.");
        navigate("/login");
        return;
      }

      const data = await authAPI.logout();
  
      if (data === "로그아웃 완료") {
        localStorage.clear();
        navigate("/login");
      } else {
        toast.error("로그아웃에 실패했습니다.");
      }
    } catch (error) {
      toast.error("로그아웃에 실패했습니다.");
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
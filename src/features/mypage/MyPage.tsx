import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";

export default function MyPage() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedId = localStorage.getItem("loginId");
    setLoginId(storedId);
  }, []);

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.post(
        "http://3.36.238.38:8080/api/v1.0/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
        }
      );
  
      console.log("로그아웃 응답:", response.data); // 🔍 확인
      if (response.data === "로그아웃 완료") {
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
      <h1 className="text-xl font-bold mb-8">마이페이지</h1>

      {/* 프로필 사진 */}
      <div className="w-40 h-40 bg-gray-300 rounded-full mb-4"></div>

      {/* 인사말 */}
      <p className="text-xl font-semibold mb-10">
        안녕하세요 {loginId ?? "사용자"}님
      </p>

      {/* 로그아웃 박스 */}
      <label 
        className="w-full block text-base font-normal text-gray-700 text-left mb-2"
        style={{
          fontFamily: 'Pretendard',
        }}
      >계정 정보</label>
      <div
        className="w-full h-18 bg-white rounded-xl px-6 py-4 cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="flex justify-between items-center text-base font-medium">
          <span>로그아웃</span>
          <span className="text-xl">›</span>
        </div>
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 w-full h-screen bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-[16px] px-5 py-7 w-[80%] max-w-[300px] text-center">
            <p className="text-lg font-semibold mb-6">로그아웃 하시겠어요?</p>
            <div className="flex justify-between gap-2">
              <button
                className="flex-1 bg-[#ececec] text-base text-black py-2 rounded-full rounded-[36px]"
                onClick={() => setShowModal(false)}
              >
                취소
              </button>
              <button
                className="flex-1 bg-[#FFD845] text-base text-black py-2 rounded-full rounded-[36px]"
                onClick={handleLogout}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
      <NavBar />
    </div>
  );
}
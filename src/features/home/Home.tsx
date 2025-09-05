import React from "react";
import NavBar from "../../components/NavBar";

const days = ["월", "화", "수", "목", "금", "토", "일"];
const attendance = [true, true, true, false, false, false, false];

const centers = [
  {
    name: "곰달래어르신복지센터",
    address: "서울특별시 강서구 강서로5길 50 (화곡동)",
    image: "/src/assets/center1.png",
  },
  {
    name: "창동아우르네",
    address: "서울특별시 강서구 강서로5길 50 (화곡동)",
    image: "/src/assets/center2.png",
  },
  {
    name: "성산1동 주민센터",
    address: "서울특별시 마포구 성산로4길 15 (성산동)",
    image: "/src/assets/center3.png",
  },
];

export default function Home() {
  const currentStep = 2;

  return (
    <div className=" flex flex-col w-full h-full bg-gradient-to-r from-[#FFC845] to-[#FFAE4A]">
      {/* 상단 영역 */}
      <div className="bg-transparent px-6 pt-20 pb-8 relative z-10">
        <p className="text-base font-semibold mb-[69px] px-4">로고</p>
        <p className="text-base font-semibold leading-snug">
          티처티치와 함께 쉽고
          <br />
          즐겁게 학습을 시작하세요
        </p>
        <img
          src="/src/assets/character/3.png"
          alt="캐릭터"
          className="w-60 h-60 absolute right-[-45px] top-[80px] "
        />
      </div>

      <div 
        className="flex flex-col px-6 bg-[#F6F5F4] h-[902px] pt-8 z-20 gap-[52px]"
        style={{
          borderRadius: '32px 32px 0 0',
        }}
      >
        {/* 현재 학습 단계 */}
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold text-black mb-2 px-2">현재 학습 단계</h3>
          <div 
            className="w-full h-4 bg-[#FFFAEC] rounded-full overflow-hidden mb-1"
            style={{
              boxShadow: '0.5px 0.5px 1px 0 rgba(17, 0, 116, 0.15) inset',
            }}
          >
          <div
            className="h-full bg-[#FFC845] rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
          </div>
          <p className="text-sm text-black px-1">{currentStep}단계 / 총 3단계</p>
        </div>

        <div className="flex flex-col">
          {/* 출석 체크 */}
          <h3 className="text-xl font-semibold text-black mb-2 px-2">출석체크</h3>
          <div 
            className="grid grid-cols-7 gap-4 text-center text-base text-black py-6 px-4 bg-white"
            style={{
              boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.04)',
              borderRadius: '16px',
            }}
          >
          {days.map((day, index) => (
            <div key={index} className="flex flex-col items-center gap-3">
              <span>{day}</span>
              <div
                className={`w-7 h-7 rounded-full ${
                attendance[index] ? "bg-[#FFC845]" : "bg-[#ECECEC]"
                }`}
              />
            </div>
          ))}
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="text-xl font-semibold text-black mb-2 px-2">
            <span className="text-[#F1B300]">서울특별시</span> 디지털 배움터
          </h3>
          <div className="flex flex-col gap-2 w-full">
            {centers.map((center, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-xl p-3 flex items-center gap-4"
                style={{
                  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.04)',
                  borderRadius: '16px',
                }}
              >
                <img src={center.image} alt={center.name} className="w-20 h-20 object-cover rounded-lg" />
                <div>
                    <p className="text-sm font-normal mb-1">{center.name}</p>
                    <p className="text-xs text-[#747474] font-light">{center.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <NavBar />
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import axios from "axios";

const stepsData = [
  {
    step: 1,
    title: "키오스크 구성 학습",
    description: "전체 구성, 주문 시작, 장소 선택",
    image: "kiosk.png",
    substeps: [
      {
        id: "1-1",
        title: "키오스크 전체 구성",
        navigateUrl: "/teachmap/kioskstructure",
        isCompleted: true,
      },
      {
        id: "1-2",
        title: "주문시작 및 장소 선택",
        navigateUrl: "/teachmap/kioskorder",
        isCompleted: false,
      },
    ],
  },
  {
    step: 2,
    title: "메뉴 선택 학습",
    description: "음료 카테고리, 메뉴 주문",
    image: "menu.png",
    substeps: [
      {
        id: "2-1",
        title: "카테고리 설명",
        navigateUrl: "/teachmap/kioskmenu",
        isCompleted: false,
      },
      {
        id: "2-2",
        title: "메뉴 주문",
        navigateUrl: "/teachmap/kioskmenuorder",
        isCompleted: false,
      },
      {
        id: "2-3",
        title: "주문 메뉴 확인",
        navigateUrl: "/teachmap/kioskmenuordercheck",
        isCompleted: false,
      },
    ],
  },
  {
    step: 3,
    title: "결제 학습",
    description: "포인트 적립, 결제 수단 선택",
    image: "card.png",
    substeps: [
      {
        id: "3-1",
        title: "포인트 적립 및 결제 수단 선택",
        navigateUrl: "/teachmap/kioskpayment",
        isCompleted: false,
      },
    ],
  },
];

export default function TeachMap() {
  const [openStep, setOpenStep] = useState<number | null>(null);
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResult, setSearchResult] = useState<any[] | null>(null);

  const handleStepClick = (step: number) => {
    setOpenStep(prev => (prev === step ? null : step));
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) return setSearchResult(null);
    try {
      const response = await axios.get(
        `http://3.36.238.38:8080/api/v1.0/guides/search?keyword=${encodeURIComponent(searchKeyword)}`
      );
      setSearchResult(response.data);
    } catch (error) {
      console.error("검색 실패:", error);
      setSearchResult([]);
    }
  };

  const displaySteps = searchResult
    ? stepsData.filter(step =>
        searchResult.some(result => result.title === step.title)
      )
    : stepsData;

  return (
    <div className="min-h-screen bg-[#F8F6F4] px-6 py-8 flex flex-col items-center">
      <h1 className="text-xl font-bold mb-8">티치맵</h1>

      {/* 검색창 */}
      <div className="mb-4 w-full relative">
        <input
          type="text"
          placeholder="학습할 카테고리를 검색하세요"
          value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          className="w-full h-[56px] p-4 rounded-[32px] bg-[#ececec] focus:outline-none text-sm"
        />
        <button onClick={handleSearch} className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
            <path d="M21.4594 21L17.0143 16.65M19.4157 11C19.4157 15.4183 15.7556 19 11.2407 19C6.72575 19 3.06567 15.4183 3.06567 11C3.06567 6.58172 6.72575 3 11.2407 3C15.7556 3 19.4157 6.58172 19.4157 11Z" stroke="#575757" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21.4594 21L17.0143 16.65M19.4157 11C19.4157 15.4183 15.7556 19 11.2407 19C6.72575 19 3.06567 15.4183 3.06567 11C3.06567 6.58172 6.72575 3 11.2407 3C15.7556 3 19.4157 6.58172 19.4157 11Z" stroke="black" stroke-opacity="0.2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      {/* 단계 카드들 */}
      {displaySteps.map((step, idx) => {
        const { step: stepNum, title, description, image, substeps } = step;

        return (
          <div key={stepNum} className="mb-4 w-full bg-[#F6F5F4]">
            <button
              onClick={() => handleStepClick(stepNum)}
              className="w-full flex justify-between items-center px-4 py-5 bg-white"
              style={{
                borderRadius: "16px",
                boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.04)",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-[72px] h-[72px] rounded-[24px] bg-[#FFEEC5] flex items-center justify-center">
                  <img
                    src={`/src/assets/${image}`}
                    alt={title}
                    className="w-[50px] h-fit"
                  />
                </div>
                <div className="text-left">
                  <p className="text-[#F1B300] font-medium mb-1">
                    {stepNum}단계. {title}
                  </p>
                  <p className="text-sm text-[#747474]">{description}</p>
                </div>
              </div>
              <span>{openStep === stepNum ? "▲" : "▼"}</span>
            </button>

            {/* 펼쳐졌을 때 substeps */}
            {openStep === stepNum && (
              <div className=" w-full h-full mt-2 space-y-2">
                {substeps.map(
                  ({ id, title, isCompleted, navigateUrl }, idx) => (
                    <div key={id} className="flex justify-between items-center w-full h-[64px] bg-white rounded-[16px] p-4" style={{
                      boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.08)",
                    }}>
                      <span className="text-base text-[#444444] font-medium">
                        {substeps.length > 1 ? `${idx + 1}. ` : ""}
                        {title}
                      </span>
                      {navigateUrl && (
                        <button
                          onClick={() => navigate(navigateUrl)}
                          className={`text-sm px-3 py-2 rounded-full ${
                            isCompleted
                              ? "bg-[#c1c1c1] text-white"
                              : "bg-[#FFC845] text-black"
                          }`}
                        >
                          {isCompleted ? "학습완료" : "학습하기"}
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        );
      })}
      <NavBar />
    </div>
  );
}
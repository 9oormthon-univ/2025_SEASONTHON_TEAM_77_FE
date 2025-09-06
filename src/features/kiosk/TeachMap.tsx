import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import { kioskAPI } from "../../shared/api";
import SearchBar from "../../components/common/SearchBar";
import { StepCard } from "./components/TeachMap";

interface SearchResult {
  title: string;
}

const stepsData = [
  {
    step: '1',
    title: "키오스크 구성 학습",
    description: "전체 구성, 주문 시작, 장소 선택",
    image: "kiosk.png",
    substeps: [
      {
        id: '1',
        title: "키오스크 전체 구성",
        navigateUrl: "/teachmap/kioskstructure",
      },
      {
        id: '2',
        title: "주문시작 및 장소 선택",
        navigateUrl: "/teachmap/kioskorder",
      },
    ],
  },
  {
    step: '2',
    title: "메뉴 선택 학습",
    description: "음료 카테고리, 메뉴 주문",
    image: "menu.png",
    substeps: [
      {
        id: '3',
        title: "카테고리 설명",
        navigateUrl: "/teachmap/kioskmenu",
      },
      {
        id: '4',
        title: "메뉴 주문",
        navigateUrl: "/teachmap/kioskmenuorder",
      },
      {
        id: '5',
        title: "주문 메뉴 확인",
        navigateUrl: "/teachmap/kioskmenuordercheck",
      },
    ],
  },
  {
    step: '3',
    title: "결제 학습",
    description: "포인트 적립, 결제 수단 선택",
    image: "card.png",
    substeps: [
      {
        id: '6',
        title: "포인트 적립 및 결제 수단 선택",
        navigateUrl: "/teachmap/kioskpayment",
      },
    ],
  },
];

export default function TeachMap() {
  const [openStep, setOpenStep] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult[] | null>(null);
  const [completionStatus, setCompletionStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchCompletionStatus = async () => {
      const status: Record<string, boolean> = {};
      
      // 모든 substep을 false로 초기화
      for (const step of stepsData) {
        for (const substep of step.substeps) {
          status[substep.id] = false;
        }
      }
      
      // 각 단계별로 완료된 substep 조회
      for (const step of stepsData) {
        try {
          const completedSubstepIds: string[] = await kioskAPI.getProgress(step.step);
          console.log(`단계 ${step.step} 완료된 substeps:`, completedSubstepIds);
          
          // 완료된 substep들을 true로 설정
          completedSubstepIds.forEach(substepId => {
            status[substepId] = true;
          });
        } catch (error) {
          console.error(`단계 ${step.step} 진도 조회 실패:`, error);
        }
      }
      
      setCompletionStatus(status);
    };

    fetchCompletionStatus();
  }, []);

  const handleStepClick = (step: string) => {
    setOpenStep(prev => (prev === step ? null : step));
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) return setSearchResult(null);
    try {
      const data = await kioskAPI.search(searchKeyword);
      setSearchResult(data);
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

      <SearchBar
        value={searchKeyword}
        onChange={setSearchKeyword}
        onSearch={handleSearch}
        placeholder="학습할 카테고리를 검색하세요"
      />

      {/* 단계 카드들 */}
      {displaySteps.map((step) => {
        const { step: stepNum, title, description, image, substeps } = step;

        return (
          <StepCard
            key={stepNum}
            stepNum={parseInt(stepNum)}
            title={title}
            description={description}
            image={image}
            substeps={substeps}
            isOpen={openStep === stepNum}
            onToggle={() => handleStepClick(stepNum)}
            completionStatus={completionStatus}
          />
        );
      })}
      <NavBar />
    </div>
  );
}
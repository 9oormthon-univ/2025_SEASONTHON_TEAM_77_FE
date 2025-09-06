import { useNavigate } from "react-router-dom";

interface SubStep {
  id: string;
  title: string;
  navigateUrl: string;
}

interface StepCardProps {
  stepNum: number;
  title: string;
  description: string;
  image: string;
  substeps: SubStep[];
  isOpen: boolean;
  onToggle: () => void;
  completionStatus: Record<string, boolean>;
}

export default function StepCard({
  stepNum,
  title,
  description,
  image,
  substeps,
  isOpen,
  onToggle,
  completionStatus
}: StepCardProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-4 w-full bg-[#F6F5F4]">
      <button
        onClick={onToggle}
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
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* 펼쳐졌을 때 substeps */}
      {isOpen && (
        <div className="w-full h-full mt-2 space-y-2">
          {substeps.map(({ id, title, navigateUrl }, idx) => {
            const isCompleted = completionStatus[id] || false;
            
            return (
              <div 
                key={id} 
                className="flex justify-between items-center w-full h-[64px] bg-white rounded-[16px] p-4" 
                style={{ boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.08)" }}
              >
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
            );
          })}
        </div>
      )}
    </div>
  );
}

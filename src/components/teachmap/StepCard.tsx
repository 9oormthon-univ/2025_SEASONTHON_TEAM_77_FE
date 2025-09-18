import { useNavigate } from "react-router-dom";

interface SubStep {
  id: string;
  title: string;
  navigateUrl: string;
  time: string;
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
        className={`w-full flex justify-between items-center px-4 py-5 bg-white ${isOpen ? "border-2 border-[#FFEEC5]" : "border-none"}`}
        style={{
          borderRadius: "16px",
          boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.04)",
        }}
      >
        <div className="flex items-center gap-4">
          <div 
            className="w-[72px] h-[72px] rounded-[24px] bg-[#FFEEC5] flex items-center justify-center">
            <img
              src={`/assets/${image}`}
              alt={title}
              className="w-[50px] h-fit"
            />
          </div>
          <div className="text-left">
            <p className="text-black font-semibold text-lg mb-1">
              {stepNum}단계. {title}
            </p>
            <p className="text-sm text-[#aeaeae]">{description}</p>
          </div>
        </div>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* 펼쳐졌을 때 substeps */}
      {isOpen && (
        <div className="w-full h-full mt-2 space-y-2">
          {substeps.map(({ id, title, navigateUrl, time }, idx) => {
            const isCompleted = completionStatus[id] || false;
            
            return (
              <div 
                key={id} 
                className="flex justify-between items-center w-full h-[64px] bg-white rounded-[16px] p-4" 
                style={{ boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.08)" }}
              >
                <div className="flex flex-col items-start">
                  <span className="text-base font-semibold text-black">
                    {substeps.length > 1 ? `${idx + 1}. ` : ""}
                    {title}
                  </span>
                  <span className="text-sm font-light text-[#aeaeae] px-[10px]">
                    {time}
                  </span>
                </div>
                {navigateUrl && (
                  <button
                    onClick={() => navigate(navigateUrl)}
                    className={`text-sm px-[10px] py-[5px] rounded-full ${
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

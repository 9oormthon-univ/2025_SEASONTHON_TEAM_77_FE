import { evalFlags, fmtDuration } from '../retouchUtils';
import type { ProductResult, RetouchTestProduct, RetouchResult } from '../../../shared/api/retouch';

type Props = {
  expectedProducts: RetouchTestProduct[];
  resultData: RetouchResult | null;
  onRetryWrong: () => void;
  onGoComplete: () => void;
};

export default function WrongCheck({ expectedProducts, resultData, onRetryWrong, onGoComplete }: Props) {
  const productResults = resultData?.productResults ?? [];
  const correctCount = productResults.filter(p => p.correct).length;
  const wrongCount = productResults.length > 0 ? productResults.length - correctCount : 0;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-start pt-10 z-20 bg-[#F6F5F4]">
      <div className="w-[320px] mt-8 rounded-2xl bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.04)] px-5 py-8">
        {wrongCount === 0 ? (
          <div className="text-center mb-5">
            <div className="text-[18px] font-bold text-[#111]">
              우와!<br />모든 문제를 다 맞추셨어요
            </div>
          </div>
        ) : (
          <div className="text-center mb-5">
            <div className="text-[18px] font-bold text-[#111]">너무 잘 하셨어요!</div>
            <div className="text-[18px] font-bold">
              <span className="text-[#FFC845]">정답과 오답을 확인</span>해보세요
            </div>
          </div>
        )}

        <div className="mt-2 mb-[30px] h-px bg-[#F0F0F0]" />

        <div className="space-y-3 mb_[67px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/src/assets/check_icon.png" alt="정답" className="w-6 h-6" />
              <span className="text-[16px] font-bold text-[#111]">정답</span>
            </div>
            <span className="text-[16px] font-bold text-[#111]">{correctCount}개</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/src/assets/warning_icon.png" alt="오답" className="w-6 h-6" />
              <span className="text-[16px] font-bold text-[#111]">오답</span>
            </div>
            <span className="text-[16px] text-[#111] font-bold">{wrongCount}개</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/src/assets/time_icon.png" alt="소요시간" className="w-6 h-6" />
              <span className="text-[16px] font-bold text-[#111]">소요시간</span>
            </div>
            <span className="text-[16px] font-bold text-[#111]">{fmtDuration(resultData?.duration)}</span>
          </div>
        </div>

        <div className="rounded-lg bg-[#F6F5F4] px-[9px] py-[16px] mt-[67px]">
          <div className="grid grid-cols-[1.2fr,0.8fr,1fr,0.8fr] text-[13px] font-medium text-[#000000]">
            <div>메뉴명</div>
            <div className="text-center">메뉴 선택</div>
            <div className="text-center">사이즈 선택</div>
            <div className="text-end">수량 선택</div>
          </div>

          {expectedProducts.length === 0 ? (
            <div className="text-center text-[#777] py-4 text-[12px]">
              표시할 결과가 없습니다.
            </div>
          ) : (
            <>
              {expectedProducts.map((exp, i) => {
                const matched: ProductResult | undefined = (resultData?.productResults ?? []).find(r => r.productName === exp.productName);
                const { menuOk, sizeOk, qtyOk } = evalFlags(matched);

                return (
                  <div key={`exp-${exp.productName}-${i}`} className="grid grid-cols-[1.2fr,0.8fr,0.9fr,0.9fr] items-center text-[12px] font-normal pt-3">
                    <div className="truncate text-[#000000]">{exp.productName}</div>
                    <div className="grid place-items-center">
                      <img src={menuOk ? '/src/assets/check_icon.png' : '/src/assets/warning_icon.png'} alt={menuOk ? '정답' : '오답'} className="w-5 h-5" />
                    </div>
                    <div className="grid place-items-center">
                      <img src={sizeOk ? '/src/assets/check_icon.png' : '/src/assets/warning_icon.png'} alt={sizeOk ? '정답' : '오답'} className="w-5 h-5" />
                    </div>
                    <div className="grid place-items-center ml-3">
                      <img src={qtyOk ? '/src/assets/check_icon.png' : '/src/assets/warning_icon.png'} alt={qtyOk ? '정답' : '오답'} className="w-5 h-5" />
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {wrongCount === 0 ? (
        <button onClick={onGoComplete} className="mt-[173px] w-[320px] h-[52px] rounded-full bg-[#FFC845] text-black text-[16px] font-semibold">
          다음
        </button>
      ) : (
        <button onClick={onRetryWrong} className="mt-[173px] w-[320px] h-[52px] rounded-full bg-[#FFC845] text-black text-[16px] font-semibold">
          오답 풀기
        </button>
      )}
    </div>
  );
}

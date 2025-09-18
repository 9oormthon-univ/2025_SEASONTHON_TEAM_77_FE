import { useMemo } from 'react';
import { fmtDuration } from '../../features/retouch/retouchUtils'; // evalFlags 제거
import type { ProductResult, RetouchTestProduct, RetouchResult } from '../../shared/api/retouch';
import ActionButton from '../buttons/ActionButton';

type Props = {
  expectedProducts: RetouchTestProduct[];
  resultData: RetouchResult | null;
  onRetryWrong: () => void;
  onGoComplete: () => void;
};

// 이름 정규화(접두 "아이스 " 제거 + trim)
const normalizeName = (s: string) => s.replace(/^아이스\s*/, '').trim();

// 서버 응답에서 플래그 안전 추출
const pickFlags = (r?: ProductResult) => ({
  menuOk: r?.detailedResult?.menuSelection ?? false,
  sizeOk: r?.detailedResult?.sizeSelection ?? false,
  qtyOk:  r?.detailedResult?.quantitySelection ?? false,
});

export default function WrongCheck({ expectedProducts, resultData, onRetryWrong, onGoComplete }: Props) {
  const productResults = resultData?.productResults ?? [];

  // ✅ 항목(메뉴/사이즈/수량) 단위 집계: 매칭 실패 대비로 정규화 fallback 추가
  const { correctChecks, wrongChecks } = useMemo(() => {
    const flags = expectedProducts.map((exp) => {
      const byExact = productResults.find(r => r.productName === exp.productName);
      const byNorm  = productResults.find(r => normalizeName(r.productName) === normalizeName(exp.productName));
      const matched = byExact ?? byNorm; // 매칭 보강
      const { menuOk, sizeOk, qtyOk } = pickFlags(matched);
      return { menuOk, sizeOk, qtyOk };
    });

    const total = flags.length * 3;
    const correct = flags.reduce((acc, f) =>
      acc + (f.menuOk ? 1 : 0) + (f.sizeOk ? 1 : 0) + (f.qtyOk ? 1 : 0), 0);
    return { correctChecks: correct, wrongChecks: total - correct };
  }, [expectedProducts, productResults]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-start pt-10 z-20 bg-[#F6F5F4]">
      <div className="w-[320px] mt-8 rounded-2xl bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.04)] px-5 py-8">
        {wrongChecks === 0 ? (
          <div className="text-center mb-5">
            <div className="text-[18px] font-bold text-[#111]">
              우와!<br />모든 항목을 다 맞추셨어요
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

        {/* ⛏️ 오타 수정: mb_[67px] → mb-[67px] */}
        <div className="space-y-3 mb-[67px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/assets/check_icon.png" alt="정답" className="w-6 h-6" />
              <span className="text-[16px] font-bold text-[#111]">정답</span>
            </div>
            <span className="text-[16px] font-bold text-[#111]">{correctChecks}개</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/assets/warning_icon.png" alt="오답" className="w-6 h-6" />
              <span className="text-[16px] font-bold text-[#111]">오답</span>
            </div>
            <span className="text-[16px] text-[#111] font-bold">{wrongChecks}개</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/assets/time_icon.png" alt="소요시간" className="w-6 h-6" />
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
            <div className="text-center text-[#777] py-4 text-[12px]">표시할 결과가 없습니다.</div>
          ) : (
            <>
              {expectedProducts.map((exp, i) => {
                const byExact = productResults.find(r => r.productName === exp.productName);
                const byNorm  = productResults.find(r => normalizeName(r.productName) === normalizeName(exp.productName));
                const matched = byExact ?? byNorm;
                const { menuOk, sizeOk, qtyOk } = pickFlags(matched);

                return (
                  <div key={`exp-${exp.productName}-${i}`} className="grid grid-cols-[1.2fr,0.8fr,0.9fr,0.9fr] items-center text-[12px] font-normal pt-3">
                    <div className="truncate text-[#000000]">{exp.productName}</div>
                    <div className="grid place-items-center">
                      <img src={menuOk ? '/assets/check_icon.png' : '/assets/warning_icon.png'} alt={menuOk ? '정답' : '오답'} className="w-5 h-5" />
                    </div>
                    <div className="grid place-items-center">
                      <img src={sizeOk ? '/assets/check_icon.png' : '/assets/warning_icon.png'} alt={sizeOk ? '정답' : '오답'} className="w-5 h-5" />
                    </div>
                    <div className="grid place-items-center ml-3">
                      <img src={qtyOk ? '/assets/check_icon.png' : '/assets/warning_icon.png'} alt={qtyOk ? '정답' : '오답'} className="w-5 h-5" />
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {wrongChecks === 0 ? (
        <ActionButton
          onClick={onGoComplete}
          variant="primary"
          size="md"
          className="fixed bottom-[60px] w-[327px]"
          >
          다음
        </ActionButton>
      ) : (
        <ActionButton
          onClick={onRetryWrong}
          variant="primary"
          size="md"
          className="fixed bottom-[60px] w-[327px]"
          >
          오답 풀기
        </ActionButton>
      )}
    </div>
  );
}

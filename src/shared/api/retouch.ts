import { apiClient } from '../api/client';

export type SubmittedProduct = { productId?: number; productName: string; quantity: number; };
export type SubmitBody = { testId: number; duration: number; submittedProducts: SubmittedProduct[]; };
export type ProductResult = { productName: string; correctQuantity: number; submittedQuantity: number; status: 'CORRECT'|'MISSING'|'WRONG'|string; correct: boolean; };
export type RetouchResult = {
  duration: number; feedback: string; productResults: ProductResult[];
  testSummary: { testTitle: string; correctAnswer: string; submittedAnswer: string; };
  correct: boolean;
};

const isAscii = (s: string) => /^[\x00-\x7F]*$/.test(s);

// 모의 결과 생성 (네트워크 실패/토큰 없음 대비)
function makeMock(body: SubmitBody): RetouchResult {
  return {
    duration: body.duration,
    feedback: '임시 토큰/네트워크 문제로 모의 결과를 표시합니다.',
    productResults: body.submittedProducts.map(p => ({
      productName: p.productName,
      correctQuantity: p.quantity,
      submittedQuantity: p.quantity,
      status: 'UNKNOWN',
      correct: false,
    })),
    testSummary: {
      testTitle: `테스트 #${body.testId}`,
      correctAnswer: '서버 응답 없음',
      submittedAnswer: body.submittedProducts.map(p => `${p.productName} ${p.quantity}개`).join(' + '),
    },
    correct: false,
  };
}

// 임시 버전: devToken을 쓰되, 비ASCII면 요청 안 보내고 모의결과 반환
export async function submitRetouchResult(body: SubmitBody) {
  const token =
    localStorage.getItem('devToken') ||
    (import.meta as any).env?.VITE_DEV_TOKEN ||
    ''; // 절대 한글/공백 넣지 말 것

  if (!token || !isAscii(token)) {
    // 헤더에 한글 들어가면 브라우저가 에러내므로 요청 자체를 생략
    return makeMock(body);
  }

  // 타임아웃 보호
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const { data } = await apiClient.post<RetouchResult>(
      '/retouch/submit',
      body,
      { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal as AbortSignal }
    );
    return data;
  } catch (_) {
    // 서버/네트워크 실패 시에도 플로우는 계속
    return makeMock(body);
  } finally {
    clearTimeout(timer);
  }
}

/* 최종 버전(로그인 붙은 후, 인터셉터 사용)
export async function submitRetouchResult(body: SubmitBody) {
  const { data } = await apiClient.post<RetouchResult>('/retouch/submit', body);
  return data;
}
*/

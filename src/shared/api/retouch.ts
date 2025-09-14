import { apiClient } from '../api/client';

export type RetouchTestProductOption = {
  optionName: string;
  optionValue: string;
};

export type SubmittedProduct = { 
  productId?: number;
  productName: string;
  quantity: number;
  productOptions: RetouchTestProductOption[];
};

export type SubmitBody = { 
  testId: number; 
  duration: number; 
  submittedProducts: SubmittedProduct[] 
};

export type ProductResult = {
  productName: string;
  correctQuantity: number;
  submittedQuantity: number;
  productOptions?: RetouchTestProductOption[];
  status: string;
  detailedResult?: {
    menuSelection: boolean;
    sizeSelection: boolean;
    quantitySelection: boolean;
  };
  correct: boolean;
};

export type RetouchResult = {
  duration: number;
  feedback: string;
  productResults: ProductResult[];
  testSummary: { 
    testTitle: string; 
    correctAnswer: string; 
    submittedAnswer: string 
  };
  correct: boolean;
};

export type RetouchTestProduct = {
  id: number;
  productName: string;
  category: string;
  price: number;
  imageUrl: string;
  quantity: number;
  productOptions?: RetouchTestProductOption[];
};

export type RetouchTestResponse = {
  id: number;
  title: string;
  description: string;
  timeLimit: number;
  difficulty: string;
  testOrder: {
    id: number;
    name: string;
    products: RetouchTestProduct[];
  };
};

export async function fetchRetouchTest(testId: number): Promise<RetouchTestResponse> {
  const { data } = await apiClient.get<RetouchTestResponse>(`/retouch/test/${testId}`);
  return data;
}

export async function submitRetouchResult(body: SubmitBody): Promise<RetouchResult> {
  try {
    const { data } = await apiClient.post<RetouchResult>(`/retouch/submit`, body);
    return data;
  } catch (err) {
    console.error('submitRetouchResult error', err);
    // 네트워크 실패 대비용 모의 응답
    return {
      duration: body.duration,
      feedback: '임시 토큰/네트워크 문제로 모의 결과를 표시합니다.',
      productResults: body.submittedProducts.map((p) => ({
        productName: p.productName,
        correctQuantity: p.quantity,
        submittedQuantity: p.quantity,
        productOptions: p.productOptions ?? [],
        status: 'UNKNOWN',
        detailedResult: {
          menuSelection: false,
          sizeSelection: false,
          quantitySelection: false,
        },
        correct: false,
      })),
      testSummary: {
        testTitle: `테스트 #${body.testId}`,
        correctAnswer: '서버 응답 없음',
        submittedAnswer: body.submittedProducts
          .map((p) => `${p.productName} ${p.quantity}개`)
          .join(' + '),
      },
      correct: false,
    };
  }
}

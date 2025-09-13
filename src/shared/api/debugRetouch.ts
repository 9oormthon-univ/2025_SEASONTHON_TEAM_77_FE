// debugRetouch.ts (어디든 공용 util 파일 하나 만들어서)
import type { RetouchTestProduct, SubmittedProduct } from '../api/retouch';

export function printTestAndCartDebug(testId: number | null, expectedProducts: RetouchTestProduct[], submitted: SubmittedProduct[]) {
  // 1) testId, submittedProducts 전체 프린트
  console.groupCollapsed('[SUBMIT DEBUG] testId, submittedProducts');
  console.log('testId:', testId);
  console.table(submitted.map(s => ({
    productId: (s as any).productId ?? '(none)',
    productName: s.productName,
    quantity: s.quantity,
    options: JSON.stringify(s.productOptions),
  })));
  console.groupEnd();

  // 2) expectedProducts 키 테이블
  console.groupCollapsed('[SUBMIT DEBUG] expectedProducts (정답목록)');
  console.table(expectedProducts.map(p => ({
    id: p.id,
    productName: p.productName,
    quantity: p.quantity,
    options: JSON.stringify(p.productOptions ?? []),
  })));
  console.groupEnd();

  // 3) 제출 항목이 정답목록과 id로 매칭되는지
  const byId = new Map(expectedProducts.map(p => [p.id, p]));
  const byName = new Map(expectedProducts.map(p => [p.productName, p]));

  console.groupCollapsed('[SUBMIT DEBUG] match check');
  submitted.forEach(s => {
    const matchedById = (s as any).productId ? byId.get((s as any).productId) : undefined;
    const matchedByName = byName.get(s.productName);
    console.log({
      submitted: s.productName,
      productId: (s as any).productId ?? '(none)',
      matchById: matchedById ? matchedById.productName : '(no)',
      matchByName: matchedByName ? matchedByName.productName : '(no)'
    });
  });
  console.groupEnd();
}

export function assertSubmitPayload(testId: number | null, expectedProducts: RetouchTestProduct[], submitted: SubmittedProduct[]) {
  const errors: string[] = [];

  // A) testId 필수 + GET 응답 id와 같아야 함
  if (!testId) errors.push('testId가 비어있음. GET 응답의 data.id를 저장해서 사용해야 함.');

  // B) 각 제출 항목마다 productId가 정답목록의 id인지 확인 (정답에 있는 상품이라면)
  const byName = new Map(expectedProducts.map(p => [p.productName, p]));
  submitted.forEach(s => {
    const exp = byName.get(s.productName);
    if (exp) {
      const pid = (s as any).productId;
      if (typeof pid !== 'number' || pid !== exp.id) {
        errors.push(`"${s.productName}" 의 productId가 정답 id(${exp.id})와 불일치: 현재 ${pid}`);
      }
    }
    // C) 옵션 키/값 검사
    const names = s.productOptions.map(o => o.optionName);
    if (!names.includes('온도')) errors.push(`"${s.productName}" 에 '온도' 옵션 누락`);
    if (!names.includes('사이즈')) errors.push(`"${s.productName}" 에 '사이즈' 옵션 누락`);
    const dup = findDup(names);
    if (dup.length) errors.push(`"${s.productName}" 옵션 중복: ${dup.join(', ')}`);
  });

  if (errors.length) {
    console.error('[SUBMIT ASSERT FAIL]', errors);
    throw new Error(errors.join('\n'));
  } else {
    console.log('[SUBMIT ASSERT OK] 페이로드 기본 검증 통과');
  }
}

function findDup(arr: string[]) {
  const seen = new Set<string>();
  const dup: string[] = [];
  arr.forEach(x => { if (seen.has(x)) dup.push(x); else seen.add(x); });
  return dup;
}

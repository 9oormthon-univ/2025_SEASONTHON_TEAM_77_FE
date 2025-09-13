import { itemsByCategory } from '../kiosk/learn-menu/KioskItems';
import type { ProductResult } from '../../shared/api/retouch';
import type { KioskItem } from '../kiosk/learn-menu/KioskFrame';

export function evalFlags(p?: ProductResult) {
  if (!p) return { menuOk: false, sizeOk: false, qtyOk: false };

  const s = (p.status || '').trim();
  switch (s) {
    case '정답':         return { menuOk: true,  sizeOk: true,  qtyOk: true  };
    case '옵션 틀림':     return { menuOk: true,  sizeOk: false, qtyOk: true  };
    case '수량 틀림':     return { menuOk: true,  sizeOk: true,  qtyOk: false };
    case '추가 상품':     return { menuOk: false, sizeOk: false, qtyOk: false };
    case '목록에서 빠짐': return { menuOk: false, sizeOk: false, qtyOk: false };
    default:
      return {
        menuOk: !!p.correct,
        sizeOk: !!p.correct,
        qtyOk: (p.submittedQuantity ?? NaN) === (p.correctQuantity ?? NaN),
      };
  }
}

export function fmtDuration(sec: number | undefined) {
  if (!sec && sec !== 0) return '-';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}분 ${s.toString().padStart(2, '0')}초`;
}

export function money(n: number) {
  return `${n.toLocaleString()}원`;
}

/** 이름으로 키오스크 아이템 찾기(“아이스 ” 접두어 무시) */
export function findKioskItemByName(name: string): KioskItem | null {
  const normalized = name.replace(/^아이스\s*/, '');
  const coffee = (itemsByCategory?.커피 ?? []).find(i => i.name.replace(/^아이스\s*/, '') === normalized);
  if (coffee) return coffee as KioskItem;
  const drink = (itemsByCategory?.음료 ?? []).find(i => i.name.replace(/^아이스\s*/, '') === normalized);
  if (drink) return drink as KioskItem;
  for (const arr of Object.values(itemsByCategory ?? {})) {
    const list = Array.isArray(arr) ? arr : [];
    const f = list.find(i => i.name.replace(/^아이스\s*/, '') === normalized);
    if (f) return f as KioskItem;
  }
  return null;
}

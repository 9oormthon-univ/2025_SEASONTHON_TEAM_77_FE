export interface FlowStep {
  id: string;                    // 고유 식별자 (예: g1-kiosk-01)
  type: 'explain' | 'kiosk';
  title?: string;
  description?: string;
  group?: number;                // 아아=1, 아이스티=2, 초코쿠키=3
}

export const LearnMenuFlow: FlowStep[] = [
  // ── 아아 (group 1)
  { id: 'g1-kiosk-01',   type: 'kiosk',  group: 1 },
  { id: 'g1-explain-02', type: 'explain', group: 1, title: '아이스아메리카노', description: '아메리카노는 커피 카테고리에 있고, 주문을 위해 아이스아메리카노를 선택할게요.' },
  { id: 'g1-kiosk-03',   type: 'kiosk',  group: 1 },
  { id: 'g1-explain-04', type: 'explain', group: 1, title: '아이스아메리카노', description: '메뉴를 누르면 보이는 것과 같이 상세 옵션을 선택할 수 있는 창이 떠요.' },
  { id: 'g1-explain-05', type: 'explain', group: 1, title: '아이스아메리카노', description: '아이스아메리카노를 주문해야 하니까 iced(아이스)를 눌러볼게요.' },
  { id: 'g1-kiosk-06',   type: 'kiosk',  group: 1 },
  { id: 'g1-explain-07', type: 'explain', group: 1, title: '아이스아메리카노', description: 'S는 작은 사이즈, M은 중간 사이즈, 그리고 L은 가장 큰 사이즈예요. 이 중에서 작은 사이즈인 S를 선택할게요.' },
  { id: 'g1-kiosk-08',   type: 'kiosk',  group: 1 },
  { id: 'g1-explain-09', type: 'explain', group: 1, title: '아이스아메리카노', description: '마지막으로 주문할 수량까지 확인해준 다음에 선택 완료 버튼을 눌러줄게요.' },
  { id: 'g1-explain-10', type: 'explain', group: 1, title: '아이스아메리카노', description: '아이스아메리카노 1개가 주문 목록에 잘 추가되었네요! 이제 다음 메뉴를 담아볼까요?' },
  { id: 'g1-kiosk-11',   type: 'kiosk',  group: 1 },

  // ── 아이스티 (group 2)
  { id: 'g2-explain-01', type: 'explain', group: 2, title: '아이스티', description: '아이스티는 커피가 아니기 때문에 음료 카테고리에 들어있겠죠? 음료 카테고리를 눌러줄게요.' },
  { id: 'g2-explain-02', type: 'explain', group: 2, title: '아이스티', description: '음료 중에서 아이스티를 찾아서 눌러볼게요.' },
  { id: 'g2-kiosk-03',   type: 'kiosk',  group: 2 },
  { id: 'g2-explain-04', type: 'explain', group: 2, title: '아이스티', description: '이번에도 작은 사이즈 S와 수량을 확인하고 선택완료 버튼을 눌러볼게요.' },
  { id: 'g2-explain-05', type: 'explain', group: 2, title: '아이스티', description: '지금까지 주문한 아이스아메리카노와 아이스티 총 2잔이 잘 담겼는지 확인해주세요.' },
  { id: 'g2-kiosk-06',   type: 'kiosk',  group: 2 },

  // ── 초코쿠키 (group 3)
  { id: 'g3-explain-01', type: 'explain', group: 3, title: '초코쿠키', description: '마지막으로 초코쿠키를 주문하기 위해 디저트 카테고리를 눌러줄게요.' },
  { id: 'g3-explain-02', type: 'explain', group: 3, title: '초코쿠키', description: '어? 초코쿠키가 안 보이네요. 우측에 있는 스크롤바를 아래로 내려볼까요?' },
  { id: 'g3-explain-03', type: 'explain', group: 3, title: '초코쿠키', description: '초코쿠키가 여기 있었네요. 이제 초코쿠키를 눌러 주문해볼까요?' },
  { id: 'g3-kiosk-04',   type: 'kiosk',  group: 3 },
  { id: 'g3-explain-05', type: 'explain', group: 3, title: '초코쿠키', description: '주문해야 할 모든 메뉴 선택을 완료했어요. 마지막으로 수량과 합계를 확인해줄게요.' },
  { id: 'g3-kiosk-06',   type: 'kiosk',  group: 3 },
];

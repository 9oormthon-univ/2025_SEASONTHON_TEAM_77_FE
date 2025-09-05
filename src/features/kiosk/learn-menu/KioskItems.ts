import { type Category, type KioskItem } from './KioskFrame';

export const itemsByCategory: Record<Category, KioskItem[]> = {
  커피: [
    { name: '아이스 아메리카노', imageUrl: '/src/assets/menu/ice_americano.png', price: 3600 },
    { name: '카페라떼', imageUrl: '/src/assets/menu/caffe_latte.png', price: 4200 },
    { name: '말차카페라떼', imageUrl: '/src/assets/menu/matcha_caffelatte.png', price: 5200 },
    { name: '레몬아메리카노', imageUrl: '/src/assets/menu/lemon_americano.png', price: 4800 },
  ],
  음료: [
    { name: '복숭아 아이스티', imageUrl: '/src/assets/menu/peach_ice_tea.png', price: 3600 },
    { name: '라임에이드', imageUrl: '/src/assets/menu/lime_ade.png', price: 4000 },
    { name: '블루레몬에이드', imageUrl: '/src/assets/menu/blue_milk_ade.png', price: 5200 },
    { name: '피치레몬에이드', imageUrl: '/src/assets/menu/peach_lemonade.png', price: 4800 },
  ],
  디저트: [
    { name: '파운드 케이크', imageUrl: '/src/assets/menu/pound_cake.png', price: 3600 },
    { name: '메론 케이크', imageUrl: '/src/assets/menu/melon_cake.png', price: 4200 },
    { name: '머핀', imageUrl: '/src/assets/menu/muffin.png', price: 3600 },
    { name: '브라우니', imageUrl: '/src/assets/menu/brownie.png', price: 3800 },
  ],
  푸드: [], // 현재 학습 플로우에서는 사용 안 함
};

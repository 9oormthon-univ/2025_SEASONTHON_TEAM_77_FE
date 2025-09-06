import { type Category, type KioskItem } from './KioskFrame';

export const itemsByCategory: Record<Category, KioskItem[]> = {
  커피: [
    { productId: 1, name: '아이스 아메리카노', imageUrl: '/src/assets/menu/ice_americano.png', price: 3600 },
    { productId: 2, name: '카페라떼', imageUrl: '/src/assets/menu/caffe_latte.png', price: 4200 },
    { productId: 3, name: '말차카페라떼', imageUrl: '/src/assets/menu/matcha_caffelatte.png', price: 5200 },
    { productId: 4, name: '레몬아메리카노', imageUrl: '/src/assets/menu/lemon_americano.png', price: 4800 },
  ],
  음료: [
    { productId: 5, name: '복숭아 아이스티', imageUrl: '/src/assets/menu/peach_ice_tea.png', price: 3600 },
    { productId: 6, name: '라임에이드', imageUrl: '/src/assets/menu/lime_ade.png', price: 4000 },
    { productId: 7, name: '블루레몬에이드', imageUrl: '/src/assets/menu/blue_milk_ade.png', price: 5200 },
    { productId: 8, name: '피치레몬에이드', imageUrl: '/src/assets/menu/peach_lemonade.png', price: 4800 },
  ],
  디저트: [
    { productId: 9, name: '파운드 케이크', imageUrl: '/src/assets/menu/pound_cake.png', price: 3600 },
    { productId: 10, name: '메론 케이크', imageUrl: '/src/assets/menu/melon_cake.png', price: 4200 },
    { productId: 11, name: '머핀', imageUrl: '/src/assets/menu/muffin.png', price: 3600 },
    { productId: 12, name: '브라우니', imageUrl: '/src/assets/menu/brownie.png', price: 3800 },
    { productId: 13, name: '화이트 쿠키', imageUrl: '/src/assets/menu/white_cookie.png', price: 4200 },
    { productId: 14, name: '초코 쿠키', imageUrl: '/src/assets/menu/choco_cookie.png', price: 4200 },
  ],
  푸드: [], // 현재 학습 플로우에서는 사용 안 함
};

export interface StepData {
    title: string;
    description: string;
  }
  
  export const structureSteps: StepData[] = [
    {
      title: '키오스크 화면',
      description: '이 화면에서, 어떤 메뉴가 있는지 확인하고 자신의 원하는 메뉴를 담을 수 있습니다.',
    },
    {
      title: '카드 리더기',
      description: '모든 메뉴를 선택 한 뒤 결제를 해야 할 때 카드를 꽂아 결제하는 부분이에요.',
    },
    {
      title: '카드 리더기',
      description: '카드에서 딸깍 소리가 날 때까지 안쪽으로 잘 밀어 넣어주세요!',
    },
    {
      title: '바코드 인식기',
      description: '쿠폰으로 결제를 원할 때 핸드폰에 뜨는 바코드(쿠폰) 화면을 이곳에 갖다댑니다.',
    },
    {
      title: '영수증 출력기',
      description: '영수증이나 주문 번호를 받을 때 이 곳에서 용지가 나옵니다! 챙겨서 자신의 주문번호를 확인해주세요!',
    },
  ];
export interface StepData {
    title: string;
    substeps: {
        description: string;
    }[];
  }
  
export const paymentSteps = [
  {
    title: "1. 포인트 적립",
    substeps: [
      {
        description: "이 매장을 자주 오신다면, 휴대폰 번호 적립을 해보세요!",
      },
      {
        description: "적립을 원하지 않는다면, 건너뛰기로 바로 결제 단계로 이동해봅시다!",
      },
    ],
  },
  {
    title: "2. 결제 수단 선택",
    substeps: [
      {
        description: "이번 단계는 어떤 방식으로 결제를 할지를 선택하는 단계입니다. 원하는 결제 방식을 선택해 주세요!",
      },
      {
        description: "실물 카드나 휴대폰 삼성 페이로 결제를 할 경우 신용카드 버튼을 눌러주세요.",
      },
      {
        description: "누군가에게 선물받은 코드로 결제를 하고 싶다면 기프티콘 버튼을 눌러주세요.",
      },
      {
        description: "휴대폰에 다운로드 되어있는 어플로 결제를 원하신다면 맞는 모바일 페이 버튼을 눌러주세요.",
      },
    ],
  },
  {
    title: "3. 신용카드 결제",
    substeps: [
      {
        description: "이번에는 신용카드로 결제를 진행할게요. 카드 단말기에 카드를 화면에 보이는 방향과 일치하게 넣어주세요.",
      },
    ],
  },
  {
    title: "4. 영수증 출력 선택",
    substeps: [
      {
        description: "영수증 출력을 원하신다면 예 버튼을 눌러주세요.",
      },
    ],
  },
  {
    title: "5. 결제 완료",
    substeps: [
      {
        description: "자! 이제 모든 주문 단계가 마무리되었어요. 화면에 자신의 종이에 적힌 주문번호가 뜨면 음식을 받으러 가면 돼요.",
      },
    ],
  }
];
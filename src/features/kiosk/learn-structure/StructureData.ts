export interface StepData {
    title: string;
    description: string;
  }
  
  export const structureSteps: StepData[] = [
    {
      title: '주문 시작',
      description: '첫 화면은 메인 화면으로 어디든지 눌러도 메뉴 선택 화면으로 이동할 수 있어요.',
    },
    {
      title: '장소 선택',
      description: '매장에서 먹고 간다면, 매장 버튼을 누르고 포장하고 싶다면 포장 버튼을 눌러주세요.',
    },
  ];
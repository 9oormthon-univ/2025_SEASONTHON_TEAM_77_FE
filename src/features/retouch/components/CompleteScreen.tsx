import { useNavigate } from 'react-router-dom';

export default function CompleteScreen() {
  const navigate = useNavigate();
  return (
    <div
      className="absolute inset-0 flex flex-col w-full h-screen items-center justify-center z-20"
      style={{ background: 'linear-gradient(180deg, #FFEFC8 0%, #F3F3F3 100%)' }}
    >
      <div
        className="w-[240px] h-[240px] mt-28"
        style={{
          backgroundImage: 'url(/src/assets/character/5.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <h3 className="text-xl mb-6 text-center text-black font-semibold leading-[140%]">
        리터치 학습이 마무리되었어요
      </h3>
      <p className="text-base mb-20 text-center text-black font-medium leading-[160%]">
        다시 풀기 버튼을 누르면,<br />
        문제를 다시 풀어볼 수 있어요
      </p>
      <div className="flex items-center justify-center mt-20 gap-2">
        <button onClick={() => navigate('/teachmap')} className="w-[159px] h-[52px] py-4 bg-[#F6F6F6] border border-[#FFC845] text-black rounded-full hover:scale-105 transition-all duration-300">
          다시 풀기
        </button>
        <button onClick={() => navigate('/')} className="w-[159px] h-[52px] py-4 bg-[#FFC845] text-black rounded-full hover:scale-105 transition-all duration-300">
          나가기
        </button>
      </div>
    </div>
  );
}

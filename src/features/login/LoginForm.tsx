import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../../shared/api';

const LoginForm: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [pwVisible, setPwVisible] = useState(false);
  const navigate = useNavigate();

  // 스플래시 0.5초 후 로그인 폼 표시
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async () => {
    if (!loginId.trim() || !password.trim()) {
      toast.error('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const data = await authAPI.login(loginId, password);
      const { accessToken, refreshToken } = data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('loginId', loginId);

      const savedUsername = localStorage.getItem(`username_${loginId}`);
      if (savedUsername) {
        localStorage.setItem('currentUsername', savedUsername);
      }

      // 로그인 성공 후 메인 페이지로 이동
      toast.success('로그인에 성공했습니다.');
      navigate('/');
    } catch (error) {
      toast.error(
        <div>
          로그인에 실패했습니다.
          <br />
          아이디와 비밀번호를 확인해주세요.
        </div>
      );
    }
  };

  const togglePasswordVisibility = () => {
    setPwVisible(!pwVisible);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#FFC845]">
      {!showForm ? (
        <img src="/assets/logo.png" alt="logo" className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[192px] h-[23px]" />
      ) : (
        <div className="w-full h-screen flex flex-col items-center justify-center px-6 bg-white pb-20">
          <img src="/assets/logo.png" alt="logo" className="w-[192px] h-[23px] mb-[74px]" />
          <label 
            className="w-full block text-base font-normal text-gray-700 text-left mb-2"
            style={{
              fontFamily: 'Pretendard',
            }}
          >이메일</label>
          <input
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            className="w-full px-4 py-3 border rounded-full bg-white placeholder-gray-400 mb-6 border-[#C1C1C1] focus:border-2 focus:border-[#FFC845] focus:outline-none"
            placeholder="teachtouch@gmail.com"
          />

          <label 
            className="w-full block text-base font-normal text-gray-700 text-left mb-2"
            style={{
              fontFamily: 'Pretendard',
            }}
          >비밀번호</label>
          <div className="w-full flex relative">
            <input
              type={pwVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-full bg-white mb-6 border-[#C1C1C1] focus:border-2 focus:border-[#FFC845] focus:outline-none"
            />
            <button 
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-4 w-[20px] h-[20px]"
            >
              {pwVisible ? <img src='/assets/eyeslash.svg' alt="eye-off" /> : <img src='/assets/eye.svg' alt="eye" />}
            </button>
          </div>
          <button
            onClick={() => handleLogin()}
            className="w-full py-3 px-4 bg-[#FFC845] text-black text-base font-normal rounded-full mb-6"
            style={{
              fontFamily: 'Pretendard',
            }}
          >
            로그인
          </button>

          <p 
            className="text-center text-sm text-black font-light mb-20"
            style={{
              fontFamily: 'Pretendard',
            }}
          >
            티처터치가 처음이신가요?{' '}
            <span
              onClick={() => navigate('/signup')}
              className="text-[#E6B43E] text-sm font-light cursor-pointer"
              style={{
                fontFamily: 'Pretendard',
              }}
            >
              회원가입
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
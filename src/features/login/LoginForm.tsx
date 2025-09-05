import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // 스플래시 0.5초 후 로그인 폼 표시
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://3.36.238.38:8080/api/v1.0/user/login', {
        loginId,
        password,
      });

      const { accessToken, refreshToken } = response.data;

      // 예시: 토큰 저장 (필요에 따라 localStorage, 쿠키 등으로)
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('loginId', loginId);

      // 로그인 성공 후 메인 페이지 등으로 이동
      navigate('/');
    } catch (error) {
      alert('로그인 실패! 아이디 또는 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#FFC845]">
      {!showForm ? (
        <div className="text-center">
          <h1 className="text-5xl font-bold text-red-600 mb-4">WIP</h1>
        </div>
      ) : (
        <div className="w-full h-screen flex flex-col items-center justify-center px-6 bg-white">
          <h2 className="text-4xl font-bold text-center mb-8">로고 이미지</h2>
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
            className="w-full px-4 py-3 border rounded-full bg-white placeholder-gray-400 mb-6 border border-[#C1C1C1] focus:border-2 focus:border-[#FFC845] focus:outline-none"
            placeholder="teachtouch@gmail.com"
          />

          <label 
            className="w-full block text-base font-normal text-gray-700 text-left mb-2"
            style={{
              fontFamily: 'Pretendard',
            }}
          >비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-full bg-white mb-6 border border-[#C1C1C1] focus:border-2 focus:border-[#FFC845] focus:outline-none"
          />

          <button
            onClick={() => handleLogin()}
            className="w-full py-3 px-4 bg-[#FFC845] text-black text-base font-semibold rounded-full mb-8"
            style={{
              fontFamily: 'Pretendard',
            }}
          >
            로그인
          </button>

          <p 
            className="text-center text-sm text-black"
            style={{
              fontFamily: 'Pretendard',
            }}
          >
            티처터치가 처음이신가요?{' '}
            <span
              onClick={() => navigate('/signup')}
              className="text-[#E6B43E] text-sm font-semibold cursor-pointer"
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
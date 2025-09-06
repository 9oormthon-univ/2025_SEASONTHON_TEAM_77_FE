import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../shared/api';
import { motion, AnimatePresence } from 'framer-motion';
import HeaderBar from '../../components/HeaderBar';

const SignupForm = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [checkResult, setCheckResult] = useState<'valid' | 'duplicated' | null>(null);
  const [username, setUsername] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  const passwordValid = {
    hasEng: /[a-zA-Z]/.test(password),
    hasNum: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    length: password.length >= 8 && password.length <= 20,
  };

  const isPasswordValid =
    passwordValid.hasEng && passwordValid.hasNum && passwordValid.hasSpecial && passwordValid.length;

  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // 숫자만 남기기
    if (value.length > 8) value = value.slice(0, 8); // 최대 8자리까지만 허용

    if (value.length >= 5) {
      value = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
    } else if (value.length >= 3) {
      value = `${value.slice(0, 4)}-${value.slice(4, 6)}`;
    }
    setBirthdate(value);
  };

  const handleCheckId = async () => {
    try {
      const data = await authAPI.checkId(loginId);
      if (data === false) {
        setCheckResult('valid');
        setStep(2);
      } else {
        setCheckResult('duplicated');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignup = async () => {
    try {
      await authAPI.signup({
        loginId,
        password,
        username,
        gender,
        birthdate,
      });
      localStorage.setItem(`username_${loginId}`, username);
      setSignupSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      alert('회원가입 실패');
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <HeaderBar title="티치맵" backTo="/login" />
      <div className="w-full h-screen flex flex-col items-center justify-start pt-[67px] px-6 bg-white">
        {step === 1 && (
          <>
            <label 
              className="w-full block text-base font-normal text-gray-700 text-left mb-2"
              style={{
                fontFamily: 'Pretendard',
              }}
            >이메일</label>
            <input
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full px-4 py-3 border rounded-full bg-white placeholder-gray-400 mb-6 border border-[#C1C1C1] focus:border-2 focus:border-[#FFC845] focus:outline-none"
              placeholder="이메일을 입력해주세요"
            />
            {checkResult === 'duplicated' && (
              <p className="text-[#FF0000] text-sm">이미 존재하는 이메일입니다.</p>
            )}
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
              className="w-full px-4 py-3 border rounded-full bg-white placeholder-gray-400 mb-2 border border-[#C1C1C1] focus:border-2 focus:border-[#FFC845] focus:outline-none"
              placeholder="비밀번호를 입력해주세요"
            />
            <ul className="text-sm flex flex-row gap-2 text-start w-full">
              <li className={passwordValid.hasEng ? 'text-[#0073CB]' : 'text-[#575757]'}>✓ 영문</li>
              <li className={passwordValid.hasNum ? 'text-[#0073CB]' : 'text-[#575757]'}>✓ 숫자</li>
              <li className={passwordValid.hasSpecial ? 'text-[#0073CB]' : 'text-[#575757]'}>✓ 특수문자</li>
              <li className={passwordValid.length ? 'text-[#0073CB]' : 'text-[#575757]'}>✓ 8~20자</li>
            </ul>
            <button
              disabled={!loginId || !isPasswordValid}
              onClick={handleCheckId}
              className="absolute bottom-20 w-[327px] py-3 px-4 bg-[#FFC845] text-black text-base font-semibold rounded-full"
              style={{
                fontFamily: 'Pretendard',
              }}
            >
              다음
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label 
              className="w-full block text-base font-normal text-gray-700 text-left mb-2"
              style={{
                fontFamily: 'Pretendard',
              }}
            >이름</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="이름을 입력해주세요"
              className="w-full px-4 py-3 border rounded-full bg-white placeholder-gray-400 mb-6 border border-[#C1C1C1] focus:border-2 focus:border-[#FFC845] focus:outline-none"
            />
            <label 
              className="w-full block text-base font-normal text-gray-700 text-left mb-2"
              style={{
                fontFamily: 'Pretendard',
              }}
            >생년월일</label>
            <input
              type="text"
              inputMode="numeric"
              value={birthdate}
              onChange={handleBirthdateChange}
              placeholder="1999-01-01"
              className="w-full px-4 py-3 border rounded-full bg-white placeholder-gray-400 mb-6 border border-[#C1C1C1] focus:border-2 focus:border-[#FFC845] focus:outline-none"
            />
            <label 
              className="w-full block text-base font-normal text-gray-700 text-left mb-2"
              style={{
                fontFamily: 'Pretendard',
              }}
            >성별</label>
            <div className="flex gap-2">
              <button
                onClick={() => setGender('male')}
                className={`flex-1 py-3 px-4 w-[158px] rounded-full border ${
                  gender === 'male' ? 'bg-[##FFFAEC] text-[#FFC845] border-2 border-[#FFC845]' : 'border-gray-300 bg-white'
                }`}
              >
                남자
              </button>
              <button
                onClick={() => setGender('female')}
                className={`flex-1 py-3 px-4 w-[158px] rounded-full border ${
                  gender === 'female' ? 'bg-[##FFFAEC] text-[#FFC845] border-2 border-[#FFC845]' : 'border-gray-300 bg-white'
                }`}
              >
                여자
              </button>
            </div>
            <button
              disabled={!username || !birthdate || !gender}
              onClick={handleSignup}
              className="absolute bottom-20 w-[327px] py-3 px-4 bg-[#FFC845] text-black text-base font-semibold rounded-full"
              style={{
                fontFamily: 'Pretendard',
              }}
            >
              다음
            </button>
          </>
        )}

        <AnimatePresence>
          {signupSuccess && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center bg-white text-black z-50"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl font-bold text-red-600 mb-20">WIP</h1>
              <p className="text-xl font-normal mb-8">회원가입이 완료되었습니다!</p>
              <p className="text-base font-light">새로운 시작, 티처터치와 함께하세요.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignupForm;
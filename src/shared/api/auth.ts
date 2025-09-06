import axios from 'axios';

const API_BASE_URL = 'http://3.36.238.38:8080/api/v1.0';

export const authAPI = {
  // 로그인 API
  login: async (loginId: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/user/login`, {
      loginId,
      password,
    });
    return response.data;
  },

  // 로그아웃 API
  logout: async () => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.post(
      `${API_BASE_URL}/user/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': "application/json",
        },
      }
    );
    return response.data;
  },

  // 회원가입 API
  signup: async (userData: {
    loginId: string;
    password: string;
    username: string;
    gender: string;
    birthdate: string;
  }) => {
    const response = await axios.post(`${API_BASE_URL}/user/signup`, userData);
    return response.data;
  },

  // ID 중복 확인 API
  checkId: async (loginId: string) => {
    const response = await axios.get(`${API_BASE_URL}/user/check-id?loginId=${loginId}`);
    return response.data;
  },
};

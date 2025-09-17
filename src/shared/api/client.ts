import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://3.36.238.38:8080/api/v1.0';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 토큰 만료 시 refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const plainAxios = axios.create();
          const { data } = await plainAxios.post(`${API_BASE_URL}/user/reissue`, {
            refreshToken,
          });

          const { accessToken } = data;
          localStorage.setItem('accessToken', accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } catch (reissueError) {
          console.error('토큰 재발급 실패:', reissueError);
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(reissueError);
        }
      } else {
        toast.error('로그인이 필요합니다.');
        window.location.href = '/login';
      }
    }

    if (error.code === 'ECONNABORTED') {
      toast.error('요청 시간이 초과되었습니다.');
    } else if (error.response?.status === 500) {
      toast.error('서버 오류가 발생했습니다.');
    } else if (!error.response) {
      toast.error('네트워크 연결을 확인해주세요.');
    }

    return Promise.reject(error);
  },
);
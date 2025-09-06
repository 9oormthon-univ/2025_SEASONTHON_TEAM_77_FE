import axios from 'axios';

const API_BASE_URL = 'http://3.36.238.38:8080/api/v1.0';

export const kioskAPI = {
  // 학습 진도 조회 API
  getProgress: async (guideId: string) => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.get(`${API_BASE_URL}/guides/${guideId}/steps/progress`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // 가이드 검색 API
  search: async (keyword: string) => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.get(
      `${API_BASE_URL}/guides/search?keyword=${encodeURIComponent(keyword)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  // 학습 완료 API
  completeStep: async (guideId: string) => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.post(
      `${API_BASE_URL}/guides/${guideId}/complete`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },
};
